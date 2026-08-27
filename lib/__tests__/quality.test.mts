// lib/__tests__/quality.test.mts — quality gate на эталонных брифах.
//
// Прогоняем все 30 брифов через рендерер и проверяем каждый результат.
// Тест ловит именно те дефекты, из-за которых превью выглядело слабо:
// дубли секций, пустые значения, слишком длинные заголовки, низкий контраст
// и — главное — композиционное однообразие между нишами.

import { test, describe } from "node:test"
import assert from "node:assert/strict"

import { composePage } from "../design/compose.ts"
import { adjustSpec, baseSpecFor } from "../design/spec.ts"
import { checkQuality, specFingerprint } from "../design/quality.ts"
import { buildStats, type PageContent } from "../design/content.ts"
import { REFERENCE_BRIEFS } from "../design/reference-briefs.ts"

/**
 * Контент, приближенный к тому, что вернёт стратег: без цифр, без отзывов,
 * с описанием сути услуг. Проверяем рендерер и спеку, а не саму модель —
 * тест должен быть детерминированным и работать без сетевых вызовов.
 */
function contentFor(brief: (typeof REFERENCE_BRIEFS)[number]): PageContent {
  const name = brief.businessName ?? brief.businessType
  return {
    businessName: name,
    headline: `${brief.businessType} — понятный процесс и результат`,
    subheadline: brief.userDescription.slice(0, 200),
    tagline: brief.businessType,
    services: [
      { name: `${brief.businessType}: основная услуга`, description: "Разбираем задачу, согласуем состав работ и выполняем по утверждённому плану." },
      { name: "Консультация", description: "Обсуждаем вашу ситуацию и предлагаем подходящий вариант решения." },
      { name: "Сопровождение", description: "Остаёмся на связи после выполнения работ и помогаем с возникающими вопросами." },
    ],
    features: [
      { title: "Уточняем задачу", description: "Выясняем детали и ограничения до начала работ." },
      { title: "Согласуем состав", description: "Фиксируем, что именно входит в работу и в какой последовательности." },
      { title: "Выполняем", description: "Держим вас в курсе статуса на каждом этапе." },
    ],
    stats: buildStats({}),
    testimonial: null,
    ctaHeadline: "Обсудить задачу",
    ctaSubtext: "Расскажите, что нужно — предложим решение.",
    phone: "+375 29 000-00-00",
    email: "info@example.by",
    footerTagline: brief.businessType,
    gallery: [],
    guarantees: [],
  }
}

// ─── Прогон всех брифов ───────────────────────────────────────────────────────

describe("quality gate на эталонных брифах", () => {
  test(`все ${REFERENCE_BRIEFS.length} брифов проходят проверки без ошибок`, () => {
    const failures: string[] = []

    for (const brief of REFERENCE_BRIEFS) {
      const spec = baseSpecFor(brief.style)
      const content = contentFor(brief)
      const { html, renderedSections } = composePage(content, spec)
      const report = checkQuality(html, content, spec, renderedSections)

      if (!report.ok) {
        const errors = report.issues
          .filter((i) => i.severity === "error")
          .map((i) => `${i.code}: ${i.message}`)
        failures.push(`  ${brief.id} → ${errors.join("; ")}`)
      }
    }

    assert.equal(failures.length, 0, `Брифы с ошибками:\n${failures.join("\n")}`)
  })

  test("ни один бриф не даёт сломанной или пустой разметки", () => {
    for (const brief of REFERENCE_BRIEFS) {
      const { html, renderedSections } = composePage(contentFor(brief), baseSpecFor(brief.style))
      assert.ok(html.startsWith("<!DOCTYPE html>"), `${brief.id}: нет DOCTYPE`)
      assert.ok(html.includes("</html>"), `${brief.id}: документ не закрыт`)
      assert.ok(html.length > 4000, `${brief.id}: подозрительно короткая страница`)
      assert.ok(renderedSections.length >= 4, `${brief.id}: слишком мало секций`)
      assert.ok(!html.includes("undefined"), `${brief.id}: undefined в разметке`)
      assert.ok(!html.includes("NaN"), `${brief.id}: NaN в разметке`)
    }
  })

  test("каждая страница содержит CTA и якорь контактов", () => {
    for (const brief of REFERENCE_BRIEFS) {
      const { html } = composePage(contentFor(brief), baseSpecFor(brief.style))
      assert.ok(html.includes('id="contact"'), `${brief.id}: нет секции контактов`)
      assert.ok(html.includes('href="tel:'), `${brief.id}: нет кликабельного телефона`)
    }
  })
})

// ─── Разнообразие ─────────────────────────────────────────────────────────────

describe("разнообразие между нишами", () => {
  test("контрастные ниши не совпадают по композиции", () => {
    const specs = new Map(REFERENCE_BRIEFS.map((b) => [b.id, baseSpecFor(b.style)]))
    const collisions: string[] = []

    for (const brief of REFERENCE_BRIEFS) {
      if (!brief.contrastWith) continue
      const mine = specFingerprint(specs.get(brief.id)!)

      for (const otherId of brief.contrastWith) {
        const other = specs.get(otherId)
        if (!other) continue
        if (specFingerprint(other) === mine) {
          collisions.push(`${brief.id} ≡ ${otherId}`)
        }
      }
    }

    assert.equal(
      collisions.length,
      0,
      `Ниши, которые должны различаться, дали одинаковую композицию:\n${collisions.join("\n")}`
    )
  })

  test("правки спеки расширяют пространство вариантов", () => {
    // Из одной базовой спеки должно получаться несколько разных страниц —
    // именно это позволяет менять результат без повторной генерации.
    const base = baseSpecFor("modern")
    const fingerprints = new Set([
      specFingerprint(base),
      ...(["premium", "airier", "brighter", "stricter", "other-hero", "other-structure"] as const).map(
        (a) => specFingerprint(adjustSpec(base, a))
      ),
    ])

    assert.ok(
      fingerprints.size >= 6,
      `Правки дают всего ${fingerprints.size} уникальных композиций`
    )
  })
})

// ─── Детекция выдуманных фактов ───────────────────────────────────────────────

describe("детекция выдуманных фактов", () => {
  const spec = baseSpecFor("modern")

  function reportFor(overrides: Partial<PageContent>) {
    const content = { ...contentFor(REFERENCE_BRIEFS[0]), ...overrides }
    const { html, renderedSections } = composePage(content, spec)
    return checkQuality(html, content, spec, renderedSections)
  }

  test("ловит выдуманное количество клиентов", () => {
    const report = reportFor({ subheadline: "Более 500 довольных клиентов по всей стране." })
    assert.ok(report.issues.some((i) => i.code === "fabricated_fact"))
    assert.equal(report.ok, false)
  })

  test("ловит выдуманный процент и рейтинг", () => {
    assert.ok(
      reportFor({ headline: "98% успешных дел" }).issues.some((i) => i.code === "fabricated_fact")
    )
    assert.ok(
      reportFor({ ctaSubtext: "Наш рейтинг 4.9 из 5" }).issues.some((i) => i.code === "fabricated_fact")
    )
  })

  test("ловит выдуманную гарантию и сертификаты", () => {
    assert.ok(
      reportFor({ ctaSubtext: "Гарантия 24 месяца на все работы." }).issues.some(
        (i) => i.code === "fabricated_fact"
      )
    )
    assert.ok(
      reportFor({ subheadline: "Все мастера сертифицированы." }).issues.some(
        (i) => i.code === "fabricated_fact"
      )
    )
  })

  test("не срабатывает на нормальном тексте о процессе", () => {
    const report = reportFor({
      subheadline: "Разбираем задачу, согласуем состав работ и выполняем по плану.",
      headline: "Ремонт кровли: полный цикл работ",
    })
    assert.ok(
      !report.issues.some((i) => i.code === "fabricated_fact"),
      `Ложное срабатывание: ${JSON.stringify(report.issues)}`
    )
  })

  test("не считает выдумкой подтверждённые цифры владельца", () => {
    // stats с verified:true пришли из брифа — это не генерация.
    const content = {
      ...contentFor(REFERENCE_BRIEFS[0]),
      stats: [{ value: "12", label: "лет на рынке", verified: true }],
    }
    const { html, renderedSections } = composePage(content, spec)
    const report = checkQuality(html, content, spec, renderedSections)
    assert.ok(!report.issues.some((i) => i.code === "fabricated_fact"))
  })
})

// ─── Проверки разметки ────────────────────────────────────────────────────────

describe("проверки разметки", () => {
  const spec = baseSpecFor("modern")

  test("ловит слишком длинный заголовок", () => {
    const content = {
      ...contentFor(REFERENCE_BRIEFS[0]),
      headline: "Очень длинный заголовок ".repeat(6),
    }
    const { html, renderedSections } = composePage(content, spec)
    const report = checkQuality(html, content, spec, renderedSections)
    assert.ok(report.issues.some((i) => i.code === "headline_too_long"))
  })

  test("ловит повторяющиеся описания услуг", () => {
    const content = {
      ...contentFor(REFERENCE_BRIEFS[0]),
      services: [
        { name: "Первая", description: "Совершенно одинаковое описание услуги здесь." },
        { name: "Вторая", description: "Совершенно одинаковое описание услуги здесь." },
      ],
    }
    const { html, renderedSections } = composePage(content, spec)
    const report = checkQuality(html, content, spec, renderedSections)
    assert.ok(report.issues.some((i) => i.code === "duplicate_content"))
  })

  test("ловит дубль секции", () => {
    const content = contentFor(REFERENCE_BRIEFS[0])
    const { html } = composePage(content, spec)
    const report = checkQuality(html, content, spec, ["hero", "trust", "services", "trust", "contact"])
    assert.ok(report.issues.some((i) => i.code === "duplicate_section"))
  })

  test("ловит отсутствие обязательной секции", () => {
    const content = contentFor(REFERENCE_BRIEFS[0])
    const { html } = composePage(content, spec)
    const report = checkQuality(html, content, spec, ["hero", "faq"])
    assert.ok(report.issues.some((i) => i.code === "missing_section"))
  })
})
