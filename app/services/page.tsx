import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { SERVICE_FORMATS, AUDIENCE_ITEMS, OUTCOME_ITEMS, SERVICES_FAQ } from "@/content/services";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "Услуги — разработка сайтов для бизнеса | gotovo",
  description: "Лендинги от €500, бизнес-сайты от €800. AI-генератор покажет дизайн до оплаты за 30 секунд. Кастомная разработка без шаблонов.",
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: { url: `${SITE_URL}/services`, images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
};

// ─── Иконки ───────────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLanding() {
  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="16" height="11" rx="2" stroke="white" strokeWidth="1.4" fill="white" fillOpacity="0.08"/>
        <path d="M2 10h16" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
        <circle cx="5" cy="6.5" r="1" fill="white" fillOpacity="0.5"/>
        <circle cx="8" cy="6.5" r="1" fill="white" fillOpacity="0.5"/>
        <path d="M7 17h6M10 14v3" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function IconBusiness() {
  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="7" width="14" height="10" rx="1.5" stroke="white" strokeWidth="1.4" fill="white" fillOpacity="0.08"/>
        <path d="M7 7V5a3 3 0 0 1 6 0v2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M3 11h14" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
        <rect x="8.5" y="9.5" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.6"/>
      </svg>
    </div>
  );
}

function IconSeo() {
  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/30">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="5.5" stroke="white" strokeWidth="1.4" fill="white" fillOpacity="0.08"/>
        <path d="M13 13l3.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M7 9h4M9 7v4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.7"/>
      </svg>
    </div>
  );
}

const FORMAT_ICON_COMPONENTS = [<IconLanding key="landing" />, <IconBusiness key="business" />, <IconSeo key="seo" />];

// ─── Страница ─────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <main>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-12 sm:px-6 sm:pb-28 sm:pt-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 70% 50% at 30% -5%, rgba(124,58,237,0.22), transparent 60%)" }} />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
              Услуги gotovo
            </span>

            <h1 className="reveal-up delay-1 mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Сайты которые{" "}
              <span className="gradient-reveal">
                работают на бизнес
              </span>
            </h1>

            <p className="reveal-up delay-2 mt-6 max-w-xl text-lg leading-7 text-[#A1A1B5]">
              Лендинги, бизнес-сайты и SEO-запуск — без шаблонов и хаоса.
              Сначала покажем дизайн через генератор, потом сделаем.
            </p>

            <div className="reveal-up delay-3 mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
                <span aria-hidden="true">✦</span> Попробовать генератор
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
                Смотреть цены
              </Link>
            </div>

            {/* Метрики */}
            <div className="reveal-up delay-4 mt-12 grid w-full max-w-lg grid-cols-3 gap-3">
              {[
                { value: "3 формата", label: "под любую задачу", border: "border-violet-500/40", glow: "shadow-lg shadow-violet-500/20" },
                { value: "7–14 дней", label: "типичный срок", border: "border-blue-500/40", glow: "shadow-lg shadow-blue-500/20" },
                { value: "Превью бесплатно", label: "через генератор", border: "border-emerald-500/40", glow: "shadow-lg shadow-emerald-500/20" },
              ].map((m) => (
                <div key={m.label} className={`rounded-2xl border ${m.border} bg-[#13131A] p-4 text-center shadow-lg ${m.glow}`}>
                  <p className="text-base font-bold text-white sm:text-lg">{m.value}</p>
                  <p className="mt-1 text-xs leading-4 text-[#6B6B80]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Форматы работы ──────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute -top-20 -left-20 h-[400px] w-[400px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.11), transparent 65%)", filter: "blur(60px)" }} />
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Форматы</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Выберите под свою задачу
            </h2>
            <p className="mt-3 text-[#A1A1B5]">Быстрый запуск, системный сайт или подготовка к росту</p>
          </div>

          {/* Мобилка: snap-scroll */}
          <div className="-mx-4 mt-10 sm:hidden">
            <div className="niches-scroll overflow-x-auto px-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
            <div className="flex gap-4">
              {SERVICE_FORMATS.map((format, i) => (
                <div key={format.title}
                  className="flex w-[80vw] max-w-[300px] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#13131A] p-6"
                  style={{ scrollSnapAlign: "start" }}>
                  <span className="text-3xl" aria-hidden="true">{FORMAT_ICON_COMPONENTS[i % FORMAT_ICON_COMPONENTS.length]}</span>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{format.price}</span>
                    <span className="text-sm text-[#6B6B80]">{format.duration}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{format.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#A1A1B5]">{format.description}</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {format.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-[#6B6B80]">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="w-4 shrink-0" aria-hidden="true" />
            </div>
            </div>
          </div>

          {/* Десктоп: grid */}
          <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-3">
            {SERVICE_FORMATS.map((format, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : "delay-3";
              const isFeatured = i === 1;
              return (
                <div key={format.title}
                  className={`reveal-up flex flex-col rounded-2xl border p-7 transition hover:-translate-y-1 ${delay} ${
                    isFeatured
                      ? "border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-blue-500/5"
                      : "border-white/10 bg-[#13131A] hover:border-white/20 hover:bg-[#1C1C28]"
                  }`}>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl" aria-hidden="true">{FORMAT_ICON_COMPONENTS[i]}</span>
                    {isFeatured && (
                      <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
                        Популярный
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{format.price}</span>
                    <span className="text-sm text-[#6B6B80]">{format.duration}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-white">{format.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#A1A1B5]">{format.description}</p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {format.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm text-[#A1A1B5]">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isFeatured ? "bg-violet-400" : "bg-[#6B6B80]"}`} aria-hidden="true" />{b}
                      </li>
                    ))}
                  </ul>
                  <Link href="/generator"
                    className={`mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                      isFeatured
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}>
                    Попробовать <ArrowRight />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Для кого ────────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Аудитория</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Кому подходит
            </h2>
          </div>

          {/* Мобилка */}
          <div className="-mx-4 mt-10 sm:hidden">
            <div className="niches-scroll overflow-x-auto px-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
            <div className="flex gap-4">
              {AUDIENCE_ITEMS.map((item) => (
                <div key={item.title}
                  className="flex w-[80vw] max-w-[280px] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#13131A] p-5"
                  style={{ scrollSnapAlign: "start" }}>
                  <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#6B6B80]">
                    {item.badge}
                  </span>
                  <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#A1A1B5]">{item.description}</p>
                </div>
              ))}
              <div className="w-4 shrink-0" aria-hidden="true" />
            </div>
            </div>
          </div>

          {/* Десктоп */}
          <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-2">
            {AUDIENCE_ITEMS.map((item, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4";
              return (
                <div key={item.title}
                  className={`reveal-up rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-white/20 sm:p-7 ${delay}`}>
                  <span className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                    {item.badge}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#A1A1B5]">{item.description}</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {item.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-[#6B6B80]">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Что входит в результат ──────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/15 to-transparent" />
      </div>
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-[300px] w-[600px]" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse, rgba(217,70,239,0.07), transparent 65%)", filter: "blur(60px)" }} />
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Результат</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Что вы получаете
            </h2>
            <p className="mt-3 text-[#A1A1B5]">
              Не набор экранов — рабочая система с логикой, адаптивом и подготовкой к запуску
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {OUTCOME_ITEMS.map((item, i) => {
              const delay = i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3";
              return (
                <li key={item.title}
                  className={`reveal-up flex gap-4 rounded-2xl border border-white/10 bg-[#13131A] p-5 transition hover:border-white/20 ${delay}`}>
                  <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white ${item.accent}`} aria-hidden="true">
                    <CheckIcon />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#6B6B80]">{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Сравнение ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Сравнение</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Кастом vs конструктор
            </h2>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            {/* Шапка */}
            <div className="grid grid-cols-[88px_1fr_1fr] border-b border-white/10 bg-[#13131A] sm:grid-cols-[1fr_1fr_1fr]">
              <div className="px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#6B6B80] sm:px-6 sm:text-xs">Параметр</div>
              <div className="border-l border-white/10 px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#6B6B80] sm:px-6 sm:text-xs">Конструктор</div>
              <div className="border-l border-violet-500/20 bg-violet-500/5 px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-violet-400 sm:px-6 sm:text-xs">gotovo</div>
            </div>
            {[
              { label: "Дизайн", bad: "Ограничен шаблоном", good: "Под вашу задачу" },
              { label: "Структура", bad: "Фиксированная", good: "Под сценарий продаж" },
              { label: "Скорость", bad: "Зависит от платформы", good: "Оптимизирована" },
              { label: "SEO", bad: "Частичный контроль", good: "Полный контроль" },
              { label: "Масштаб", bad: "Сложнее расширять", good: "Легко добавлять" },
            ].map((row, i) => (
              <div key={row.label}
                className={`grid grid-cols-[88px_1fr_1fr] border-b border-white/[0.06] last:border-0 sm:grid-cols-[1fr_1fr_1fr] ${i % 2 === 0 ? "bg-[#0A0A0F]" : "bg-[#0D0D14]"}`}>
                <div className="px-3 py-4 text-xs font-semibold text-white sm:px-6 sm:text-sm sm:font-medium">{row.label}</div>
                <div className="border-l border-white/[0.06] px-3 py-4 text-xs leading-5 text-[#6B6B80] sm:px-6 sm:text-sm">{row.bad}</div>
                <div className="border-l border-violet-500/10 bg-violet-500/[0.03] px-3 py-4 text-xs font-medium leading-5 text-violet-300 sm:px-6 sm:text-sm">{row.good}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faq title="Вопросы по услугам" subtitle="Отвечаем до старта — без обязательств" items={SERVICES_FAQ} />

      <Cta
        title="Покажем дизайн вашего сайта"
        subtitle="Попробуйте генератор — это бесплатно и займёт 30 секунд. Нравится — обсудим разработку."
        button="Сгенерировать дизайн"
      />
    </main>
  );
}
