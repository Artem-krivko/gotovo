// lib/types.ts — общие типы проекта

// ─── Генератор дизайна ────────────────────────────────────────────────────────

export type GeneratorStyle = "modern" | "minimal" | "bold" | "corporate"
export type GeneratorLanguage = "ru" | "en" | "de"

export interface GeneratorParams {
  businessType: string
  businessName?: string
  userDescription: string
  style: GeneratorStyle
  language: GeneratorLanguage
  colorPreference?: string
  /** Аудитория и главное действие — влияют на текст, но не на факты. */
  audience?: string
  mainAction?: string
  geography?: string
  /**
   * Факты, которые пользователь подтвердил сам. ТОЛЬКО их можно утверждать
   * на странице: цифры, гарантии и отзывы отсюда, а не из ответа модели.
   */
  facts?: VerifiedFactsInput
}

/** Подтверждённые факты из брифа. Любое поле может отсутствовать. */
export interface VerifiedFactsInput {
  yearsInBusiness?: string
  projectsCompleted?: string
  clientsPerMonth?: string
  teamSize?: string
  priceFrom?: string
  geography?: string
  guarantees?: string[]
  certifications?: string[]
  testimonials?: Array<{ text: string; author: string; role: string }>
}

export interface GenerateApiRequest {
  params: GeneratorParams
}

/** Откуда взят контент превью — чтобы не выдавать заглушку за работу AI. */
export type ContentSource = "ai" | "fallback"

export type GenerationFailureReason =
  | "ai_unavailable"
  | "ai_invalid_json"
  | "ai_timeout"
  /** Результат не прошёл автоматические проверки и заменён нейтральным. */
  | "quality_rejected"
  | "none"

export interface GenerateApiResponse {
  html: string
  /**
   * null, если запись в БД не удалась. Превью при этом полностью рабочее —
   * persistence намеренно отделён от генерации.
   */
  designId: string | null
  source: ContentSource
  failureReason: GenerationFailureReason
  /**
   * Контент и спека возвращаются, чтобы правки стиля пересобирали страницу
   * локально через /api/adjust — без затрат на повторную генерацию.
   */
  content: unknown
  spec: unknown
}

export interface GenerateApiError {
  error: string
}

// ─── Заявки ───────────────────────────────────────────────────────────────────

export interface LeadRequest {
  name: string
  contact: string
  message: string
}
