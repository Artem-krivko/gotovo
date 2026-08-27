// lib/design/quality.ts — автоматические проверки качества страницы.
//
// Проверки работают ДО показа пользователю. Идея простая: любую проблему,
// которую можно поймать программно, нельзя выпускать в превью — именно на
// таких мелочах («метрики отрисовались дважды», «заголовок в три строки»,
// «CTA потерялся») результат и выглядел непрофессионально.
//
// Проверки специально дешёвые и синхронные: без запуска браузера, только
// анализ разметки и контента. Скриншотные проверки — отдельный слой поверх.

import type { DesignSpec, SectionId } from "./spec.ts"
import type { PageContent } from "./content.ts"
import { accentOn, contrastRatio } from "./tokens.ts"

export type IssueSeverity = "error" | "warning"

export interface QualityIssue {
  code: string
  severity: IssueSeverity
  message: string
}

export interface QualityReport {
  ok: boolean
  issues: QualityIssue[]
  /** Отпечаток композиции — для проверки разнообразия между результатами. */
  fingerprint: string
}

// ─── Признаки выдуманных фактов ───────────────────────────────────────────────

/**
 * Формулировки, которые невозможно подтвердить и которые модель любит
 * придумывать. Ловим именно утверждения о достижениях, а не любые цифры:
 * «работаем с 3 направлениями» — нормально, «более 500 клиентов» — нет.
 *
 * Границы слова заданы через (?<![\p{L}\p{N}]) с флагом u, а НЕ через \b:
 * в JavaScript \b опирается на ASCII-класс \w, поэтому перед кириллицей
 * никогда не срабатывает — паттерны вида /\bгарантия/ молча не работают.
 */
const FABRICATION_PATTERNS: Array<[RegExp, string]> = [
  [/(?<![\p{L}\p{N}])(более|свыше|уже)\s+\d[\d\s]*\s*(клиент|заказ|проект|пациент|объект)/iu, "количество клиентов"],
  [/\d[\d\s]*\+?\s*(довольных|счастливых)\s+клиент/iu, "количество довольных клиентов"],
  [/\d{1,3}\s*%\s*(успешн|выигранн|довольн|гарантир)/iu, "процент результатов"],
  [/\d[.,]\d\s*(из|\/)\s*5(?![\p{N}])/iu, "рейтинг"],
  [/(?<![\p{L}\p{N}])гарант\p{L}*\s+\d+\s*(год|лет|мес|дн)/iu, "срок гарантии"],
  [/(?<![\p{L}\p{N}])(сертифицирован|лицензирован|аккредитован)/iu, "сертификаты"],
  [/100\s*%\s*(возврат|гарант)/iu, "гарантия возврата"],
  [/(?<![\p{L}\p{N}])на\s+рынке\s+(с|уже)\s+\d{4}/iu, "год основания"],
  [/★{3,}/u, "рейтинг звёздами"],
]

function checkFabrication(content: PageContent): QualityIssue[] {
  // Проверяем только сгенерированный текст. Подтверждённые факты (stats с
  // verified, guarantees, реальный отзыв) пришли от владельца — их не трогаем.
  const generated = [
    content.headline,
    content.subheadline,
    content.tagline,
    content.ctaHeadline,
    content.ctaSubtext,
    content.footerTagline,
    ...content.services.flatMap((s) => [s.name, s.description]),
    ...content.features.flatMap((f) => [f.title, f.description]),
  ].join(" ")

  const issues: QualityIssue[] = []
  for (const [pattern, label] of FABRICATION_PATTERNS) {
    if (pattern.test(generated)) {
      issues.push({
        code: "fabricated_fact",
        severity: "error",
        message: `Похоже на выдуманный факт (${label}) в сгенерированном тексте`,
      })
    }
  }
  return issues
}

// ─── Проверки контента ────────────────────────────────────────────────────────

function checkContent(content: PageContent): QualityIssue[] {
  const issues: QualityIssue[] = []

  const headlineLength = content.headline.length
  if (headlineLength === 0) {
    issues.push({ code: "empty_headline", severity: "error", message: "Пустой заголовок" })
  } else if (headlineLength > 80) {
    // Длинный заголовок ломает первый экран: в hero он занимает 4+ строки
    // и вытесняет CTA за пределы вьюпорта на мобильном.
    issues.push({
      code: "headline_too_long",
      severity: "error",
      message: `Заголовок ${headlineLength} символов — на мобильном займёт слишком много строк`,
    })
  } else if (headlineLength < 12) {
    issues.push({
      code: "headline_too_short",
      severity: "warning",
      message: `Заголовок всего ${headlineLength} символов — вероятно, неинформативен`,
    })
  }

  if (content.services.length < 2) {
    issues.push({
      code: "too_few_services",
      severity: "error",
      message: "Меньше двух услуг — секция выглядит пустой",
    })
  }

  for (const service of content.services) {
    if (service.description.length < 25) {
      issues.push({
        code: "thin_service_description",
        severity: "warning",
        message: `Слишком короткое описание услуги «${service.name}»`,
      })
    }
  }

  // Повтор одного и того же текста в разных полях — типичный признак того,
  // что модель «залипла» и не наполнила блок.
  const descriptions = content.services.map((s) => s.description.trim().toLowerCase())
  if (new Set(descriptions).size !== descriptions.length) {
    issues.push({
      code: "duplicate_content",
      severity: "error",
      message: "Описания услуг повторяются",
    })
  }

  if (!content.ctaHeadline.trim()) {
    issues.push({ code: "missing_cta", severity: "error", message: "Пустой заголовок CTA" })
  }

  return issues
}

// ─── Проверки разметки ────────────────────────────────────────────────────────

function checkMarkup(html: string, rendered: SectionId[]): QualityIssue[] {
  const issues: QualityIssue[] = []

  if (!html.startsWith("<!DOCTYPE html>") || !html.includes("</html>")) {
    issues.push({ code: "broken_html", severity: "error", message: "HTML-документ неполный" })
  }

  // Незакрытые секции — самый заметный симптом сломанной вёрстки.
  const opened = (html.match(/<section\b/g) ?? []).length
  const closed = (html.match(/<\/section>/g) ?? []).length
  if (opened !== closed) {
    issues.push({
      code: "unbalanced_sections",
      severity: "error",
      message: `Незакрытые секции: ${opened} открыто, ${closed} закрыто`,
    })
  }

  // Пустая интерполяция — след необработанного undefined в шаблоне.
  if (/>\s*undefined\s*</.test(html) || html.includes("[object Object]")) {
    issues.push({
      code: "unrendered_value",
      severity: "error",
      message: "В разметке остались undefined или [object Object]",
    })
  }

  for (const required of ["hero", "services", "contact"] as const) {
    if (!rendered.includes(required)) {
      issues.push({
        code: "missing_section",
        severity: "error",
        message: `Не отрисована обязательная секция «${required}»`,
      })
    }
  }

  // Дубли секций: один и тот же блок дважды выглядит как ошибка сборки.
  const duplicates = rendered.filter((s, i) => rendered.indexOf(s) !== i)
  if (duplicates.length > 0) {
    issues.push({
      code: "duplicate_section",
      severity: "error",
      message: `Секция отрисована дважды: ${[...new Set(duplicates)].join(", ")}`,
    })
  }

  if (!html.includes('id="contact"')) {
    issues.push({
      code: "missing_contact_anchor",
      severity: "error",
      message: "Нет якоря #contact — кнопки в hero ведут в никуда",
    })
  }

  if (!/<meta http-equiv="Content-Security-Policy"/.test(html)) {
    issues.push({ code: "missing_csp", severity: "error", message: "Нет CSP в документе" })
  }

  // Доступность: у каждой картинки должен быть alt.
  const imagesWithoutAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) ?? []).length
  if (imagesWithoutAlt > 0) {
    issues.push({
      code: "image_without_alt",
      severity: "warning",
      message: `Изображений без alt: ${imagesWithoutAlt}`,
    })
  }

  if (!/<h1[ >]/.test(html)) {
    issues.push({ code: "missing_h1", severity: "error", message: "На странице нет h1" })
  } else if ((html.match(/<h1[ >]/g) ?? []).length > 1) {
    issues.push({ code: "multiple_h1", severity: "warning", message: "Больше одного h1" })
  }

  return issues
}

// ─── Проверки дизайна ─────────────────────────────────────────────────────────

function checkDesign(spec: DesignSpec): QualityIssue[] {
  const issues: QualityIssue[] = []
  const bg = spec.palette.mode === "dark" ? "#0A0A0F" : "#FAFAF9"

  // Контраст проверяем по исходному цвету: accentOn его чинит, но если
  // коррекция понадобилась — значит арт-директор выбрал нечитаемое сочетание,
  // и об этом полезно знать.
  const rawRatio = contrastRatio(spec.palette.accent, bg)
  const fixedRatio = contrastRatio(accentOn(spec.palette.accent, bg), bg)

  if (fixedRatio < 3.5) {
    issues.push({
      code: "low_contrast",
      severity: "error",
      message: `Акцент нечитаем на фоне даже после коррекции (${fixedRatio.toFixed(2)})`,
    })
  } else if (rawRatio < 3.5) {
    issues.push({
      code: "contrast_corrected",
      severity: "warning",
      message: `Акцент ${spec.palette.accent} пришлось осветлить: исходный контраст ${rawRatio.toFixed(2)}`,
    })
  }

  return issues
}

// ─── Отпечаток композиции ─────────────────────────────────────────────────────

/**
 * Строка, описывающая ВИЗУАЛЬНЫЕ решения. Две страницы с одинаковым отпечатком
 * выглядят одинаково, даже если тексты разные — ровно это и происходило до
 * появления DesignSpec.
 */
export function specFingerprint(spec: DesignSpec): string {
  return [
    spec.sectionOrder.join(">"),
    spec.heroVariant,
    spec.servicesVariant,
    spec.processVariant,
    spec.contactVariant,
    spec.faqVariant,
    spec.typography.preset,
    spec.palette.mode,
    spec.cardStyle,
    spec.density,
    spec.borderRadius,
    spec.backgroundTreatment,
  ].join("|")
}

// ─── Точка входа ──────────────────────────────────────────────────────────────

export function checkQuality(
  html: string,
  content: PageContent,
  spec: DesignSpec,
  renderedSections: SectionId[]
): QualityReport {
  const issues = [
    ...checkMarkup(html, renderedSections),
    ...checkContent(content),
    ...checkFabrication(content),
    ...checkDesign(spec),
  ]

  return {
    ok: !issues.some((i) => i.severity === "error"),
    issues,
    fingerprint: specFingerprint(spec),
  }
}
