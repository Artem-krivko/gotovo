import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITY_PAGES } from "@/content/seo/cities";
import { EditorialBreadcrumbs, EditorialCta, EditorialFaq, EditorialHero, EditorialMetrics, EditorialSectionHeader } from "@/components/shared/editorial";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.usegotovo.by";

export function generateStaticParams() { return CITY_PAGES.map((page) => ({ slug: page.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = CITY_PAGES.find((item) => item.slug === slug);
  if (!page) return {};
  return { title: { absolute: page.metaTitle }, description: page.metaDescription, alternates: { canonical: `${SITE_URL}/goroda/${slug}` }, openGraph: { title: page.metaTitle, description: page.metaDescription, url: `${SITE_URL}/goroda/${slug}`, images: [{ url: "/og-redesign.png", width: 1731, height: 909 }] } };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = CITY_PAGES.find((item) => item.slug === slug);
  if (!page) notFound();
  const faq = [
    { question: `Сколько стоит разработка сайта в ${page.cityPrepositional}?`, answer: "Лендинг — от 1 200 BYN, бизнес-сайт — от 2 900 BYN. География не влияет на стоимость: точную смету фиксируем после короткого брифа." },
    { question: `Можно ли работать полностью удалённо из ${page.cityGenitive}?`, answer: "Да. Созвоны, материалы, комментарии и согласования проходят онлайн. Каждый этап заканчивается конкретным результатом, который можно посмотреть и обсудить." },
    { question: "Что входит в базовое SEO?", answer: `Структура заголовков, метаданные, sitemap, robots и техническая готовность к индексации. Для локального бизнеса учитываем реальные услуги и географию работы в ${page.cityPrepositional}.` },
    { question: "AI-концепция — это готовый сайт?", answer: "Нет. Это бесплатная визуальная гипотеза для начала разговора. Финальный сайт проектируется и разрабатывается отдельно под контент, аудиторию и задачи бизнеса." },
  ];
  const schema = { "@context": "https://schema.org", "@type": "Service", name: `Разработка сайтов в ${page.cityPrepositional}`, provider: { "@type": "Organization", name: "gotovo", url: SITE_URL }, areaServed: { "@type": "City", name: page.city, addressCountry: "BY" }, offers: { "@type": "AggregateOffer", lowPrice: "1200", priceCurrency: "BYN" } };
  return <main className="bg-paper text-ink">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <EditorialBreadcrumbs items={[{label:"Главная",href:"/"},{label:"Города",href:"/goroda"},{label:page.city}]} />
    <EditorialHero eyebrow={`${page.region} / удалённо`} title={<>Разработка сайтов<br />в <span className="editorial-serif font-normal italic text-signal">{page.cityPrepositional}.</span></>} intro={<>Проектируем сайты для локальных услуг и компаний. Учитываем реальную географию бизнеса, путь клиента и поисковые сценарии.</>} note="Лендинг от 1 200 BYN · бизнес-сайт от 2 900 BYN" />
    <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto max-w-[1440px]"><EditorialMetrics items={[{value:"от 1 200 BYN",label:"лендинг"},{value:"7–10 дней",label:"типовой срок лендинга"},{value:"30/40/30",label:"поэтапная оплата"}]} /></div></section>
    <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:pb-32"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="01" label="Локальный контекст" title={<>Сайт должен говорить <span className="editorial-serif font-normal italic text-cobalt">на языке клиента.</span></>} intro={<>Добавляем только подтверждённые адреса, зоны работы, цены и факты. Не выдумываем локальные преимущества ради SEO.</>} />
      <div className="mt-10 grid gap-8 lg:grid-cols-12"><p className="text-lg leading-8 text-ink/68 lg:col-span-6">Для бизнеса в {page.cityPrepositional} важны понятное предложение, быстрый мобильный сценарий и точная география оказания услуг. Строим структуру вокруг этих решений, а не вокруг общих фраз о городе.</p><div className="lg:col-start-8 lg:col-span-5"><p className="section-index text-ink/42">Частые направления</p><ul className="mt-5 border-t border-ink">{page.topNiches.map((niche)=><li key={niche} className="border-b border-ink/25 py-3 text-sm">{niche}</li>)}</ul></div></div>
    </div></section>
    <section className="bg-ink px-4 py-16 text-paper sm:px-6 sm:py-24"><div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="02" label="Как работаем" light title={<>Удалённо — значит <span className="editorial-serif font-normal italic text-acid">прозрачно по этапам.</span></>} /><div className="mt-10 grid gap-px bg-paper/20 md:grid-cols-3">{[['Контекст','Фиксируем задачу, аудиторию, услуги и географию.'],['Направление','Согласуем структуру и визуальный характер до полной разработки.'],['Запуск','Проверяем мобильный UX, формы, аналитику и SEO-базу.']].map(([t,d],i)=><article key={t} className="bg-ink p-7"><p className="text-xs text-paper/40">0{i+1}</p><h3 className="mt-10 text-xl font-semibold">{t}</h3><p className="mt-3 text-sm leading-6 text-paper/55">{d}</p></article>)}</div></div></section>
    <section className="px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-[1100px]"><EditorialSectionHeader index="03" label="Вопросы" title={<>Коротко о работе<br />в <span className="editorial-serif font-normal italic text-cobalt">{page.cityPrepositional}.</span></>} /><div className="mt-9"><EditorialFaq items={faq}/></div></div></section>
    <EditorialCta title={`Обсудим сайт для бизнеса в ${page.cityPrepositional}.`} text="Опишите услуги, аудиторию и географию — предложим структуру, формат и ориентир по срокам." />
  </main>;
}
