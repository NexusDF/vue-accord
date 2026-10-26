<script setup>
import { RouterLink } from 'vue-router'

import CatalogSyncBar from '@/components/CatalogSyncBar.vue'
</script>

<template>
  <div class="va-shell">
    <CatalogSyncBar />
    <header class="va-shell__bar">
      <div class="va-shell__bar-inner">
        <RouterLink to="/" class="va-shell__brand">
          <span class="va-shell__brand-name">Vue Accord</span>
          <span class="va-shell__brand-meta">аккорды · табы · бой</span>
        </RouterLink>
        <nav class="va-shell__nav">
          <RouterLink to="/songs" class="va-shell__nav-link">Исполнители</RouterLink>
          <RouterLink to="/add" class="va-btn-outline va-shell__add">Добавить</RouterLink>
        </nav>
      </div>
    </header>
    <main class="va-shell__main">
      <slot />
    </main>
    <footer class="va-shell__footer">
      Локальная библиотека разборов — данные хранятся в браузере.
      Демо-тексты/аккорды сторонних песен не являются собственностью Vue Accord.
    </footer>
  </div>
</template>

<style scoped>
.va-shell {
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  background: var(--va-sand);
  color: var(--va-ink);
}

.va-shell__bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--va-bar);
  color: var(--va-bar-text);
}

.va-shell__bar-inner {
  display: flex;
  max-width: 42rem;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
}

.va-shell__brand {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.65rem 1rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.va-shell__brand-name {
  font-family: var(--va-serif);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.1;
  color: var(--va-bar-text);
}

.va-shell__brand-meta {
  font-family: var(--va-sans);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: color-mix(in srgb, var(--va-bar-text) 55%, transparent);
  white-space: nowrap;
}

.va-shell__nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.va-shell__nav-link {
  display: none;
  font-family: var(--va-sans);
  font-size: 0.8125rem;
  color: color-mix(in srgb, var(--va-bar-text) 72%, transparent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 0.1rem;
}

.va-shell__nav-link:hover {
  color: var(--va-bar-text);
  border-bottom-color: color-mix(in srgb, var(--va-bar-text) 40%, transparent);
}

@media (min-width: 640px) {
  .va-shell__nav-link {
    display: inline;
  }
}

.va-shell__add {
  color: var(--va-bar-text);
  border-color: color-mix(in srgb, var(--va-bar-text) 70%, transparent);
  font-size: 0.8125rem;
  padding: 0.4rem 0.85rem;
}

.va-shell__add:hover {
  background: color-mix(in srgb, var(--va-bar-text) 12%, transparent);
}

.va-shell__main {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  flex: 1;
  padding: 1.75rem 1rem 2.5rem;
  box-sizing: border-box;
}

.va-shell__footer {
  border-top: 1px solid var(--va-line);
  padding: 1.25rem 1rem 1.75rem;
  text-align: center;
  font-family: var(--va-sans);
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  color: var(--va-muted);
  background: transparent;
}
</style>
