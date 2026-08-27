// lib/__tests__/xss.test.ts — регрессионные тесты на XSS в генераторе.
//
// Запуск: npm run test
//
// Эти тесты фиксируют P0-уязвимость: до появления lib/html.ts значения из
// формы и из ответа модели попадали в HTML сырыми, а превью рендерилось
// в <iframe srcDoc> без sandbox — то есть скрипт из поля «Название компании»
// реально исполнялся, а тот же HTML отдавался с /api/design/[id] на нашем домене.

import { test, describe } from "node:test"
import assert from "node:assert/strict"

import { fillTemplate, type DesignContent } from "../templates/index.ts"
import {
  escapeHtml,
  escapeTelegram,
  safeHexColor,
  safeImageSrc,
  safeMailtoHref,
  safeTelHref,
  safeUrl,
} from "../html.ts"

// ─── Payload-набор ────────────────────────────────────────────────────────────

const XSS_PAYLOADS = [
  `<script>alert(1)</script>`,
  `"><script>alert(1)</script>`,
  `<img src=x onerror=alert(1)>`,
  `<svg/onload=alert(1)>`,
  `" onmouseover="alert(1)`,
  `'><iframe src=javascript:alert(1)>`,
  `</title><script>alert(1)</script>`,
  `</style><script>alert(1)</script>`,
  `<body onload=alert(1)>`,
  `{{constructor.constructor('alert(1)')()}}`,
]

/**
 * Экранированный payload остаётся в HTML как ТЕКСТ — и это нормально:
 * «&lt;img src=x onerror=alert(1)&gt;» ничего не исполняет. Наивный поиск
 * подстроки «onerror=» дал бы ложное срабатывание именно на безопасном выводе.
 *
 * Инъекция состоялась только если payload попал в разметку ДОСЛОВНО — то есть
 * его угловые скобки и кавычки не были экранированы. Плюс сверяем, что число
 * <script> не выросло относительно чистого рендера того же шаблона.
 */
function assertNoInjection(html: string, payload: string, label: string) {
  assert.ok(
    !html.includes(payload),
    `${label}: payload попал в HTML дословно (не экранирован): ${payload}`
  )
  assert.ok(
    !hasJavascriptUrl(html),
    `${label}: схема javascript: попала в значение атрибута`
  )
}

/**
 * Строка «javascript:» в тексте страницы безвредна — опасна она только как
 * значение href/src/action.
 *
 * Кавычка в шаблоне обязательна: экранированный payload вида
 * `&lt;iframe src=javascript:alert(1)&gt;` содержит подстроку «src=javascript:»
 * как обычный текст, и без требования кавычки проверка ловила бы сама себя.
 * Настоящая инъекция невозможна без неэкранированной кавычки.
 */
function hasJavascriptUrl(html: string): boolean {
  return /(?:href|src|action|formaction|xlink:href)\s*=\s*["']\s*javascript:/i.test(html)
}

function scriptTagCount(html: string): number {
  return (html.match(/<script\b/gi) ?? []).length
}

function contentWith(overrides: Partial<DesignContent>): DesignContent {
  return {
    businessName: "Тест",
    headline: "Заголовок",
    subheadline: "Подзаголовок",
    tagline: "Слоган",
    accentColor: "#7C3AED",
    services: [{ icon: "01", name: "Услуга", description: "Описание" }],
    features: [{ icon: "01", title: "Преимущество", description: "Описание" }],
    stats: [{ value: "10", label: "лет" }],
    testimonial: { text: "Текст", author: "Автор", role: "Роль" },
    ctaHeadline: "CTA",
    ctaSubtext: "Подтекст",
    phone: "+375 29 000-00-00",
    email: "info@example.by",
    footerTagline: "Слоган",
    ...overrides,
  }
}

// ─── Тесты хелперов ───────────────────────────────────────────────────────────

describe("escapeHtml", () => {
  test("экранирует все опасные символы", () => {
    assert.equal(escapeHtml(`<script>"x"&'y'</script>`), "&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;")
  })

  test("null и undefined дают пустую строку, а не 'null'", () => {
    assert.equal(escapeHtml(null), "")
    assert.equal(escapeHtml(undefined), "")
  })
})

describe("safeHexColor", () => {
  test("пропускает валидный hex", () => {
    assert.equal(safeHexColor("#7c3aed"), "#7C3AED")
  })

  test("блокирует CSS-инъекцию через accentColor", () => {
    // Цвет попадает в CSS `--a:${color}` — HTML-экранирование тут не защищает.
    assert.equal(safeHexColor("red;} body{display:none} .x{color:red"), "#6366F1")
    assert.equal(safeHexColor("#fff\"><script>alert(1)</script>"), "#6366F1")
    assert.equal(safeHexColor("expression(alert(1))"), "#6366F1")
  })
})

describe("safeUrl", () => {
  test("блокирует исполняемые схемы", () => {
    assert.equal(safeUrl("javascript:alert(1)"), "#")
    assert.equal(safeUrl("JaVaScRiPt:alert(1)"), "#")
    assert.equal(safeUrl("data:text/html,<script>alert(1)</script>"), "#")
    assert.equal(safeUrl("vbscript:msgbox(1)"), "#")
  })

  test("пропускает http/https", () => {
    assert.match(safeUrl("https://pexels.com/@author"), /^https:\/\/pexels\.com/)
  })
})

describe("safeImageSrc", () => {
  test("пропускает только data:image/* и https", () => {
    assert.equal(safeImageSrc("data:image/jpeg;base64,/9j/4AAQ"), "data:image/jpeg;base64,/9j/4AAQ")
    assert.equal(safeImageSrc("data:text/html;base64,PHNjcmlwdD4="), "")
    assert.equal(safeImageSrc("javascript:alert(1)"), "")
    assert.equal(safeImageSrc(`x" onerror="alert(1)`), "")
  })
})

describe("safeTelHref / safeMailtoHref", () => {
  test("tel: оставляет только цифры и +", () => {
    // Кавычки и onclick вырезаны целиком; уцелевшая «1» из alert(1) безобидна —
    // в href="tel:" это просто лишняя цифра, а не исполняемый код.
    assert.equal(safeTelHref(`+375 29 000-00-00" onclick="alert(1)`), "tel:+3752900000001")
  })

  test("mailto: отклоняет невалидный email", () => {
    assert.equal(safeMailtoHref(`x@y.by" onclick="alert(1)`), "#")
    assert.equal(safeMailtoHref("info@example.by"), "mailto:info@example.by")
  })
})

describe("escapeTelegram", () => {
  test("экранирует разметку, ломающую parse_mode=HTML", () => {
    // Битая HTML-разметка → Telegram отвечает 400 → уведомление о лиде теряется.
    assert.equal(escapeTelegram("<b>Вася</b> & Ко"), "&lt;b&gt;Вася&lt;/b&gt; &amp; Ко")
  })
})

// ─── Сквозной тест шаблонов ───────────────────────────────────────────────────

describe("fillTemplate — санитизация на границе", () => {
  const styles = ["modern", "minimal", "bold", "corporate"]

  for (const style of styles) {
    const baselineScripts = scriptTagCount(fillTemplate(style, contentWith({}), "Тест"))

    test(`${style}: payload в businessName не исполняется`, () => {
      for (const payload of XSS_PAYLOADS) {
        const html = fillTemplate(style, contentWith({ businessName: payload }), "Тест")
        assertNoInjection(html, payload, `Шаблон ${style}`)
        assert.equal(
          scriptTagCount(html),
          baselineScripts,
          `Шаблон ${style}: payload добавил <script> в разметку`
        )
      }
    })

    test(`${style}: payload во всех текстовых полях не исполняется`, () => {
      const payload = `"><img src=x onerror=alert(1)>`
      const html = fillTemplate(
        style,
        contentWith({
          businessName: payload,
          headline: payload,
          subheadline: payload,
          tagline: payload,
          services: [{ icon: payload, name: payload, description: payload, price: payload }],
          features: [{ icon: payload, title: payload, description: payload }],
          stats: [{ value: payload, label: payload }],
          testimonial: { text: payload, author: payload, role: payload },
          ctaHeadline: payload,
          ctaSubtext: payload,
          footerTagline: payload,
        }),
        "Тест"
      )
      assertNoInjection(html, payload, `Шаблон ${style}`)
      assert.equal(scriptTagCount(html), baselineScripts, `Шаблон ${style}: payload добавил <script>`)
    })

    test(`${style}: инъекция через accentColor и heroImageUrl заблокирована`, () => {
      const html = fillTemplate(
        style,
        contentWith({
          accentColor: `#fff;} body{display:none} .x{color:red`,
          heroImageUrl: `x" onerror="alert(1)`,
          heroImageCredit: { name: `<script>alert(1)</script>`, url: "javascript:alert(1)" },
        }),
        "Тест"
      )
      assert.ok(
        !html.includes("body{display:none}"),
        `Шаблон ${style}: CSS-инъекция через accentColor прошла`
      )
      assert.ok(!hasJavascriptUrl(html), `Шаблон ${style}: javascript: в href фото-атрибуции`)
      assert.equal(scriptTagCount(html), baselineScripts, `Шаблон ${style}: инъекция добавила <script>`)
    })
  }

  test("сгенерированный HTML остаётся валидным при обычном контенте", () => {
    const html = fillTemplate("modern", contentWith({}), "Стоматология")
    assert.ok(html.startsWith("<!DOCTYPE html>"))
    assert.ok(html.includes("</html>"))
    assert.ok(html.includes("Заголовок"))
  })
})
