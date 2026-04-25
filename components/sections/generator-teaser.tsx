import Link from "next/link";
import { GENERATOR_CASES, type GeneratorCase } from "@/content/generator-cases";

// ─── Под-компоненты ───────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"
        fill="currentColor"
        opacity=".3"
      />
      <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" />
    </svg>
  );
}

function CasePreviewSkeleton({ dotClass }: { dotClass: string }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-3 p-4"
      aria-label="Превью появится после тестирования генератора"
    >
      <div className={`h-10 w-10 rounded-full ${dotClass} opacity-20`} aria-hidden="true" />
      <div className="w-full space-y-2 px-4" aria-hidden="true">
        <div className="mx-auto h-2 w-3/4 rounded bg-white/10" />
        <div className="mx-auto h-2 w-1/2 rounded bg-white/10" />
        <div className="mx-auto h-2 w-2/3 rounded bg-white/10" />
      </div>
      <p className="text-xs text-[#6B6B80]">Скоро появится превью</p>
    </div>
  );
}

function CaseCard({ c }: { c: GeneratorCase }) {
  return (
    <article
      className={`group shrink-0 overflow-hidden rounded-2xl border bg-[#13131A] p-5 transition hover:-translate-y-1 hover:shadow-xl
        ${c.accent.border}
        /* мобилка: фиксированная ширина для snap-scroll */
        w-[80vw] max-w-[320px]
        /* десктоп: авто */
        sm:w-auto sm:max-w-none`}
    >
      {/* Превью */}
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0F]">
        {c.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.image}
            alt={`Превью сайта — ${c.label}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <CasePreviewSkeleton dotClass={c.accent.dot} />
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{c.label}</h3>
        <span className={`h-2 w-2 rounded-full ${c.accent.dot}`} aria-hidden="true" />
      </div>

      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#6B6B80]">
        {c.prompt}
      </p>
    </article>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function GeneratorTeaser() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-28"
      aria-labelledby="generator-teaser-heading"
    >
      <div className="mx-auto max-w-6xl">

        {/* Заголовок */}
        <div className="reveal-up mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-700">
            AI Design Generator
          </span>

          <h2
            id="generator-teaser-heading"
            className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl"
          >
            Сначала увидите —
            <span className="block text-zinc-400">потом решите</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-600">
            Опишите свой бизнес — ИИ создаст дизайн за 30 секунд.
            Понравится — оформим заявку на разработку.
          </p>
        </div>

        {/* Карточки — мобилка: snap-scroll, десктоп: grid */}
        <div className="reveal-up delay-1 mt-10">

          {/* Мобилка */}
          <div className="-mx-4 overflow-x-auto px-4 sm:hidden">
            <div
              className="flex gap-4 pb-3"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {GENERATOR_CASES.map((c) => (
                <div key={c.id} style={{ scrollSnapAlign: "start" }}>
                  <CaseCard c={c} />
                </div>
              ))}
              {/* Невидимый элемент для правого отступа */}
              <div className="w-4 shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Десктоп */}
          <div className="hidden gap-5 sm:grid sm:grid-cols-3">
            {GENERATOR_CASES.map((c) => (
              <CaseCard key={c.id} c={c} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal-up delay-2 mt-8 flex flex-col items-center gap-3">
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
          >
            <PlayIcon />
            Попробовать генератор
          </Link>
          <p className="text-sm text-zinc-400">Бесплатно · Без регистрации · 30 секунд</p>
        </div>

      </div>
    </section>
  );
}
