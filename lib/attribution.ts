export interface AttributionTouch {
  landingPath?: string
  landingUrl?: string
  referrerHost?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  gclid?: string
  yclid?: string
  capturedAt?: string
}

export interface AttributionData {
  firstTouch?: AttributionTouch
  lastTouch?: AttributionTouch
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

const TOUCH_FIELDS = ["landingPath", "landingUrl", "referrerHost", "utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm", "gclid", "yclid", "capturedAt"] as const

function normalizeTouch(value: unknown): AttributionTouch {
  if (!value || typeof value !== "object") return {}
  const input = value as Record<string, unknown>
  return Object.fromEntries(TOUCH_FIELDS.flatMap((field) => {
    const item = input[field]
    return typeof item === "string" && item.trim() ? [[field, item.trim().slice(0, 200)]] : []
  })) as AttributionTouch
}

export function normalizeAttribution(value: unknown): AttributionData {
  if (!value || typeof value !== "object") return {}
  const input = value as Record<string, unknown>
  const firstTouch = normalizeTouch(input.firstTouch)
  const lastTouch = normalizeTouch(input.lastTouch)
  const legacyTouch = normalizeTouch(input)
  const hasLegacy = Object.keys(legacyTouch).length > 0
  if (!Object.keys(firstTouch).length && !Object.keys(lastTouch).length && hasLegacy) {
    return { firstTouch: legacyTouch, lastTouch: legacyTouch }
  }
  return {
    ...(Object.keys(firstTouch).length ? { firstTouch } : {}),
    ...(Object.keys(lastTouch).length ? { lastTouch } : {}),
  }
}

function hasTouchData(touch: AttributionTouch) {
  return Object.keys(touch).length > 0
}

/** Pure merge used by the browser and unit tests. Direct visits never erase a paid/referral last touch. */
export function mergeAttribution(stored: unknown, current: unknown, capturedAt = new Date().toISOString()): AttributionData {
  const previous = normalizeAttribution(stored)
  const touch = normalizeTouch({ ...(current as object), capturedAt })
  if (!hasTouchData(touch)) return previous
  const isMarketingTouch = Boolean(touch.utmSource || touch.utmMedium || touch.utmCampaign || touch.utmContent || touch.utmTerm || touch.gclid || touch.yclid || touch.referrerHost)
  return {
    firstTouch: previous.firstTouch ?? touch,
    lastTouch: isMarketingTouch || !previous.lastTouch ? touch : previous.lastTouch,
  }
}

function readStoredAttribution(): AttributionData {
  if (typeof window === "undefined") return {}
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? normalizeAttribution(JSON.parse(stored)) : {}
  } catch {
    return {}
  }
}

function readCurrentAttribution(): AttributionTouch {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const current: AttributionTouch = {
    landingPath: window.location.pathname,
    landingUrl: window.location.href,
    capturedAt: new Date().toISOString(),
  }
  for (const [parameter, field] of Object.entries(PARAM_FIELDS)) {
    const value = params.get(parameter)?.trim()
    if (value) current[field] = value
  }
  if (document.referrer) {
    try {
      const referrerHost = new URL(document.referrer).host
      if (referrerHost && referrerHost !== window.location.host) current.referrerHost = referrerHost
    } catch { /* Некорректный referrer не должен ломать форму. */ }
  }
  return current
}

export function getAttribution(): AttributionData {
  const merged = mergeAttribution(readStoredAttribution(), readCurrentAttribution())
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)) }
    catch { /* Приватный режим и блокировщики не должны ломать заявку. */ }
  }
  return merged
}
