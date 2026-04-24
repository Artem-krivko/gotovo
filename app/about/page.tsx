import type { Metadata } from "next";
import Link from "next/link";
import { Cta } from "@/components/sections/cta";
import { PRINCIPLES, COMPARISON_ROWS, FIT_ITEMS, SHORT_PROCESS } from "@/content/about";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "О студии gotovo — AI разработка сайтов с генератором дизайна",
  description: "gotovo — студия где вы видите дизайн до оплаты. AI ускоряет разработку, человек контролирует качество. Лендинги от €500 под ключ.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: { url: `${SITE_URL}/about`, images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
};

function CheckIcon({ fits }: { fits: boolean }) {
  return fits ? (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400" aria-hidden="true">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#6B6B80]" aria-hidden="true">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function AboutPage() {
  return (
    <main>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.2), transparent 60%)" }} />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            О студии
          </span>

          <h1 className="reveal-up delay-1 mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Делаем сайты которые{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              видите до оплаты
            </span>
          </h1>

          <p className="reveal-up delay-2 mt-6 mx-auto max-w-xl text-lg leading-7 text-[#A1A1B5]">
            AI Web Studio → gotovo. Генератор дизайна бесплатно за 30 секунд.
            AI ускоряет разработку, человек контролирует качество.
          </p>

          <div className="reveal-up delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/generator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
              <span aria-hidden="true">✦</span> Попробовать генератор
            </Link>
            <Link href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
              Смотреть услуги
            </Link>
          </div>

          {/* Метрики */}
          <div className="reveal-up delay-4 mt-12 grid max-w-lg mx-auto grid-cols-3 gap-3">
            {[
              { value: "30 сек", label: "до первого превью" },
              { value: "AI + Human", label: "скорость + качество" },
              { value: "Под ключ", label: "от дизайна до запуска" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-[#13131A] p-4 text-center">
                <p className="text-base font-bold text-white sm:text-lg">{m.value}</p>
                <p className="mt-1 text-xs leading-4 text-[#6B6B80]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Принципы ────────────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Принципы</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Как мы работаем и почему
            </h2>
            <p className="mt-3 text-[#A1A1B5]">Не слова — конкретные принципы в каждом проекте</p>
          </div>

          {/* Мобилка: snap-scroll */}
          <div className="-mx-4 mt-10 sm:hidden">
            <div className="niches-scroll overflow-x-auto px-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
            <ul className="flex gap-4">
              {PRINCIPLES.map((p) => (
                <li key={p.title}
                  className="flex w-[82vw] max-w-[300px] shrink-0 flex-col rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-5"
                  style={{ scrollSnapAlign: "start" }}>
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#A1A1B5]">{p.description}</p>
                </li>
              ))}
              <li className="w-4 shrink-0" aria-hidden="true" />
            </ul>
            </div>
          </div>

          {/* Десктоп: 2×2 */}
          <ul className="mt-10 hidden gap-5 sm:grid sm:grid-cols-2" role="list">
            {PRINCIPLES.map((p, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4";
              return (
                <li key={p.title}
                  className={`reveal-up rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-violet-500/20 sm:p-7 ${delay}`}>
                  <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#A1A1B5]">{p.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Как выглядит работа ─────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Процесс</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Как выглядит работа</h2>
            </div>
            <Link href="/process" className="shrink-0 text-sm text-violet-400 transition-colors hover:text-violet-300">
              Подробнее о процессе →
            </Link>
          </div>

          {/* Мобилка: snap-scroll */}
          <div className="-mx-4 mt-10 sm:hidden">
            <div className="niches-scroll overflow-x-auto px-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
            <ol className="flex gap-4">
              {SHORT_PROCESS.map((step) => (
                <li key={step.num}
                  className="flex w-[75vw] max-w-[260px] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#13131A] p-5"
                  style={{ scrollSnapAlign: "start" }}>
                  <span className="text-5xl font-black text-white/5 leading-none">{step.num}</span>
                  <h3 className="mt-2 text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#6B6B80]">{step.description}</p>
                </li>
              ))}
              <li className="w-4 shrink-0" aria-hidden="true" />
            </ol>
            </div>
          </div>

          {/* Десктоп: 4 колонки */}
          <ol className="mt-10 hidden gap-5 sm:grid sm:grid-cols-4">
            {SHORT_PROCESS.map((step, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4";
              return (
                <li key={step.num}
                  className={`reveal-up relative overflow-hidden rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-white/20 ${delay}`}>
                  <span className="absolute -right-2 -top-4 text-7xl font-black text-white/[0.04] select-none">{step.num}</span>
                  <h3 className="relative text-lg font-semibold text-white">{step.title}</h3>
                  <p className="relative mt-2 text-sm leading-6 text-[#6B6B80]">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Сравнение ───────────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Сравнение</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Чем мы отличаемся</h2>
            <p className="mt-3 text-[#A1A1B5]">Конкретно, без маркетинга</p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[88px_1fr_1fr] border-b border-white/10 bg-[#13131A] sm:grid-cols-[1fr_1fr_1fr]">
              <div className="px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#6B6B80] sm:px-6 sm:text-xs">Параметр</div>
              <div className="border-l border-white/10 px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#6B6B80] sm:px-6 sm:text-xs">Типично</div>
              <div className="border-l border-violet-500/20 bg-violet-500/5 px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-violet-400 sm:px-6 sm:text-xs">gotovo</div>
            </div>
            {COMPARISON_ROWS.map((row, i) => (
              <div key={row.label}
                className={`grid grid-cols-[88px_1fr_1fr] border-b border-white/[0.06] last:border-0 sm:grid-cols-[1fr_1fr_1fr] ${i % 2 === 0 ? "bg-[#0A0A0F]" : "bg-[#0D0D14]"}`}>
                <div className="px-3 py-4 text-xs font-semibold text-white sm:px-6 sm:text-sm sm:font-medium">{row.label}</div>
                <div className="border-l border-white/[0.06] px-3 py-4 text-xs leading-5 text-[#6B6B80] sm:px-6 sm:text-sm">{row.typical}</div>
                <div className="border-l border-violet-500/10 bg-violet-500/[0.03] px-3 py-4 text-xs font-medium leading-5 text-violet-300 sm:px-6 sm:text-sm">{row.ours}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Для кого ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Честно</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Кому подходим — и нет</h2>
            <p className="mt-3 text-[#A1A1B5]">Хороший проект начинается там, где совпадают ожидания</p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]">
            <ul role="list">
              {FIT_ITEMS.map((item, i) => (
                <li key={item.text}
                  className={`flex items-start gap-4 px-5 py-4 sm:px-6 ${i < FIT_ITEMS.length - 1 ? "border-b border-white/[0.06]" : ""}`}>
                  <CheckIcon fits={item.fits} />
                  <span className={`text-sm leading-6 ${item.fits ? "text-[#A1A1B5]" : "text-[#6B6B80]"}`}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Навигация ───────────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl grid gap-4 sm:grid-cols-3">
          {[
            { label: "Услуги", description: "Форматы разработки и для кого", href: "/services", color: "border-blue-500/20 hover:border-blue-500/40" },
            { label: "Процесс", description: "7 этапов от генератора до запуска", href: "/process", color: "border-violet-500/20 hover:border-violet-500/40" },
            { label: "Цены", description: "Три пакета с фиксированной стоимостью", href: "/pricing", color: "border-fuchsia-500/20 hover:border-fuchsia-500/40" },
          ].map((link) => (
            <Link key={link.label} href={link.href}
              className={`group flex flex-col rounded-2xl border bg-[#13131A] p-5 transition hover:bg-[#1C1C28] ${link.color}`}>
              <p className="font-semibold text-white">{link.label}</p>
              <p className="mt-1 text-sm text-[#6B6B80]">{link.description}</p>
              <p className="mt-3 text-sm text-violet-400 transition-transform group-hover:translate-x-1">Подробнее →</p>
            </Link>
          ))}
        </div>
      </section>

      <Cta
        title="Попробуйте генератор — бесплатно"
        subtitle="Опишите бизнес и увидите дизайн за 30 секунд. Понравится — обсудим разработку."
        button="Сгенерировать дизайн"
      />
    </main>
  );
}
