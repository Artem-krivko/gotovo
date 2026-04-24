import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "AI генератор дизайна сайта — бесплатно за 30 секунд | gotovo",
  description:
    "Создайте дизайн сайта за 30 секунд с помощью искусственного интеллекта. Бесплатно, без регистрации. Опишите бизнес — AI создаёт готовый дизайн. Нравится — заказываете разработку.",
  alternates: { canonical: `${SITE_URL}/ai-generator-sajta` },
  openGraph: {
    title: "AI генератор дизайна сайта | gotovo",
    description: "Дизайн сайта за 30 секунд — бесплатно. Опишите бизнес, AI создаёт готовое превью.",
    url: `${SITE_URL}/ai-generator-sajta`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "gotovo AI генератор дизайна сайтов",
    description: "AI-инструмент для создания дизайна сайта по описанию бизнеса за 30 секунд",
    applicationCategory: "DesignApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Бесплатное использование" },
    url: `${SITE_URL}/generator`,
    creator: { "@type": "Organization", name: "gotovo", url: SITE_URL },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Что такое AI генератор сайтов?",
        acceptedAnswer: { "@type": "Answer", text: "AI генератор сайтов — инструмент который создаёт дизайн сайта по текстовому описанию вашего бизнеса. Вы описываете компанию, выбираете стиль — и за 30 секунд получаете живое HTML-превью сайта." },
      },
      {
        "@type": "Question",
        name: "Генератор создаёт готовый сайт или только дизайн?",
        acceptedAnswer: { "@type": "Answer", text: "Генератор создаёт дизайн-превью — живую HTML-страницу которую можно открыть в браузере. Это не финальный сайт, а направление для обсуждения. На основе понравившегося превью мы разрабатываем полноценный сайт." },
      },
    ],
  },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Опишите бизнес",
    desc: "Напишите 2–3 предложения о своей компании — чем занимаетесь, для кого, какой стиль хотите.",
    icon: "✍️",
  },
  {
    num: "02",
    title: "AI создаёт дизайн",
    desc: "Искусственный интеллект (Claude от Anthropic) анализирует описание и генерирует живой HTML-дизайн за 30 секунд.",
    icon: "⚡",
  },
  {
    num: "03",
    title: "Смотрите результат",
    desc: "Превью открывается прямо на сайте. Можно кликать, смотреть на мобильном, показать команде.",
    icon: "👀",
  },
  {
    num: "04",
    title: "Нравится — заказываете",
    desc: "Если направление подходит — оставляете заявку. Мы делаем финальный сайт с вашим контентом.",
    icon: "🚀",
  },
];

const GENERATOR_ADVANTAGES = [
  { title: "Бесплатно", desc: "Генератор не стоит ничего. Никакой регистрации, никаких карт.", icon: "🆓" },
  { title: "30 секунд", desc: "Не макеты через неделю, а реальное превью прямо сейчас.", icon: "⚡" },
  { title: "Живой HTML", desc: "Не картинка — настоящая HTML-страница которую можно открыть в браузере.", icon: "🌐" },
  { title: "Под ваш бизнес", desc: "AI создаёт уникальный дизайн под ваш конкретный бизнес, не шаблон.", icon: "🎯" },
];

const FAQ_ITEMS = [
  {
    question: "Что такое AI генератор сайтов?",
    answer: "AI генератор сайтов — инструмент который создаёт дизайн сайта по текстовому описанию вашего бизнеса. Вы описываете компанию, выбираете стиль — за 30 секунд получаете живое HTML-превью.",
  },
  {
    question: "Генератор создаёт готовый сайт?",
    answer: "Нет. Генератор создаёт дизайн-превью — живую HTML-страницу для обсуждения направления. Финальный сайт разрабатывается отдельно с вашим контентом, адаптивом и всем функционалом.",
  },
  {
    question: "Почему генератор бесплатный?",
    answer: "Это наш способ показать качество работы до того как вы заплатите. Если превью понравится — вы закажете разработку. Если нет — ничего не должны. Честная сделка.",
  },
  {
    question: "Какой AI используется для генерации?",
    answer: "Мы используем Claude от Anthropic — один из самых мощных языковых моделей на рынке. Промпты специально разработаны под веб-дизайн и адаптированы под разные ниши бизнеса.",
  },
  {
    question: "Можно ли использовать генерацию как финальный сайт?",
    answer: "Технически — HTML открывается в браузере. Практически — генерация оптимизирована для демонстрации направления, а не для продакшн-использования. Для реального сайта нужна полноценная разработка.",
  },
];

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="opacity-70">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AiGeneratorPage() {
  return (
    <main>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.25), transparent 60%)" }}
          aria-hidden="true" />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl text-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center justify-center gap-2 text-xs text-[#6B6B80]">
              <li><Link href="/" className="hover:text-[#A1A1B5] transition-colors">gotovo</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#A1A1B5]">AI генератор сайтов</li>
            </ol>
          </nav>

          <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" aria-hidden="true" />
            Бесплатно · Без регистрации · 30 секунд
          </span>

          <h1 className="reveal-up delay-1 mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            AI генератор<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              дизайна сайта
            </span>
          </h1>

          <p className="reveal-up delay-2 mt-5 mx-auto max-w-2xl text-lg leading-7 text-[#A1A1B5]">
            Опишите свой бизнес — искусственный интеллект создаст дизайн сайта за 30 секунд.{" "}
            <strong className="text-white">Бесплатно, без регистрации.</strong>{" "}
            Нравится — заказываете полноценную разработку.
          </p>

          <div className="reveal-up delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/generator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-500/40 transition hover:opacity-90 hover:-translate-y-0.5">
              <span aria-hidden="true">✦</span>
              Попробовать бесплатно
            </Link>
            <Link href="/razrabotka-sajtov-minsk"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10">
              Заказать разработку <ArrowRight />
            </Link>
          </div>

          <p className="mt-4 text-sm text-[#6B6B80]">
            AI генерирует на базе <strong className="text-[#A1A1B5]">Claude (Anthropic)</strong> — одной из лучших языковых моделей в мире
          </p>
        </div>
      </section>

      {/* ── Как работает ────────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Процесс</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Как работает AI генератор сайтов
            </h2>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4";
              return (
                <li key={step.num}
                  className={`reveal-up relative overflow-hidden rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-white/20 ${delay}`}>
                  <span className="absolute -right-2 -top-3 text-6xl font-black text-white/[0.04] select-none" aria-hidden="true">
                    {step.num}
                  </span>
                  <span className="text-3xl" aria-hidden="true">{step.icon}</span>
                  <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B6B80]">{step.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Преимущества ────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Почему генератор</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Зачем пробовать AI перед заказом сайта
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GENERATOR_ADVANTAGES.map((adv, i) => {
              const delay = i === 0 ? "delay-1" : i === 1 ? "delay-2" : i === 2 ? "delay-3" : "delay-4";
              return (
                <div key={adv.title}
                  className={`reveal-up flex flex-col rounded-2xl border border-white/10 bg-[#13131A] p-6 text-center transition hover:border-violet-500/20 hover:bg-[#1C1C28] ${delay}`}>
                  <span className="text-4xl" aria-hidden="true">{adv.icon}</span>
                  <h3 className="mt-4 font-semibold text-white">{adv.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6B6B80]">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEO текст ───────────────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <article>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              AI генератор сайтов — новый стандарт в веб-разработке
            </h2>
            <p className="mt-4 text-[#A1A1B5] leading-7">
              Традиционный процесс разработки сайта: месяц переговоров, бриф,
              несколько итераций макетов в Figma — и только потом вы видите
              результат. gotovo меняет этот процесс радикально. Наш AI-генератор
              основан на Claude от Anthropic — одной из самых мощных языковых
              моделей, специально настроенной на создание веб-дизайна.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-white">
              Чем AI-генератор отличается от конструкторов типа Tilda
            </h3>
            <p className="mt-3 text-[#A1A1B5] leading-7">
              Конструкторы дают шаблоны — вы подстраиваете бизнес под шаблон.
              Наш генератор создаёт уникальный дизайн под ваш конкретный бизнес —
              стоматология будет выглядеть как стоматология, тату-салон как тату-салон,
              а не как один и тот же шаблон с разными цветами.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-white">
              AI как часть процесса разработки
            </h3>
            <p className="mt-3 text-[#A1A1B5] leading-7">
              Генератор — это первый шаг, а не конечный продукт. Превью показывает
              направление: цвета, структуру, общее ощущение от сайта. После того
              как вы одобряете направление — мы разрабатываем финальный сайт
              с вашим реальным контентом, полным адаптивом и всем необходимым
              функционалом для работы в продакшн.
            </p>
          </article>

          {/* Ссылки */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/razrabotka-sajtov-minsk", label: "Разработка в Минске", desc: "Заказать готовый сайт" },
              { href: "/razrabotka-sajtov-ceny", label: "Цены на разработку", desc: "От 500$ за лендинг" },
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

      <Faq
        title="Вопросы об AI генераторе сайтов"
        subtitle="Как это работает и что вы получаете"
        items={FAQ_ITEMS}
      />

      {/* ── Финальный CTA — на сам генератор ───────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#13131A] to-blue-500/5 p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute inset-0 rounded-3xl" aria-hidden="true"
              style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.25), transparent 70%)" }} />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Готовы попробовать?</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Опишите бизнес — получите дизайн за 30 секунд
              </h2>
              <p className="mt-4 text-[#A1A1B5]">
                Бесплатно. Без регистрации. Нравится — обсудим разработку.
              </p>
              <Link href="/generator"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
                <span aria-hidden="true">✦</span> Запустить AI генератор
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
