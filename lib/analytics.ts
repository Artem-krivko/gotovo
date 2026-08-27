// lib/analytics.ts — события воронки генератора.
//
// До этого на сайте стоял GA4 без единого собственного события: понять,
// где отваливаются пользователи — на галерее, на форме, на превью или на
// заявке — было невозможно. Соответственно и «улучшения» генератора нечем
// было измерять.
//
// Согласие: аналитика не должна писать события до явного согласия
// пользователя (см. components/shared/analytics-consent.tsx). Пока согласия
// нет, события копятся в очереди и не уходят никуда.

export type FunnelEvent =
  | "generator_gallery_view"
  | "generator_preset_selected"
  | "generator_form_started"
  | "generator_submitted"
  | "generation_succeeded"
  | "generation_failed"
  | "regenerate_clicked"
  | "style_adjustment_clicked"
  | "design_direction_selected"
  | "preview_engaged"
  | "lead_modal_opened"
  | "lead_submitted"
  | "telegram_clicked"

export type EventParams = Record<string, string | number | boolean | undefined>

const CONSENT_KEY = "analytics_consent"

type Gtag = (command: string, eventName: string, params?: EventParams) => void

interface AnalyticsWindow extends Window {
  gtag?: Gtag
}

/** Очередь событий до получения согласия либо до загрузки gtag. */
const queue: Array<{ name: FunnelEvent; params: EventParams }> = []
const MAX_QUEUE = 50

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "granted"
  } catch {
    // localStorage может быть недоступен (приватный режим, блокировщики).
    // Отсутствие доступа трактуем как отсутствие согласия.
    return false
  }
}

export function setConsent(granted: boolean) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied")
  } catch {
    /* см. выше — работаем без сохранения */
  }

  const w = window as AnalyticsWindow
  w.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  } as unknown as EventParams)

  if (granted) flushQueue()
  else queue.length = 0
}

function send(name: FunnelEvent, params: EventParams) {
  const w = window as AnalyticsWindow
  if (!w.gtag) return false
  w.gtag("event", name, params)
  return true
}

function flushQueue() {
  if (typeof window === "undefined") return
  while (queue.length > 0) {
    const item = queue[0]
    if (!send(item.name, item.params)) return
    queue.shift()
  }
}

/**
 * Отправляет событие воронки. Безопасно вызывать где угодно: на сервере
 * молча ничего не делает, без согласия — складывает в очередь.
 */
export function track(name: FunnelEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return

  if (!hasConsent()) {
    if (queue.length < MAX_QUEUE) queue.push({ name, params })
    return
  }

  if (!send(name, params) && queue.length < MAX_QUEUE) {
    // gtag ещё не загрузился — не теряем событие.
    queue.push({ name, params })
  }
}
