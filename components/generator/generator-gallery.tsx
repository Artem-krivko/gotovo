"use client"

import Image from "next/image"
import { GENERATOR_CASES, type GeneratorCase } from "@/content/generator-cases"
import type { GeneratorStyle } from "@/lib/types"

export interface GalleryPreset {
  businessType: string
  style: GeneratorStyle
  description: string
}

const CASE_PRESETS: Record<number, GalleryPreset> = {
  1: { businessType: "Медицинская клиника", style: "minimal",   description: "Современная стоматологическая клиника. Акцент на доверие, технологии и заботу о пациентах. Услуги: лечение, имплантация, отбеливание." },
  2: { businessType: "Салон красоты",       style: "bold",      description: "Авторский тату-салон с тёмной эстетикой. Портфолио мастеров, стили татуировок, онлайн-запись." },
  3: { businessType: "Фитнес-клуб",         style: "bold",      description: "Премиум фитнес-клуб. Акцент на энергию и результат. Абонементы, расписание групповых, тренеры." },
  4: { businessType: "Кофейня / кафе",      style: "modern",    description: "Уютная кофейня со specialty кофе и авторскими десертами. Тёплая атмосфера, меню, адрес и часы работы." },
  5: { businessType: "Юридические услуги",  style: "corporate", description: "Юридическая компания для бизнеса. Строгий авторитетный стиль. Услуги, команда адвокатов, кейсы, контакты." },
  6: { businessType: "IT-агентство",        style: "minimal",   description: "IT стартап с SaaS продуктом. Минималистичный технологичный стиль. Функции, тарифы, форма регистрации." },
}

interface GalleryCardProps {
  c: GeneratorCase
  onSelect: (preset: GalleryPreset | null) => void
}

function GalleryCard({ c, onSelect }: GalleryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(CASE_PRESETS[c.id] ?? null)}
      className={`group relative w-full overflow-hidden rounded-2xl border bg-[#13131A] text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${c.accent.border} ${c.accent.glow}`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#1C1C28]">
        {c.video ? (
          <video
            src={c.video}
            autoPlay muted loop playsInline
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : c.image ? (
          <Image
            src={c.image}
            alt={c.label}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 78vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${c.fallbackGradient}`} />
        )}
        <span className={`absolute left-3 top-3 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${c.accent.badge}`}>
          {c.category}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-white">{c.label}</p>
            <p className="mt-0.5 text-xs text-[#6B6B80]">{c.styleTag}</p>
          </div>
          <span className={`h-2 w-2 shrink-0 rounded-full ${c.accent.dot}`} />
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#A1A1B5] transition-colors group-hover:text-white">
          Сгенерировать похожий
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </button>
  )
}

interface GeneratorGalleryProps {
  onSelect: (preset: GalleryPreset | null) => void
}

export function GeneratorGallery({ onSelect }: GeneratorGalleryProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0A0A0F] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
            ✦ Реальные примеры
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Посмотрите что умеет ИИ
          </h1>
          <p className="mt-3 text-[#A1A1B5]">
            Все превью сгенерированы тем же ИИ — нажмите на любой чтобы создать похожий
          </p>
        </div>

        {/* Mobile: horizontal snap scroll */}
        <div className="-mx-4 overflow-x-auto px-4 md:hidden">
          <div className="flex gap-4 pb-4" style={{ scrollSnapType: "x mandatory" }}>
            {GENERATOR_CASES.map((c) => (
              <div key={c.id} style={{ scrollSnapAlign: "start" }} className="w-[78vw] max-w-[300px] shrink-0">
                <GalleryCard c={c} onSelect={onSelect} />
              </div>
            ))}
            <div className="w-4 shrink-0" aria-hidden="true" />
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {GENERATOR_CASES.map((c) => (
            <GalleryCard key={c.id} c={c} onSelect={onSelect} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-[#6B6B80]">Не нашли свою нишу?</p>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:opacity-90"
          >
            ✦ Описать свой бизнес →
          </button>
          <p className="text-xs text-[#6B6B80]">Бесплатно · Без регистрации · ~30 секунд</p>
        </div>

      </div>
    </div>
  )
}
