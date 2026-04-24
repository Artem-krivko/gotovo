import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { NICHE_PAGES } from "@/content/seo/niches"
import { Cta } from "@/components/sections/cta"
import { Faq } from "@/components/sections/faq"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio"

// ─── Генерация статических путей ─────────────────────────────────────────────

export function generateStaticParams() {
  return NICHE_PAGES.map((page) => ({ slug: page.slug }))
}

// ─── Метаданные ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = NICHE_PAGES.find((p) => p.slug === slug)
  if (!page) return {}

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `${SITE_URL}/uslugi/${slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${SITE_URL}/uslugi/${slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  }
}

// ─── Иконки ───────────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Schema.org ───────────────────────────────────────────────────────────────

function buildSchema(page: (typeof NICHE_PAGES)[0]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.metaDescription,
    provider: {
      "@type": "ProfessionalService",
      name: "gotovo",
      url: SITE_URL,
      areaServed: {
        "@type": "Country",
        name: "Belarus",
      },
    },
    offers: {
      "@type": "Offer",
      price: "500",
      priceCurrency: "EUR",
      description: `Разработка сайта ${page.businessType} за ${page.duration}`,
    },
    serviceType: "Web Development",
    areaServed: "Минск, Беларусь",
  }
}

function buildFaqSchema(page: (typeof NICHE_PAGES)[0]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

// ─── Страница ─────────────────────────────────────────────────────────────────

export default async function NichePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = NICHE_PAGES.find((p) => p.slug === slug)
  if (!page) notFound()

  return (
    <main>
      {/* Schema.org */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema(page)) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(page)) }} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 70% 50% at 30% -5%, rgba(124,58,237,0.2), transparent 60%)" }} />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl">
          {/* Хлебные крошки */}
          <nav aria-label="Хлебные крошки" className="mb-6 flex items-center gap-2 text-sm text-[#6B6B80]">
            <Link href="/" className="hover:text-[#A1A1B5] transition-colors">gotovo</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[#A1A1B5] transition-colors">Услуги</Link>
            <span>/</span>
            <span className="text-[#A1A1B5]">{page.title}</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              {/* Badge */}
              <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
                <span aria-hidden="true">{page.emoji}</span>
                {page.title}
              </span>

              {/* H1 */}
              <h1 className="reveal-up delay-1 mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {page.h1}
                <span className="mt-2 block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                  под ключ за {page.duration}
                </span>
              </h1>

              <p className="reveal-up delay-2 mt-5 max-w-2xl text-base leading-7 text-[#A1A1B5] sm:text-lg">
                {page.intro}
              </p>

              {/* CTA */}
              <div className="reveal-up delay-3 mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link href="/generator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
                  <span aria-hidden="true">✦</span> Получить дизайн бесплатно
                </Link>
                <Link href="/contacts"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10">
                  Обсудить проект
                </Link>
              </div>
            </div>

            {/* Метрики */}
            <div className="reveal-up delay-2 flex flex-row gap-3 sm:flex-col lg:flex-col">
              {page.results.map((r) => (
                <div key={r.label}
                  className="rounded-2xl border border-white/10 bg-[#13131A] px-5 py-4 text-center min-w-[120px]">
                  <p className="text-xl font-bold text-white">{r.metric}</p>
                  <p className="mt-1 text-xs text-[#6B6B80]">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Проблемы ──────────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Боли бизнеса</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Почему бизнес теряет клиентов без хорошего сайта
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {page.problems.map((problem, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : "delay-3"
              return (
                <div key={problem.title}
                  className={`reveal-up rounded-2xl border border-red-500/20 bg-red-500/5 p-6 ${delay}`}>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white">{problem.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#A1A1B5]">{problem.description}</p>
                </div>
              )
            })}
          </div>

          {/* Решение */}
          <div className="reveal-up mt-10 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-7 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Решение</p>
            <p className="mt-3 text-lg font-semibold text-white">{page.solution}</p>
          </div>
        </div>
      </section>

      {/* ── Возможности сайта ─────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Что входит</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Что будет на вашем сайте
            </h2>
          </div>

          {/* Мобилка: snap-scroll */}
          <div className="-mx-4 mt-10 overflow-x-auto px-4 sm:hidden">
            <div className="flex gap-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
              {page.features.map((feature) => (
                <div key={feature.title}
                  className="flex w-[80vw] max-w-[280px] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#13131A] p-5"
                  style={{ scrollSnapAlign: "start" }}>
                  <span className="text-3xl" aria-hidden="true">{feature.icon}</span>
                  <h3 className="mt-3 font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#A1A1B5]">{feature.description}</p>
                </div>
              ))}
              <div className="w-4 shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Десктоп: grid */}
          <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {page.features.map((feature, i) => {
              const delay = i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3"
              return (
                <div key={feature.title}
                  className={`reveal-up rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-violet-500/20 hover:bg-[#1C1C28] ${delay}`}>
                  <span className="text-3xl" aria-hidden="true">{feature.icon}</span>
                  <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#A1A1B5]">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Процесс ───────────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Процесс</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Как мы создадим ваш сайт
            </h2>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {page.process.map((step, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4"
              return (
                <li key={step.num}
                  className={`reveal-up relative overflow-hidden rounded-2xl border border-white/10 bg-[#13131A] p-6 ${delay}`}>
                  <span className="absolute -right-2 -top-4 text-6xl font-black text-white/[0.04] select-none" aria-hidden="true">
                    {step.num}
                  </span>
                  <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-bold text-violet-400">
                    {step.num}
                  </span>
                  <h3 className="relative mt-4 font-semibold text-white">{step.title}</h3>
                  <p className="relative mt-2 text-sm leading-6 text-[#6B6B80]">{step.description}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* ── Цена и CTA ────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="reveal-up overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 p-8 sm:p-12">
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.15), transparent 70%)" }}
              aria-hidden="true"
            />
            <div className="relative grid gap-8 sm:grid-cols-2 sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Стоимость</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">{page.price}</span>
                  <span className="text-[#6B6B80]">за сайт под ключ</span>
                </div>
                <p className="mt-3 text-[#A1A1B5]">
                  Готово за {page.duration}. Фиксированная цена, оплата 50/50.
                  Видите дизайн до оплаты через AI генератор.
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {["Адаптив для мобильных", "Форма заявки", "Базовое SEO", "Запуск под ключ"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-[#A1A1B5]">
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
                        <CheckIcon />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/generator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
                  <span aria-hidden="true">✦</span> Попробовать генератор бесплатно
                </Link>
                <Link href="/contacts"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-white transition hover:bg-white/10">
                  Обсудить задачу <ArrowRight />
                </Link>
                <p className="text-center text-xs text-[#6B6B80]">
                  Бесплатная консультация · Ответ в течение нескольких часов
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <Faq
        title={`Вопросы о сайте ${page.businessType}`}
        subtitle="Отвечаем до старта — без обязательств"
        items={page.faq}
      />

      {/* ── Финальный CTA ─────────────────────────────────────────────────── */}
      <Cta
        title={`Создадим сайт ${page.businessType} за ${page.duration}`}
        subtitle="Попробуйте AI генератор — увидите дизайн за 30 секунд бесплатно. Нравится — обсудим разработку."
        button="Сгенерировать дизайн бесплатно"
      />

      {/* ── Навигация к другим нишам ──────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-center text-sm text-[#6B6B80]">Другие направления</p>
          <div className="flex flex-wrap justify-center gap-2">
            {NICHE_PAGES.filter((p) => p.slug !== slug).map((niche) => (
              <Link
                key={niche.slug}
                href={`/uslugi/${niche.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#13131A] px-4 py-2.5 text-sm text-[#A1A1B5] transition hover:border-violet-500/30 hover:text-white"
              >
                <span aria-hidden="true">{niche.emoji}</span>
                {niche.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
