// lib/design/parse-content.ts — валидация PageContent, пришедшего извне.
//
// Нужна для /api/adjust: там контент возвращается с клиента, поэтому доверять
// его форме нельзя. Экранирование всё равно выполнит composePage, но структура
// должна быть корректной — иначе в разметку уедут undefined.

import { sanitizeUserText } from "@/lib/validation"
import type { ImageAsset, PageAssets, PageContent, Stat } from "./content.ts"

function str(value: unknown, max: number): string {
  return sanitizeUserText(value, max)
}

export function parseImage(value: unknown): ImageAsset | undefined {
  if (!value || typeof value !== "object") return undefined
  const v = value as Record<string, unknown>
  const url = str(v.url, 2048)
  if (!url) return undefined

  const credit =
    v.credit && typeof v.credit === "object"
      ? {
          name: str((v.credit as Record<string, unknown>).name, 60),
          url: str((v.credit as Record<string, unknown>).url, 2048),
        }
      : undefined

  const srcSet = str(v.srcSet, 6000) || undefined
  const sizes = str(v.sizes, 500) || undefined

  return { url, alt: str(v.alt, 120), srcSet, sizes, credit: credit?.name ? credit : undefined }
}

export function parsePageAssets(raw: unknown): PageAssets | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null
  const value = raw as Record<string, unknown>
  return {
    hero: parseImage(value.hero),
    gallery: (Array.isArray(value.gallery) ? value.gallery : [])
      .map(parseImage)
      .filter((image): image is ImageAsset => Boolean(image))
      .slice(0, 9),
  }
}

function parseStats(value: unknown): Stat[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
    .map((s) => ({
      value: str(s.value, 24),
      label: str(s.label, 48),
      // verified не принимаем на веру как строку: только явный boolean true.
      verified: s.verified === true,
    }))
    .filter((s) => s.value.length > 0 && s.label.length > 0)
    .slice(0, 4)
}

export function parsePageContent(raw: unknown): PageContent | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null
  const c = raw as Record<string, unknown>

  const headline = str(c.headline, 120)
  if (!headline) return null

  const services = (Array.isArray(c.services) ? c.services : [])
    .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
    .map((s) => ({
      name: str(s.name, 70),
      description: str(s.description, 320),
      price: str(s.price, 32) || undefined,
    }))
    .filter((s) => s.name.length > 0)
    .slice(0, 6)

  if (services.length === 0) return null

  const features = (Array.isArray(c.features) ? c.features : [])
    .filter((f): f is Record<string, unknown> => !!f && typeof f === "object")
    .map((f) => ({ title: str(f.title, 90), description: str(f.description, 280) }))
    .filter((f) => f.title.length > 0)
    .slice(0, 6)

  const t = c.testimonial as Record<string, unknown> | null | undefined
  const testimonialText = t && typeof t === "object" ? str(t.text, 420) : ""

  return {
    businessName: str(c.businessName, 60) || "Компания",
    headline,
    subheadline: str(c.subheadline, 280),
    tagline: str(c.tagline, 48),
    services,
    features,
    stats: parseStats(c.stats),
    testimonial: testimonialText
      ? {
          text: testimonialText,
          author: str(t!.author, 60) || "Клиент",
          role: str(t!.role, 90),
        }
      : null,
    ctaHeadline: str(c.ctaHeadline, 60) || "Обсудить проект",
    ctaSubtext: str(c.ctaSubtext, 220),
    phone: str(c.phone, 24),
    email: str(c.email, 90),
    footerTagline: str(c.footerTagline, 70),
    geography: str(c.geography, 60) || undefined,
    guarantees: (Array.isArray(c.guarantees) ? c.guarantees : [])
      .map((g) => str(g, 140))
      .filter((g) => g.length > 0)
      .slice(0, 4),
  }
}
