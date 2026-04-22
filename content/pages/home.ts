import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Создание сайтов для бизнеса — AI Web Studio",
  description:
    "Разработка сайтов с AI-генератором дизайна. Увидите результат до оплаты — опишите бизнес, получите превью за 30 секунд.",
};

// ─── Типы ────────────────────────────────────────────────────────────────────

type HeroMetric = { value: string; label: string };
type CtaButton = { label: string; href: string };

type HeroContent = {
  badge: string;
  title: string;
  accent: string;
  subtitle: string;
  cta: { primary: CtaButton; secondary?: CtaButton };
  metrics: HeroMetric[];
};

type ServiceItem = { title: string; description: string; image: string };
type ServicesContent = { title: string; subtitle?: string; items: ServiceItem[] };

type ProcessStep = { title: string; description: string };
type ProcessContent = { title: string; subtitle: string; steps: ProcessStep[] };

type FaqItem = { question: string; answer: string };
type FaqContent = { title: string; subtitle?: string; items: FaqItem[] };

type CtaContent = { title: string; subtitle: string; button: string };

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured: boolean;
};
type PricingContent = { title: string; subtitle: string; plans: PricingPlan[] };

export type HomePageContent = {
  hero: HeroContent;
  services: ServicesContent;
  process: ProcessContent;
  faq: FaqContent;
  cta: CtaContent;
  pricing: PricingContent;
};

// ─── Контент ─────────────────────────────────────────────────────────────────

export const homeContent: HomePageContent = {

  hero: {
    badge: "AI-генератор дизайна сайтов",
    title: "Увидите свой сайт",
    accent: "до того как заплатите",
    subtitle:
      "Опишите бизнес — ИИ создаст дизайн за 30 секунд. Понравится — оформим разработку. Не понравится — ничего не должны.",
    cta: {
      primary: { label: "Сгенерировать дизайн", href: "/generator" },
      // Ведёт на страницу /process — там подробный разбор всех этапов
      secondary: { label: "Как это работает", href: "/process" },
    },
    metrics: [
      { value: "30 сек", label: "время генерации дизайна" },
      { value: "7–14 дней", label: "срок разработки" },
      { value: "Бесплатно", label: "превью без оплаты" },
    ],
  },

  services: {
    title: "Что делаем",
    subtitle:
      "Сайты под задачи бизнеса — от лендингов до многостраничных проектов.",
    items: [
      {
        title: "Лендинги",
        description:
          "Продающие одностраничные сайты для услуг, офферов и рекламных кампаний.",
        image: "/images/services/landing.jpg",
      },
      {
        title: "Корпоративные сайты",
        description:
          "Полноценные сайты для компаний с понятной структурой и сильной презентацией.",
        image: "/images/services/busines.jpg",
      },
      {
        title: "SEO-подготовка",
        description:
          "Техническая подготовка сайта под поисковые системы и дальнейший рост трафика.",
        image: "/images/services/seo.jpg",
      },
    ],
  },

  process: {
    title: "Процесс работы",
    subtitle:
      "От первого контакта до запуска — понятный процесс без сюрпризов.",
    steps: [],
  },

  pricing: {
    title: "Пакеты разработки",
    subtitle: "Фиксированные форматы — понятные сроки, объём и результат.",
    plans: [
      {
        name: "Лендинг",
        price: "€500–700",
        description: "Для услуг, экспертов и малого бизнеса",
        featured: false,
        features: [
          "1 страница (до 7–9 секций)",
          "Индивидуальная структура",
          "Адаптивная верстка",
          "Форма заявки",
          "Базовое SEO",
          "2 круга правок",
        ],
      },
      {
        name: "Бизнес-сайт",
        price: "€800–1200",
        description: "Для компаний, которым нужен полноценный сайт",
        featured: true,
        features: [
          "5–7 страниц",
          "Главная, услуги, о компании, контакты",
          "Единая дизайн-система",
          "Формы и интеграции",
          "Базовое SEO",
          "2–3 круга правок",
        ],
      },
      {
        name: "SEO-старт",
        price: "€150–250",
        description: "Дополнение к любому пакету",
        featured: false,
        features: [
          "Meta и Open Graph",
          "Sitemap и robots.txt",
          "Подключение аналитики",
          "Базовая семантика",
          "Рекомендации по росту",
        ],
      },
    ],
  },

  faq: {
    title: "Частые вопросы",
    subtitle:
      "Отвечаю на то, что чаще всего спрашивают до старта проекта.",
    items: [
      {
        question: "Генератор — это финальный сайт?",
        answer:
          "Нет. Генератор создаёт дизайн-превью чтобы вы увидели направление до оплаты. Финальный сайт разрабатывается отдельно — с вашим контентом, адаптивом и всеми нужными функциями.",
      },
      {
        question: "Сколько стоит сайт?",
        answer:
          "Лендинг от €500, многостраничный сайт от €800. Конкретная цена зависит от структуры и объёма — обсуждаем после первого контакта. Никаких скрытых платежей.",
      },
      {
        question: "Сколько времени занимает разработка?",
        answer:
          "Лендинг — 7–10 рабочих дней. Бизнес-сайт — 10–14 дней. Срок считается от момента согласования прототипа и получения материалов.",
      },
      {
        question: "Нужно ли готовить материалы заранее?",
        answer:
          "Желательно, но не обязательно. Если текстов и фото нет — помогу с базовым контентом. Это займёт чуть больше времени, но результат будет.",
      },
      {
        question: "Как происходит оплата?",
        answer:
          "50% предоплата перед стартом разработки, 50% после финального согласования перед запуском. Работаю с переводом на карту или PayPal.",
      },
      {
        question: "Что если результат не понравится?",
        answer:
          "Поэтому и существует генератор — вы видите направление до денег. В процессе разработки есть 2–3 круга правок. Если что-то идёт не так — обсуждаем и решаем.",
      },
    ],
  },

  cta: {
    title: "Готовы увидеть свой сайт?",
    subtitle:
      "Попробуйте генератор — это бесплатно и займёт 30 секунд. Или оставьте заявку и я свяжусь с вами напрямую.",
    button: "Сгенерировать дизайн",
  },
};
