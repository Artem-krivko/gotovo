import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, EditorialBreadcrumbs, EditorialCta, EditorialFaq, EditorialHero, EditorialSectionHeader } from "@/components/shared/editorial";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Стоимость разработки сайта",
  description: "Прозрачные цены в BYN: лендинг от 1 200, бизнес-сайт от 2 900, индивидуальная разработка от 4 900. Оплата 30/40/30.",
  path: "/pricing",
});

const plans = [
  { n: "01", name: "Лендинг", price: "1 200", suffix: "BYN · от", term: "7–10 рабочих дней", description: "Одна услуга, запуск или рекламная кампания.", features: ["До 7–9 смысловых секций", "Структура и визуальное направление", "Адаптивная разработка", "Форма заявки и аналитика", "Базовое техническое SEO", "2 круга правок"] },
  { n: "02", name: "Бизнес-сайт", price: "2 900", suffix: "BYN · от", term: "от 14 рабочих дней", description: "Компания с несколькими услугами и точками доверия.", features: ["5–7 ключевых страниц", "Прототип и дизайн-система", "Адаптивная разработка", "Формы и базовые интеграции", "Аналитика и техническое SEO", "2–3 круга правок"] },
  { n: "03", name: "Индивидуальный", price: "4 900", suffix: "BYN · от", term: "после оценки", description: "Нестандартная логика, каталог или продуктовый интерфейс.", features: ["Исследование и архитектура", "Уникальные сценарии", "Компонентная дизайн-система", "Сложные интеграции", "Расширенный QA", "План развития"] },
] as const;

const faq = [
  { question: "Почему цена указана «от»?", answer: "На стоимость влияют объём контента, число уникальных страниц, интеграции и сложность поведения. После короткого брифа фиксируем точную смету и не меняем её без согласованного изменения объёма." },
  { question: "Что входит в базовое SEO?", answer: "Семантическая структура, метаданные, Open Graph, sitemap, robots и техническая готовность к индексации. Исследование семантики и контентное продвижение — отдельная услуга от 600 BYN." },
  { question: "Как происходит оплата?", answer: "30% после фиксации задачи и состава, 40% после согласования структуры и визуального направления, 30% перед публикацией проверенной разработки." },
  { question: "Что оплачивается отдельно?", answer: "Платные сервисы, лицензии, большой объём копирайтинга, профессиональная съёмка и функциональность за пределами согласованного состава. Такие расходы обсуждаем заранее." },
] as const;

export default function PricingPage() {
  return (
    <main className="bg-paper text-ink">
      <EditorialBreadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Цены" }]} />
      <EditorialHero eyebrow="Цены" title={<>Понятный масштаб.<br /><span className="editorial-serif font-normal italic text-cobalt">Понятные деньги.</span></>} intro={<>Ориентиры нужны до созвона. Показываем стартовую стоимость и объясняем, что влияет на итоговую смету.</>} secondary={null} />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <EditorialSectionHeader index="01" label="Пакеты" title={<>Выберите не тариф,<br /><span className="editorial-serif font-normal italic text-signal">а подходящий объём.</span></>} />
          <div className="mt-10 grid border-l border-t border-ink/25 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <article key={plan.name} className={`flex min-h-[620px] flex-col border-b border-r border-ink/25 p-6 sm:p-8 ${index === 1 ? "bg-acid" : ""}`}>
                <div className="flex items-start justify-between"><p className="section-index">{plan.n}</p><p className="text-xs uppercase tracking-[0.14em]">{plan.term}</p></div>
                <h2 className="mt-12 text-3xl font-semibold tracking-[-0.05em]">{plan.name}</h2><p className="mt-3 min-h-12 text-sm leading-6 text-ink/62">{plan.description}</p>
                <div className="mt-8 border-y border-ink/25 py-6"><p className="text-xs uppercase tracking-[0.14em] text-ink/45">{plan.suffix}</p><p className="mt-1 text-5xl font-semibold tracking-[-0.06em]">{plan.price}</p></div>
                <ul className="mt-7 space-y-3 text-sm text-ink/70">{plan.features.map((feature)=><li key={feature}>— {feature}</li>)}</ul>
                <Link href="/contacts" className="editorial-button editorial-button--dark mt-auto">Обсудить проект <Arrow diagonal /></Link>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-ink/52">Базовое техническое SEO входит в разработку. Расширенная SEO-подготовка — от 600 BYN. Домен, хостинг и платные сервисы оплачиваются напрямую поставщикам.</p>
        </div>
      </section>
      <section className="bg-ink px-4 py-16 text-paper sm:px-6 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1440px]"><EditorialSectionHeader index="02" label="График" light title={<>30 / 40 / 30.<br /><span className="editorial-serif font-normal italic text-acid">После видимого прогресса.</span></>} /><p className="mt-9 max-w-2xl text-lg leading-8 text-paper/65">Каждый платёж связан с согласованным результатом этапа. Вы не оплачиваете весь проект вперёд и не ждёте финала вслепую.</p></div>
      </section>
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-28"><div className="mx-auto max-w-[1100px]"><EditorialSectionHeader index="03" label="Вопросы" title={<>До того как <span className="editorial-serif font-normal italic text-cobalt">считать смету.</span></>} /><div className="mt-10"><EditorialFaq items={[...faq]} /></div></div></section>
      <EditorialCta title="Посчитаем ваш объём." text="Пришлите краткое описание задачи. Вернёмся с форматом, вилкой и вопросами, которые действительно влияют на цену." />
    </main>
  );
}
