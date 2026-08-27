import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import {
  ART_DIRECTOR_SYSTEM_PROMPT,
  GENERATOR_SYSTEM_PROMPT,
  buildArtDirectorPrompt,
  buildUserPrompt,
} from "@/lib/prompts"
import { getNicheQuery } from "@/lib/templates"
import {
  fetchPexelsCandidates,
  filterCandidatesByAvoid,
  selectConceptAssets,
} from "@/lib/design/images/pexels"
import { parseVisualBrief, type VisualBrief } from "@/lib/design/visual-brief"
import { composePage } from "@/lib/design/compose"
import { alignSpecToStyle, baseSpecFor, parseDesignSpec, type DesignSpec } from "@/lib/design/spec"
import { buildStats, type PageAssets, type PageContent, type VerifiedFacts } from "@/lib/design/content"
import { checkQuality } from "@/lib/design/quality"
import { curateDesignDirections } from "@/lib/design/directions"
import type { GeneratedConcept, GeneratorParams } from "@/lib/types"
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
// На бесплатном API 3.6 Flash регулярно не успевает ответить за время
// serverless-запроса. Flash-Lite проходит тот же quality gate заметно быстрее;
// более сильная 3.6 остаётся резервом, если Lite временно недоступна.
const GEMINI_MODEL = process.env.GOOGLE_AI_MODEL?.trim() || "gemini-3.5-flash-lite"
const GEMINI_FALLBACK_MODEL = process.env.GOOGLE_AI_FALLBACK_MODEL?.trim() || "gemini-3.6-flash"
const GROQ_MODEL = process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b"

/**
 * 0.85 давало слишком много разброса при том, что структура страницы всё равно
 * жёстко задана шаблоном: вариативность уходила не в композицию, а в шум
 * в текстах. 0.6 — осмысленный компромисс между «живо» и «предсказуемо».
 */
const GEMINI_TEMPERATURE = 0.6

// Primary и Flash-Lite запускаются последовательно, поэтому каждая попытка
// должна оставлять запас внутри 60-секундного лимита serverless-функции.
const AI_ATTEMPT_TIMEOUT_MS = 15_000
// Оставляем запас на фото, рендер, сохранение и сериализацию ответа внутри
// 60-секундного лимита Vercel. Стратег и арт-директор используют один deadline,
// но работают параллельно, поэтому их бюджеты не складываются.
const AI_DEADLINE_MS = 44_000
const REFINED_IMAGE_DEADLINE_MS = 39_000
const PERSIST_TIMEOUT_MS = 3_000

// Генерация дорогая (внешний вызов + квота), поэтому лимит жёсткий.
const RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 }

const SESSION_COOKIE = "session_id"
const SESSION_MAX_AGE = 60 * 60 * 24 * 30

async function settleWithin<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<null>((resolve) => {
        timeout = setTimeout(() => resolve(null), timeoutMs)
      }),
    ])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

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

/**
 * Основная Gemini и более быстрая Flash-Lite используют один API-ключ.
 * Flash-Lite страхует таймауты/квоту/битый JSON без платного второго провайдера.
 */
async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  stage: string,
  deadlineAt: number
): Promise<AiResult> {
  const models = [...new Set([GEMINI_MODEL, GEMINI_FALLBACK_MODEL])]
  let lastReason: FailureReason = "ai_unavailable"

  for (const [index, model] of models.entries()) {
    const remainingMs = deadlineAt - Date.now()
    if (remainingMs < 1_500) {
      lastReason = "ai_timeout"
      break
    }
    const body = JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        // Для структуры страницы достаточно 4K; 8K увеличивали latency и
        // расход бесплатной квоты, не улучшая итоговый шаблон.
        maxOutputTokens: 4096,
        temperature: GEMINI_TEMPERATURE,
        responseMimeType: "application/json",
        // 3.6 Flash по умолчанию использует medium thinking. Для нашего
        // строго заданного JSON low заметно быстрее и сохраняет качество.
        thinkingConfig: { thinkingLevel: "low" },
      },
    })

    let response: Response
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: AbortSignal.timeout(Math.min(AI_ATTEMPT_TIMEOUT_MS, remainingMs)),
        }
      )
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === "TimeoutError"
      lastReason = isTimeout ? "ai_timeout" : "ai_unavailable"
      console.error("[generate] gemini_fetch_failed", { stage, model, isTimeout, error: String(error) })
      continue
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      console.error("[generate] gemini_http_error", {
        stage,
        model,
        status: response.status,
        detail: detail.slice(0, 300),
      })
      lastReason = response.status === 408 || response.status === 504 ? "ai_timeout" : "ai_unavailable"
      if (index < models.length - 1) {
        continue
      }
      return { data: null, reason: lastReason, provider: "gemini" }
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
        model,
        error: String(error),
        preview: rawText.slice(0, 300),
      })
      lastReason = "ai_invalid_json"
      if (index < models.length - 1) continue
      return { data: null, reason: lastReason, provider: "gemini" }
    }
  }

  return { data: null, reason: lastReason, provider: "gemini" }
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
  stage: string,
  deadlineAt: number
): Promise<AiResult> {
  const remainingMs = deadlineAt - Date.now()
  if (remainingMs < 1_500) {
    return { data: null, reason: "ai_timeout", provider: "groq" }
  }
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
      signal: AbortSignal.timeout(Math.min(AI_ATTEMPT_TIMEOUT_MS, remainingMs)),
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
  stage: string,
  deadlineAt: number
): Promise<AiResult> {
  const geminiKey = process.env.GOOGLE_AI_API_KEY
  const groqKey = process.env.GROQ_API_KEY

  if (geminiKey) {
    const primary = await callGemini(geminiKey, systemPrompt, userPrompt, stage, deadlineAt)
    if (primary.data) return primary
    console.warn("[generate] provider_fallback", { stage, from: "gemini", reason: primary.reason, to: groqKey ? "groq" : "none" })
    if (!groqKey) return primary
  }

  if (groqKey) return callGroq(groqKey, systemPrompt, userPrompt, stage, deadlineAt)

  return { data: null, reason: "ai_unavailable", provider: "none" }
}

/**
 * Этап «стратег»: аудитория, оффер и честный текст.
 * Возвращает контент в модели PageContent — без отзывов и без выдуманных цифр.
 */
async function runStrategist(
  params: GeneratorParams,
  facts: VerifiedFacts,
  deadlineAt: number
): Promise<{ content: PageContent | null; reason: FailureReason; provider: AiProvider }> {
  const { data, reason, provider } = await generateStructured(
    GENERATOR_SYSTEM_PROMPT,
    buildUserPrompt(params),
    "strategist",
    deadlineAt
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
  params: GeneratorParams,
  deadlineAt: number
): Promise<{ spec: DesignSpec; visualBrief: VisualBrief | null; provider: AiProvider }> {
  const fallback = baseSpecFor(params.style)
  const { data, provider } = await generateStructured(
    ART_DIRECTOR_SYSTEM_PROMPT,
    buildArtDirectorPrompt(params),
    "art-director",
    deadlineAt
  )
  const visualBrief = parseVisualBrief(data)
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "visualBrief" in data &&
    !visualBrief
  ) {
    console.warn("[generate] visual_brief_rejected")
  }
  // Сбой арт-директора не критичен: берём базовую спеку и всё равно
  // отдаём пользователю рабочую страницу.
  return {
    spec: alignSpecToStyle(parseDesignSpec(data, fallback), params.style),
    visualBrief,
    provider,
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const requestStartedAt = Date.now()
  const aiDeadlineAt = requestStartedAt + AI_DEADLINE_MS
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

  const speculativeQuery = getNicheQuery(params.businessType, params.userDescription)
  const speculativeImages = fetchPexelsCandidates(speculativeQuery)
  const hasAiProvider = Boolean(process.env.GOOGLE_AI_API_KEY || process.env.GROQ_API_KEY)

  // Подтверждённые факты приходят из брифа. Пока форма их не собирает,
  // объект пустой — и это корректно: без фактов stats станут честными
  // placeholder'ами, а блок отзывов просто не отрисуется.
  const facts: VerifiedFacts = params.facts ?? {}

  let content: PageContent
  let assets: PageAssets = { gallery: [] }
  let spec: DesignSpec
  let visualBrief: VisualBrief | null = null
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
      runStrategist(params, facts, aiDeadlineAt),
      runArtDirector(params, aiDeadlineAt),
    ])

    spec = artDirected.spec
    visualBrief = artDirected.visualBrief
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

  let imageCandidates = await speculativeImages
  if (
    visualBrief &&
    visualBrief.query !== speculativeQuery &&
    Date.now() - requestStartedAt < REFINED_IMAGE_DEADLINE_MS
  ) {
    const refined = await fetchPexelsCandidates(visualBrief.query)
    if (refined.length > 0) imageCandidates = refined
  }
  imageCandidates = filterCandidatesByAvoid(imageCandidates, visualBrief?.avoid ?? [])
  assets = selectConceptAssets(imageCandidates, `${params.businessType}:${params.userDescription}`, 1)[0]

  // Галерею показываем, только если для неё есть изображения.
  if (assets.gallery.length === 0 && spec.galleryVariant !== "none") {
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

  let { html, renderedSections } = composePage(content, spec, assets)

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

    const retry = composePage(content, spec, assets)
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
  const directions = curateDesignDirections(
    spec,
    params.style,
    params.businessType,
    params.userDescription
  )
  const conceptAssets = selectConceptAssets(
    imageCandidates,
    `${params.businessType}:${params.userDescription}`,
    directions.length
  )
  const concepts: GeneratedConcept[] = directions.flatMap((direction, index) => {
    const directionAssets = conceptAssets[index] ?? assets
    const rendered = composePage(content, direction.spec, directionAssets)
    const report = checkQuality(rendered.html, content, direction.spec, rendered.renderedSections)
    if (!report.ok) {
      console.warn("[generate] direction_quality_failed", {
        direction: direction.id,
        issues: report.issues.filter((i) => i.severity === "error").map((i) => i.code),
      })
      return []
    }
    return [{
      id: direction.id,
      label: direction.label,
      description: direction.description,
      html: rendered.html,
      spec: direction.spec,
      assets: directionAssets,
      designId: null,
    }]
  })

  // Recommended is the already validated base composition, so this is only a
  // defensive guard against a future mismatch between direction and base logic.
  if (concepts.length === 0) {
    concepts.push({
      id: "recommended",
      label: "AI-рекомендация",
      description: "Баланс бренда, структуры и конверсии",
      html,
      spec,
      assets,
      designId: null,
    })
  }

  // Первый концепт — исходная AI-рекомендация; сохраняем обратную
  // совместимость полей html/spec для старых клиентов.
  html = concepts[0].html
  spec = concepts[0].spec
  assets = concepts[0].assets

  // ── Persistence отделён от генерации ──────────────────────────────────────
  //
  // Ключевая правка: раньше db.design.create() стоял на пути к ответу, и любой
  // сбой БД (например, незаданный DATABASE_URL) превращал полностью готовое
  // превью в HTTP 500. Пользователь терял результат в самый мотивированный
  // момент. Теперь запись — побочный эффект: не удалась, значит превью
  // отдаётся без designId, а клиент просто не покажет «открыть в новой вкладке».
  const persistence = Promise.allSettled(
    concepts.map((concept) => db.design.create({
      data: {
        sessionId,
        htmlContent: concept.html,
        prompt: params.userDescription,
        businessType: params.businessType,
        style: params.style,
        language: params.language,
      },
      select: { id: true },
    }))
  )
  const persisted = await settleWithin(persistence, PERSIST_TIMEOUT_MS)
  if (persisted) {
    persisted.forEach((result, index) => {
      if (result.status === "fulfilled") concepts[index].designId = result.value.id
      else console.error("[generate] persist_failed", {
        sessionId,
        concept: concepts[index].id,
        error: String(result.reason),
      })
    })
  } else {
    console.warn("[generate] persist_timeout", { sessionId, concepts: concepts.length })
  }
  const designId = concepts[0].designId

  // content и spec возвращаются клиенту, чтобы кнопки правок («премиальнее»,
  // «больше воздуха», «другой hero») пересобирали страницу через /api/adjust
  // без повторного обращения к модели.
  const response = NextResponse.json(
    { html, designId, source, failureReason, providers, concepts, content, spec, assets },
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
