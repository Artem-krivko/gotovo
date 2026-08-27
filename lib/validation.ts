// lib/validation.ts — строгая валидация входа API и ответа модели.
//
// Написано вручную, без zod: проект держит минимум зависимостей, а схем здесь
// всего две. Ключевое отличие от прежней проверки — ограничения ДЛИНЫ:
// раньше в промпт и в БД могла уехать строка любого размера.

import type { GeneratorLanguage, GeneratorParams, GeneratorStyle } from "@/lib/types"

// ─── Лимиты входа ─────────────────────────────────────────────────────────────

export const INPUT_LIMITS = {
  businessType: 80,
  businessName: 80,
  userDescription: 1200,
  colorPreference: 32,
  freeText: 400,
} as const

const STYLES: readonly GeneratorStyle[] = ["modern", "minimal", "bold", "corporate"]
const LANGUAGES: readonly GeneratorLanguage[] = ["ru", "en", "de"]

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string }

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

/**
 * Управляющие символы и невидимые unicode-разделители — типовой приём, чтобы
 * спрятать инструкции внутри «обычного» текста брифа. В нормальном описании
 * бизнеса их не бывает.
 */
function stripControlChars(value: string): string {
  return (
    value
      // Управляющие символы C0/C1, кроме \n и \t.
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      // Zero-width, метки направления письма и BOM.
      .replace(/[\u200B-\u200F\u2028\u2029\u202A-\u202E\u2060-\u2064\uFEFF]/g, "")
  )
}

export function sanitizeUserText(value: unknown, maxLength: number): string {
  return stripControlChars(asString(value)).slice(0, maxLength)
}

// ─── Схема входа генератора ───────────────────────────────────────────────────

export function parseGeneratorParams(body: unknown): ValidationResult<GeneratorParams> {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Некорректный запрос" }
  }

  const params = (body as Record<string, unknown>).params
  if (!params || typeof params !== "object") {
    return { ok: false, error: "Некорректный запрос" }
  }

  const p = params as Record<string, unknown>

  const businessType = sanitizeUserText(p.businessType, INPUT_LIMITS.businessType)
  if (!businessType) {
    return { ok: false, error: "Выберите тип бизнеса" }
  }

  const userDescription = sanitizeUserText(p.userDescription, INPUT_LIMITS.userDescription)
  if (userDescription.length < 10) {
    return { ok: false, error: "Опишите бизнес подробнее (минимум 10 символов)" }
  }

  const rawStyle = asString(p.style) as GeneratorStyle
  const style: GeneratorStyle = STYLES.includes(rawStyle) ? rawStyle : "modern"

  const rawLanguage = asString(p.language) as GeneratorLanguage
  const language: GeneratorLanguage = LANGUAGES.includes(rawLanguage) ? rawLanguage : "ru"

  const businessName = sanitizeUserText(p.businessName, INPUT_LIMITS.businessName)
  const colorPreference = sanitizeUserText(p.colorPreference, INPUT_LIMITS.colorPreference)

  return {
    ok: true,
    value: {
      businessType,
      businessName: businessName || undefined,
      userDescription,
      style,
      language,
      colorPreference: colorPreference || undefined,
    },
  }
}

// ─── Схема ответа модели ──────────────────────────────────────────────────────

export interface AiContentShape {
  businessName: string
  headline: string
  subheadline: string
  tagline: string
  accentColor: string
  services: Array<{ icon: string; name: string; description: string; price?: string }>
  features: Array<{ icon: string; title: string; description: string }>
  stats: Array<{ value: string; label: string }>
  ctaHeadline: string
  ctaSubtext: string
  footerTagline: string
}

function strField(obj: Record<string, unknown>, key: string, max: number): string {
  return sanitizeUserText(obj[key], max)
}

/**
 * Проверяем именно ВЛОЖЕННЫЕ структуры. Прежний parseDesignContent делал
 * `data.services.slice(0,3)` и передавал элементы дальше как есть — если бы
 * модель вернула массив чисел или объектов без нужных полей, в шаблон улетело
 * бы `undefined`, и в вёрстке появились бы дыры вместо контента.
 */
export function parseAiContent(raw: unknown): ValidationResult<AiContentShape> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Модель вернула не объект" }
  }

  const d = raw as Record<string, unknown>

  const headline = strField(d, "headline", 120)
  if (!headline) {
    return { ok: false, error: "В ответе модели нет headline" }
  }

  const services = (Array.isArray(d.services) ? d.services : [])
    .filter((s): s is Record<string, unknown> => !!s && typeof s === "object" && !Array.isArray(s))
    .map((s) => ({
      icon: strField(s, "icon", 8),
      name: strField(s, "name", 70),
      description: strField(s, "description", 320),
      price: strField(s, "price", 32) || undefined,
    }))
    .filter((s) => s.name.length > 0)
    .slice(0, 6)

  const features = (Array.isArray(d.features) ? d.features : [])
    .filter((f): f is Record<string, unknown> => !!f && typeof f === "object" && !Array.isArray(f))
    .map((f) => ({
      icon: strField(f, "icon", 8),
      title: strField(f, "title", 90),
      description: strField(f, "description", 280),
    }))
    .filter((f) => f.title.length > 0)
    .slice(0, 6)

  const stats = (Array.isArray(d.stats) ? d.stats : [])
    .filter((s): s is Record<string, unknown> => !!s && typeof s === "object" && !Array.isArray(s))
    .map((s) => ({
      value: strField(s, "value", 24),
      label: strField(s, "label", 48),
    }))
    .filter((s) => s.value.length > 0 && s.label.length > 0)
    .slice(0, 6)

  if (services.length === 0) {
    return { ok: false, error: "В ответе модели нет ни одной валидной услуги" }
  }

  return {
    ok: true,
    value: {
      businessName: strField(d, "businessName", 60),
      headline,
      subheadline: strField(d, "subheadline", 280),
      tagline: strField(d, "tagline", 48),
      accentColor: strField(d, "accentColor", 16),
      services,
      features,
      stats,
      ctaHeadline: strField(d, "ctaHeadline", 100),
      ctaSubtext: strField(d, "ctaSubtext", 220),
      footerTagline: strField(d, "footerTagline", 70),
    },
  }
}
