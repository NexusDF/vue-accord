/** Original practice sheets (not third-party lyrics). Safe for public builds. */

/** @type {import('@/stores/songs').Song[]} */
export const practiceSongs = [
  {
    id: 'practice-open-am',
    title: 'Открытый Am',
    artist: 'Vue Accord · учебный лист',
    artistSlug: 'vue-accord',
    songSlug: 'otkrytyj-am',
    key: 'Am',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Куплет:
Am              C
Считай до четырёх и не спеши,
G               Em
Поставь пальцы, слушай тишину.

Припев:
Am          C
Ещё раз круг — спокойный бой,
G           Em
И снова Am, как якорь строя.`,
    tabs: `e|--0-----0-----3-----0--|
B|--1-----1-----0-----0--|
G|--2-----0-----0-----0--|
D|--2-----2-----0-----2--|
A|--0-----3-----2-----2--|
E|--x-----x-----3-----0--|
   Am     C     G     Em`,
    notes: 'Оригинальный учебный разбор Vue Accord. Можно играть без баррэ.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'practice-four-chords',
    title: 'Четыре аккорда',
    artist: 'Vue Accord · учебный лист',
    artistSlug: 'vue-accord',
    songSlug: 'chetyre-akkorda',
    key: 'G',
    strumPattern: '↓ ↑ ↓ ↑',
    chords: `Куплет:
G               D
Шаг на грифе, шаг на струне,
Em              C
Держи ритм в правой руке.

Припев:
G      D      Em     C
Круг из четырёх — и снова сначала.`,
    tabs: '',
    notes: 'Оригинальный учебный прогресс G–D–Em–C.',
    updatedAt: Date.parse('2026-10-27'),
  },
]
