"use client"

import { useEffect } from "react"
import Image from "next/image"
import { GENERATOR_CASES, type GeneratorCase } from "@/content/generator-cases"
import type { GeneratorStyle } from "@/lib/types"
import { track } from "@/lib/analytics"

export interface GalleryPreset {
  businessType: string
  style: GeneratorStyle
  description: string
  label: string
  styleTag: string
}

const CASE_PRESETS: Record<number, GalleryPreset> = {
  1: { businessType: "Медицинская клиника", style: "minimal", description: "Современная стоматологическая клиника. Акцент на доверие, технологии и заботу о пациентах. Услуги: лечение, имплантация, отбеливание.", label: "Стоматология", styleTag: "Чистый · Доверие" },
  2: { businessType: "Салон красоты", style: "bold", description: "Авторский тату-салон с тёмной эстетикой. Портфолио мастеров, стили татуировок, онлайн-запись.", label: "Тату-салон", styleTag: "Тёмный · Характер" },
  3: { businessType: "Фитнес-клуб", style: "bold", description: "Премиум фитнес-клуб. Акцент на энергию и результат. Абонементы, расписание групповых, тренеры.", label: "Фитнес-клуб", styleTag: "Энергия · Премиум" },
  4: { businessType: "Кофейня / кафе", style: "modern", description: "Уютная кофейня со specialty кофе и авторскими десертами. Тёплая атмосфера, меню, адрес и часы работы.", label: "Кофейня", styleTag: "Тёплый · Уютный" },
  5: { businessType: "Юридические услуги", style: "corporate", description: "Юридическая компания для бизнеса. Строгий авторитетный стиль. Услуги, команда, подтверждённые кейсы, контакты.", label: "Юридическая компания", styleTag: "Авторитет · B2B" },
  6: { businessType: "IT-агентство", style: "minimal", description: "IT-стартап с SaaS-продуктом. Минималистичный технологичный стиль. Функции, тарифы, форма регистрации.", label: "IT-стартап", styleTag: "Минимализм · SaaS" },
}

function GalleryCard({ c, onSelect }: { c: GeneratorCase; onSelect: (preset: GalleryPreset | null) => void }) {
  return (
    <button type="button" onClick={() => onSelect(CASE_PRESETS[c.id] ?? null)} className="group w-full border border-ink/25 bg-paper text-left transition hover:-translate-y-1 hover:bg-acid focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-cobalt">
      <div className="relative h-48 overflow-hidden bg-ink/10 sm:h-56">
        {c.video ? <video src={c.video} autoPlay muted loop playsInline className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : c.image ? <Image src={c.image} alt={c.label} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 82vw, 33vw" /> : <div className={`h-full w-full bg-gradient-to-br ${c.fallbackGradient}`} />}
        <span className="absolute left-3 top-3 bg-paper px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">{c.category}</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4"><div><p className="text-lg font-semibold tracking-[-0.03em]">{c.label}</p><p className="mt-1 text-xs text-ink/48">{c.styleTag}</p></div><span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></div>
        <p className="mt-5 border-t border-ink/20 pt-4 text-xs font-semibold uppercase tracking-[0.12em]">Взять как отправную точку</p>
      </div>
    </button>
  )
}

export function GeneratorGallery({ onSelect }: { onSelect: (preset: GalleryPreset | null) => void }) {
  useEffect(() => { track("generator_gallery_view") }, [])
  return (
    <div className="min-h-[calc(100vh-64px)] bg-paper px-4 py-12 text-ink sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 border-b border-ink/20 pb-9 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8"><p className="section-index text-ink/50">AI-концепт-лаборатория</p><h1 className="mt-7 text-[clamp(3.2rem,6vw,6rem)] font-semibold leading-[0.9] tracking-[-0.065em]">Выберите характер.<br /><span className="editorial-serif font-normal italic text-signal">Не шаблон.</span></h1></div>
          <div className="lg:col-span-4 lg:border-l lg:border-ink/20 lg:pl-7"><p className="text-lg leading-7 text-ink/68">Примеры ниже — демонстрационные направления. Выберите близкое или начните с чистого листа: AI соберёт три возможные концепции для вашего бизнеса.</p><p className="mt-4 text-xs leading-5 text-ink/45">Это не финальный сайт и не клиентское портфолио.</p></div>
        </div>
        <div className="-mx-4 mt-10 overflow-x-auto px-4 md:hidden"><div className="flex gap-4 pb-4" style={{ scrollSnapType: "x mandatory" }}>{GENERATOR_CASES.map((c)=><div key={c.id} className="w-[82vw] max-w-[330px] shrink-0" style={{scrollSnapAlign:"start"}}><GalleryCard c={c} onSelect={onSelect}/></div>)}</div></div>
        <div className="mt-10 hidden grid-cols-2 gap-5 md:grid lg:grid-cols-3">{GENERATOR_CASES.map((c)=><GalleryCard key={c.id} c={c} onSelect={onSelect}/>)}</div>
        <div className="mt-12 flex flex-col gap-5 border-t border-ink/20 pt-7 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Ни одно направление не подходит?</p><p className="mt-1 text-sm text-ink/52">Опишите бизнес своими словами — генератор начнёт с контекста.</p></div><button type="button" onClick={() => onSelect(null)} className="editorial-button editorial-button--dark">Начать с чистого листа <span aria-hidden="true">→</span></button></div>
      </div>
    </div>
  )
}
