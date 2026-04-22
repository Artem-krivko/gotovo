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

export interface GenerateApiResponse {
  html: string
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
