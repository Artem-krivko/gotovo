import type { Metadata } from "next"
import Link from "next/link"
import { CITY_PAGES } from "@/content/seo/cities"
import { Cta } from "@/components/sections/cta"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio"

export const metadata: Metadata = {
  title: "Создание сайтов по городам Беларуси — gotovo",
  description:
    "Разрабатываем сайты для бизнеса во всех городах Беларуси. Минск, Гомель, Брест, Гродно, Витебск, Могилёв. Работаем удалённо. От 500 €, за 7–14 дней.",
  alternates: { canonical: `${SITE_URL}/goroda` },
  openGraph: {
    url: `${SITE_URL}/goroda`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
}

export default function GorodaPage() {
  const primaryCity = CITY_PAGES.find((c) => c.isPrimary)!
  const secondaryCities = CITY_PAGES.filter((c) => !c.isPrimary)

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(124,58,237,0.18), transparent 60%)" }} />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            📍 Работаем по всей Беларуси
          </span>

          <h1 className="reveal-up delay-1 mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Создание сайтов<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              в городах Беларуси
            </span>
          </h1>

          <p className="reveal-up delay-2 mt-5 mx-auto max-w-2xl text-base leading-7 text-[#A1A1B5] sm:text-lg">
            Разрабатываем сайты для бизнеса в Минске и по всей Беларуси. Работаем полностью удалённо —
            получаете профессиональный сайт с SEO под ваш город, без поездок в офис.
          </p>

          <div className="reveal-up delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/generator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
              <span aria-hidden="true">✦</span> Попробовать бесплатно
            </Link>
            <Link href="/contacts"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10">
              Написать напрямую
            </Link>
          </div>
        </div>
      </section>

      {/* ── Основной город — Минск ────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="reveal-up text-center text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">
            Основное направление
          </p>

          <Link href={`/goroda/${primaryCity.slug}`}
            className="reveal-up delay-1 group mt-8 flex overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 transition hover:border-violet-500/50">
            <div className="flex flex-1 flex-col gap-4 p-7 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                  📍 Главный рынок
                </span>
                <span className="text-sm text-[#6B6B80]">{primaryCity.population} жителей</span>
              </div>
              <h2 className="text-3xl font-bold text-white group-hover:text-violet-300 transition-colors sm:text-4xl">
                {primaryCity.city}
              </h2>
              <p className="max-w-xl text-[#A1A1B5]">{primaryCity.intro}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {primaryCity.topNiches.slice(0, 4).map((niche) => (
                  <span key={niche}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#6B6B80]">
                    {niche}
                  </span>
                ))}
              </div>
              <span className="mt-2 text-sm font-semibold text-violet-400 group-hover:translate-x-1 transition-transform inline-block">
                Сайты в Минске →
              </span>
            </div>

            {/* Декоративная правая панель */}
            <div className="hidden w-56 items-center justify-center border-l border-white/[0.06] bg-white/[0.02] sm:flex">
              <div className="text-center">
                <p className="text-5xl font-black text-white">МСК</p>
                <p className="mt-2 text-sm text-[#6B6B80]">Минск</p>
                <p className="mt-1 text-xs text-violet-400">от 500 €</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Областные города ──────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Беларусь</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Областные города
            </h2>
            <p className="mt-3 text-[#A1A1B5]">
              Создаём сайты для бизнеса в каждом областном центре Беларуси
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {secondaryCities.map((city, i) => {
              const delay = i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3"
              return (
                <Link key={city.slug}
                  href={`/goroda/${city.slug}`}
                  className={`reveal-up group flex flex-col rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-violet-500/30 hover:-translate-y-1 ${delay}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                      {city.city}
                    </span>
                    <span className="text-xs text-[#6B6B80]">{city.population}</span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#A1A1B5] line-clamp-3">
                    {city.intro}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {city.topNiches.slice(0, 3).map((niche) => (
                      <span key={niche}
                        className="rounded-lg border border-white/[0.06] bg-white/5 px-2.5 py-1 text-[11px] text-[#6B6B80]">
                        {niche}
                      </span>
                    ))}
                  </div>
                  <span className="mt-4 text-sm font-medium text-violet-400 group-hover:translate-x-1 transition-transform inline-block">
                    Сайты в {city.cityPrepositional} →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Почему работаем удалённо ──────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Удалённая работа</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Почему удалённо — это лучше
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "⚡", title: "Быстрее", description: "Не тратим время на встречи — сразу работаем. Общение в мессенджере в любое время." },
              { icon: "💰", title: "Дешевле", description: "Нет офисных расходов — цена ниже чем у местных агентств с таким же качеством." },
              { icon: "🔍", title: "SEO под ваш город", description: "Знаем специфику белорусского поиска. Настраиваем под запросы вашего города." },
              { icon: "🚀", title: "Запуск везде", description: "Публикуем, регистрируем в Google Картах — всё онлайн без вашего участия." },
            ].map((item, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4"
              return (
                <div key={item.title}
                  className={`reveal-up rounded-2xl border border-white/10 bg-[#13131A] p-6 ${delay}`}>
                  <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                  <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B6B80]">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Cta
        title="Откуда бы вы ни были — мы сделаем сайт"
        subtitle="Работаем по всей Беларуси. AI генератор покажет дизайн за 30 секунд — попробуйте прямо сейчас."
        button="Сгенерировать дизайн бесплатно"
      />
    </main>
  )
}
