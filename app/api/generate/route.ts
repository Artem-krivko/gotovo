import { NextRequest, NextResponse } from "next/server"
import { GENERATOR_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts"
import { fillTemplate, type DesignContent } from "@/lib/templates"
import type { GenerateApiRequest, GeneratorParams } from "@/lib/types"
import { db } from "@/lib/db"

export const maxDuration = 60

// ─── Валидация входных данных ─────────────────────────────────────────────────

function validateParams(body: unknown): body is GenerateApiRequest {
  if (!body || typeof body !== "object") return false
  const b = body as Record<string, unknown>
  if (!b.params || typeof b.params !== "object") return false
  const p = b.params as Record<string, unknown>
  return (
    typeof p.businessType === "string" && p.businessType.trim().length > 0 &&
    typeof p.userDescription === "string" && p.userDescription.trim().length >= 10 &&
    typeof p.style === "string" &&
    typeof p.language === "string"
  )
}

// ─── Извлечение JSON из ответа модели ────────────────────────────────────────

function extractJson(raw: string): string {
  const start = raw.indexOf("{")
  const end = raw.lastIndexOf("}")
  if (start === -1 || end === -1) throw new Error("No JSON found")
  return raw.slice(start, end + 1)
}

function parseDesignContent(raw: string): DesignContent {
  const jsonStr = extractJson(raw)
  const data = JSON.parse(jsonStr) as Partial<DesignContent>

  // Гарантируем обязательные поля
  return {
    businessName:  String(data.businessName  ?? "Компания"),
    headline:      String(data.headline      ?? "Профессиональные услуги для вашего бизнеса"),
    subheadline:   String(data.subheadline   ?? "Мы помогаем бизнесу расти и развиваться"),
    tagline:       String(data.tagline       ?? "Качество и результат"),
    accentColor:   /^#[0-9A-Fa-f]{6}$/.test(String(data.accentColor ?? "")) ? String(data.accentColor) : "#6366f1",
    services:      Array.isArray(data.services)  ? data.services.slice(0, 3)  : [],
    features:      Array.isArray(data.features)  ? data.features.slice(0, 3)  : [],
    stats:         Array.isArray(data.stats)      ? data.stats.slice(0, 3)     : [],
    testimonial:   data.testimonial ?? { text: "", author: "Клиент", role: "" },
    ctaHeadline:   String(data.ctaHeadline  ?? "Готовы начать?"),
    ctaSubtext:    String(data.ctaSubtext   ?? "Свяжитесь с нами — ответим в течение часа"),
    phone:         String(data.phone        ?? "+375 29 000-00-00"),
    email:         String(data.email        ?? "info@example.by"),
    footerTagline: String(data.footerTagline ?? "Профессионально. Надёжно. Быстро."),
  }
}

// ─── Demo-контент (когда нет API ключа) ──────────────────────────────────────

function buildDemoContent(params: GeneratorParams): DesignContent {
  const accentByStyle: Record<string, string> = {
    modern:    "#7C3AED",
    minimal:   "#0F172A",
    bold:      "#DC2626",
    corporate: "#1D4ED8",
  }
  const businessName = params.businessName || params.businessType

  return {
    businessName,
    headline:      `Лучший ${params.businessType} в Минске и Беларуси`,
    subheadline:   `Мы предоставляем профессиональные услуги уже более 10 лет. Гарантия результата и индивидуальный подход к каждому клиенту.`,
    tagline:       "Профессионально и надёжно",
    accentColor:   accentByStyle[params.style] ?? "#6366f1",
    services: [
      { icon: "⚡", name: "Основная услуга", description: `Профессиональная помощь в сфере ${params.businessType}. Работаем быстро и качественно.`, price: "от 50 $" },
      { icon: "🎯", name: "Консультация", description: "Бесплатная первичная консультация и разработка индивидуального решения для вашей ситуации.", price: "Бесплатно" },
      { icon: "🛡️", name: "Под ключ", description: "Полное сопровождение от начала до результата. Вы занимаетесь бизнесом — мы остальным.", price: "от 150 $" },
    ],
    features: [
      { icon: "✅", title: "Гарантия результата", description: "Мы берёмся только за те проекты, в успехе которых уверены. Результат закреплён в договоре." },
      { icon: "⏱️", title: "Быстрые сроки", description: "Большинство задач выполняем в течение 1-3 рабочих дней без потери качества." },
      { icon: "💬", title: "Поддержка 24/7", description: "Наши специалисты на связи в любое время. Ответим в течение часа в рабочие дни." },
    ],
    stats: [
      { value: "500+", label: "довольных клиентов" },
      { value: "10 лет", label: "на рынке" },
      { value: "98%", label: "повторных обращений" },
    ],
    testimonial: {
      text: `Обратились в ${businessName} по рекомендации коллег и остались очень довольны. Профессиональный подход, чёткие сроки и результат, который превзошёл ожидания. Однозначно рекомендую!`,
      author: "Александр Смирнов",
      role: "Директор, ООО «Прогресс»",
    },
    ctaHeadline:   "Готовы обсудить ваш проект?",
    ctaSubtext:    "Оставьте заявку — перезвоним в течение 30 минут и ответим на все вопросы",
    phone:         "+375 29 000-00-00",
    email:         `info@${businessName.toLowerCase().replace(/\s+/g, "")}.by`,
    footerTagline: "Ваш надёжный партнёр",
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown

    if (!validateParams(body)) {
      return NextResponse.json(
        { error: "Заполните описание бизнеса (минимум 10 символов)" },
        { status: 400 }
      )
    }

    const { params } = body as GenerateApiRequest
    const apiKey = process.env.GOOGLE_AI_API_KEY
    const sessionId = req.cookies.get("session_id")?.value ?? "anonymous"

    // ── Без API ключа: демо-контент в шаблон ───────────────────────────────
    if (!apiKey) {
      const content = buildDemoContent(params)
      const html = fillTemplate(params.style, content)
      const design = await db.design.create({
        data: { sessionId, htmlContent: html, prompt: params.userDescription, businessType: params.businessType, style: params.style, language: params.language },
      })
      return NextResponse.json({ html, designId: design.id }, { status: 200 })
    }

    // ── Вызов Gemini Flash ──────────────────────────────────────────────────
    const geminiBody = JSON.stringify({
      system_instruction: { parts: [{ text: GENERATOR_SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(params) }] }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.85,
        responseMimeType: "application/json",
      },
    })

    let response!: Response
    for (let attempt = 1; attempt <= 3; attempt++) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: geminiBody }
      )
      if (response.ok || response.status !== 503) break
      console.warn(`[POST /api/generate] Gemini 503, attempt ${attempt}/3`)
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 2000))
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[POST /api/generate] Gemini error:", errorText)
      return NextResponse.json({ error: "Ошибка генерации. Попробуйте ещё раз." }, { status: 502 })
    }

    const data = await response.json() as {
      candidates: Array<{ content: { parts: Array<{ text: string; thought?: boolean }> } }>
    }

    const rawText = data.candidates?.[0]?.content?.parts
      ?.filter((p) => !p.thought)
      .map((p) => p.text)
      .join("")
      .trim() ?? ""

    // ── Парсим JSON и заполняем шаблон ─────────────────────────────────────
    let content: DesignContent
    try {
      content = parseDesignContent(rawText)
    } catch (e) {
      console.error("[POST /api/generate] JSON parse error:", e, "\nRaw:", rawText.slice(0, 500))
      // Fallback на демо-контент если AI вернул некорректный JSON
      content = buildDemoContent(params)
    }

    const html = fillTemplate(params.style, content)

    const design = await db.design.create({
      data: { sessionId, htmlContent: html, prompt: params.userDescription, businessType: params.businessType, style: params.style, language: params.language },
    })

    return NextResponse.json({ html, designId: design.id }, { status: 200 })

  } catch (error) {
    console.error("[POST /api/generate]", error)
    return NextResponse.json({ error: "Внутренняя ошибка. Попробуйте ещё раз." }, { status: 500 })
  }
}
