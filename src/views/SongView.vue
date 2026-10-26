<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { chordsPageUrl, tabPageUrl } from '@/api/songsterr'
import SongSheet from '@/components/SongSheet.vue'
import { useCatalogStore } from '@/stores/catalog'
import { hasPlayableSheet, useSongsStore } from '@/stores/songs'

const route = useRoute()
const router = useRouter()
const store = useSongsStore()
const catalog = useCatalogStore()
const loading = ref(false)

const song = computed(() =>
  store.getBySlug(route.params.artistSlug, route.params.songId, route.params.songSlug),
)

const editable = computed(() => store.isEditable(song.value))
const playable = computed(() => hasPlayableSheet(song.value))

const sourceUrl = computed(() => {
  if (!song.value?.songsterrId) {
    return ''
  }
  return song.value.hasChords
    ? chordsPageUrl(song.value.songsterrId)
    : tabPageUrl(song.value.songsterrId)
})

const sourceLabel = computed(() => {
  if (song.value?.songsterrId) {
    return song.value.hasChords ? 'Аккорды на Songsterr' : 'Табы на Songsterr'
  }
  if (song.value?.source === 'lrclib') {
    return 'LRCLIB'
  }
  return ''
})

const needsEnrich = computed(() => {
  const id = Number(route.params.songId)
  return Boolean(id) && (!song.value || !song.value.chords?.trim())
})

async function loadRemote() {
  if (!Number(route.params.songId)) {
    return
  }
  loading.value = true
  try {
    if (!catalog.artists.length) {
      await catalog.loadArtists()
    }
    await catalog.loadSong(
      route.params.artistSlug,
      route.params.songId,
      route.params.songSlug,
    )
  } finally {
    loading.value = false
  }
}

onMounted(loadRemote)
watch(
  () => [route.params.artistSlug, route.params.songId, route.params.songSlug],
  loadRemote,
)

function onDelete() {
  if (!song.value || !editable.value) {
    return
  }
  if (!window.confirm(`Удалить «${song.value.title}»?`)) {
    return
  }
  store.deleteSong(song.value.id)
  router.push({ name: 'artist', params: { artistSlug: song.value.artistSlug } })
}
</script>

<template>
  <div v-if="song" class="space-y-6">
    <nav class="va-meta text-sm">
      <RouterLink to="/" class="va-link">Главная</RouterLink>
      <span class="mx-1.5">/</span>
      <RouterLink
        :to="{ name: 'artist', params: { artistSlug: song.artistSlug } }"
        class="va-link"
      >
        {{ song.artist }}
      </RouterLink>
      <span class="mx-1.5">/</span>
      <span class="text-[color:var(--va-ink)]">{{ song.title }}</span>
    </nav>

    <header class="space-y-3">
      <h1 class="va-title">{{ song.title }}</h1>

      <p class="va-meta text-base text-[color:var(--va-ink)]">
        <span class="font-semibold">{{ song.artist }}</span>
        <template v-if="song.key">
          <span class="mx-2 text-[color:var(--va-muted)]">·</span>
          <span class="text-[color:var(--va-muted)]">тональность</span>
          {{ ' ' }}
          <span class="va-key">{{ song.key }}</span>
        </template>
        <template v-if="playable">
          <span class="mx-2 text-[color:var(--va-muted)]">·</span>
          <span class="text-[color:var(--va-teal)]">лист с аккордами</span>
        </template>
      </p>

      <div class="flex flex-wrap gap-2">
        <a
          v-if="sourceUrl"
          :href="sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="va-btn-outline text-[color:var(--va-ink)]"
        >
          {{ sourceLabel }}
        </a>
        <RouterLink
          v-if="editable"
          :to="{ name: 'song-edit', params: { id: song.id } }"
          class="va-btn-outline text-[color:var(--va-ink)]"
        >
          Редактировать
        </RouterLink>
        <button
          v-if="editable"
          type="button"
          class="va-btn-outline text-[color:var(--va-muted)]"
          @click="onDelete"
        >
          Удалить
        </button>
      </div>
    </header>

    <div
      v-if="loading"
      class="border border-[color:var(--va-teal)]/35 bg-[color:var(--va-cream)] px-4 py-3 text-sm text-[color:var(--va-teal)]"
      role="status"
    >
      Загружаем текст песни…
    </div>

    <SongSheet
      :title="song.title"
      :chords="song.chords"
      :tabs="song.tabs"
      :strum-pattern="song.strumPattern"
      :source-url="sourceUrl"
      :source-label="sourceLabel || 'Разбор на Songsterr'"
    />

    <section v-if="song.notes?.trim()" class="va-sheet text-sm">
      {{ song.notes }}
    </section>
  </div>

  <div v-else class="space-y-4 py-16 text-center">
    <p v-if="loading || needsEnrich" class="va-meta text-[color:var(--va-teal)]" role="status">
      Загружаем разбор…
    </p>
    <p v-else class="va-meta">Песня не найдена</p>
    <RouterLink to="/" class="va-link text-sm">На главную</RouterLink>
  </div>
</template>
