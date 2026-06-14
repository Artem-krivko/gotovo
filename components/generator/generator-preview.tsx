"use client"

import { useState, useCallback, useEffect, useRef } from "react"

interface GeneratorPreviewProps {
  html: string
  designId: string
  onRegenerate: () => void
  isLoading: boolean
}

// ─── Скелетон загрузки ────────────────────────────────────────────────────────

export function GeneratorSkeleton() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
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
      <path d="M2 8a6 6 0 0111-3M14 8a6 6 0 01-11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 2v3h-3M3 14v-3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 2h4v4M6 14H2v-4M14 2l-5 5M2 14l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Баннер через 10 секунд ───────────────────────────────────────────────────

type BannerState = "form" | "loading" | "done"

function TimedBanner({ designId, onDismiss }: { designId: string; onDismiss: () => void }) {
  const [phone, setPhone] = useState("")
  const [state, setState] = useState<BannerState>("form")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("loading")
    try {
      const res = await fetch("/api/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designId, phone }),
      })
      const data = await res.json() as { success?: boolean }
      if (res.ok && data.success) {
        setState("done")
        setTimeout(onDismiss, 2500)
      } else {
        setState("form")
      }
    } catch {
      setState("form")
    }
  }

  return (
    <div className="absolute bottom-[76px] left-3 right-3 z-20">
      <div className="rounded-2xl border border-violet-200 bg-white px-4 py-3 shadow-2xl shadow-violet-500/15">
        {state === "done" ? (
          <p className="py-1 text-center text-sm font-semibold text-emerald-600">
            Отлично! Перезвоним в течение часа ✓
          </p>
        ) : (
          <>
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900">Понравился дизайн? Оставьте номер</p>
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Закрыть"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+375 (29) 000-00-00"
                className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-500/25 transition hover:opacity-90 disabled:opacity-60"
              >
                {state === "loading" ? "..." : "Перезвоним →"}
              </button>
            </form>
            <p className="mt-1.5 text-xs text-[#6B6B80]">Перезвоним в течение часа · Без обязательств</p>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Модальное окно заявки ────────────────────────────────────────────────────

type OrderState = "form" | "loading" | "success" | "error"

function OrderModal({ designId, onClose }: { designId: string; onClose: () => void }) {
  const [state, setState] = useState<OrderState>("form")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designId, name, phone, email, comment }),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok || !data.success) throw new Error(data.error ?? "Ошибка отправки")
      setState("success")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Попробуйте ещё раз")
      setState("error")
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem] sm:p-8">

        {/* Шапка */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              {state === "success" ? "Заявка отправлена!" : "Обсудить проект"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {state === "success"
                ? "Перезвоним в течение часа"
                : "Оставьте телефон — перезвоним и обсудим детали бесплатно"}
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

        {/* Успех */}
        {state === "success" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl text-white font-bold">
              ✓
            </div>
            <p className="text-sm text-zinc-500">
              Ваш дизайн сохранён и прикреплён к заявке. Мы уже видим его и скоро напишем.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition"
            >
              Закрыть
            </button>
          </div>
        )}

        {/* Форма */}
        {(state === "form" || state === "loading" || state === "error") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+375 (29) 000-00-00"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Имя <span className="text-zinc-400 font-normal">(необязательно)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Email <span className="text-zinc-400 font-normal">(необязательно)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Пожелания, сроки, бюджет..."
                rows={3}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
              />
            </div>

            {state === "error" && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full rounded-xl bg-zinc-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {state === "loading" ? "Отправляем..." : "Отправить заявку →"}
            </button>
            <p className="text-center text-xs text-zinc-400">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Основной компонент превью ────────────────────────────────────────────────

export function GeneratorPreview({ html, designId, onRegenerate, isLoading }: GeneratorPreviewProps) {
  const [showModal, setShowModal] = useState(false)
  const [showTimedBanner, setShowTimedBanner] = useState(false)
  const bannerFiredRef = useRef(false)

  // Запускаем баннер через 10 секунд после первой генерации
  useEffect(() => {
    if (!html || isLoading || bannerFiredRef.current) return
    bannerFiredRef.current = true
    const timer = setTimeout(() => setShowTimedBanner(true), 10_000)
    return () => clearTimeout(timer)
  }, [html, isLoading])

  // Скрываем баннер когда открывается основной модал
  useEffect(() => {
    if (showModal) setShowTimedBanner(false)
  }, [showModal])

  const handleOpenInTab = useCallback(() => {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }, [html])

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Тулбар превью */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
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
            className="h-full w-full border-0"
            loading="lazy"
          />
          {showTimedBanner && !showModal && (
            <TimedBanner
              designId={designId}
              onDismiss={() => setShowTimedBanner(false)}
            />
          )}
        </div>

        {/* CTA панель */}
        <div className="flex flex-col items-center gap-3 border-t border-zinc-200 bg-white px-4 py-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-950">Понравился дизайн?</p>
            <p className="text-xs text-zinc-400">
              Добавим ваши фото, анимации и SEO — перезвоним в течение часа
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <a
              href="https://t.me/Artem_k_r"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-[#2AABEE]/40 hover:bg-[#2AABEE]/5 hover:text-[#1a96d4] sm:w-auto"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#2AABEE]" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.14 14.5l-2.95-.924c-.64-.203-.654-.64.136-.954l11.527-4.448c.537-.194 1.006.131.71.074z"/>
              </svg>
              Написать в Telegram
            </a>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
            >
              Обсудить бесплатно →
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <OrderModal designId={designId} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
