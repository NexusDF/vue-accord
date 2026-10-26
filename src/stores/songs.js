import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { practiceSongs } from '@/data/practiceSongs'
import { useCatalogStore } from '@/stores/catalog'
import { extractChordsFromText, hasChordSheetStructure } from '@/utils/chords'
import { slugify } from '@/utils/slug'

const LOCAL_STORAGE_KEY = 'vue-accord:local-songs:v1'

/** Default true; set VITE_INCLUDE_SEEDS=false for public Pages builds (see LEGAL.md). */
const INCLUDE_SEEDS = import.meta.env.VITE_INCLUDE_SEEDS !== 'false'

/** @type {import('@/stores/songs').Song[]} */
const seedSongs = INCLUDE_SEEDS
  ? (await import('@/data/seedSongs')).seedSongs
  : []

/**
 * @typedef {Object} Song
 * @property {string} id
 * @property {string} title
 * @property {string} artist
 * @property {string} artistSlug
 * @property {string} songSlug
 * @property {string} key
 * @property {string} strumPattern
 * @property {string} chords
 * @property {string} tabs
 * @property {string} notes
 * @property {number} updatedAt
 * @property {'local' | 'songsterr' | 'lrclib'} [source]
 * @property {number} [externalId]
 * @property {number} [songsterrId]
 * @property {number} [lrclibId]
 * @property {boolean} [hasChords]
 */

/** @param {Partial<Song> & Pick<Song, 'title'>} song */
export function normalizeSong(song) {
  const artist = song.artist?.trim() || 'Без исполнителя'
  const title = song.title?.trim() || 'Без названия'
  const chords = song.chords ?? ''
  const chordTokens = chords.trim() ? extractChordsFromText(chords) : []
  return {
    id: song.id ?? crypto.randomUUID(),
    title,
    artist,
    artistSlug: song.artistSlug || slugify(artist) || 'artist',
    songSlug: song.songSlug || slugify(title) || 'song',
    key: song.key ?? '',
    strumPattern: song.strumPattern ?? '',
    chords,
    tabs: song.tabs ?? '',
    notes: song.notes ?? '',
    updatedAt: song.updatedAt ?? Date.now(),
    source: song.source ?? 'local',
    externalId: song.externalId,
    songsterrId: song.songsterrId,
    lrclibId: song.lrclibId,
    hasChords: song.hasChords ?? chordTokens.length > 0,
  }
}

/** @param {Song[]} existing */
function mergeWithSeeds(existing) {
  const byId = new Map(existing.map((song) => [song.id, song]))
  for (const practice of practiceSongs) {
    byId.set(
      practice.id,
      normalizeSong({
        ...practice,
        source: 'local',
        hasChords: true,
      }),
    )
  }

  if (!INCLUDE_SEEDS) {
    for (const id of [...byId.keys()]) {
      if (String(id).startsWith('seed-')) {
        byId.delete(id)
      }
    }
    return [...byId.values()]
  }
  for (const seed of seedSongs) {
    const normalized = normalizeSong({
      ...seed,
      source: 'local',
      hasChords: true,
    })
    // Seed catalog is source of truth for seed-* ids (keeps sheets up to date).
    byId.set(seed.id, normalized)
  }
  return [...byId.values()]
}

function loadLocalSongs() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw).map((song) =>
        normalizeSong({ ...song, source: 'local' }),
      )
      return mergeWithSeeds(parsed)
    }
  } catch {
    /* ignore */
  }
  return mergeWithSeeds([])
}

function persistLocalSongs(songs) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(songs))
}

/** True when song has a local chord-over-lyrics sheet. */
export function hasPlayableSheet(song) {
  return hasChordSheetStructure(song?.chords)
}

export const useSongsStore = defineStore('songs', () => {
  const catalog = useCatalogStore()
  const localSongs = ref(loadLocalSongs())
  persistLocalSongs(localSongs.value)

  const songs = computed(() => [...localSongs.value, ...catalog.allSongs])

  const playableLocalSongs = computed(() =>
    localSongs.value
      .filter((song) => hasPlayableSheet(song))
      .sort((a, b) => a.title.localeCompare(b.title, 'ru')),
  )

  const sortedSongs = computed(() =>
    [...songs.value].sort((a, b) => {
      const aPlayable = hasPlayableSheet(a) ? 0 : 1
      const bPlayable = hasPlayableSheet(b) ? 0 : 1
      if (aPlayable !== bPlayable) {
        return aPlayable - bPlayable
      }
      return a.title.localeCompare(b.title, 'ru')
    }),
  )

  const artists = computed(() => {
    const fromApi = catalog.artists.map((artist) => ({
      slug: artist.slug,
      name: artist.name,
      songs: [...(catalog.songsByArtist[artist.slug] ?? [])].sort((a, b) =>
        a.title.localeCompare(b.title, 'ru'),
      ),
    }))

    for (const song of localSongs.value) {
      let artist = fromApi.find((item) => item.slug === song.artistSlug)
      if (!artist) {
        artist = { slug: song.artistSlug, name: song.artist, songs: [] }
        fromApi.push(artist)
      }
      if (!artist.songs.some((item) => item.id === song.id)) {
        artist.songs.unshift(song)
      }
    }

    return fromApi.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  })

  function getById(id) {
    return songs.value.find((song) => song.id === id)
  }

  function getBySlug(artistSlug, songId, songSlug) {
    const id = Number(songId)
    if (!id) {
      return songs.value.find(
        (song) =>
          song.source === 'local' &&
          song.artistSlug === artistSlug &&
          song.songSlug === songSlug,
      )
    }
    return songs.value.find(
      (song) =>
        song.artistSlug === artistSlug &&
        song.songSlug === songSlug &&
        (song.songsterrId === id ||
          song.lrclibId === id ||
          song.id === `st-${id}` ||
          song.id === `lrclib-${id}`),
    )
  }

  function getArtist(slug) {
    return artists.value.find((artist) => artist.slug === slug)
  }

  /** @param {Omit<Song, 'id' | 'updatedAt' | 'artistSlug' | 'songSlug' | 'source'> & { artistSlug?: string, songSlug?: string }} data */
  function addSong(data) {
    const song = normalizeSong({
      ...data,
      id: `local-${crypto.randomUUID()}`,
      source: 'local',
      updatedAt: Date.now(),
    })
    localSongs.value.push(song)
    persistLocalSongs(localSongs.value)
    return song
  }

  /** @param {string} id @param {Partial<Omit<Song, 'id'>>} patch */
  function updateSong(id, patch) {
    const index = localSongs.value.findIndex((song) => song.id === id)
    if (index === -1) {
      return null
    }
    localSongs.value[index] = normalizeSong({
      ...localSongs.value[index],
      ...patch,
      id,
      source: 'local',
      updatedAt: Date.now(),
    })
    persistLocalSongs(localSongs.value)
    return localSongs.value[index]
  }

  function deleteSong(id) {
    const song = getById(id)
    if (!song || song.source === 'songsterr' || song.source === 'lrclib') {
      return false
    }
    // Keep catalog seeds — only remove user-created local-* songs
    if (String(id).startsWith('seed-') || String(id).startsWith('practice-')) {
      return false
    }
    localSongs.value = localSongs.value.filter((item) => item.id !== id)
    persistLocalSongs(localSongs.value)
    return true
  }

  function isEditable(song) {
    const id = String(song?.id ?? '')
    return song?.source === 'local' && !id.startsWith('seed-') && !id.startsWith('practice-')
  }

  return {
    songs,
    sortedSongs,
    playableLocalSongs,
    artists,
    localSongs,
    getById,
    getBySlug,
    getArtist,
    addSong,
    updateSong,
    deleteSong,
    isEditable,
  }
})
