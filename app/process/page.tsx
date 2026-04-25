import type { Metadata } from "next";
import Link from "next/link";
import { Process } from "@/components/sections/process";
import { ProcessClientView } from "@/components/sections/process-client-view";
import { Cta } from "@/components/sections/cta";
import { PROCESS_STEPS, PROCESS_CLIENT_STEPS } from "@/content/process";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "Как проходит разработка — 7 этапов от идеи до запуска | gotovo",
  description: "Понятный процесс: генератор показывает дизайн до оплаты → бриф → прототип → разработка → запуск. 7–14 рабочих дней под ключ.",
  alternates: { canonical: `${SITE_URL}/process` },
  openGraph: { url: `${SITE_URL}/process`, images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Как заказать разработку сайта в gotovo",
  description: "7 шагов от бесплатного генератора до запуска сайта",
  totalTime: "P14D",
  step: PROCESS_STEPS.map((step, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: step.title,
    text: step.description,
  })),
};

// ─── Иконки гарантий ────────────────────────────────────────────────────────

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 12C1 12 5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 12a9 9 0 0 1-15 6.7L3 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 8h4V4M7 16H3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconRocket() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C12 2 7 6 7 13l5 5c7 0 10-5 10-5L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 13c0 0-4 1-5 5 4-1 5-5 5-5zM15 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const GUARANTEES = [
  { icon: <IconEye />, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", title: "Видите до оплаты", description: "Генератор показывает дизайн бесплатно. Платите только если понравилось." },
  { icon: <IconCalendar />, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", title: "Фиксированные сроки", description: "Лендинг 7–10 дней, бизнес-сайт 10–14. Прописываем до старта." },
  { icon: <IconRefresh />, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/20", title: "2–3 круга правок", description: "Включено в стоимость. Доводим до финала без доплат." },
  { icon: <IconRocket />, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", title: "Запуск под ключ", description: "Домен, аналитика, формы — всё настроено и проверено." },
] as const;

export default function ProcessPage() {
  return (
    <main>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-12 sm:px-6 sm:pb-28 sm:pt-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 70% 50% at 70% -5%, rgba(124,58,237,0.22), transparent 60%)" }} />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
              Процесс работы
            </span>

            <h1 className="reveal-up delay-1 mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Понятно что происходит{" "}
              <span className="gradient-reveal">
                на каждом шаге
              </span>
            </h1>

            <p className="reveal-up delay-2 mt-6 max-w-xl text-lg leading-7 text-[#A1A1B5]">
              Начинается с генератора — видите дизайн до оплаты.
              Дальше 7 чётких этапов, фиксированные сроки и запуск под ключ.
            </p>

            <div className="reveal-up delay-3 mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
                <span aria-hidden="true">✦</span> Попробовать генератор
              </Link>
              <Link href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
                Посмотреть цены
              </Link>
            </div>

            {/* Метрики */}
            <div className="reveal-up delay-4 mt-12 grid w-full max-w-lg grid-cols-3 gap-3">
              {[
                { value: "30 сек", label: "до первого превью", border: "border-violet-500/40", glow: "shadow-lg shadow-violet-500/20" },
                { value: "7 шагов", label: "от идеи до запуска", border: "border-blue-500/40", glow: "shadow-lg shadow-blue-500/20" },
                { value: "0 ₽", label: "до того как понравится", border: "border-emerald-500/40", glow: "shadow-lg shadow-emerald-500/20" },
              ].map((m) => (
                <div key={m.label} className={`rounded-2xl border ${m.border} bg-[#13131A] p-4 text-center shadow-lg ${m.glow}`}>
                  <p className="text-base font-bold text-white sm:text-lg">{m.value}</p>
                  <p className="mt-1 text-xs leading-4 text-[#6B6B80]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Таймлайн ────────────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
      </div>
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute -top-20 -right-20 h-[400px] w-[400px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent 65%)", filter: "blur(60px)" }} />
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Этапы</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Все этапы работы
            </h2>
            <p className="mt-3 text-[#A1A1B5]">От первого превью в генераторе до запуска — 7 шагов</p>
          </div>
          <div className="mt-10">
            <Process title="" steps={PROCESS_STEPS} />
          </div>
        </div>
      </section>

      {/* ── Что получаете ───────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/15 to-transparent" />
      </div>
      <section className="relative bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute top-1/2 -left-20 h-[350px] w-[350px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(217,70,239,0.07), transparent 65%)", filter: "blur(60px)" }} />
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Результат</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Что вы держите в руках
            </h2>
            <p className="mt-3 text-[#A1A1B5]">Не абстрактные фазы — конкретные результаты на каждом этапе</p>
          </div>
          <div className="mt-10 max-w-5xl mx-auto">
            <ProcessClientView steps={PROCESS_CLIENT_STEPS} />
          </div>
        </div>
      </section>

      {/* ── Гарантии ────────────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
      </div>
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute -bottom-10 right-1/4 h-[350px] w-[350px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08), transparent 65%)", filter: "blur(60px)" }} />
        <div className="mx-auto max-w-4xl">
          <div className="reveal-up rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 p-8 sm:p-12">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Наши обязательства</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Что неизменно в каждом проекте
              </h2>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {GUARANTEES.map((g) => (
                <li key={g.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.07]">
                  <div className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${g.bg} ${g.color}`}>
                    {g.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{g.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#A1A1B5]">{g.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Cta
        title="Готовы увидеть свой сайт?"
        subtitle="Начните с генератора — бесплатно и 30 секунд. Или оставьте заявку."
        button="Сгенерировать дизайн"
      />
    </main>
  );
}
