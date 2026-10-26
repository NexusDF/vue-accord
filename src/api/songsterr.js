const DEFAULT_BASE = '/api/songsterr'

function base() {
  return import.meta.env.VITE_SONGSTERR_API_BASE || DEFAULT_BASE
}

/** Same-origin `/api/songsterr` only exists via the Vite dev proxy. */
function isSongsterrReachable() {
  if (import.meta.env.VITE_SONGSTERR_API_BASE) {
    return true
  }
  return !import.meta.env.PROD
}

const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'VueAccord/1.0 (local chord library app)',
}

async function stFetch(path) {
  if (!isSongsterrReachable()) {
    throw new Error('Songsterr API unavailable (no VITE_SONGSTERR_API_BASE in production)')
  }
  const response = await fetch(`${base()}${path}`, { headers: HEADERS })
  if (!response.ok) {
    throw new Error(`Songsterr ${response.status}: ${path}`)
  }
  return response.json()
}

/**
 * @param {{ pattern?: string, size?: number, from?: number }} [opts]
 */
export async function searchSongs(opts = {}) {
  const params = new URLSearchParams()
  if (opts.pattern?.trim()) {
    params.set('pattern', opts.pattern.trim().slice(0, 250))
  }
  params.set('size', String(opts.size ?? 30))
  if (opts.from) {
    params.set('from', String(opts.from))
  }
  const data = await stFetch(`/api/search?${params}`)
  return data.records ?? []
}

export async function getSong(songId) {
  return stFetch(`/api/song/${songId}`)
}

export function chordsPageUrl(songId) {
  return `https://www.songsterr.com/a/wsa/s${songId}-chords`
}

export function tabPageUrl(songId) {
  return `https://www.songsterr.com/a/wsa/s${songId}`
}
