// content/generator-cases.ts

export interface GeneratorCase {
  id: number
  label: string
  prompt: string
  image: string | null
  video?: string | null
  category: string
  accent: {
    border: string
    glow: string
    badge: string
    dot: string
  }
  fallbackGradient: string
  styleTag: string
  featured?: boolean
}

export const GENERATOR_CASES: GeneratorCase[] = [
  {
    id: 1,
    label: "Стоматология",
    prompt: "Современная клиника — чистый дизайн, доверие и технологии",
    image: "/images/generator/dentist-preview.png",
    category: "Медицина",
    accent: {
      border: "border-sky-500/30",
      glow: "hover:shadow-sky-500/15",
      badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      dot: "bg-sky-400",
    },
    fallbackGradient: "from-sky-950 to-blue-950",
    styleTag: "Чистый · Доверие",
  },
  {
    id: 2,
    label: "Тату-салон",
    prompt: "Авторский тату — тёмная эстетика, портфолио мастеров, характер",
    image: "/images/generator/tattoo-preview.png",
    category: "Красота",
    accent: {
      border: "border-zinc-500/30",
      glow: "hover:shadow-zinc-500/15",
      badge: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
      dot: "bg-zinc-300",
    },
    fallbackGradient: "from-zinc-900 to-neutral-950",
    styleTag: "Тёмный · Характер",
  },
  {
    id: 3,
    label: "Фитнес-клуб",
    prompt: "Премиум спортзал — энергия, мощь, яркий акцент на чёрном",
    image: "/images/generator/gym-preview.png",
    category: "Спорт",
    accent: {
      border: "border-orange-500/30",
      glow: "hover:shadow-orange-500/15",
      badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      dot: "bg-orange-400",
    },
    fallbackGradient: "from-orange-950 to-zinc-950",
    styleTag: "Энергия · Премиум",
  },
  {
    id: 4,
    label: "Кофейня",
    prompt: "Specialty кофе — тёплая атмосфера, авторские десерты, уют",
    image: "/images/generator/coffee-preview.png",
    category: "Еда",
    accent: {
      border: "border-amber-500/30",
      glow: "hover:shadow-amber-500/15",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dot: "bg-amber-400",
    },
    fallbackGradient: "from-amber-950 to-stone-950",
    styleTag: "Тёплый · Уютный",
  },
  {
    id: 5,
    label: "Юридическая компания",
    prompt: "Юридические услуги B2B — авторитет, строгость и доверие",
    image: "/images/generator/legal-preview.png",
    category: "B2B",
    accent: {
      border: "border-emerald-500/30",
      glow: "hover:shadow-emerald-500/15",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    fallbackGradient: "from-emerald-950 to-slate-950",
    styleTag: "Авторитет · B2B",
  },
]
