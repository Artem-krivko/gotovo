import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/sections/faq";
import { GeneratorExamplesFilter } from "@/components/sections/generator-examples-filter";
import { ParallaxMockup } from "@/components/shared/parallax-mockup";
import { ScrollGlow } from "@/components/shared/scroll-glow";
import { homeContent } from "@/content/pages/home";
import { PricingPreview } from "@/components/sections/pricing-preview";
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

// ─── Мокап с видео ────────────────────────────────────────────────────────────

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

          <div className="relative overflow-hidden" style={{ height: "300px" }} aria-label="Превью сайта roomforia.ru">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12"
              style={{ background: "linear-gradient(to top, #13131A, transparent)" }}
              aria-hidden="true"
            />
            <video autoPlay muted loop playsInline className="w-full" style={{ display: "block", objectFit: "cover", objectPosition: "top" }}>
              <source src="/video/preview.mp4" type="video/mp4" />
            </video>
          </div>
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

            <h1 className="reveal-up delay-1 mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
              Опишите бизнес —<br />
              получите сайт<br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                за 30 секунд
              </span>
            </h1>

            <p className="reveal-up delay-2 mt-4 text-sm leading-6 text-[#A1A1B5] sm:text-lg">
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
            <ParallaxMockup>
              <BrowserMockup />
            </ParallaxMockup>
          </div>
        </div>

        <div className="reveal-up delay-4 mt-6 grid grid-cols-3 gap-2 border-t border-white/[0.06] py-4 sm:gap-4">
          {[
            { icon: <BoltIcon />, value: "30 секунд", label: "время генерации дизайна", color: "text-violet-400", border: "border-violet-500/40", glow: "shadow-lg shadow-violet-500/20" },
            { icon: <CalendarIcon />, value: "7–14 дней", label: "срок разработки", color: "text-blue-400", border: "border-blue-500/40", glow: "shadow-lg shadow-blue-500/20" },
            { icon: <CheckCircleIcon />, value: "Без предоплаты", label: "оплата после результата", color: "text-emerald-400", border: "border-emerald-500/40", glow: "shadow-lg shadow-emerald-500/20" },
          ].map((m) => (
            <div key={m.label} className={`flex items-center gap-3 rounded-2xl border ${m.border} bg-[#13131A] px-3 py-4 ${m.glow} sm:px-5`}>
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

function StepIconDescribe() {
  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 shadow-lg shadow-violet-500/30">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 14.5V17h2.5l7.37-7.37-2.5-2.5L3 14.5z" fill="white" fillOpacity="0.9"/>
        <path d="M16.71 5.04a1 1 0 0 0 0-1.41l-1.34-1.34a1 1 0 0 0-1.41 0l-1.05 1.05 2.75 2.75 1.05-1.05z" fill="white"/>
      </svg>
    </div>
  );
}

function StepIconAI() {
  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="3" fill="white"/>
        <path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.42 1.42M13.54 13.54l1.41 1.41M5.05 14.95l1.42-1.41M13.54 6.46l1.41-1.41" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.8"/>
      </svg>
    </div>
  );
}

function StepIconEye() {
  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-500/30">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="white" fillOpacity="0.1"/>
        <circle cx="10" cy="10" r="2.5" fill="white"/>
      </svg>
    </div>
  );
}

function StepIconBrush() {
  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/30">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 17c2-2 4-3 6-3s4 2 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 13l9-9 3 3-9 9" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function StepIconRocket() {
  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2C10 2 14 4 14 9c0 2.5-1 4.5-4 6-3-1.5-4-3.5-4-6 0-5 4-7 4-7z" fill="white" fillOpacity="0.9"/>
        <path d="M7 13l-2 3M13 13l2 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.6"/>
        <path d="M8 16h4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
      </svg>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { num: "1", icon: <StepIconDescribe />, title: "Опишите бизнес", desc: "Расскажите о своей компании в паре предложений" },
    { num: "2", icon: <StepIconAI />, title: "AI создаёт дизайн", desc: "Искусственный интеллект генерирует дизайн сайта за 30 секунд" },
    { num: "3", icon: <StepIconEye />, title: "Посмотрите и оцените", desc: "Оцените дизайн. Нравится — переходим к разработке" },
    { num: "4", icon: <StepIconBrush />, title: "Мы дорабатываем", desc: "Берём AI-дизайн как основу и доводим до профессионального результата" },
    { num: "5", icon: <StepIconRocket />, title: "Получите готовый сайт", desc: "Запускаем под ключ, настраиваем аналитику и SEO" },
  ];

  return (
    <>
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>
      <ScrollGlow className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="glow-orb -top-24 -right-24 h-[400px] w-[400px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent 65%)" }} />
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Как это работает</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Пять шагов до готового сайта</h2>
          </div>
          <div className="flex flex-col gap-3 mt-10 sm:hidden">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#13131A] p-4">
                <div className="mt-0.5 flex flex-col items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${i===0?"bg-violet-500":i===1?"bg-blue-500":i===2?"bg-fuchsia-500":i===3?"bg-emerald-500":"bg-amber-500"}`} aria-hidden="true" />
                  {i < steps.length - 1 && <div className="w-px bg-white/[0.06]" style={{minHeight:"24px"}} aria-hidden="true" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B6B80]">{String(i+1).padStart(2,"0")}</p>
                  <p className="mt-0.5 text-sm font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6B6B80]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <ol className="mt-10 hidden gap-4 sm:grid sm:grid-cols-5">
            {steps.map((step, i) => (
              <li key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="pointer-events-none absolute -right-3 top-8 z-10 hidden lg:block" aria-hidden="true">
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                      <path d="M0 7h16M11 2l7 5-7 5" stroke="rgba(124,58,237,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div className={`reveal-up flex h-full flex-col rounded-2xl border border-white/10 bg-[#13131A] p-5 transition hover:border-violet-500/30 hover:bg-[#1C1C28] ${i===0?"delay-1":i===1?"delay-2":i===2?"delay-3":i===3?"delay-4":""}`}>
                  <span className="pointer-events-none absolute right-3 top-2 select-none text-5xl font-black leading-none text-white/[0.04]" aria-hidden="true">{step.num}</span>
                  <div className="mb-3 flex items-center gap-2">
                    {step.icon}
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-[10px] font-bold text-violet-400">{step.num}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-5 text-[#6B6B80]">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </ScrollGlow>
    </>
  );
}

// ─── ПРИМЕРЫ ДИЗАЙНОВ ────────────────────────────────────────────────────────

function GeneratorExamples() {
  const categories = ["Медицина", "Красота", "Спорт", "Еда", "B2B"];
  return (
    <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal-up text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Результаты генератора</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Посмотрите что{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">создаёт AI</span>
          </h2>
          <p className="mt-3 text-[#A1A1B5]">5 ниш — 5 разных стилей. Каждый дизайн под характер бизнеса.</p>
        </div>
        <GeneratorExamplesFilter cases={GENERATOR_CASES} categories={categories} />
      </div>
    </section>
  );
}

// ─── ДЛЯ КОГО ─────────────────────────────────────────────────────────────────

function IconCafe() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 2v4M10 2v4M14 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M4 6h12l-1.5 10a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M16 8h2a2 2 0 0 1 0 4h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function IconBeauty() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2C9 2 7 5 7 8c0 2.5 1.5 4.5 3.5 5.5V17h3v-3.5C15.5 12.5 17 10.5 17 8c0-3-2-6-5-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 17v1a2 2 0 0 0 4 0v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function IconClinic() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 11h18" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v4M10 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 15h4M12 13v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function IconExpert() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 3l1.5 1.5L21 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconBusiness() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="1.5"/><path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function IconServices() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 14.8l-4.9 2.6.9-5.5L4 7.8l5.5-.8L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}

function ForWhom() {
  const categories = [
    { icon: <IconCafe />, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "Кафе и рестораны" },
    { icon: <IconBeauty />, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", label: "Салоны красоты" },
    { icon: <IconClinic />, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", label: "Клиники и медицина" },
    { icon: <IconExpert />, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", label: "Эксперты и коучи" },
    { icon: <IconBusiness />, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Малый бизнес" },
    { icon: <IconServices />, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/20", label: "Компании и услуги" },
  ];

  return (
    <>
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/15 to-transparent" />
      </div>
      <ScrollGlow className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="glow-orb top-0 left-1/2 -translate-x-1/2 h-[350px] w-[700px]" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse, rgba(217,70,239,0.1), transparent 65%)" }} />
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Кому подойдёт</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Для любого бизнеса</h2>
          </div>
          <div className="-mx-4 mt-10 sm:hidden">
            <div className="niches-scroll overflow-x-auto px-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
              <div className="flex gap-4">
                {categories.map((cat) => (
                  <div key={cat.label} className="flex w-[40vw] max-w-[160px] shrink-0 flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#13131A] p-5 text-center" style={{ scrollSnapAlign: "start" }}>
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${cat.bg} ${cat.color}`}>{cat.icon}</div>
                    <p className="text-sm font-medium text-[#A1A1B5]">{cat.label}</p>
                  </div>
                ))}
                <div className="w-4 shrink-0" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="mt-10 hidden grid-cols-6 gap-4 sm:grid">
            {categories.map((cat, i) => (
              <div key={cat.label} className={`reveal-up flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#13131A] p-5 text-center transition hover:border-white/20 hover:bg-[#1C1C28] ${i<2?"delay-1":i<4?"delay-2":"delay-3"}`}>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${cat.bg} ${cat.color}`}>{cat.icon}</div>
                <p className="text-sm font-medium text-[#A1A1B5]">{cat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollGlow>
    </>
  );
}

// ─── ФИНАЛЬНЫЙ CTA ────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <>
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 p-8 text-center sm:p-14">
            <div className="cta-glow-pulse pointer-events-none absolute inset-0 rounded-3xl" aria-hidden="true"
              style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.5), transparent 70%)" }} />
            <div className="grid-overlay pointer-events-none absolute inset-0 rounded-3xl opacity-40" aria-hidden="true" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Готовы получить сайт за 30 секунд?</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Опишите свой бизнес и получите<br className="hidden sm:block" /> дизайн прямо сейчас
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
    </>
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
