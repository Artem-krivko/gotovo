import type { GeneratorStyle } from "../types.ts"
import { alignSpecToStyle, type DesignSpec } from "./spec.ts"

export type ArchetypeId =
  | "local-trust"
  | "technical-spec"
  | "editorial-story"
  | "conversion-direct"
  | "premium-craft"
  | "energetic-community"

export interface ArchetypePreset {
  id: ArchetypeId
  label: string
  description: string
  fit: RegExp
  styles: GeneratorStyle[]
  apply: (base: DesignSpec, style: GeneratorStyle) => DesignSpec
}

function finish(spec: DesignSpec, style: GeneratorStyle): DesignSpec {
  return alignSpecToStyle(spec, style)
}

export const ARCHETYPES: readonly ArchetypePreset[] = [
  {
    id: "local-trust",
    label: "Локальное доверие",
    description: "Понятная услуга, спокойная подача и быстрый контакт",
    fit: /стоматол|клиник|врач|юрист|бухгалт|ремонт|монтаж|строит|достав|клининг|ветеринар/iu,
    styles: ["modern", "minimal", "corporate"],
    apply: (base, style) => finish({
      ...base,
      sectionOrder: ["hero", "trust", "services", "advantages", "area", "process", "cases", "proof", "faq", "contact"],
      heroVariant: "centered",
      layoutVariant: "contained",
      palette: { ...base.palette, mode: "light" },
      typography: { preset: "sans-modern", scale: "regular" },
      density: "regular",
      borderRadius: "soft",
      cardStyle: "elevated",
      imageTreatment: "rounded",
      backgroundTreatment: "plain",
      ctaVariant: "solid",
      trustVariant: "cards",
      servicesVariant: "cards",
      processVariant: "timeline",
      faqVariant: "accordion",
      contactVariant: "boxed",
    }, style),
  },
  {
    id: "technical-spec",
    label: "Технический",
    description: "Точная структура, инженерный характер и этапы работы",
    fit: /монтаж|строит|экскават|септик|скважин|авто|производ|логист|солнеч|типограф|охран/iu,
    styles: ["modern", "bold", "corporate"],
    apply: (base, style) => finish({
      ...base,
      sectionOrder: ["hero", "services", "advantages", "process", "cases", "area", "trust", "faq", "contact"],
      heroVariant: base.heroVariant === "statement" ? "split-image" : "statement",
      layoutVariant: "wide",
      palette: { ...base.palette, mode: "dark" },
      typography: { preset: "mono-technical", scale: style === "bold" ? "dramatic" : "regular" },
      density: "compact",
      borderRadius: "sharp",
      cardStyle: "outlined",
      imageTreatment: "plain",
      backgroundTreatment: "grid",
      ctaVariant: "solid",
      trustVariant: "bar",
      servicesVariant: "numbered",
      processVariant: "steps-row",
      faqVariant: "two-column",
      contactVariant: "banner",
    }, style),
  },
  {
    id: "editorial-story",
    label: "Редакционный",
    description: "Воздух, выразительная типографика и спокойный ритм",
    fit: /фото|свадьб|архитект|интерьер|психолог|ателье|цвет|путешеств/iu,
    styles: ["modern", "minimal", "bold"],
    apply: (base, style) => finish({
      ...base,
      sectionOrder: ["hero", "gallery", "cases", "services", "advantages", "team", "trust", "proof", "process", "faq", "contact"],
      heroVariant: "editorial",
      layoutVariant: style === "corporate" ? "contained" : "asymmetric",
      palette: { ...base.palette, mode: "light" },
      typography: { preset: "serif-editorial", scale: "dramatic" },
      density: "airy",
      borderRadius: "soft",
      cardStyle: "flat",
      imageTreatment: "rounded",
      backgroundTreatment: "plain",
      ctaVariant: "underline",
      trustVariant: "editorial",
      servicesVariant: "list",
      galleryVariant: "masonry",
      processVariant: "timeline",
      faqVariant: "two-column",
      contactVariant: "minimal",
    }, style),
  },
  {
    id: "conversion-direct",
    label: "Сфокусированный",
    description: "Чёткая иерархия, сильный оффер и заметный следующий шаг",
    fit: /курс|школ|достав|услуг|магазин|агент|ремонт|клининг|недвижим/iu,
    styles: ["modern", "bold", "corporate"],
    apply: (base, style) => finish({
      ...base,
      sectionOrder: ["hero", "trust", "advantages", "services", "pricing", "cases", "process", "area", "faq", "contact"],
      heroVariant: "centered",
      layoutVariant: "wide",
      palette: { ...base.palette, mode: style === "bold" ? "dark" : base.palette.mode },
      typography: { preset: "grotesk", scale: "regular" },
      density: "compact",
      borderRadius: "round",
      cardStyle: "outlined",
      imageTreatment: "plain",
      backgroundTreatment: "aurora",
      ctaVariant: "gradient",
      trustVariant: "cards",
      servicesVariant: "alternating",
      processVariant: "accordion",
      faqVariant: "accordion",
      contactVariant: "split",
    }, style),
  },
  {
    id: "premium-craft",
    label: "Премиальный",
    description: "Материальность, детали и уверенная премиальная подача",
    fit: /салон|красот|ювелир|мебел|архитект|ателье|барбер|цвет/iu,
    styles: ["modern", "minimal", "bold"],
    apply: (base, style) => finish({
      ...base,
      sectionOrder: ["hero", "gallery", "cases", "services", "advantages", "team", "proof", "process", "trust", "faq", "contact"],
      heroVariant: "full-bleed",
      layoutVariant: "asymmetric",
      palette: { ...base.palette, mode: "dark" },
      typography: { preset: "serif-luxury", scale: "dramatic" },
      density: "airy",
      borderRadius: "soft",
      cardStyle: "flat",
      imageTreatment: "overlay",
      backgroundTreatment: "noise",
      ctaVariant: "outline",
      trustVariant: "editorial",
      servicesVariant: "alternating",
      galleryVariant: "story",
      processVariant: "timeline",
      faqVariant: "two-column",
      contactVariant: "minimal",
    }, style),
  },
  {
    id: "energetic-community",
    label: "Энергичный",
    description: "Движение, контраст и эмоциональный первый экран",
    fit: /фитнес|спорт|event|мероприят|ресторан|кафе|бар|музык/iu,
    styles: ["modern", "bold"],
    apply: (base, style) => finish({
      ...base,
      sectionOrder: ["hero", "services", "gallery", "advantages", "team", "cases", "trust", "process", "proof", "faq", "contact"],
      heroVariant: "full-bleed",
      layoutVariant: "wide",
      palette: { ...base.palette, mode: "dark" },
      typography: { preset: "condensed-bold", scale: "dramatic" },
      density: "regular",
      borderRadius: "sharp",
      cardStyle: "outlined",
      imageTreatment: "overlay",
      backgroundTreatment: "bands",
      ctaVariant: "solid",
      trustVariant: "bar",
      servicesVariant: "numbered",
      galleryVariant: "carousel",
      processVariant: "steps-row",
      faqVariant: "accordion",
      contactVariant: "banner",
    }, style),
  },
] as const
