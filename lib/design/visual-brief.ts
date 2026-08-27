// Visual search instructions produced by the art-director. They are treated as
// untrusted input and reduced to a short English search query before use.

export interface VisualBrief {
  query: string
  avoid: string[]
}

const QUERY_RE = /^[a-z0-9][a-z0-9 -]{2,59}$/
const BLOCKED_QUERY_TERMS = ["site:", "http", "www", "api key", "password"]

function parseQuery(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  const query = raw.trim().toLowerCase().replace(/\s+/g, " ")
  if (!QUERY_RE.test(query) || query.split(" ").length > 7) return null
  if (BLOCKED_QUERY_TERMS.some((term) => query.includes(term))) return null
  return query
}

export function parseVisualBrief(raw: unknown): VisualBrief | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null
  const root = raw as Record<string, unknown>
  const value = root.visualBrief
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  const brief = value as Record<string, unknown>
  const query = parseQuery(brief.query)
  if (!query) return null

  const avoid = (Array.isArray(brief.avoid) ? brief.avoid : [])
    .map(parseQuery)
    .filter((item): item is string => Boolean(item))
    .slice(0, 5)

  return { query, avoid }
}
