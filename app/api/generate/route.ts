import { NextRequest, NextResponse } from "next/server"
import { GENERATOR_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts"
import type { GenerateApiRequest, GeneratorParams } from "@/lib/types"

// Vercel hobby — max 30s. Генерация HTML занимает 10-20s.
export const maxDuration = 30

// ─── Валидация ────────────────────────────────────────────────────────────────

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

// ─── Демо-заглушка (пока нет API ключа) ──────────────────────────────────────

function buildDemoHtml(params: GeneratorParams): string {
  const names: Record<string, string> = {
    modern: "Gradient Studio",
    minimal: "White Space Co",
    bold: "BoldBrand",
    corporate: "ProCorp Solutions",
  }
  const name = params.businessName || names[params.style] || "Your Business"

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Inter', sans-serif; }
    .gradient-text { background: linear-gradient(135deg, #6366f1, #a855f7, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body class="bg-white text-zinc-900 antialiased">

  <!-- Header -->
  <header class="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <span class="text-lg font-bold tracking-tight">${name}</span>
      <nav class="hidden gap-6 text-sm font-medium text-zinc-600 md:flex">
        <a href="#" class="hover:text-zinc-900 transition-colors">Услуги</a>
        <a href="#" class="hover:text-zinc-900 transition-colors">О нас</a>
        <a href="#" class="hover:text-zinc-900 transition-colors">Контакты</a>
      </nav>
      <a href="#" class="hidden rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors md:block">Связаться</a>
    </div>
  </header>

  <!-- Hero -->
  <section class="relative overflow-hidden px-6 py-24 text-center md:py-36">
    <div class="absolute inset-0 -z-10" style="background: radial-gradient(circle at 30% 40%, rgba(99,102,241,0.12), transparent 50%), radial-gradient(circle at 70% 60%, rgba(168,85,247,0.10), transparent 50%);"></div>
    <div class="mx-auto max-w-4xl">
      <span class="mb-4 inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700">
        ✦ ${params.businessType}
      </span>
      <h1 class="mt-4 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
        <span class="gradient-text">${name}</span>
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
        ${params.userDescription.slice(0, 120)}${params.userDescription.length > 120 ? "..." : ""}
      </p>
      <div class="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <a href="#" class="w-full rounded-2xl bg-zinc-900 px-8 py-4 text-sm font-bold text-white shadow-xl hover:bg-zinc-700 transition-all hover:-translate-y-0.5 sm:w-auto">
          Начать сотрудничество →
        </a>
        <a href="#" class="w-full rounded-2xl border border-zinc-200 px-8 py-4 text-sm font-semibold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors sm:w-auto">
          Узнать больше
        </a>
      </div>
      <p class="mt-6 text-xs text-zinc-400">⭐⭐⭐⭐⭐ Более 50 довольных клиентов</p>
    </div>
  </section>

  <!-- Features -->
  <section class="bg-zinc-50 px-6 py-20">
    <div class="mx-auto max-w-6xl">
      <h2 class="mb-12 text-center text-3xl font-bold tracking-tight">Почему выбирают нас</h2>
      <div class="grid gap-6 md:grid-cols-3">
        ${["Профессиональная команда", "Быстрые сроки", "Гарантия результата"].map((title, i) => `
        <div class="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm hover:shadow-lg transition-shadow">
          <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
            ${["⚡", "🎯", "✅"][i]}
          </div>
          <h3 class="mb-2 text-lg font-bold">${title}</h3>
          <p class="text-sm leading-6 text-zinc-500">Мы обеспечиваем высокое качество на каждом этапе работы с вашим проектом.</p>
        </div>`).join("")}
      </div>
    </div>
  </section>

  <!-- Testimonial -->
  <section class="px-6 py-20">
    <div class="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-violet-50 to-blue-50 p-10 text-center shadow-sm">
      <p class="text-xl font-medium italic leading-relaxed text-zinc-700">
        "Отличная работа! Результат превзошёл все ожидания. Рекомендую всем кто ищет надёжного партнёра."
      </p>
      <div class="mt-6 flex items-center justify-center gap-3">
        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-blue-400"></div>
        <div class="text-left">
          <p class="text-sm font-bold">Александр М.</p>
          <p class="text-xs text-zinc-400">Генеральный директор</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-zinc-900 px-6 py-20 text-white">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-4xl font-extrabold tracking-tight">Готовы начать?</h2>
      <p class="mt-4 text-lg text-zinc-400">Свяжитесь с нами сегодня и получите бесплатную консультацию</p>
      <a href="tel:+79991234567" class="mt-8 inline-block rounded-2xl bg-white px-10 py-4 text-sm font-bold text-zinc-900 shadow-xl hover:bg-zinc-100 transition-colors hover:-translate-y-0.5">
        +7 (999) 123-45-67
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-zinc-100 px-6 py-8">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-zinc-400 md:flex-row">
      <span class="font-semibold text-zinc-700">${name}</span>
      <span>© 2025 Все права защищены</span>
      <span>info@example.ru</span>
    </div>
  </footer>

</body>
</html>`
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
    const apiKey = process.env.ANTHROPIC_API_KEY

    // Если ключа нет — возвращаем красивую заглушку
    if (!apiKey) {
      const demoHtml = buildDemoHtml(params)
      return NextResponse.json({ html: demoHtml }, { status: 200 })
    }

    // Реальный вызов Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: GENERATOR_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildUserPrompt(params),
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[POST /api/generate] Anthropic error:", errorText)
      return NextResponse.json(
        { error: "Ошибка генерации. Попробуйте ещё раз." },
        { status: 502 }
      )
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>
    }

    const html = data.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim()

    if (!html.includes("<!DOCTYPE") && !html.includes("<html")) {
      console.error("[POST /api/generate] Invalid HTML received")
      return NextResponse.json(
        { error: "Получен некорректный результат. Попробуйте ещё раз." },
        { status: 502 }
      )
    }

    return NextResponse.json({ html }, { status: 200 })

  } catch (error) {
    console.error("[POST /api/generate]", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка. Попробуйте ещё раз." },
      { status: 500 }
    )
  }
}
