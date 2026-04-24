import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Faq } from "@/components/sections/faq";
import { GeneratorExamplesFilter } from "@/components/sections/generator-examples-filter";
import { homeContent } from "@/content/pages/home";
import { GENERATOR_CASES } from "@/content/generator-cases";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "gotovo — опишите бизнес, получите сайт за 30 секунд",
  description:
    "AI-генератор дизайна сайтов. Опишите бизнес — ИИ создаёт превью за 30 секунд бесплатно. Лендинги от €500, бизнес-сайты от €800.",
  alternates: { canonical: SITE_URL },
  openGraph: { url: SITE_URL, images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
};

// ─── Иконки ───────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 2.5l8 4.5-8 4.5V2.5z" fill="currentColor" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2L4.5 13.5H11L11 22L19.5 10.5H13L13 2Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(167,139,250,0.15)" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Мокап: 3D наклон + реальное видео ───────────────────────────────────────

function BrowserMockup() {
  return (
    <div className="relative">
      <div
        className="float absolute -right-4 -top-5 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-center text-xs font-bold leading-tight text-white shadow-xl shadow-fuchsia-500/40 sm:-right-6 sm:-top-6 sm:h-20 sm:w-20 sm:text-sm"
        aria-hidden="true"
      >
        30<br />сек
      </div>

      <div className="absolute -right-2 top-10 z-20 sm:-right-3 sm:top-14" aria-hidden="true">
        <svg width="36" height="32" viewBox="0 0 36 32" fill="none" className="text-fuchsia-400 opacity-60">
          <path d="M34 2 C26 2, 8 12, 4 28" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeDasharray="3.5 3" />
          <path d="M2 24l2 6 5-3" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div
        className="absolute -bottom-6 left-8 right-8 h-10 blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.4), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="mockup-3d">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#13131A] shadow-2xl shadow-black/70">
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#1C1C28] px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-1 text-[10px] text-[#6B6B80]">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              </svg>
              roomforia.ru
            </div>
          </div>

          <div
            className="relative overflow-hidden"
            style={{ height: "300px" }}
            aria-label="Превью сайта roomforia.ru"
          >
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12"
              style={{ background: "linear-gradient(to top, #13131A, transparent)" }}
              aria-hidden="true"
            />
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full"
              style={{ display: "block", objectFit: "cover", objectPosition: "top" }}
            >
              <source src="/video/preview.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      <div
        className="absolute -right-5 top-6 -z-10 hidden w-20 overflow-hidden rounded-xl border border-white/[0.05] bg-[#13131A] opacity-25 sm:block"
        aria-hidden="true"
        style={{ transform: "perspective(1200px) rotateY(-8deg) rotateX(3deg)" }}
      >
        <div className="h-4 bg-[#1C1C28]" />
        <div className="space-y-1.5 p-2">
          <div className="h-10 rounded-lg bg-violet-900/30" />
          <div className="h-2 w-3/4 rounded bg-white/10" />
          <div className="h-2 w-1/2 rounded bg-white/5" />
          <div className="h-2 w-2/3 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-0 pt-12 sm:px-6 sm:pt-16">
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/4 -translate-y-1/4" aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.22), transparent 70%)", filter: "blur(60px)" }} />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] translate-x-1/3" aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.16), transparent 70%)", filter: "blur(70px)" }} />
      <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start pt-4">
            <div className="reveal-up badge-animated inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-violet-300">
              <span className="pulse-glow h-1.5 w-1.5 rounded-full bg-violet-400" aria-hidden="true" />
              AI-генератор дизайна сайтов
            </div>

            <h1 className="reveal-up delay-1 mt-5 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
              Опишите бизнес —<br />
              получите сайт<br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                за 30 секунд
              </span>
            </h1>

            <p className="reveal-up delay-2 mt-5 text-base leading-7 text-[#A1A1B5] sm:text-lg">
              Искусственный интеллект создаст дизайн сайта<br className="hidden sm:block" />
              по описанию вашего бизнеса.<br className="hidden sm:block" />
              Нравится — заказывайте разработку.
            </p>

            <div className="reveal-up delay-3 mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/generator"
                className="btn-shimmer inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/40 transition hover:opacity-90 hover:-translate-y-0.5">
                <span className="text-base" aria-hidden="true">✦</span>
                Сгенерировать дизайн
              </Link>
              <Link href="/process"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 hover:border-white/20">
                <PlayIcon />
                Как это работает?
              </Link>
            </div>
          </div>

          <div className="reveal-up delay-2 relative pb-8 pt-4 lg:pb-0">
            <BrowserMockup />
          </div>
        </div>

        <div className="reveal-up delay-4 mt-8 grid grid-cols-3 gap-3 border-t border-white/[0.06] py-6 sm:gap-4">
          {[
            { icon: <BoltIcon />, value: "30 секунд", label: "время генерации дизайна", color: "text-violet-400" },
            { icon: <CalendarIcon />, value: "7–14 дней", label: "срок разработки", color: "text-blue-400" },
            { icon: <CheckCircleIcon />, value: "Без предоплаты", label: "оплата после результата", color: "text-emerald-400" },
          ].map((m) => (
            <div key={m.label}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#13131A] px-3 py-4 sm:px-5">
              <span className={`shrink-0 ${m.color}`}>{m.icon}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white sm:text-base">{m.value}</p>
                <p className="mt-0.5 truncate text-[10px] leading-4 text-[#6B6B80] sm:text-xs">{m.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── КАК ЭТО РАБОТАЕТ ────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { num: "1", icon: "✍️", title: "Опишите бизнес", desc: "Расскажите о своей компании в паре предложений" },
    { num: "2", icon: "⚡", title: "AI создаёт дизайн", desc: "Искусственный интеллект генерирует дизайн сайта за 30 секунд" },
    { num: "3", icon: "👀", title: "Посмотрите и оцените", desc: "Оцените дизайн. Нравится — переходим к разработке" },
    { num: "4", icon: "🚀", title: "Получите готовый сайт", desc: "Мы создадим сайт под ключ и запустим его для вашего бизнеса" },
  ];

  return (
    <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal-up text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Как это работает</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Четыре шага до готового сайта
          </h2>
        </div>
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.num} className="relative">
              {/* Стрелка между шагами на десктопе */}
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-3 top-8 z-10 hidden lg:block" aria-hidden="true">
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                    <path d="M0 8h20M14 2l8 6-8 6" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <div
                className={`reveal-up rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-violet-500/30 hover:bg-[#1C1C28] ${
                  i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4"
                }`}>
                {/* Декоративный номер */}
                <span className="pointer-events-none absolute right-4 top-3 select-none text-6xl font-black leading-none text-white/[0.04]" aria-hidden="true">
                  {step.num}
                </span>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{step.icon}</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-bold text-violet-400">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B6B80]">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ─── ПРИМЕРЫ ДИЗАЙНОВ ────────────────────────────────────────────────────────

function GeneratorExamples() {
  const categories = ["Медицина", "Красота", "Спорт"];

  return (
    <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal-up text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Примеры</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Примеры дизайнов</h2>
          <p className="mt-3 text-[#A1A1B5]">Реальные результаты нашего генератора для разных ниш бизнеса</p>
        </div>
        <GeneratorExamplesFilter cases={GENERATOR_CASES} categories={categories} />
      </div>
    </section>
  );
}

// ─── ДЛЯ КОГО ─────────────────────────────────────────────────────────────────

function ForWhom() {
  const categories = [
    { icon: "☕", label: "Кафе и рестораны" },
    { icon: "💅", label: "Салоны красоты" },
    { icon: "🏥", label: "Клиники и медицина" },
    { icon: "🎓", label: "Эксперты и коучи" },
    { icon: "🏢", label: "Малый бизнес" },
    { icon: "⚙️", label: "Компании и услуги" },
  ];

  return (
    <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal-up text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Кому подойдёт</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Для любого бизнеса</h2>
        </div>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 sm:hidden">
          <div className="flex gap-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
            {categories.map((cat) => (
              <div key={cat.label}
                className="flex w-[40vw] max-w-[160px] shrink-0 flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#13131A] p-5 text-center"
                style={{ scrollSnapAlign: "start" }}>
                <span className="text-3xl" aria-hidden="true">{cat.icon}</span>
                <p className="text-sm font-medium text-[#A1A1B5]">{cat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 hidden grid-cols-6 gap-4 sm:grid">
          {categories.map((cat, i) => {
            const delay = i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3";
            return (
              <div key={cat.label}
                className={`reveal-up flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#13131A] p-5 text-center transition hover:border-white/20 hover:bg-[#1C1C28] ${delay}`}>
                <span className="text-3xl" aria-hidden="true">{cat.icon}</span>
                <p className="text-sm font-medium text-[#A1A1B5]">{cat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── ПРОЗРАЧНЫЕ ЦЕНЫ ─────────────────────────────────────────────────────────

function PricingPreview() {
  const plans = [
    {
      name: "Лендинг", price: "€500", period: "от",
      features: ["1 страница", "AI-дизайн", "Адаптивный дизайн", "Базовая SEO-оптимизация", "Форма заявки / контакты"],
      featured: false,
    },
    {
      name: "Бизнес-сайт", price: "€800", period: "от",
      features: ["До 5 страниц", "AI-дизайн", "Адаптивный дизайн", "Базовая SEO-оптимизация", "Форма заявки / контакты"],
      featured: true,
    },
  ];

  return (
    <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal-up text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Прозрачные цены</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Фиксированная стоимость</h2>
          <p className="mt-3 text-[#A1A1B5]">Без скрытых доплат — знаете цену до начала работы</p>
        </div>

        <div className="mt-10 grid gap-5 sm:mx-auto sm:max-w-2xl sm:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.name}
              className={`reveal-up rounded-2xl border p-7 ${
                plan.featured
                  ? "border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-blue-500/5 delay-2"
                  : "border-white/10 bg-[#13131A] delay-1"
              }`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${plan.featured ? "text-violet-400" : "text-[#6B6B80]"}`}>
                {plan.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-xs text-[#6B6B80]">{plan.period}</span>
                <span className="text-4xl font-bold text-white">{plan.price}</span>
              </div>
              <ul className="mt-5 flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#A1A1B5]">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${plan.featured ? "bg-violet-400" : "bg-[#6B6B80]"}`} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/generator"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  plan.featured
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}>
                Заказать
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/pricing" className="text-sm text-[#A1A1B5] transition-colors hover:text-white">
            Смотреть все пакеты →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── ФИНАЛЬНЫЙ CTA ────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 p-8 text-center sm:p-14">
          {/* Анимированный glow */}
          <div
            className="cta-glow-pulse pointer-events-none absolute inset-0 rounded-3xl"
            aria-hidden="true"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.5), transparent 70%)" }}
          />
          {/* Сетка */}
          <div className="grid-overlay pointer-events-none absolute inset-0 rounded-3xl opacity-40" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Готовы получить сайт за 30 секунд?</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Опишите свой бизнес и получите дизайн<br className="hidden sm:block" /> прямо сейчас
            </h2>
            <p className="mt-4 text-[#A1A1B5]">Бесплатно. Без регистрации. Нравится — заказываете разработку.</p>
            <Link href="/generator"
              className="btn-shimmer mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
              <span aria-hidden="true">✦</span> Попробовать бесплатно
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Страница ─────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <GeneratorExamples />
      <ForWhom />
      <PricingPreview />
      <Faq
        title="Частые вопросы"
        subtitle="Отвечаем на то что чаще всего спрашивают"
        items={homeContent.faq.items}
      />
      <FinalCta />
    </main>
  );
}
