"use client"

import { useState, useCallback } from "react"
import type { GeneratorParams, GeneratorStyle, GeneratorLanguage } from "@/lib/types"

// ─── Статические данные формы ────────────────────────────────────────────────

const BUSINESS_TYPES = [
  "Стоматология",
  "Кофейня / кафе",
  "Ресторан",
  "Салон красоты",
  "Фитнес-клуб",
  "Юридические услуги",
  "Бухгалтерские услуги",
  "IT-агентство",
  "Строительная компания",
  "Медицинская клиника",
  "Образование / курсы",
  "Недвижимость",
  "Интернет-магазин",
  "Фотограф / видеограф",
  "Другое",
] as const

interface StyleOption {
  value: GeneratorStyle
  label: string
  description: string
  preview: string
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    value: "modern",
    label: "Современный",
    description: "Технологичный, акцентный цвет",
    preview: "bg-gradient-to-br from-violet-500 to-blue-500",
  },
  {
    value: "minimal",
    label: "Минимализм",
    description: "Чисто, много воздуха",
    preview: "bg-zinc-100 border border-zinc-300",
  },
  {
    value: "bold",
    label: "Смелый",
    description: "Яркий, экспрессивный",
    preview: "bg-gradient-to-br from-orange-400 to-pink-500",
  },
  {
    value: "corporate",
    label: "Корпоративный",
    description: "Строгий, вызывает доверие",
    preview: "bg-gradient-to-br from-blue-700 to-blue-900",
  },
]

// ─── Иконки ───────────────────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
      aria-hidden="true" className="animate-spin">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"
        strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" opacity="0.3" />
      <path d="M9 2a7 7 0 017 7" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" />
    </svg>
  )
}

// ─── Типы пропсов ─────────────────────────────────────────────────────────────

interface GeneratorFormProps {
  onResult: (html: string, params: GeneratorParams) => void
  onLoading: (loading: boolean) => void
  isLoading: boolean
}

// ─── Компонент ────────────────────────────────────────────────────────────────

export function GeneratorForm({ onResult, onLoading, isLoading }: GeneratorFormProps) {
  const [businessType, setBusinessType] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [userDescription, setUserDescription] = useState("")
  const [style, setStyle] = useState<GeneratorStyle>("modern")
  const [language, setLanguage] = useState<GeneratorLanguage>("ru")
  const [error, setError] = useState("")

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError("")

      if (!businessType) {
        setError("Выберите тип бизнеса")
        return
      }
      if (userDescription.trim().length < 10) {
        setError("Опишите бизнес подробнее (минимум 10 символов)")
        return
      }

      const params: GeneratorParams = {
        businessType,
        businessName: businessName.trim() || undefined,
        userDescription: userDescription.trim(),
        style,
        language,
      }

      onLoading(true)

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ params }),
        })

        const data = await res.json() as { html?: string; error?: string }

        if (!res.ok || !data.html) {
          throw new Error(data.error ?? "Ошибка генерации")
        }

        onResult(data.html, params)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Попробуйте ещё раз"
        setError(msg)
      } finally {
        onLoading(false)
      }
    },
    [businessType, businessName, userDescription, style, language, onResult, onLoading]
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      {/* Тип бизнеса */}
      <div className="flex flex-col gap-2">
        <label htmlFor="gen-business-type"
          className="text-sm font-semibold text-zinc-800">
          Тип бизнеса <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id="gen-business-type"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          disabled={isLoading}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
        >
          <option value="">Выберите тип...</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Название (необязательно) */}
      <div className="flex flex-col gap-2">
        <label htmlFor="gen-business-name"
          className="text-sm font-semibold text-zinc-800">
          Название компании
          <span className="ml-1 text-xs font-normal text-zinc-400">(необязательно)</span>
        </label>
        <input
          id="gen-business-name"
          type="text"
          placeholder="Придумаем сами если не укажете"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          disabled={isLoading}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
        />
      </div>

      {/* Описание */}
      <div className="flex flex-col gap-2">
        <label htmlFor="gen-description"
          className="text-sm font-semibold text-zinc-800">
          Расскажите о бизнесе <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="gen-description"
          rows={4}
          placeholder="Например: уютная кофейня в центре города, акцент на specialty кофе и авторские десерты. Нужны: главная, меню, контакты."
          value={userDescription}
          onChange={(e) => setUserDescription(e.target.value)}
          disabled={isLoading}
          className="resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
        />
        <p className="text-xs text-zinc-400">
          {userDescription.length} символов — чем подробнее, тем лучше результат
        </p>
      </div>

      {/* Стиль */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-zinc-800">Стиль дизайна</p>
        <div className="grid grid-cols-2 gap-3">
          {STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStyle(opt.value)}
              disabled={isLoading}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition hover:-translate-y-0.5 disabled:opacity-50 ${
                style === opt.value
                  ? "border-violet-400 bg-violet-50 shadow-sm"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <span className={`h-8 w-8 shrink-0 rounded-lg ${opt.preview}`} aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-zinc-900">{opt.label}</span>
                <span className="block text-xs text-zinc-400">{opt.description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Язык */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-zinc-800">Язык сайта</p>
        <div className="flex gap-2">
          {(["ru", "en", "de"] as GeneratorLanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              disabled={isLoading}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition disabled:opacity-50 ${
                language === lang
                  ? "border-violet-400 bg-violet-50 text-violet-700"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
              }`}
            >
              {lang === "ru" ? "🇷🇺 RU" : lang === "en" ? "🇬🇧 EN" : "🇩🇪 DE"}
            </button>
          ))}
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Кнопка */}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <SpinnerIcon />
            Генерирую дизайн...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2l1.5 3.5L13 7l-3.5 1.5L8 12l-1.5-3.5L3 7l3.5-1.5L8 2z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            Сгенерировать дизайн
          </>
        )}
      </button>

      <p className="text-center text-xs text-zinc-400">
        Бесплатно · Без регистрации · ~30 секунд
      </p>
    </form>
  )
}
