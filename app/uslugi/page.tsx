import type { Metadata } from "next";
import Link from "next/link";
import { NICHE_PAGES } from "@/content/seo/niches";
import { Arrow, EditorialBreadcrumbs, EditorialCta, EditorialHero, EditorialSectionHeader } from "@/components/shared/editorial";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Сайты для разных ниш бизнеса", description: "Структура и функции сайта под стоматологию, салон, ресторан, фитнес, юридическую компанию и клинику. От 1 200 BYN.", path: "/uslugi" });

export default function UslugiPage() {
  return <main className="bg-paper text-ink">
    <EditorialBreadcrumbs items={[{label:"Главная",href:"/"},{label:"Решения по нишам"}]} />
    <EditorialHero eyebrow="Решения по нишам" title={<>Не отраслевой шаблон.<br /><span className="editorial-serif font-normal italic text-signal">Свой сценарий выбора.</span></>} intro={<>У клиники, ресторана и юридической компании разные точки доверия. Проектируем структуру и функции под реальный путь клиента.</>} />
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-32"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="01" label="Направления" title={<>С чего можно <span className="editorial-serif font-normal italic text-cobalt">начать разговор.</span></>} />
      <div className="mt-10 grid border-l border-t border-ink/25 md:grid-cols-2 lg:grid-cols-3">{NICHE_PAGES.map((niche,index)=><Link key={niche.slug} href={`/uslugi/${niche.slug}`} className="group flex min-h-80 flex-col border-b border-r border-ink/25 p-6 transition hover:bg-acid sm:p-8"><div className="flex items-start justify-between"><span className="text-4xl" aria-hidden="true">{niche.emoji}</span><span className="section-index text-ink/42">0{index+1}</span></div><h2 className="mt-9 text-2xl font-semibold tracking-[-0.04em]">{niche.title}</h2><ul className="mt-5 space-y-2 text-sm text-ink/58">{niche.features.slice(0,3).map((f)=><li key={f.title}>— {f.title}</li>)}</ul><div className="mt-auto flex items-center justify-between border-t border-ink/20 pt-5"><span className="font-semibold">{niche.price}</span><span className="transition-transform group-hover:translate-x-1"><Arrow /></span></div></Link>)}</div>
    </div></section>
    <section className="bg-cobalt px-4 py-16 text-white sm:px-6 sm:py-24"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="02" label="Другая ниша" light title={<>Список не ограничивает <span className="editorial-serif font-normal italic text-acid">возможности.</span></>} /><p className="mt-9 max-w-2xl text-lg leading-8 text-white/68">Если вашей отрасли здесь нет, это не проблема. Начнём с аудитории, предложения и решения, которое должен принять посетитель.</p></div></section>
    <EditorialCta title="Разберём вашу нишу." text="Расскажите, как клиент выбирает вас сейчас. Соберём структуру вокруг реального сценария, а не набора типовых блоков." />
  </main>
}
