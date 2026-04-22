import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface ServiceItem {
  title: string;
  description: string;
  image: string;
}

interface ServicesProps {
  title: string;
  subtitle?: string;
  items: ServiceItem[];
}

// ─── Иконки ──────────────────────────────────────────────────────────────────

function IconLanding() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function IconCorporate() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function IconSeo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35M11 8v3l2 2" />
    </svg>
  );
}

// ─── Мета-данные карточек ─────────────────────────────────────────────────────

const SERVICE_META = [
  {
    colorClasses: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50",
    iconColorClass: "text-blue-600",
    bullets: ["Чёткая структура", "Фокус на конверсию", "Быстрый запуск"],
    Icon: IconLanding,
  },
  {
    colorClasses: "border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50",
    iconColorClass: "text-violet-600",
    bullets: ["Многостраничная логика", "Единая дизайн-система", "Сильная презентация"],
    Icon: IconCorporate,
  },
  {
    colorClasses: "border-cyan-200 bg-gradient-to-br from-cyan-50 to-sky-50",
    iconColorClass: "text-cyan-600",
    bullets: ["Meta и Open Graph", "Sitemap и индексация", "Подготовка к росту"],
    Icon: IconSeo,
  },
] as const;

// ─── Под-компонент карточки ───────────────────────────────────────────────────

function ServiceCard({
  item,
  index,
}: {
  item: ServiceItem;
  index: number;
}) {
  const meta = SERVICE_META[index % SERVICE_META.length];
  const { Icon } = meta;
  const delayClass = index === 0 ? "delay-1" : index === 1 ? "delay-2" : "delay-3";

  return (
    <li
      className={`reveal-up hover-lift flex shrink-0 flex-col rounded-[1.75rem] border p-6 shadow-sm transition
        ${meta.colorClasses} ${delayClass}
        /* мобилка: фиксированная ширина для snap-scroll */
        w-[80vw] max-w-[300px]
        /* десктоп: авто */
        sm:w-auto sm:max-w-none sm:p-7`}
    >
      {/* Иконка */}
      <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ${meta.iconColorClass}`}>
        <Icon />
      </div>

      {/* Номер */}
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
        Услуга {String(index + 1).padStart(2, "0")}
      </p>

      <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
        {item.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-zinc-600">{item.description}</p>

      <ul className="mt-5 flex flex-col gap-2" role="list">
        {meta.bullets.map((bullet) => (
          <li key={bullet} className="flex items-center gap-2.5 text-sm text-zinc-700">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full opacity-70 ${meta.iconColorClass}`}
              aria-hidden="true"
            />
            {bullet}
          </li>
        ))}
      </ul>
    </li>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function Services({ title, subtitle, items }: ServicesProps) {
  return (
    <Section>
      <div className="flex flex-col gap-10 sm:gap-14">
        <SectionTitle title={title} subtitle={subtitle} />

        {/* Мобилка: горизонтальный snap-scroll */}
        <div className="-mx-4 overflow-x-auto px-4 sm:hidden">
          <ul
            className="flex gap-4 pb-3"
            role="list"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            {items.map((item, index) => (
              <div key={item.title} style={{ scrollSnapAlign: "start" }}>
                <ServiceCard item={item} index={index} />
              </div>
            ))}
            {/* Правый отступ */}
            <li className="w-4 shrink-0" aria-hidden="true" />
          </ul>
        </div>

        {/* Десктоп: обычная сетка */}
        <ul className="hidden gap-5 sm:grid sm:grid-cols-3" role="list">
          {items.map((item, index) => (
            <ServiceCard key={item.title} item={item} index={index} />
          ))}
        </ul>

      </div>
    </Section>
  );
}
