"use client"

import { useState, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import type { GeneratorCase } from "@/content/generator-cases"

const ALL_LABEL = "Все"

interface Props {
  cases: GeneratorCase[]
  categories: string[]
}

// ─── Иконки ───────────────────────────────────────────────────────────────────

function IconArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconPlay() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 2l6 4-6 4V2z" fill="currentColor"/>
    </svg>
  )
}

// ─── Заглушка без изображения ─────────────────────────────────────────────────

function CardFallback({ gradient, label }: { gradient: string; label: string }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
      role="img"
      aria-label={`Превью дизайна — ${label}`}
    >
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="112" height="72" rx="6" fill="white" fillOpacity="0.04" stroke="white" strokeOpacity="0.08" strokeWidth="1"/>
        <rect x="4" y="4" width="112" height="14" rx="6" fill="white" fillOpacity="0.06"/>
        <circle cx="14" cy="11" r="2" fill="white" fillOpacity="0.3"/>
        <circle cx="22" cy="11" r="2" fill="white" fillOpacity="0.3"/>
        <circle cx="30" cy="11" r="2" fill="white" fillOpacity="0.3"/>
        <rect x="12" y="24" width="50" height="4" rx="2" fill="white" fillOpacity="0.2"/>
        <rect x="12" y="32" width="70" height="3" rx="1.5" fill="white" fillOpacity="0.1"/>
        <rect x="12" y="38" width="60" height="3" rx="1.5" fill="white" fillOpacity="0.1"/>
        <rect x="12" y="48" width="28" height="10" rx="3" fill="white" fillOpacity="0.15"/>
        <rect x="46" y="24" width="66" height="32" rx="4" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.06" strokeWidth="1"/>
      </svg>
    </div>
  )
}

// ─── Видео-карточка featured (row-span-2) ─────────────────────────────────────

function VideoFeaturedCard({ c }: { c: GeneratorCase }) {
  return (
    <Link
      href="/generator"
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#13131A] transition duration-300
        ${c.accent.border} hover:-translate-y-1 hover:shadow-2xl ${c.accent.glow}
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500`}
    >
      {/* Превью с видео — занимает большую часть карточки */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: "240px" }}>

        {/* Браузерная строка поверх видео */}
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-2 bg-[#1C1C28]/95 px-4 py-2.5 backdrop-blur-sm">
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80"/>
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"/>
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80"/>
          </div>
          <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md bg-white/[0.06] px-3 py-1 text-[10px] text-[#6B6B80]">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <circle cx="4" cy="4" r="3" stroke="currentColor" strokeOpacity="0.5"/>
              <path d="M2.5 4h3M4 2.5v3" stroke="currentColor" strokeOpacity="0.5"/>
            </svg>
            gotovo.studio / generator
          </div>
          {/* Live-бейдж */}
          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[9px] font-semibold text-violet-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" aria-hidden="true"/>
            Live
          </div>
        </div>

        {/* Само видео */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover object-top"
          style={{ paddingTop: "36px" }}
          aria-label="Реальная AI-генерация дизайна сайта за 30 секунд"
        >
          <source src={c.video!} type="video/mp4"/>
        </video>

        {/* Градиент снизу для плавного перехода в контент */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(to top, #13131A, transparent)" }}
          aria-hidden="true"
        />

        {/* Hover overlay с CTA */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="w-full p-5">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm">
              Попробовать бесплатно <IconArrowRight/>
            </span>
          </div>
        </div>

        {/* Бейдж "30 секунд" */}
        <div className="absolute right-3 top-12 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[10px] font-semibold text-amber-400 backdrop-blur-sm">
            <IconPlay/> 30 секунд
          </span>
        </div>
      </div>

      {/* Нижний контент карточки */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${c.accent.dot}`} aria-hidden="true"/>
            <p className="truncate font-semibold text-white">{c.label}</p>
          </div>
          <span className="shrink-0 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-400">
            {c.category}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#6B6B80]">{c.prompt}</p>
      </div>
    </Link>
  )
}

// ─── Обычная карточка ─────────────────────────────────────────────────────────

function CaseCard({ c, priority }: { c: GeneratorCase; priority: boolean }) {
  return (
    <Link
      href={`/generator?category=${encodeURIComponent(c.category)}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#13131A] transition duration-300
        ${c.accent.border} hover:-translate-y-1 hover:shadow-xl ${c.accent.glow}
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500`}
    >
      {/* Превью */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {c.video ? (
          <>
            {/* Браузерная строка */}
            <div className="absolute left-0 right-0 top-0 z-10 flex items-center gap-1.5 bg-[#1C1C28]/95 px-3 py-2 backdrop-blur-sm">
              <div className="flex shrink-0 gap-1" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-red-500/80"/>
                <span className="h-2 w-2 rounded-full bg-yellow-500/80"/>
                <span className="h-2 w-2 rounded-full bg-green-500/80"/>
              </div>
              <div className="mx-auto flex min-w-0 items-center gap-1 rounded bg-white/[0.06] px-2 py-0.5 text-[9px] text-[#6B6B80]">
                gotovo.studio / generator
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-violet-400">
                <span className="h-1 w-1 animate-pulse rounded-full bg-violet-400" aria-hidden="true"/>
                Live
              </div>
            </div>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover object-top"
              style={{ paddingTop: "30px" }}
              aria-label={`AI-генерация дизайна — ${c.label}`}
            >
              <source src={c.video} type="video/mp4"/>
            </video>
          </>
        ) : c.image ? (
          <Image
            src={c.image}
            alt={`Пример дизайна — ${c.label}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 370px"
            priority={priority}
          />
        ) : (
          <CardFallback gradient={c.fallbackGradient} label={c.label}/>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="w-full p-4">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
              Попробовать похожий <IconArrowRight/>
            </span>
          </div>
        </div>

        {/* Стиль тег — скрываем когда видео (браузерная строка уже есть) */}
        {!c.video && (
          <div className="absolute right-3 top-3">
            <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${c.accent.badge}`}>
              {c.styleTag}
            </span>
          </div>
        )}

        {/* 30 сек бейдж для видео */}
        {c.video && (
          <div className="absolute right-3 top-8 z-10">
            <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-400 backdrop-blur-sm">
              <IconPlay/> 30 сек
            </span>
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${c.accent.dot}`} aria-hidden="true"/>
            <p className="truncate font-semibold leading-tight text-white">{c.label}</p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[#6B6B80]">
            {c.category}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6B6B80]">{c.prompt}</p>
      </div>
    </Link>
  )
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function GeneratorExamplesFilter({ cases, categories }: Props) {
  const [active, setActive] = useState<string>(ALL_LABEL)
  const handleSelect = useCallback((cat: string) => setActive(cat), [])

  const videoCase = useMemo(() => cases.find((c) => !!c.featured), [cases])
  const regularCases = useMemo(() => cases.filter((c) => !c.featured), [cases])

  const filteredRegular = useMemo(
    () => (active === ALL_LABEL ? regularCases : regularCases.filter((c) => c.category === active)),
    [active, regularCases]
  )

  const showVideo = active === ALL_LABEL || active === "Демо"

  const allCategories = useMemo(() => [ALL_LABEL, ...categories], [categories])

  return (
    <div className="mt-10">
      {/* ── Фильтры ── */}
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Фильтр по категориям">
        {allCategories.map((cat) => {
          const isActive = active === cat
          return (
            <button
              key={cat}
              onClick={() => handleSelect(cat)}
              aria-pressed={isActive}
              className={`min-h-[44px] cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition duration-200
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500
                ${isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "border border-white/10 bg-white/5 text-[#A1A1B5] hover:border-white/20 hover:bg-white/10 hover:text-white"
                }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* ── Мобилка: snap-scroll ── */}
      <div className="-mx-4 mt-8 sm:hidden">
        <div
          className="overflow-x-auto px-4 pb-4"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          <ul className="flex gap-4" role="list" aria-label="Примеры дизайнов">
            {showVideo && videoCase && (
              <li className="w-[82vw] max-w-[300px] shrink-0" style={{ scrollSnapAlign: "start" }}>
                <VideoFeaturedCard c={videoCase}/>
              </li>
            )}
            {filteredRegular.map((c, i) => (
              <li key={c.id} className="w-[82vw] max-w-[300px] shrink-0" style={{ scrollSnapAlign: "start" }}>
                <CaseCard c={c} priority={i === 0}/>
              </li>
            ))}
            <li className="w-4 shrink-0" aria-hidden="true"/>
          </ul>
        </div>
        <p className="mt-2 text-center text-xs text-[#6B6B80]">Листайте →</p>
      </div>

      {/* ── Десктоп: 3-колоночный grid, видео row-span-2 ── */}
      <ul
        className="mt-8 hidden gap-4 sm:grid sm:grid-cols-3"
        role="list"
        aria-label="Примеры дизайнов"
        style={{ gridAutoRows: "minmax(200px, auto)" }}
      >
        {/* Видео-карточка — всегда первая, row-span-2 */}
        {showVideo && videoCase && (
          <li className="reveal-up delay-1 row-span-2">
            <VideoFeaturedCard c={videoCase}/>
          </li>
        )}

        {/* Остальные карточки */}
        {filteredRegular.map((c, i) => (
          <li
            key={c.id}
            className={`reveal-up ${i === 0 ? "delay-2" : i === 1 ? "delay-3" : i === 2 ? "delay-4" : ""}`}
          >
            <CaseCard c={c} priority={i <= 1}/>
          </li>
        ))}
      </ul>

      {/* ── CTA ── */}
      <div className="mt-10 text-center">
        <Link
          href="/generator"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
        >
          <span aria-hidden="true">✦</span> Попробовать бесплатно
        </Link>
        <p className="mt-3 text-sm text-[#6B6B80]">Бесплатно · Без регистрации · 30 секунд</p>
      </div>
    </div>
  )
}
