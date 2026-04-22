"use client"

import { useState, useCallback } from "react"
import { ContactForm } from "@/components/sections/contact-form"

// ─── Типы ─────────────────────────────────────────────────────────────────────

interface GeneratorPreviewProps {
  html: string
  onRegenerate: () => void
  isLoading: boolean
}

// ─── Скелетон загрузки ────────────────────────────────────────────────────────

export function GeneratorSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      {/* Анимированные блоки */}
      <div className="w-full max-w-md space-y-3">
        <div className="h-8 w-3/4 animate-pulse rounded-xl bg-zinc-200 mx-auto" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-zinc-200 mx-auto" />
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-zinc-200" />
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-200" />
          ))}
        </div>
        <div className="h-16 animate-pulse rounded-2xl bg-zinc-200" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:0ms]" aria-hidden="true" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:150ms]" aria-hidden="true" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:300ms]" aria-hidden="true" />
        </div>
        <p className="text-sm text-zinc-500">ИИ создаёт дизайн вашего сайта...</p>
        <p className="text-xs text-zinc-400">Обычно 15–30 секунд</p>
      </div>
    </div>
  )
}

// ─── Иконки ───────────────────────────────────────────────────────────────────

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8a6 6 0 0111-3M14 8a6 6 0 01-11 3" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 2v3h-3M3 14v-3h3" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 2h4v4M6 14H2v-4M14 2l-5 5M2 14l5-5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Модальное окно заявки ────────────────────────────────────────────────────

function RequestModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Форма заявки на разработку"
    >
      <div className="w-full max-w-lg rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem] sm:p-8">
        {/* Шапка */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              Заказать разработку
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Сделаем финальный сайт на основе этого дизайна
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-400 transition hover:bg-zinc-50"
          >
            ✕
          </button>
        </div>

        <ContactForm />
      </div>
    </div>
  )
}

// ─── Основной компонент превью ────────────────────────────────────────────────

export function GeneratorPreview({ html, onRegenerate, isLoading }: GeneratorPreviewProps) {
  const [showModal, setShowModal] = useState(false)

  const handleOpenInTab = useCallback(() => {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
    // Освобождаем память через 60 сек
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }, [html])

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Тулбар превью */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          {/* Браузер-декор */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>

          <div className="flex-1 rounded-lg bg-white border border-zinc-200 px-3 py-1 text-xs text-zinc-400 truncate">
            preview.ai-web-studio.dev
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenInTab}
              title="Открыть на весь экран"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 transition hover:bg-zinc-50"
            >
              <ExpandIcon />
              <span className="hidden sm:inline">На весь экран</span>
            </button>

            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading}
              title="Сгенерировать заново"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 transition hover:bg-zinc-50 disabled:opacity-50"
            >
              <RefreshIcon />
              <span className="hidden sm:inline">Ещё раз</span>
            </button>
          </div>
        </div>

        {/* iframe */}
        <div className="relative flex-1 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white">
              <GeneratorSkeleton />
            </div>
          )}
          <iframe
            srcDoc={html}
            title="Превью сгенерированного сайта"
            sandbox="allow-scripts allow-same-origin"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>

        {/* CTA панель */}
        <div className="flex flex-col items-center gap-3 border-t border-zinc-200 bg-white px-4 py-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-950">
              Нравится направление?
            </p>
            <p className="text-xs text-zinc-400">
              Финальный сайт будет лучше — с вашим контентом и полным функционалом
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full shrink-0 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg sm:w-auto"
          >
            Заказать разработку →
          </button>
        </div>
      </div>

      {showModal && <RequestModal onClose={() => setShowModal(false)} />}
    </>
  )
}
