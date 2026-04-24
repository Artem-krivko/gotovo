"use client";

import { useState, useCallback } from "react";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  title: string;
  subtitle?: string;
  items: FaqItem[];
}

// ─── Иконка шеврона ───────────────────────────────────────────────────────────

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      aria-hidden="true"
      className={`shrink-0 text-[#6B6B80] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Одна строка ─────────────────────────────────────────────────────────────

function FaqRow({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: (i: number) => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
        isOpen
          ? "border-violet-500/30 bg-[#13131A]"
          : "border-white/[0.06] bg-[#13131A] hover:border-white/10"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-6"
      >
        <span className="text-base font-medium text-white sm:text-lg">
          {item.question}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      <div className={`grid transition-all duration-300 ease-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-7 text-[#A1A1B5] sm:px-6 sm:text-base">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function Faq({ title, subtitle, items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }, []);

  return (
    <>
    <div className="relative px-6" aria-hidden="true">
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
    <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px]" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.07), transparent 65%)", filter: "blur(60px)" }} />
      <div className="mx-auto max-w-3xl">

        <div className="reveal-up text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-3 text-[#A1A1B5]">{subtitle}</p>}
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {items.map((item, index) => (
            <FaqRow
              key={item.question}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={handleToggle}
            />
          ))}
        </div>

      </div>
    </section>
    </>
  );
}
