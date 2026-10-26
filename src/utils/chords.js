const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT_TO_SHARP = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' }

const CHORD_TOKEN =
  /^[A-G](?:#|b)?(?:maj|min|m|sus[24]?|add\d+|dim|aug)?\d*(?:\/[A-G](?:#|b)?)?$/i

export function isChordToken(token) {
  if (!token) {
    return false
  }
  const t = token.replace(/[()]/g, '')
  if (/^x\d+$/i.test(t)) {
    return false
  }
  return CHORD_TOKEN.test(t)
}

export function extractChordsFromText(text) {
  const found = new Set()
  const re =
    /[A-G](?:#|b)?(?:maj|min|m|sus[24]?|add\d+|dim|aug)?\d*(?:\/[A-G](?:#|b)?)?/gi
  for (const match of text.matchAll(re)) {
    const name = normalizeChordName(match[0])
    if (name) {
      found.add(name)
    }
  }
  return [...found].sort((a, b) => a.localeCompare(b))
}

export function normalizeChordName(name) {
  if (!name) {
    return ''
  }
  let chord = name.trim()
  const root = chord.match(/^([A-G])([#b]?)/i)
  if (!root) {
    return chord
  }
  let note = root[1].toUpperCase() + (root[2] || '')
  if (note.length === 2 && note[1] === 'b') {
    const flat = note[0] + 'b'
    note = FLAT_TO_SHARP[flat] ?? note
  }
  const rest = chord.slice(root[0].length)
  let suffix = rest
  if (/^m(?!aj)/i.test(suffix) && !/^min/i.test(suffix)) {
    suffix = suffix.replace(/^m/i, 'm')
  }
  return note + suffix
}

function parseRoot(chord) {
  const m = chord.match(/^([A-G])([#b]?)/)
  if (!m) {
    return null
  }
  let note = m[1] + (m[2] || '')
  if (note.length === 2 && note[1] === 'b') {
    const flat = note[0] + 'b'
    note = FLAT_TO_SHARP[flat] ?? note
  }
  const idx = NOTES.indexOf(note[0].toUpperCase() + (note[1] === '#' ? '#' : ''))
  return idx === -1 ? null : { idx, suffix: chord.slice(m[0].length) }
}

export function transposeChord(chord, semitones) {
  if (!chord || semitones === 0) {
    return chord
  }
  const slash = chord.indexOf('/')
  if (slash !== -1) {
    return `${transposeChord(chord.slice(0, slash), semitones)}/${transposeChord(chord.slice(slash + 1), semitones)}`
  }
  const parsed = parseRoot(chord)
  if (!parsed) {
    return chord
  }
  const next = (parsed.idx + semitones + 120) % 12
  return NOTES[next] + parsed.suffix
}

export function transposeText(text, semitones) {
  if (!text || semitones === 0) {
    return text
  }
  return text.replace(
    /[A-G](?:#|b)?(?:maj|min|m|sus[24]?|add\d+|dim|aug)?\d*(?:\/[A-G](?:#|b)?)?/gi,
    (match) => transposeChord(normalizeChordName(match), semitones),
  )
}

/**
 * @typedef {'empty' | 'section' | 'chordRow' | 'inline' | 'lyrics'} LineKind
 */

export function parseLyricsLine(line) {
  const trimmed = line.trimEnd()
  if (!trimmed.trim()) {
    return { type: 'empty' }
  }
  const compact = trimmed.trim()
  if (
    /^(вступление|припев|куплет|проигрыш|соло|бридж|интро|предприпев|бой|тональность)\b/i.test(
      compact,
    ) ||
    /:\s*$/.test(compact) ||
    /^бой\s*:/i.test(compact)
  ) {
    return { type: 'section', text: compact }
  }

  const tokens = compact.split(/\s+/)
  const chords = []
  let i = 0
  while (i < tokens.length && isChordToken(tokens[i])) {
    chords.push(normalizeChordName(tokens[i]))
    i += 1
  }

  if (chords.length === tokens.length) {
    return { type: 'chordRow', chords, raw: compact }
  }
  if (chords.length > 0) {
    return { type: 'inline', chords, lyrics: tokens.slice(i).join(' ') }
  }
  return { type: 'lyrics', text: compact }
}

/** True when text has chord rows / chord+lyric pairs (not plain lyrics). */
export function hasChordSheetStructure(text) {
  if (!text?.trim()) {
    return false
  }
  const blocks = parseLyricsDocument(text)
  return blocks.some(
    (block) =>
      block.type === 'pair' ||
      block.type === 'chordRow' ||
      block.type === 'inline',
  )
}

export function parseLyricsDocument(text) {
  const lines = text.split('\n')
  const blocks = []
  let pendingChordRow = null

  for (const line of lines) {
    const parsed = parseLyricsLine(line)
    if (parsed.type === 'empty') {
      pendingChordRow = null
      blocks.push(parsed)
      continue
    }
    if (parsed.type === 'section' || parsed.type === 'lyrics' || parsed.type === 'inline') {
      pendingChordRow = null
      blocks.push(parsed)
      continue
    }
    if (parsed.type === 'chordRow') {
      pendingChordRow = parsed
      blocks.push({ type: 'chordRowPending', chords: parsed.chords, raw: parsed.raw })
    }
  }

  const merged = []
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]
    if (block.type !== 'chordRowPending') {
      merged.push(block)
      continue
    }
    const next = blocks[i + 1]
    if (next?.type === 'lyrics') {
      merged.push({
        type: 'pair',
        chords: block.chords,
        chordLine: block.raw,
        lyrics: next.text,
      })
      i += 1
    } else if (next?.type === 'inline') {
      merged.push(next)
      i += 1
    } else {
      merged.push({ type: 'chordRow', chords: block.chords, raw: block.raw })
    }
  }
  return merged
}
