// lib/__tests__/compose.test.mts — тесты гибридного рендерера.
//
// Главный тест здесь — diversity: он фиксирует ровно ту проблему, ради которой
// затевался DesignSpec. Раньше все четыре шаблона имели один скелет
// (hero → services → process → отзыв → FAQ → контакты), и стоматология со
// строительной компанией получали композиционно идентичную страницу.

import { test, describe } from "node:test"
import assert from "node:assert/strict"

import { composePage } from "../design/compose.ts"
import { adjustSpec, baseSpecFor, parseDesignSpec, type DesignSpec } from "../design/spec.ts"
import { accentOn, contrastRatio, readableOn } from "../design/tokens.ts"
import type { PageContent } from "../design/content.ts"

function content(overrides: Partial<PageContent> = {}): PageContent {
  return {
    businessName: "Тестовая компания",
    headline: "Заголовок страницы",
    subheadline: "Подзаголовок с описанием сути услуги.",
    tagline: "Слоган",
    services: [
      { name: "Первая услуга", description: "Описание первой услуги." },
      { name: "Вторая услуга", description: "Описание второй услуги." },
      { name: "Третья услуга", description: "Описание третьей услуги." },
    ],
    features: [
      { title: "Первый шаг", description: "Описание первого шага." },
      { title: "Второй шаг", description: "Описание второго шага." },
    ],
    stats: [
      { value: "—", label: "лет на рынке", verified: false },
      { value: "—", label: "проектов", verified: false },
      { value: "—", label: "клиентов", verified: false },
    ],
    testimonial: null,
    ctaHeadline: "Обсудить проект",
    ctaSubtext: "Расскажите о задаче.",
    phone: "+375 29 000-00-00",
    email: "info@example.by",
    footerTagline: "Слоган в подвале",
    gallery: [],
    guarantees: [],
    ...overrides,
  }
}

/** Структурный отпечаток страницы: порядок секций + ключевые классы вёрстки. */
function layoutFingerprint(html: string): string {
  const sections = [...html.matchAll(/<section[^>]*(?:id|class)="([^"]+)"/g)].map((m) => m[1])
  const layoutClasses = [
    "hero-split", "hero-centered", "hero-editorial", "hero-full", "hero-statement",
    "svc-grid", "svc-list", "svc-numbered", "svc-alt",
    "steps-row", "timeline", "proc-acc",
    "contact-banner", "contact-split", "contact-box",
    "faq-acc", "faq-cols",
  ].filter((cls) => html.includes(`class="${cls}"`) || html.includes(` ${cls}"`))
  return `${sections.join(">")}|${layoutClasses.join(",")}`
}

// ─── Разнообразие композиции ──────────────────────────────────────────────────

describe("разнообразие композиции", () => {
  test("четыре базовые спеки дают четыре разные структуры", () => {
    const fingerprints = ["modern", "minimal", "bold", "corporate"].map((style) =>
      layoutFingerprint(composePage(content(), baseSpecFor(style)).html)
    )

    const unique = new Set(fingerprints)
    assert.equal(
      unique.size,
      4,
      `Ожидались 4 разные композиции, получено ${unique.size}:\n${fingerprints.join("\n")}`
    )
  })

  test("полоса метрик не дублируется", () => {
    // proofVariant "stats-bar" рендерит ту же полосу, что и секция trust.
    // В corporate обе присутствовали одновременно — страница получала
    // два одинаковых блока метрик.
    const spec = {
      ...baseSpecFor("corporate"),
      sectionOrder: ["hero", "trust", "services", "proof", "contact"] as const,
      proofVariant: "stats-bar" as const,
    }
    const { html } = composePage(content(), { ...spec, sectionOrder: [...spec.sectionOrder] })
    assert.equal(
      (html.match(/class="trust"/g) ?? []).length,
      1,
      "Полоса метрик отрисовалась дважды"
    )
  })

  test("разные спеки меняют порядок секций, а не только цвета", () => {
    const modern = composePage(content(), baseSpecFor("modern")).renderedSections
    const bold = composePage(content(), baseSpecFor("bold")).renderedSections
    assert.notDeepEqual(modern, bold, "Порядок секций совпал у modern и bold")
  })

  test("каждый heroVariant даёт свою вёрстку", () => {
    const base = baseSpecFor("modern")
    const variants: DesignSpec["heroVariant"][] = [
      "split-image", "centered", "editorial", "full-bleed", "statement",
    ]
    const seen = new Set(
      variants.map((heroVariant) =>
        layoutFingerprint(composePage(content(), { ...base, heroVariant }).html)
      )
    )
    assert.equal(seen.size, variants.length, "Некоторые hero-варианты отрисовались одинаково")
  })

  test("каждый servicesVariant даёт свою вёрстку", () => {
    const base = baseSpecFor("modern")
    const variants: DesignSpec["servicesVariant"][] = ["cards", "list", "numbered", "alternating"]
    const seen = new Set(
      variants.map((servicesVariant) =>
        layoutFingerprint(composePage(content(), { ...base, servicesVariant }).html)
      )
    )
    assert.equal(seen.size, variants.length, "Некоторые варианты услуг отрисовались одинаково")
  })
})

// ─── Честность ────────────────────────────────────────────────────────────────

describe("честность контента", () => {
  test("без реального отзыва блок цитаты не рендерится", () => {
    const spec = { ...baseSpecFor("modern"), proofVariant: "quote" as const }
    const { html } = composePage(content({ testimonial: null }), spec)
    assert.ok(!html.includes("<blockquote"), "Отрисован блок отзыва при отсутствии отзыва")
  })

  test("вместо выдуманного отзыва показываются подтверждённые гарантии", () => {
    const spec = { ...baseSpecFor("modern"), proofVariant: "quote" as const }
    const { html } = composePage(
      content({ testimonial: null, guarantees: ["Договор до начала работ"] }),
      spec
    )
    assert.ok(html.includes("Договор до начала работ"))
    assert.ok(!html.includes("<blockquote"))
  })

  test("реальный отзыв рендерится", () => {
    const spec = { ...baseSpecFor("modern"), proofVariant: "quote" as const }
    const { html } = composePage(
      content({ testimonial: { text: "Реальный отзыв клиента.", author: "Иван", role: "Директор" } }),
      spec
    )
    assert.ok(html.includes("<blockquote"))
    assert.ok(html.includes("Реальный отзыв клиента."))
  })

  test("неподтверждённая метрика помечается как пустая, а не как факт", () => {
    const { html } = composePage(content(), baseSpecFor("modern"))
    assert.ok(html.includes("trust-val-empty"), "Нет пометки неподтверждённой метрики")
    // data-count запускает анимацию счётчика — на «—» её быть не должно
    assert.ok(!/trust-val-empty[^>]*data-count/.test(html))
  })
})

// ─── Контраст ─────────────────────────────────────────────────────────────────

describe("контраст", () => {
  test("тёмный акцент на тёмном фоне осветляется до читаемого", () => {
    // #1E3A8A на #0A0A0F даёт ~1.6 — текст практически не виден.
    const before = contrastRatio("#1E3A8A", "#0A0A0F")
    const after = contrastRatio(accentOn("#1E3A8A", "#0A0A0F"), "#0A0A0F")
    assert.ok(before < 3.5, `Исходный контраст неожиданно высок: ${before.toFixed(2)}`)
    assert.ok(after >= 3.5, `Контраст после коррекции недостаточен: ${after.toFixed(2)}`)
  })

  test("текст на акцентной кнопке подбирается по яркости фона", () => {
    assert.equal(readableOn("#FFE600"), "#0A0A0F", "На жёлтой кнопке должен быть тёмный текст")
    assert.equal(readableOn("#1E3A8A"), "#FFFFFF", "На тёмно-синей кнопке должен быть белый текст")
  })

  test("во всех базовых спеках акцент читаем на фоне", () => {
    for (const style of ["modern", "minimal", "bold", "corporate"]) {
      const spec = baseSpecFor(style)
      const bg = spec.palette.mode === "dark" ? "#0A0A0F" : "#FAFAF9"
      const ratio = contrastRatio(accentOn(spec.palette.accent, bg), bg)
      assert.ok(ratio >= 3.5, `${style}: контраст акцента ${ratio.toFixed(2)} < 3.5`)
    }
  })
})

// ─── Валидация спеки ──────────────────────────────────────────────────────────

describe("parseDesignSpec", () => {
  const fallback = baseSpecFor("modern")

  test("отбрасывает неизвестные варианты вместо падения", () => {
    const spec = parseDesignSpec({ heroVariant: "<script>alert(1)</script>" }, fallback)
    assert.equal(spec.heroVariant, fallback.heroVariant)
  })

  test("отклоняет невалидный цвет", () => {
    const spec = parseDesignSpec({ palette: { accent: "red;}body{display:none}" } }, fallback)
    assert.equal(spec.palette.accent, fallback.palette.accent)
  })

  test("всегда гарантирует hero первым и contact последним", () => {
    const spec = parseDesignSpec({ sectionOrder: ["faq", "contact", "hero"] }, fallback)
    assert.equal(spec.sectionOrder[0], "hero")
    assert.equal(spec.sectionOrder.at(-1), "contact")
    assert.ok(spec.sectionOrder.includes("services"), "services обязателен")
  })

  test("выбрасывает неизвестные секции", () => {
    const spec = parseDesignSpec({ sectionOrder: ["hero", "выдуманная", "faq"] }, fallback)
    assert.ok(!spec.sectionOrder.includes("выдуманная" as never))
  })
})

// ─── Правки без регенерации ───────────────────────────────────────────────────

describe("adjustSpec", () => {
  test("каждая правка меняет результат", () => {
    const base = baseSpecFor("modern")
    const baseHtml = composePage(content(), base).html

    for (const adjustment of ["premium", "airier", "brighter", "stricter", "other-hero", "other-structure"] as const) {
      const html = composePage(content(), adjustSpec(base, adjustment)).html
      assert.notEqual(html, baseHtml, `Правка «${adjustment}» ничего не изменила`)
    }
  })

  test("«другой hero» меняет именно вёрстку первого экрана", () => {
    const base = baseSpecFor("modern")
    const next = adjustSpec(base, "other-hero")
    assert.notEqual(next.heroVariant, base.heroVariant)
  })

  test("правки не ломают структуру страницы", () => {
    const base = baseSpecFor("bold")
    for (const adjustment of ["premium", "brighter", "stricter", "other-structure"] as const) {
      const { html, renderedSections } = composePage(content(), adjustSpec(base, adjustment))
      assert.ok(html.startsWith("<!DOCTYPE html>"))
      assert.ok(renderedSections.includes("hero"))
      assert.ok(renderedSections.includes("services"))
      assert.ok(renderedSections.includes("contact"))
    }
  })
})

// ─── Безопасность рендера ─────────────────────────────────────────────────────

describe("безопасность composePage", () => {
  test("payload в контенте не исполняется", () => {
    const payload = `"><script>alert(1)</script>`
    const { html } = composePage(
      content({
        businessName: payload,
        headline: payload,
        services: [{ name: payload, description: payload, price: payload }],
        guarantees: [payload],
      }),
      baseSpecFor("modern")
    )
    assert.ok(!html.includes(payload), "Payload попал в разметку дословно")
    assert.equal((html.match(/<script\b/gi) ?? []).length, 1, "Появился лишний <script>")
  })

  test("в документе есть CSP-мета", () => {
    const { html } = composePage(content(), baseSpecFor("modern"))
    assert.ok(html.includes('http-equiv="Content-Security-Policy"'))
  })
})
