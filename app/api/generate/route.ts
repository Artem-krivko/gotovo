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
    headline:      `${params.businessType} — результат за 3 дня или возврат денег`,
    subheadline:   `Работаем только с проверенными решениями. 847 выполненных заказов в Минске — посмотрите портфолио и сравните с конкурентами.`,
    tagline:       "Без воды. Только результат",
    accentColor:   accentByStyle[params.style] ?? "#6366f1",
    services: [
      { icon: "⚡", name: `${params.businessType} под ключ`, description: `Принимаем задачу и возвращаем готовый результат — вы не тратите время на погружение в детали. Фиксированная цена в договоре, никаких доплат.`, price: "от 90 $" },
      { icon: "🎯", name: "Аудит и стратегия", description: "За 60 минут разбираем ваш запрос, находим узкие места и даём конкретный план. Бесплатно для новых клиентов.", price: "Бесплатно" },
      { icon: "🛡️", name: "Абонентское обслуживание", description: "Фиксированная ежемесячная плата покрывает все задачи без лимитов. Средняя экономия клиента — 35% vs разовые заказы.", price: "от 200 $/мес" },
    ],
    features: [
      { icon: "📋", title: "Фиксированная цена договором", description: "Стоимость прописывается до старта. Если выходим за рамки — доплачиваем мы, не вы." },
      { icon: "⏱️", title: "Сроки как в договоре или -20%", description: "За каждый день просрочки вычитаем 20% от стоимости. За 5 лет применили скидку 4 раза." },
      { icon: "📞", title: "Менеджер отвечает за 15 минут", description: "Выделенный менеджер на вашем проекте. Статус обновляется каждый день в Telegram." },
    ],
    stats: [
      { value: "847", label: "проектов завершено" },
      { value: "5 лет", label: "средний срок работы клиента" },
      { value: "4.9/5", label: "средняя оценка на Google" },
    ],
    testimonial: {
      text: `Сделали за 2 дня то, что другие оценивали в 2 недели. Всё чётко по смете — никаких «а давайте ещё добавим». Теперь только к ним.`,
      author: "Дмитрий Ковалёв",
      role: "Владелец, «АвтоЛюкс Минск»",
    },
    ctaHeadline:   "Получите расчёт за 15 минут",
    ctaSubtext:    "Звоним сами — вам не нужно ничего готовить. Просто скажите что нужно.",
    phone:         "+375 29 000-00-00",
    email:         `info@${businessName.toLowerCase().replace(/\s+/g, "")}.by`,
    footerTagline: "Минск · Работаем с 2019",
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
