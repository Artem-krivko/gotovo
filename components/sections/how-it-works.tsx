import { Section } from "@/components/shared/section";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface Step {
  num: string;
  title: string;
  description: string;
  color: string;
  dot: string;
}

// ─── Данные — рядом с компонентом, не в JSX ──────────────────────────────────

const STEPS: Step[] = [
  {
    num: "01",
    title: "Опишите бизнес",
    description:
      "Напишите пару предложений о компании, стиле и пожеланиях. Можно прикрепить референс.",
    color: "border-violet-200 bg-violet-50/60",
    dot: "bg-violet-500",
  },
  {
    num: "02",
    title: "ИИ создаёт дизайн",
    description:
      "За 30 секунд генератор собирает живой сайт: структура, тексты, цвета — всё под ваш бизнес.",
    color: "border-fuchsia-200 bg-fuchsia-50/60",
    dot: "bg-fuchsia-500",
  },
  {
    num: "03",
    title: "Нравится — заказываете",
    description:
      "Видите результат до оплаты. Если подходит — оставляете заявку и делаем финальный сайт.",
    color: "border-blue-200 bg-blue-50/60",
    dot: "bg-blue-500",
  },
];

// ─── Под-компонент карточки ───────────────────────────────────────────────────

function StepCard({ step, index }: { step: Step; index: number }) {
  const delayClass = index === 0 ? "delay-1" : index === 1 ? "delay-2" : "delay-3";

  return (
    <li
      className={`reveal-up rounded-[1.75rem] border p-6 shadow-sm transition
        hover:-translate-y-1 hover:shadow-lg
        ${step.color} ${delayClass}`}
    >
      {/* Мобилка: номер и точка inline с заголовком */}
      <div className="mb-3 flex items-center gap-3 sm:mb-4 sm:block">
        <span className="text-3xl font-bold tracking-tight text-zinc-200 sm:text-4xl">
          {step.num}
        </span>
        {/* Точка-разделитель — только на мобилке между номером и заголовком */}
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full sm:hidden ${step.dot}`} aria-hidden="true" />
        <h3 className="text-base font-semibold text-zinc-950 sm:hidden">{step.title}</h3>
      </div>

      {/* Точка под номером — только десктоп */}
      <span className={`mb-4 hidden h-2 w-2 rounded-full sm:block ${step.dot}`} aria-hidden="true" />

      {/* Заголовок — только десктоп (на мобилке он уже выше) */}
      <h3 className="hidden text-lg font-semibold text-zinc-950 sm:block">{step.title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-600">{step.description}</p>
    </li>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function HowItWorks() {
  return (
    <Section>
      <div className="flex flex-col gap-10 sm:gap-14">

        {/* Заголовок */}
        <div className="reveal-up mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            Как это работает
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Три шага до готового сайта
          </h2>
        </div>

        {/* Карточки */}
        <ol className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {STEPS.map((step, index) => (
            <StepCard key={step.num} step={step} index={index} />
          ))}
        </ol>

      </div>
    </Section>
  );
}
