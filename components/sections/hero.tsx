"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface HeroMetric {
  value: string;
  label: string;
}

interface HeroProps {
  badge: string;
  title: string;
  accent: string;
  subtitle: string;
  cta: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  metrics: HeroMetric[];
}

// ─── Под-компоненты ───────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="opacity-70"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function Hero({ badge, title, accent, subtitle, cta, metrics }: HeroProps) {
  const [visible, setVisible] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);

    // mousemove только на устройствах с мышью — не вешаем на touch
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return () => clearTimeout(t);

    function handleMouseMove(e: MouseEvent) {
      if (!glowRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      glowRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-28 sm:pt-28">
      {/* Фон */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-violet-50/50 to-white" />
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 -z-10 transition-transform duration-500"
        style={{
          background:
            "radial-gradient(circle at 22% 28%, rgba(124,58,237,0.18), transparent 26%), radial-gradient(circle at 78% 60%, rgba(59,130,246,0.15), transparent 26%)",
          filter: "blur(80px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(24,24,27,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,24,27,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center">

          {/* Бейдж */}
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" aria-hidden="true" />
              {badge}
            </span>
          </div>

          {/* Заголовок */}
          <h1
            className={`mt-6 text-4xl font-semibold leading-[1.15] tracking-tight text-zinc-950 transition-all delay-100 duration-700 sm:text-5xl lg:text-[3.75rem] ${
              visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            {title}
            <span className="mt-2 block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              {accent}
            </span>
          </h1>

          {/* Подзаголовок */}
          <p
            className={`mt-6 max-w-2xl text-base leading-7 text-zinc-600 transition-all delay-200 duration-700 sm:text-lg ${
              visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            {subtitle}
          </p>

          {/* CTA кнопки */}
          <div
            className={`mt-8 flex w-full flex-col gap-3 transition-all delay-300 duration-700 sm:w-auto sm:flex-row ${
              visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            <Link
              href={cta.primary.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg"
            >
              {cta.primary.label}
              <ArrowIcon />
            </Link>
            {cta.secondary && (
              <Link
                href={cta.secondary.href}
                className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white/90 px-7 py-3.5 text-sm font-medium text-zinc-700 transition hover:-translate-y-0.5 hover:bg-zinc-50"
              >
                {cta.secondary.label}
              </Link>
            )}
          </div>

          {/* Метрики — горизонтальный скролл на мобилке, сетка на десктопе */}
          <div
            className={`mt-10 w-full transition-all delay-500 duration-700 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            {/* Мобилка: горизонтальный скролл */}
            <div className="-mx-4 overflow-x-auto px-4 sm:hidden">
              <div className="flex gap-3 pb-1">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="min-w-[140px] shrink-0 rounded-2xl border border-zinc-200 bg-white/80 px-4 py-4 text-center shadow-sm backdrop-blur"
                  >
                    <p className="text-lg font-semibold text-zinc-950">{m.value}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Десктоп: сетка */}
            <div className="mx-auto hidden max-w-2xl grid-cols-3 gap-3 sm:grid">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-zinc-200 bg-white/80 px-4 py-4 text-center shadow-sm backdrop-blur"
                >
                  <p className="text-lg font-semibold text-zinc-950">{m.value}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
