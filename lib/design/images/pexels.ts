import type { ImageAsset, PageAssets } from "../content.ts"

const IMAGE_TIMEOUT_MS = 5_000
const CACHE_TTL_MS = 60 * 60 * 1000
const MAX_CACHE_ENTRIES = 100
const cache = new Map<string, { expiresAt: number; photos: PexelsCandidate[] }>()

interface PexelsSource {
  medium?: string
  large?: string
  landscape?: string
  large2x?: string
}

interface PexelsPhoto {
  id?: number
  width?: number
  height?: number
  url?: string
  alt?: string
  photographer?: string
  photographer_url?: string
  src?: PexelsSource
}

export interface PexelsCandidate {
  id: number
  width: number
  height: number
  alt: string
  asset: ImageAsset
}

function responsiveAsset(photo: PexelsPhoto, altFallback: string): ImageAsset | null {
  const src = photo.src ?? {}
  const url = src?.large2x ?? src?.landscape ?? src?.large
  if (!url) return null

  const srcSet = [
    src.medium ? `${src.medium} 350w` : "",
    src.large ? `${src.large} 940w` : "",
    src.landscape ? `${src.landscape} 1200w` : "",
    src.large2x ? `${src.large2x} 1880w` : "",
  ].filter(Boolean).join(", ")

  return {
    url,
    alt: photo.alt?.trim() || altFallback,
    srcSet: srcSet || undefined,
    sizes: "(max-width: 860px) 100vw, 55vw",
    credit: {
      name: photo.photographer?.trim() || "Pexels",
      // A photo page identifies the exact licensed asset. Fall back to the
      // photographer profile only when the API omits it.
      url: photo.url ?? photo.photographer_url ?? "https://www.pexels.com",
    },
  }
}

function usablePhoto(photo: PexelsPhoto, altFallback: string): PexelsCandidate | null {
  const width = Number(photo.width) || 0
  const height = Number(photo.height) || 0
  const ratio = height > 0 ? width / height : 0
  const asset = responsiveAsset(photo, altFallback)
  if (!asset || width < 1200 || ratio < 1.25 || ratio > 2.2) return null
  return { id: Number(photo.id) || 0, width, height, alt: photo.alt ?? "", asset }
}

export async function fetchPexelsCandidates(query: string): Promise<PexelsCandidate[]> {
  const normalized = query.trim().toLowerCase()
  const cached = cache.get(normalized)
  if (cached && cached.expiresAt > Date.now()) return cached.photos
  if (cached) cache.delete(normalized)

  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return []

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(normalized)}&per_page=15&orientation=landscape&size=large&locale=en-US`,
      { headers: { Authorization: apiKey }, signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) }
    )
    if (!response.ok) {
      console.warn("[generate] pexels_error", { status: response.status, query: normalized })
      return []
    }

    const data = (await response.json()) as { photos?: PexelsPhoto[] }
    const photos = (data.photos ?? [])
      .map((photo) => usablePhoto(photo, normalized))
      .filter((photo): photo is PexelsCandidate => Boolean(photo))

    // Serverless instances are usually short-lived, but the cache must still
    // remain bounded when an instance is reused for many different briefs.
    if (cache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = cache.keys().next().value
      if (oldestKey) cache.delete(oldestKey)
    }
    cache.set(normalized, { expiresAt: Date.now() + CACHE_TTL_MS, photos })
    return photos
  } catch (error) {
    console.warn("[generate] pexels_failed", { query: normalized, error: String(error) })
    return []
  }
}

function hash(value: string): number {
  let result = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

export function selectConceptAssets(
  candidates: PexelsCandidate[],
  seed: string,
  count: number
): PageAssets[] {
  if (candidates.length === 0) return Array.from({ length: count }, () => ({ gallery: [] }))
  const start = hash(seed) % candidates.length
  return Array.from({ length: count }, (_, index) => {
    const candidate = candidates[(start + index) % candidates.length]
    return { hero: candidate.asset, gallery: [] }
  })
}

export function filterCandidatesByAvoid(
  candidates: PexelsCandidate[],
  avoid: string[]
): PexelsCandidate[] {
  if (avoid.length === 0) return candidates
  const filtered = candidates.filter((candidate) => {
    const alt = candidate.alt.toLowerCase()
    return !avoid.some((term) => alt.includes(term.toLowerCase()))
  })
  // Never turn a useful result set into an empty/duplicate selection because
  // stock metadata happened to be vague.
  return filtered.length >= 3 ? filtered : candidates
}
