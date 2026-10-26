<script setup>
import { computed } from 'vue'

import { parseLyricsDocument, transposeText } from '@/utils/chords'

const props = defineProps({
  text: { type: String, default: '' },
  transpose: { type: Number, default: 0 },
  highlightChord: { type: String, default: '' },
})

const emit = defineEmits(['chord-click'])

const displayText = computed(() => transposeText(props.text, props.transpose))
const blocks = computed(() => parseLyricsDocument(displayText.value))

function onChordClick(name) {
  emit('chord-click', name)
}

function chordClass(name) {
  const base =
    'cursor-pointer rounded-sm px-0.5 font-semibold text-[color:var(--va-teal)] underline decoration-[color:var(--va-teal)]/40 underline-offset-2 hover:bg-[color:var(--va-teal)]/10'
  if (props.highlightChord && props.highlightChord === name) {
    return `${base} bg-[color:var(--va-teal)]/15 ring-1 ring-[color:var(--va-teal)]/35`
  }
  return base
}
</script>

<template>
  <article class="song-text va-ruled px-4 py-5 sm:px-6 sm:py-6">
    <template v-for="(block, index) in blocks" :key="index">
      <p v-if="block.type === 'empty'" class="h-[1.75rem]" />

      <p
        v-else-if="block.type === 'section'"
        class="mb-1 mt-5 first:mt-0 font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-[color:var(--va-muted)] uppercase"
      >
        {{ block.text }}
      </p>

      <div
        v-else-if="block.type === 'pair'"
        class="mb-1 font-mono text-[0.95rem] leading-[1.75rem] sm:text-[1.05rem]"
      >
        <p class="whitespace-pre text-[color:var(--va-teal)]">{{ block.chordLine }}</p>
        <p class="font-sans text-[1.05rem] text-[color:var(--va-ink)] sm:text-[1.125rem]">
          {{ block.lyrics }}
        </p>
      </div>

      <p
        v-else-if="block.type === 'chordRow'"
        class="mb-0 font-mono text-[0.95rem] leading-[1.75rem] text-[color:var(--va-teal)] sm:text-[1.05rem]"
      >
        <button
          v-for="(chord, cIndex) in block.chords"
          :key="`${chord}-${cIndex}`"
          type="button"
          :class="[chordClass(chord), cIndex > 0 ? 'ml-3' : '']"
          @click="onChordClick(chord)"
        >
          {{ chord }}
        </button>
      </p>

      <p
        v-else-if="block.type === 'inline'"
        class="mb-1 text-[1.05rem] leading-[1.75rem] text-[color:var(--va-ink)] sm:text-[1.125rem]"
      >
        <button
          v-for="(chord, cIndex) in block.chords"
          :key="`${chord}-${cIndex}`"
          type="button"
          :class="[chordClass(chord), cIndex > 0 ? 'ml-2' : 'mr-2']"
          @click="onChordClick(chord)"
        >
          {{ chord }}
        </button>
        <span>{{ block.lyrics }}</span>
      </p>

      <p
        v-else-if="block.type === 'lyrics'"
        class="mb-1 text-[1.05rem] leading-[1.75rem] text-[color:var(--va-ink)] sm:text-[1.125rem]"
      >
        {{ block.text }}
      </p>
    </template>
  </article>
</template>
