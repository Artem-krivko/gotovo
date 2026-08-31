import Link from "next/link";

const NAVIGATION = [
  { href: "/services", label: "Услуги" },
  { href: "/pricing", label: "Цены" },
  { href: "/process", label: "Процесс" },
  { href: "/about", label: "О студии" },
  { href: "/contacts", label: "Контакты" },
] as const;

const SEO_LINKS = [
  { href: "/uslugi", label: "Решения по нишам" },
  { href: "/goroda", label: "По городам Беларуси" },
  { href: "/razrabotka-sajtov-minsk", label: "Разработка сайтов в Минске" },
  { href: "/lending-minsk", label: "Лендинги для бизнеса" },
  { href: "/sozdanie-sajtov-dlya-biznesa", label: "Сайты для бизнеса" },
  { href: "/ai-generator-sajta", label: "AI-концепция сайта" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-[#171712] px-4 py-12 text-[#f2efe7] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-[#f2efe7]/20 pb-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center bg-[#f2efe7] text-sm font-bold text-[#171712]">g</span>
              <span className="text-lg font-bold tracking-[-0.04em]">gotovo</span>
            </Link>
            <p className="mt-7 max-w-md text-3xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-4xl">
              Проектируем и запускаем сайты, которыми бизнес может уверенно представляться.
            </p>
          </div>

          <div className="grid gap-9 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/45">Навигация</p>
              <nav className="mt-5 flex flex-col gap-3" aria-label="Навигация в футере">
                {NAVIGATION.map((link) => <Link key={link.href} href={link.href} className="text-sm text-[#f2efe7]/70 transition hover:text-[#d8ff52]">{link.label}</Link>)}
              </nav>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/45">Для поиска</p>
              <nav className="mt-5 flex flex-col gap-3" aria-label="SEO навигация">
                {SEO_LINKS.map((link) => <Link key={link.href} href={link.href} className="text-sm leading-5 text-[#f2efe7]/70 transition hover:text-[#d8ff52]">{link.label}</Link>)}
              </nav>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f2efe7]/45">Связаться</p>
              <div className="mt-5 flex flex-col gap-3 text-sm">
                <a href="mailto:info@usegotovo.by" className="text-[#f2efe7]/70 transition hover:text-[#d8ff52]">info@usegotovo.by</a>
                <a href="tel:+375296333337" className="text-[#f2efe7]/70 transition hover:text-[#d8ff52]">+375 29 633-33-37</a>
                <a href="https://t.me/Artem_k_r" target="_blank" rel="noopener noreferrer" className="text-[#f2efe7]/70 transition hover:text-[#d8ff52]">Telegram ↗</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-[#f2efe7]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} gotovo · Независимая веб-студия</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-[#f2efe7]">Политика конфиденциальности</Link>
            <span>Минск / удалённо</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
