<script setup>
import { computed, ref } from 'vue'

import ChordDiagramStrip from '@/components/ChordDiagramStrip.vue'
import ChordLyricsBlock from '@/components/ChordLyricsBlock.vue'
import {
  extractChordsFromText,
  hasChordSheetStructure,
  transposeChord,
} from '@/utils/chords'

const props = defineProps({
  chords: { type: String, default: '' },
  tabs: { type: String, default: '' },
  strumPattern: { type: String, default: '' },
  title: { type: String, default: '' },
  sourceUrl: { type: String, default: '' },
  sourceLabel: { type: String, default: 'Разбор на Songsterr' },
})

const transpose = ref(0)
const highlightChord = ref('')

const hasText = computed(() => props.chords.trim().length > 0)
const hasSheet = computed(() => hasChordSheetStructure(props.chords))
const lyricsOnly = computed(() => hasText.value && !hasSheet.value)
const hasTabs = computed(() => props.tabs.trim().length > 0)
const hasAny = computed(() => hasText.value || hasTabs.value)

const chordList = computed(() => {
  if (!hasSheet.value) {
    return []
  }
  const base = extractChordsFromText(props.chords)
  if (transpose.value === 0) {
    return base
  }
  return base.map((c) => transposeChord(c, transpose.value))
})

const defaultTab = computed(() => (hasText.value ? 'chords' : 'tabs'))

function changeTranspose(delta) {
  transpose.value += delta
}

function resetTranspose() {
  transpose.value = 0
}

function onChordClick(name) {
  highlightChord.value = name
}
</script>

<template>
  <div
    v-if="!hasAny"
    class="border border-dashed border-[color:var(--va-ink)]/30 bg-[color:var(--va-cream)] px-4 py-10 text-center text-[color:var(--va-muted)]"
  >
    Нет текста аккордов или табов — отредактируйте песню.
  </div>

  <div v-else class="space-y-5">
    <div
      v-if="lyricsOnly"
      class="border border-[color:var(--va-ink)]/20 bg-[color:var(--va-cream)] px-4 py-3 text-sm leading-relaxed text-[color:var(--va-ink)]"
    >
      <p class="m-0">
        Локальных аккордов нет — ниже текст; разбор на Songsterr
        <template v-if="sourceUrl">
          —
          <a
            :href="sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="va-link text-[color:var(--va-teal)]"
          >
            {{ sourceLabel }}
          </a>
        </template>
      </p>
    </div>

    <div
      v-if="hasSheet"
      class="flex flex-wrap items-center justify-between gap-3"
    >
      <p
        v-if="strumPattern?.trim()"
        class="m-0 text-sm text-[color:var(--va-ink)]"
      >
        <span class="va-kicker mr-2 inline">Бой</span>
        <span class="font-mono text-[color:var(--va-teal)]">{{ strumPattern }}</span>
      </p>
      <div class="ml-auto flex flex-wrap items-center gap-2">
        <span class="text-[11px] tracking-[0.18em] text-[color:var(--va-muted)] uppercase">
          Транспонировать
        </span>
        <div class="inline-flex border border-[color:var(--va-ink)]">
          <button
            type="button"
            class="va-btn-outline size-8 border-0 border-r border-[color:var(--va-ink)] text-[color:var(--va-ink)]"
            aria-label="На полтона ниже"
            @click="changeTranspose(-1)"
          >
            −
          </button>
          <button
            type="button"
            class="va-btn-outline min-w-10 border-0 px-2 font-mono text-sm text-[color:var(--va-ink)]"
            aria-label="Сбросить транспонирование"
            @click="resetTranspose"
          >
            {{ transpose > 0 ? `+${transpose}` : transpose }}
          </button>
          <button
            type="button"
            class="va-btn-outline size-8 border-0 border-l border-[color:var(--va-ink)] text-[color:var(--va-ink)]"
            aria-label="На полтона выше"
            @click="changeTranspose(1)"
          >
            +
          </button>
        </div>
      </div>
    </div>

    <TabsRoot :default-value="defaultTab" class="flex flex-col gap-4">
      <TabsList
        v-if="hasText && hasTabs"
        class="inline-flex w-fit gap-0 border border-[color:var(--va-ink)]"
      >
        <TabsTrigger
          value="chords"
          class="border-r border-[color:var(--va-ink)] px-4 py-1.5 text-sm text-[color:var(--va-muted)] transition data-[state=active]:bg-[color:var(--va-ink)] data-[state=active]:text-[color:var(--va-cream)]"
        >
          {{ hasSheet ? 'Аккорды и текст' : 'Текст' }}
        </TabsTrigger>
        <TabsTrigger
          value="tabs"
          class="px-4 py-1.5 text-sm text-[color:var(--va-muted)] transition data-[state=active]:bg-[color:var(--va-ink)] data-[state=active]:text-[color:var(--va-cream)]"
        >
          Табы
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chords" class="outline-none">
        <div v-if="hasText" class="border border-[color:var(--va-ink)]/20 bg-[color:var(--va-cream)]">
          <ChordLyricsBlock
            :text="chords"
            :transpose="hasSheet ? transpose : 0"
            :highlight-chord="highlightChord"
            @chord-click="onChordClick"
          />
        </div>
        <p v-else class="text-sm text-[color:var(--va-muted)]">Аккорды не заполнены.</p>
      </TabsContent>

      <TabsContent value="tabs" class="outline-none">
        <section
          v-if="hasTabs"
          class="overflow-x-auto border border-[color:var(--va-ink)]/20 bg-[color:var(--va-cream)] p-4"
        >
          <h2 class="va-kicker mb-3">Табы</h2>
          <pre
            class="font-mono text-sm leading-relaxed whitespace-pre text-[color:var(--va-ink)]"
          >{{ tabs }}</pre>
        </section>
        <p v-else class="text-sm text-[color:var(--va-muted)]">Табы не заполнены.</p>
      </TabsContent>
    </TabsRoot>

    <ChordDiagramStrip
      v-if="hasSheet && chordList.length"
      :chords="chordList"
      :title="title ? `Аппликатуры · ${title}` : 'Аппликатуры'"
    />
  </div>
</template>
