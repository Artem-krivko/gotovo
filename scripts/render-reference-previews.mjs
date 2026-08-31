// Renders deterministic HTML fixtures for the viewport probe. This deliberately
// avoids AI and external image APIs: the goal is to exercise every composition
// with stable copy before a release.

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

import { composePage } from "../lib/design/compose.ts"
import { curateDesignDirections } from "../lib/design/directions.ts"
import { REFERENCE_BRIEFS } from "../lib/design/reference-briefs.ts"
import { baseSpecFor } from "../lib/design/spec.ts"

const outputDir = resolve(process.argv[2] ?? ".reference-previews")
const selectedIds = new Set(
  process.argv.slice(3).length
    ? process.argv.slice(3)
    : ["dental", "septic-installation", "gym", "wedding-photo"]
)

const fixtureFiles = [
  "public/images/generator/dentist-preview.png",
  "public/images/generator/gym-preview.png",
  "public/images/generator/coffee-preview.png",
  "public/templates/t1.png",
]
const PIXELS = await Promise.all(fixtureFiles.map(async (file) =>
  (await readFile(resolve(file))).toString("base64")
))

function assetsFor(brief) {
  const gallery = PIXELS.map((pixel, index) => ({
    url: `data:image/png;base64,${pixel}`,
    alt: `${brief.businessType}: визуальный пример ${index + 1}`,
  }))
  return {
    hero: gallery[0],
    gallery: gallery.slice(1),
    roles: {
      service: gallery[1], process: gallery[2], proof: gallery[3],
      before: brief.beforeAfter ? gallery[1] : undefined,
      after: brief.beforeAfter ? gallery[2] : undefined,
    },
  }
}

function contentFor(brief) {
  return {
    businessName: brief.businessName ?? brief.businessType,
    headline: brief.userDescription.split(/[.!?]/)[0].slice(0, 100),
    subheadline: brief.userDescription,
    tagline: brief.businessType,
    services: [
      { name: "Основная услуга", description: "Понятный состав работ и ожидаемый результат для клиента.", price: brief.priceFrom },
      { name: "Второе направление", description: "Дополнительная услуга, которая дополняет основное предложение." },
      { name: "Консультация", description: "Уточняем задачу и предлагаем подходящий формат работы." },
    ],
    features: [
      { title: "Уточняем задачу", description: "Собираем вводные и согласуем ожидаемый результат." },
      { title: "Предлагаем решение", description: "Подбираем структуру работ под конкретные условия." },
      { title: "Проверяем результат", description: "Контролируем качество на ключевых этапах." },
    ],
    // Подтверждённые тестовые метрики нужны, чтобы viewport-проверка
    // действительно проходила по всем вариантам trust-секции.
    stats: [
      { value: "12", label: "лет опыта", verified: true },
      { value: "240", label: "выполненных проектов", verified: true },
      { value: "18", label: "специалистов", verified: true },
    ],
    testimonial: null,
    ctaHeadline: "Обсудить задачу",
    ctaSubtext: "Расскажите о проекте — предложим следующий шаг.",
    phone: "+375 29 000-00-00",
    email: "info@example.by",
    footerTagline: "Черновик концепта",
    guarantees: [],
    geography: brief.geography,
    advantages: brief.advantages ?? [],
    caseStudies: brief.caseStudy ? [brief.caseStudy] : [],
    teamMembers: brief.teamMember ? [brief.teamMember] : [],
    serviceAreas: brief.serviceAreas ?? [],
    beforeAfter: brief.beforeAfter === true,
  }
}

await mkdir(outputDir, { recursive: true })
const files = []
for (const brief of REFERENCE_BRIEFS.filter((item) => selectedIds.has(item.id))) {
  const content = contentFor(brief)
  const directions = curateDesignDirections(
    baseSpecFor(brief.style),
    brief.style,
    brief.businessType,
    brief.userDescription
  )
  for (const direction of directions) {
    const file = resolve(outputDir, `${brief.id}-${direction.id}.html`)
    await writeFile(file, composePage(content, direction.spec, assetsFor(brief)).html, "utf8")
    files.push(file)
  }
}

console.log(files.join("\n"))
