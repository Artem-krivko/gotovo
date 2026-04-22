import Image from "next/image";
import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";

type ServicesComparisonProps = {
  title: string;
  subtitle?: string;
  builderImage: string;
  customImage: string;
};

export function ServicesComparison({
  title,
  subtitle,
  builderImage,
  customImage,
}: ServicesComparisonProps) {
  return (
    <Section className="relative">
      <div className="flex flex-col gap-10 sm:gap-14">
        <SectionTitle title={title} subtitle={subtitle} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="reveal-up group overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.10)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50">
              <Image
                src={builderImage}
                alt="Сайт на конструкторе"
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                Конструктор
              </div>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">
                Шаблонный подход
              </h3>

              <ul className="mt-6 space-y-3">
                {[
                  "Ограничения по структуре и дизайну",
                  "Сложнее масштабировать под рост бизнеса",
                  "Часто похож на другие сайты",
                  "Компромиссы по скорости, логике и SEO",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-7 text-zinc-600 sm:text-base"
                  >
                    <span className="mt-2 h-2 w-2 rounded-full bg-zinc-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal-up delay-2 group overflow-hidden rounded-[1.75rem] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.10)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-white">
              <Image
                src={customImage}
                alt="Кастомная разработка сайта"
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-violet-700">
                Кастомная разработка
              </div>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">
                Сайт под задачу бизнеса
              </h3>

              <ul className="mt-6 space-y-3">
                {[
                  "Структура строится под ваш сценарий продаж",
                  "Дизайн и логика не ограничены шаблоном",
                  "Проще масштабировать и развивать дальше",
                  "Есть контроль SEO, скорости и пользовательского пути",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-7 text-zinc-700 sm:text-base"
                  >
                    <span className="mt-2 h-2 w-2 rounded-full bg-violet-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}