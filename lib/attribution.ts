export interface AttributionData {
  landingPath?: string
  referrerHost?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  gclid?: string
  yclid?: string
}

const STORAGE_KEY = "gotovo_attribution"
const PARAM_FIELDS = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
  gclid: "gclid",
  yclid: "yclid",
} as const

const ATTRIBUTION_FIELDS = ["landingPath", "referrerHost", "utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm", "gclid", "yclid"] as const

export function normalizeAttribution(value: unknown): AttributionData {
  if (!value || typeof value !== "object") return {}
  const input = value as Record<string, unknown>
  return Object.fromEntries(ATTRIBUTION_FIELDS.flatMap((field) => {
    const item = input[field]
    return typeof item === "string" && item.trim() ? [[field, item.trim().slice(0, 200)]] : []
  })) as AttributionData
}

function readStoredAttribution(): AttributionData {
  if (typeof window === "undefined") return {}
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    const parsed: unknown = JSON.parse(stored)
    return parsed && typeof parsed === "object" ? parsed as AttributionData : {}
  } catch {
    return {}
  }
}

function readCurrentAttribution(): AttributionData {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const current: AttributionData = { landingPath: window.location.pathname }

  for (const [parameter, field] of Object.entries(PARAM_FIELDS)) {
    const value = params.get(parameter)?.trim()
    if (value) current[field] = value
  }

  if (document.referrer) {
    try { current.referrerHost = new URL(document.referrer).host }
    catch { /* Некорректный referrer не должен ломать форму. */ }
  }
  return current
}

export function getAttribution(): AttributionData {
  const merged = { ...readStoredAttribution(), ...readCurrentAttribution() }
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)) }
    catch { /* Приватный режим и блокировщики не должны ломать заявку. */ }
  }
  return merged
}
