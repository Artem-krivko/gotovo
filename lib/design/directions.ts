import type { GeneratorStyle } from "../types.ts"
import type { DesignSpec } from "./spec.ts"

export type DesignDirectionId = "recommended" | "editorial" | "focus"

export interface DesignDirection {
  id: DesignDirectionId
  label: string
  description: string
  spec: DesignSpec
}

const EXPRESSIVE_NICHE = /(фитнес|спорт|кофе|кафе|ресторан|салон|красот|фото|видео|fashion|event)/iu

/**
 * Три направления из одной AI-спеки. Модель создаёт содержание и исходную
 * арт-дирекцию один раз; остальные концепты — кураторские комбинации нашей
 * библиотеки. Поэтому сравнение не расходует ещё два AI-запроса.
 */
export function curateDesignDirections(
  base: DesignSpec,
  style: GeneratorStyle,
  businessType: string
): DesignDirection[] {
  const expressive = EXPRESSIVE_NICHE.test(businessType)

  const editorial: DesignSpec = {
    ...base,
    sectionOrder: ["hero", "services", "proof", "process", "faq", "contact"],
    heroVariant: "editorial",
    layoutVariant: style === "corporate" ? "contained" : "asymmetric",
    palette: { ...base.palette, mode: "light" },
    typography: {
      preset: expressive ? "serif-luxury" : "serif-editorial",
      scale: "dramatic",
    },
    density: "airy",
    borderRadius: "soft",
    cardStyle: "flat",
    imageTreatment: "rounded",
    backgroundTreatment: "plain",
    ctaVariant: "underline",
    servicesVariant: "list",
    processVariant: "timeline",
    faqVariant: "two-column",
    contactVariant: "minimal",
  }

  const focusTypography =
    style === "minimal" || style === "corporate" || !expressive
      ? "sans-modern"
      : "condensed-bold"

  const focus: DesignSpec = {
    ...base,
    sectionOrder: ["hero", "trust", "services", "process", "proof", "faq", "contact"],
    heroVariant: expressive ? "full-bleed" : "split-image",
    layoutVariant: "wide",
    palette: { ...base.palette, mode: expressive ? "dark" : base.palette.mode },
    typography: { preset: focusTypography, scale: expressive ? "dramatic" : "regular" },
    density: "regular",
    borderRadius: expressive ? "sharp" : "round",
    cardStyle: expressive ? "outlined" : "elevated",
    imageTreatment: expressive ? "overlay" : "plain",
    backgroundTreatment: expressive ? "noise" : "grid",
    ctaVariant: "solid",
    servicesVariant: expressive ? "numbered" : "cards",
    processVariant: expressive ? "steps-row" : "accordion",
    faqVariant: "accordion",
    contactVariant: expressive ? "banner" : "boxed",
  }

  return [
    {
      id: "recommended",
      label: "AI-рекомендация",
      description: "Баланс бренда, структуры и конверсии",
      spec: base,
    },
    {
      id: "editorial",
      label: "Редакционный",
      description: "Воздух, выразительная типографика и спокойный ритм",
      spec: editorial,
    },
    {
      id: "focus",
      label: expressive ? "Энергичный" : "Сфокусированный",
      description: expressive
        ? "Контрастный первый экран и динамичная подача"
        : "Чёткая иерархия, доверие и сильный призыв к действию",
      spec: focus,
    },
  ]
}
