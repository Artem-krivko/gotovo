"use client";

import { useState, useCallback } from "react";
import type { ProcessClientStep } from "@/content/process";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface ProcessClientViewProps {
  steps: ProcessClientStep[];
}

// ─── Иконки ──────────────────────────────────────────────────────────────────

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-[#6B6B80] transition-all duration-300 ${
        isOpen ? "rotate-180 text-violet-400" : "group-hover/row:text-[#A1A1B5]"
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

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 6h8M6 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Deliverable badge ────────────────────────────────────────────────────────

function DeliverableBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#6B6B80]">
        →
      </span>
      <span className="text-sm font-medium text-violet-300">{text}</span>
    </div>
  );
}

// ─── Строка аккордеона ────────────────────────────────────────────────────────

function AccordionRow({
  step,
  index,
  isOpen,
  onToggle,
}: {
  step: ProcessClientStep;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const numStr = String(index + 1).padStart(2, "0");

  return (
    <li className="group/row relative">
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 h-full w-[2px] rounded-full bg-gradient-to-b from-violet-500/0 via-violet-500 to-violet-500/0 transition-all duration-300 ${
          isOpen ? "opacity-100" : "scale-y-0 opacity-0 group-hover/row:scale-y-100 group-hover/row:opacity-60"
        }`}
        aria-hidden="true"
      />

      {/* Row bg */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 group-hover/row:opacity-100"
        }`}
        style={{
          background: isOpen
            ? "linear-gradient(90deg, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.03) 60%, transparent 100%)"
            : "linear-gradient(90deg, rgba(124,58,237,0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Кнопка-заголовок */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="relative flex w-full items-center gap-4 border-b border-white/[0.06] px-3 py-4 text-left transition-colors duration-300 sm:gap-6 sm:px-4 sm:py-5"
      >
        {/* Номер */}
        <span
          className={`w-7 shrink-0 select-none font-mono text-lg font-black leading-none transition-all duration-300 sm:w-10 sm:text-2xl ${
            isOpen
              ? "translate-x-0.5 text-white/25"
              : "text-white/[0.06] group-hover/row:translate-x-0.5 group-hover/row:text-white/[0.14]"
          }`}
          aria-hidden="true"
        >
          {numStr}
        </span>

        {/* Заголовок + short */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span
            className={`text-sm font-semibold transition-colors duration-300 sm:text-base ${
              isOpen
                ? "text-violet-100"
                : "text-white group-hover/row:text-violet-100"
            }`}
          >
            {step.title}
          </span>
          <span
            className={`text-xs transition-colors duration-300 sm:text-sm ${
              isOpen ? "text-[#A1A1B5]" : "text-[#6B6B80] group-hover/row:text-[#A1A1B5]"
            }`}
          >
            {step.short}
          </span>
        </div>

        {/* Deliverable — виден всегда, скрыт на мобилке когда открыт */}
        <span
          className={`hidden shrink-0 items-center gap-1.5 font-mono text-[11px] text-violet-400/70 transition-all duration-300 sm:flex ${
            isOpen ? "opacity-0" : "opacity-100 group-hover/row:text-violet-400"
          }`}
          aria-hidden="true"
        >
          <ArrowIcon />
          {step.deliverable}
        </span>

        <ChevronIcon isOpen={isOpen} />
      </button>

      {/* Раскрывающийся контент */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 px-3 pb-5 pt-3 sm:px-4 sm:pb-6">
            {/* Описание */}
            <p className="pl-[44px] text-sm leading-7 text-[#A1A1B5] sm:pl-[64px]">
              {step.detail}
            </p>

            {/* Hint в monospace */}
            <p className="pl-[44px] font-mono text-[11px] text-violet-400/50 sm:pl-[64px]">
              // итог: {step.deliverable.toLowerCase()}
            </p>

            {/* Deliverable badge */}
            <div className="pl-[44px] sm:pl-[64px]">
              <DeliverableBadge text={step.deliverable} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function ProcessClientView({ steps }: ProcessClientViewProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Terminal header */}
      <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-white/[0.06] bg-[#13131A] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
        </div>
        <span className="ml-2 font-mono text-xs text-[#6B6B80]">
          gotovo — client.results
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" aria-hidden="true" />
          <span className="font-mono text-[10px] text-violet-400">
            {steps.length} deliverables
          </span>
        </div>
      </div>

      {/* Accordion body */}
      <div className="rounded-b-xl border border-white/[0.06] bg-[#0D0D14]">
        <ol aria-label="Результаты на каждом этапе">
          {steps.map((step, index) => (
            <AccordionRow
              key={step.title}
              step={step}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </ol>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-white/[0.04] px-4 py-3">
          <span className="font-mono text-xs text-[#6B6B80]">
            ► client receives value at every step
          </span>
          <span className="ml-auto font-mono text-[10px] text-emerald-400/70">
            no surprises ✓
          </span>
        </div>
      </div>
    </div>
  );
}
