"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";

const NAV_LINKS = [
  { href: "/services", label: "Услуги" },
  { href: "/pricing", label: "Цены" },
  { href: "/process", label: "Процесс" },
  { href: "/about", label: "О нас" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#171712]/20 bg-[#f2efe7]/95 text-[#171712] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <BrandLogo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`border-b px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:text-[#2656d8] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#2656d8] ${pathname === link.href ? "border-[#171712] text-[#171712]" : "border-transparent"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/generator" className="border-b border-[#171712] px-2 py-2 text-sm font-semibold transition-colors hover:text-[#2656d8] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#2656d8]">
            AI-концепция
          </Link>
          <Link href="/contacts" className="inline-flex min-h-10 items-center gap-3 bg-[#171712] px-4 py-2 text-sm font-semibold text-[#f2efe7] transition hover:bg-[#2656d8] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#2656d8]">
            Обсудить проект <span aria-hidden="true">→</span>
          </Link>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className={`flex h-10 w-10 items-center justify-center border border-[#171712] transition-colors duration-300 md:hidden ${open ? "bg-acid" : "bg-transparent"}`} aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} aria-controls="mobile-navigation">
          <span className="relative h-4 w-5" aria-hidden="true">
            <span className={`absolute left-0 top-1 block h-px w-5 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`absolute bottom-1 left-0 block h-px w-5 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div
        id="mobile-navigation"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-x-0 top-16 flex h-[calc(100dvh-4rem)] flex-col bg-[#f2efe7] px-4 pb-7 pt-5 transition-[opacity,transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none md:hidden ${open ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none -translate-y-3 opacity-0"}`}
      >
          <nav className="flex flex-col border-t border-[#171712]" aria-label="Мобильная навигация">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`flex items-center justify-between border-b border-[#171712]/25 py-5 text-2xl font-semibold tracking-[-0.04em] transition-[opacity,transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"} ${pathname === link.href ? "text-[#2656d8]" : ""}`}
                style={{ transitionDelay: open ? `${80 + index * 55}ms` : "0ms" }}
              >
                <span>{link.label}</span><span className="text-xs font-normal">0{index + 1}</span>
              </Link>
            ))}
          </nav>
          <div
            className={`mt-auto grid gap-3 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
            style={{ transitionDelay: open ? "300ms" : "0ms" }}
          >
            <Link href="/generator" onClick={() => setOpen(false)} className="flex min-h-13 items-center justify-between border border-[#171712] px-4 text-sm font-semibold">Получить AI-концепцию <span aria-hidden="true">↗</span></Link>
            <Link href="/contacts" onClick={() => setOpen(false)} className="flex min-h-13 items-center justify-between bg-[#171712] px-4 text-sm font-semibold text-[#f2efe7]">Обсудить проект <span aria-hidden="true">→</span></Link>
          </div>
      </div>
    </header>
  );
}
