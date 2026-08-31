// lib/design/content.ts — модель контента с разделением по достоверности.
//
// Ключевая идея: контент — это не один мешок строк. У каждого утверждения есть
// происхождение, и от него зависит, можно ли его показывать как факт.
//
//   verifiedFacts  — то, что владелец бизнеса указал сам. Показываем как факт.
//   placeholders   — явно помеченные заглушки. Показываем как «здесь будет».
//   generatedCopy  — текст от модели: описывает суть и процесс, но не
//                    утверждает достижений и не содержит цифр.
//   assumptions    — гипотезы модели об аудитории и оффере. НЕ рендерятся,
//                    используются только для планирования структуры.
//
// Раньше всё это было одним уровнем: модель писала «847 довольных клиентов»
// и отзыв за подписью выдуманного человека, и на странице это выглядело
// ровно так же достоверно, как реальные данные.

/** Факты, подтверждённые владельцем бизнеса. Только их можно утверждать. */
export interface VerifiedFacts {
  yearsInBusiness?: string
  projectsCompleted?: string
  clientsPerMonth?: string
  teamSize?: string
  priceFrom?: string
  geography?: string
  guarantees?: string[]
  certifications?: string[]
  /** Реальные отзывы. Пустой массив → блок отзывов не рендерится. */
  testimonials?: Array<{ text: string; author: string; role: string }>
  caseStudies?: Array<{ title: string; summary: string; result?: string }>
  teamMembers?: Array<{ name: string; role: string }>
  serviceAreas?: string[]
}

/** Внутреннее планирование. Никогда не попадает в разметку. */
export interface Assumptions {
  audience?: string
  mainAction?: string
  objections?: string[]
  offerAngle?: string
}

export interface Stat {
  value: string
  label: string
  /**
   * false → значение не подтверждено, рендерится как «—» с подписью метрики.
   * Это честнее, чем выдуманное число, и одновременно показывает владельцу,
   * какие цифры стоит прислать.
   */
  verified: boolean
}

export interface Service {
  name: string
  description: string
  price?: string
}

export interface Feature {
  title: string
  description: string
}

export interface Testimonial {
  text: string
  author: string
  role: string
}

export interface ImageAsset {
  url: string
  alt: string
  /** Responsive candidates assembled from a trusted image provider. */
  srcSet?: string
  sizes?: string
  credit?: { name: string; url: string }
}

/** Visual assets vary by concept, while the generated copy is shared. */
export interface PageAssets {
  hero?: ImageAsset
  gallery: ImageAsset[]
  /** Кадры с разными задачами не должны случайно повторять hero. */
  roles?: {
    service?: ImageAsset
    process?: ImageAsset
    proof?: ImageAsset
    before?: ImageAsset
    after?: ImageAsset
  }
}

export interface PageContent {
  businessName: string
  headline: string
  subheadline: string
  tagline: string
  services: Service[]
  features: Feature[]
  stats: Stat[]
  /** null, если реального отзыва нет. Выдумывать запрещено. */
  testimonial: Testimonial | null
  ctaHeadline: string
  ctaSubtext: string
  phone: string
  email: string
  footerTagline: string
  geography?: string
  /** Подтверждённые гарантии — рендерятся, только если они реальны. */
  guarantees: string[]
  /** Только формулировки, которые ввёл сам владелец. */
  advantages: string[]
  /** Только подтверждённые владельцем кейсы и участники команды. */
  caseStudies: Array<{ title: string; summary: string; result?: string }>
  teamMembers: Array<{ name: string; role: string }>
  serviceAreas: string[]
  /** Рендерится только после явного подтверждения владельца. */
  beforeAfter: boolean
}

/**
 * Собирает stats из подтверждённых фактов, а недостающие превращает в
 * честные placeholder'ы.
 */
export function buildStats(facts: VerifiedFacts): Stat[] {
  const candidates: Array<[string | undefined, string]> = [
    [facts.yearsInBusiness, "лет на рынке"],
    [facts.projectsCompleted, "выполненных проектов"],
    [facts.clientsPerMonth, "клиентов в месяц"],
    [facts.teamSize, "специалистов в команде"],
  ]

  const verified = candidates
    .filter(([value]) => Boolean(value?.trim()))
    .map(([value, label]) => ({ value: value!.trim(), label, verified: true }))

  if (verified.length >= 3) return verified.slice(0, 3)

  const placeholders = candidates
    .filter(([value]) => !value?.trim())
    .map(([, label]) => ({ value: "—", label, verified: false }))

  return [...verified, ...placeholders].slice(0, 3)
}
