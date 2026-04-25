"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GeneratorCase } from "@/content/generator-cases";

// ─── Константы ────────────────────────────────────────────────────────────────

const ALL_LABEL = "Все";

// ─── Типы ─────────────────────────────────────────────────────────────────────

interface Props {
  cases: GeneratorCase[];
  categories: string[];
}

// ─── Иконка стрелки ───────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── SVG-заглушка для карточек без изображения ────────────────────────────────

function CardFallback({ gradient, label }: { gradient: string; label: string }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
      role="img"
      aria-label={`Превью дизайна — ${label}`}
    >
      {/* Имитация браузерного экрана */}
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
        <rect x="52" y="30" width="54" height="18" rx="2" fill="white" fillOpacity="0.06"/>
        <rect x="12" y="64" width="96" height="2" rx="1" fill="white" fillOpacity="0.05"/>
      </svg>
    </div>
  );
}

// ─── Карточка ─────────────────────────────────────────────────────────────────

function CaseCard({ c, priority }: { c: GeneratorCase; priority: boolean }) {
  return (
    <Link
      href={`/generator?category=${encodeURIComponent(c.category)}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#13131A] transition duration-300
        ${c.accent.border}
        hover:-translate-y-1 hover:shadow-xl ${c.accent.glow}
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500`}
    >
      {/* Превью */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {c.image ? (
          <Image
            src={c.image}
            alt={`Пример дизайна — ${c.label}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 370px"
            priority={priority}
          />
        ) : (
          <CardFallback gradient={c.fallbackGradient} label={c.label} />
        )}

        {/* Overlay при hover с CTA */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="w-full p-4">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
              Попробовать похожий <ArrowRight />
            </span>
          </div>
        </div>

        {/* Style tag — всегда виден */}
        <div className="absolute right-3 top-3">
          <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${c.accent.badge}`}>
            {c.styleTag}
          </span>
        </div>
      </div>

      {/* Контент */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${c.accent.dot}`} aria-hidden="true" />
            <p className="font-semibold leading-tight text-white">{c.label}</p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[#6B6B80]">
            {c.category}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6B6B80]">{c.prompt}</p>
      </div>
    </Link>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function GeneratorExamplesFilter({ cases, categories }: Props) {
  const [active, setActive] = useState<string>(ALL_LABEL);

  const handleSelect = useCallback((cat: string) => setActive(cat), []);

  const filtered = useMemo(
    () => (active === ALL_LABEL ? cases : cases.filter((c) => c.category === active)),
    [active, cases]
  );

  const allCategories = useMemo(() => [ALL_LABEL, ...categories], [categories]);

  return (
    <div className="mt-10">
      {/* ── Фильтры ── */}
      <div
        className="flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Фильтр по категориям"
      >
        {allCategories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => handleSelect(cat)}
              aria-pressed={isActive}
              className={`min-h-[36px] rounded-full px-4 py-1.5 text-sm font-medium transition duration-200 cursor-pointer
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500
                ${isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "border border-white/10 bg-white/5 text-[#A1A1B5] hover:bg-white/10 hover:text-white hover:border-white/20"
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Мобилка: snap-scroll (375–639px) ── */}
      <div className="-mx-4 mt-8 sm:hidden">
        <div
          className="overflow-x-auto px-4 pb-4"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          <ul
            className="flex gap-4"
            role="list"
            aria-label="Примеры дизайнов"
          >
            {filtered.map((c, i) => (
              <li
                key={c.id}
                className="w-[82vw] max-w-[300px] shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <CaseCard c={c} priority={i === 0} />
              </li>
            ))}
            {/* Правый отступ для последней карточки */}
            <li className="w-4 shrink-0" aria-hidden="true" />
          </ul>
        </div>
        {/* Скролл-хинт */}
        <p className="mt-2 text-center text-xs text-[#6B6B80]">Листайте →</p>
      </div>

      {/* ── Десктоп: асимметричный Masonry-grid (640px+) ── */}
      {/*
        Layout: 6 карточек в сетке 3 колонки.
        Первая карточка занимает 2 строки (featured) — создаёт tension.
        Остальные — стандартные.
      */}
      <ul
        className="mt-8 hidden gap-4 sm:grid sm:grid-cols-3"
        role="list"
        aria-label="Примеры дизайнов"
        style={{ gridAutoRows: "1fr" }}
      >
        {filtered.map((c, i) => {
          const isFeatured = i === 0 && filtered.length >= 3;
          return (
            <li
              key={c.id}
              className={`reveal-up ${i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : ""} ${isFeatured ? "sm:row-span-2" : ""}`}
            >
              {/* Featured карточка: вертикальный layout */}
              {isFeatured ? (
                <Link
                  href={`/generator?category=${encodeURIComponent(c.category)}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#13131A] transition duration-300
                    ${c.accent.border}
                    hover:-translate-y-1 hover:shadow-xl ${c.accent.glow}
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500`}
                >
                  {/* Превью — занимает больше места */}
                  <div className="relative flex-1 overflow-hidden" style={{ minHeight: "220px" }}>
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt={`Пример дизайна — ${c.label}`}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 1200px) 33vw, 370px"
                        priority
                      />
                    ) : (
                      <CardFallback gradient={c.fallbackGradient} label={c.label} />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="w-full p-5">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                          Попробовать похожий <ArrowRight />
                        </span>
                      </div>
                    </div>

                    {/* Теги */}
                    <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm ${c.accent.badge}`}>
                        {c.styleTag}
                      </span>
                      <span className="inline-flex items-center rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-400 backdrop-blur-sm">
                        Топ-пример
                      </span>
                    </div>
                  </div>

                  {/* Контент */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${c.accent.dot}`} aria-hidden="true" />
                        <p className="font-semibold text-white">{c.label}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[#6B6B80]">
                        {c.category}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#6B6B80]">{c.prompt}</p>
                  </div>
                </Link>
              ) : (
                <CaseCard c={c} priority={i <= 2} />
              )}
            </li>
          );
        })}
      </ul>

      {/* ── CTA ── */}
      <div className="mt-10 text-center">
        <Link
          href="/generator"
          className="btn-shimmer inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
        >
          <span aria-hidden="true">✦</span> Попробовать бесплатно
        </Link>
        <p className="mt-3 text-sm text-[#6B6B80]">Бесплатно · Без регистрации · 30 секунд</p>
      </div>
    </div>
  );
}
