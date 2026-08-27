import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import {
  ART_DIRECTOR_SYSTEM_PROMPT,
  GENERATOR_SYSTEM_PROMPT,
  buildArtDirectorPrompt,
  buildUserPrompt,
} from "@/lib/prompts"
import { getNicheQuery } from "@/lib/templates"
import { composePage } from "@/lib/design/compose"
import { alignSpecToStyle, baseSpecFor, parseDesignSpec, type DesignSpec } from "@/lib/design/spec"
import { buildStats, type PageContent, type VerifiedFacts } from "@/lib/design/content"
import { checkQuality } from "@/lib/design/quality"
import { curateDesignDirections } from "@/lib/design/directions"
import type { GeneratorParams } from "@/lib/types"
import { parseGeneratorParams, parseAiContent } from "@/lib/validation"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { db } from "@/lib/db"

export const maxDuration = 60

// ─── Конфигурация ─────────────────────────────────────────────────────────────

/**
 * По умолчанию используем конкретную стабильную версию: алиас
 * `gemini-flash-latest` может менять качество и формат ответа без изменения
 * нашего кода. Переменная окружения позволяет переключить модель без релиза,
 * если Google выведет текущую версию из эксплуатации.
 */
const GEMINI_MODEL = process.env.GOOGLE_AI_MODEL?.trim() || "gemini-3.6-flash"
const GROQ_MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b"

/**
 * 0.85 давало слишком много разброса при том, что структура страницы всё равно
 * жёстко задана шаблоном: вариативность уходила не в композицию, а в шум
 * в текстах. 0.6 — осмысленный компромисс между «живо» и «предсказуемо».
 */
const GEMINI_TEMPERATURE = 0.6

const GEMINI_TIMEOUT_MS = 25_000
const IMAGE_TIMEOUT_MS = 5_000

// Генерация дорогая (внешний вызов + квота), поэтому лимит жёсткий.
const RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 }

const SESSION_COOKIE = "session_id"
const SESSION_MAX_AGE = 60 * 60 * 24 * 30

// ─── Диагностика ──────────────────────────────────────────────────────────────

/**
 * Категория сбоя нужна и для логов, и для аналитики (generation_failed).
 * Раньше любая ошибка — квота Gemini, битый JSON, недоступная БД — сводилась
 * к одному «Внутренняя ошибка», и понять причину по логам было нельзя.
 */
type FailureReason =
  | "ai_unavailable"
  | "ai_invalid_json"
  | "ai_timeout"
  | "quality_rejected"
  | "none"

/** Откуда взят контент. Возвращается клиенту, чтобы не выдавать заглушку за AI. */
export type ContentSource = "ai" | "fallback"
type AiProvider = "gemini" | "groq" | "none"

interface AiResult {
  data: unknown | null
  reason: FailureReason
  provider: AiProvider
}

// ─── Изображение ──────────────────────────────────────────────────────────────

interface HeroImage {
  url: string | null
  credit: { name: string; url: string } | null
}

/**
 * Раньше фото скачивалось на сервере и зашивалось в HTML как base64 data URL.
 * Это давало строки в несколько мегабайт, которые целиком уезжали в
 * PostgreSQL в Design.htmlContent. Теперь в разметку идёт прямая https-ссылка
 * Pexels: строка в БД в разы меньше, картинка кешируется браузером, а один
 * серверный fetch уходит из критического пути.
 */
async function fetchHeroImage(businessType: string): Promise<HeroImage> {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) return { url: null, credit: null }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(getNicheQuery(businessType))}&per_page=1&orientation=landscape`,
      { headers: { Authorization: apiKey }, signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS) }
    )
    if (!res.ok) {
      console.warn("[generate] pexels_error", { status: res.status })
      return { url: null, credit: null }
    }

    const data = (await res.json()) as {
      photos?: Array<{ src?: { large?: string }; photographer?: string; photographer_url?: string }>
    }
    const photo = data.photos?.[0]
    if (!photo?.src?.large) return { url: null, credit: null }

    return {
      url: photo.src.large,
      credit: {
        name: photo.photographer ?? "Pexels",
        url: photo.photographer_url ?? "https://www.pexels.com",
      },
    }
  } catch (error) {
    console.warn("[generate] pexels_failed", { error: String(error) })
    return { url: null, credit: null }
  }
}

// ─── Фолбэк-контент ───────────────────────────────────────────────────────────

/**
 * Нейтральная заглушка на случай, когда модель недоступна.
 *
 * Здесь СОЗНАТЕЛЬНО нет ни цифр, ни отзывов, ни гарантий. Прежняя версия
 * содержала «847 проектов завершено», «4.9/5 на Google» и отзыв от
 * «Дмитрия Ковалёва, владельца АвтоЛюкс Минск» — всё выдуманное, и всё это
 * показывалось как результат работы AI любому пользователю без API-ключа.
 */
function buildFallbackContent(params: GeneratorParams, facts: VerifiedFacts = {}): PageContent {
  const businessName = params.businessName || params.businessType

  return {
    businessName,
    headline: `${params.businessType}: структура сайта под вашу задачу`,
    subheadline:
      "Это черновая структура — блоки, порядок и акценты. Тексты и цифры подставим ваши, после короткого разговора.",
    tagline: "Черновик концепта",
    services: [
      {
        name: "Основная услуга",
        description: "Здесь будет описание вашей ключевой услуги: что входит, как проходит, какой результат получает клиент.",
      },
      {
        name: "Вторая услуга",
        description: "Блок под второе направление. Наполним по вашему прайсу и реальному составу работ.",
      },
      {
        name: "Третья услуга",
        description: "Ещё одно направление или пакетное предложение — состав согласуем с вами.",
      },
    ],
    features: [
      {
        title: "Ваше первое преимущество",
        description: "Сюда ставим то, чем вы реально отличаетесь от конкурентов — без общих слов.",
      },
      {
        title: "Ваше второе преимущество",
        description: "Например: собственное производство, свой парк техники, узкая специализация.",
      },
      {
        title: "Ваше третье преимущество",
        description: "Условия работы, формат обслуживания или что-то ещё, что важно вашим клиентам.",
      },
    ],
    // Подтверждённые цифры используем и здесь: то, что клиент указал сам,
    // остаётся правдой независимо от доступности модели. Недостающие метрики
    // buildStats превратит в честные placeholder'ы.
    stats: buildStats(facts),
    testimonial: facts.testimonials?.[0] ?? null,
    ctaHeadline: "Обсудить проект",
    ctaSubtext: "Расскажите о задаче — предложим структуру и сроки.",
    phone: "+375 29 000-00-00",
    email: "info@example.by",
    footerTagline: "Черновик концепта",
    geography: facts.geography,
    gallery: [],
    guarantees: facts.guarantees ?? [],
  }
}

// ─── Вызов модели ─────────────────────────────────────────────────────────────

function extractJson(raw: string): unknown {
  const start = raw.indexOf("{")
  const end = raw.lastIndexOf("}")
  if (start === -1 || end === -1) throw new Error("no_json_found")
  return JSON.parse(raw.slice(start, end + 1))
}

/** Один вызов Gemini с одной контролируемой повторной попыткой на 503. */
async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  stage: string
): Promise<AiResult> {
  const body = JSON.stringify({
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: GEMINI_TEMPERATURE,
      responseMimeType: "application/json",
    },
  })

  // Раньше попыток было три, с паузами 2 и 4 секунды — суммарно это могло
  // превысить лимит времени функции и превратить сбой модели в таймаут.
  for (let attempt = 1; attempt <= 2; attempt++) {
    let response: Response
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
        }
      )
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === "TimeoutError"
      console.error("[generate] gemini_fetch_failed", { stage, attempt, isTimeout, error: String(error) })
      if (attempt === 2) return { data: null, reason: isTimeout ? "ai_timeout" : "ai_unavailable", provider: "gemini" }
      continue
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      console.error("[generate] gemini_http_error", {
        stage,
        attempt,
        status: response.status,
        detail: detail.slice(0, 300),
      })
      if (response.status === 503 && attempt === 1) {
        await new Promise((r) => setTimeout(r, 1500))
        continue
      }
      return { data: null, reason: "ai_unavailable", provider: "gemini" }
    }

    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>
    }

    const rawText =
      payload.candidates?.[0]?.content?.parts
        ?.filter((p) => !p.thought)
        .map((p) => p.text ?? "")
        .join("")
        .trim() ?? ""

    try {
      return { data: extractJson(rawText), reason: "none", provider: "gemini" }
    } catch (error) {
      console.error("[generate] gemini_json_parse_failed", {
        stage,
        error: String(error),
        preview: rawText.slice(0, 300),
      })
      return { data: null, reason: "ai_invalid_json", provider: "gemini" }
    }
  }

  return { data: null, reason: "ai_unavailable", provider: "gemini" }
}

/**
 * Groq использует OpenAI-совместимый API. Это намеренно обычный fetch, а не
 * SDK: второй провайдер остаётся опциональным, не увеличивает bundle и может
 * быть включён одной переменной GROQ_API_KEY в Vercel.
 */
async function callGroq(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  stage: string
): Promise<AiResult> {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: GEMINI_TEMPERATURE,
        max_tokens: 8192,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      console.error("[generate] groq_http_error", { stage, status: response.status, detail: detail.slice(0, 300) })
      return { data: null, reason: "ai_unavailable", provider: "groq" }
    }

    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> }
    const rawText = payload.choices?.[0]?.message?.content?.trim() ?? ""
    return { data: extractJson(rawText), reason: "none", provider: "groq" }
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "TimeoutError"
    console.error("[generate] groq_failed", { stage, isTimeout, error: String(error) })
    return { data: null, reason: isTimeout ? "ai_timeout" : "ai_unavailable", provider: "groq" }
  }
}

/** Gemini — основной, Groq — автоматический резерв при квоте/сбое/битом JSON. */
async function generateStructured(
  systemPrompt: string,
  userPrompt: string,
  stage: string
): Promise<AiResult> {
  const geminiKey = process.env.GOOGLE_AI_API_KEY
  const groqKey = process.env.GROQ_API_KEY

  if (geminiKey) {
    const primary = await callGemini(geminiKey, systemPrompt, userPrompt, stage)
    if (primary.data) return primary
    console.warn("[generate] provider_fallback", { stage, from: "gemini", reason: primary.reason, to: groqKey ? "groq" : "none" })
    if (!groqKey) return primary
  }

  if (groqKey) return callGroq(groqKey, systemPrompt, userPrompt, stage)

  return { data: null, reason: "ai_unavailable", provider: "none" }
}

/**
 * Этап «стратег»: аудитория, оффер и честный текст.
 * Возвращает контент в модели PageContent — без отзывов и без выдуманных цифр.
 */
async function runStrategist(
  params: GeneratorParams,
  facts: VerifiedFacts
): Promise<{ content: PageContent | null; reason: FailureReason; provider: AiProvider }> {
  const { data, reason, provider } = await generateStructured(
    GENERATOR_SYSTEM_PROMPT,
    buildUserPrompt(params),
    "strategist"
  )
  if (!data) return { content: null, reason, provider }

  const parsed = parseAiContent(data)
  if (!parsed.ok) {
    console.error("[generate] strategist_schema_invalid", { error: parsed.error })
    return { content: null, reason: "ai_invalid_json", provider }
  }
  const v = parsed.value

  // stats собираются из ПОДТВЕРЖДЁННЫХ фактов, а не из ответа модели:
  // цифру, которую владелец не называл, показывать нельзя.
  return {
    content: {
      businessName: params.businessName || v.businessName || params.businessType,
      headline: v.headline,
      subheadline: v.subheadline,
      tagline: v.tagline,
      services: v.services.map((s) => ({
        name: s.name,
        description: s.description,
        price: facts.priceFrom ? s.price : undefined,
      })),
      features: v.features.map((f) => ({ title: f.title, description: f.description })),
      stats: buildStats(facts),
      // Отзыв берём только из подтверждённых фактов. Модель его не генерирует.
      testimonial: facts.testimonials?.[0] ?? null,
      ctaHeadline: v.ctaHeadline,
      ctaSubtext: v.ctaSubtext,
      // Контакты — реальные данные бизнеса; до их получения ставим placeholder.
      phone: "+375 29 000-00-00",
      email: "info@example.by",
      footerTagline: v.footerTagline,
      geography: facts.geography,
      gallery: [],
      guarantees: facts.guarantees ?? [],
    },
    reason: "none",
    provider,
  }
}

/**
 * Этап «арт-директор»: DesignSpec.
 * Зависит только от брифа, поэтому запускается ПАРАЛЛЕЛЬНО со стратегом
 * и не добавляет задержки к общему времени генерации.
 */
async function runArtDirector(
  params: GeneratorParams
): Promise<{ spec: DesignSpec; provider: AiProvider }> {
  const fallback = baseSpecFor(params.style)
  const { data, provider } = await generateStructured(
    ART_DIRECTOR_SYSTEM_PROMPT,
    buildArtDirectorPrompt(params),
    "art-director"
  )
  // Сбой арт-директора не критичен: берём базовую спеку и всё равно
  // отдаём пользователю рабочую страницу.
  return { spec: alignSpecToStyle(parseDesignSpec(data, fallback), params.style), provider }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = clientIp(req)

  const limit = rateLimit(`generate:${ip}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте через несколько минут." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 })
  }

  const parsed = parseGeneratorParams(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }
  const params = parsed.value

  // session_id раньше только читался и всегда был "anonymous" — куку никто
  // не выставлял. Теперь заводим её здесь, чтобы связывать генерации одного
  // посетителя между собой.
  let sessionId = req.cookies.get(SESSION_COOKIE)?.value
  let isNewSession = false
  if (!sessionId || !/^[\w-]{8,64}$/.test(sessionId)) {
    sessionId = randomUUID()
    isNewSession = true
  }

  const imagePromise = fetchHeroImage(params.businessType)
  const hasAiProvider = Boolean(process.env.GOOGLE_AI_API_KEY || process.env.GROQ_API_KEY)

  // Подтверждённые факты приходят из брифа. Пока форма их не собирает,
  // объект пустой — и это корректно: без фактов stats станут честными
  // placeholder'ами, а блок отзывов просто не отрисуется.
  const facts: VerifiedFacts = params.facts ?? {}

  let content: PageContent
  let spec: DesignSpec
  let source: ContentSource
  let failureReason: FailureReason = "none"
  let providers: { strategist: AiProvider; artDirector: AiProvider } = {
    strategist: "none",
    artDirector: "none",
  }

  if (!hasAiProvider) {
    console.error("[generate] missing_ai_provider_key — отдаём заглушку, помеченную как fallback")
    content = buildFallbackContent(params, facts)
    spec = baseSpecFor(params.style)
    source = "fallback"
    failureReason = "ai_unavailable"
  } else {
    // Стратег и арт-директор зависят только от брифа, поэтому идут параллельно:
    // два этапа не удваивают время ожидания.
    const [strategist, artDirected] = await Promise.all([
      runStrategist(params, facts),
      runArtDirector(params),
    ])

    spec = artDirected.spec
    providers = { strategist: strategist.provider, artDirector: artDirected.provider }

    if (strategist.content) {
      content = strategist.content
      source = "ai"
    } else {
      content = buildFallbackContent(params, facts)
      source = "fallback"
      failureReason = strategist.reason
    }
  }

  const hero = await imagePromise
  if (hero.url) {
    content.heroImage = {
      url: hero.url,
      alt: content.businessName,
      credit: hero.credit ?? undefined,
    }
  }

  // Галерею показываем, только если для неё есть изображения.
  if (content.gallery.length === 0 && spec.galleryVariant !== "none") {
    spec = { ...spec, galleryVariant: "none" }
  }

  // Реальный отзыв или подтверждённая гарантия — самый ценный контент на
  // странице, и он не должен потеряться из-за того, что арт-директор
  // не включил секцию proof в порядок. Если социальное доказательство
  // настоящее, место для него находим принудительно.
  const hasRealProof = Boolean(content.testimonial) || content.guarantees.length > 0
  if (hasRealProof && !spec.sectionOrder.includes("proof")) {
    const order = [...spec.sectionOrder]
    // Ставим после услуг: сначала «что мы делаем», потом «вот подтверждение».
    const afterServices = order.indexOf("services") + 1
    order.splice(afterServices || order.length - 1, 0, "proof")
    spec = {
      ...spec,
      sectionOrder: order,
      proofVariant: content.testimonial ? "quote" : "logos",
    }
  }

  let { html, renderedSections } = composePage(content, spec)

  // ── Quality gate ──────────────────────────────────────────────────────────
  //
  // Проверяем результат ДО показа. Ретрай ровно один и не обращается к модели
  // повторно: при найденных ошибках переключаемся на нейтральный фолбэк-контент
  // с базовой спекой — заведомо корректный вариант. Бесконечных попыток нет
  // по построению.
  let quality = checkQuality(html, content, spec, renderedSections)

  if (!quality.ok) {
    console.warn("[generate] quality_gate_failed", {
      businessType: params.businessType,
      issues: quality.issues.filter((i) => i.severity === "error").map((i) => i.code),
    })

    content = buildFallbackContent(params, facts)
    spec = baseSpecFor(params.style)
    source = "fallback"
    failureReason = "quality_rejected"

    const retry = composePage(content, spec)
    html = retry.html
    renderedSections = retry.renderedSections
    quality = checkQuality(html, content, spec, renderedSections)

    if (!quality.ok) {
      // Фолбэк-контент статичен и уже покрыт тестами; если и он не прошёл —
      // это дефект рендерера, а не данных. Логируем громко, но пользователю
      // всё равно отдаём страницу: она лучше, чем пустой экран.
      console.error("[generate] quality_gate_failed_on_fallback", {
        issues: quality.issues.map((i) => `${i.code}: ${i.message}`),
      })
    }
  }

  // Один контент и одна AI-спека превращаются в три кураторских направления.
  // Это даёт пользователю реальный выбор, не умножая расход квоты модели.
  const concepts = curateDesignDirections(spec, params.style, params.businessType).map((direction) => {
    const rendered = composePage(content, direction.spec)
    const report = checkQuality(rendered.html, content, direction.spec, rendered.renderedSections)
    if (!report.ok) {
      console.warn("[generate] direction_quality_failed", {
        direction: direction.id,
        issues: report.issues.filter((i) => i.severity === "error").map((i) => i.code),
      })
    }
    return {
      id: direction.id,
      label: direction.label,
      description: direction.description,
      html: report.ok ? rendered.html : html,
      spec: report.ok ? direction.spec : spec,
    }
  })

  // Первый концепт — исходная AI-рекомендация; сохраняем обратную
  // совместимость полей html/spec для старых клиентов.
  html = concepts[0].html
  spec = concepts[0].spec

  // ── Persistence отделён от генерации ──────────────────────────────────────
  //
  // Ключевая правка: раньше db.design.create() стоял на пути к ответу, и любой
  // сбой БД (например, незаданный DATABASE_URL) превращал полностью готовое
  // превью в HTTP 500. Пользователь терял результат в самый мотивированный
  // момент. Теперь запись — побочный эффект: не удалась, значит превью
  // отдаётся без designId, а клиент просто не покажет «открыть в новой вкладке».
  let designId: string | null = null
  try {
    const design = await db.design.create({
      data: {
        sessionId,
        htmlContent: html,
        prompt: params.userDescription,
        businessType: params.businessType,
        style: params.style,
        language: params.language,
      },
      select: { id: true },
    })
    designId = design.id
  } catch (error) {
    console.error("[generate] persist_failed", { sessionId, error: String(error) })
  }

  // content и spec возвращаются клиенту, чтобы кнопки правок («премиальнее»,
  // «больше воздуха», «другой hero») пересобирали страницу через /api/adjust
  // без повторного обращения к модели.
  const response = NextResponse.json(
    { html, designId, source, failureReason, providers, concepts, content, spec },
    { status: 200 }
  )

  if (isNewSession) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    })
  }

  return response
}
