const BASE = 'https://lrclib.net'

const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'VueAccord/1.0 (local chord library app)',
}

async function lrclibFetch(path, retries = 3) {
  let lastError
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(`${BASE}${path}`, { headers: HEADERS })
      if (response.status === 503 && attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
        continue
      }
      if (!response.ok) {
        throw new Error(`LRCLIB ${response.status}`)
      }
      return response.json()
    } catch (error) {
      lastError = error
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, 300))
      }
    }
  }
  throw lastError
}

/** @param {string} query @param {number} [limit] */
export async function searchLyrics(query, limit = 25) {
  const q = encodeURIComponent(query.trim())
  if (!q) {
    return []
  }
  const data = await lrclibFetch(`/api/search?q=${q}&limit=${limit}`)
  return Array.isArray(data) ? data : []
}

/** @param {{ artist: string, title: string, album?: string, duration?: number }} params */
export async function getLyrics({ artist, title, album, duration }) {
  const params = new URLSearchParams({
    artist_name: artist,
    track_name: title,
  })
  if (album) {
    params.set('album_name', album)
  }
  if (duration) {
    params.set('duration', String(Math.round(duration)))
  }
  try {
    return await lrclibFetch(`/api/get?${params}`)
  } catch {
    return null
  }
}

export async function getLyricsById(id) {
  return lrclibFetch(`/api/get/${id}`)
}
