import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

// ─── SEO ─────────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "Разработка сайтов в Минске — от 500$ под ключ | gotovo",
  description:
    "Создание сайтов для бизнеса в Минске. Лендинги от 500$, корпоративные сайты от 800$. AI-генератор покажет дизайн за 30 сек до оплаты. Срок 7–14 дней.",
  alternates: { canonical: `${SITE_URL}/razrabotka-sajtov-minsk` },
  openGraph: {
    title: "Разработка сайтов в Минске — gotovo",
    description: "Лендинги от 500$, сайты от 800$. Видите дизайн до оплаты. Срок 7–14 дней.",
    url: `${SITE_URL}/razrabotka-sajtov-minsk`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// ─── Schema.org ───────────────────────────────────────────────────────────────

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "gotovo — разработка сайтов",
  description: "Создание сайтов для бизнеса в Минске с AI-генератором дизайна",
  url: `${SITE_URL}/razrabotka-sajtov-minsk`,
  areaServed: {
    "@type": "City",
    name: "Минск",
    addressCountry: "BY",
  },
  serviceType: "Web Development",
  priceRange: "$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Пакеты разработки сайтов",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Лендинг для бизнеса",
        price: "500",
        priceCurrency: "USD",
        description: "Одностраничный сайт за 7–10 рабочих дней",
      },
      {
        "@type": "Offer",
        name: "Корпоративный сайт",
        price: "800",
        priceCurrency: "USD",
        description: "Многостраничный сайт за 10–14 рабочих дней",
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Сколько стоит разработка сайта в Минске?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Лендинг стоит от 500$, корпоративный сайт от 800$. Цена фиксированная — без скрытых доплат. Оплата 50% перед стартом, 50% после финального согласования.",
      },
    },
    {
      "@type": "Question",
      name: "Сколько времени займёт создание сайта?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Лендинг — 7–10 рабочих дней, многостраничный сайт — 10–14 рабочих дней. Срок фиксируется до старта работ.",
      },
    },
    {
      "@type": "Question",
      name: "Можно ли увидеть дизайн до оплаты?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да. Наш AI-генератор создаёт превью дизайна вашего сайта за 30 секунд — бесплатно и без регистрации. Вы видите результат до любых договорённостей.",
      },
    },
    {
      "@type": "Question",
      name: "Работаете ли вы с белорусскими компаниями?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да, работаем с компаниями и ИП из Беларуси. Сотрудничество полностью удалённое. Оплата удобным для вас способом.",
      },
    },
    {
      "@type": "Question",
      name: "Делаете ли вы SEO-оптимизацию сайта?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Базовая SEO-оптимизация входит в каждый пакет: мета-теги, sitemap, Open Graph, базовая структура заголовков. Полное SEO-продвижение — отдельная услуга.",
      },
    },
  ],
};

// ─── Данные ───────────────────────────────────────────────────────────────────

const ADVANTAGES = [
  {
    icon: "👁",
    title: "Видите дизайн до оплаты",
    description: "AI-генератор создаёт превью вашего сайта за 30 секунд бесплатно. Никакого кота в мешке.",
    accent: "border-violet-500/30 bg-violet-500/10",
  },
  {
    icon: "⚡",
    title: "Быстрее чем в агентстве",
    description: "Лендинг за 7–10 дней, а не за месяц. AI ускоряет прототипирование, человек контролирует качество.",
    accent: "border-blue-500/30 bg-blue-500/10",
  },
  {
    icon: "💰",
    title: "Фиксированная цена",
    description: "Никаких «по ходу добавим». Цена, объём и сроки зафиксированы письменно до начала работы.",
    accent: "border-emerald-500/30 bg-emerald-500/10",
  },
  {
    icon: "🚀",
    title: "Запуск под ключ",
    description: "Домен, хостинг, аналитика, формы — всё настроено и проверено. Получаете рабочий сайт.",
    accent: "border-fuchsia-500/30 bg-fuchsia-500/10",
  },
] as const;

const NICHES = [
  { label: "Кафе и рестораны", icon: "☕" },
  { label: "Салоны красоты", icon: "💅" },
  { label: "Медицинские клиники", icon: "🏥" },
  { label: "Юридические услуги", icon: "⚖️" },
  { label: "Строительство и ремонт", icon: "🏗️" },
  { label: "IT-компании", icon: "💻" },
  { label: "Фитнес и спорт", icon: "💪" },
  { label: "Образование и курсы", icon: "🎓" },
  { label: "Недвижимость", icon: "🏢" },
  { label: "Интернет-магазины", icon: "🛒" },
  { label: "Эксперты и коучи", icon: "🎯" },
  { label: "Производство", icon: "🏭" },
] as const;

const PACKAGES = [
  {
    name: "Лендинг",
    price: "от 500$",
    duration: "7–10 дней",
    description: "Для одной услуги или оффера. Фокус на конверсию.",
    features: [
      "1 страница до 7–9 секций",
      "Индивидуальная структура",
      "Адаптивная верстка",
      "Форма заявки",
      "Базовая SEO-оптимизация",
      "2 круга правок",
    ],
    featured: false,
    cta: "Заказать лендинг",
  },
  {
    name: "Корпоративный сайт",
    price: "от 800$",
    duration: "10–14 дней",
    description: "Для компании с несколькими услугами и разделами.",
    features: [
      "5–7 страниц",
      "Главная, услуги, о компании, контакты",
      "Единая дизайн-система",
      "Формы и интеграции",
      "Базовая SEO-оптимизация",
      "2–3 круга правок",
    ],
    featured: true,
    cta: "Заказать сайт",
  },
] as const;

const PROCESS_STEPS = [
  { num: "01", title: "Генератор", desc: "Опишите бизнес — ИИ создаёт дизайн за 30 секунд. Видите до оплаты." },
  { num: "02", title: "Бриф", desc: "Короткий структурированный бриф. Фиксируем объём, сроки и цену." },
  { num: "03", title: "Прототип", desc: "Детальный прототип с вашим контентом на согласование." },
  { num: "04", title: "Запуск", desc: "Домен, аналитика, проверка. Сайт выходит в рынок готовым." },
] as const;

const FAQ_ITEMS = [
  {
    question: "Сколько стоит разработка сайта в Минске?",
    answer: "Лендинг — от 500$, корпоративный сайт — от 800$. Цена фиксированная, без скрытых доплат. Точная стоимость зависит от объёма и сложности — обсуждаем перед стартом.",
  },
  {
    question: "Сколько времени занимает создание сайта?",
    answer: "Лендинг — 7–10 рабочих дней, корпоративный сайт — 10–14 дней. Срок считается от согласования прототипа и получения материалов от вас.",
  },
  {
    question: "Можно увидеть дизайн до того как платить?",
    answer: "Да — именно так работает gotovo. AI-генератор создаёт превью вашего сайта бесплатно за 30 секунд. Вы видите направление, цвета и структуру до любых договорённостей.",
  },
  {
    question: "Нужно ли готовить тексты и фото заранее?",
    answer: "Желательно, но не обязательно. Если материалов нет — помогаем с базовым контентом. Это добавит немного времени, но не заблокирует старт.",
  },
  {
    question: "Как вы работаете — удалённо или в офисе?",
    answer: "Полностью удалённо. Работаем с компаниями по всей Беларуси: Минск, Гомель, Брест, Гродно, Витебск, Могилёв. Все коммуникации в мессенджере или email.",
  },
  {
    question: "Делаете ли вы SEO-продвижение после запуска?",
    answer: "Базовое техническое SEO входит в каждый пакет: мета-теги, sitemap, Open Graph, структура заголовков. Полное SEO-продвижение обсуждается отдельно.",
  },
];

// ─── Иконки ───────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="opacity-70">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Страница ─────────────────────────────────────────────────────────────────

export default function RazrabotkaMinskPage() {
  return (
    <main>
      {/* Schema.org */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 70% 50% at 30% -5%, rgba(124,58,237,0.22), transparent 60%)" }}
          aria-hidden="true" />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* Текст */}
            <div>
              {/* Хлебная крошка для SEO */}
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex items-center gap-2 text-xs text-[#6B6B80]">
                  <li><Link href="/" className="hover:text-[#A1A1B5] transition-colors">gotovo</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-[#A1A1B5]">Разработка сайтов в Минске</li>
                </ol>
              </nav>

              <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" aria-hidden="true" />
                Минск · Беларусь
              </span>

              <h1 className="reveal-up delay-1 mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Разработка сайтов<br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                  в Минске
                </span>
              </h1>

              <p className="reveal-up delay-2 mt-5 text-lg leading-7 text-[#A1A1B5]">
                Создаём сайты для бизнеса в Минске и по всей Беларуси. Лендинги от 500$, корпоративные сайты от 800$.{" "}
                <strong className="text-white">AI-генератор покажет дизайн за 30 секунд до оплаты.</strong>
              </p>

              {/* Быстрые метрики */}
              <div className="reveal-up delay-2 mt-6 flex flex-wrap gap-4">
                {[
                  { label: "Лендинг", value: "от 500$" },
                  { label: "Сайт", value: "от 800$" },
                  { label: "Срок", value: "7–14 дней" },
                  { label: "Оплата", value: "50/50" },
                ].map((m) => (
                  <div key={m.label} className="flex flex-col">
                    <span className="text-xl font-bold text-white">{m.value}</span>
                    <span className="text-xs text-[#6B6B80]">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="reveal-up delay-3 mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link href="/generator"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
                  <span aria-hidden="true">✦</span>
                  Попробовать генератор
                </Link>
                <Link href="/contacts"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10">
                  Оставить заявку
                </Link>
              </div>
            </div>

            {/* Правая колонка — визуальный блок */}
            <div className="reveal-up delay-2 hidden lg:block">
              <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 p-8">
                <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />

                <div className="relative space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                    Наш процесс
                  </p>
                  {PROCESS_STEPS.map((step, i) => (
                    <div key={step.num} className="flex items-start gap-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-bold text-violet-400">
                        {step.num}
                      </span>
                      <div>
                        <p className="font-semibold text-white">{step.title}</p>
                        <p className="text-sm text-[#6B6B80]">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Почему gotovo ───────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Почему gotovo</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Чем мы отличаемся от других студий Минска
            </h2>
            <p className="mt-3 text-[#A1A1B5]">
              Не шаблоны, не перекупщики, не месяц ожидания
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {ADVANTAGES.map((adv, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4";
              return (
                <div key={adv.title}
                  className={`reveal-up flex gap-5 rounded-2xl border p-6 transition hover:border-white/20 sm:p-7 ${adv.accent} ${delay}`}>
                  <span className="text-3xl shrink-0" aria-hidden="true">{adv.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{adv.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#A1A1B5]">{adv.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Пакеты и цены ───────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24" id="prices">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Цены</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Стоимость разработки сайта в Минске
            </h2>
            <p className="mt-3 text-[#A1A1B5]">
              Фиксированные пакеты — знаете цену до начала работы
            </p>
          </div>

          {/* Мобилка: snap-scroll */}
          <div className="-mx-4 mt-10 overflow-x-auto px-4 sm:hidden">
            <div className="flex gap-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
              {PACKAGES.map((pkg) => (
                <div key={pkg.name}
                  style={{ scrollSnapAlign: "start" }}
                  className={`flex w-[82vw] max-w-[320px] shrink-0 flex-col rounded-2xl border p-6 ${
                    pkg.featured
                      ? "border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-blue-500/5"
                      : "border-white/10 bg-[#13131A]"
                  }`}>
                  <p className={`text-xs font-semibold uppercase tracking-widest ${pkg.featured ? "text-violet-400" : "text-[#6B6B80]"}`}>
                    {pkg.name}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-white">{pkg.price}</p>
                  <p className="text-sm text-[#6B6B80]">{pkg.duration}</p>
                  <p className="mt-3 text-sm text-[#A1A1B5]">{pkg.description}</p>
                  <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#A1A1B5]">
                        <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${pkg.featured ? "bg-violet-600" : "bg-[#1C1C28]"}`}>
                          <CheckIcon />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contacts"
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                      pkg.featured
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90"
                        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}>
                    {pkg.cta} <ArrowRight />
                  </Link>
                </div>
              ))}
              <div className="w-4 shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Десктоп: grid */}
          <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2 sm:max-w-3xl sm:mx-auto">
            {PACKAGES.map((pkg, i) => (
              <div key={pkg.name}
                className={`reveal-up flex flex-col rounded-2xl border p-7 ${i === 0 ? "delay-1" : "delay-2"} ${
                  pkg.featured
                    ? "border-violet-500/40 bg-gradient-to-br from-violet-500/10 to-blue-500/5 sm:-translate-y-2"
                    : "border-white/10 bg-[#13131A]"
                }`}>
                <p className={`text-xs font-semibold uppercase tracking-widest ${pkg.featured ? "text-violet-400" : "text-[#6B6B80]"}`}>
                  {pkg.name}
                </p>
                <p className="mt-4 text-4xl font-bold text-white">{pkg.price}</p>
                <p className="text-sm text-[#6B6B80]">{pkg.duration}</p>
                <p className="mt-3 text-sm text-[#A1A1B5]">{pkg.description}</p>
                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#A1A1B5]">
                      <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${pkg.featured ? "bg-violet-600" : "bg-[#1C1C28]"}`}>
                        <CheckIcon />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contacts"
                  className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    pkg.featured
                      ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}>
                  {pkg.cta} <ArrowRight />
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-[#6B6B80]">
            Нужен нестандартный проект?{" "}
            <Link href="/contacts" className="text-violet-400 hover:text-violet-300 transition-colors">
              Обсудим индивидуально →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Для каких ниш делаем ────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Ниши</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Для каких видов бизнеса делаем сайты
            </h2>
            <p className="mt-3 text-[#A1A1B5]">
              Работаем с малым и средним бизнесом любых сфер
            </p>
          </div>

          {/* Мобилка: snap-scroll */}
          <div className="-mx-4 mt-10 overflow-x-auto px-4 sm:hidden">
            <div className="flex gap-3 pb-3" style={{ scrollSnapType: "x mandatory" }}>
              {NICHES.map((n) => (
                <div key={n.label}
                  className="flex w-[40vw] max-w-[160px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-[#13131A] p-4 text-center"
                  style={{ scrollSnapAlign: "start" }}>
                  <span className="text-3xl" aria-hidden="true">{n.icon}</span>
                  <p className="text-xs font-medium text-[#A1A1B5]">{n.label}</p>
                </div>
              ))}
              <div className="w-4 shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Десктоп: 4×3 grid */}
          <div className="mt-10 hidden grid-cols-4 gap-4 sm:grid lg:grid-cols-6">
            {NICHES.map((n, i) => {
              const delay = i < 3 ? "delay-1" : i < 6 ? "delay-2" : i < 9 ? "delay-3" : "delay-4";
              return (
                <div key={n.label}
                  className={`reveal-up flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-[#13131A] p-4 text-center transition hover:border-white/20 hover:bg-[#1C1C28] ${delay}`}>
                  <span className="text-3xl" aria-hidden="true">{n.icon}</span>
                  <p className="text-xs font-medium text-[#A1A1B5]">{n.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEO-текст — важен для ранжирования ─────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <article className="prose-gotovo">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Разработка сайтов в Минске — что важно знать
            </h2>
            <p className="mt-4 text-[#A1A1B5] leading-7">
              Минск — один из крупнейших IT-рынков СНГ, и конкуренция среди
              веб-агентств здесь высокая. Мы в gotovo выбрали другой подход: вместо
              того чтобы тратить недели на согласование макетов, наш AI-генератор
              создаёт первый вариант дизайна за 30 секунд. Вы видите результат до
              оплаты — и принимаете решение на основе реального превью, а не слов.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-white">
              Сколько стоит сделать сайт в Минске в 2025 году?
            </h3>
            <p className="mt-3 text-[#A1A1B5] leading-7">
              Цены на разработку сайтов в Минске варьируются от 200$ за простые шаблонные
              решения до нескольких тысяч долларов за сложные корпоративные порталы.
              В gotovo мы предлагаем прозрачные фиксированные пакеты: лендинг от 500$
              за 7–10 дней, корпоративный сайт от 800$ за 10–14 дней. Никаких скрытых
              доплат — цена фиксируется письменно до начала работы.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-white">
              Почему не конструктор сайтов?
            </h3>
            <p className="mt-3 text-[#A1A1B5] leading-7">
              Tilda, Wix, WordPress — популярные инструменты для быстрого старта.
              Но они ограничивают вас шаблонами: ваш сайт будет похож на сотни других
              в вашей нише. Кастомная разработка даёт полный контроль над структурой,
              дизайном, скоростью и SEO. И с нашим AI-генератором это теперь не дольше
              и не сложнее конструктора — просто опишите бизнес и получите индивидуальное решение.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-white">
              Работаем по всей Беларуси
            </h3>
            <p className="mt-3 text-[#A1A1B5] leading-7">
              Несмотря на то что основной рынок — Минск, мы работаем удалённо
              с компаниями по всей Беларуси: Гомель, Брест, Гродно, Витебск, Могилёв.
              Все процессы выстроены онлайн: бриф, согласование прототипа, правки и сдача
              — без единой личной встречи.
            </p>
          </article>

          {/* Внутренние ссылки — SEO + UX */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/lending-minsk", label: "Лендинги в Минске", desc: "Одностраничные сайты от 500$" },
              { href: "/pricing", label: "Все тарифы", desc: "Подробные пакеты и состав" },
              { href: "/process", label: "Как проходит работа", desc: "7 этапов от идеи до запуска" },
              { href: "/generator", label: "AI-генератор", desc: "Превью дизайна за 30 секунд" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#13131A] p-4 transition hover:border-violet-500/30 hover:bg-[#1C1C28]">
                <div>
                  <p className="font-semibold text-white text-sm">{link.label}</p>
                  <p className="text-xs text-[#6B6B80]">{link.desc}</p>
                </div>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <Faq
        title="Частые вопросы о разработке сайтов в Минске"
        subtitle="Отвечаем честно и без маркетинговых формулировок"
        items={FAQ_ITEMS}
      />

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <Cta
        title="Готовы увидеть сайт для вашего бизнеса?"
        subtitle="Попробуйте генератор — бесплатно за 30 секунд. Или оставьте заявку и обсудим проект."
        button="Сгенерировать дизайн"
      />
    </main>
  );
}
