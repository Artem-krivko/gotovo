// content/contacts.ts

export interface ContactMethod {
  label: string;
  value: string;
  href: string;
  note: string;
}

export interface AfterStep {
  num: string;
  title: string;
  description: string;
}

// ─── Контактные данные ────────────────────────────────────────────────────────
// ЗАМЕНИ на свои реальные контакты

export const CONTACT_METHODS: ContactMethod[] = [
  {
    label: "Telegram",
    value: "@yourusername",
    href: "https://t.me/yourusername",
    note: "Отвечаю обычно в течение 1–2 часов",
  },
  {
    label: "Email",
    value: "hello@ai-web-studio.dev",
    href: "mailto:hello@ai-web-studio.dev",
    note: "Для формальных запросов и брифов",
  },
];

// ─── Что будет после заявки ───────────────────────────────────────────────────

export const AFTER_STEPS: AfterStep[] = [
  {
    num: "01",
    title: "Отвечу в течение нескольких часов",
    description:
      "Напишу в Telegram или на email — в зависимости от того что указали в форме.",
  },
  {
    num: "02",
    title: "Уточним задачу",
    description:
      "Короткий разговор или переписка чтобы понять что нужно и какой формат подойдёт.",
  },
  {
    num: "03",
    title: "Предложу решение и старт",
    description:
      "Расскажу какой пакет подходит, назову точную цену и сроки. Если хочется — начнём с генератора.",
  },
];
