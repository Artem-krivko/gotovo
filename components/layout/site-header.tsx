"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

const NAV_LINKS = [
  { href: "/services",  label: "Услуги"   },
  { href: "/process",   label: "Процесс"  },
  { href: "/pricing",   label: "Цены"     },
  { href: "/about",     label: "О нас"    },
  { href: "/contacts",  label: "Контакты" },
] as const;

// ─── Логотип ──────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 shadow-md shadow-violet-500/30 transition group-hover:shadow-violet-500/50">
        <img
          src="/favicon.svg"
          alt="gotovo"
          width={20}
          height={20}
          className="relative z-10 brightness-0 invert transition group-hover:scale-105"
        />
      </div>
      <span className="text-[15px] font-bold tracking-tight text-white">gotovo</span>
    </Link>
  );
}

// ─── Мобильное меню ───────────────────────────────────────────────────────────

interface MobileMenuProps { open: boolean; visible: boolean; onClose: () => void }

function MobileMenu({ open, visible, onClose }: MobileMenuProps) {
  if (!visible) return null;
  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex flex-col overflow-y-auto transition-all duration-300 ease-out md:hidden ${
        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
      style={{ backgroundColor: "#0A0A0F", top: "57px" }}
      aria-hidden={!open}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.18), transparent 70%)" }}
      />
      <nav className="relative flex flex-col px-5 pt-6" aria-label="Мобильная навигация">
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="group flex items-center justify-between border-b border-white/[0.06] py-4 text-xl font-semibold text-[#A1A1B5] hover:text-white"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(8px)",
              transitionProperty: "opacity, transform, color",
              transitionDuration: "300ms, 300ms, 200ms",
              transitionTimingFunction: "ease",
              transitionDelay: open ? `${i * 40}ms, ${i * 40}ms, 0ms` : "0ms",
            }}
          >
            <span>{link.label}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
              className="text-[#6B6B80] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-violet-400">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </nav>
      <div className="relative mt-auto px-5 pb-10 pt-6">
        <Link
          href="/generator"
          onClick={onClose}
          className="btn-shimmer flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white shadow-xl shadow-violet-500/30"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(12px)",
            transitionProperty: "opacity, transform",
            transitionDuration: "300ms",
            transitionTimingFunction: "ease",
            transitionDelay: open ? `${NAV_LINKS.length * 40 + 40}ms` : "0ms",
          }}
        >
          <span aria-hidden="true">✦</span>
          Сгенерировать дизайн
        </Link>
        <p
          className="mt-3 text-center text-xs text-[#6B6B80]"
          style={{
            opacity: open ? 1 : 0,
            transitionProperty: "opacity",
            transitionDuration: "300ms",
            transitionTimingFunction: "ease",
            transitionDelay: open ? `${NAV_LINKS.length * 40 + 80}ms` : "0ms",
          }}
        >
          Бесплатно · Без регистрации · 30 секунд
        </p>
      </div>
    </div>,
    document.body
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export function SiteHeader() {
  const [open,    setOpen]    = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleToggle = useCallback(() => setOpen((v) => !v), []);
  const handleClose  = useCallback(() => setOpen(false), []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) { setVisible(true); }
    else { const t = setTimeout(() => setVisible(false), 300); return () => clearTimeout(t); }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#0A0A0F]/80 backdrop-blur-xl"
            : "border-b border-white/[0.04] bg-transparent backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Основная навигация">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/[0.07] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5"
            >
              <span aria-hidden="true">✦</span>
              Сгенерировать дизайн
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white md:hidden"
            onClick={handleToggle}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
          >
            <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${open ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        </div>
      </header>

      {mounted && <MobileMenu open={open} visible={visible} onClose={handleClose} />}
    </>
  );
}
