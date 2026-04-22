"use client";

import { useState, useCallback } from "react";
import type { ProcessClientStep } from "@/content/process";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface ProcessClientViewProps {
  steps: ProcessClientStep[];
}

// ─── Иконка шеврона ───────────────────────────────────────────────────────────

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-zinc-400 transition-transform duration-300 ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Карточка deliverable ─────────────────────────────────────────────────────

function DeliverableCard({ text }: { text: string }) {
  return (
    <div className="rounded-[1.25rem] border border-zinc-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
        Что получаете
      </p>
      <p className="mt-2 text-base font-semibold text-zinc-900">{text}</p>
    </div>
  );
}

// ─── Мобилка: аккордеон ───────────────────────────────────────────────────────

function MobileAccordion({
  steps,
  openIndex,
  onToggle,
}: {
  steps: ProcessClientStep[];
  openIndex: number;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:hidden">
      {steps.map((step, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={step.title}
            className={`overflow-hidden rounded-[1.5rem] border transition-all duration-200 ${
              isOpen
                ? "border-violet-200 bg-gradient-to-br from-violet-50/80 to-blue-50/80 shadow-md"
                : "border-zinc-200 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => onToggle(index)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isOpen
                    ? "bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700"
                    : "bg-zinc-100 text-zinc-500"
                }`}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="flex-1 text-sm font-semibold text-zinc-950">
                {step.title}
              </span>
              <ChevronIcon isOpen={isOpen} />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-3 px-5 pb-5">
                  <p className="text-sm leading-7 text-zinc-600">{step.detail}</p>
                  <DeliverableCard text={step.deliverable} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Десктоп: табы ────────────────────────────────────────────────────────────

function DesktopTabs({
  steps,
  activeIndex,
  onSelect,
}: {
  steps: ProcessClientStep[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const activeStep = steps[activeIndex];

  return (
    <div className="hidden gap-6 sm:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      {/* Список шагов */}
      <div className="flex flex-col gap-2" role="tablist" aria-label="Этапы процесса">
        {steps.map((step, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={step.title}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(index)}
              className={`w-full text-left transition ${
                isActive
                  ? "rounded-[1.5rem] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
                  : "rounded-[1.5rem] border border-zinc-200 bg-white hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4 p-5 sm:p-6">
                <div
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    isActive
                      ? "bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                  aria-hidden="true"
                >
                  {index + 1}
                </div>
                <div>
                  <p className="text-base font-semibold tracking-tight text-zinc-950">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">{step.short}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Детальная панель */}
      <div
        role="tabpanel"
        className="relative overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-blue-500/8 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-4">
          <span className="inline-flex w-fit items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            Что видит клиент
          </span>
          <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            {activeStep.title}
          </h3>
          <p className="text-sm leading-7 text-zinc-600 sm:text-base">
            {activeStep.detail}
          </p>
          <DeliverableCard text={activeStep.deliverable} />
        </div>
      </div>
    </div>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function ProcessClientView({ steps }: ProcessClientViewProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleToggle = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? -1 : index));
  }, []);

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <>
      <MobileAccordion
        steps={steps}
        openIndex={activeIndex}
        onToggle={handleToggle}
      />
      <DesktopTabs
        steps={steps}
        activeIndex={activeIndex < 0 ? 0 : activeIndex}
        onSelect={handleSelect}
      />
    </>
  );
}
