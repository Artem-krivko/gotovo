// lib/validation.ts — строгая валидация входа API и ответа модели.
//
// Написано вручную, без zod: проект держит минимум зависимостей, а схем здесь
// всего две. Ключевое отличие от прежней проверки — ограничения ДЛИНЫ:
// раньше в промпт и в БД могла уехать строка любого размера.

import type {
  GeneratorLanguage,
  GeneratorParams,
  GeneratorStyle,
  VerifiedFactsInput,
} from "@/lib/types"

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
  const audience = sanitizeUserText(p.audience, INPUT_LIMITS.freeText)
  const mainAction = sanitizeUserText(p.mainAction, INPUT_LIMITS.freeText)
  const geography = sanitizeUserText(p.geography, 80)
  const advantages = parseStringList(p.advantages, 4, 140)
  const referenceImages = parseHttpsUrls(p.referenceImages, 6)

  return {
    ok: true,
    value: {
      businessType,
      businessName: businessName || undefined,
      userDescription,
      style,
      language,
      colorPreference: colorPreference || undefined,
      audience: audience || undefined,
      mainAction: mainAction || undefined,
      geography: geography || undefined,
      advantages,
      referenceImages,
      beforeAfter: p.beforeAfter === true && referenceImages.length >= 2,
      facts: parseVerifiedFacts(p.facts, geography),
    },
  }
}

// ─── Подтверждённые факты ─────────────────────────────────────────────────────

/** Метрика: цифры, единицы и короткие уточнения — но не предложение текста. */
const METRIC_RE = /^[\d\s.,+\-–—%/]{1,12}[\p{L}\s.]{0,14}$/u

function parseMetric(value: unknown): string | undefined {
  const raw = sanitizeUserText(value, 24)
  if (!raw) return undefined
  // Метрика попадает на страницу как утверждённый факт, поэтому свободный
  // текст здесь недопустим: «более 1000 довольных клиентов» — это уже
  // маркетинговое заявление, а не измеримое значение.
  return METRIC_RE.test(raw) ? raw : undefined
}

function parseStringList(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => sanitizeUserText(item, maxLength))
    .filter((item) => item.length > 0)
    .slice(0, maxItems)
}

function parseHttpsUrls(value: unknown, maxItems: number): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => sanitizeUserText(item, 1_500))
    .filter((item) => {
      try {
        const url = new URL(item)
        return url.protocol === "https:" && !url.username && !url.password
      } catch {
        return false
      }
    })
    .slice(0, maxItems)
}

/**
 * Факты от пользователя — единственный источник цифр, гарантий и отзывов
 * на сгенерированной странице. Модель их не производит.
 */
export function parseVerifiedFacts(
  value: unknown,
  fallbackGeography = ""
): VerifiedFactsInput {
  const f = (value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {}) as Record<string, unknown>

  const testimonials = (Array.isArray(f.testimonials) ? f.testimonials : [])
    .filter((t): t is Record<string, unknown> => !!t && typeof t === "object")
    .map((t) => ({
      text: sanitizeUserText(t.text, 420),
      author: sanitizeUserText(t.author, 60),
      role: sanitizeUserText(t.role, 90),
    }))
    // Отзыв без текста и без автора — не отзыв.
    .filter((t) => t.text.length > 0 && t.author.length > 0)
    .slice(0, 3)

  const geography = sanitizeUserText(f.geography, 80) || fallbackGeography
  const caseStudies = (Array.isArray(f.caseStudies) ? f.caseStudies : [])
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      title: sanitizeUserText(item.title, 90),
      summary: sanitizeUserText(item.summary, 360),
      result: sanitizeUserText(item.result, 100) || undefined,
    }))
    .filter((item) => item.title && item.summary)
    .slice(0, 3)
  const teamMembers = (Array.isArray(f.teamMembers) ? f.teamMembers : [])
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      name: sanitizeUserText(item.name, 60),
      role: sanitizeUserText(item.role, 90),
    }))
    .filter((item) => item.name && item.role)
    .slice(0, 6)

  return {
    yearsInBusiness: parseMetric(f.yearsInBusiness),
    projectsCompleted: parseMetric(f.projectsCompleted),
    clientsPerMonth: parseMetric(f.clientsPerMonth),
    teamSize: parseMetric(f.teamSize),
    priceFrom: sanitizeUserText(f.priceFrom, 32) || undefined,
    geography: geography || undefined,
    guarantees: parseStringList(f.guarantees, 4, 140),
    certifications: parseStringList(f.certifications, 4, 140),
    testimonials,
    caseStudies,
    teamMembers,
    serviceAreas: parseStringList(f.serviceAreas, 8, 80),
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
