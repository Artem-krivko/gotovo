import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/sections/contact-form";
import { TrackedContactLink } from "@/components/shared/tracked-contact-link";
import { Arrow, EditorialBreadcrumbs, EditorialHero, EditorialSectionHeader } from "@/components/shared/editorial";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Обсудить проект",
  description: "Расскажите о задаче сайта. Ответим в течение рабочего дня и предложим подходящий формат работы.",
  path: "/contacts",
});

export default function ContactsPage() {
  return (
    <main className="bg-paper text-ink">
      <EditorialBreadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />
      <EditorialHero
        eyebrow="Связаться"
        title={<>Расскажите,<br /><span className="editorial-serif font-normal italic text-signal">что нужно сделать.</span></>}
        intro={<>Достаточно нескольких предложений о бизнесе, задаче и желаемом сроке. Вернёмся с вопросами и предложим следующий шаг.</>}
        primary={null}
        secondary={{ label: "Сначала AI-концепция", href: "/generator" }}
      />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <EditorialSectionHeader index="01" label="Заявка" title={<>Начнём с <span className="editorial-serif font-normal italic text-cobalt">короткого контекста.</span></>} />
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="border border-ink/25 bg-white/25 p-6 sm:p-8 lg:col-span-7"><ContactForm /></div>
            <aside className="lg:col-span-5 lg:border-l lg:border-ink/25 lg:pl-8">
              <p className="section-index text-ink/45">Напрямую</p>
              <div className="mt-6 border-t border-ink">
                <TrackedContactLink href="mailto:info@usegotovo.by" kind="email" source="contacts" className="flex items-center justify-between border-b border-ink/25 py-5 text-lg font-semibold hover:text-cobalt"><span>info@usegotovo.by</span><Arrow diagonal /></TrackedContactLink>
                <TrackedContactLink href="tel:+375296333337" kind="phone" source="contacts" className="flex items-center justify-between border-b border-ink/25 py-5 text-lg font-semibold hover:text-cobalt"><span>+375 29 633-33-37</span><Arrow diagonal /></TrackedContactLink>
                <TrackedContactLink href="https://t.me/Artem_k_r" kind="telegram" source="contacts" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border-b border-ink/25 py-5 text-lg font-semibold hover:text-cobalt"><span>Telegram</span><Arrow diagonal /></TrackedContactLink>
              </div>
              <div className="mt-10 bg-acid p-6">
                <p className="section-index">Что дальше</p>
                <ol className="mt-6 space-y-5 text-sm leading-6">
                  <li><strong>01.</strong> Ответим в течение рабочего дня.</li>
                  <li><strong>02.</strong> Уточним задачу и ожидаемый результат.</li>
                  <li><strong>03.</strong> Предложим формат, сроки и ориентир по цене.</li>
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <section className="bg-cobalt px-4 py-14 text-white sm:px-6 sm:py-20"><div className="mx-auto flex max-w-[1440px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><div><p className="section-index text-white/50">Не готовы к разговору?</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Начните с бесплатной AI-концепции.</h2></div><Link href="/generator" className="editorial-button shrink-0 border-white bg-white text-ink">Открыть генератор <Arrow diagonal /></Link></div></section>
    </main>
  );
}
