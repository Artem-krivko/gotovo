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
