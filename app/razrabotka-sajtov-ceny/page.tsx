import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "Цены на разработку сайта в Беларуси — от 500$ | gotovo",
  description:
    "Стоимость создания сайта в Беларуси: лендинг 500–700$, корпоративный 800–1200$. Фиксированные цены, без скрытых доплат. Оплата 50/50. Срок 7–14 дней.",
  alternates: { canonical: `${SITE_URL}/razrabotka-sajtov-ceny` },
  openGraph: {
    title: "Цены на разработку сайта — gotovo",
    description: "Лендинг от 500$, корпоративный от 800$. Фиксированные цены по Беларуси.",
    url: `${SITE_URL}/razrabotka-sajtov-ceny`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const priceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Цены на разработку сайтов gotovo",
  description: "Пакеты разработки сайтов для бизнеса в Беларуси",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Лендинг",
        description: "Одностраничный продающий сайт за 7–10 рабочих дней",
        offers: { "@type": "Offer", price: "500", priceCurrency: "USD", priceSpecification: { "@type": "PriceSpecification", minPrice: "500", maxPrice: "700", priceCurrency: "USD" } },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Корпоративный сайт",
        description: "Многостраничный сайт за 10–14 рабочих дней",
        offers: { "@type": "Offer", price: "800", priceCurrency: "USD", priceSpecification: { "@type": "PriceSpecification", minPrice: "800", maxPrice: "1200", priceCurrency: "USD" } },
      },
    },
  ],
};

const PRICE_COMPARISON = [
  { label: "Фрилансер (Беларусь)", landing: "200–500$", corp: "500–1000$", quality: "Непредсказуемо", timeline: "1–2 месяца" },
  { label: "Агентство (Минск)", landing: "800–2000$", corp: "2000–5000$", quality: "Высокое", timeline: "1–3 месяца" },
  { label: "Конструктор (Tilda)", landing: "0 + абонемент", corp: "0 + абонемент", quality: "Шаблонное", timeline: "Самостоятельно" },
  { label: "gotovo", landing: "500–700$", corp: "800–1200$", quality: "Высокое + AI", timeline: "7–14 дней" },
];

const FAQ_ITEMS = [
  {
    question: "Почему цена диапазоном, а не точная сумма?",
    answer: "Даже в одном форматe проекты отличаются по объёму и сложности. Лендинг с 5 секциями и лендинг с 9 секциями плюс калькулятором — разный объём. Точная цена фиксируется письменно до старта работ.",
  },
  {
    question: "Что входит в стоимость — нет ли скрытых доплат?",
    answer: "В стоимость входит: дизайн, верстка, адаптив, форма заявки, базовое SEO, 2–3 круга правок, запуск на хостинге. Дополнительно оплачивается только нестандартный функционал который выходит за рамки пакета.",
  },
  {
    question: "Можно ли оплатить в белорусских рублях?",
    answer: "Да, принимаем оплату в BYN по курсу НБ РБ на день оплаты. Также работаем в USD, EUR. Схема: 50% перед стартом, 50% после финального согласования.",
  },
  {
    question: "Есть ли рассрочка?",
    answer: "Стандартная схема 50/50 уже является рассрочкой — вы платите половину только после того как увидели и одобрили финальный результат. Индивидуальные схемы обсуждаются для крупных проектов.",
  },
  {
    question: "Что если результат не понравится?",
    answer: "Именно для этого есть бесплатный AI-генератор — вы видите направление до оплаты. В процессе работы есть 2–3 круга правок включённых в стоимость. Если после всех правок результат не устраивает — возвращаем предоплату.",
  },
];

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="opacity-70">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PACKAGES = [
  {
    name: "Лендинг",
    price: "500–700$",
    duration: "7–10 дней",
    description: "Одностраничный продающий сайт для услуги или оффера",
    features: ["1 страница до 7–9 секций", "Индивидуальный дизайн", "Адаптивная верстка", "Форма заявки", "Базовое SEO", "2 круга правок"],
    featured: false,
    cta: "Заказать лендинг",
  },
  {
    name: "Корпоративный сайт",
    price: "800–1200$",
    duration: "10–14 дней",
    description: "Многостраничный сайт для компании с несколькими разделами",
    features: ["5–7 страниц", "Главная, услуги, о компании, контакты", "Единая дизайн-система", "Формы и интеграции", "Базовое SEO", "2–3 круга правок"],
    featured: true,
    cta: "Заказать сайт",
  },
  {
    name: "SEO-старт",
    price: "+150–250$",
    duration: "3–5 дней",
    description: "Дополнение к любому пакету — полная техническая SEO-подготовка",
    features: ["Расширенные мета-теги", "Микроразметка Schema.org", "Google Search Console", "Sitemap и robots.txt", "Аналитика GA4 / Метрика", "Рекомендации по контенту"],
    featured: false,
    cta: "Добавить к пакету",
  },
];

export default function RazrabotkaStoimostPage() {
  return (
    <main>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(priceSchema) }} />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 60% 50% at 20% -5%, rgba(59,130,246,0.18), transparent 55%)" }}
          aria-hidden="true" />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl text-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center justify-center gap-2 text-xs text-[#6B6B80]">
              <li><Link href="/" className="hover:text-[#A1A1B5] transition-colors">gotovo</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#A1A1B5]">Цены на разработку</li>
            </ol>
          </nav>

          <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
            Прозрачные цены · Беларусь
          </span>

          <h1 className="reveal-up delay-1 mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Сколько стоит создание<br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              сайта в Беларуси
            </span>
          </h1>

          <p className="reveal-up delay-2 mt-5 mx-auto max-w-2xl text-lg leading-7 text-[#A1A1B5]">
            Фиксированные пакеты без скрытых доплат. Лендинг от 500$, корпоративный сайт от 800$.
            Цена, объём и сроки фиксируются письменно до начала работы.
          </p>

          <div className="reveal-up delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="#prices"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90">
              Смотреть цены ↓
            </a>
            <Link href="/generator"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10">
              <span aria-hidden="true">✦</span> Превью за 30 сек
            </Link>
          </div>
        </div>
      </section>

      {/* ── Пакеты ──────────────────────────────────────────────────────────── */}
      <section id="prices" className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Пакеты</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Тарифы на разработку сайтов
            </h2>
          </div>

          {/* Мобилка: snap-scroll */}
          <div className="-mx-4 mt-10 overflow-x-auto px-4 sm:hidden">
            <div className="flex gap-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
              {PACKAGES.map((pkg) => (
                <div key={pkg.name} style={{ scrollSnapAlign: "start" }}
                  className={`flex w-[82vw] max-w-[320px] shrink-0 flex-col rounded-2xl border p-6 ${
                    pkg.featured ? "border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-blue-500/5" : "border-white/10 bg-[#13131A]"
                  }`}>
                  <p className={`text-xs font-semibold uppercase tracking-widest ${pkg.featured ? "text-violet-400" : "text-[#6B6B80]"}`}>
                    {pkg.name}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-white">{pkg.price}</p>
                  <p className="text-sm text-[#6B6B80]">{pkg.duration}</p>
                  <p className="mt-3 flex-1 text-sm text-[#A1A1B5]">{pkg.description}</p>
                  <ul className="mt-5 flex flex-col gap-2">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#A1A1B5]">
                        <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${pkg.featured ? "bg-violet-600" : "bg-[#1C1C28]"}`}>
                          <CheckIcon />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contacts"
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                      pkg.featured ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}>
                    {pkg.cta} <ArrowRight />
                  </Link>
                </div>
              ))}
              <div className="w-4 shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Десктоп: 3 колонки */}
          <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-3">
            {PACKAGES.map((pkg, i) => (
              <div key={pkg.name}
                className={`reveal-up flex flex-col rounded-2xl border p-7 ${i === 0 ? "delay-1" : i === 1 ? "delay-2" : "delay-3"} ${
                  pkg.featured ? "border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-blue-500/5 sm:-translate-y-2" : "border-white/10 bg-[#13131A]"
                }`}>
                <p className={`text-xs font-semibold uppercase tracking-widest ${pkg.featured ? "text-violet-400" : "text-[#6B6B80]"}`}>
                  {pkg.name}
                </p>
                <p className="mt-4 text-3xl font-bold text-white">{pkg.price}</p>
                <p className="text-sm text-[#6B6B80]">{pkg.duration}</p>
                <p className="mt-3 text-sm text-[#A1A1B5] flex-1">{pkg.description}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#A1A1B5]">
                      <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${pkg.featured ? "bg-violet-600" : "bg-[#1C1C28]"}`}>
                        <CheckIcon />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contacts"
                  className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    pkg.featured ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}>
                  {pkg.cta} <ArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Сравнение с рынком ──────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Сравнение</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Цены gotovo vs рынок Беларуси
            </h2>
            <p className="mt-3 text-[#A1A1B5]">Честное сравнение без маркетинга</p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            {/* Шапка */}
            <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-white/10 bg-[#13131A] sm:grid-cols-[2fr_1fr_1fr_1fr]">
              <div className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#6B6B80] sm:px-5">Исполнитель</div>
              <div className="border-l border-white/10 px-3 py-3 text-xs font-semibold uppercase tracking-widest text-[#6B6B80] sm:px-4">Лендинг</div>
              <div className="hidden border-l border-white/10 px-3 py-3 text-xs font-semibold uppercase tracking-widest text-[#6B6B80] sm:block sm:px-4">Сайт</div>
              <div className="border-l border-violet-500/20 bg-violet-500/5 px-3 py-3 text-xs font-semibold uppercase tracking-widest text-violet-400 sm:px-4">Срок</div>
            </div>

            {PRICE_COMPARISON.map((row, i) => {
              const isGotovo = row.label === "gotovo";
              return (
                <div key={row.label}
                  className={`grid grid-cols-[2fr_1fr_1fr] border-b border-white/[0.06] last:border-0 sm:grid-cols-[2fr_1fr_1fr_1fr] ${
                    isGotovo ? "bg-violet-500/[0.04]" : i % 2 === 0 ? "bg-[#0A0A0F]" : "bg-[#0D0D14]"
                  }`}>
                  <div className={`px-4 py-4 text-sm sm:px-5 ${isGotovo ? "font-bold text-violet-300" : "text-white"}`}>
                    {row.label}
                  </div>
                  <div className={`border-l border-white/[0.06] px-3 py-4 text-sm sm:px-4 ${isGotovo ? "font-semibold text-violet-300" : "text-[#A1A1B5]"}`}>
                    {row.landing}
                  </div>
                  <div className={`hidden border-l border-white/[0.06] px-3 py-4 text-sm sm:block sm:px-4 ${isGotovo ? "font-semibold text-violet-300" : "text-[#A1A1B5]"}`}>
                    {row.corp}
                  </div>
                  <div className={`border-l border-violet-500/10 bg-violet-500/[0.03] px-3 py-4 text-sm sm:px-4 ${isGotovo ? "font-semibold text-violet-300" : "text-[#6B6B80]"}`}>
                    {row.timeline}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Faq
        title="Вопросы о ценах и оплате"
        subtitle="Всё что нужно знать перед заказом"
        items={FAQ_ITEMS}
      />

      <Cta
        title="Узнайте точную стоимость вашего проекта"
        subtitle="Оставьте заявку — рассчитаем стоимость в течение нескольких часов. Или попробуйте генератор бесплатно."
        button="Попробовать генератор"
      />
    </main>
  );
}
