import type { Metadata } from "next"
import Link from "next/link"
import { NICHE_PAGES } from "@/content/seo/niches"
import { Cta } from "@/components/sections/cta"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio"

export const metadata: Metadata = {
  title: "Создание сайтов по нишам — для любого бизнеса | gotovo",
  description:
    "Сайты для стоматологий, салонов красоты, ресторанов, фитнес-клубов, юристов и медклиник. Минск и вся Беларусь. AI дизайн за 30 сек, от 500 €.",
  alternates: { canonical: `${SITE_URL}/uslugi` },
  openGraph: {
    url: `${SITE_URL}/uslugi`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
}

export default function UslugiPage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(124,58,237,0.18), transparent 60%)" }} />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            Специализированные решения для бизнеса
          </span>

          <h1 className="reveal-up delay-1 mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Сайт для вашей ниши —
            <span className="mt-2 block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              не шаблон, а решение
            </span>
          </h1>

          <p className="reveal-up delay-2 mt-5 mx-auto max-w-2xl text-base leading-7 text-[#A1A1B5] sm:text-lg">
            Каждый тип бизнеса требует своей структуры, своих функций и своего подхода к SEO.
            Мы специализируемся на конкретных нишах — и знаем что нужно каждой из них.
          </p>
        </div>
      </section>

      {/* ── Карточки ниш ──────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Ниши</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Для какого бизнеса делаем сайты
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {NICHE_PAGES.map((niche, i) => {
              const delay = i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3"
              return (
                <Link key={niche.slug}
                  href={`/uslugi/${niche.slug}`}
                  className={`reveal-up group flex flex-col rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-violet-500/30 hover:-translate-y-1 ${delay}`}>

                  <div className="flex items-start justify-between">
                    <span className="text-4xl" aria-hidden="true">{niche.emoji}</span>
                    <span className="text-xs text-[#6B6B80]">{niche.price}</span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                    {niche.title}
                  </h2>

                  <p className="mt-2 flex-1 text-sm leading-6 text-[#A1A1B5] line-clamp-3">
                    {niche.intro.slice(0, 120)}...
                  </p>

                  <ul className="mt-4 flex flex-col gap-1.5">
                    {niche.features.slice(0, 3).map((f) => (
                      <li key={f.title} className="flex items-center gap-2 text-xs text-[#6B6B80]">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />
                        {f.title}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <div>
                      <span className="text-sm font-bold text-white">{niche.price}</span>
                      <span className="ml-2 text-xs text-[#6B6B80]">{niche.duration}</span>
                    </div>
                    <span className="text-sm font-medium text-violet-400 group-hover:translate-x-1 transition-transform">
                      Подробнее →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Ваша ниша не в списке ─────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="reveal-up rounded-2xl border border-white/10 bg-[#13131A] p-8 sm:p-12">
            <span className="text-5xl" aria-hidden="true">🤔</span>
            <h2 className="mt-5 text-2xl font-bold text-white">Ваша ниша не в списке?</h2>
            <p className="mt-3 text-[#A1A1B5]">
              Мы делаем сайты для любого бизнеса — не только для тех что в списке.
              Попробуйте AI генератор: опишите свой бизнес и получите дизайн за 30 секунд бесплатно.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5">
                <span aria-hidden="true">✦</span> Попробовать генератор
              </Link>
              <Link href="/contacts"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
                Обсудить проект
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Cta
        title="Увидьте дизайн вашего сайта за 30 секунд"
        subtitle="AI генератор создаёт превью сайта для любого бизнеса — бесплатно и без регистрации."
        button="Сгенерировать дизайн"
      />
    </main>
  )
}
