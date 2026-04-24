// content/generator-cases.ts

export interface GeneratorCase {
  id: number;
  label: string;
  prompt: string;
  image: string | null;
  colorClasses: string;
  accentClass: string;
  category: string;
}

export const GENERATOR_CASES: GeneratorCase[] = [
  {
    id: 1,
    label: "Стоматология",
    prompt: "Современная стоматологическая клиника — белый, синий, профессионализм и доверие",
    image: "/images/generator/dentist-preview.svg",
    colorClasses: "from-sky-900/40 to-blue-950/60",
    accentClass: "bg-blue-500",
    category: "Медицина",
  },
  {
    id: 2,
    label: "Тату-салон",
    prompt: "Авторский тату-салон — тёмная тема, эстетика, портфолио мастеров",
    image: "/images/generator/tattoo-preview.svg",
    colorClasses: "from-zinc-900/60 to-neutral-950/80",
    accentClass: "bg-zinc-400",
    category: "Красота",
  },
  {
    id: 3,
    label: "Спортзал",
    prompt: "Фитнес-клуб премиум класса — энергия, тёмный фон, оранжевый акцент",
    image: "/images/generator/gym-preview.svg",
    colorClasses: "from-orange-900/40 to-zinc-950/60",
    accentClass: "bg-orange-500",
    category: "Спорт",
  },
];
