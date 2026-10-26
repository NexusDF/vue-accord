import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { getLyrics, getLyricsById, searchLyrics } from '@/api/lrclib'
import { chordsPageUrl, getSong, searchSongs } from '@/api/songsterr'
import { normalizeSong } from '@/stores/songs'
import { slugify } from '@/utils/slug'

const CACHE_KEY = 'vue-accord:open-api-cache:v1'

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    /* ignore */
  }
  return null
}

function saveCache(payload) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
}

function mapSongsterrRecord(record) {
  return normalizeSong({
    id: `st-${record.songId}`,
    title: record.title,
    artist: record.artist,
    artistSlug: slugify(record.artist),
    songSlug: slugify(record.title),
    songsterrId: record.songId,
    hasChords: Boolean(record.hasChords),
    chords: '',
    tabs: '',
    key: '',
    strumPattern: '',
    notes: record.hasChords ? 'Аккорды на Songsterr' : 'Табы на Songsterr',
    updatedAt: Date.now(),
    source: 'songsterr',
    externalId: record.songId,
  })
}

function mapLrclibRecord(record) {
  return normalizeSong({
    id: `lrclib-${record.id}`,
    title: record.trackName || record.name,
    artist: record.artistName,
    artistSlug: slugify(record.artistName),
    songSlug: slugify(record.trackName || record.name),
    lrclibId: record.id,
    hasChords: false,
    chords: record.plainLyrics || '',
    tabs: '',
    key: '',
    strumPattern: '',
    notes: record.albumName ? `Альбом: ${record.albumName}` : '',
    updatedAt: Date.now(),
    source: 'lrclib',
    externalId: record.id,
  })
}

export const useCatalogStore = defineStore('catalog', () => {
  const artists = ref([])
  const songsByArtist = ref({})
  const loading = ref(false)
  const syncing = ref(false)
  const syncProgress = ref({ done: 0, total: 0 })
  const error = ref('')
  const lastSyncedAt = ref(0)

  const cached = loadCache()
  if (cached) {
    artists.value = cached.artists ?? []
    songsByArtist.value = cached.songsByArtist ?? {}
    lastSyncedAt.value = cached.syncedAt ?? 0
  }

  const allSongs = computed(() => {
    const list = []
    for (const songs of Object.values(songsByArtist.value)) {
      list.push(...songs)
    }
    return list
  })

  function rebuildArtistsIndex() {
    const map = new Map()
    for (const songs of Object.values(songsByArtist.value)) {
      for (const song of songs) {
        const key = song.artistSlug
        if (!map.has(key)) {
          map.set(key, { slug: key, name: song.artist, count: 0 })
        }
        map.get(key).count += 1
      }
    }
    artists.value = [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }

  function persist() {
    saveCache({
      syncedAt: lastSyncedAt.value,
      artists: artists.value,
      songsByArtist: songsByArtist.value,
    })
  }

  function putArtistSongs(artistSlug, songs) {
    songsByArtist.value = { ...songsByArtist.value, [artistSlug]: songs }
    rebuildArtistsIndex()
    persist()
  }

  async function enrichWithLyrics(song) {
    if (song.chords?.trim()) {
      return song
    }
    let lyrics = null
    if (song.lrclibId) {
      lyrics = await getLyricsById(song.lrclibId)
    } else if (song.songsterrId) {
      lyrics = await getLyrics({ artist: song.artist, title: song.title })
    }
    if (!lyrics?.plainLyrics) {
      return song
    }
    return {
      ...song,
      chords: lyrics.plainLyrics,
      lrclibId: lyrics.id,
      notes: [song.notes, 'Текст: LRCLIB'].filter(Boolean).join('\n'),
    }
  }

  async function loadArtists() {
    if (artists.value.length) {
      return artists.value
    }
    await bootstrap()
    return artists.value
  }

  async function loadArtistSongs(artistSlug) {
    if (songsByArtist.value[artistSlug]?.length) {
      return songsByArtist.value[artistSlug]
    }
    loading.value = true
    error.value = ''
    try {
      const artistName =
        artists.value.find((item) => item.slug === artistSlug)?.name ?? artistSlug
      const records = await searchSongs({ pattern: artistName, size: 80 })
      const songs = records.map(mapSongsterrRecord).filter((song) => song.artistSlug === artistSlug)
      putArtistSongs(artistSlug, songs)
      return songs
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadSong(artistSlug, songId, songSlug) {
    const numericId = Number(songId)
    const list = songsByArtist.value[artistSlug] ?? []
    let song = list.find(
      (item) =>
        item.songSlug === songSlug &&
        (item.songsterrId === numericId ||
          item.lrclibId === numericId ||
          item.id === `st-${numericId}` ||
          item.id === `lrclib-${numericId}`),
    )

    if (!song) {
      if (String(songId).startsWith('lrclib') || list.some((s) => s.source === 'lrclib')) {
        const lr = await getLyricsById(numericId)
        if (lr) {
          song = mapLrclibRecord(lr)
        }
      } else {
        const meta = await getSong(numericId)
        song = mapSongsterrRecord(meta)
      }
    }

    if (!song) {
      return null
    }

    song = await enrichWithLyrics(song)
    const next = [...list]
    const index = next.findIndex((item) => item.id === song.id)
    if (index === -1) {
      next.push(song)
    } else {
      next[index] = song
    }
    putArtistSongs(artistSlug, next)
    return song
  }

  async function search(query) {
    const q = query.trim()
    if (!q) {
      return []
    }
    const [stRecords, lrRecords] = await Promise.all([
      searchSongs({ pattern: q, size: 25 }).catch(() => []),
      searchLyrics(q, 15).catch(() => []),
    ])
    const songs = [
      ...stRecords.filter((r) => r.hasChords).map(mapSongsterrRecord),
      ...lrRecords.map(mapLrclibRecord),
    ]
    for (const song of songs) {
      const bucket = songsByArtist.value[song.artistSlug] ?? []
      if (!bucket.some((item) => item.id === song.id)) {
        putArtistSongs(song.artistSlug, [...bucket, song])
      }
    }
    return songs
  }

  async function loadPopular() {
    const records = await searchSongs({ size: 60 })
    const withChords = records.filter((item) => item.hasChords).slice(0, 30)
    const songs = withChords.map(mapSongsterrRecord)
    for (const song of songs) {
      const bucket = songsByArtist.value[song.artistSlug] ?? []
      if (!bucket.some((item) => item.id === song.id)) {
        putArtistSongs(song.artistSlug, [...bucket, song])
      }
    }
    return songs
  }

  async function syncAll() {
    syncing.value = true
    error.value = ''
    syncProgress.value = { done: 0, total: 2 }
    try {
      await loadPopular()
      syncProgress.value = { done: 1, total: 2 }
      const lr = await searchLyrics('rock', 15)
      for (const record of lr.slice(0, 10)) {
        const song = mapLrclibRecord(record)
        const bucket = songsByArtist.value[song.artistSlug] ?? []
        if (!bucket.some((item) => item.id === song.id)) {
          putArtistSongs(song.artistSlug, [...bucket, song])
        }
      }
      syncProgress.value = { done: 2, total: 2 }
      lastSyncedAt.value = Date.now()
      persist()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка синхронизации'
      throw err
    } finally {
      syncing.value = false
    }
  }

  async function bootstrap() {
    if (!allSongs.value.length) {
      await syncAll()
    }
  }

  return {
    artists,
    songsByArtist,
    allSongs,
    loading,
    syncing,
    syncProgress,
    error,
    lastSyncedAt,
    loadArtists,
    loadArtistSongs,
    loadSong,
    loadPopular,
    search,
    syncAll,
    bootstrap,
    chordsPageUrl,
  }
})
