// lib/types.ts — общие типы проекта

import type { PageAssets, PageContent } from "./design/content.ts"
import type { DesignSpec } from "./design/spec.ts"

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

/** Диагностика: какой провайдер реально сформировал каждый этап. */
export type GenerationProvider = "gemini" | "groq" | "none"

export interface GeneratedConcept {
  id: string
  label: string
  description: string
  html: string
  spec: DesignSpec
  assets: PageAssets
  /** Exact persisted version of this concept; null when persistence failed. */
  designId: string | null
}

export interface GenerateApiResponse {
  html: string
  /**
   * null, если запись в БД не удалась. Превью при этом полностью рабочее —
   * persistence намеренно отделён от генерации.
   */
  designId: string | null
  source: ContentSource
  failureReason: GenerationFailureReason
  providers?: { strategist: GenerationProvider; artDirector: GenerationProvider }
  /** Три кураторских направления из одного AI-ответа — без дополнительных запросов. */
  concepts: GeneratedConcept[]
  /**
   * Контент и спека возвращаются, чтобы правки стиля пересобирали страницу
   * локально через /api/adjust — без затрат на повторную генерацию.
   */
  content: PageContent
  spec: DesignSpec
  assets: PageAssets
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
