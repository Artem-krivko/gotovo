import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "Создание лендинга в Минске — от 500$ за 7 дней | gotovo",
  description:
    "Разработка лендингов для бизнеса в Минске. От 500$, срок 7–10 дней. AI покажет дизайн до оплаты за 30 сек. Адаптив, форма заявки, SEO в комплекте.",
  alternates: { canonical: `${SITE_URL}/lending-minsk` },
  openGraph: {
    title: "Создание лендинга в Минске — от 500$ | gotovo",
    description: "Лендинги от 500$ за 7–10 дней. AI-превью бесплатно. Адаптив и SEO в комплекте.",
    url: `${SITE_URL}/lending-minsk`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const schemaLanding = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Создание лендинга в Минске",
  description: "Разработка одностраничных продающих сайтов (лендингов) для бизнеса в Минске и Беларуси",
  provider: {
    "@type": "ProfessionalService",
    name: "gotovo",
    url: SITE_URL,
  },
  areaServed: { "@type": "City", name: "Минск", addressCountry: "BY" },
  offers: {
    "@type": "Offer",
    price: "500",
    priceCurrency: "USD",
    description: "Лендинг под ключ за 7–10 рабочих дней",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Сколько стоит заказать лендинг в Минске?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Лендинг (одностраничный сайт) стоит от 500$. Цена фиксированная и включает дизайн, верстку, форму заявки и базовую SEO-оптимизацию. Никаких скрытых доплат.",
      },
    },
    {
      "@type": "Question",
      name: "За сколько дней сделают лендинг?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Срок разработки лендинга — 7–10 рабочих дней. Срок считается от момента согласования прототипа и получения материалов.",
      },
    },
    {
      "@type": "Question",
      name: "Что входит в разработку лендинга?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "В стоимость входит: индивидуальный дизайн, адаптивная верстка (мобильная версия), форма заявки с уведомлениями, базовое SEO (мета-теги, sitemap, Open Graph), 2 круга правок.",
      },
    },
    {
      "@type": "Question",
      name: "Лендинг или полноценный сайт — что лучше?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Лендинг — оптимален для продвижения одной услуги или оффера, для рекламных кампаний. Полноценный сайт нужен если у вас несколько услуг, нужны разделы 'О компании', 'Блог', 'Каталог'. Если не уверены — попробуйте AI-генератор и посмотрите оба варианта.",
      },
    },
    {
      "@type": "Question",
      name: "Будет ли лендинг оптимизирован под Google и Яндекс?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Да. В каждый лендинг входит базовая техническая SEO-оптимизация: правильная структура заголовков H1-H3, мета-теги, sitemap.xml, Open Graph для соцсетей, оптимизация скорости загрузки.",
      },
    },
  ],
};

const WHAT_INCLUDED = [
  { title: "Индивидуальный дизайн", desc: "Не шаблон — создаётся под ваш бизнес и целевую аудиторию", icon: "🎨" },
  { title: "Адаптивная верстка", desc: "Корректно отображается на телефонах, планшетах и десктопе", icon: "📱" },
  { title: "Форма заявки", desc: "Заявки приходят на вашу почту с первого дня работы", icon: "📩" },
  { title: "Базовое SEO", desc: "Мета-теги, sitemap, Open Graph — сайт правильно индексируется", icon: "🔍" },
  { title: "Хостинг и домен", desc: "Помогаем с выбором и настройкой хостинга и домена", icon: "🌐" },
  { title: "Аналитика", desc: "Подключение Google Analytics или Яндекс.Метрики", icon: "📊" },
];

const WHEN_LANDING = [
  { title: "Одна услуга или оффер", desc: "Когда нужно продвигать конкретный продукт или услугу без лишней информации" },
  { title: "Рекламная кампания", desc: "Для Google Ads, Яндекс.Директ — отдельная страница с одним CTA конвертирует лучше" },
  { title: "Быстрый старт", desc: "Нужно выйти в рынок быстро — лендинг за 7–10 дней vs полноценный сайт за месяц" },
  { title: "Проверка гипотезы", desc: "Тестируете новый продукт или услугу, не хотите вкладывать большой бюджет" },
];

const FAQ_ITEMS = [
  {
    question: "Сколько стоит заказать лендинг в Минске?",
    answer: "Лендинг (одностраничный сайт) стоит от 500$. Цена фиксированная и включает дизайн, верстку, форму заявки и базовую SEO-оптимизацию. Никаких скрытых доплат.",
  },
  {
    question: "За сколько дней сделают лендинг?",
    answer: "Срок разработки лендинга — 7–10 рабочих дней. Срок считается от момента согласования прототипа и получения материалов.",
  },
  {
    question: "Что входит в разработку лендинга?",
    answer: "Индивидуальный дизайн, адаптивная верстка, форма заявки, базовое SEO (мета-теги, sitemap, Open Graph), 2 круга правок.",
  },
  {
    question: "Лендинг или полноценный сайт — что выбрать?",
    answer: "Лендинг оптимален для одной услуги или рекламной кампании. Полноценный сайт нужен если несколько направлений. Попробуйте генератор — покажет оба варианта.",
  },
  {
    question: "Нужны ли готовые тексты и фото?",
    answer: "Желательно, но не обязательно. Помогаем с базовым контентом если материалов нет.",
  },
  {
    question: "Как оплатить?",
    answer: "50% предоплата перед стартом, 50% после финального согласования. Оплата удобным способом.",
  },
];

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="opacity-70">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LendingMinskPage() {
  return (
    <main>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLanding) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 60% 50% at 80% -5%, rgba(59,130,246,0.2), transparent 60%)" }}
          aria-hidden="true" />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-xs text-[#6B6B80]">
              <li><Link href="/" className="hover:text-[#A1A1B5] transition-colors">gotovo</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/razrabotka-sajtov-minsk" className="hover:text-[#A1A1B5] transition-colors">Разработка сайтов Минск</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#A1A1B5]">Лендинги</li>
            </ol>
          </nav>

          <div className="flex flex-col items-center text-center">
            <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              Лендинги · Минск · от 500$
            </span>

            <h1 className="reveal-up delay-1 mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Создание лендинга<br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                в Минске под ключ
              </span>
            </h1>

            <p className="reveal-up delay-2 mt-5 max-w-2xl text-lg leading-7 text-[#A1A1B5]">
              Разрабатываем продающие одностраничные сайты для бизнеса в Минске.{" "}
              <strong className="text-white">От 500$, срок 7–10 дней.</strong>{" "}
              AI-генератор покажет дизайн до оплаты — бесплатно за 30 секунд.
            </p>

            {/* Метрики */}
            <div className="reveal-up delay-3 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { value: "от 500$", label: "стоимость" },
                { value: "7–10 дней", label: "срок" },
                { value: "30 сек", label: "превью дизайна" },
                { value: "50/50", label: "оплата" },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl border border-white/10 bg-[#13131A] px-4 py-4 text-center">
                  <p className="text-lg font-bold text-white">{m.value}</p>
                  <p className="mt-0.5 text-xs text-[#6B6B80]">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="reveal-up delay-4 mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/generator"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
                <span aria-hidden="true">✦</span>
                Посмотреть дизайн бесплатно
              </Link>
              <Link href="/contacts"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10">
                Заказать лендинг
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Что входит ──────────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Состав</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Что входит в стоимость лендинга
            </h2>
            <p className="mt-3 text-[#A1A1B5]">Всё необходимое для запуска и привлечения клиентов</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_INCLUDED.map((item, i) => {
              const delay = i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3";
              return (
                <div key={item.title}
                  className={`reveal-up flex gap-4 rounded-2xl border border-white/10 bg-[#13131A] p-5 transition hover:border-white/20 ${delay}`}>
                  <span className="text-2xl shrink-0" aria-hidden="true">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#6B6B80]">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Когда нужен лендинг ─────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Выбор</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Когда лендинг — правильный выбор
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {WHEN_LANDING.map((item, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4";
              return (
                <div key={item.title}
                  className={`reveal-up flex gap-4 rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-violet-500/20 sm:p-7 ${delay}`}>
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
                    <CheckIcon />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#A1A1B5]">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEO-текст ───────────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <article>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Заказать лендинг в Минске — как выбрать исполнителя
            </h2>
            <p className="mt-4 text-[#A1A1B5] leading-7">
              Рынок веб-разработки в Минске переполнен предложениями от 50$ до 5000$.
              Главный вопрос: как понять что вы получите за деньги, не заплатив вперёд?
              В gotovo мы решили эту проблему радикально — наш AI-генератор показывает
              дизайн вашего лендинга за 30 секунд бесплатно. Вы видите реальный результат
              до любых договорённостей и оплаты.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-white">
              Чем продающий лендинг отличается от просто красивого сайта
            </h3>
            <p className="mt-3 text-[#A1A1B5] leading-7">
              Лендинг — это не просто страница с информацией. Это инструмент продаж
              с чёткой структурой: боль → решение → доверие → призыв к действию.
              Каждый элемент создаётся с учётом психологии покупателя и конкретной
              целевой аудитории вашего бизнеса в Минске. Мы не верстаем шаблоны —
              каждый лендинг строится с нуля под вашу задачу.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-white">
              Лендинг для рекламы в Минске
            </h3>
            <p className="mt-3 text-[#A1A1B5] leading-7">
              Если вы планируете запускать Google Ads или Яндекс.Директ в Минске —
              отдельный лендинг под рекламную кампанию критически важен. Прямое
              сравнение: трафик на главную страницу сайта конвертирует 1–3%,
              трафик на специализированный лендинг — 5–15%. Разница в прибыли
              при одинаковом рекламном бюджете очевидна.
            </p>
          </article>

          {/* Ссылки на смежные страницы */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/razrabotka-sajtov-minsk"
              className="flex-1 flex items-center justify-between rounded-2xl border border-white/10 bg-[#13131A] p-4 transition hover:border-violet-500/30 hover:bg-[#1C1C28]">
              <div>
                <p className="font-semibold text-white text-sm">Разработка сайтов в Минске</p>
                <p className="text-xs text-[#6B6B80]">Все виды разработки</p>
              </div>
              <ArrowRight />
            </Link>
            <Link href="/sozdanie-sajtov-dlya-biznesa"
              className="flex-1 flex items-center justify-between rounded-2xl border border-white/10 bg-[#13131A] p-4 transition hover:border-violet-500/30 hover:bg-[#1C1C28]">
              <div>
                <p className="font-semibold text-white text-sm">Сайты для бизнеса</p>
                <p className="text-xs text-[#6B6B80]">Корпоративные сайты</p>
              </div>
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <Faq
        title="Вопросы о создании лендинга"
        subtitle="Всё что нужно знать перед заказом"
        items={FAQ_ITEMS}
      />

      <Cta
        title="Закажите лендинг в Минске"
        subtitle="Попробуйте генератор — увидите дизайн вашего лендинга бесплатно за 30 секунд."
        button="Посмотреть дизайн"
      />
    </main>
  );
}
