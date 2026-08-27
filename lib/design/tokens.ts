// lib/design/tokens.ts — DesignSpec → CSS-переменные и шрифты.
//
// Секции не знают о конкретных цветах и размерах: они пользуются токенами.
// Благодаря этому одна и та же секция выглядит по-разному в разных спеках,
// а добавление новой палитры не требует правок в разметке.

import type { DesignSpec, FontPreset } from "./spec.ts"

// ─── Шрифты ───────────────────────────────────────────────────────────────────

interface FontDefinition {
  url: string
  body: string
  display: string
  /** Плакатные шрифты требуют капса и плотного трекинга. */
  displayUppercase?: boolean
}

/**
 * Список закрытый: имя семейства подставляется в CSS и в URL Google Fonts,
 * поэтому произвольная строка от модели здесь недопустима.
 */
const FONTS: Record<FontPreset, FontDefinition> = {
  grotesk: {
    url: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
    body: "'Manrope',system-ui,sans-serif",
    display: "'Manrope',system-ui,sans-serif",
  },
  "sans-modern": {
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
    body: "'Inter',system-ui,sans-serif",
    display: "'Inter',system-ui,sans-serif",
  },
  "serif-editorial": {
    url: "https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap",
    body: "'PT Sans',system-ui,sans-serif",
    display: "'PT Serif',Georgia,serif",
  },
  "serif-luxury": {
    url: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600&display=swap",
    body: "'Manrope',system-ui,sans-serif",
    display: "'Cormorant Garamond',Georgia,serif",
  },
  "condensed-bold": {
    url: "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@600;700;800;900&family=Roboto:wght@400;500;600&display=swap",
    body: "'Roboto',system-ui,sans-serif",
    display: "'Roboto Condensed',Arial Narrow,sans-serif",
    displayUppercase: true,
  },
  "mono-technical": {
    url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
    body: "'IBM Plex Sans',system-ui,sans-serif",
    display: "'IBM Plex Mono',ui-monospace,monospace",
  },
  "slab-institutional": {
    url: "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,600;0,700;1,400&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    body: "'IBM Plex Sans',system-ui,sans-serif",
    display: "'IBM Plex Serif',Georgia,serif",
  },
}

export function fontFor(preset: FontPreset): FontDefinition {
  return FONTS[preset] ?? FONTS.grotesk
}

// ─── Цвет ─────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/**
 * Относительная яркость по WCAG. Нужна, чтобы выбрать цвет текста НА акценте:
 * белые буквы на жёлтой кнопке — самая частая ошибка автогенерации.
 */
export function luminance(hex: string): number {
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [light, dark] = la > lb ? [la, lb] : [lb, la]
  return (light + 0.05) / (dark + 0.05)
}

/** Чёрный или белый текст поверх заданного фона — что контрастнее. */
export function readableOn(background: string): string {
  return contrastRatio(background, "#FFFFFF") >= contrastRatio(background, "#0A0A0F")
    ? "#FFFFFF"
    : "#0A0A0F"
}

/**
 * Акцент, гарантированно читаемый на фоне страницы.
 *
 * Пример проблемы: тёмно-синий #1E3A8A на тёмном фоне #0A0A0F даёт контраст
 * около 1.6 — текст практически не виден. Здесь такой акцент осветляется
 * до порога читаемости, вместо того чтобы уехать в продакшен как есть.
 */
export function accentOn(accent: string, background: string): string {
  if (contrastRatio(accent, background) >= 3.5) return accent

  const [r, g, b] = hexToRgb(accent)
  const towardsLight = luminance(background) < 0.5
  const toHex = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")

  for (let step = 1; step <= 10; step++) {
    const t = step / 10
    const mixed = towardsLight
      ? [r + (255 - r) * t, g + (255 - g) * t, b + (255 - b) * t]
      : [r * (1 - t), g * (1 - t), b * (1 - t)]
    const candidate = `#${toHex(mixed[0])}${toHex(mixed[1])}${toHex(mixed[2])}`.toUpperCase()
    if (contrastRatio(candidate, background) >= 3.5) return candidate
  }

  return towardsLight ? "#FFFFFF" : "#0A0A0F"
}

// ─── Токены ───────────────────────────────────────────────────────────────────

export interface Tokens {
  bg: string
  surface: string
  surfaceAlt: string
  border: string
  text: string
  textMuted: string
  accent: string
  accentAlt: string
  onAccent: string
  radiusSm: string
  radiusMd: string
  radiusLg: string
  sectionPadding: string
  gap: string
  containerWidth: string
  displayScale: string
  fontBody: string
  fontDisplay: string
  fontUrl: string
  displayTransform: string
  displayTracking: string
}

const DENSITY_TOKENS = {
  compact: { sectionPadding: "56px", gap: "12px" },
  regular: { sectionPadding: "80px", gap: "18px" },
  airy: { sectionPadding: "116px", gap: "28px" },
} as const

const RADIUS_TOKENS = {
  sharp: { sm: "0px", md: "0px", lg: "0px" },
  soft: { sm: "6px", md: "10px", lg: "14px" },
  round: { sm: "10px", md: "16px", lg: "24px" },
} as const

const LAYOUT_WIDTH = {
  contained: "1140px",
  wide: "1360px",
  asymmetric: "1240px",
} as const

const DISPLAY_SCALE = {
  tight: "clamp(30px,3.2vw,40px)",
  regular: "clamp(36px,4.4vw,56px)",
  // Верхняя граница намеренно ниже: превью генератора уже, чем полноценный
  // лендинг, и 72px превращали обычный русский оффер в плакат из 5–6 строк.
  dramatic: "clamp(40px,5.2vw,64px)",
} as const

export function buildTokens(spec: DesignSpec): Tokens {
  const dark = spec.palette.mode === "dark"
  const bg = dark ? "#0A0A0F" : "#FAFAF9"
  const font = fontFor(spec.typography.preset)
  const density = DENSITY_TOKENS[spec.density]
  const radius = RADIUS_TOKENS[spec.borderRadius]

  const accent = accentOn(spec.palette.accent, bg)
  const accentAlt = accentOn(spec.palette.accentAlt, bg)

  return {
    bg,
    surface: dark ? "#13131A" : "#FFFFFF",
    surfaceAlt: dark ? "#1C1C28" : "#F4F4F5",
    border: dark ? "rgba(255,255,255,.10)" : "rgba(9,9,11,.10)",
    text: dark ? "#FFFFFF" : "#111827",
    textMuted: dark ? "#A1A1B5" : "#5B5B6B",
    accent,
    accentAlt,
    // Текст на кнопке считается от РЕАЛЬНОГО цвета кнопки, а не задаётся белым
    // по умолчанию.
    onAccent: readableOn(accent),
    radiusSm: radius.sm,
    radiusMd: radius.md,
    radiusLg: radius.lg,
    sectionPadding: density.sectionPadding,
    gap: density.gap,
    containerWidth: LAYOUT_WIDTH[spec.layoutVariant],
    displayScale: DISPLAY_SCALE[spec.typography.scale],
    fontBody: font.body,
    fontDisplay: font.display,
    fontUrl: font.url,
    displayTransform: font.displayUppercase ? "uppercase" : "none",
    displayTracking: font.displayUppercase ? "-.5px" : "-1.5px",
  }
}

/** Токены как CSS-переменные — их и потребляют секции. */
export function tokensToCss(t: Tokens): string {
  return `:root{
--bg:${t.bg};
--surface:${t.surface};
--surface-alt:${t.surfaceAlt};
--border:${t.border};
--text:${t.text};
--text-muted:${t.textMuted};
--accent:${t.accent};
--accent-alt:${t.accentAlt};
--on-accent:${t.onAccent};
--r-sm:${t.radiusSm};
--r-md:${t.radiusMd};
--r-lg:${t.radiusLg};
--pad:${t.sectionPadding};
--gap:${t.gap};
--w:${t.containerWidth};
--display:${t.displayScale};
--font-body:${t.fontBody};
--font-display:${t.fontDisplay};
--display-transform:${t.displayTransform};
--display-tracking:${t.displayTracking};
}`
}
