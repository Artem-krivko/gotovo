import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, EditorialBreadcrumbs, EditorialCta, EditorialHero, EditorialSectionHeader } from "@/components/shared/editorial";

export const metadata: Metadata = {
  title: "Разработка сайтов для бизнеса",
  description: "Лендинги от 1 200 BYN, бизнес-сайты от 2 900 BYN и индивидуальная разработка. Структура, дизайн, код и запуск.",
};

const formats = [
  { n: "01", title: "Лендинг", price: "от 1 200 BYN", term: "7–10 дней", forWhom: "Одна услуга, продукт, эксперт или рекламная кампания", includes: ["Структура и прототип", "Уникальный визуальный язык", "Адаптивная разработка", "Форма и аналитика", "Базовое техническое SEO"] },
  { n: "02", title: "Сайт для бизнеса", price: "от 2 900 BYN", term: "от 14 дней", forWhom: "Несколько направлений, сложный выбор или длинный цикл решения", includes: ["5–7 основных страниц", "Дизайн-система", "Интеграции и формы", "Адаптивная разработка", "Аналитика и запуск"] },
  { n: "03", title: "Индивидуальный проект", price: "от 4 900 BYN", term: "после оценки", forWhom: "Каталог, нестандартная логика, сложная анимация или цифровой продукт", includes: ["Исследование сценариев", "Кастомная архитектура", "Компонентная система", "Интеграции", "Расширенный QA"] },
] as const;

export default function ServicesPage() {
  return (
    <main className="bg-paper text-ink">
      <EditorialBreadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Услуги" }]} />
      <EditorialHero eyebrow="Форматы работы" title={<>Не пакет страниц.<br /><span className="editorial-serif font-normal italic text-signal">Решение задачи.</span></>} intro={<>Подбираем масштаб сайта под путь клиента и текущий этап бизнеса. Каждый формат включает структуру, дизайн, разработку и запуск.</>} />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-32" id="formats">
        <div className="mx-auto max-w-[1440px]">
          <EditorialSectionHeader index="01" label="Что делаем" title={<>Три масштаба.<br /><span className="editorial-serif font-normal italic text-cobalt">Один уровень внимания.</span></>} />
          <div className="mt-10 border-t border-ink">
            {formats.map((item) => (
              <article key={item.title} className="grid gap-7 border-b border-ink/25 py-8 lg:grid-cols-12 lg:py-12">
                <p className="text-xs text-ink/42 lg:col-span-1">{item.n}</p>
                <div className="lg:col-span-3"><h2 className="text-3xl font-semibold tracking-[-0.05em]">{item.title}</h2><p className="mt-3 text-sm leading-6 text-ink/56">{item.forWhom}</p></div>
                <ul className="space-y-2 text-sm leading-6 text-ink/68 lg:col-span-4">{item.includes.map((feature) => <li key={feature}>— {feature}</li>)}</ul>
                <div className="flex flex-col justify-between border-l border-ink/20 pl-5 lg:col-span-2"><p className="text-xl font-semibold">{item.price}</p><p className="mt-2 text-xs text-ink/48">{item.term}</p></div>
                <div className="flex items-end lg:col-span-2"><Link href="/contacts" className="editorial-button editorial-button--line w-full">Обсудить <Arrow diagonal /></Link></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-cobalt px-4 py-16 text-white sm:px-6 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <EditorialSectionHeader index="02" label="Что всегда внутри" light title={<>Сайт должен быть готов <span className="editorial-serif font-normal italic text-acid">к реальной работе.</span></>} />
          <div className="mt-10 grid border-l border-t border-white/25 sm:grid-cols-2 lg:grid-cols-3">
            {[['Структура','Путь пользователя и приоритеты контента до визуального слоя.'],['Дизайн','Система, характер и иерархия, а не декор поверх шаблона.'],['Адаптив','Отдельное внимание мобильным сценариям и touch-интерфейсу.'],['Формы','Рабочие точки контакта и понятные состояния отправки.'],['SEO-база','Метаданные, sitemap, robots, семантическая структура.'],['Запуск','Аналитика, проверка, домен и передача доступа.']].map(([title,text],i)=><article key={title} className="min-h-52 border-b border-r border-white/25 p-6"><p className="text-xs text-white/45">0{i+1}</p><h3 className="mt-10 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/62">{text}</p></article>)}
          </div>
        </div>
      </section>
      <EditorialCta title="Не уверены в формате?" text="Опишите задачу — скажем, достаточно ли одной страницы или бизнесу действительно нужна более крупная система." />
    </main>
  );
}
