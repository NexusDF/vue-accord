<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import SongList from '@/components/SongList.vue'
import { useCatalogStore } from '@/stores/catalog'
import { useSongsStore } from '@/stores/songs'

const route = useRoute()
const catalog = useCatalogStore()
const store = useSongsStore()
const loading = ref(false)

const artistMeta = computed(() =>
  catalog.artists.find((item) => item.slug === route.params.artistSlug),
)

const artist = computed(() => store.getArtist(route.params.artistSlug))

const songs = computed(() => artist.value?.songs ?? [])

onMounted(async () => {
  if (!catalog.artists.length) {
    await catalog.loadArtists()
  }
  loading.value = true
  try {
    await catalog.loadArtistSongs(route.params.artistSlug)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="artist || artistMeta" class="space-y-8">
    <div class="space-y-3">
      <RouterLink to="/songs" class="va-link text-sm text-[color:var(--va-muted)]">
        ← Исполнители
      </RouterLink>
      <h1 class="va-title">{{ artist?.name ?? artistMeta?.name }}</h1>
      <p class="va-meta">
        <span v-if="loading">Загрузка песен…</span>
        <span v-else>{{ songs.length }} разборов</span>
      </p>
    </div>
    <SongList :songs="songs" />
  </div>

  <div v-else class="space-y-3 py-16 text-center">
    <p class="va-meta">Исполнитель не найден</p>
    <RouterLink to="/songs" class="va-link text-sm">К списку</RouterLink>
  </div>
</template>
