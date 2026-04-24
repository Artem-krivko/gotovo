"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GeneratorCase } from "@/content/generator-cases";

const ALL_LABEL = "Все";

interface Props {
  cases: GeneratorCase[];
  categories: string[];
}

export function GeneratorExamplesFilter({ cases, categories }: Props) {
  const [active, setActive] = useState<string>(ALL_LABEL);

  const handleSelect = useCallback((cat: string) => setActive(cat), []);

  const filtered = active === ALL_LABEL
    ? cases
    : cases.filter((c) => c.category === active);

  return (
    <>
      {/* Фильтры */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {[ALL_LABEL, ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active === cat
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "border border-white/10 bg-white/5 text-[#A1A1B5] hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Мобилка: snap-scroll */}
      <div className="-mx-4 mt-8 sm:hidden">
        <div className="niches-scroll overflow-x-auto px-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
          <div className="flex gap-4">
            {filtered.map((c) => (
            <div
              key={c.id}
              className="w-[78vw] max-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={`Пример дизайна — ${c.label}`}
                    fill
                    className="object-cover object-top"
                    sizes="280px"
                  />
                ) : (
                  <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${c.colorClasses}`}>
                    <span className="text-4xl" aria-hidden="true">🎨</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="inline-block rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium text-[#6B6B80]">
                  {c.category}
                </span>
                <p className="mt-1.5 font-semibold text-white">{c.label}</p>
                <p className="mt-1 line-clamp-2 text-xs text-[#6B6B80]">{c.prompt}</p>
              </div>
            </div>
          ))}
          <div className="w-4 shrink-0" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Десктоп: grid */}
      <div className="mt-8 hidden gap-5 sm:grid sm:grid-cols-3">
        {filtered.map((c, i) => {
          const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : "delay-3";
          return (
            <div
              key={c.id}
              className={`group overflow-hidden rounded-2xl border border-white/10 bg-[#13131A] transition hover:border-violet-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 ${delay}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={`Пример дизайна — ${c.label}`}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1200px) 33vw, 380px"
                  />
                ) : (
                  <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${c.colorClasses}`}>
                    <span className="text-5xl" aria-hidden="true">🎨</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="inline-block rounded-full border border-white/10 px-2.5 py-0.5 text-xs font-medium text-[#6B6B80]">
                  {c.category}
                </span>
                <p className="mt-2 font-semibold text-white">{c.label}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[#6B6B80]">{c.prompt}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/generator"
          className="btn-shimmer inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5"
        >
          <span aria-hidden="true">✦</span> Попробовать бесплатно
        </Link>
        <p className="mt-3 text-sm text-[#6B6B80]">Бесплатно · Без регистрации · 30 секунд</p>
      </div>
    </>
  );
}
