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
  | "generator_started"
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
  | "direct_lead_submitted"
  | "generator_lead_submitted"
  | "lead_form_started"
  | "lead_submit_failed"
  | "telegram_clicked"
  | "phone_clicked"
  | "email_clicked"

export type EventParams = Record<string, string | number | boolean | undefined>

const CONSENT_KEY = "analytics_consent"

type Gtag = (command: string, eventName: string, params?: EventParams) => void

interface AnalyticsWindow extends Window {
  gtag?: Gtag
  ym?: (counterId: number, command: string, target: string, params?: EventParams) => void
}

const YANDEX_COUNTER_ID = 112132579

const GOOGLE_EVENT_NAMES: Partial<Record<FunnelEvent, string>> = {
  direct_lead_submitted: "ga_lead_submitted",
  generator_lead_submitted: "ga_generator_lead_submitted",
  generator_started: "ga_generator_started",
  generation_succeeded: "ga_generation_succeeded",
  phone_clicked: "ga_phone_clicked",
  email_clicked: "ga_email_clicked",
  telegram_clicked: "ga_telegram_clicked",
}

const YANDEX_EVENT_NAMES: Partial<Record<FunnelEvent, string>> = {
  direct_lead_submitted: "yd_lead_submitted",
  generator_lead_submitted: "yd_generator_lead_submitted",
  generator_started: "yd_generator_started",
  generation_succeeded: "yd_generation_succeeded",
  phone_clicked: "yd_phone_clicked",
  email_clicked: "yd_email_clicked",
  telegram_clicked: "yd_telegram_clicked",
}

export function platformEventName(name: FunnelEvent, platform: "google" | "yandex"): string {
  return (platform === "google" ? GOOGLE_EVENT_NAMES : YANDEX_EVENT_NAMES)[name] ?? name
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
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
  } as unknown as EventParams)

  if (granted) {
    flushQueue()
    window.dispatchEvent(new Event("gotovo-analytics-consent-granted"))
  }
  else queue.length = 0
}

function send(name: FunnelEvent, params: EventParams) {
  const w = window as AnalyticsWindow
  let delivered = false
  if (w.gtag) {
    w.gtag("event", platformEventName(name, "google"), params)
    delivered = true
  }
  w.ym?.(YANDEX_COUNTER_ID, "reachGoal", platformEventName(name, "yandex"), params)
  if (w.ym) delivered = true
  return delivered
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
