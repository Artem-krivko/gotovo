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
  /** По какому запросу найдено фото; нужно для разнообразия концепций. */
  query?: string
  /** Позиция в ответе фотостока — более ранние результаты обычно точнее. */
  sourceRank?: number
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

  const apiKey = process.env.PEXELS_API_KEY?.trim()
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
    const photos: PexelsCandidate[] = (data.photos ?? [])
      .flatMap((photo, sourceRank): PexelsCandidate[] => {
        const candidate = usablePhoto(photo, normalized)
        return candidate ? [{ ...candidate, query: normalized, sourceRank }] : []
      })

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

function normalizedWords(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3)
}

function visualSignature(candidate: PexelsCandidate): string {
  return [...new Set(normalizedWords(candidate.alt))].sort().join(" ")
}

function relevanceScore(candidate: PexelsCandidate, queries: string[]): number {
  const altWords = new Set(normalizedWords(candidate.alt))
  const sourceQueryIndex = Math.max(0, queries.indexOf(candidate.query ?? ""))
  const queryWords = normalizedWords(candidate.query ?? queries[0] ?? "")
  const overlap = queryWords.filter((word) => altWords.has(word)).length
  const ratio = candidate.height > 0 ? candidate.width / candidate.height : 0
  const compositionScore = ratio >= 1.35 && ratio <= 1.85 ? 8 : 0
  const resolutionScore = Math.min(8, Math.floor(candidate.width / 500))

  return (
    100 - sourceQueryIndex * 12 - (candidate.sourceRank ?? 0) * 2 +
    overlap * 10 + compositionScore + resolutionScore
  )
}

/**
 * Объединяет результаты нескольких точных запросов, удаляет дубликаты и
 * ранжирует их по смысловой близости, позиции фотостока и пригодности для hero.
 */
export function mergeAndRankPexelsCandidates(
  groups: PexelsCandidate[][],
  queries: string[],
  avoid: string[] = []
): PexelsCandidate[] {
  const unique = new Map<string, PexelsCandidate>()
  const signatures = new Set<string>()
  for (const candidate of groups.flat()) {
    const key = candidate.id ? `id:${candidate.id}` : `url:${candidate.asset.url}`
    const signature = visualSignature(candidate)
    if (unique.has(key) || (signature && signatures.has(signature))) continue
    unique.set(key, candidate)
    if (signature) signatures.add(signature)
  }

  const filtered = filterCandidatesByAvoid([...unique.values()], avoid)
  return filtered.sort((left, right) => {
    const scoreDelta = relevanceScore(right, queries) - relevanceScore(left, queries)
    if (scoreDelta !== 0) return scoreDelta
    return left.id - right.id
  })
}

export function selectConceptAssets(
  candidates: PexelsCandidate[],
  seed: string,
  count: number
): PageAssets[] {
  if (candidates.length === 0) return Array.from({ length: count }, () => ({ gallery: [] }))

  const queryGroups = new Map<string, PexelsCandidate[]>()
  for (const candidate of candidates) {
    const key = candidate.query ?? "default"
    const group = queryGroups.get(key) ?? []
    group.push(candidate)
    queryGroups.set(key, group)
  }
  const groupKeys = [...queryGroups.keys()]
  const groupStart = hash(seed) % groupKeys.length
  const usedHeroIds = new Set<number>()
  const usedPhotographers = new Set<string>()

  return Array.from({ length: count }, (_, index) => {
    const preferredKey = groupKeys[(groupStart + index) % groupKeys.length]
    const preferred = queryGroups.get(preferredKey) ?? []
    const hero = preferred.find((candidate) =>
      !usedHeroIds.has(candidate.id) &&
      !usedPhotographers.has(candidate.asset.credit?.name ?? "")
    )
      ?? preferred.find((candidate) => !usedHeroIds.has(candidate.id))
      ?? candidates.find((candidate) => !usedHeroIds.has(candidate.id))
      ?? candidates[index % candidates.length]

    usedHeroIds.add(hero.id)
    if (hero.asset.credit?.name) usedPhotographers.add(hero.asset.credit.name)

    // Галерея продолжает выбранный сюжет, но не повторяет hero. При нехватке
    // кадров добираем из соседних релевантных запросов.
    const galleryCandidates = [...preferred, ...candidates]
      .filter((candidate, candidateIndex, all) =>
        candidate.id !== hero.id &&
        all.findIndex((item) => item.id === candidate.id) === candidateIndex
      )
      .slice(0, 5)
    const gallery = galleryCandidates.map((candidate) => candidate.asset)

    return {
      hero: hero.asset,
      gallery,
      roles: {
        service: galleryCandidates[0]?.asset,
        process: galleryCandidates[1]?.asset,
        proof: galleryCandidates[2]?.asset,
        before: undefined,
        after: undefined,
      },
    }
  })
}

/**
 * Реальные фотографии владельца имеют приоритет над фотостоком. Порядок
 * детерминированно поворачивается между концепциями, поэтому один набор фото
 * поддерживает разные hero-композиции, а не клонирует их.
 */
export function applyReferenceImages(
  concepts: PageAssets[],
  urls: string[],
  businessName: string
): PageAssets[] {
  if (urls.length === 0) return concepts
  const references: ImageAsset[] = urls.map((url, index) => ({
    url,
    alt: `${businessName}: реальная фотография ${index + 1}`,
    sizes: "(max-width: 860px) 100vw, 55vw",
  }))

  return concepts.map((assets, conceptIndex) => {
    const rotated = references.map((_, index) => references[(index + conceptIndex) % references.length])
    const gallery = [...rotated.slice(1), ...assets.gallery]
      .filter((image, index, all) => all.findIndex((item) => item.url === image.url) === index)
      .slice(0, 6)
    return {
      hero: rotated[0],
      gallery,
      roles: {
        service: rotated[1] ?? assets.roles?.service,
        process: rotated[2] ?? assets.roles?.process,
        proof: rotated[3] ?? rotated[1] ?? assets.roles?.proof,
        before: references[0],
        after: references[1],
      },
    }
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
  // Не возвращаем заведомо запрещённый сюжет только ради количества. Если
  // metadata отфильтровала абсолютно всё, сохраняем исходный набор как
  // безопасный отказ от слишком агрессивного avoid-фильтра.
  return filtered.length > 0 ? filtered : candidates
}
