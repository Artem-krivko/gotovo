"use client"

import { useState, useCallback } from "react"
import { GeneratorForm } from "@/components/generator/generator-form"
import { GeneratorPreview, GeneratorSkeleton } from "@/components/generator/generator-preview"
import type { GeneratorParams } from "@/lib/types"

// ─── Типы состояния ───────────────────────────────────────────────────────────

type GeneratorState = "idle" | "loading" | "result"

// ─── Заглушка пустого состояния ───────────────────────────────────────────────

function EmptyPreview() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="relative">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-100 to-blue-100" aria-hidden="true" />
        <span className="absolute inset-0 flex items-center justify-center text-3xl" aria-hidden="true">✦</span>
      </div>
      <div>
        <p className="font-semibold text-zinc-800">Здесь появится ваш сайт</p>
        <p className="mt-1 text-sm text-zinc-400">
          Заполните форму слева и нажмите «Сгенерировать»
        </p>
      </div>
      <div className="mt-2 flex flex-col gap-2 text-xs text-zinc-300">
        <span>⚡ Генерация занимает ~30 секунд</span>
        <span>🎨 Реальный HTML который можно открыть в браузере</span>
        <span>🆓 Бесплатно и без регистрации</span>
      </div>
    </div>
  )
}

// ─── Основной Client Component ────────────────────────────────────────────────

export default function GeneratorPage() {
  const [generatorState, setGeneratorState] = useState<GeneratorState>("idle")
  const [generatedHtml, setGeneratedHtml] = useState<string>("")
  const [lastParams, setLastParams] = useState<GeneratorParams | null>(null)

  const handleResult = useCallback((html: string, params: GeneratorParams) => {
    setGeneratedHtml(html)
    setLastParams(params)
    setGeneratorState("result")
  }, [])

  const handleLoading = useCallback((loading: boolean) => {
    setGeneratorState(loading ? "loading" : "idle")
  }, [])

  const handleRegenerate = useCallback(async () => {
    if (!lastParams) return
    setGeneratorState("loading")

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params: lastParams }),
      })
      const data = await res.json() as { html?: string; error?: string }
      if (!res.ok || !data.html) throw new Error(data.error)
      setGeneratedHtml(data.html)
      setGeneratorState("result")
    } catch {
      setGeneratorState("result") // Остаёмся на результате при ошибке
    }
  }, [lastParams])

  const isLoading = generatorState === "loading"
  const hasResult = generatorState === "result" && generatedHtml

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row">

      {/* ── Левая панель: форма ────────────────────────────────────────────── */}
      <div className="flex w-full shrink-0 flex-col border-b border-zinc-200 bg-white lg:w-[400px] lg:border-b-0 lg:border-r">
        {/* Заголовок панели */}
        <div className="border-b border-zinc-100 px-5 py-4">
          <h1 className="text-base font-semibold text-zinc-950">
            AI Design Generator
          </h1>
          <p className="text-xs text-zinc-400">
            Опишите бизнес — получите дизайн за 30 сек
          </p>
        </div>

        {/* Форма со скроллом */}
        <div className="flex-1 overflow-y-auto p-5">
          <GeneratorForm
            onResult={handleResult}
            onLoading={handleLoading}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ── Правая панель: превью ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50">
        {isLoading && !hasResult ? (
          <GeneratorSkeleton />
        ) : hasResult ? (
          <GeneratorPreview
            html={generatedHtml}
            onRegenerate={handleRegenerate}
            isLoading={isLoading}
          />
        ) : (
          <EmptyPreview />
        )}
      </div>

    </div>
  )
}
