<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useSongsStore } from '@/stores/songs'

const route = useRoute()
const router = useRouter()
const store = useSongsStore()

const isEdit = computed(() => route.name === 'song-edit')
const songId = computed(() => route.params.id)

const showTabs = ref(false)
const showNotes = ref(false)

const form = reactive({
  title: '',
  artist: '',
  key: '',
  strumPattern: '',
  chords: '',
  tabs: '',
  notes: '',
})

watch(
  [isEdit, songId],
  () => {
    if (!isEdit.value) {
      form.title = ''
      form.artist = ''
      form.key = ''
      form.strumPattern = ''
      form.chords = ''
      form.tabs = ''
      form.notes = ''
      showTabs.value = false
      showNotes.value = false
      return
    }
    const existing = store.getById(songId.value)
    if (!existing) {
      return
    }
    form.title = existing.title
    form.artist = existing.artist
    form.key = existing.key
    form.strumPattern = existing.strumPattern
    form.chords = existing.chords
    form.tabs = existing.tabs
    form.notes = existing.notes
    showTabs.value = Boolean(existing.tabs?.trim())
    showNotes.value = Boolean(existing.notes?.trim())
  },
  { immediate: true },
)

function onSubmit() {
  const title = form.title.trim()
  if (!title) {
    window.alert('Укажите название песни')
    return
  }

  const payload = {
    title,
    artist: form.artist.trim(),
    key: form.key.trim(),
    strumPattern: form.strumPattern.trim(),
    chords: form.chords,
    tabs: form.tabs,
    notes: form.notes.trim(),
  }

  if (isEdit.value) {
    const existing = store.getById(songId.value)
    if (existing && !store.isEditable(existing)) {
      window.alert('Песни из API нельзя редактировать — добавьте свою копию.')
      return
    }
    const updated = store.updateSong(songId.value, payload)
    if (updated) {
      router.push({
        name: 'song',
        params: {
          artistSlug: updated.artistSlug,
          songId: String(updated.songsterrId ?? updated.lrclibId ?? 0),
          songSlug: updated.songSlug,
        },
      })
    }
    return
  }

  const created = store.addSong(payload)
  router.push({
    name: 'song',
    params: {
      artistSlug: created.artistSlug,
      songId: String(created.songsterrId ?? created.lrclibId ?? 0),
      songSlug: created.songSlug,
    },
  })
}

const cancelTo = computed(() => {
  if (!isEdit.value) {
    return '/'
  }
  const existing = store.getById(songId.value)
  if (!existing) {
    return '/'
  }
  return {
    name: 'song',
    params: {
      artistSlug: existing.artistSlug,
      songId: String(existing.songsterrId ?? existing.lrclibId ?? 0),
      songSlug: existing.songSlug,
    },
  }
})
</script>

<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <RouterLink :to="cancelTo" class="va-link text-sm text-[color:var(--va-muted)]">
        ← Назад
      </RouterLink>
      <p class="va-kicker">{{ isEdit ? 'Редактирование' : 'Новый разбор' }}</p>
    </div>

    <label class="block">
      <span class="sr-only">Название песни</span>
      <input
        v-model="form.title"
        required
        type="text"
        placeholder="Название песни…"
        class="va-title w-full border-0 bg-transparent outline-none placeholder:text-[color:color-mix(in_srgb,var(--va-ink)_28%,transparent)]"
      />
    </label>

    <div
      class="flex flex-col gap-2 border-y border-[color:var(--va-line)] py-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <label class="min-w-0 flex-1 sm:min-w-[10rem]">
        <span class="sr-only">Исполнитель</span>
        <input v-model="form.artist" type="text" placeholder="Исполнитель" class="field" />
      </label>
      <label class="w-full sm:w-28">
        <span class="sr-only">Тональность</span>
        <input
          v-model="form.key"
          type="text"
          placeholder="Тональность"
          class="field font-[family-name:var(--va-mono)]"
        />
      </label>
      <label class="min-w-0 flex-1 sm:min-w-[8rem]">
        <span class="sr-only">Бой</span>
        <input
          v-model="form.strumPattern"
          type="text"
          placeholder="Бой"
          class="field font-[family-name:var(--va-mono)]"
        />
      </label>
      <button type="submit" class="va-btn sm:ml-auto">Сохранить</button>
    </div>

    <label class="block">
      <span class="sr-only">Аккорды и текст</span>
      <textarea
        v-model="form.chords"
        rows="16"
        placeholder="Вставь аккорды над текстом…"
        class="va-ruled field resize-y font-[family-name:var(--va-mono)] text-sm"
      />
    </label>

    <div class="grid gap-3 sm:grid-cols-2">
      <div class="border-t border-[color:var(--va-line)] pt-3">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-2 text-left text-sm text-[color:var(--va-muted)] transition hover:text-[color:var(--va-ink)]"
          @click="showTabs = !showTabs"
        >
          <span>Табулатуры{{ form.tabs.trim() ? '' : ' — пусто' }}</span>
          <span aria-hidden="true">{{ showTabs ? '▾' : '▸' }}</span>
        </button>
        <textarea
          v-show="showTabs"
          v-model="form.tabs"
          rows="6"
          placeholder="e|--0--|&#10;B|--1--|"
          class="field mt-2 resize-y font-[family-name:var(--va-mono)] text-sm leading-relaxed"
        />
      </div>

      <div class="border-t border-[color:var(--va-line)] pt-3">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-2 text-left text-sm text-[color:var(--va-muted)] transition hover:text-[color:var(--va-ink)]"
          @click="showNotes = !showNotes"
        >
          <span>Заметки{{ form.notes.trim() ? '' : ' — пусто' }}</span>
          <span aria-hidden="true">{{ showNotes ? '▾' : '▸' }}</span>
        </button>
        <textarea
          v-show="showNotes"
          v-model="form.notes"
          rows="3"
          placeholder="Каподастр, вариант без баррэ…"
          class="field mt-2 resize-y text-sm"
        />
      </div>
    </div>
  </form>
</template>
