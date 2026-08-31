// lib/design/spec.ts — DesignSpec: типизированные решения арт-директора.
//
// ЗАЧЕМ ЭТО СУЩЕСТВУЕТ
//
// Раньше «генератор дизайна» не генерировал дизайн. Модель возвращала 14
// текстовых полей и один accentColor, а верстку выбирал ПОЛЬЗОВАТЕЛЬ из четырёх
// радиокнопок. Все четыре шаблона имели один и тот же скелет:
//   hero → services → process → отзыв → FAQ → контакты,
// жёстко по 3 услуги, 3 преимущества, 3 цифры. Поэтому стоматология и
// строительная компания получали композиционно идентичную страницу,
// отличающуюся словами и одним цветом.
//
// DesignSpec делает композицию данными: порядок секций, вариант каждой секции,
// плотность, скругления, тип карточек, фон и типографика становятся полем,
// которое можно осознанно выбрать — и провалидировать.
//
// БЕЗОПАСНОСТЬ: спека приходит от модели, поэтому каждое поле проверяется по
// allow-list (см. parseDesignSpec). Произвольный HTML/CSS модель прислать не
// может в принципе — она выбирает только из перечислений.

// ─── Секции ───────────────────────────────────────────────────────────────────

export const SECTION_IDS = [
  "hero",
  "trust",
  "services",
  "process",
  "proof",
  "gallery",
  "advantages",
  "cases",
  "pricing",
  "team",
  "area",
  "beforeAfter",
  "faq",
  "contact",
] as const

export type SectionId = (typeof SECTION_IDS)[number]

/** Секции, без которых страница не имеет смысла. */
export const REQUIRED_SECTIONS: SectionId[] = ["hero", "services", "contact"]

// ─── Варианты ─────────────────────────────────────────────────────────────────

export const HERO_VARIANTS = [
  "split-image", // текст слева, изображение справа
  "centered", // всё по центру, крупная типографика
  "editorial", // крупный serif-заголовок, изображение полосой под ним
  "full-bleed", // изображение на всю ширину, текст поверх
  "statement", // только типографика, без изображения
] as const

export const SERVICES_VARIANTS = [
  "cards", // сетка карточек
  "list", // редакционный список строками
  "numbered", // крупные номера + описание
  "alternating", // чередование текст/изображение
] as const

export const TRUST_VARIANTS = [
  "bar", // компактная полоса с цифрами
  "cards", // самостоятельные карточки подтверждённых показателей
  "editorial", // крупная типографическая подача с поясняющим заголовком
] as const

export const PROOF_VARIANTS = [
  "stats-bar", // полоса метрик
  "quote", // отзыв (только если он реальный)
  "logos", // плашки клиентов/партнёров
  "none", // блока нет
] as const

export const PROCESS_VARIANTS = ["steps-row", "timeline", "accordion"] as const
export const GALLERY_VARIANTS = ["story", "grid", "masonry", "carousel", "none"] as const
export const FAQ_VARIANTS = ["accordion", "two-column"] as const
export const CONTACT_VARIANTS = ["banner", "split", "boxed", "minimal"] as const

export const LAYOUT_VARIANTS = ["contained", "wide", "asymmetric"] as const
export const DENSITY = ["compact", "regular", "airy"] as const
export const RADIUS = ["sharp", "soft", "round"] as const
export const CARD_STYLES = ["flat", "outlined", "elevated", "glass"] as const
export const IMAGE_TREATMENTS = ["plain", "rounded", "overlay", "duotone"] as const
export const BACKGROUND_TREATMENTS = [
  "plain",
  "aurora",
  "grid",
  "noise",
  "bands",
] as const
export const CTA_VARIANTS = ["gradient", "solid", "outline", "underline"] as const

export type HeroVariant = (typeof HERO_VARIANTS)[number]
export type ServicesVariant = (typeof SERVICES_VARIANTS)[number]
export type TrustVariant = (typeof TRUST_VARIANTS)[number]
export type ProofVariant = (typeof PROOF_VARIANTS)[number]
export type ProcessVariant = (typeof PROCESS_VARIANTS)[number]
export type GalleryVariant = (typeof GALLERY_VARIANTS)[number]
export type FaqVariant = (typeof FAQ_VARIANTS)[number]
export type ContactVariant = (typeof CONTACT_VARIANTS)[number]
export type LayoutVariant = (typeof LAYOUT_VARIANTS)[number]
export type Density = (typeof DENSITY)[number]
export type Radius = (typeof RADIUS)[number]
export type CardStyle = (typeof CARD_STYLES)[number]
export type ImageTreatment = (typeof IMAGE_TREATMENTS)[number]
export type BackgroundTreatment = (typeof BACKGROUND_TREATMENTS)[number]
export type CtaVariant = (typeof CTA_VARIANTS)[number]

// ─── Палитра и типографика ────────────────────────────────────────────────────

export interface Palette {
  /** Светлая или тёмная схема — влияет на все производные цвета. */
  mode: "light" | "dark"
  accent: string
  /** Второй акцент для градиентов; равен accent, если градиент не нужен. */
  accentAlt: string
}

/**
 * Наборы шрифтов заданы пресетами, а не свободной строкой: имя семейства
 * попадает в CSS и в URL Google Fonts, поэтому произвольное значение от модели
 * было бы вектором инъекции. Пресет — это индекс в проверенном списке.
 */
export const FONT_PRESETS = [
  "grotesk", // Manrope — нейтральный технологичный
  "sans-modern", // Inter — дружелюбный современный
  "serif-editorial", // PT Serif + PT Sans — редакционный
  "serif-luxury", // Cormorant Garamond + Manrope — премиальный
  "condensed-bold", // Roboto Condensed + Roboto — плакатный, спортивный
  "mono-technical", // IBM Plex Mono + Sans — инженерный
  "slab-institutional", // IBM Plex Serif + Sans — институциональный
] as const

export type FontPreset = (typeof FONT_PRESETS)[number]

export interface Typography {
  preset: FontPreset
  /** Масштаб заголовков относительно базового. */
  scale: "tight" | "regular" | "dramatic"
}

// ─── Спека ────────────────────────────────────────────────────────────────────

export interface DesignSpec {
  sectionOrder: SectionId[]
  heroVariant: HeroVariant
  layoutVariant: LayoutVariant
  palette: Palette
  typography: Typography
  density: Density
  borderRadius: Radius
  cardStyle: CardStyle
  imageTreatment: ImageTreatment
  backgroundTreatment: BackgroundTreatment
  ctaVariant: CtaVariant
  trustVariant: TrustVariant
  servicesVariant: ServicesVariant
  proofVariant: ProofVariant
  processVariant: ProcessVariant
  galleryVariant: GalleryVariant
  faqVariant: FaqVariant
  contactVariant: ContactVariant
}

// ─── Валидация ────────────────────────────────────────────────────────────────

const HEX = /^#[0-9A-Fa-f]{6}$/

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

function pickColor(value: unknown, fallback: string): string {
  return typeof value === "string" && HEX.test(value.trim())
    ? value.trim().toUpperCase()
    : fallback
}

/**
 * Порядок секций от модели: отбрасываем неизвестные и дубли, гарантируем
 * наличие обязательных. hero всегда первый, contact всегда последний —
 * это не вкусовое решение, а требование к посадочной странице.
 */
function parseSectionOrder(value: unknown): SectionId[] {
  const raw = Array.isArray(value) ? value : []
  const seen = new Set<SectionId>()

  for (const item of raw) {
    if (typeof item !== "string") continue
    if (!(SECTION_IDS as readonly string[]).includes(item)) continue
    seen.add(item as SectionId)
  }

  for (const required of REQUIRED_SECTIONS) seen.add(required)

  const ordered = [...seen].filter((s) => s !== "hero" && s !== "contact")
  return ["hero", ...ordered, "contact"]
}

export function parseDesignSpec(raw: unknown, fallback: DesignSpec): DesignSpec {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback

  const d = raw as Record<string, unknown>
  const palette = (d.palette ?? {}) as Record<string, unknown>
  const typography = (d.typography ?? {}) as Record<string, unknown>

  const accent = pickColor(palette.accent, fallback.palette.accent)

  return {
    sectionOrder: parseSectionOrder(d.sectionOrder),
    heroVariant: pick(d.heroVariant, HERO_VARIANTS, fallback.heroVariant),
    layoutVariant: pick(d.layoutVariant, LAYOUT_VARIANTS, fallback.layoutVariant),
    palette: {
      mode: pick(palette.mode, ["light", "dark"] as const, fallback.palette.mode),
      accent,
      // Второй акцент по умолчанию совпадает с основным: так градиент
      // вырождается в сплошную заливку вместо случайного цветового пятна.
      accentAlt: pickColor(palette.accentAlt, accent),
    },
    typography: {
      preset: pick(typography.preset, FONT_PRESETS, fallback.typography.preset),
      scale: pick(
        typography.scale,
        ["tight", "regular", "dramatic"] as const,
        fallback.typography.scale
      ),
    },
    density: pick(d.density, DENSITY, fallback.density),
    borderRadius: pick(d.borderRadius, RADIUS, fallback.borderRadius),
    cardStyle: pick(d.cardStyle, CARD_STYLES, fallback.cardStyle),
    imageTreatment: pick(d.imageTreatment, IMAGE_TREATMENTS, fallback.imageTreatment),
    backgroundTreatment: pick(
      d.backgroundTreatment,
      BACKGROUND_TREATMENTS,
      fallback.backgroundTreatment
    ),
    ctaVariant: pick(d.ctaVariant, CTA_VARIANTS, fallback.ctaVariant),
    trustVariant: pick(d.trustVariant, TRUST_VARIANTS, fallback.trustVariant),
    servicesVariant: pick(d.servicesVariant, SERVICES_VARIANTS, fallback.servicesVariant),
    proofVariant: pick(d.proofVariant, PROOF_VARIANTS, fallback.proofVariant),
    processVariant: pick(d.processVariant, PROCESS_VARIANTS, fallback.processVariant),
    galleryVariant: pick(d.galleryVariant, GALLERY_VARIANTS, fallback.galleryVariant),
    faqVariant: pick(d.faqVariant, FAQ_VARIANTS, fallback.faqVariant),
    contactVariant: pick(d.contactVariant, CONTACT_VARIANTS, fallback.contactVariant),
  }
}

// ─── Базовые спеки ────────────────────────────────────────────────────────────

/**
 * Отправная точка, когда модель недоступна. Сохраняет прежние четыре «стиля»
 * как осмысленные пресеты — но теперь это лишь стартовое значение спеки,
 * а не единственный доступный вид страницы.
 */
export const BASE_SPECS: Record<string, DesignSpec> = {
  modern: {
    sectionOrder: ["hero", "trust", "services", "process", "proof", "faq", "contact"],
    heroVariant: "split-image",
    layoutVariant: "contained",
    palette: { mode: "dark", accent: "#7C3AED", accentAlt: "#3B82F6" },
    typography: { preset: "grotesk", scale: "regular" },
    density: "regular",
    borderRadius: "round",
    cardStyle: "glass",
    imageTreatment: "overlay",
    backgroundTreatment: "aurora",
    ctaVariant: "gradient",
    trustVariant: "cards",
    servicesVariant: "cards",
    proofVariant: "stats-bar",
    processVariant: "steps-row",
    galleryVariant: "none",
    faqVariant: "accordion",
    contactVariant: "boxed",
  },
  minimal: {
    sectionOrder: ["hero", "services", "process", "proof", "faq", "contact"],
    heroVariant: "editorial",
    layoutVariant: "contained",
    palette: { mode: "light", accent: "#111827", accentAlt: "#111827" },
    typography: { preset: "serif-editorial", scale: "dramatic" },
    density: "airy",
    borderRadius: "soft",
    cardStyle: "flat",
    imageTreatment: "rounded",
    backgroundTreatment: "plain",
    ctaVariant: "underline",
    trustVariant: "editorial",
    servicesVariant: "list",
    proofVariant: "stats-bar",
    processVariant: "timeline",
    galleryVariant: "none",
    faqVariant: "accordion",
    contactVariant: "minimal",
  },
  bold: {
    sectionOrder: ["hero", "services", "trust", "process", "faq", "contact"],
    heroVariant: "statement",
    layoutVariant: "wide",
    palette: { mode: "dark", accent: "#DC2626", accentAlt: "#EA580C" },
    typography: { preset: "condensed-bold", scale: "dramatic" },
    density: "compact",
    borderRadius: "sharp",
    cardStyle: "outlined",
    imageTreatment: "duotone",
    backgroundTreatment: "bands",
    ctaVariant: "solid",
    trustVariant: "bar",
    servicesVariant: "numbered",
    proofVariant: "stats-bar",
    processVariant: "steps-row",
    galleryVariant: "none",
    faqVariant: "two-column",
    contactVariant: "banner",
  },
  corporate: {
    sectionOrder: ["hero", "trust", "services", "process", "proof", "faq", "contact"],
    heroVariant: "split-image",
    layoutVariant: "contained",
    palette: { mode: "light", accent: "#1D4ED8", accentAlt: "#1E3A8A" },
    typography: { preset: "slab-institutional", scale: "regular" },
    density: "regular",
    borderRadius: "soft",
    cardStyle: "elevated",
    imageTreatment: "rounded",
    backgroundTreatment: "grid",
    ctaVariant: "solid",
    trustVariant: "cards",
    servicesVariant: "cards",
    proofVariant: "stats-bar",
    processVariant: "timeline",
    galleryVariant: "none",
    faqVariant: "accordion",
    contactVariant: "split",
  },
}

export function baseSpecFor(style: string): DesignSpec {
  return BASE_SPECS[style] ?? BASE_SPECS.modern
}

/**
 * Модель отвечает за разнообразие внутри выбранного направления, но не должна
 * превращать «корпоративный» запрос в плакатный industrial. Это последний
 * детерминированный слой согласования с явным выбором пользователя.
 */
export function alignSpecToStyle(spec: DesignSpec, style: string): DesignSpec {
  if (style === "corporate") {
    return {
      ...spec,
      typography: {
        preset:
          spec.typography.preset === "condensed-bold" || spec.typography.preset === "serif-luxury"
            ? "slab-institutional"
            : spec.typography.preset,
        scale: spec.typography.scale === "dramatic" ? "regular" : spec.typography.scale,
      },
      backgroundTreatment: spec.backgroundTreatment === "bands" ? "grid" : spec.backgroundTreatment,
      borderRadius: spec.borderRadius === "sharp" ? "soft" : spec.borderRadius,
    }
  }

  if (style === "minimal") {
    return {
      ...spec,
      typography: {
        preset:
          spec.typography.preset === "condensed-bold" || spec.typography.preset === "mono-technical"
            ? "serif-editorial"
            : spec.typography.preset,
        scale: spec.typography.scale,
      },
      backgroundTreatment: spec.backgroundTreatment === "bands" ? "plain" : spec.backgroundTreatment,
    }
  }

  return spec
}

// ─── Быстрые правки спеки ─────────────────────────────────────────────────────

export const SPEC_ADJUSTMENTS = [
  "premium",
  "airier",
  "brighter",
  "stricter",
  "other-hero",
  "other-structure",
] as const

export type SpecAdjustment = (typeof SPEC_ADJUSTMENTS)[number]

function rotate<T>(list: readonly T[], current: T): T {
  const i = list.indexOf(current)
  return list[(i + 1) % list.length]
}

/**
 * Правки применяются к спеке локально, без повторного обращения к модели:
 * страница пересобирается из того же контента за миллисекунды и без затрат
 * на генерацию. Именно поэтому композиция вынесена в данные.
 */
export function adjustSpec(spec: DesignSpec, adjustment: SpecAdjustment): DesignSpec {
  switch (adjustment) {
    case "premium":
      return {
        ...spec,
        density: "airy",
        typography: { preset: "serif-luxury", scale: "dramatic" },
        cardStyle: "flat",
        borderRadius: "soft",
        imageTreatment: "rounded",
        backgroundTreatment: "plain",
        ctaVariant: "underline",
      }
    case "airier":
      return {
        ...spec,
        density: spec.density === "compact" ? "regular" : "airy",
        cardStyle: spec.cardStyle === "elevated" ? "flat" : spec.cardStyle,
      }
    case "brighter":
      return {
        ...spec,
        palette: { ...spec.palette, mode: "light" },
        backgroundTreatment: spec.backgroundTreatment === "plain" ? "grid" : spec.backgroundTreatment,
        ctaVariant: "gradient",
      }
    case "stricter":
      return {
        ...spec,
        palette: { ...spec.palette, accentAlt: spec.palette.accent },
        typography: { preset: "slab-institutional", scale: "tight" },
        cardStyle: "outlined",
        borderRadius: "sharp",
        backgroundTreatment: "plain",
        ctaVariant: "solid",
        imageTreatment: "plain",
      }
    case "other-hero":
      return { ...spec, heroVariant: rotate(HERO_VARIANTS, spec.heroVariant) }
    case "other-structure": {
      // Меняем и порядок секций, и оформление блоков — иначе «другая
      // структура» ощущается как та же страница с переставленными абзацами.
      const middle = spec.sectionOrder.filter((s) => s !== "hero" && s !== "contact")
      const rotated = middle.length > 1 ? [...middle.slice(1), middle[0]] : middle
      return {
        ...spec,
        sectionOrder: ["hero", ...rotated, "contact"],
        trustVariant: rotate(TRUST_VARIANTS, spec.trustVariant),
        servicesVariant: rotate(SERVICES_VARIANTS, spec.servicesVariant),
        processVariant: rotate(PROCESS_VARIANTS, spec.processVariant),
        galleryVariant: rotate(GALLERY_VARIANTS, spec.galleryVariant),
        contactVariant: rotate(CONTACT_VARIANTS, spec.contactVariant),
      }
    }
  }
}
