<script setup>
import { computed } from 'vue'

import { getChordShape } from '@/data/chordShapes'

const props = defineProps({
  name: { type: String, required: true },
  compact: { type: Boolean, default: false },
})

const shape = computed(() => getChordShape(props.name))

const strings = computed(() => {
  if (!shape.value) {
    return null
  }
  const frets = shape.value.frets
  const playable = frets.filter((f) => f !== 'x')
  const minFret = Math.min(...playable.map((f) => Number(f)))
  const base = shape.value.baseFret ?? (minFret > 0 ? minFret : 1)
  return { frets, base, barre: shape.value.barre }
})
</script>

<template>
  <figure
    class="inline-flex flex-col items-center"
    :class="compact ? 'min-w-[4.5rem]' : 'min-w-[5.5rem]'"
  >
    <figcaption class="mb-1 text-center text-xs font-semibold text-emerald-800">
      {{ name }}
    </figcaption>
    <svg
      v-if="strings"
      :width="compact ? 56 : 72"
      :height="compact ? 72 : 88"
      viewBox="0 0 72 88"
      class="text-stone-700"
      role="img"
      :aria-label="`Аппликатура ${name}`"
    >
      <rect x="8" y="12" width="56" height="64" fill="#fff" stroke="#d6d3d1" rx="4" />
      <line x1="8" y1="12" x2="64" y2="12" stroke="#78716c" stroke-width="2" />
      <line
        v-for="i in 5"
        :key="`f-${i}`"
        x1="8"
        :y1="12 + i * 12.8"
        x2="64"
        :y2="12 + i * 12.8"
        stroke="#e7e5e4"
      />
      <line
        v-for="i in 6"
        :key="`s-${i}`"
        :x1="8 + (i - 1) * 11.2"
        y1="12"
        :x2="8 + (i - 1) * 11.2"
        y2="76"
        stroke="#d6d3d1"
      />
      <line
        v-if="strings.barre"
        x1="14"
        :y1="12 + (strings.barre.fret - (strings.base > 1 ? strings.base - 1 : 0)) * 12.8 - 6"
        x2="58"
        :y2="12 + (strings.barre.fret - (strings.base > 1 ? strings.base - 1 : 0)) * 12.8 - 6"
        stroke="#57534e"
        stroke-width="5"
        stroke-linecap="round"
      />
      <template v-for="(fret, sIndex) in strings.frets" :key="sIndex">
        <text
          v-if="fret === 'x'"
          :x="8 + sIndex * 11.2"
          y="10"
          text-anchor="middle"
          class="fill-stone-400 text-[9px]"
        >
          ×
        </text>
        <text
          v-else-if="Number(fret) === 0"
          :x="8 + sIndex * 11.2"
          y="10"
          text-anchor="middle"
          class="fill-stone-500 text-[9px]"
        >
          o
        </text>
        <circle
          v-else
          :cx="8 + sIndex * 11.2"
          :cy="
            12 +
            (Number(fret) - (strings.base > 1 ? strings.base - 1 : 0) - 0.5) * 12.8 +
            (strings.base > 1 ? 0 : 0)
          "
          r="4.5"
          class="fill-emerald-700"
        />
      </template>
      <text v-if="strings.base > 1" x="4" y="24" class="fill-stone-500 text-[8px]">
        {{ strings.base }}
      </text>
    </svg>
    <p v-else class="rounded border border-dashed border-stone-300 px-2 py-4 text-[10px] text-stone-400">
      нет схемы
    </p>
  </figure>
</template>
