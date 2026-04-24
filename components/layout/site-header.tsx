"use client";

import Link from "next/link";
import { useState, useCallback } from "react";

// ─── Навигация ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/services", label: "Услуги" },
  { href: "/process", label: "Процесс" },
  { href: "/pricing", label: "Цены" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
] as const;

// ─── Логотип ──────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <img
        src="/favicon.svg"
        alt="gotovo"
        width={32}
        height={32}
        className="transition group-hover:opacity-80"
      />
      <span className="text-base font-bold tracking-tight text-white">gotovo</span>
    </Link>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {open ? (
        <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen((v) => !v), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0A0A0F]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#A1A1B5] transition-colors hover:bg-white/5 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href="/generator"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5">
            <span aria-hidden="true">✦</span>
            Сгенерировать дизайн
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#A1A1B5] transition hover:bg-white/5 hover:text-white md:hidden"
          onClick={handleToggle}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
        >
          <BurgerIcon open={open} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/[0.06] bg-[#0A0A0F] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Мобильная навигация">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={handleClose}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#A1A1B5] transition hover:bg-white/5 hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link href="/generator" onClick={handleClose}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3.5 text-sm font-semibold text-white">
              <span aria-hidden="true">✦</span>
              Сгенерировать дизайн
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
