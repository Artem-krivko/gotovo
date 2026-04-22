// content/services.ts
// Все данные для страницы /services

export interface ServiceFormat {
  title: string;
  description: string;
  price: string;
  duration: string;
  bullets: string[];
  colorClasses: string;
  iconColorClass: string;
}

export interface AudienceItem {
  title: string;
  description: string;
  points: string[];
  badge: string;
  colorClasses: string;
}

export interface OutcomeItem {
  title: string;
  description: string;
  accent: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// ─── Форматы работы ───────────────────────────────────────────────────────────

export const SERVICE_FORMATS: ServiceFormat[] = [
  {
    title: "Лендинг",
    description:
      "Одностраничный сайт для услуги, оффера или рекламной кампании. Фокус на одном действии — заявке или звонке.",
    price: "€500–700",
    duration: "7–10 дней",
    bullets: ["Быстрый запуск", "Фокус на конверсии", "Чёткая структура под оффер"],
    colorClasses: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50",
    iconColorClass: "text-blue-600",
  },
  {
    title: "Бизнес-сайт",
    description:
      "Полноценный сайт с несколькими страницами для компании. Системная подача услуг, навигация, доверие.",
    price: "€800–1200",
    duration: "10–14 дней",
    bullets: ["Системная подача услуг", "Удобная навигация", "База для роста"],
    colorClasses: "border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50",
    iconColorClass: "text-violet-600",
  },
  {
    title: "Запуск + SEO",
    description:
      "Подготовка сайта к индексации и нормальному старту. Мета, аналитика, sitemap — всё чтобы сайт работал.",
    price: "€150–250",
    duration: "3–5 дней",
    bullets: ["Meta и Open Graph", "Sitemap и аналитика", "Подготовка к росту"],
    colorClasses: "border-cyan-200 bg-gradient-to-br from-cyan-50 to-sky-50",
    iconColorClass: "text-cyan-600",
  },
];

// ─── Для кого ────────────────────────────────────────────────────────────────

export const AUDIENCE_ITEMS: AudienceItem[] = [
  {
    title: "Услуги и локальный бизнес",
    description: "Нужен сайт который вызывает доверие и приводит заявки — быстро и без лишнего.",
    points: ["Быстрый запуск", "Форма заявки", "Доверие с первого экрана"],
    badge: "Частый сценарий",
    colorClasses: "border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50",
  },
  {
    title: "Эксперты и специалисты",
    description: "Нужен сильный лендинг или персональный сайт — упаковать экспертизу и получать клиентов.",
    points: ["Личный бренд", "Упаковка услуг", "Сильный оффер"],
    badge: "Для экспертов",
    colorClasses: "border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50",
  },
  {
    title: "Малый и средний бизнес",
    description: "Нужен рабочий инструмент с понятной структурой — не просто красивый, а приносящий результат.",
    points: ["Понятная структура", "Масштабируемость", "Рабочий сайт"],
    badge: "Для бизнеса",
    colorClasses: "border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-violet-50",
  },
  {
    title: "B2B и корпоративные",
    description: "Нужно выглядеть профессионально и системно презентовать услуги партнёрам и клиентам.",
    points: ["Профессиональный вид", "Системная подача", "Ясная логика"],
    badge: "Для компаний",
    colorClasses: "border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50",
  },
];

// ─── Что входит в результат ───────────────────────────────────────────────────

export const OUTCOME_ITEMS: OutcomeItem[] = [
  {
    title: "Структура под задачу",
    description: "Не шаблон — каждая страница строится под ваш сценарий продаж.",
    accent: "bg-violet-500",
  },
  {
    title: "Адаптив и UX",
    description: "Корректно работает на мобильных. Пользователь легко находит нужное.",
    accent: "bg-blue-500",
  },
  {
    title: "Формы и заявки",
    description: "Точки захвата настроены и проверены. Заявки приходят сразу.",
    accent: "bg-fuchsia-500",
  },
  {
    title: "Базовое SEO",
    description: "Meta, Open Graph, Sitemap — сайт индексируется правильно с первого дня.",
    accent: "bg-cyan-500",
  },
  {
    title: "Запуск без хаоса",
    description: "Домен, хостинг, аналитика — всё настроено и проверено перед стартом.",
    accent: "bg-indigo-500",
  },
  {
    title: "Основа для роста",
    description: "Сайт легко расширять: новые страницы, блоки, интеграции — без переделки с нуля.",
    accent: "bg-emerald-500",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export const SERVICES_FAQ: FaqItem[] = [
  {
    question: "Что выбрать: лендинг или бизнес-сайт?",
    answer:
      "Если нужно быстро запустить одну услугу или оффер — лендинг. Если нужно раскрыть компанию, несколько услуг и выстроить доверие — бизнес-сайт. Если не уверены — попробуйте генератор: он покажет оба варианта.",
  },
  {
    question: "Можно ли начать с лендинга и расширить позже?",
    answer:
      "Да, это нормальный сценарий. Стартуете с одной страницей, проверяете гипотезу, затем добавляете страницы и функциональность. Код пишется так чтобы это было просто.",
  },
  {
    question: "Нужны ли тексты и фото заранее?",
    answer:
      "Не обязательно. Можно начать с черновых материалов и доработать по ходу. Если нет текстов совсем — помогу с базовым контентом под ваш бизнес.",
  },
  {
    question: "Сколько занимает разработка?",
    answer:
      "Лендинг — 7–10 рабочих дней, бизнес-сайт — 10–14. Срок считается от согласования прототипа и получения материалов, не от первого контакта.",
  },
  {
    question: "Чем кастомная разработка лучше конструктора?",
    answer:
      "Конструктор быстрее и дешевле на старте, но ограничивает вас шаблоном. Кастомный сайт строится под вашу логику продаж, легче масштабируется и не похож на соседа по нише.",
  },
];
