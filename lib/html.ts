// lib/html.ts — экранирование и валидация всех динамических значений,
// попадающих в сгенерированный HTML, email и Telegram.
//
// Правило проекта: НИ ОДНО значение от пользователя или от модели не должно
// попадать в HTML напрямую. Всё проходит через хелперы этого файла.

// ─── HTML ─────────────────────────────────────────────────────────────────────

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

/**
 * Экранирует значение для вставки как в текстовый узел, так и в значение
 * атрибута (атрибуты в шаблонах всегда в двойных кавычках).
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return ""
  return String(value).replace(/[&<>"']/g, (c) => HTML_ENTITIES[c] ?? c)
}

/**
 * Экранирует и одновременно ограничивает длину — защита от того, что модель
 * вернёт километровую строку и сломает вёрстку.
 */
export function escapeClamped(value: unknown, maxLength: number): string {
  if (value === null || value === undefined) return ""
  const raw = String(value).trim()
  const cut = raw.length > maxLength ? `${raw.slice(0, maxLength - 1).trimEnd()}…` : raw
  return escapeHtml(cut)
}

/** Обрезает без экранирования — для значений, которые экранируются позже. */
export function clamp(value: unknown, maxLength: number): string {
  if (value === null || value === undefined) return ""
  const raw = String(value).trim()
  return raw.length > maxLength ? raw.slice(0, maxLength) : raw
}

// ─── Цвета ────────────────────────────────────────────────────────────────────

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/

/**
 * Цвет попадает в CSS (`--a:${color}`), где HTML-экранирование не спасает.
 * Поэтому — строгий allow-list формата, иначе фолбэк.
 */
export function safeHexColor(value: unknown, fallback = "#6366F1"): string {
  const raw = typeof value === "string" ? value.trim() : ""
  return HEX_COLOR.test(raw) ? raw.toUpperCase() : fallback
}

// ─── URL ──────────────────────────────────────────────────────────────────────

const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"])

/**
 * Пропускает только http/https/mailto/tel. Блокирует javascript:, data:,
 * vbscript: и прочие исполняемые схемы. Возвращает уже экранированную строку.
 */
export function safeUrl(value: unknown, fallback = "#"): string {
  const raw = typeof value === "string" ? value.trim() : ""
  if (!raw) return fallback
  try {
    const parsed = new URL(raw)
    if (!SAFE_URL_PROTOCOLS.has(parsed.protocol)) return fallback
    return escapeHtml(parsed.toString())
  } catch {
    return fallback
  }
}

/**
 * Источник картинки: разрешаем только https и data:image/* — именно то,
 * что кладёт в контент наш пайплайн (Pexels → data URL).
 */
export function safeImageSrc(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : ""
  if (!raw) return ""
  if (/^data:image\/(png|jpe?g|webp|gif|avif);base64,[A-Za-z0-9+/=\s]+$/i.test(raw)) {
    return escapeHtml(raw)
  }
  if (/^https:\/\//i.test(raw)) return safeUrl(raw, "")
  return ""
}

// ─── Телефон и email ──────────────────────────────────────────────────────────

/** href для tel: — оставляем только цифры, + и пробелы-разделители убираем. */
export function safeTelHref(value: unknown): string {
  const digits = String(value ?? "").replace(/[^\d+]/g, "").slice(0, 20)
  return digits ? `tel:${escapeHtml(digits)}` : "#"
}

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"'.]+\.[^\s@<>"']+$/

export function isValidEmail(value: unknown): boolean {
  const raw = typeof value === "string" ? value.trim() : ""
  return raw.length <= 254 && EMAIL_RE.test(raw)
}

/** href для mailto: — только если email валиден. */
export function safeMailtoHref(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : ""
  return isValidEmail(raw) ? `mailto:${escapeHtml(raw)}` : "#"
}

const PHONE_RE = /^\+?[\d\s()\-]{6,20}$/

export function isValidPhone(value: unknown): boolean {
  const raw = typeof value === "string" ? value.trim() : ""
  return PHONE_RE.test(raw)
}

// ─── Telegram ─────────────────────────────────────────────────────────────────

/**
 * Telegram sendMessage с parse_mode=HTML. Пользовательские поля обязаны быть
 * экранированы, иначе `<b>` из заявки ломает разметку, а битая разметка
 * приводит к 400 и потере уведомления о лиде.
 * Telegram требует экранировать ровно & < > — кавычки трогать не нужно.
 */
export function escapeTelegram(value: unknown): string {
  if (value === null || value === undefined) return ""
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
