"use client"

/**
 * ParticleHero — GSAP ScrollTrigger scroll-презентация
 * ─────────────────────────────────────────────────────
 * Архитектура:
 *   - DOM каркас (skeleton → structure → live)
 *   - PNG мокап внутри браузерного окна (clip-path reveal + световой луч)
 *   - DOM метрики (+248%, 6.8%) прилетают отдельно
 *   - DOM кейсы появляются снизу
 *
 * Шаг 1 (0–20%)   — Skeleton: wireframe каркас, low opacity
 * Шаг 2 (20–40%)  — Structure: цвет, типографика, кнопки
 * Шаг 3 (40–60%)  — Reveal: PNG мокап clip-path + световой луч
 * Шаг 4 (60–80%)  — Life: метрики прилетают, кейсы снизу
 * Шаг 5 (80–100%) — Final: стабилизация, CTA усиливается
 */

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

// ─── Данные шагов ────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01", badge: "Начало", color: "violet",
    title: "Опишите бизнес",
    desc: "Расскажите о своей компании в паре предложений — чем занимаетесь, кто ваши клиенты, какой стиль близок.",
  },
  {
    num: "02", badge: "Генерация", color: "blue",
    title: "AI создаёт дизайн",
    desc: "Искусственный интеллект за 30 секунд генерирует уникальный дизайн — структуру, цвета, типографику.",
  },
  {
    num: "03", badge: "Оценка", color: "fuchsia",
    title: "Посмотрите и оцените",
    desc: "Вы видите живой превью. Нравится — идём дальше. Не нравится — корректируем бесплатно.",
  },
  {
    num: "04", badge: "Доработка", color: "emerald",
    title: "Мы делаем лучше",
    desc: "AI-дизайн — стартовая точка. Доводим до профессионального результата: анимации, адаптив, детали.",
  },
  {
    num: "05", badge: "Результат", color: "amber",
    title: "Готовый сайт под ключ",
    desc: "Запускаем сайт, настраиваем аналитику, SEO и формы. Рабочий инструмент для роста бизнеса.",
  },
]

const COLOR_MAP: Record<string, { badge: string; num: string; dot: string }> = {
  violet:  { badge: "bg-violet-500/10 text-violet-400 border-violet-500/30",    num: "text-violet-400",  dot: "bg-violet-500"  },
  blue:    { badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",          num: "text-blue-400",    dot: "bg-blue-500"    },
  fuchsia: { badge: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30", num: "text-fuchsia-400", dot: "bg-fuchsia-500" },
  emerald: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", num: "text-emerald-400", dot: "bg-emerald-500" },
  amber:   { badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",       num: "text-amber-400",   dot: "bg-amber-500"   },
}

// ─── Правая панель — UI ───────────────────────────────────────────────────────

interface UIPanelProps {
  // Refs для GSAP
  skeletonRef:  React.RefObject<HTMLDivElement | null>
  mockupRef:    React.RefObject<HTMLDivElement | null>
  lightRef:     React.RefObject<HTMLDivElement | null>
  metric1Ref:   React.RefObject<HTMLDivElement | null>
  metric2Ref:   React.RefObject<HTMLDivElement | null>
  casesRef:     React.RefObject<HTMLDivElement | null>
}

function UIPanel({ skeletonRef, mockupRef, lightRef, metric1Ref, metric2Ref, casesRef }: UIPanelProps) {
  return (
    <div className="relative flex h-full w-full flex-col gap-3">

      {/* ── Skeleton overlay — wireframe каркас (Шаг 1) ── */}
      {/* Показывается в начале поверх всего, затем исчезает */}
      <div
        ref={skeletonRef}
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
        aria-hidden="true"
        style={{
          background: "rgba(13,13,22,0.85)",
          border: "1px dashed rgba(124,58,237,0.25)",
        }}
      >
        {/* Skeleton линии */}
        <div className="flex h-full flex-col gap-3 p-4 opacity-40">
          {/* Skeleton навбар */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-20 rounded-lg bg-violet-500/30"/>
            <div className="flex gap-2">
              {[1,2,3,4].map(i => <div key={i} className="h-3 w-12 rounded bg-white/10"/>)}
            </div>
            <div className="ml-auto h-7 w-24 rounded-lg bg-violet-500/20"/>
          </div>
          {/* Skeleton main */}
          <div className="flex flex-1 gap-3">
            <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="m-3 space-y-2">
                <div className="h-3 w-1/2 rounded bg-white/10"/>
                <div className="h-5 w-3/4 rounded bg-white/15"/>
                <div className="h-5 w-full rounded bg-white/10"/>
                <div className="mt-3 h-8 w-1/3 rounded-lg bg-violet-500/20"/>
              </div>
            </div>
            <div className="w-24 flex flex-col gap-2">
              <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02]"/>
              <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02]"/>
            </div>
          </div>
          {/* Skeleton кейсы */}
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3].map(i => <div key={i} className="h-12 rounded-xl border border-white/[0.06] bg-white/[0.02]"/>)}
          </div>
        </div>
      </div>

      {/* ── Центральный блок: браузер + метрики ── */}
      <div className="flex flex-1 gap-3 overflow-hidden">

        {/* Браузерный мокап с PNG внутри (Шаг 2–3) */}
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#13131A]">

          {/* Браузерная строка — структура */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#1C1C28] px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500/70"/>
              <span className="h-2 w-2 rounded-full bg-yellow-500/70"/>
              <span className="h-2 w-2 rounded-full bg-green-500/70"/>
            </div>
            <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.06] px-3 py-1 text-[10px] text-[#6B6B80]">
              yourbrand.com
            </div>
          </div>

          {/* PNG мокап с clip-path reveal + световой луч (Шаг 3) */}
          <div
            ref={mockupRef}
            className="relative overflow-hidden"
            style={{
              clipPath: "inset(100% 0% 0% 0%)",  // начальное состояние — скрыт снизу
              transform: "scale(0.97)",
              filter: "blur(6px)",
              opacity: 0,
            }}
          >
            {/* Световой луч — проходит сверху вниз при reveal */}
            <div
              ref={lightRef}
              className="pointer-events-none absolute left-0 right-0 z-10 h-16"
              aria-hidden="true"
              style={{
                top: "-64px",
                background: "linear-gradient(to bottom, transparent, rgba(124,58,237,0.35), transparent)",
                filter: "blur(8px)",
              }}
            />

            <Image
              src="/images/hero-blocks/mockup.jpg"
              alt="Пример сайта созданного gotovo"
              width={545}
              height={475}
              className="w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Правая колонка: метрики DOM */}
        <div className="flex w-[130px] flex-col gap-3">

          {/* Карточка +248% (Шаг 4) */}
          <div
            ref={metric1Ref}
            className="flex-1 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-4"
            style={{ opacity: 0, transform: "translateX(60px) rotate(4deg)", filter: "blur(8px)" }}
            aria-hidden="true"
          >
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#6B6B80]">Рост заявок</p>
            <p className="mt-1.5 text-2xl font-black text-white">+248%</p>
            <p className="text-[9px] text-violet-400">за 3 месяца</p>
            {/* SVG график */}
            <div className="mt-3">
              <svg width="100%" height="36" viewBox="0 0 100 36" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(124,58,237,0.4)"/>
                    <stop offset="100%" stopColor="rgba(124,58,237,0)"/>
                  </linearGradient>
                </defs>
                <path d="M0 32 C20 28,40 20,60 14 C80 8,90 4,100 2" stroke="rgba(167,139,250,1)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M0 32 C20 28,40 20,60 14 C80 8,90 4,100 2 L100 36 L0 36Z" fill="url(#g1)"/>
              </svg>
            </div>
          </div>

          {/* Карточка 6.8% (Шаг 4) */}
          <div
            ref={metric2Ref}
            className="flex-1 overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-violet-500/5 p-4"
            style={{ opacity: 0, transform: "translateX(60px) rotate(3deg)", filter: "blur(8px)" }}
            aria-hidden="true"
          >
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#6B6B80]">Конверсия</p>
            <p className="mt-1.5 text-2xl font-black text-white">6.8%</p>
            <p className="text-[9px] text-blue-400">+1.3% за неделю</p>
            {/* Бар-чарт */}
            <div className="mt-3 flex items-end gap-0.5">
              {[3,4,3,5,4,6,5,7,6,8].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-blue-500/60"
                  style={{ height: `${h * 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Кейсы (Шаг 4) ── */}
      <div
        ref={casesRef}
        className="overflow-hidden rounded-2xl border border-white/10 bg-[#13131A] p-4"
        style={{ opacity: 0, transform: "translateY(40px)", filter: "blur(6px)" }}
        aria-hidden="true"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-white">Наши кейсы</p>
          <div className="flex items-center gap-2">
            {["01","02","03"].map((n, i) => (
              <span key={n} className={`text-[9px] font-bold ${i===1 ? "text-violet-400 underline underline-offset-2" : "text-[#6B6B80]"}`}>{n}</span>
            ))}
            <span className="ml-1 text-[9px] text-[#6B6B80]">→</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            "from-slate-800 to-slate-900",
            "from-zinc-800 to-zinc-900",
            "from-stone-800 to-stone-900",
          ].map((g, i) => (
            <div
              key={i}
              className={`aspect-video overflow-hidden rounded-xl bg-gradient-to-br ${g}`}
            >
              <div className="h-full w-full opacity-60" style={{
                background: i === 0
                  ? "linear-gradient(135deg, #1a1a2e, #16213e)"
                  : i === 1
                  ? "linear-gradient(135deg, #0d0d0d, #1a1a1a)"
                  : "linear-gradient(135deg, #1a1210, #2d1b0e)",
              }}/>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function ParticleHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const skeletonRef  = useRef<HTMLDivElement>(null)
  const mockupRef    = useRef<HTMLDivElement>(null)
  const lightRef     = useRef<HTMLDivElement>(null)
  const metric1Ref   = useRef<HTMLDivElement>(null)
  const metric2Ref   = useRef<HTMLDivElement>(null)
  const casesRef     = useRef<HTMLDivElement>(null)

  const [activeStep, setActiveStep]         = useState(0)
  const [showCta, setShowCta]               = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Scroll listener для текста
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onScroll = () => {
      const rect  = container.getBoundingClientRect()
      const total = container.offsetHeight - window.innerHeight
      if (total <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / total))
      setScrollProgress(p)
      setActiveStep(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)))
      setShowCta(p > 0.86)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // GSAP анимации
  useEffect(() => {
    let killed = false

    async function init() {
      const { gsap }          = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)
      if (killed) return

      const container = containerRef.current
      const skeleton  = skeletonRef.current
      const mockup    = mockupRef.current
      const light     = lightRef.current
      const metric1   = metric1Ref.current
      const metric2   = metric2Ref.current
      const cases     = casesRef.current

      if (!container || !skeleton || !mockup || !light || !metric1 || !metric2 || !cases) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start:   "top top",
          end:     "bottom bottom",
          scrub:   1.4,
        },
      })

      // ── ШАГ 1 (0–20%): Skeleton виден, потом исчезает ──
      // Skeleton уже виден изначально — плавно уходит
      tl.to(skeleton, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      }, 0)

      // ── ШАГ 2 (20–40%): Структура появляется — уже в DOM, skeleton уходит ──
      // (Ничего дополнительного — браузерный каркас уже виден)

      // ── ШАГ 3 (30–55%): PNG reveal с clip-path + световой луч ──
      // Clip-path открывается снизу вверх
      tl.to(mockup, {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        filter: "blur(0px)",
        opacity: 1,
        duration: 1.8,
        ease: "power3.out",
      }, 1.0)

      // Световой луч проходит сверху вниз во время reveal
      tl.fromTo(light, {
        top: "-64px",
        opacity: 0,
      }, {
        top: "110%",
        opacity: 1,
        duration: 1.8,
        ease: "power2.inOut",
      }, 1.0)

      // ── ШАГ 4 (55–80%): Метрики и кейсы прилетают ──
      // Метрика 1 — справа с поворотом
      tl.to(metric1, {
        x: 0, opacity: 1, rotation: 0, filter: "blur(0px)",
        duration: 1.2, ease: "power3.out",
      }, 2.8)

      // Метрика 2 — справа с небольшим stagger
      tl.to(metric2, {
        x: 0, opacity: 1, rotation: 0, filter: "blur(0px)",
        duration: 1.2, ease: "power3.out",
      }, 3.2)

      // Кейсы снизу
      tl.to(cases, {
        y: 0, opacity: 1, filter: "blur(0px)",
        duration: 1.2, ease: "power3.out",
      }, 3.0)

      // ── ШАГ 5 (80–100%): Лёгкое дыхание — финальная стабилизация ──
      tl.to([mockup, metric1, metric2], {
        y: (i: number) => [-3, -5, -2][i] ?? 0,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      }, 4.5)

      return () => {
        tl.kill()
        ScrollTrigger.getAll().forEach(st => st.kill())
      }
    }

    const cleanup = init()
    return () => {
      killed = true
      cleanup.then(fn => fn?.())
    }
  }, [])

  const step   = STEPS[activeStep]
  const colors = COLOR_MAP[step.color]

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0A0A0F]"
      style={{ height: "520vh" }}
      aria-label="Как работает gotovo"
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Фоновый glow меняет цвет со шагом */}
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-700"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 65% 55% at 65% 50%, ${
              step.color === "violet"   ? "rgba(124,58,237,0.09)" :
              step.color === "blue"    ? "rgba(59,130,246,0.08)"  :
              step.color === "fuchsia" ? "rgba(217,70,239,0.07)"  :
              step.color === "emerald" ? "rgba(52,211,153,0.06)"  :
                                         "rgba(251,191,36,0.05)"
            }, transparent 70%)`,
          }}
        />

        {/* Прогресс-бар */}
        <div className="absolute left-0 right-0 top-0 z-30 h-0.5 bg-white/[0.05]" aria-hidden="true">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500"
            style={{ width: `${scrollProgress * 100}%`, transition: "width 0.08s linear" }}
            role="progressbar"
            aria-valuenow={Math.round(scrollProgress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Прогресс"
          />
        </div>

        {/* Основная сетка */}
        <div className="mx-auto flex h-full max-w-6xl flex-col px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-10">

          {/* ── Левая колонка: текст ── */}
          <div className="flex flex-col justify-center py-16 lg:py-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">
              Как это работает
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              От идеи до{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                готового сайта
              </span>
            </h2>

            <div className="mt-10">
              <div className="flex items-center gap-3">
                <span className={`text-6xl font-black leading-none ${colors.num}`}>
                  {step.num}
                </span>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${colors.badge}`}>
                  {step.badge}
                </span>
              </div>
              <h3 key={`h-${step.num}`} className="mt-5 text-xl font-bold text-white sm:text-2xl">
                {step.title}
              </h3>
              <p key={`p-${step.num}`} className="mt-3 max-w-sm text-base leading-7 text-[#A1A1B5]">
                {step.desc}
              </p>

              {/* CTA — финальный шаг */}
              <div
                className={`mt-10 transition-all duration-500 ${
                  showCta ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                }`}
              >
                <Link
                  href="/generator"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
                  tabIndex={showCta ? 0 : -1}
                >
                  <span aria-hidden="true">✦</span>
                  Попробовать бесплатно — 30 секунд
                </Link>
              </div>
            </div>

            {/* Индикаторы шагов */}
            <div className="mt-10 flex items-center gap-2" aria-label="Шаги">
              {STEPS.map((s, i) => (
                <div
                  key={s.num}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === activeStep
                      ? `w-8 ${COLOR_MAP[s.color].dot}`
                      : i < activeStep
                      ? "w-3 bg-white/25"
                      : "w-3 bg-white/10"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* ── Правая колонка: UI (только десктоп) ── */}
          <div className="relative hidden items-center lg:flex">
            <div className="relative w-full" style={{ height: "min(540px, 76vh)" }}>
              <UIPanel
                skeletonRef={skeletonRef}
                mockupRef={mockupRef}
                lightRef={lightRef}
                metric1Ref={metric1Ref}
                metric2Ref={metric2Ref}
                casesRef={casesRef}
              />
            </div>
          </div>
        </div>

        {/* Мобилка: индикаторы */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center lg:hidden" aria-hidden="true">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#13131A]/80 px-4 py-2.5 backdrop-blur-sm">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className={`rounded-full transition-all duration-500 ${
                  i <= activeStep
                    ? `${COLOR_MAP[s.color].dot} ${i === activeStep ? "h-2 w-6" : "h-2 w-2"}`
                    : "h-2 w-2 bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
