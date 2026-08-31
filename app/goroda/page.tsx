import type { Metadata } from "next";
import Link from "next/link";
import { CITY_PAGES } from "@/content/seo/cities";
import { Arrow, EditorialBreadcrumbs, EditorialCta, EditorialHero, EditorialSectionHeader } from "@/components/shared/editorial";

export const metadata: Metadata = { title: "Создание сайтов по городам Беларуси", description: "Разрабатываем сайты для бизнеса в Минске и областных центрах Беларуси. Работаем удалённо, цены от 1 200 BYN." };

export default function GorodaPage() {
  return <main className="bg-paper text-ink">
    <EditorialBreadcrumbs items={[{label:"Главная",href:"/"},{label:"Города"}]} />
    <EditorialHero eyebrow="Беларусь / удалённо" title={<>Один процесс.<br /><span className="editorial-serif font-normal italic text-cobalt">Любой город.</span></>} intro={<>Встречи и передача материалов проходят онлайн. География не влияет на уровень дизайна, сроки или стоимость проекта.</>} />
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-32"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="01" label="География" title={<>Работаем с бизнесом <span className="editorial-serif font-normal italic text-signal">по всей стране.</span></>} />
      <div className="mt-10 grid border-l border-t border-ink/25 sm:grid-cols-2 lg:grid-cols-3">{CITY_PAGES.map((city,index)=><Link key={city.slug} href={`/goroda/${city.slug}`} className={`group flex min-h-72 flex-col border-b border-r border-ink/25 p-6 transition sm:p-8 ${index === 0 ? "hover:bg-acid" : "hover:bg-white/40"}`}><div className="flex items-start justify-between"><span className="section-index text-ink/42">0{index+1}</span><span className="text-sm transition-transform group-hover:translate-x-1">→</span></div><h2 className="mt-12 text-3xl font-semibold tracking-[-0.05em]">{city.city}</h2><p className="mt-3 text-sm leading-6 text-ink/55">Сайты для локальных услуг, компаний и проектов в {city.cityPrepositional}.</p><div className="mt-auto pt-7 text-xs font-semibold uppercase tracking-[0.12em]">от 1 200 BYN <Arrow diagonal /></div></Link>)}</div>
    </div></section>
    <section className="bg-ink px-4 py-16 text-paper sm:px-6 sm:py-24"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="02" label="Удалённая работа" light title={<>Не тратим время <span className="editorial-serif font-normal italic text-acid">на дорогу и ритуалы.</span></>} /><div className="mt-10 grid gap-px bg-paper/20 md:grid-cols-3">{[['Связь','Созвоны по необходимости, рабочие вопросы — в одном чате.'],['Материалы','Контент, комментарии и версии собраны в понятной структуре.'],['Гео-SEO','Страницы и метаданные учитывают реальные города и зоны работы бизнеса.']].map(([t,d])=><div key={t} className="bg-ink p-7"><h3 className="text-xl font-semibold">{t}</h3><p className="mt-3 text-sm leading-6 text-paper/55">{d}</p></div>)}</div></div></section>
    <EditorialCta title="Ваш город не ограничение." text="Опишите бизнес, аудиторию и географию работы — предложим структуру сайта и подходящий формат." />
  </main>
}
