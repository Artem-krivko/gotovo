import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { GENERATOR_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts"
import { fillTemplate, getNicheQuery, type DesignContent } from "@/lib/templates"
import type { GeneratorParams } from "@/lib/types"
import { parseGeneratorParams, parseAiContent } from "@/lib/validation"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { db } from "@/lib/db"

export const maxDuration = 60

// ─── Конфигурация ─────────────────────────────────────────────────────────────

/**
 * Версия модели зафиксирована. Алиас `gemini-flash-latest` менялся под нами
 * без предупреждения: вместе с ним менялось и качество, и формат ответа,
 * а воспроизвести старый результат было невозможно.
 */
const GEMINI_MODEL = "gemini-2.0-flash-001"

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
type FailureReason = "ai_unavailable" | "ai_invalid_json" | "ai_timeout" | "none"

/** Откуда взят контент. Возвращается клиенту, чтобы не выдавать заглушку за AI. */
export type ContentSource = "ai" | "fallback"

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
function buildFallbackContent(params: GeneratorParams): DesignContent {
  const accentByStyle: Record<string, string> = {
    modern: "#7C3AED",
    minimal: "#0F172A",
    bold: "#DC2626",
    corporate: "#1D4ED8",
  }
  const businessName = params.businessName || params.businessType

  return {
    businessName,
    headline: `${params.businessType}: структура сайта под вашу задачу`,
    subheadline:
      "Это черновая структура — блоки, порядок и акценты. Тексты и цифры подставим ваши, после короткого разговора.",
    tagline: "Черновик концепта",
    accentColor: accentByStyle[params.style] ?? "#6366F1",
    services: [
      {
        icon: "01",
        name: "Основная услуга",
        description: "Здесь будет описание вашей ключевой услуги: что входит, как проходит, какой результат получает клиент.",
      },
      {
        icon: "02",
        name: "Вторая услуга",
        description: "Блок под второе направление. Наполним по вашему прайсу и реальному составу работ.",
      },
      {
        icon: "03",
        name: "Третья услуга",
        description: "Ещё одно направление или пакетное предложение — состав согласуем с вами.",
      },
    ],
    features: [
      {
        icon: "01",
        title: "Ваше первое преимущество",
        description: "Сюда ставим то, чем вы реально отличаетесь от конкурентов — без общих слов.",
      },
      {
        icon: "02",
        title: "Ваше второе преимущество",
        description: "Например: собственное производство, свой парк техники, узкая специализация.",
      },
      {
        icon: "03",
        title: "Ваше третье преимущество",
        description: "Условия работы, формат обслуживания или что-то ещё, что важно вашим клиентам.",
      },
    ],
    // Цифры не выдумываем: показываем, какие метрики здесь будут стоять.
    stats: [
      { value: "—", label: "лет на рынке" },
      { value: "—", label: "выполненных проектов" },
      { value: "—", label: "клиентов в месяц" },
    ],
    // testimonial намеренно не задан → renderer поставит честный placeholder.
    ctaHeadline: "Обсудим ваш проект?",
    ctaSubtext: "Расскажите о задаче — предложим структуру и сроки.",
    phone: "+375 29 000-00-00",
    email: "info@example.by",
    footerTagline: "Черновик концепта",
  }
}

// ─── Вызов модели ─────────────────────────────────────────────────────────────

interface AiResult {
  content: DesignContent | null
  reason: FailureReason
}

function extractJson(raw: string): unknown {
  const start = raw.indexOf("{")
  const end = raw.lastIndexOf("}")
  if (start === -1 || end === -1) throw new Error("no_json_found")
  return JSON.parse(raw.slice(start, end + 1))
}

async function callGemini(apiKey: string, params: GeneratorParams): Promise<AiResult> {
  const body = JSON.stringify({
    system_instruction: { parts: [{ text: GENERATOR_SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: buildUserPrompt(params) }] }],
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: GEMINI_TEMPERATURE,
      responseMimeType: "application/json",
    },
  })

  // Одна контролируемая повторная попытка: 503 у Gemini обычно кратковременный.
  // Раньше попыток было три, по 2 и 4 секунды паузы — суммарно это могло
  // превысить лимит времени функции и превратить сбой модели в таймаут запроса.
  for (let attempt = 1; attempt <= 2; attempt++) {
    let response: Response
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
        }
      )
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === "TimeoutError"
      console.error("[generate] gemini_fetch_failed", { attempt, isTimeout, error: String(error) })
      if (attempt === 2) return { content: null, reason: isTimeout ? "ai_timeout" : "ai_unavailable" }
      continue
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      console.error("[generate] gemini_http_error", {
        attempt,
        status: response.status,
        detail: detail.slice(0, 300),
      })
      if (response.status === 503 && attempt === 1) {
        await new Promise((r) => setTimeout(r, 1500))
        continue
      }
      return { content: null, reason: "ai_unavailable" }
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>
    }

    const rawText =
      data.candidates?.[0]?.content?.parts
        ?.filter((p) => !p.thought)
        .map((p) => p.text ?? "")
        .join("")
        .trim() ?? ""

    try {
      const parsed = parseAiContent(extractJson(rawText))
      if (!parsed.ok) {
        console.error("[generate] gemini_schema_invalid", { error: parsed.error })
        return { content: null, reason: "ai_invalid_json" }
      }

      return {
        content: {
          ...parsed.value,
          businessName: params.businessName || parsed.value.businessName || params.businessType,
          // Контакты — реальные данные бизнеса, модель их выдумывать не должна.
          // До получения настоящих ставим очевидные placeholder'ы.
          phone: "+375 29 000-00-00",
          email: "info@example.by",
        },
        reason: "none",
      }
    } catch (error) {
      console.error("[generate] gemini_json_parse_failed", {
        error: String(error),
        preview: rawText.slice(0, 300),
      })
      return { content: null, reason: "ai_invalid_json" }
    }
  }

  return { content: null, reason: "ai_unavailable" }
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
  const apiKey = process.env.GOOGLE_AI_API_KEY

  let content: DesignContent
  let source: ContentSource
  let failureReason: FailureReason = "none"

  if (!apiKey) {
    console.error("[generate] missing_api_key — отдаём заглушку, помеченную как fallback")
    content = buildFallbackContent(params)
    source = "fallback"
    failureReason = "ai_unavailable"
  } else {
    const ai = await callGemini(apiKey, params)
    if (ai.content) {
      content = ai.content
      source = "ai"
    } else {
      content = buildFallbackContent(params)
      source = "fallback"
      failureReason = ai.reason
    }
  }

  const hero = await imagePromise
  content.heroImageUrl = hero.url ?? undefined
  content.heroImageCredit = hero.credit ?? undefined

  const html = fillTemplate(params.style, content, params.businessType)

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

  const response = NextResponse.json({ html, designId, source, failureReason }, { status: 200 })

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
