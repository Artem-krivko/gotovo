import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gotovo.studio";

export const metadata: Metadata = {
  title: "Создание сайтов для бизнеса — под ключ с AI-дизайном | gotovo",
  description:
    "Разработка сайтов для малого и среднего бизнеса. Лендинги от 500$, корпоративные от 800$. AI покажет дизайн за 30 сек до оплаты. Работаем по Беларуси.",
  alternates: { canonical: `${SITE_URL}/sozdanie-sajtov-dlya-biznesa` },
  openGraph: {
    title: "Создание сайтов для бизнеса | gotovo",
    description: "Лендинги и корпоративные сайты под ключ. AI-превью до оплаты. От 500$.",
    url: `${SITE_URL}/sozdanie-sajtov-dlya-biznesa`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Создание сайтов для бизнеса",
    provider: { "@type": "ProfessionalService", name: "gotovo", url: SITE_URL },
    areaServed: { "@type": "Country", name: "Беларусь" },
    description: "Разработка сайтов для малого и среднего бизнеса под ключ",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Какой сайт нужен малому бизнесу?",
        acceptedAnswer: { "@type": "Answer", text: "Для большинства малых бизнесов достаточно лендинга (от 500$) — если продвигаете одну услугу. Корпоративный сайт (от 800$) нужен когда несколько направлений и нужна страница 'О компании'. Попробуйте AI-генератор — он покажет оба варианта за 30 секунд." },
      },
      {
        "@type": "Question",
        name: "Нужен ли сайт если есть Instagram?",
        acceptedAnswer: { "@type": "Answer", text: "Сайт и соцсети дополняют друг друга. Сайт даёт SEO-трафик из Google и Яндекса, работает 24/7 без алгоритмов соцсетей, вызывает больше доверия у B2B клиентов и позволяет запускать рекламу на конкретный лендинг." },
      },
    ],
  },
];

const BUSINESS_TYPES = [
  { icon: "☕", title: "Кафе и рестораны", desc: "Меню, атмосфера, бронирование столиков, акции" },
  { icon: "💅", title: "Салоны красоты", desc: "Услуги, мастера, онлайн-запись, портфолио работ" },
  { icon: "🏥", title: "Медицина и клиники", desc: "Врачи, услуги, расписание, онлайн-запись" },
  { icon: "⚖️", title: "Юридические услуги", desc: "Практики, кейсы, доверие, консультация" },
  { icon: "🏗️", title: "Строительство", desc: "Услуги, портфолио объектов, расчёт стоимости" },
  { icon: "🎓", title: "Образование и курсы", desc: "Программы, преподаватели, отзывы, запись" },
];

const FAQ_ITEMS = [
  {
    question: "Какой сайт нужен малому бизнесу?",
    answer: "Для большинства малых бизнесов достаточно лендинга (от 500$) — если продвигаете одну услугу. Корпоративный сайт (от 800$) нужен когда несколько направлений. Попробуйте AI-генератор — покажет оба варианта за 30 секунд.",
  },
  {
    question: "Нужен ли сайт если есть Instagram и группа ВКонтакте?",
    answer: "Сайт и соцсети дополняют друг друга. Сайт даёт SEO-трафик из Google, работает 24/7 без алгоритмов, вызывает больше доверия у B2B клиентов и позволяет запускать таргетированную рекламу на конкретный лендинг.",
  },
  {
    question: "Как быстро окупится вложение в сайт?",
    answer: "Зависит от бизнеса. Лендинг за 500$ окупается при одном-двух дополнительных клиентах в месяц для большинства услуговых бизнесов. Ключевое — правильная структура и подключение рекламного трафика.",
  },
  {
    question: "Можно ли потом самостоятельно редактировать сайт?",
    answer: "Да. После сдачи проекта вы получаете полный доступ к хостингу и коду. Также можно добавить простую CMS для управления контентом — обсуждается при заказе.",
  },
  {
    question: "Вы работаете с ИП и небольшими компаниями?",
    answer: "Да, большинство наших клиентов — ИП и малый бизнес. Порог входа от 500$, оплата 50/50.",
  },
];

function ArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="opacity-70">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SozdanieSajtovPage() {
  return (
    <main>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0F] px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,58,237,0.2), transparent 60%)" }}
          aria-hidden="true" />
        <div className="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl text-center">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center justify-center gap-2 text-xs text-[#6B6B80]">
              <li><Link href="/" className="hover:text-[#A1A1B5] transition-colors">gotovo</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#A1A1B5]">Сайты для бизнеса</li>
            </ol>
          </nav>

          <span className="reveal-up inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            Малый и средний бизнес · Беларусь
          </span>

          <h1 className="reveal-up delay-1 mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Создание сайтов<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              для бизнеса под ключ
            </span>
          </h1>

          <p className="reveal-up delay-2 mt-5 mx-auto max-w-2xl text-lg leading-7 text-[#A1A1B5]">
            Разрабатываем сайты для малого и среднего бизнеса в Беларуси.{" "}
            <strong className="text-white">AI-генератор покажет дизайн вашего сайта за 30 секунд</strong>{" "}
            — бесплатно, до оплаты.
          </p>

          <div className="reveal-up delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/generator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition hover:opacity-90 hover:-translate-y-0.5">
              <span aria-hidden="true">✦</span> Попробовать генератор
            </Link>
            <Link href="/contacts"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:bg-white/10">
              Оставить заявку <ArrowRight />
            </Link>
          </div>

          {/* Метрики */}
          <div className="reveal-up delay-4 mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: "от 500$", label: "Лендинг" },
              { value: "от 800$", label: "Корпоративный" },
              { value: "7–14 дней", label: "Срок" },
              { value: "50/50", label: "Оплата" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-white/10 bg-[#13131A] px-4 py-4 text-center">
                <p className="text-lg font-bold text-white">{m.value}</p>
                <p className="mt-0.5 text-xs text-[#6B6B80]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Для каких бизнесов ───────────────────────────────────────────────── */}
      <section className="bg-[#16161F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">Ниши</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Для каких бизнесов мы делаем сайты
            </h2>
            <p className="mt-3 text-[#A1A1B5]">Опыт в десятках ниш — знаем что работает в каждой</p>
          </div>

          {/* Мобилка: snap-scroll */}
          <div className="-mx-4 mt-10 overflow-x-auto px-4 sm:hidden">
            <div className="flex gap-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
              {BUSINESS_TYPES.map((b) => (
                <div key={b.title}
                  className="flex w-[80vw] max-w-[280px] shrink-0 flex-col rounded-2xl border border-white/10 bg-[#13131A] p-5"
                  style={{ scrollSnapAlign: "start" }}>
                  <span className="text-3xl" aria-hidden="true">{b.icon}</span>
                  <h3 className="mt-3 font-semibold text-white">{b.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#6B6B80]">{b.desc}</p>
                </div>
              ))}
              <div className="w-4 shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Десктоп: 3×2 */}
          <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-3">
            {BUSINESS_TYPES.map((b, i) => {
              const delay = i < 2 ? "delay-1" : i < 4 ? "delay-2" : "delay-3";
              return (
                <div key={b.title}
                  className={`reveal-up rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-violet-500/20 hover:bg-[#1C1C28] sm:p-7 ${delay}`}>
                  <span className="text-3xl" aria-hidden="true">{b.icon}</span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{b.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#A1A1B5]">{b.desc}</p>
                  <Link href="/generator"
                    className="mt-4 inline-flex items-center gap-1 text-sm text-violet-400 transition-colors hover:text-violet-300">
                    Посмотреть пример <ArrowRight />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEO-текст ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0F] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <article>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Почему бизнесу нужен профессиональный сайт
            </h2>
            <p className="mt-4 text-[#A1A1B5] leading-7">
              Сайт — это единственный цифровой актив который полностью принадлежит вам.
              Instagram могут заблокировать, алгоритмы соцсетей постоянно меняются,
              а сайт работает 24/7 и приводит клиентов из поисковых систем без
              постоянных вложений в рекламу.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-white">
              AI-разработка: быстрее и дешевле без потери качества
            </h3>
            <p className="mt-3 text-[#A1A1B5] leading-7">
              gotovo использует AI для ускорения прототипирования и базовой верстки.
              Это позволяет сократить срок разработки с 4–6 недель до 7–14 дней,
              и предложить конкурентную цену. При этом все ключевые решения —
              структура, логика, UX — принимаются человеком.
            </p>

            <h3 className="mt-8 text-xl font-semibold text-white">
              Работаем по всей Беларуси
            </h3>
            <p className="mt-3 text-[#A1A1B5] leading-7">
              Полностью удалённый формат работы: Минск, Гомель, Брест, Гродно,
              Витебск, Могилёв. Оплата удобным для вас способом.
            </p>
          </article>

          {/* Внутренние ссылки */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              { href: "/razrabotka-sajtov-minsk", label: "Разработка в Минске", desc: "Основная гео-страница" },
              { href: "/lending-minsk", label: "Лендинги в Минске", desc: "От 500$ за 7–10 дней" },
              { href: "/razrabotka-sajtov-ceny", label: "Цены на разработку", desc: "Подробные тарифы" },
              { href: "/ai-generator-sajta", label: "AI-генератор сайтов", desc: "Превью за 30 секунд" },
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
        title="Вопросы о сайтах для бизнеса"
        subtitle="Честно и по существу"
        items={FAQ_ITEMS}
      />

      <Cta
        title="Создайте сайт для вашего бизнеса"
        subtitle="Попробуйте генератор — бесплатный превью дизайна за 30 секунд. Или оставьте заявку."
        button="Попробовать генератор"
      />
    </main>
  );
}
