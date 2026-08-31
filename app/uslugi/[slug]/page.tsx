import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NICHE_PAGES } from "@/content/seo/niches";
import { EditorialBreadcrumbs, EditorialCta, EditorialFaq, EditorialHero, EditorialMetrics, EditorialSectionHeader } from "@/components/shared/editorial";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.usegotovo.by";
export function generateStaticParams() { return NICHE_PAGES.map((page) => ({ slug: page.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const page = NICHE_PAGES.find((item) => item.slug === slug); if (!page) return {};
  return { title: { absolute: page.metaTitle }, description: page.metaDescription, alternates: { canonical: `${SITE_URL}/uslugi/${slug}` }, openGraph: { title: page.metaTitle, description: page.metaDescription, url: `${SITE_URL}/uslugi/${slug}`, images: [{url:"/og-redesign.png",width:1731,height:909}] } };
}

export default async function NichePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const page = NICHE_PAGES.find((item) => item.slug === slug); if (!page) notFound();
  const faq = [
    {question:`Сколько стоит ${page.title.toLowerCase()}?`,answer:`Лендинг — ${page.price}, бизнес-сайт — от 2 900 BYN. Точная стоимость зависит от числа страниц, интеграций и объёма контента.`},
    {question:"Что нужно подготовить до старта?",answer:"Достаточно рассказать об услугах, аудитории и главном действии клиента. Тексты, фотографии и подтверждённые факты можно собрать по ходу брифа."},
    {question:"Можно ли редактировать сайт после запуска?",answer:"Да. Способ управления зависит от частоты обновлений: от простой передачи кода до подключения подходящей CMS. Это фиксируем до разработки."},
    {question:"Что делает AI-генератор?",answer:"Собирает первые визуальные гипотезы, чтобы предметно обсудить направление. Он не заменяет исследование, финальный дизайн, разработку и проверку сайта."},
  ];
  const schema={"@context":"https://schema.org","@type":"Service",name:page.title,description:page.metaDescription,provider:{"@type":"Organization",name:"gotovo",url:SITE_URL},areaServed:{"@type":"Country",name:"Беларусь"},offers:{"@type":"Offer",price:"1200",priceCurrency:"BYN"}};
  return <main className="bg-paper text-ink">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <EditorialBreadcrumbs items={[{label:"Главная",href:"/"},{label:"Решения",href:"/uslugi"},{label:page.title}]} />
    <EditorialHero eyebrow={`${page.emoji} Решение для ${page.businessType}`} title={<>{page.title}.<br /><span className="editorial-serif font-normal italic text-signal">Без отраслевых клише.</span></>} intro={<>Проектируем путь от первого впечатления до заявки: нужные точки доверия, понятные услуги и удобный мобильный сценарий.</>} note={`${page.price} · ${page.duration}`} />
    <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-[1440px]"><EditorialMetrics items={[{value:page.price,label:"ориентир для лендинга"},{value:page.duration,label:"типовой срок"},{value:"30/40/30",label:"оплата по этапам"}]} /></div></section>
    <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:pb-32"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="01" label="Задача" title={<>Что сайт должен <span className="editorial-serif font-normal italic text-cobalt">решить.</span></>} /><div className="mt-10 grid border-l border-t border-ink/25 md:grid-cols-3">{page.problems.map((item,index)=><article key={item.title} className="min-h-64 border-b border-r border-ink/25 p-6 sm:p-8"><p className="text-xs text-ink/40">0{index+1}</p><h2 className="mt-10 text-xl font-semibold">{item.title}</h2><p className="mt-3 text-sm leading-6 text-ink/58">{item.description}</p></article>)}</div></div></section>
    <section className="bg-cobalt px-4 py-16 text-white sm:px-6 sm:py-24 lg:py-32"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="02" label="Функции" light title={<>Состав под сценарий, <span className="editorial-serif font-normal italic text-acid">не ради количества.</span></>} /><div className="mt-10 grid border-l border-t border-white/25 sm:grid-cols-2 lg:grid-cols-3">{page.features.map((feature,index)=><article key={feature.title} className="min-h-52 border-b border-r border-white/25 p-6"><div className="flex items-center justify-between"><span className="text-2xl" aria-hidden="true">{feature.icon}</span><span className="text-xs text-white/40">0{index+1}</span></div><h3 className="mt-8 text-xl font-semibold">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-white/62">{feature.description}</p></article>)}</div></div></section>
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-28"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="03" label="Процесс" title={<>От контекста <span className="editorial-serif font-normal italic text-signal">до запуска.</span></>} /><ol className="mt-10 border-t border-ink">{[['Контекст','Разбираем услуги, аудиторию и главное действие клиента.'],['Структура','Собираем путь пользователя и приоритеты контента.'],['Дизайн и разработка','Создаём систему страниц, адаптив и нужные интеграции.'],['Запуск','Проверяем формы, аналитику, SEO-базу и публикуем.']].map(([t,d],i)=><li key={t} className="grid gap-4 border-b border-ink/25 py-6 sm:grid-cols-12"><span className="text-xs text-ink/40 sm:col-span-1">0{i+1}</span><h3 className="text-xl font-semibold sm:col-span-4">{t}</h3><p className="text-sm leading-6 text-ink/60 sm:col-span-7">{d}</p></li>)}</ol></div></section>
    <section className="px-4 pb-16 sm:px-6 sm:pb-24"><div className="mx-auto max-w-[1100px]"><EditorialSectionHeader index="04" label="Вопросы" title={<>До начала <span className="editorial-serif font-normal italic text-cobalt">проекта.</span></>} /><div className="mt-9"><EditorialFaq items={faq}/></div></div></section>
    <EditorialCta title={`Нужен ${page.title.toLowerCase()}?`} text="Расскажите о бизнесе и приоритетах. Предложим формат, структуру и ориентир по срокам без выдуманных обещаний." />
  </main>;
}
