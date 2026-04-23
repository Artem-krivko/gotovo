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

export const CONTACT_METHODS: ContactMethod[] = [
  {
    label: "Email",
    value: "info@usegotovo.by",
    href: "mailto:info@usegotovo.by",
    note: "Отвечаем обычно в течение нескольких часов",
  },
  {
    label: "Телефон",
    value: "+375 29 633-33-37",
    href: "tel:+375296333337",
    note: "Пн–Пт 9:00–18:00",
  },
];

export const AFTER_STEPS: AfterStep[] = [
  {
    num: "01",
    title: "Отвечу в течение нескольких часов",
    description: "Напишу на email или перезвоню — в зависимости от того что указали в форме.",
  },
  {
    num: "02",
    title: "Уточним задачу",
    description: "Короткий разговор или переписка чтобы понять что нужно и какой формат подойдёт.",
  },
  {
    num: "03",
    title: "Предложу решение и старт",
    description: "Расскажу какой пакет подходит, назову точную цену и сроки. Если хочется — начнём с генератора.",
  },
];
