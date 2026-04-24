import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { PRICING_PLANS, VALUE_ITEMS, CHOOSE_ITEMS, PRICING_FAQ } from "@/content/pricing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "Стоимость разработки сайта: лендинг от €500 | gotovo",
  description: "Прозрачные пакеты: лендинг €500–700 за 7 дней, бизнес-сайт €800–1200 за 14 дней. Фиксированный объём, без скрытых доплат. Оплата 50/50.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: { url: `${SITE_URL}/pricing`, images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
};

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Пакеты разработки gotovo",
  itemListElement: PRICING_PLANS.map((plan, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "Service", name: plan.name, description: plan.description,
      offers: { "@type": "Offer", priceCurrency: "EUR", price: plan.price.replace(/[€–\s]/g, "").split("").find(Boolean) } },
  })),
};

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <main>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }} />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 60% 50% at 20% -5%, rgba(59,130,246,0.2), transparent 60%)" }} />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
            Прозрачные цены
          </span>

          <h1 className="reveal-up delay-1 mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Фиксированная стоимость —{" "}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              без сюрпризов
            </span>
          </h1>

          <p className="reveal-up delay-2 mt-6 mx-auto max-w-xl text-lg leading-7 text-[#A1A1B5]">
            Знаете цену до начала работы. Никаких расплывчатых оценок "посмотрим по ходу".
          </p>

          <div className="reveal-up delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/generator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
              <span aria-hidden="true">✦</span> Попробовать бесплатно
            </Link>
            <a href="#pricing-cards"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
              Смотреть пакеты
            </a>
          </div>

          {/* Метрики */}
          <div className="reveal-up delay-4 mt-12 grid max-w-lg mx-auto grid-cols-3 gap-3">
            {[
              { value: "€500", label: "от — лендинг" },
              { value: "7–14 дней", label: "типичный срок" },
              { value: "50/50", label: "схема оплаты" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-[#13131A] p-4 text-center">
                <p className="text-base font-bold text-white sm:text-xl">{m.value}</p>
                <p className="mt-1 text-xs leading-4 text-[#6B6B80]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Карточки пакетов ────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>
      <section id="pricing-cards" className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute -top-20 -left-20 h-[400px] w-[400px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.11), transparent 65%)", filter: "blur(60px)" }} />
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Пакеты</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Выберите формат
            </h2>
          </div>

          {/* Мобилка: snap-scroll */}
          <div className="-mx-4 mt-10 sm:hidden">
            <div className="niches-scroll overflow-x-auto px-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
              <div className="flex gap-4">
              {PRICING_PLANS.map((plan) => (
                <div key={plan.name} style={{ scrollSnapAlign: "start" }}
                  className={`flex w-[82vw] max-w-[320px] shrink-0 flex-col rounded-2xl border p-6 ${
                    plan.featured ? "border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-blue-500/5" : "border-white/10 bg-[#13131A]"
                  }`}>
                  <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${plan.featured ? "border border-violet-500/30 bg-violet-500/10 text-violet-400" : "border border-white/10 bg-white/5 text-[#6B6B80]"}`}>
                    {plan.badge}
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-white">{plan.name}</h2>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-[#6B6B80]">{plan.duration}</span>
                  </div>
                  <p className="mt-3 flex-1 text-sm text-[#A1A1B5]">{plan.description}</p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#A1A1B5]">
                        <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${plan.featured ? "bg-violet-600" : "bg-[#1C1C28]"}`}>
                          <CheckIcon />
                        </span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/generator"
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                      plan.featured ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}>
                    {plan.cta} <ArrowRight />
                  </Link>
                </div>
              ))}
              <div className="w-4 shrink-0" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Десктоп: grid */}
          <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-3">
            {PRICING_PLANS.map((plan, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : "delay-3";
              return (
                <div key={plan.name}
                  className={`reveal-up flex flex-col rounded-2xl border p-7 transition ${delay} ${
                    plan.featured
                      ? "border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-blue-500/5 sm:-translate-y-2"
                      : "border-white/10 bg-[#13131A] hover:border-white/20"
                  }`}>
                  <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                    plan.featured ? "border border-violet-500/30 bg-violet-500/10 text-violet-400" : "border border-white/10 bg-white/5 text-[#6B6B80]"
                  }`}>
                    {plan.badge}
                  </span>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">{plan.name}</h2>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-[#6B6B80]">{plan.duration}</span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#A1A1B5]">{plan.description}</p>
                  <ul className="mt-6 flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#A1A1B5]">
                        <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${plan.featured ? "bg-violet-600" : "bg-[#1C1C28]"}`}>
                          <CheckIcon />
                        </span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/generator"
                    className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                      plan.featured ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}>
                    {plan.cta} <ArrowRight />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Что входит ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Состав</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Что входит в стоимость</h2>
            <p className="mt-3 text-[#A1A1B5]">Платите не за экраны — за рабочий инструмент с логикой и запуском</p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {VALUE_ITEMS.map((item, i) => (
              <li key={item.title}
                className={`reveal-up flex gap-4 rounded-2xl border border-white/10 bg-[#13131A] p-5 transition hover:border-white/20 ${i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3"}`}>
                <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white ${item.accent}`} aria-hidden="true">
                  <CheckIcon />
                </span>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#6B6B80]">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Как выбрать ─────────────────────────────────────────────────────── */}
      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
      </div>
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute top-1/2 -right-20 h-[350px] w-[350px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.09), transparent 65%)", filter: "blur(60px)" }} />
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Выбор</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Как понять, что подходит</h2>
          </div>

          {/* Мобилка */}
          <div className="-mx-4 mt-10 sm:hidden">
            <div className="niches-scroll overflow-x-auto px-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
              <ul className="flex gap-4" style={{ scrollSnapType: "x mandatory" }}>
              {CHOOSE_ITEMS.map((item) => (
                <li key={item.scenario}
                  className="flex w-[80vw] max-w-[300px] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#13131A] p-5"
                  style={{ scrollSnapAlign: "start" }}>
                  <h3 className="font-semibold text-white">{item.scenario}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#A1A1B5]">{item.description}</p>
                  <span className={`mt-4 inline-flex w-fit rounded-xl border px-3 py-1.5 text-sm font-semibold ${item.resultColor}`}>{item.result}</span>
                </li>
              ))}
              <li className="w-4 shrink-0" aria-hidden="true" />
              </ul>
            </div>
          </div>

          {/* Десктоп */}
          <ul className="mt-10 hidden gap-5 sm:grid sm:grid-cols-3" role="list">
            {CHOOSE_ITEMS.map((item, i) => (
              <li key={item.scenario}
                className={`reveal-up flex flex-col rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-white/20 sm:p-7 ${i === 0 ? "delay-1" : i === 1 ? "delay-2" : "delay-3"}`}>
                <h3 className="text-lg font-semibold text-white">{item.scenario}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[#A1A1B5]">{item.description}</p>
                <span className={`mt-5 inline-flex w-fit rounded-xl border px-3 py-1.5 text-sm font-semibold ${item.resultColor}`}>{item.result}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq title="Вопросы по стоимости" subtitle="Отвечаем до старта — без обязательств" items={PRICING_FAQ} />
      <Cta title="Не знаете с чего начать?" subtitle="Попробуйте генератор — увидите дизайн до оплаты. Или напишите напрямую." button="Сгенерировать дизайн" />

      <section className="bg-[#0A0A0F] px-4 py-8 sm:px-6">
        <p className="text-center text-sm text-[#6B6B80]">
          Хотите разобраться в форматах?{" "}
          <Link href="/services" className="text-[#A1A1B5] transition-colors hover:text-white">Смотрите страницу услуг →</Link>
        </p>
      </section>
    </main>
  );
}
