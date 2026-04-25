import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/sections/contact-form";
import { CONTACT_METHODS, AFTER_STEPS } from "@/content/contacts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "Контакты и заявка на разработку сайта | gotovo",
  description: "Оставьте заявку на разработку сайта. Ответим в течение нескольких часов. Или попробуйте бесплатный генератор дизайна.",
  alternates: { canonical: `${SITE_URL}/contacts` },
  openGraph: { url: `${SITE_URL}/contacts`, images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
};

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011.1-.2c1.2.5 2.5.7 3.9.7a1 1 0 011 1V21a1 1 0 01-1 1C9.6 22 2 14.4 2 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.4.2 2.7.7 3.9a1 1 0 01-.2 1.1L6.6 10.8z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CONTACT_ICONS = [EmailIcon, PhoneIcon];

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactsPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% -5%, rgba(124,58,237,0.18), transparent 60%)" }} />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            <span className="pulse-glow h-1.5 w-1.5 rounded-full bg-violet-400" aria-hidden="true" />
            Свяжитесь с нами
          </span>
          <h1 className="reveal-up delay-1 mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Обсудим{" "}
            <span className="gradient-reveal">ваш проект</span>
          </h1>
          <p className="reveal-up delay-2 mt-5 text-lg leading-7 text-[#A1A1B5]">
            Оставьте заявку — отвечу в течение нескольких часов.
            Или начните с генератора: увидите дизайн за 30 секунд бесплатно.
          </p>
          <div className="reveal-up delay-3 mt-6">
            <Link href="/generator"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-400 transition hover:bg-violet-500/20">
              Сначала попробовать генератор <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <div className="relative px-6" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute -top-20 -left-20 h-[400px] w-[400px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1), transparent 65%)", filter: "blur(60px)" }} />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-[300px] w-[300px]" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08), transparent 65%)", filter: "blur(60px)" }} />
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

          {/* Форма */}
          <div className="reveal-up rounded-2xl border border-white/10 bg-[#13131A] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">Оставить заявку</h2>
            <p className="mt-1 text-sm text-[#6B6B80]">Заполните форму — разберёмся с задачей вместе</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          {/* Правая колонка */}
          <div className="flex flex-col gap-5">

            {/* Контакты */}
            <div className="reveal-up delay-1 rounded-2xl border border-white/10 bg-[#13131A] p-6 sm:p-7">
              <h2 className="text-base font-semibold text-white">Написать напрямую</h2>
              <p className="mt-1 text-sm text-[#6B6B80]">Без формы — email или телефон</p>
              <ul className="mt-5 flex flex-col gap-3" role="list">
                {CONTACT_METHODS.map((method, i) => {
                  const Icon = CONTACT_ICONS[i % CONTACT_ICONS.length];
                  return (
                    <li key={method.label}>
                      <a href={method.href}
                        className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/5 p-4 transition hover:border-violet-500/30 hover:bg-violet-500/10">
                        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#13131A] text-[#A1A1B5] transition group-hover:border-violet-500/30 group-hover:text-violet-400">
                          <Icon />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6B6B80]">{method.label}</p>
                          <p className="mt-0.5 font-medium text-white truncate">{method.value}</p>
                          <p className="mt-0.5 text-xs text-[#6B6B80]">{method.note}</p>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* После заявки */}
            <div className="reveal-up delay-2 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-6 sm:p-7">
              <h2 className="text-base font-semibold text-white">Что будет после заявки</h2>
              <ol className="mt-5 flex flex-col gap-4">
                {AFTER_STEPS.map((step) => (
                  <li key={step.num} className="flex items-start gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-bold text-violet-400" aria-hidden="true">
                      {step.num}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{step.title}</p>
                      <p className="mt-0.5 text-sm leading-6 text-[#A1A1B5]">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0F] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13131A] px-6 py-8 sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Не готовы писать?</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Начните с генератора — бесплатно</h2>
                <p className="mt-2 text-sm text-[#A1A1B5]">Опишите бизнес, получите дизайн за 30 секунд. Понравится — тогда напишете.</p>
              </div>
              <Link href="/generator"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5">
                <span aria-hidden="true">✦</span> Попробовать <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
