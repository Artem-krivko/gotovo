"use client"

import { useState, useCallback } from "react"
import { GeneratorForm } from "@/components/generator/generator-form"
import { GeneratorGallery, type GalleryPreset } from "@/components/generator/generator-gallery"
import { GeneratorPreview, GeneratorSkeleton } from "@/components/generator/generator-preview"
import type { GeneratorParams } from "@/lib/types"

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

export default function GeneratorPage() {
  const [step, setStep] = useState<"gallery" | "form">("gallery")
  const [preset, setPreset] = useState<GalleryPreset | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedHtml, setGeneratedHtml] = useState<string>("")
  const [designId, setDesignId] = useState<string>("")
  const [lastParams, setLastParams] = useState<GeneratorParams | null>(null)

  const handleGallerySelect = useCallback((p: GalleryPreset | null) => {
    setPreset(p)
    setStep("form")
    setGeneratedHtml("")
    setDesignId("")
  }, [])

  const handleResult = useCallback((html: string, id: string, params: GeneratorParams) => {
    setGeneratedHtml(html)
    setDesignId(id)
    setLastParams(params)
    setIsLoading(false)
  }, [])

  const handleLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
    if (!loading && !generatedHtml) {
      // error: stay on form with empty preview
    }
  }, [generatedHtml])

  const handleRegenerate = useCallback(async () => {
    if (!lastParams) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params: lastParams }),
      })
      const data = await res.json() as { html?: string; designId?: string; error?: string }
      if (!res.ok || !data.html) throw new Error(data.error)
      setGeneratedHtml(data.html)
      setDesignId(data.designId ?? "")
    } catch {
      // keep existing result
    } finally {
      setIsLoading(false)
    }
  }, [lastParams])

  const hasResult = !isLoading && !!generatedHtml

  // ── Шаг 1: галерея примеров ─────────────────────────────────────────────────
  if (step === "gallery") {
    return <GeneratorGallery onSelect={handleGallerySelect} />
  }

  // ── Шаг 2+: форма + превью ──────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row">

      {/* ── Левая панель: форма ───────────────────────────────────────────── */}
      <div className={`w-full shrink-0 flex-col border-b border-zinc-200 bg-white lg:w-[400px] lg:border-b-0 lg:border-r ${hasResult ? "hidden lg:flex" : "flex"}`}>
        <div className="border-b border-zinc-100 px-5 py-4">
          <button
            type="button"
            onClick={() => setStep("gallery")}
            className="mb-3 flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-700"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            К примерам
          </button>
          <h1 className="text-base font-semibold text-zinc-950">
            AI Design Generator
          </h1>
          <p className="text-xs text-zinc-400">
            Опишите бизнес — получите дизайн за 30 сек
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <GeneratorForm
            key={JSON.stringify(preset)}
            onResult={handleResult}
            onLoading={handleLoading}
            isLoading={isLoading}
            defaultValues={preset ?? undefined}
          />
        </div>
      </div>

      {/* ── Правая панель: превью ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50">
        {isLoading ? (
          <GeneratorSkeleton />
        ) : hasResult ? (
          <GeneratorPreview
            html={generatedHtml}
            designId={designId}
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
