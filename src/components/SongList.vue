<script setup>
import { RouterLink } from 'vue-router'

import { hasPlayableSheet } from '@/stores/songs'

defineProps({
  songs: { type: Array, required: true },
  emptyText: { type: String, default: 'Пока нет песен' },
})

function songTo(song) {
  const id = song.songsterrId ?? song.lrclibId ?? 0
  return {
    name: 'song',
    params: {
      artistSlug: song.artistSlug,
      songId: String(id),
      songSlug: song.songSlug,
    },
  }
}

function padIndex(index) {
  return String(index + 1).padStart(2, '0')
}
</script>

<template>
  <ul v-if="songs.length" class="va-song-list">
    <li v-for="(song, index) in songs" :key="song.id" class="va-song-list__item">
      <RouterLink :to="songTo(song)" class="va-song-list__link">
        <span class="va-song-list__num" aria-hidden="true">{{ padIndex(index) }}</span>
        <span class="va-song-list__text">
          <span class="va-song-list__title">{{ song.title }}</span>
          <span class="va-song-list__sep"> — </span>
          <span class="va-song-list__artist">{{ song.artist }}</span>
        </span>
        <span
          v-if="hasPlayableSheet(song)"
          class="va-song-list__sheet"
          title="Есть локальный лист аккордов"
          aria-label="Лист аккордов"
        >♯</span>
        <span v-if="song.key" class="va-key">{{ song.key }}</span>
      </RouterLink>
    </li>
  </ul>
  <p v-else class="va-song-list__empty">
    {{ emptyText }}
  </p>
</template>

<style scoped>
.va-song-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--va-line);
}

.va-song-list__item {
  border-bottom: 1px solid var(--va-line);
}

.va-song-list__link {
  display: flex;
  align-items: baseline;
  gap: 0.85rem;
  padding: 0.85rem 0.15rem;
  text-decoration: none;
  color: var(--va-ink);
  background: transparent;
  transition: color 0.12s ease;
}

.va-song-list__link:hover,
.va-song-list__link:focus-visible {
  background: transparent;
  color: var(--va-teal);
  outline: none;
}

.va-song-list__num {
  flex-shrink: 0;
  width: 1.75rem;
  font-family: var(--va-serif);
  font-size: 0.9375rem;
  font-variant-numeric: tabular-nums;
  color: var(--va-muted);
}

.va-song-list__text {
  min-width: 0;
  flex: 1;
  font-family: var(--va-serif);
  font-size: 1.05rem;
  line-height: 1.35;
}

.va-song-list__title {
  font-weight: 600;
}

.va-song-list__sep,
.va-song-list__artist {
  font-weight: 400;
  color: var(--va-ink);
}

.va-song-list__sheet {
  flex-shrink: 0;
  font-family: var(--va-serif);
  font-size: 0.95rem;
  line-height: 1;
  color: var(--va-teal);
}

.va-song-list__empty {
  margin: 0;
  border: 1px dashed var(--va-line);
  border-radius: 0;
  padding: 2.5rem 1.25rem;
  text-align: center;
  font-family: var(--va-sans);
  font-size: 0.9375rem;
  color: var(--va-muted);
  background: transparent;
}

@media (max-width: 480px) {
  .va-song-list__text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .va-song-list__sep {
    display: none;
  }

  .va-song-list__artist {
    font-family: var(--va-sans);
    font-size: 0.8125rem;
    color: var(--va-muted);
  }
}
</style>
