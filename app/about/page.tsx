import type { Metadata } from "next";
import { EditorialBreadcrumbs, EditorialCta, EditorialHero, EditorialSectionHeader, EditorialVisual } from "@/components/shared/editorial";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "О студии",
  description: "gotovo — независимая веб-студия из Беларуси. Проектируем структуру, дизайн и разработку сайтов для бизнеса.",
  path: "/about",
});

const principles = [
  ["Смысл раньше декора", "Начинаем не с цвета кнопки, а с задачи бизнеса, аудитории и решения, которое должен принять посетитель."],
  ["Показываем процесс", "Структура, визуальное направление и разработка согласуются поэтапно. Вы понимаете, что происходит и за что платите."],
  ["AI — инструмент, не автор", "Используем AI для поиска вариантов и ускорения рутины. За логику, вкус, качество и итог отвечает человек."],
  ["Запуск — часть проекта", "Проверяем мобильный UX, формы, аналитику, техническое SEO и только после этого публикуем сайт."],
] as const;

export default function AboutPage() {
  return (
    <main className="bg-paper text-ink">
      <EditorialBreadcrumbs items={[{ label: "Главная", href: "/" }, { label: "О студии" }]} />
      <EditorialHero
        eyebrow="О gotovo"
        title={<>Новая студия.<br /><span className="editorial-serif font-normal italic text-signal">Взрослый процесс.</span></>}
        intro={<>Не изображаем команду из двадцати человек и не прикрываемся выдуманными кейсами. Собираем сильные сайты внимательно, прозрачно и без лишнего театра.</>}
      />
      <EditorialVisual
        src="/images/about-studio-v1.jpg"
        alt="Работа над структурой сайта с бумажными вайрфреймами и заметками"
        label="Небольшая студия / прямой контакт"
        caption="Исследование, структура и визуальный язык проходят через одни руки — без потери контекста между продажей, дизайном и разработкой."
        priority
      />

      <section className="bg-ink px-4 py-16 text-paper sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <EditorialSectionHeader index="01" label="Позиция" light title={<>Небольшой масштаб позволяет <span className="editorial-serif font-normal italic text-acid">быть ближе к задаче.</span></>} />
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <p className="text-lg leading-8 text-paper/72 lg:col-start-4 lg:col-span-5" data-reveal>gotovo только начинает коммерческую историю. Поэтому вместо длинного списка логотипов — прямой контакт, аккуратный процесс и ответственность за каждое решение.</p>
            <p className="text-sm leading-7 text-paper/52 lg:col-span-4" data-reveal>По мере запуска реальных проектов здесь появятся кейсы с контекстом, ограничениями и измеримым результатом — только с разрешения клиентов.</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <EditorialSectionHeader index="02" label="Принципы" title={<>Четыре опоры <span className="editorial-serif font-normal italic text-cobalt">каждого проекта.</span></>} />
          <div className="mt-10 grid border-l border-t border-ink/25 md:grid-cols-2">
            {principles.map(([title, text], index) => (
              <article key={title} className="min-h-64 border-b border-r border-ink/25 p-6 sm:p-8" data-reveal>
                <p className="text-xs text-ink/40">0{index + 1}</p>
                <h2 className="mt-12 text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-ink/62">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cobalt px-4 py-16 text-white sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <EditorialSectionHeader index="03" label="Подходим друг другу" light title={<>Хороший результат начинается <span className="editorial-serif font-normal italic text-acid">с честного совпадения.</span></>} />
          <div className="mt-10 grid gap-px bg-white/20 lg:grid-cols-2">
            <div className="bg-cobalt p-7 sm:p-10" data-reveal>
              <p className="section-index text-white/55">Да, если</p>
              <ul className="mt-8 space-y-5 text-lg">
                <li>→ нужен рабочий инструмент, а не просто красивая картинка;</li>
                <li>→ готовы рассказать о бизнесе и обсудить приоритеты;</li>
                <li>→ цените прозрачные этапы, сроки и обратную связь.</li>
              </ul>
            </div>
            <div className="bg-cobalt p-7 sm:p-10" data-reveal>
              <p className="section-index text-white/55">Не лучший выбор, если</p>
              <ul className="mt-8 space-y-5 text-lg text-white/72">
                <li>× сайт нужен «за вечер» без обсуждения задачи;</li>
                <li>× единственный критерий — минимальная цена;</li>
                <li>× хочется скопировать конкурента один в один.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <EditorialCta title="Познакомимся на задаче." text="Опишите контекст в нескольких предложениях. Предложим формат работы и следующий шаг без длинной презентации." />
    </main>
  );
}
