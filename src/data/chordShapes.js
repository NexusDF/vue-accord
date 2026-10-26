/** @typedef {{ frets: (number | 'x')[], fingers?: number[], barre?: { from: number, to: number, fret: number }, baseFret?: number }} ChordShape */

/** @type {Record<string, ChordShape>} */
export const chordShapes = {
  Am: { frets: ['x', 0, 2, 2, 1, 0] },
  A: { frets: ['x', 0, 2, 2, 2, 0] },
  Bm: { frets: ['x', 2, 4, 4, 3, 2], barre: { from: 1, to: 5, fret: 2 } },
  C: { frets: ['x', 3, 2, 0, 1, 0] },
  D: { frets: ['x', 'x', 0, 2, 3, 2] },
  Dm: { frets: ['x', 'x', 0, 2, 3, 1] },
  E: { frets: [0, 2, 2, 1, 0, 0] },
  Em: { frets: [0, 2, 2, 0, 0, 0] },
  F: { frets: [1, 3, 3, 2, 1, 1], barre: { from: 1, to: 5, fret: 1 } },
  G: { frets: [3, 2, 0, 0, 0, 3] },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], barre: { from: 1, to: 5, fret: 2 } },
  'C#m': { frets: ['x', 4, 6, 6, 5, 4], barre: { from: 1, to: 5, fret: 4 } },
  B: { frets: ['x', 2, 4, 4, 4, 2], barre: { from: 1, to: 5, fret: 2 } },
  Bb: { frets: ['x', 1, 3, 3, 3, 1], barre: { from: 1, to: 5, fret: 1 } },
  A7: { frets: ['x', 0, 2, 0, 2, 0] },
  D7: { frets: ['x', 'x', 0, 2, 1, 2] },
  E7: { frets: [0, 2, 0, 1, 0, 0] },
  G7: { frets: [3, 2, 0, 0, 0, 1] },
}

export function getChordShape(name) {
  const normalized = name.replace(/min/i, 'm').replace(/maj/i, '')
  return chordShapes[normalized] ?? chordShapes[name] ?? null
}
