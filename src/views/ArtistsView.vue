<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { groupByLetter } from '@/utils/alphabet'
import { useCatalogStore } from '@/stores/catalog'
import { useSongsStore } from '@/stores/songs'

const catalog = useCatalogStore()
const store = useSongsStore()
const query = ref('')

const artistRows = computed(() =>
  catalog.artists.length
    ? catalog.artists.map((artist) => ({
        slug: artist.slug,
        name: artist.name,
        count: artist.count,
      }))
    : store.artists.map((artist) => ({
        slug: artist.slug,
        name: artist.name,
        count: artist.songs.length,
      })),
)

const filteredRows = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) {
    return artistRows.value
  }
  return artistRows.value.filter((artist) => artist.name.toLowerCase().includes(q))
})

const groups = computed(() => groupByLetter(filteredRows.value, (artist) => artist.name))

onMounted(async () => {
  if (!catalog.artists.length) {
    await catalog.loadArtists()
  }
})
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-3">
      <p class="va-kicker">Каталог</p>
      <h1 class="va-title">Исполнители</h1>
      <p class="va-meta">
        {{ artistRows.length }} исполнителей в каталоге
        <span v-if="catalog.loading"> · загрузка…</span>
      </p>
    </header>

    <label class="block">
      <span class="sr-only">Поиск исполнителя</span>
      <input
        v-model="query"
        type="search"
        placeholder="Поиск исполнителя…"
        class="va-search"
      />
    </label>

    <div class="space-y-8">
      <section v-for="[letter, artists] in groups" :key="letter">
        <h2
          class="mb-1 border-b border-[color:var(--va-line)] pb-1 font-[family-name:var(--va-serif)] text-3xl leading-none text-[color:var(--va-ink)]"
        >
          {{ letter }}
        </h2>
        <ul class="m-0 list-none p-0">
          <li
            v-for="(artist, index) in artists"
            :key="artist.slug"
            class="border-b border-[color:var(--va-line)]"
          >
            <RouterLink
              :to="{ name: 'artist', params: { artistSlug: artist.slug } }"
              class="flex items-baseline gap-4 py-3 text-[color:var(--va-ink)] no-underline transition hover:text-[color:var(--va-teal)]"
            >
              <span
                class="w-6 shrink-0 font-[family-name:var(--va-serif)] text-sm tabular-nums text-[color:var(--va-muted)]"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span class="min-w-0 flex-1 font-[family-name:var(--va-serif)] text-lg">
                {{ artist.name }}
              </span>
              <span
                class="shrink-0 font-[family-name:var(--va-mono)] text-sm tabular-nums text-[color:var(--va-teal)]"
              >
                {{ artist.count }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </section>

      <p
        v-if="!groups.length"
        class="border border-dashed border-[color:var(--va-line)] px-4 py-10 text-center text-sm text-[color:var(--va-muted)]"
      >
        Ничего не найдено
      </p>
    </div>
  </div>
</template>
