<script setup>
import { computed } from 'vue'

import { useCatalogStore } from '@/stores/catalog'

const catalog = useCatalogStore()

const progressLabel = computed(() => {
  if (!catalog.syncing) {
    return ''
  }
  const { done, total } = catalog.syncProgress
  if (!total) {
    return 'Загрузка каталога…'
  }
  return `Загрузка песен: ${done} / ${total} исполнителей`
})

async function onRefresh() {
  await catalog.syncAll()
}
</script>

<template>
  <div
    v-if="catalog.syncing || catalog.error"
    class="va-sync va-sync--active"
  >
    <p v-if="catalog.syncing" class="va-sync__row">
      <span class="va-sync__pulse" aria-hidden="true" />
      {{ progressLabel }}
    </p>
    <p v-if="catalog.error" class="va-sync__error">{{ catalog.error }}</p>
  </div>
  <div
    v-else-if="catalog.lastSyncedAt"
    class="va-sync va-sync--idle"
  >
    <span>Каталог · {{ catalog.allSongs.length }} песен (Songsterr / LRCLIB)</span>
    <button type="button" class="va-sync__refresh" @click="onRefresh">
      Обновить
    </button>
  </div>
</template>

<style scoped>
.va-sync {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  border-bottom: 1px solid var(--va-line);
  background: color-mix(in srgb, var(--va-ink) 4%, var(--va-sand));
  color: var(--va-muted);
  font-family: var(--va-sans);
  font-size: 0.75rem;
  line-height: 1.4;
  padding: 0.45rem 1rem;
}

.va-sync--active {
  background: color-mix(in srgb, var(--va-ink) 6%, var(--va-sand));
  color: var(--va-ink);
  font-size: 0.8125rem;
}

.va-sync__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.va-sync__pulse {
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 0;
  background: var(--va-teal);
  animation: va-sync-pulse 1.1s ease-in-out infinite;
}

.va-sync__error {
  margin: 0;
  color: #9b2c2c;
}

.va-sync__refresh {
  border: none;
  background: transparent;
  color: var(--va-teal);
  font: inherit;
  cursor: pointer;
  padding: 0;
  border-bottom: 1px solid transparent;
}

.va-sync__refresh:hover {
  border-bottom-color: var(--va-teal);
}

@keyframes va-sync-pulse {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 1;
  }
}
</style>
