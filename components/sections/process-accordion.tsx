"use client";

import { useState, useCallback } from "react";
import type { ProcessStep } from "@/content/process";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface ProcessAccordionProps {
  steps: ProcessStep[];
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

// ─── Одна строка аккордеона ───────────────────────────────────────────────────

function AccordionItem({
  step,
  index,
  isOpen,
  onToggle,
}: {
  step: ProcessStep;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}) {
  return (
    <li
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
        {/* Номер */}
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
            isOpen
              ? "bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700"
              : "bg-zinc-100 text-zinc-600"
          }`}
          aria-hidden="true"
        >
          {index + 1}
        </span>

        {/* Название */}
        <span className="flex-1 text-base font-semibold tracking-tight text-zinc-950">
          {step.title}
        </span>

        {/* AI бейдж — используем стандартный sm брейкпоинт, xs не существует в Tailwind */}
        {step.isAiStep && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-violet-200 bg-white/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-violet-600">
            AI
          </span>
        )}

        <ChevronIcon isOpen={isOpen} />
      </button>

      {/* Тело — grid-rows trick для плавной анимации */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5">
            <p className="text-sm leading-7 text-zinc-600">{step.description}</p>
            <p className="mt-3 text-xs leading-5 italic text-zinc-400">{step.hint}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── Прогресс-индикатор ───────────────────────────────────────────────────────

function ProgressBar({
  openIndex,
  total,
}: {
  openIndex: number;
  total: number;
}) {
  // Когда ничего не открыто (openIndex === -1) — бар пустой
  const progressWidth = openIndex < 0 ? 0 : ((openIndex + 1) / total) * 100;
  const labelText =
    openIndex < 0 ? `0 / ${total}` : `${openIndex + 1} / ${total}`;

  return (
    <div className="flex items-center gap-3 px-1 pb-4">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300"
          style={{ width: `${progressWidth}%` }}
          role="progressbar"
          aria-valuenow={openIndex < 0 ? 0 : openIndex + 1}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Шаг ${openIndex < 0 ? 0 : openIndex + 1} из ${total}`}
        />
      </div>
      <span className="shrink-0 text-xs font-medium tabular-nums text-zinc-400">
        {labelText}
      </span>
    </div>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function ProcessAccordion({ steps }: ProcessAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  // useCallback — колбэк не пересоздаётся на каждый рендер
  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }, []);

  return (
    <div>
      <ProgressBar openIndex={openIndex} total={steps.length} />

      <ol className="flex flex-col gap-2">
        {steps.map((step, index) => (
          <AccordionItem
            key={step.title}
            step={step}
            index={index}
            isOpen={openIndex === index}
            onToggle={handleToggle}
          />
        ))}
      </ol>
    </div>
  );
}
