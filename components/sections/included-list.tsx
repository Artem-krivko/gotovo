import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";

type IncludedListProps = {
  title: string;
  subtitle?: string;
  items: string[];
};

export function IncludedList({
  title,
  subtitle,
  items,
}: IncludedListProps) {
  return (
    <Section>
      <div className="flex flex-col gap-10 sm:gap-14">
        <SectionTitle title={title} subtitle={subtitle} />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="reveal-up relative overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-violet-500/8 blur-3xl" />
              <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-blue-500/8 blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                Включено в работу
              </div>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                Не только дизайн и код,
                <br className="hidden sm:block" /> а полный путь до запуска
              </h3>

              <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
                Каждый проект собирается вокруг задачи бизнеса: от структуры и
                прототипа до адаптива, форм, базового SEO и публикации.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item, index) => (
              <div
                key={item}
                className={`reveal-up hover-lift rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-700 ${
                  index < 2 ? "delay-1" : index < 4 ? "delay-2" : "delay-3"
                }`}
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