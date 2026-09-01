import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ConceptBlueprint } from "@/components/shared/concept-blueprint";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "gotovo — разработка сайтов для бизнеса",
  description:
    "Проектируем и разрабатываем выразительные сайты для бизнеса. Бесплатная AI-концепция помогает увидеть первое направление до начала проекта.",
  path: "/",
  absoluteTitle: true,
  openGraphTitle: "gotovo — сайты, с которыми бизнес выглядит убедительно",
  openGraphDescription:
    "Структура, дизайн, разработка и запуск. Начните с разговора или бесплатной AI-концепции.",
});

const conceptItems = [
  {
    number: "01",
    title: "Спокойная уверенность",
    category: "Концепция для стоматологии",
    description:
      "Чистая композиция, человеческая фотография и ясная иерархия — чтобы медицинский сайт вызывал доверие, а не тревогу.",
    image: "/images/generator/dentist-preview.png",
    tone: "bg-[#d9e7ff]",
    blueprint: ["Hero / доверие", "Услуги", "Доказательства", "Запись / CTA"],
  },
  {
    number: "02",
    title: "Характер без клише",
    category: "Концепция для тату-студии",
    description:
      "Контрастная типографика и плотный визуальный ритм превращают портфолио мастеров в самостоятельное высказывание.",
    image: "/images/generator/tattoo-preview.png",
    tone: "bg-[#ff653c]",
    blueprint: ["Hero / характер", "Портфолио", "Мастера", "Запись / CTA"],
  },
  {
    number: "03",
    title: "Тёплый цифровой сервис",
    category: "Концепция для кофейни",
    description:
      "Атмосфера места, меню и повод зайти собраны в короткий путь — от первого впечатления до визита.",
    image: "/images/generator/coffee-preview.png",
    tone: "bg-[#d7ff52]",
    blueprint: ["Hero / атмосфера", "Меню", "Повод зайти", "Адрес / CTA"],
  },
] as const;

const services = [
  {
    number: "01",
    title: "Лендинг",
    audience: "Для одной услуги, запуска или рекламной кампании",
    price: "от 1 200 BYN",
    terms: "7–10 рабочих дней",
    features: "Структура · дизайн · адаптив · форма заявки · аналитика · техническое SEO",
  },
  {
    number: "02",
    title: "Сайт для бизнеса",
    audience: "Для компании с несколькими услугами и точками принятия решения",
    price: "от 2 900 BYN",
    terms: "от 14 рабочих дней",
    features: "5–7 страниц · дизайн-система · интеграции · аналитика · запуск",
  },
  {
    number: "03",
    title: "Индивидуальный проект",
    audience: "Для каталога, сложной логики, анимации или нестандартного продукта",
    price: "от 4 900 BYN",
    terms: "после оценки",
    features: "Исследование · прототип · кастомный интерфейс · разработка · QA",
  },
] as const;

const processSteps = [
  ["Контекст", "Разбираемся в бизнесе, аудитории и задаче сайта."],
  ["Структура", "Собираем путь пользователя и прототип до визуального дизайна."],
  ["Направление", "Показываем ключевой экран и фиксируем характер будущего сайта."],
  ["Система", "Проектируем страницы, состояния и адаптивное поведение."],
  ["Запуск", "Разрабатываем, тестируем, подключаем аналитику и публикуем."],
] as const;

const faqs = [
  {
    q: "AI-концепция — это готовый сайт?",
    a: "Нет. Это первая визуальная гипотеза: возможная структура, настроение и подача. Финальный сайт проектируется отдельно — под реальные цели, контент, аудиторию и технические требования бизнеса.",
  },
  {
    q: "Обязательно развивать результат генератора?",
    a: "Нет. Мы можем развить выбранное направление, объединить решения из нескольких концепций или полностью отказаться от результата и создать дизайн с нуля.",
  },
  {
    q: "Почему цена указана «от»?",
    a: "На стоимость влияют объём контента, количество уникальных страниц, интеграции и сложность анимации. После короткого разговора мы фиксируем точный состав, цену и этапы до начала разработки.",
  },
  {
    q: "Как устроена оплата?",
    a: "Сначала вы видите направление. Затем проект оплачивается по этапам после согласованных результатов: структура и направление, полный дизайн, готовая разработка перед публикацией.",
  },
] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span aria-hidden="true" className="text-lg leading-none">
      {diagonal ? "↗" : "→"}
    </span>
  );
}

function revealDelay(index: number): CSSProperties {
  return { "--reveal-delay": `${Math.min(index, 3) * 70}ms` } as CSSProperties;
}

function Hero() {
  return (
    <section className="editorial-hero border-b border-ink/20 px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:pb-20 lg:pt-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-8">
            <div className="hero-eyebrow mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/60 sm:mb-12">
              <span className="inline-block h-2.5 w-2.5 bg-signal" aria-hidden="true" />
              Независимая веб-студия · Минск / удалённо
            </div>
            <h1 className="max-w-[1040px] text-[clamp(3.5rem,6vw,6rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-ink">
              <span className="hero-line-mask block"><span className="hero-line hero-line--1 block">Сайты, с которыми</span></span>
              <span className="hero-line-mask block"><span className="hero-line hero-line--2 block">бизнес выглядит</span></span>
              <span className="hero-line-mask hero-line-mask--serif block">
                <span className="hero-line hero-line--3 editorial-serif block font-normal italic tracking-[-0.055em] text-signal">
                  убедительно.
                </span>
              </span>
            </h1>
          </div>

          <aside className="hero-aside flex flex-col justify-end border-t border-ink/20 pt-5 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <p className="max-w-md text-lg leading-7 text-ink/78 sm:text-xl sm:leading-8">
              Исследуем задачу, проектируем структуру, создаём дизайн и запускаем сайт. AI помогает быстрее увидеть первое направление — решения принимает человек.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link className="editorial-button editorial-button--dark" href="/contacts">
                Обсудить проект <Arrow />
              </Link>
              <Link className="editorial-button editorial-button--line" href="/generator">
                AI-концепция <Arrow diagonal />
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-12 lg:mt-20">
          <div className="hero-visual relative min-h-[290px] overflow-hidden bg-[#222] sm:col-span-8 sm:min-h-[430px] lg:min-h-[540px]">
            <Image
              src="/images/hero-process-v2.jpg"
              alt="Печатные вайрфреймы, модульные сетки и цветовые пробы сайта"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 66vw"
              className="object-cover opacity-90 grayscale-[15%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 max-w-sm text-sm leading-5 text-white sm:bottom-7 sm:left-7 sm:text-base">
              Не подгоняем бизнес под готовый шаблон. Сначала находим смысл и только потом форму.
            </p>
          </div>
          <div className="flex min-h-[290px] flex-col justify-between bg-cobalt p-5 text-white sm:col-span-4 sm:p-7 lg:min-h-[540px]" data-reveal>
            <div className="flex items-start justify-between text-xs uppercase tracking-[0.16em] text-white/70">
              <span>Первый шаг</span>
              <span>30–60 сек</span>
            </div>
            <div>
              <p className="editorial-serif text-4xl italic leading-none sm:text-5xl lg:text-6xl">Увидеть идею до созвона.</p>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/75 sm:text-base">
                Опишите бизнес и получите бесплатную AI-концепцию: возможную структуру, визуальное направление и подачу.
              </p>
              <Link href="/generator" className="mt-8 inline-flex items-center gap-3 border-b border-white pb-1 text-sm font-semibold">
                Получить концепцию <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section className="bg-ink px-4 py-16 text-paper sm:px-6 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="section-index text-paper/55">01 / Подход</p>
        </div>
        <div className="lg:col-span-9">
          <h2 className="max-w-5xl text-[clamp(2.4rem,5vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.055em]" data-reveal>
            AI ускоряет поиск, но не заменяет
            <span className="editorial-serif font-normal italic text-acid"> вкус, ответственность и диалог.</span>
          </h2>
          <div className="mt-12 grid gap-8 border-t border-paper/20 pt-6 sm:grid-cols-3">
            {[
              ["Смысл раньше декора", "Структура начинается с задачи бизнеса, а не с понравившегося эффекта."],
              ["Одна цельная система", "Тексты, сетка, изображения и motion работают как части одного решения."],
              ["Запуск — не финал картинки", "Проверяем мобильный UX, формы, аналитику, SEO и скорость."],
            ].map(([title, text], index) => (
              <div key={title} data-reveal style={revealDelay(index)}>
                <span className="text-xs text-paper/45">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-paper/62">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ConceptLab() {
  return (
    <section id="concepts" className="scroll-mt-20 bg-paper px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 border-b border-ink/20 pb-8 lg:grid-cols-12 lg:items-end" data-reveal>
          <p className="section-index lg:col-span-3">02 / Концепт-лаборатория</p>
          <div className="lg:col-span-9 lg:flex lg:items-end lg:justify-between lg:gap-10">
            <h2 className="text-[clamp(2.7rem,6vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.065em]">Не портфолио.<br />Проверка идей.</h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-ink/65 lg:mt-0">
              Это независимые концепции для демонстрации подхода, а не выданные за клиентские работы кейсы. Реальный проект всегда начинается с вашего контекста.
            </p>
          </div>
        </div>

        <div className="divide-y divide-ink/20">
          {conceptItems.map((item, index) => (
            <article key={item.number} className="grid gap-6 py-8 sm:py-12 lg:grid-cols-12 lg:gap-8 lg:py-16" data-reveal>
              <div className="flex justify-between lg:col-span-3 lg:block">
                <p className="text-xs font-semibold tracking-[0.16em]">{item.number}</p>
                <p className="mt-0 text-xs uppercase tracking-[0.14em] text-ink/50 lg:mt-8">{item.category}</p>
              </div>
              <ConceptBlueprint
                image={item.image}
                alt={item.category}
                tone={item.tone}
                rotation={index === 1 ? "rotate-[1.2deg]" : index === 2 ? "-rotate-[0.8deg]" : "rotate-[0.4deg]"}
                labels={item.blueprint}
              />
              <div className="flex flex-col justify-end lg:col-span-3">
                <h3 className="text-3xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl">{item.title}</h3>
                <p className="mt-5 text-sm leading-6 text-ink/65">{item.description}</p>
                <Link href="/generator" className="mt-7 inline-flex w-fit items-center gap-3 border-b border-ink pb-1 text-sm font-semibold">
                  Исследовать своё направление <Arrow />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-[#e6e2d8] px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-12" data-reveal>
          <p className="section-index lg:col-span-3">03 / Форматы работы</p>
          <div className="lg:col-span-9">
            <h2 className="max-w-4xl text-[clamp(2.7rem,6vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
              От сильной страницы до цифровой системы.
            </h2>
          </div>
        </div>

        <div className="mt-14 border-t border-ink sm:mt-20">
          {services.map((service, index) => (
            <article key={service.number} className="group grid gap-4 border-b border-ink/30 py-7 transition-colors hover:bg-paper/40 sm:py-9 lg:grid-cols-12 lg:items-start" data-reveal style={revealDelay(index)}>
              <p className="text-xs font-semibold lg:col-span-1">{service.number}</p>
              <h3 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl lg:col-span-3">{service.title}</h3>
              <div className="lg:col-span-4">
                <p className="max-w-md text-sm leading-6 text-ink/70">{service.audience}</p>
                <p className="mt-4 text-xs leading-5 text-ink/48">{service.features}</p>
              </div>
              <div className="flex items-end justify-between gap-4 lg:col-span-3 lg:block">
                <p className="text-xl font-semibold">{service.price}</p>
                <p className="mt-1 text-xs text-ink/50">{service.terms}</p>
              </div>
              <Link href="/contacts" aria-label={`Обсудить ${service.title.toLowerCase()}`} className="flex h-12 w-12 items-center justify-center justify-self-end rounded-full border border-ink text-xl transition group-hover:rotate-[-35deg] group-hover:bg-ink group-hover:text-paper lg:col-span-1">
                <Arrow diagonal />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
          <p>Точная цена фиксируется после обсуждения задачи и не меняется без согласования объёма.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/services" className="inline-flex w-fit items-center gap-2 font-semibold text-ink">Все услуги <Arrow /></Link>
            <Link href="/pricing" className="inline-flex w-fit items-center gap-2 font-semibold text-ink">Что входит в стоимость <Arrow /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function GeneratorStory() {
  return (
    <section id="generator-story" className="scroll-mt-20 overflow-hidden bg-cobalt px-4 py-16 text-white sm:px-6 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-7">
            <p className="section-index text-white/60">04 / AI-концепция</p>
            <h2 className="mt-9 text-[clamp(3rem,7vw,7.2rem)] font-semibold leading-[0.86] tracking-[-0.07em]">
              Быстрый старт,<br />не короткий путь.
            </h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-5">
            <p className="max-w-xl text-xl leading-8 text-white/82">
              Генератор помогает перейти от абстрактного «хочу сайт» к предметному разговору о структуре, настроении и приоритетах.
            </p>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/58">
              Концепция не ограничивает будущий дизайн. Мы можем развить её, соединить понравившиеся решения или начать заново после исследования бизнеса.
            </p>
            <Link href="/generator" className="mt-9 inline-flex w-fit items-center gap-3 bg-white px-6 py-4 text-sm font-semibold text-cobalt transition hover:bg-acid">
              Получить AI-концепцию <Arrow />
            </Link>
          </div>
        </div>

        <div className="mt-16 grid border-t border-white/30 sm:grid-cols-3 lg:mt-24">
          {[
            ["До", "Опишите бизнес, аудиторию и задачу. Получите возможную структуру и визуальное направление."],
            ["Результат", "Смотрите концепцию как первую гипотезу — ценную, но открытую для профессиональной доработки."],
            ["После", "Обсудите идею с дизайнером, уточните задачу и получите предложение по полноценной разработке."],
          ].map(([title, text], index) => (
            <div key={title} className="border-b border-white/30 py-7 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0" data-reveal style={revealDelay(index)}>
              <p className="text-xs text-white/45">0{index + 1}</p>
              <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/62">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="scroll-mt-20 bg-paper px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-8 lg:grid-cols-12" data-reveal>
          <p className="section-index lg:col-span-3">05 / Процесс</p>
          <div className="lg:col-span-9">
            <h2 className="text-[clamp(2.7rem,6vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.065em]">Понятно, что происходит дальше.</h2>
          </div>
        </div>
        <ol className="mt-14 grid border-t border-ink lg:mt-20 lg:grid-cols-5">
          {processSteps.map(([title, text], index) => (
            <li key={title} className="relative border-b border-ink/30 py-7 lg:min-h-[310px] lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0" data-reveal style={revealDelay(index)}>
              <span className="text-xs">0{index + 1}</span>
              <div className="mt-12 lg:mt-28">
                <h3 className="text-2xl font-semibold">{title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-ink/62">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-end">
          <Link href="/process" className="inline-flex items-center gap-3 border-b border-ink pb-1 text-sm font-semibold">Подробный процесс <Arrow /></Link>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="bg-acid px-4 py-16 text-ink sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <p className="section-index">06 / Без театра масштаба</p>
          <h2 className="mt-9 text-[clamp(2.8rem,5.6vw,6rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
            Новая студия.<br />Взрослый процесс.
          </h2>
        </div>
        <div className="grid gap-8 border-t border-ink pt-7 sm:grid-cols-2 lg:col-span-7" data-reveal>
          {[
            ["Не придумываем кейсы", "Концепции называем концепциями. Реальные проекты появятся здесь только с разрешения клиентов."],
            ["Фиксируем договорённости", "До старта понятны объём, стоимость, этапы, сроки и количество итераций."],
            ["Показываем промежуточный результат", "Вы не ждёте финала вслепую: структура и направление согласуются раньше разработки."],
            ["Проверяем то, что нельзя увидеть на макете", "Формы, мобильный UX, доступность, SEO, скорость и аналитика входят в процесс запуска."],
          ].map(([title, text]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/68">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="bg-paper px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4" data-reveal>
          <p className="section-index">07 / Коротко о важном</p>
          <h2 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-6xl">Вопросы<br />до старта.</h2>
        </div>
        <div className="border-t border-ink lg:col-span-8" data-reveal>
          {faqs.map((item, index) => (
            <details key={item.q} className="group border-b border-ink/30 py-1">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-6 text-left text-lg font-semibold sm:text-xl">
                <span className="flex gap-4"><span className="mt-1 text-xs font-normal text-ink/45">0{index + 1}</span>{item.q}</span>
                <span className="text-2xl font-normal transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-2xl pb-7 pl-9 text-sm leading-6 text-ink/65 sm:text-base sm:leading-7">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-signal px-4 py-16 text-ink sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px]">
        <p className="section-index">08 / Начать проект</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end" data-reveal>
          <h2 className="text-[clamp(3.2rem,8vw,8rem)] font-semibold leading-[0.84] tracking-[-0.075em] lg:col-span-9">
            Есть задача?<br />Давайте сделаем
            <span className="editorial-serif font-normal italic text-paper"> хорошо.</span>
          </h2>
          <div className="lg:col-span-3">
            <p className="text-sm leading-6 text-ink/70">Расскажите о бизнесе и результате, который хотите получить. Ответим в течение рабочего дня.</p>
            <Link href="/contacts" className="mt-7 flex items-center justify-between border-y border-ink py-4 text-sm font-semibold">
              Обсудить проект <Arrow diagonal />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-paper text-ink">
      <Hero />
      <Statement />
      <ConceptLab />
      <Services />
      <GeneratorStory />
      <Process />
      <Trust />
      <Faq />
      <FinalCta />
    </main>
  );
}
