import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";

type TrustItem = {
  title: string;
  description: string;
};

type TrustProps = {
  title: string;
  subtitle?: string;
  items: TrustItem[];
};

export function Trust({ title, subtitle, items }: TrustProps) {
  const aiItem = items[0];
  const humanItem = items[1];
  const supportItems = items.slice(2);

  return (
    <Section>
      <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white px-5 py-10 shadow-sm sm:px-8 sm:py-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/12 blur-3xl animate-pulse" />
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-10 sm:gap-12">
          <div className="reveal-up">
            <SectionTitle
              title={title}
              subtitle={
                subtitle ??
                "AI ускоряет создание структуры и первого прототипа, но контроль качества, логика и финальные решения остаются за человеком."
              }
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="reveal-up delay-1 group relative overflow-hidden rounded-[1.75rem] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10 blur-2xl" />
              </div>

              <div className="relative">
                <div className="mb-4 inline-flex items-center rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-700">
                  AI ускоряет
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                  Быстрее от идеи до первого сильного прототипа
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
                  {aiItem?.description ??
                    "Использую AI для генерации структуры, ускорения прототипирования и сборки первых версий без потери качества."}
                </p>

                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-sm text-zinc-700">
                    <span className="h-2 w-2 rounded-full bg-violet-600" />
                    <span>Быстрее собирается структура сайта</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-700">
                    <span className="h-2 w-2 rounded-full bg-violet-600" />
                    <span>Первый прототип появляется заметно раньше</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-700">
                    <span className="h-2 w-2 rounded-full bg-violet-600" />
                    <span>Типовые этапы не тормозят проект</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="reveal-up delay-2 group relative overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-300/10 to-zinc-100/10 blur-2xl" />
              </div>

              <div className="relative">
                <div className="mb-4 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                  Человек контролирует
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                  Логика, качество и бизнес-задача остаются под ручным контролем
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
                  {humanItem?.description ??
                    "Каждый этап проходит ручную проверку: от структуры и UX до текстов, логики, адаптива и финального запуска."}
                </p>

                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-sm text-zinc-700">
                    <span className="h-2 w-2 rounded-full bg-zinc-900" />
                    <span>Проверка логики и пользовательского пути</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-700">
                    <span className="h-2 w-2 rounded-full bg-zinc-900" />
                    <span>Контроль качества на каждом шаге</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-zinc-700">
                    <span className="h-2 w-2 rounded-full bg-zinc-900" />
                    <span>Решения принимаются под задачу бизнеса</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="reveal-up delay-3 grid gap-3 sm:grid-cols-3">
            {[
              supportItems[0]?.title ?? "Без конструкторов",
              supportItems[1]?.title ?? "Понятный процесс",
              "Фокус на результате",
            ].map((item) => (
              <div
                key={item}
                className="hover-lift rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-center text-sm font-medium text-zinc-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}