import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";

type AudienceItem = {
  title: string;
  description: string;
};

type ServicesAudienceProps = {
  title: string;
  subtitle?: string;
  items: AudienceItem[];
};

const accents = [
  "from-violet-100 via-white to-blue-50",
  "from-blue-100 via-white to-cyan-50",
  "from-fuchsia-100 via-white to-violet-50",
  "from-sky-100 via-white to-indigo-50",
];

const labels = [
  "Частый сценарий",
  "Подходит экспертам",
  "Для роста бизнеса",
  "Для системной подачи",
];

const microPoints = [
  ["Нужен быстрый запуск", "Важно доверие", "Нужны заявки"],
  ["Нужен личный бренд", "Нужна упаковка услуг", "Нужен сильный оффер"],
  ["Нужна понятная структура", "Нужна масштабируемость", "Нужен рабочий сайт"],
  ["Нужно презентовать услуги", "Нужен профессиональный вид", "Нужна ясная логика"],
];

export function ServicesAudience({
  title,
  subtitle,
  items,
}: ServicesAudienceProps) {
  return (
    <Section className="relative">
      <div className="flex flex-col gap-10 sm:gap-14">
        <SectionTitle title={title} subtitle={subtitle} />

        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={item.title}
              className={`reveal-up group relative overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(0,0,0,0.10)] ${
                index === 0
                  ? "delay-1"
                  : index === 1
                    ? "delay-2"
                    : index === 2
                      ? "delay-3"
                      : "delay-4"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <div
                  className={'absolute inset-0 bg-gradient-to-br ${accents[index % accents.length]} opacity-80 blur-2xl'}
                />
              </div>

              <div className="relative p-6 sm:p-8">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    {labels[index % labels.length]}
                  </div>

                  <div
                    className={'rounded-2xl border border-zinc-200 bg-gradient-to-br ${accents[index % accents.length]} px-3 py-2 shadow-sm'}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
                      <span className="h-2.5 w-16 rounded-full bg-white/75" />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
                  {item.description}
                </p>

                <div className="mt-6 grid gap-2">
                  {microPoints[index % microPoints.length].map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                    >
                      <span className="h-2 w-2 rounded-full bg-zinc-900" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}