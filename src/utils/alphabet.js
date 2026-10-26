export function artistLetter(name) {
  const trimmed = name.trim()
  if (!trimmed) {
    return '#'
  }
  const first = trimmed[0]
  if (/[0-9]/.test(first)) {
    return '0–9'
  }
  if (/[A-Za-z]/.test(first)) {
    return first.toUpperCase()
  }
  const upper = first.toUpperCase()
  const ru = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
  if (ru.includes(upper)) {
    return upper
  }
  return '#'
}

export function groupByLetter(items, getLabel) {
  const groups = new Map()
  for (const item of items) {
    const letter = artistLetter(getLabel(item))
    if (!groups.has(letter)) {
      groups.set(letter, [])
    }
    groups.get(letter).push(item)
  }
  const order = (a, b) => {
    if (a === '0–9') {
      return -1
    }
    if (b === '0–9') {
      return 1
    }
    if (/^[A-Z]$/.test(a) && /^[А-ЯЁ]$/.test(b)) {
      return 1
    }
    if (/^[А-ЯЁ]$/.test(a) && /^[A-Z]$/.test(b)) {
      return -1
    }
    return a.localeCompare(b, 'ru')
  }
  return [...groups.entries()].sort(([a], [b]) => order(a, b))
}
