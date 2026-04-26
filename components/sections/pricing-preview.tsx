"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PRICING_PLANS } from "@/content/pricing";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface PeriodSwitchProps {
  isYearly: boolean;
  onSwitch: (yearly: boolean) => void;
}

function PeriodSwitch({ isYearly, onSwitch }: PeriodSwitchProps) {
  return (
    <div className="flex justify-center">
      <div className="relative flex rounded-full border border-white/10 bg-[#13131A] p-1">
        <button
          onClick={() => onSwitch(false)}
          aria-pressed={!isYearly}
          className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 ${
            !isYearly ? "text-white" : "text-[#6B6B80] hover:text-[#A1A1B5]"
          }`}
        >
          {!isYearly && (
            <motion.span
              layoutId="period-pill"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30"
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            />
          )}
          <span className="relative">Разово</span>
        </button>

        <button
          onClick={() => onSwitch(true)}
          aria-pressed={isYearly}
          className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500 ${
            isYearly ? "text-white" : "text-[#6B6B80] hover:text-[#A1A1B5]"
          }`}
        >
          {isYearly && (
            <motion.span
              layoutId="period-pill"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/30"
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            />
          )}
          <span className="relative">Со скидкой</span>
          <span className="relative inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            −15%
          </span>
        </button>
      </div>
    </div>
  );
}

const DISCOUNT_PRICES: Record<string, string> = {
  "€500–700": "€425–595",
  "€800–1200": "€680–1020",
  "€150–250": "€127–212",
};

interface PlanCardProps {
  plan: (typeof PRICING_PLANS)[number];
  isYearly: boolean;
  index: number;
}

function PlanCard({ plan, isYearly, index }: PlanCardProps) {
  const discountedPrice = DISCOUNT_PRICES[plan.price] ?? plan.price;
  const displayPrice = isYearly ? discountedPrice : plan.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 ${
        plan.featured
          ? "border-violet-500/40 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 shadow-xl shadow-violet-500/10 sm:-translate-y-3"
          : "border-white/[0.08] bg-[#13131A] hover:border-white/20 hover:bg-[#1C1C28]"
      }`}
    >
      {plan.featured && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          aria-hidden="true"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.15), transparent 70%)",
          }}
        />
      )}

      <div className="relative flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border ${
            plan.featured
              ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
              : "border-white/10 bg-white/5 text-[#6B6B80]"
          }`}
        >
          {plan.badge}
        </span>
        {plan.featured && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2.5 py-1 text-[10px] font-semibold text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" aria-hidden="true" />
            Популярный
          </span>
        )}
      </div>

      <div className="relative mt-5">
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <div className="mt-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={displayPrice}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="block text-4xl font-bold tracking-tight text-white"
            >
              {displayPrice}
            </motion.span>
          </AnimatePresence>
          <p className="mt-0.5 text-xs text-[#6B6B80]">{plan.duration}</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#A1A1B5]">{plan.description}</p>
      </div>

      <div className="relative mt-6">
        <Link
          href="/contacts"
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            plan.featured
              ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90 focus-visible:outline-violet-500"
              : "border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 focus-visible:outline-white/40"
          }`}
        >
          {plan.cta} <ArrowRight />
        </Link>
      </div>

      <ul className="relative mt-6 flex flex-col gap-2.5 border-t border-white/[0.06] pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-[#A1A1B5]">
            <span
              className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                plan.featured ? "bg-violet-600 text-white" : "bg-[#1C1C28] text-[#6B6B80]"
              }`}
            >
              <CheckIcon />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function PricingPreview() {
  const [isYearly, setIsYearly] = useState(false);
  const handleSwitch = useCallback((yearly: boolean) => setIsYearly(yearly), []);

  return (
    <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(124,58,237,0.12), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="reveal-up text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Прозрачные цены</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Фиксированная стоимость —{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              без сюрпризов
            </span>
          </h2>
          <p className="mt-3 text-[#A1A1B5]">Знаете цену до начала работы. Никаких расплывчатых оценок.</p>
        </div>

        <div className="mt-8">
          <PeriodSwitch isYearly={isYearly} onSwitch={handleSwitch} />
        </div>

        {/* Мобилка */}
        <div className="-mx-4 mt-10 sm:hidden">
          <div
            className="overflow-x-auto px-4 pb-4"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            <ul className="flex gap-4" role="list" aria-label="Тарифные планы">
              {PRICING_PLANS.map((plan, index) => (
                <li
                  key={plan.name}
                  className="w-[82vw] max-w-[320px] shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <PlanCard plan={plan} isYearly={isYearly} index={index} />
                </li>
              ))}
              <li className="w-4 shrink-0" aria-hidden="true" />
            </ul>
          </div>
          <p className="mt-2 text-center text-xs text-[#6B6B80]">Листайте →</p>
        </div>

        {/* Десктоп */}
        <ul
          className="mt-10 hidden items-end gap-5 sm:grid sm:grid-cols-3"
          role="list"
          aria-label="Тарифные планы"
        >
          {PRICING_PLANS.map((plan, index) => (
            <li key={plan.name}>
              <PlanCard plan={plan} isYearly={isYearly} index={index} />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-[#6B6B80]">Оплата 50/50 · Фиксированный объём · Без скрытых доплат</p>
          <Link href="/pricing" className="text-sm text-[#A1A1B5] transition-colors hover:text-white">
            Подробнее о пакетах →
          </Link>
        </div>
      </div>
    </section>
  );
}
