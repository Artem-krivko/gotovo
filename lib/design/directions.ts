import type { GeneratorStyle } from "../types.ts"
import { ARCHETYPES } from "./archetypes.ts"
import { specDistance } from "./quality.ts"
import type { DesignSpec } from "./spec.ts"

export type DesignDirectionId = "recommended" | string

export interface DesignDirection {
  id: DesignDirectionId
  label: string
  description: string
  spec: DesignSpec
}

function hash(value: string): number {
  let result = 0
  for (let index = 0; index < value.length; index += 1) {
    result = Math.imul(31, result) + value.charCodeAt(index) | 0
  }
  return result >>> 0
}

/**
 * The AI recommendation stays first. Two alternatives come from a niche-aware
 * pool and must be materially different from every direction already chosen.
 */
export function curateDesignDirections(
  base: DesignSpec,
  style: GeneratorStyle,
  businessType: string,
  userDescription = ""
): DesignDirection[] {
  const context = `${businessType} ${userDescription}`
  const candidates = ARCHETYPES
    .map((preset) => ({
      preset,
      spec: preset.apply(base, style),
      score:
        (preset.fit.test(context) ? 100 : 0) +
        (preset.styles.includes(style) ? 20 : 0) +
        (hash(`${context}:${preset.id}`) % 17),
    }))
    .sort((a, b) => b.score - a.score)

  const selected: DesignDirection[] = [{
    id: "recommended",
    label: "AI-рекомендация",
    description: "Баланс бренда, структуры и конверсии",
    spec: base,
  }]

  for (const candidate of candidates) {
    if (selected.length === 3) break
    const distinct = selected.every((current) =>
      current.spec.heroVariant !== candidate.spec.heroVariant &&
      specDistance(current.spec, candidate.spec) >= 8
    )
    if (!distinct) continue
    selected.push({
      id: candidate.preset.id,
      label: candidate.preset.label,
      description: candidate.preset.description,
      spec: candidate.spec,
    })
  }

  // The pool is deliberately redundant, but keep a graceful fallback if a
  // future style alignment makes several presets converge.
  if (selected.length < 3) {
    for (const candidate of candidates) {
      if (selected.length === 3) break
      if (selected.some((item) => item.id === candidate.preset.id)) continue
      if (selected.every((item) => specDistance(item.spec, candidate.spec) >= 8)) {
        selected.push({
          id: candidate.preset.id,
          label: candidate.preset.label,
          description: candidate.preset.description,
          spec: candidate.spec,
        })
      }
    }
  }

  return selected
}
