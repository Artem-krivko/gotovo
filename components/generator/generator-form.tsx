"use client"

import { useState, useCallback, useRef } from "react"
import type {
  ContentSource,
  GeneratedConcept,
  GenerateApiResponse,
  GenerationFailureReason,
  GeneratorParams,
  GeneratorStyle,
  GeneratorLanguage,
} from "@/lib/types"
import { track } from "@/lib/analytics"
import type { PageAssets, PageContent } from "@/lib/design/content"
import type { DesignSpec } from "@/lib/design/spec"
import { readApiResponse } from "@/lib/api-response"

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

function nonEmptyLines(value: string, limit: number): string[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, limit)
}

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

interface DefaultValues {
  businessType?: string
  style?: GeneratorStyle
  description?: string
}

interface GeneratorFormProps {
  onResult: (
    html: string,
    designId: string,
    params: GeneratorParams,
    source: ContentSource,
    content: PageContent,
    spec: DesignSpec,
    assets: PageAssets,
    concepts: GeneratedConcept[],
    failureReason: GenerationFailureReason,
    requestId: string
  ) => void
  onLoading: (loading: boolean) => void
  isLoading: boolean
  defaultValues?: DefaultValues
}

// ─── Компонент ────────────────────────────────────────────────────────────────

export function GeneratorForm({ onResult, onLoading, isLoading, defaultValues }: GeneratorFormProps) {
  const [businessType, setBusinessType] = useState(defaultValues?.businessType ?? "")
  const [businessName, setBusinessName] = useState("")
  const [userDescription, setUserDescription] = useState(defaultValues?.description ?? "")
  const [style, setStyle] = useState<GeneratorStyle>(defaultValues?.style ?? "modern")
  const [language, setLanguage] = useState<GeneratorLanguage>("ru")
  // Расширенный бриф скрыт за progressive disclosure: быстрый сценарий
  // (тип бизнеса + описание + стиль) остаётся в три поля.
  const [showDetails, setShowDetails] = useState(false)
  const [audience, setAudience] = useState("")
  const [mainAction, setMainAction] = useState("")
  const [geography, setGeography] = useState("")
  const [brandColor, setBrandColor] = useState("")
  const [advantages, setAdvantages] = useState("")
  const [serviceAreas, setServiceAreas] = useState("")
  const [referenceImages, setReferenceImages] = useState("")
  // Факты — единственный источник цифр и отзывов на странице.
  const [yearsInBusiness, setYearsInBusiness] = useState("")
  const [projectsCompleted, setProjectsCompleted] = useState("")
  const [priceFrom, setPriceFrom] = useState("")
  const [guarantee, setGuarantee] = useState("")
  const [testimonialText, setTestimonialText] = useState("")
  const [testimonialAuthor, setTestimonialAuthor] = useState("")
  const [caseTitle, setCaseTitle] = useState("")
  const [caseSummary, setCaseSummary] = useState("")
  const [caseResult, setCaseResult] = useState("")
  const [teamMemberName, setTeamMemberName] = useState("")
  const [teamMemberRole, setTeamMemberRole] = useState("")
  const [error, setError] = useState("")
  // generator_form_started шлём один раз — на первое реальное касание формы,
  // а не на монтирование: иначе событие срабатывало бы у всех, кто просто
  // пролистал страницу.
  const formStartedRef = useRef(false)

  const handleFirstInteraction = useCallback(() => {
    if (formStartedRef.current) return
    formStartedRef.current = true
    track("generator_form_started")
  }, [])

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
        colorPreference: brandColor.trim() || undefined,
        audience: audience.trim() || undefined,
        mainAction: mainAction.trim() || undefined,
        geography: geography.trim() || undefined,
        advantages: nonEmptyLines(advantages, 4),
        referenceImages: nonEmptyLines(referenceImages, 6),
        facts: {
          yearsInBusiness: yearsInBusiness.trim() || undefined,
          projectsCompleted: projectsCompleted.trim() || undefined,
          priceFrom: priceFrom.trim() || undefined,
          geography: geography.trim() || undefined,
          guarantees: guarantee.trim() ? [guarantee.trim()] : [],
          // Отзыв попадает на страницу, только если указаны и текст, и автор.
          testimonials:
            testimonialText.trim() && testimonialAuthor.trim()
              ? [{ text: testimonialText.trim(), author: testimonialAuthor.trim(), role: "" }]
              : [],
          caseStudies:
            caseTitle.trim() && caseSummary.trim()
              ? [{ title: caseTitle.trim(), summary: caseSummary.trim(), result: caseResult.trim() || undefined }]
              : [],
          teamMembers:
            teamMemberName.trim() && teamMemberRole.trim()
              ? [{ name: teamMemberName.trim(), role: teamMemberRole.trim() }]
              : [],
          serviceAreas: nonEmptyLines(serviceAreas, 8),
        },
      }

      track("generator_submitted", {
        businessType,
        style,
        language,
        descriptionLength: userDescription.trim().length,
      })
      onLoading(true)

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ params }),
        })

        const data = await readApiResponse<GenerateApiResponse>(res, "Ошибка генерации")

        if (!res.ok || !data.html || !data.content || !data.spec || !data.assets) {
          throw new Error(data.error ?? "Ошибка генерации")
        }

        onResult(
          data.html,
          data.designId ?? "",
          params,
          data.source ?? "ai",
          data.content,
          data.spec,
          data.assets,
          data.concepts ?? [],
          data.failureReason ?? "none",
          data.requestId ?? ""
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Попробуйте ещё раз"
        track("generation_failed", { stage: "submit", reason: msg.slice(0, 80) })
        setError(msg)
      } finally {
        onLoading(false)
      }
    },
    [
      businessType, businessName, userDescription, style, language,
      brandColor, audience, mainAction, geography,
      advantages, serviceAreas, referenceImages,
      yearsInBusiness, projectsCompleted, priceFrom, guarantee,
      testimonialText, testimonialAuthor,
      caseTitle, caseSummary, caseResult, teamMemberName, teamMemberRole,
      onResult, onLoading,
    ]
  )

  return (
    <form onSubmit={handleSubmit} noValidate onFocusCapture={handleFirstInteraction} className="flex flex-col gap-6">

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

      {/* Расширенный бриф — по желанию */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50/60">
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          aria-expanded={showDetails}
          className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left"
        >
          <span>
            <span className="block text-sm font-semibold text-zinc-800">
              Уточнить детали
            </span>
            <span className="block text-xs text-zinc-500">
              Реальные факты и цифры — чтобы мы ничего не выдумывали
            </span>
          </span>
          <span aria-hidden="true" className={`text-lg text-zinc-400 transition-transform ${showDetails ? "rotate-45" : ""}`}>
            +
          </span>
        </button>

        {showDetails && (
          <div className="flex flex-col gap-4 border-t border-zinc-200 px-4 py-4">
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
              ИИ не придумывает цифры, отзывы и гарантии. Что не заполните —
              останется явным местом под ваши данные.
            </p>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gen-audience" className="text-xs font-semibold text-zinc-700">
                Кто ваш клиент
              </label>
              <input
                id="gen-audience" type="text" value={audience}
                onChange={(e) => setAudience(e.target.value)} disabled={isLoading}
                placeholder="Например: владельцы квартир 30–50 лет"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gen-action" className="text-xs font-semibold text-zinc-700">
                Главное действие посетителя
              </label>
              <input
                id="gen-action" type="text" value={mainAction}
                onChange={(e) => setMainAction(e.target.value)} disabled={isLoading}
                placeholder="Позвонить, записаться, оставить заявку"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gen-geo" className="text-xs font-semibold text-zinc-700">
                  Город
                </label>
                <input
                  id="gen-geo" type="text" value={geography}
                  onChange={(e) => setGeography(e.target.value)} disabled={isLoading}
                  placeholder="Минск"
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gen-color" className="text-xs font-semibold text-zinc-700">
                  Цвет бренда
                </label>
                <input
                  id="gen-color" type="text" value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)} disabled={isLoading}
                  placeholder="#2563EB"
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gen-advantages" className="text-xs font-semibold text-zinc-700">
                Чем вы реально отличаетесь
              </label>
              <textarea
                id="gen-advantages" rows={3} value={advantages}
                onChange={(e) => setAdvantages(e.target.value)} disabled={isLoading}
                placeholder={"Свой парк техники\nРаботаем по договору\nУзкая специализация"}
                className="resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
              />
              <p className="text-xs text-zinc-500">По одному преимуществу в строке.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gen-areas" className="text-xs font-semibold text-zinc-700">
                Города и районы работы
              </label>
              <textarea
                id="gen-areas" rows={2} value={serviceAreas}
                onChange={(e) => setServiceAreas(e.target.value)} disabled={isLoading}
                placeholder={"Минск\nМинский район"}
                className="resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gen-years" className="text-xs font-semibold text-zinc-700">
                  Лет на рынке
                </label>
                <input
                  id="gen-years" type="text" value={yearsInBusiness}
                  onChange={(e) => setYearsInBusiness(e.target.value)} disabled={isLoading}
                  placeholder="12"
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gen-projects" className="text-xs font-semibold text-zinc-700">
                  Выполнено проектов
                </label>
                <input
                  id="gen-projects" type="text" value={projectsCompleted}
                  onChange={(e) => setProjectsCompleted(e.target.value)} disabled={isLoading}
                  placeholder="340"
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gen-price" className="text-xs font-semibold text-zinc-700">
                Цена от
              </label>
              <input
                id="gen-price" type="text" value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)} disabled={isLoading}
                placeholder="от 150 $"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-3">
              <p className="text-xs font-semibold text-zinc-700">Реальный кейс</p>
              <input
                type="text" value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)}
                disabled={isLoading} placeholder="Например: Септик для дома в Могилёве"
                aria-label="Название кейса"
                className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              />
              <textarea
                rows={2} value={caseSummary} onChange={(e) => setCaseSummary(e.target.value)}
                disabled={isLoading} placeholder="Что сделали — только реальные сведения"
                aria-label="Описание кейса"
                className="resize-none rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              />
              <input
                type="text" value={caseResult} onChange={(e) => setCaseResult(e.target.value)}
                disabled={isLoading} placeholder="Результат, если его можно подтвердить"
                aria-label="Результат кейса"
                className="rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gen-team-name" className="text-xs font-semibold text-zinc-700">Имя специалиста</label>
                <input id="gen-team-name" type="text" value={teamMemberName}
                  onChange={(e) => setTeamMemberName(e.target.value)} disabled={isLoading}
                  placeholder="Анна" className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gen-team-role" className="text-xs font-semibold text-zinc-700">Роль</label>
                <input id="gen-team-role" type="text" value={teamMemberRole}
                  onChange={(e) => setTeamMemberRole(e.target.value)} disabled={isLoading}
                  placeholder="Фотограф" className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gen-photos" className="text-xs font-semibold text-zinc-700">
                Ссылки на ваши фотографии
              </label>
              <textarea
                id="gen-photos" rows={3} value={referenceImages}
                onChange={(e) => setReferenceImages(e.target.value)} disabled={isLoading}
                placeholder={"https://.../photo-1.jpg\nhttps://.../photo-2.jpg"}
                className="resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
              />
              <p className="text-xs text-zinc-500">До 6 прямых HTTPS-ссылок, по одной в строке.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gen-guarantee" className="text-xs font-semibold text-zinc-700">
                Реальная гарантия
              </label>
              <input
                id="gen-guarantee" type="text" value={guarantee}
                onChange={(e) => setGuarantee(e.target.value)} disabled={isLoading}
                placeholder="Договор до начала работ"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="gen-testimonial" className="text-xs font-semibold text-zinc-700">
                Реальный отзыв клиента
              </label>
              <textarea
                id="gen-testimonial" rows={2} value={testimonialText}
                onChange={(e) => setTestimonialText(e.target.value)} disabled={isLoading}
                placeholder="Дословный текст отзыва"
                className="resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
              />
              <input
                type="text" value={testimonialAuthor}
                onChange={(e) => setTestimonialAuthor(e.target.value)} disabled={isLoading}
                placeholder="Кто это сказал — имя обязательно"
                aria-label="Автор отзыва"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
              />
              <p className="text-xs text-zinc-500">
                Без имени автора отзыв не будет показан.
              </p>
            </div>
          </div>
        )}
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
