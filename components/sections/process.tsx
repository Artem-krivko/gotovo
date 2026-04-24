// Server Component — директива не нужна
import type { ProcessStep } from "@/content/process";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface ProcessProps {
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
}

// ─── Иконка терминала ─────────────────────────────────────────────────────────

function TerminalPrompt() {
  return (
    <span className="select-none font-mono text-violet-500" aria-hidden="true">
      ►
    </span>
  );
}

function AiBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-violet-400">
      <span className="h-1 w-1 rounded-full bg-violet-400" aria-hidden="true" />
      AI
    </span>
  );
}

function StatusDot({ isAi }: { isAi: boolean }) {
  return (
    <span
      className={`mt-[3px] h-2 w-2 shrink-0 rounded-full ${
        isAi ? "bg-violet-500 shadow-[0_0_6px_rgba(124,58,237,0.8)]" : "bg-[#3B82F6]/60"
      }`}
      aria-hidden="true"
    />
  );
}

// ─── Строка шага (десктоп) ────────────────────────────────────────────────────

function StepRow({
  step,
  index,
}: {
  step: ProcessStep;
  index: number;
}) {
  const numStr = String(index + 1).padStart(2, "0");

  return (
    <li className="group relative">
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-[2px] origin-center scale-y-0 rounded-full bg-gradient-to-b from-violet-500/0 via-violet-500 to-violet-500/0 transition-transform duration-300 ease-out group-hover:scale-y-100"
        aria-hidden="true"
      />

      {/* Row background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, rgba(124,58,237,0.07) 0%, rgba(124,58,237,0.02) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-6 border-b border-white/[0.06] px-2 py-5 transition-colors duration-300 group-hover:border-violet-500/20 sm:gap-8 sm:px-4">

        {/* Левая колонка: номер — сдвигается вправо при hover */}
        <div className="flex w-8 shrink-0 items-start justify-start pt-0.5 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:w-12">
          <span
            className="select-none font-mono text-2xl font-black leading-none text-white/[0.06] transition-all duration-300 group-hover:text-white/[0.18] sm:text-4xl"
            aria-hidden="true"
          >
            {numStr}
          </span>
        </div>

        {/* Центр: prompt + контент */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Строка-заголовок */}
          <div className="flex flex-wrap items-center gap-2.5">
            <TerminalPrompt />
            <h3 className="text-sm font-semibold text-white transition-colors duration-300 group-hover:text-violet-100 sm:text-base">
              {step.title}
            </h3>
            {step.isAiStep && <AiBadge />}
          </div>

          {/* Описание */}
          <p className="pl-4 text-sm leading-6 text-[#6B6B80] transition-colors duration-300 group-hover:text-[#A1A1B5] sm:pl-5">
            {step.description}
          </p>

          {/* Hint — светлеет при hover */}
          <p className="pl-4 pt-0.5 font-mono text-[11px] text-[#A1A1B5]/40 transition-colors duration-300 group-hover:text-violet-400/60 sm:pl-5">
            // {step.hint}
          </p>
        </div>

        {/* Правая колонка: статус-dot */}
        <div className="flex shrink-0 items-start pt-1">
          <StatusDot isAi={step.isAiStep} />
        </div>
      </div>
    </li>
  );
}

// ─── Мобильная карточка (аккордеон-style, без JS) ─────────────────────────────

function MobileStepCard({
  step,
  index,
}: {
  step: ProcessStep;
  index: number;
}) {
  const numStr = String(index + 1).padStart(2, "0");

  return (
    <li className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#13131A] p-4">
      {/* Декоративный номер */}
      <span
        className="pointer-events-none absolute right-3 top-2 select-none font-mono text-5xl font-black leading-none text-white/[0.04]"
        aria-hidden="true"
      >
        {numStr}
      </span>

      <div className="relative flex flex-col gap-2">
        {/* Заголовок */}
        <div className="flex items-center gap-2">
          <StatusDot isAi={step.isAiStep} />
          <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[#6B6B80]">
            шаг {numStr}
          </span>
          {step.isAiStep && <AiBadge />}
        </div>

        <h3 className="text-base font-semibold text-white">{step.title}</h3>
        <p className="text-sm leading-6 text-[#6B6B80]">{step.description}</p>
        <p className="font-mono text-[11px] text-[#A1A1B5]/40">// {step.hint}</p>
      </div>
    </li>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function Process({ title, subtitle, steps }: ProcessProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Заголовок блока (если передан) */}
      {title && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">
            {title}
          </p>
          {subtitle && (
            <p className="mt-2 text-[#A1A1B5]">{subtitle}</p>
          )}
        </div>
      )}

      {/* ── Мобилка: вертикальный список карточек (hidden sm+) ────────────── */}
      <ol className="flex flex-col gap-3 sm:hidden" aria-label="Этапы работы">
        {steps.map((step, index) => (
          <MobileStepCard key={step.title} step={step} index={index} />
        ))}
      </ol>

      {/* ── Десктоп: terminal log (hidden на мобилке) ─────────────────────── */}
      <div className="hidden sm:block">
        {/* Terminal header */}
        <div className="mb-0 flex items-center gap-2 rounded-t-xl border border-b-0 border-white/[0.06] bg-[#13131A] px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
          </div>
          <span className="ml-2 font-mono text-xs text-[#6B6B80]">
            gotovo — process.log
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
            <span className="font-mono text-[10px] text-green-400">running</span>
          </div>
        </div>

        {/* Terminal body */}
        <div className="rounded-b-xl border border-white/[0.06] bg-[#0D0D14]">
          <ol aria-label="Этапы работы">
            {steps.map((step, index) => (
              <StepRow key={step.title} step={step} index={index} />
            ))}
          </ol>

          {/* Terminal footer */}
          <div className="flex items-center gap-2 border-t border-white/[0.04] px-4 py-3">
            <TerminalPrompt />
            <span className="font-mono text-xs text-[#6B6B80]">
              {steps.length} steps completed
            </span>
            <span className="ml-auto font-mono text-[10px] text-[#3B82F6]">
              exit code 0 ✓
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
