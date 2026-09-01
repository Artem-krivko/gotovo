import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function revealDelay(index: number): CSSProperties {
  return { "--reveal-delay": `${Math.min(index, 3) * 70}ms` } as CSSProperties;
}

export function EditorialHero({
  eyebrow,
  title,
  intro,
  primary = { label: "Обсудить проект", href: "/contacts" },
  secondary = { label: "AI-концепция", href: "/generator" },
  note,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  primary?: { label: string; href: string } | null;
  secondary?: { label: string; href: string } | null;
  note?: string;
}) {
  return (
    <section className="editorial-hero border-b border-ink/20 px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 lg:col-span-8" data-reveal>
          <p className="section-index flex items-center gap-3 text-ink/55">
            <span className="h-2.5 w-2.5 bg-signal" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-8 max-w-[1000px] break-words text-[clamp(3.25rem,6.4vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-ink">
            {title}
          </h1>
        </div>
        <aside className="flex min-w-0 flex-col justify-end border-t border-ink/20 pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0" data-reveal>
          <div className="max-w-md text-lg leading-7 text-ink/75 sm:text-xl sm:leading-8">{intro}</div>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              {primary && <Link href={primary.href} className="editorial-button editorial-button--dark">{primary.label} <Arrow /></Link>}
              {secondary && <Link href={secondary.href} className="editorial-button editorial-button--line">{secondary.label} <Arrow diagonal /></Link>}
            </div>
          )}
          {note && <p className="mt-5 text-xs leading-5 text-ink/50">{note}</p>}
        </aside>
      </div>
    </section>
  );
}

export function EditorialVisual({
  src,
  alt,
  label,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  label: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <figure className="editorial-visual mx-auto max-w-[1440px] overflow-hidden" data-reveal="image">
        <div className="relative aspect-[16/9] overflow-hidden bg-ink/10">
          <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 1536px) 100vw, 1440px" className="object-cover" />
        </div>
        <figcaption className="grid gap-3 border-b border-ink/25 py-4 text-sm sm:grid-cols-12 sm:items-start">
          <p className="section-index text-ink/45 sm:col-span-3">{label}</p>
          <p className="max-w-2xl leading-6 text-ink/62 sm:col-span-7">{caption}</p>
        </figcaption>
      </figure>
    </section>
  );
}

export function EditorialSectionHeader({
  index,
  label,
  title,
  intro,
  light = false,
}: {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`grid gap-7 border-b pb-8 lg:grid-cols-12 ${light ? "border-paper/20" : "border-ink/20"}`} data-reveal>
      <p className={`section-index lg:col-span-3 ${light ? "text-paper/50" : "text-ink/55"}`}>{index} / {label}</p>
      <div className="lg:col-span-9 lg:flex lg:items-end lg:justify-between lg:gap-10">
        <h2 className="max-w-4xl text-[clamp(2.35rem,4.8vw,5rem)] font-medium leading-[0.98] tracking-[-0.055em]">{title}</h2>
        {intro && <div className={`mt-5 max-w-md text-sm leading-6 lg:mt-0 ${light ? "text-paper/62" : "text-ink/62"}`}>{intro}</div>}
      </div>
    </div>
  );
}

export function EditorialMetrics({ items, light = false }: { items: { value: string; label: string }[]; light?: boolean }) {
  const columns = items.length >= 4 ? "sm:grid-cols-4" : items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`grid border-y ${columns} ${light ? "border-paper/20" : "border-ink/20"}`}>
      {items.map((item, index) => (
        <div key={`${item.value}-${item.label}`} className={`border-b p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:p-7 ${light ? "border-paper/20" : "border-ink/20"}`} data-reveal style={revealDelay(index)}>
          <p className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{item.value}</p>
          <p className={`mt-2 text-xs leading-5 ${light ? "text-paper/55" : "text-ink/55"}`}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export function EditorialFaq({ items, startIndex = 1 }: { items: { question: string; answer: string }[]; startIndex?: number }) {
  return (
    <div className="border-t border-ink">
      {items.map((item, index) => (
        <details key={item.question} className="group border-b border-ink/25" data-reveal style={revealDelay(index)}>
          <summary className="flex min-h-20 cursor-pointer list-none items-center gap-4 py-5 text-left focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-cobalt">
            <span className="w-8 shrink-0 text-xs text-ink/45">{String(index + startIndex).padStart(2, "0")}</span>
            <span className="flex-1 text-lg font-semibold tracking-[-0.02em] sm:text-xl">{item.question}</span>
            <span className="text-2xl font-light transition-transform group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="max-w-3xl pb-7 pl-12 pr-10 text-sm leading-7 text-ink/65 sm:text-base">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function EditorialCta({
  eyebrow = "Начать проект",
  title = "Есть задача? Давайте сделаем хорошо.",
  text = "Расскажите о бизнесе и результате, который хотите получить. Ответим в течение рабочего дня.",
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-signal px-4 py-16 text-ink sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12" data-reveal>
        <p className="section-index lg:col-span-3">{eyebrow}</p>
        <div className="lg:col-span-9">
          <h2 className="max-w-4xl text-[clamp(2.7rem,5.8vw,6rem)] font-semibold leading-[0.9] tracking-[-0.065em]">{title}</h2>
          <div className="mt-10 flex flex-col gap-6 border-t border-ink/30 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-base leading-7 text-ink/70">{text}</p>
            <Link href="/contacts" className="editorial-button editorial-button--dark shrink-0">Обсудить проект <Arrow diagonal /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EditorialBreadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="border-b border-ink/15 bg-paper px-4 py-3 sm:px-6">
      <ol className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.13em] text-ink/48">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? <Link href={item.href} className="transition hover:text-cobalt">{item.label}</Link> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
