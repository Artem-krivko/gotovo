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

// ─── Иконки принципов ───────────────────────────────────────────────────────────

function PrincipleIconEye() {
  return (
    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M2 11s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="white" fillOpacity="0.08"/>
        <circle cx="11" cy="11" r="3" fill="white"/>
        <circle cx="11" cy="11" r="1.2" fill="white" fillOpacity="0.35"/>
      </svg>
    </div>
  );
}

function PrincipleIconAI() {
  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/25">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="2.5" fill="white"/>
        <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M4.22 4.22l1.41 1.41M12.37 12.37l1.41 1.41M4.22 13.78l1.41-1.41M12.37 5.63l1.41-1.41" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.55"/>
      </svg>
    </div>
  );
}

function PrincipleIconStructure() {
  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-500/25">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="6" height="4" rx="1.2" fill="white" fillOpacity="0.9"/>
        <rect x="10" y="2" width="6" height="4" rx="1.2" fill="white" fillOpacity="0.45"/>
        <rect x="2" y="9" width="14" height="2.5" rx="1.2" fill="white" fillOpacity="0.6"/>
        <rect x="2" y="14" width="9" height="2" rx="1" fill="white" fillOpacity="0.35"/>
      </svg>
    </div>
  );
}

function PrincipleIconRocket() {
  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/25">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2c0 0 4 1.8 4 6.5 0 2.5-1.2 4.2-4 5.5-2.8-1.3-4-3-4-5.5C5 3.8 9 2 9 2z" fill="white" fillOpacity="0.9"/>
        <circle cx="9" cy="7.5" r="1.5" fill="white" fillOpacity="0.35"/>
        <path d="M6.5 12l-1.5 3M11.5 12l1.5 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.55"/>
        <path d="M7 15.5h4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4"/>
      </svg>
    </div>
  );
}

const PRINCIPLE_ICONS = [
  <PrincipleIconEye key="eye" />,
  <PrincipleIconAI key="ai" />,
  <PrincipleIconStructure key="structure" />,
  <PrincipleIconRocket key="rocket" />,
];

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
              { value: "30 сек", label: "до первого превью", border: "border-violet-500/40", glow: "shadow-lg shadow-violet-500/20" },
              { value: "AI + Human", label: "скорость + качество", border: "border-blue-500/40", glow: "shadow-lg shadow-blue-500/20" },
              { value: "Под ключ", label: "от дизайна до запуска", border: "border-emerald-500/40", glow: "shadow-lg shadow-emerald-500/20" },
            ].map((m) => (
              <div key={m.label} className={`rounded-2xl border ${m.border} bg-[#13131A] p-4 text-center shadow-lg ${m.glow}`}>
                <p className="text-base font-bold text-white sm:text-lg">{m.value}</p>
                <p className="mt-1 text-xs leading-4 text-[#6B6B80]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Разделитель ──────────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>

      {/* ── Принципы ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        {/* Ambient glow: фиолетовый слева-сверху */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.13), transparent 65%)", filter: "blur(60px)" }} />
        {/* Ambient glow: синий справа */}
        <div className="pointer-events-none absolute top-1/2 -right-40 h-[400px] w-[400px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08), transparent 65%)", filter: "blur(70px)" }} />
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
              {PRINCIPLES.map((p, i) => (
                <li key={p.title}
                  className="flex w-[82vw] max-w-[300px] shrink-0 flex-col rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-5"
                  style={{ scrollSnapAlign: "start" }}>
                  <div className="mb-3">{PRINCIPLE_ICONS[i]}</div>
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#A1A1B5]">{p.description}</p>
                </li>
              ))}
              <li className="w-4 shrink-0" aria-hidden="true" />
            </ul>
            </div>
          </div>

          {/* Десктоп: асимметричный layout — hero слева + три карточки справа */}
          <div className="mt-12 hidden sm:grid sm:grid-cols-[1fr_380px] lg:grid-cols-[1fr_420px] gap-5 items-stretch">

            {/* Hero-принцип — первый, на всю высоту */}
            <div className="reveal-up delay-1 relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 p-8 lg:p-10 flex flex-col">
              {/* Glow */}
              <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)", filter: "blur(40px)" }}
                aria-hidden="true" />
              {/* Декоративный номер */}
              <span className="pointer-events-none absolute right-6 bottom-4 select-none text-[120px] font-black leading-none text-white/[0.03]" aria-hidden="true">01</span>

              <div className="relative">
                {PRINCIPLE_ICONS[0]}
                <h3 className="mt-6 text-2xl font-bold leading-[1.2] tracking-tight text-white lg:text-3xl">
                  {PRINCIPLES[0].title}
                </h3>
                <p className="mt-4 flex-1 text-base leading-7 text-[#A1A1B5]">
                  {PRINCIPLES[0].description}
                </p>
                {/* Accent pill */}
                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" aria-hidden="true" />
                  <span className="text-xs font-semibold text-violet-300">Ключевой принцип</span>
                </div>
              </div>
            </div>

            {/* Три карточки справа */}
            <div className="flex flex-col gap-5">
              {PRINCIPLES.slice(1).map((p, i) => (
                <div key={p.title}
                  className={`reveal-up flex flex-col rounded-2xl border border-white/10 bg-[#13131A] p-5 transition hover:border-violet-500/20 hover:bg-[#1C1C28] ${
                    i === 0 ? "delay-2" : i === 1 ? "delay-3" : "delay-4"
                  }`}>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">{PRINCIPLE_ICONS[i + 1]}</div>
                    <div>
                      <h3 className="font-semibold leading-snug text-white">{p.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#6B6B80]">{p.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Разделитель ──────────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
      </div>

      {/* ── Как выглядит работа ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        {/* Ambient glow: синий по центру снизу */}
        <div className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 h-[350px] w-[600px]" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.1), transparent 65%)", filter: "blur(60px)" }} />
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

      {/* ── Разделитель ──────────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/15 to-transparent" />
      </div>

      {/* ── Сравнение ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        {/* Ambient glow: fuchsia справа-сверху */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-[400px] w-[400px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(217,70,239,0.09), transparent 65%)", filter: "blur(70px)" }} />
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

      {/* ── Разделитель ──────────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
      </div>

      {/* ── Для кого ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        {/* Ambient glow: emerald слева по центру */}
        <div className="pointer-events-none absolute top-1/3 -left-32 h-[400px] w-[400px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08), transparent 65%)", filter: "blur(70px)" }} />
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

      {/* ── Разделитель ──────────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />
      </div>

      {/* ── Навигация ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-10 sm:px-6">
        {/* Ambient glow: violet по центру */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[200px]" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,58,237,0.07), transparent)" }} />
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
