// lib/design/compose.ts — сборка страницы из DesignSpec + PageContent.
//
// Это замена прежнему fillTemplate: вместо выбора одного из четырёх монолитов
// страница собирается по spec.sectionOrder из библиотеки вариантов. Композиция
// стала данными, а значит её можно менять без повторной генерации контента
// (см. adjustSpec) и проверять автоматически (см. quality gate).

import {
  escapeClamped,
  escapeHtml,
  safeImageSrc,
  safeMailtoHref,
  safeTelHref,
  safeUrl,
} from "../html.ts"
import type { DesignSpec, SectionId } from "./spec.ts"
import type { ImageAsset, PageAssets, PageContent } from "./content.ts"
import { buildTokens, tokensToCss } from "./tokens.ts"
import {
  BASE_CSS,
  backgroundLayer,
  contactSection,
  advantagesSection,
  casesSection,
  pricingSection,
  teamSection,
  areaSection,
  faqSection,
  gallerySection,
  heroSection,
  processSection,
  proofSection,
  servicesSection,
  trustSection,
  type RenderContent,
  type RenderContext,
  type SectionOutput,
} from "./sections.ts"

// ─── CSP превью ───────────────────────────────────────────────────────────────

export const PREVIEW_CSP = [
  "default-src 'none'",
  "img-src data: https:",
  "font-src https://fonts.gstatic.com",
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'unsafe-inline'",
  "connect-src 'none'",
  "form-action 'none'",
  "base-uri 'none'",
  "frame-src 'none'",
  "object-src 'none'",
].join("; ")

// ─── Санитизация ──────────────────────────────────────────────────────────────

function sanitizeImage(img: ImageAsset | undefined, altFallback: string): ImageAsset | undefined {
  if (!img) return undefined
  const url = safeImageSrc(img.url)
  if (!url) return undefined
  return {
    url,
    alt: escapeClamped(img.alt || altFallback, 120),
    srcSet: sanitizeSrcSet(img.srcSet),
    sizes: img.sizes ? escapeClamped(img.sizes, 500) : undefined,
    credit: img.credit
      ? { name: escapeClamped(img.credit.name, 60), url: safeUrl(img.credit.url, "#") }
      : undefined,
  }
}

function sanitizeSrcSet(value: string | undefined): string | undefined {
  if (!value) return undefined
  const candidates = value
    .split(",")
    .map((item) => item.trim())
    .map((item) => {
      const match = item.match(/^(\S+)\s+(\d{2,4}w)$/)
      if (!match) return null
      const url = safeImageSrc(match[1])
      return url ? `${url} ${match[2]}` : null
    })
    .filter((item): item is string => Boolean(item))
    .slice(0, 6)
  return candidates.length ? candidates.join(", ") : undefined
}

/**
 * Единственная граница безопасности рендера. Секции работают только с
 * результатом этой функции и не имеют доступа к сырому контенту — поэтому
 * добавление новой секции не может случайно открыть XSS.
 */
function toRenderContent(c: PageContent, assets: PageAssets): RenderContent {
  const businessName = escapeClamped(c.businessName, 60)

  return {
    businessName,
    headline: escapeClamped(c.headline, 120),
    subheadline: escapeClamped(c.subheadline, 280),
    tagline: escapeClamped(c.tagline, 48),
    services: c.services.slice(0, 6).map((s) => ({
      name: escapeClamped(s.name, 70),
      description: escapeClamped(s.description, 320),
      price: s.price ? escapeClamped(s.price, 32) : undefined,
    })),
    features: c.features.slice(0, 6).map((f) => ({
      title: escapeClamped(f.title, 90),
      description: escapeClamped(f.description, 280),
    })),
    stats: c.stats.slice(0, 4).map((s) => ({
      value: escapeClamped(s.value, 24),
      label: escapeClamped(s.label, 48),
      verified: Boolean(s.verified),
    })),
    // Отзыв проходит дальше, только если он реально есть.
    testimonial:
      c.testimonial && c.testimonial.text.trim()
        ? {
            text: escapeClamped(c.testimonial.text, 420),
            author: escapeClamped(c.testimonial.author, 60) || "Клиент",
            role: escapeClamped(c.testimonial.role, 90),
          }
        : null,
    ctaHeadline: escapeClamped(c.ctaHeadline, 60),
    ctaSubtext: escapeClamped(c.ctaSubtext, 220),
    phone: { href: safeTelHref(c.phone), label: escapeClamped(c.phone, 24) },
    email: { href: safeMailtoHref(c.email), label: escapeClamped(c.email, 90) },
    footerTagline: escapeClamped(c.footerTagline, 70),
    geography: c.geography ? escapeClamped(c.geography, 60) : undefined,
    heroImage: sanitizeImage(assets.hero, businessName),
    gallery: assets.gallery
      .slice(0, 9)
      .map((img) => sanitizeImage(img, businessName))
      .filter((img): img is ImageAsset => Boolean(img)),
    roleImages: {
      service: sanitizeImage(assets.roles?.service, businessName),
      process: sanitizeImage(assets.roles?.process, businessName),
      proof: sanitizeImage(assets.roles?.proof, businessName),
    },
    guarantees: c.guarantees.slice(0, 4).map((g) => escapeClamped(g, 140)),
    advantages: c.advantages.slice(0, 4).map((item) => escapeClamped(item, 140)),
    caseStudies: c.caseStudies.slice(0, 3).map((item) => ({
      title: escapeClamped(item.title, 90),
      summary: escapeClamped(item.summary, 360),
      result: item.result ? escapeClamped(item.result, 100) : undefined,
    })),
    teamMembers: c.teamMembers.slice(0, 6).map((item) => ({
      name: escapeClamped(item.name, 60),
      role: escapeClamped(item.role, 90),
    })),
    serviceAreas: c.serviceAreas.slice(0, 8).map((item) => escapeClamped(item, 80)),
  }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

/**
 * FAQ строится из уже проверенного контента и не обещает ничего от имени
 * владельца бизнеса: ни сроков ответа, ни условий договора.
 */
function buildFaq(c: RenderContent): Array<{ q: string; a: string }> {
  const items: Array<{ q: string; a: string }> = []
  const [first, second] = c.services

  if (first) {
    items.push({
      q: `Сколько стоит «${first.name}»?`,
      a: first.price
        ? `Ориентир — ${first.price}. Итоговая стоимость зависит от объёма задачи: свяжитесь с нами, чтобы уточнить расчёт.`
        : "Стоимость зависит от объёма и условий задачи. Свяжитесь с нами — рассчитаем под ваш запрос.",
    })
  }
  if (second) {
    items.push({ q: `Что входит в «${second.name}»?`, a: second.description })
  }

  items.push({
    q: "Как проходит работа?",
    a: "Сначала уточняем задачу и условия, затем согласуем состав работ и стоимость, и только после этого приступаем.",
  })

  if (c.geography) {
    items.push({ q: "Где вы работаете?", a: `Мы работаем в городе ${c.geography} и окрестностях.` })
  }

  return items
}

// ─── Скрипт превью ────────────────────────────────────────────────────────────

const PREVIEW_JS = `<script>
(function(){
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el,i){
    el.style.transitionDelay=(i%4*0.06)+'s';
    io.observe(el)
  });
})()
</script>`

// ─── Сборка ───────────────────────────────────────────────────────────────────

function renderSection(id: SectionId, ctx: RenderContext, faq: Array<{ q: string; a: string }>): SectionOutput {
  switch (id) {
    case "hero":
      return heroSection(ctx)
    case "trust":
      return trustSection(ctx)
    case "services":
      return servicesSection(ctx)
    case "process":
      return processSection(ctx)
    case "proof":
      return proofSection(ctx)
    case "gallery":
      return gallerySection(ctx)
    case "advantages":
      return advantagesSection(ctx)
    case "cases":
      return casesSection(ctx)
    case "pricing":
      return pricingSection(ctx)
    case "team":
      return teamSection(ctx)
    case "area":
      return areaSection(ctx)
    case "faq":
      return faqSection(ctx, faq)
    case "contact":
      return contactSection(ctx)
  }
}

export interface ComposeResult {
  html: string
  /** Какие секции реально отрисовались — нужно для quality gate. */
  renderedSections: SectionId[]
}

export function composePage(
  content: PageContent,
  spec: DesignSpec,
  assets: PageAssets = { gallery: [] }
): ComposeResult {
  const c = toRenderContent(content, assets)
  const ctx: RenderContext = { content: c, spec }
  const tokens = buildTokens(spec)
  const faq = buildFaq(c)

  const background = backgroundLayer(spec)
  const rendered: SectionId[] = []
  const bodyParts: string[] = []
  // Секции повторяются редко, но CSS одного варианта не должен дублироваться.
  const cssParts = new Map<string, string>()

  if (background.css) cssParts.set("bg", background.css)

  for (const id of spec.sectionOrder) {
    const out = renderSection(id, ctx, faq)
    if (!out.html) continue
    rendered.push(id)
    bodyParts.push(out.html)
    if (out.css && !cssParts.has(id)) cssParts.set(id, out.css)
  }

  const css = [tokensToCss(tokens), BASE_CSS, ...cssParts.values()].join("\n")

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}">
<title>${c.businessName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${escapeHtml(tokens.fontUrl)}" rel="stylesheet">
<style>${css}</style>
</head>
<body>
${background.html}
<header class="site-head"><div class="wrap site-head-inner">
  <span class="site-logo">${c.businessName}</span>
  <a href="${c.phone.href}" class="site-phone">${c.phone.label}</a>
</div></header>
${bodyParts.join("\n")}
<footer class="site-foot"><div class="wrap site-foot-inner">
  <span>${c.businessName}</span>
  <span class="muted">${c.footerTagline}</span>
  <span class="muted">© ${new Date().getFullYear()}</span>
</div></footer>
${PREVIEW_JS}
</body>
</html>`

  return { html, renderedSections: rendered }
}
