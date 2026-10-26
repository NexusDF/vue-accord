<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import SongList from '@/components/SongList.vue'
import { useCatalogStore } from '@/stores/catalog'
import { hasPlayableSheet, useSongsStore } from '@/stores/songs'

const store = useSongsStore()
const catalog = useCatalogStore()
const query = ref('')
const popular = ref([])
const searchResults = ref([])
const searching = ref(false)
const loadingPopular = ref(true)

const showApiResults = computed(() => query.value.trim().length > 0)

function songKey(song) {
  return `${song.artistSlug}::${song.songSlug}`
}

/** Local playable sheets first, then API popular — never only empty shells. */
const homeSongs = computed(() => {
  const local = store.playableLocalSongs
  const seen = new Set(local.map(songKey))
  const api = popular.value.filter((song) => !seen.has(songKey(song)))
  const merged = [...local, ...api]
  if (merged.length) {
    return merged
  }
  return store.sortedSongs.slice(0, 24)
})

watch(query, async (value) => {
  const q = value.trim()
  if (!q) {
    searchResults.value = []
    return
  }
  searching.value = true
  try {
    const localHits = store.sortedSongs.filter((song) => {
      const haystack = `${song.title} ${song.artist} ${song.key}`.toLowerCase()
      return haystack.includes(q.toLowerCase())
    })
    const apiHits = await catalog.search(q)
    const seen = new Set(localHits.map((song) => song.id))
    searchResults.value = [
      ...localHits.filter((song) => hasPlayableSheet(song)),
      ...localHits.filter((song) => !hasPlayableSheet(song)),
      ...apiHits.filter((song) => !seen.has(song.id)),
    ]
  } catch {
    searchResults.value = store.sortedSongs.filter((song) => {
      const haystack = `${song.title} ${song.artist} ${song.key}`.toLowerCase()
      return haystack.includes(q.toLowerCase())
    })
  } finally {
    searching.value = false
  }
})

onMounted(async () => {
  loadingPopular.value = true
  try {
    popular.value = await catalog.loadPopular()
  } catch {
    popular.value = []
  } finally {
    loadingPopular.value = false
  }
})
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-3 text-center">
      <p class="va-kicker">Библиотека разборов</p>
      <h1 class="va-title" style="font-size: clamp(2.75rem, 8vw, 4rem)">Vue Accord</h1>
      <p class="va-meta mx-auto max-w-md">
        Открой песню — аккорды над строками, бой и табы рядом.
      </p>
    </header>

    <label class="block">
      <span class="sr-only">Искать в каталоге</span>
      <input
        v-model="query"
        type="search"
        placeholder="Искать в каталоге…"
        class="va-search"
      />
    </label>

    <section v-if="showApiResults" class="space-y-3">
      <p class="va-kicker">
        Результаты поиска
        <span v-if="searching">…</span>
      </p>
      <SongList :songs="searchResults" empty-text="Ничего не найдено" />
    </section>

    <section v-else class="space-y-3">
      <p class="va-kicker">
        С листа
        <span v-if="loadingPopular" class="font-normal normal-case tracking-normal">
          · подгружаем каталог…
        </span>
      </p>
      <SongList
        :songs="homeSongs"
        empty-text="Пока нет песен — обновите каталог или добавьте свою"
      />
    </section>
  </div>
</template>
