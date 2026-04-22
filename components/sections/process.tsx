import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";
import { ProcessAccordion } from "@/components/sections/process-accordion";
import type { ProcessStep } from "@/content/process";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface ProcessProps {
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
}

// ─── Под-компоненты (только десктоп) ─────────────────────────────────────────

function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-700">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-500" aria-hidden="true" />
      AI stage
    </span>
  );
}

function StepNumber({ number }: { number: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 shadow-sm"
      aria-hidden="true"
    >
      {number}
    </div>
  );
}

function StepHint({ text, isRight }: { text: string; isRight: boolean }) {
  return (
    <div
      className={`flex items-center ${
        isRight ? "justify-end pr-10" : "justify-start pl-10"
      }`}
    >
      <p className="reveal-up delay-2 max-w-xs rounded-[1.5rem] border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm leading-6 text-zinc-500">
        {text}
      </p>
    </div>
  );
}

function DesktopStepCard({
  step,
  index,
}: {
  step: ProcessStep;
  index: number;
}) {
  const isRight = index % 2 !== 0;

  return (
    <li className="relative grid gap-4 sm:grid-cols-2 sm:gap-8">
      {/* Карточка */}
      <div className={`${isRight ? "sm:order-2" : ""}`}>
        <div
          className={`reveal-up hover-lift rounded-[1.75rem] border p-5 shadow-sm transition sm:p-6 ${
            step.isAiStep
              ? "border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50"
              : "border-zinc-200 bg-white"
          }`}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              Шаг {String(index + 1).padStart(2, "0")}
            </span>
            {step.isAiStep && <AiBadge />}
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
            {step.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
            {step.description}
          </p>
        </div>
      </div>

      {/* Подсказка */}
      <div className={isRight ? "sm:order-1" : ""}>
        <StepHint text={step.hint} isRight={isRight} />
      </div>

      {/* Номер на линии */}
      <StepNumber number={index + 1} />
    </li>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function Process({ title, subtitle, steps }: ProcessProps) {
  return (
    <Section id="process">
      <div className="flex flex-col gap-10 sm:gap-14">
        <SectionTitle title={title} subtitle={subtitle} />

        {/* ── Мобилка: аккордеон (скрыт на sm+) ──────────────────────────── */}
        <div className="sm:hidden">
          <ProcessAccordion steps={steps} />
        </div>

        {/* ── Десктоп: зигзаг-таймлайн (скрыт на мобилке) ────────────────── */}
        <div className="relative hidden sm:block">
          {/* Вертикальная линия */}
          <div
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-zinc-200"
            aria-hidden="true"
          />

          <ol className="flex flex-col gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <DesktopStepCard key={step.title} step={step} index={index} />
            ))}
          </ol>
        </div>

      </div>
    </Section>
  );
}
