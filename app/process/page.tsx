import type { Metadata } from "next";
import { EditorialBreadcrumbs, EditorialCta, EditorialHero, EditorialSectionHeader, EditorialVisual } from "@/components/shared/editorial";

export const metadata: Metadata = {
  title: "Процесс разработки сайта",
  description: "Пять понятных этапов разработки сайта: контекст, структура, направление, система и запуск.",
};

const steps = [
  ["Контекст", "Разбираем продукт, аудиторию, конкурентов, ограничения и бизнес-задачу сайта.", "Короткий бриф и согласованные цели"],
  ["Структура", "Собираем путь пользователя, содержание страниц и прототип до визуального оформления.", "Карта сайта и прототип"],
  ["Направление", "Показываем ключевой экран, типографику, цвет и принципы работы визуальной системы.", "Согласованный визуальный вектор"],
  ["Система", "Проектируем все страницы, состояния, мобильное поведение и необходимые интеграции.", "Полный дизайн и рабочая сборка"],
  ["Запуск", "Тестируем формы, аналитику, доступность, скорость и техническое SEO. Публикуем на домене.", "Проверенный сайт и передача доступа"],
] as const;

export default function ProcessPage() {
  return (
    <main className="bg-paper text-ink">
      <EditorialBreadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Процесс" }]} />
      <EditorialHero
        eyebrow="Как работаем"
        title={<>От контекста<br />до <span className="editorial-serif font-normal italic text-cobalt">запуска.</span></>}
        intro={<>Вы видите результат каждого этапа и принимаете решения до того, как работа переходит дальше. Никакого длинного ожидания «финального варианта».</>}
        note="Типовой лендинг — 7–10 рабочих дней. Бизнес-сайт — от 14 рабочих дней."
      />
      <EditorialVisual
        src="/images/process-journey-v1.jpg"
        alt="Пять связанных этапов проектирования сайта от исследования до запуска"
        label="Маршрут проекта"
        caption="Каждый этап заканчивается отдельным видимым результатом. Следующий начинается только после того, как принято предыдущее решение."
        priority
      />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <EditorialSectionHeader index="01" label="Маршрут" title={<>Пять этапов.<br /><span className="editorial-serif font-normal italic text-signal">Пять понятных результатов.</span></>} />
          <ol className="mt-10 border-t border-ink">
            {steps.map(([title, text, result], index) => (
              <li key={title} className="grid gap-5 border-b border-ink/25 py-7 sm:grid-cols-12 sm:items-start sm:py-9" data-reveal>
                <span className="text-xs text-ink/42 sm:col-span-1">0{index + 1}</span>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:col-span-3 sm:text-3xl">{title}</h2>
                <p className="text-sm leading-7 text-ink/65 sm:col-span-5 sm:text-base">{text}</p>
                <div className="border-l border-ink/25 pl-4 sm:col-span-3">
                  <p className="section-index text-ink/40">Результат этапа</p>
                  <p className="mt-2 text-sm font-semibold">{result}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="bg-ink px-4 py-16 text-paper sm:px-6 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <EditorialSectionHeader index="02" label="Оплата" light title={<>Деньги привязаны <span className="editorial-serif font-normal italic text-acid">к видимому прогрессу.</span></>} />
          <div className="mt-10 grid gap-px bg-paper/20 md:grid-cols-3">
            {[['30%', 'Старт', 'После фиксации задачи, состава и календаря.'], ['40%', 'Согласование', 'Когда утверждены структура и визуальное направление.'], ['30%', 'Публикация', 'После проверки готовой разработки перед запуском.']].map(([value,title,text]) => (
              <div key={value} className="bg-ink p-7 sm:p-9" data-reveal><p className="text-5xl font-semibold text-acid">{value}</p><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-paper/55">{text}</p></div>
            ))}
          </div>
        </div>
      </section>
      <EditorialCta title="Начнём с контекста." text="Коротко опишите задачу — вернёмся с уточняющими вопросами, подходящим форматом и ориентиром по срокам." />
    </main>
  );
}
