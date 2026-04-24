import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CITY_PAGES } from "@/content/seo/cities"
import { NICHE_PAGES } from "@/content/seo/niches"
import { Cta } from "@/components/sections/cta"
import { Faq } from "@/components/sections/faq"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio"

// ─── Статические пути ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return CITY_PAGES.map((page) => ({ slug: page.slug }))
}

// ─── Метаданные ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = CITY_PAGES.find((p) => p.slug === slug)
  if (!page) return {}

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `${SITE_URL}/goroda/${slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${SITE_URL}/goroda/${slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  }
}

// ─── Schema.org LocalBusiness ─────────────────────────────────────────────────

function buildLocalSchema(page: (typeof CITY_PAGES)[0]) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `gotovo — создание сайтов в ${page.cityPrepositional}`,
    description: page.metaDescription,
    url: `${SITE_URL}/goroda/${page.slug}`,
    serviceType: "Web Development",
    areaServed: {
      "@type": "City",
      name: page.city,
      addressCountry: "BY",
    },
    provider: {
      "@type": "Organization",
      name: "gotovo",
      url: SITE_URL,
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "500",
      highPrice: "1200",
      priceCurrency: "EUR",
      offerCount: "3",
    },
  }
}

// ─── FAQ для гео-страниц ──────────────────────────────────────────────────────

function buildGeoFaq(page: (typeof CITY_PAGES)[0]) {
  return [
    {
      question: `Сколько стоит сайт для бизнеса в ${page.cityPrepositional}?`,
      answer: `Лендинг от 500 €, бизнес-сайт от 800 €. Цена одинаковая независимо от города — мы работаем удалённо по всей Беларуси. Видите дизайн до оплаты через AI генератор.`,
    },
    {
      question: `Вы работаете с клиентами из ${page.cityGenitive} удалённо?`,
      answer: `Да, мы работаем полностью онлайн. Общение в мессенджерах, материалы передаёте файлами. Разница в городе не влияет на качество и сроки — работаем так же как с минскими клиентами.`,
    },
    {
      question: `Как вы помогаете продвинуться в Google по ${page.cityPrepositional}?`,
      answer: `Настраиваем SEO под запросы «[услуга] ${page.city}» — правильные заголовки, мета-теги, структуру страниц. Регистрируем бизнес в Google Business Profile — появляетесь на картах по запросу «рядом».`,
    },
    {
      question: `Сколько времени займёт создание сайта?`,
      answer: `Лендинг за 7–10 рабочих дней, бизнес-сайт за 10–14 дней. Срок считается от получения материалов и согласования дизайна.`,
    },
    {
      question: `Можно ли сначала увидеть дизайн до оплаты?`,
      answer: `Да — именно для этого создан наш AI генератор. Вы описываете бизнес, получаете дизайн за 30 секунд бесплатно. Нравится направление — обсуждаем разработку.`,
    },
  ]
}

// ─── Иконки ───────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Страница ─────────────────────────────────────────────────────────────────

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = CITY_PAGES.find((p) => p.slug === slug)
  if (!page) notFound()

  const faqItems = buildGeoFaq(page)

  return (
    <main>
      {/* Schema.org */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalSchema(page)) }} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(124,58,237,0.18), transparent 60%)" }} />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl">
          {/* Хлебные крошки */}
          <nav aria-label="Хлебные крошки" className="mb-6 flex items-center gap-2 text-sm text-[#6B6B80]">
            <Link href="/" className="hover:text-[#A1A1B5] transition-colors">gotovo</Link>
            <span>/</span>
            <Link href="/goroda" className="hover:text-[#A1A1B5] transition-colors">Города</Link>
            <span>/</span>
            <span className="text-[#A1A1B5]">{page.city}</span>
          </nav>

          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
              📍 {page.region} · {page.population} жителей
            </span>

            {/* H1 */}
            <h1 className="reveal-up delay-1 mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {page.h1}
            </h1>
            <span className="reveal-up delay-1 mt-2 block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
              с AI-генератором дизайна
            </span>

            <p className="reveal-up delay-2 mt-6 max-w-2xl text-base leading-7 text-[#A1A1B5] sm:text-lg">
              {page.intro}
            </p>

            {/* CTA */}
            <div className="reveal-up delay-3 mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
                <span aria-hidden="true">✦</span> Попробовать генератор бесплатно
              </Link>
              <Link href="/contacts"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10">
                Обсудить проект
              </Link>
            </div>

            {/* Метрики */}
            <div className="reveal-up delay-4 mt-10 grid w-full max-w-lg grid-cols-3 gap-3">
              {page.localFacts.map((fact) => (
                <div key={fact.label}
                  className="rounded-2xl border border-white/10 bg-[#13131A] px-4 py-4 text-center">
                  <p className="text-lg font-bold text-white sm:text-xl">{fact.metric}</p>
                  <p className="mt-1 text-xs leading-4 text-[#6B6B80]">{fact.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Почему gotovo в этом городе ───────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Почему мы</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Почему бизнес {page.cityGenitive} выбирает gotovo
            </h2>
            <p className="mt-3 text-[#A1A1B5]">{page.marketDescription}</p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.advantages.map((advantage, i) => {
              const delay = i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3"
              return (
                <li key={advantage}
                  className={`reveal-up flex items-start gap-3 rounded-2xl border border-white/10 bg-[#13131A] p-5 ${delay}`}>
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
                    <CheckIcon />
                  </span>
                  <span className="text-sm text-[#A1A1B5]">{advantage}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ── Для каких ниш делаем сайты ────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Ниши</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Сайты для бизнеса в {page.cityPrepositional}
            </h2>
            <p className="mt-3 text-[#A1A1B5]">
              Топ ниши которым нужен сайт в {page.cityPrepositional}:
            </p>
          </div>

          {/* Топ локальных ниш */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {page.topNiches.map((niche) => (
              <span key={niche}
                className="rounded-xl border border-white/10 bg-[#13131A] px-4 py-2 text-sm text-[#A1A1B5]">
                {niche}
              </span>
            ))}
          </div>

          {/* Ссылки на нишевые страницы */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NICHE_PAGES.map((niche, i) => {
              const delay = i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3"
              return (
                <Link key={niche.slug}
                  href={`/uslugi/${niche.slug}`}
                  className={`reveal-up group flex items-start gap-4 rounded-2xl border border-white/10 bg-[#13131A] p-5 transition hover:border-violet-500/30 hover:bg-[#1C1C28] ${delay}`}>
                  <span className="text-2xl shrink-0" aria-hidden="true">{niche.emoji}</span>
                  <div>
                    <p className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                      {niche.title} в {page.cityPrepositional}
                    </p>
                    <p className="mt-1 text-xs text-[#6B6B80]">{niche.price} · {niche.duration}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Как работаем ──────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Процесс</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Как мы работаем с клиентами из {page.cityGenitive}
            </h2>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "01", title: "Генератор онлайн", description: `Вы из ${page.cityGenitive} — попробуйте генератор прямо сейчас. Видите дизайн за 30 сек бесплатно.` },
              { num: "02", title: "Обсуждение в мессенджере", description: "Общаемся в Telegram или WhatsApp. Файлы и материалы передаёте онлайн." },
              { num: "03", title: "Разработка удалённо", description: "Пишем код, вы согласовываете этапы онлайн. Никаких встреч не нужно." },
              { num: "04", title: "Запуск и SEO", description: `Публикуем сайт, настраиваем Google Business под ${page.city} — появляетесь в поиске.` },
            ].map((step, i) => {
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

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <Faq
        title={`Вопросы о разработке сайтов в ${page.cityPrepositional}`}
        subtitle="Отвечаем до старта — без обязательств"
        items={faqItems}
      />

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <Cta
        title={`Создадим сайт для вашего бизнеса в ${page.cityPrepositional}`}
        subtitle="Попробуйте AI генератор — дизайн за 30 секунд бесплатно. Работаем удалённо по всей Беларуси."
        button="Сгенерировать дизайн бесплатно"
      />

      {/* ── Другие города ─────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-center text-sm text-[#6B6B80]">Работаем по всей Беларуси</p>
          <div className="flex flex-wrap justify-center gap-2">
            {CITY_PAGES.filter((c) => c.slug !== slug).map((city) => (
              <Link key={city.slug}
                href={`/goroda/${city.slug}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#13131A] px-4 py-2 text-sm text-[#A1A1B5] transition hover:border-violet-500/30 hover:text-white">
                📍 {city.city}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
