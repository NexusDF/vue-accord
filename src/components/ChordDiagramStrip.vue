<script setup>
import ChordDiagram from '@/components/ChordDiagram.vue'

defineProps({
  chords: { type: Array, required: true },
  title: { type: String, default: 'Аппликатуры' },
  compact: { type: Boolean, default: true },
})
</script>

<template>
  <section v-if="chords.length" class="va-diagram-strip">
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <h2 class="va-kicker m-0">{{ title }}</h2>
      <p class="va-meta m-0 text-[0.75rem]">Нажмите аккорд в тексте</p>
    </div>
    <div
      class="mt-3 flex gap-2 overflow-x-auto pb-1"
      :class="compact ? 'flex-nowrap' : 'flex-wrap'"
    >
      <ChordDiagram v-for="chord in chords" :key="chord" :name="chord" />
    </div>
  </section>
</template>

<style scoped>
.va-diagram-strip {
  border-top: 1px solid var(--va-line);
  padding-top: 0.85rem;
}
</style>
