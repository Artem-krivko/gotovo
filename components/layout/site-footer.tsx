import Link from "next/link";

const NAV_LINKS = [
  { href: "/services", label: "Услуги" },
  { href: "/process", label: "Процесс" },
  { href: "/pricing", label: "Цены" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0A0F]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white">g</span>
              <span className="text-base font-bold text-white">gotovo</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#6B6B80]">
              AI-агентство по разработке сайтов. Генератор дизайна — бесплатно за 30 секунд.
            </p>
            <Link href="/generator"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5">
              <span aria-hidden="true">✦</span>
              Попробовать бесплатно
            </Link>
          </div>

          {/* Навигация */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Навигация</p>
            <nav className="mt-4 flex flex-col gap-2.5" aria-label="Навигация в футере">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-sm text-[#A1A1B5] transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Контакты */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Контакты</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-[#A1A1B5]">
              <a href="mailto:info@usegotovo.by" className="transition-colors hover:text-white">
                info@usegotovo.by
              </a>
              <a href="tel:+375296333337" className="transition-colors hover:text-white">
                +375 29 633-33-37
              </a>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[{ value: "30 сек", label: "генерация" }, { value: "€500", label: "от" }].map((m) => (
                <div key={m.label} className="rounded-xl border border-white/10 bg-[#13131A] p-3 text-center">
                  <p className="text-base font-bold text-white">{m.value}</p>
                  <p className="text-xs text-[#6B6B80]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#6B6B80]">© {new Date().getFullYear()} gotovo. Все права защищены.</p>
          <Link href="/privacy" className="text-xs text-[#6B6B80] transition-colors hover:text-[#A1A1B5]">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
