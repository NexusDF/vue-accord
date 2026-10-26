const ENTITY_MAP = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#8217;': "'",
  '&#8211;': '–',
  '&#8212;': '—',
}

export function decodeHtml(text) {
  return String(text ?? '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&[#\w]+;/g, (entity) => ENTITY_MAP[entity] ?? entity)
}

export function stripHtml(html) {
  return decodeHtml(
    String(html ?? '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractSection(html, headingNeedle) {
  const lower = html.toLowerCase()
  const marker = headingNeedle.toLowerCase()
  const start = lower.indexOf(marker)
  if (start === -1) {
    return ''
  }
  const after = html.slice(start)
  const nextH2 = after.indexOf('<h2', marker.length)
  const chunk = nextH2 === -1 ? after : after.slice(0, nextH2)
  return stripHtml(chunk)
}

export function parseStrumPattern(text) {
  const match = text.match(/бой\s*:\s*([^\n]+)/i)
  return match ? match[1].trim() : ''
}

export function guessKeyFromChords(text) {
  const match = text.match(/\b([A-G](?:#|b)?m?)\b/)
  return match ? match[1] : ''
}

/**
 * @param {string} html
 * @returns {{ chords: string, tabs: string, strumPattern: string, key: string }}
 */
export function parseAkkordsPostContent(html) {
  const chordsBlock =
    extractSection(html, 'аккорды, бой, текст песни') ||
    extractSection(html, 'аккорды и текст') ||
    ''

  const tabsBlock =
    extractSection(html, 'табы и ноты вступления') ||
    extractSection(html, 'табы и ноты') ||
    ''

  const chords = chordsBlock
    .replace(/^[^\n]*аккорды[^\n]*\n?/i, '')
    .trim()

  const tabs = tabsBlock
    .replace(/^[^\n]*табы[^\n]*\n?/i, '')
    .trim()

  const strumPattern = parseStrumPattern(chordsBlock) || parseStrumPattern(chords)
  const key = guessKeyFromChords(chords)

  return { chords, tabs, strumPattern, key }
}
