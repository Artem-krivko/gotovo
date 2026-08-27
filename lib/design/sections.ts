// lib/design/sections.ts — библиотека визуальных вариантов секций.
//
// Каждая секция — чистая функция (content, spec, tokens) → HTML.
// Секции не знают о конкретных цветах и отступах: всё берётся из CSS-переменных,
// собранных в tokens.ts. Поэтому одна и та же секция выглядит принципиально
// по-разному в разных спеках, а новый вариант добавляется без правок в других.
//
// ВСЁ, что приходит из контента, уже экранировано в compose.ts — эти функции
// работают с безопасными строками.

import type { DesignSpec } from "./spec.ts"
import type { PageContent } from "./content.ts"

/**
 * Контент на момент рендера: все строки уже экранированы в compose.ts,
 * а телефон и email разложены на безопасный href и отображаемую подпись.
 */
export interface RenderContent extends Omit<PageContent, "phone" | "email"> {
  phone: { href: string; label: string }
  email: { href: string; label: string }
}

export interface RenderContext {
  content: RenderContent
  spec: DesignSpec
}

export interface SectionOutput {
  html: string
  css: string
}

const EMPTY: SectionOutput = { html: "", css: "" }

// ─── Общие утилиты ────────────────────────────────────────────────────────────

function cardCss(spec: DesignSpec): string {
  switch (spec.cardStyle) {
    case "flat":
      return `background:transparent;border:none`
    case "outlined":
      return `background:transparent;border:1px solid var(--border)`
    case "elevated":
      return `background:var(--surface);border:1px solid var(--border);box-shadow:0 4px 24px -8px rgba(0,0,0,.18)`
    case "glass":
      return `background:color-mix(in srgb,var(--surface) 60%,transparent);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--border)`
  }
}

function ctaCss(spec: DesignSpec): string {
  switch (spec.ctaVariant) {
    case "gradient":
      return `background:linear-gradient(135deg,var(--accent),var(--accent-alt));color:var(--on-accent);border:none`
    case "solid":
      return `background:var(--accent);color:var(--on-accent);border:none`
    case "outline":
      return `background:transparent;color:var(--accent);border:2px solid var(--accent)`
    case "underline":
      return `background:transparent;color:var(--text);border:none;border-bottom:2px solid var(--accent);border-radius:0;padding-left:0;padding-right:0`
  }
}

function imageCss(spec: DesignSpec): string {
  switch (spec.imageTreatment) {
    case "plain":
      return `border-radius:0`
    case "rounded":
      return `border-radius:var(--r-lg)`
    case "overlay":
      return `border-radius:var(--r-lg);position:relative`
    case "duotone":
      return `border-radius:var(--r-sm);filter:grayscale(1) contrast(1.15)`
  }
}

/** Заголовок секции — единый ритм на всей странице. */
function sectionHead(tag: string, title: string): string {
  return `<div class="s-head reveal">${tag ? `<p class="s-tag">${tag}</p>` : ""}<h2>${title}</h2></div>`
}

const BASE_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);line-height:1.6;-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit}
img{display:block;max-width:100%}
h1,h2,h3{font-family:var(--font-display)}
h1,h2{letter-spacing:var(--display-tracking);text-transform:var(--display-transform);text-wrap:balance}
h1{font-size:var(--display);font-weight:700;line-height:1.02;overflow-wrap:anywhere;hyphens:auto}
h2{font-size:clamp(26px,3.2vw,40px);font-weight:700;line-height:1.08}
h3{letter-spacing:-.35px;line-height:1.25;text-transform:none}
.wrap{max-width:var(--w);margin:0 auto;padding:0 24px}
section{padding:var(--pad) 0}
.s-head{margin-bottom:calc(var(--pad) * .42)}
.s-tag{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
.muted{color:var(--text-muted)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:var(--r-md);font-weight:600;font-size:15px;padding:14px 26px;cursor:pointer;transition:transform .2s,opacity .2s}
.btn:hover{transform:translateY(-2px);opacity:.92}
.btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border)}
.reveal{opacity:0;transform:translateY(16px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
.reveal.in{opacity:1;transform:translateY(0)}
@media(max-width:860px){
  section{padding:calc(var(--pad) * .62) 0}
  .wrap{padding:0 18px}
}
@media(prefers-reduced-motion:reduce){
  .reveal{opacity:1;transform:none;transition:none}
  *{animation:none!important}
}
.site-head{position:sticky;top:0;z-index:40;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
.site-head-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;height:62px}
.site-logo{font-family:var(--font-display);font-weight:700;font-size:17px}
.site-phone{font-size:14px;font-weight:600;color:var(--accent)}
.site-foot{border-top:1px solid var(--border);padding:26px 0}
.site-foot-inner{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:13px}`

// ─── Фон страницы ─────────────────────────────────────────────────────────────

export function backgroundLayer(spec: DesignSpec): SectionOutput {
  switch (spec.backgroundTreatment) {
    case "plain":
      return EMPTY

    case "aurora":
      return {
        html: `<div class="bg-aurora" aria-hidden="true"><span></span><span></span></div>`,
        css: `
.bg-aurora{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.bg-aurora span{position:absolute;border-radius:50%;filter:blur(90px);opacity:.35}
.bg-aurora span:first-child{width:620px;height:620px;top:-12%;left:-6%;background:var(--accent);animation:au1 18s ease-in-out infinite}
.bg-aurora span:last-child{width:520px;height:520px;bottom:-10%;right:-4%;background:var(--accent-alt);animation:au2 24s ease-in-out infinite}
@keyframes au1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(70px,50px) scale(1.12)}}
@keyframes au2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-60px,-40px) scale(1.1)}}
body>*:not(.bg-aurora){position:relative;z-index:1}`,
      }

    case "grid":
      return {
        html: `<div class="bg-grid" aria-hidden="true"></div>`,
        css: `
.bg-grid{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.5;
background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);
background-size:56px 56px;
-webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 0%,#000,transparent 75%);
mask-image:radial-gradient(ellipse 70% 60% at 50% 0%,#000,transparent 75%)}
body>*:not(.bg-grid){position:relative;z-index:1}`,
      }

    case "noise":
      return {
        html: `<div class="bg-noise" aria-hidden="true"></div>`,
        css: `
.bg-noise{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.04;
background-image:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")}
body>*:not(.bg-noise){position:relative;z-index:1}`,
      }

    case "bands":
      return {
        html: `<div class="bg-bands" aria-hidden="true"></div>`,
        css: `
.bg-bands{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.035;
background:repeating-linear-gradient(115deg,var(--accent) 0 1px,transparent 1px 86px);
-webkit-mask-image:linear-gradient(#000 0,rgba(0,0,0,.8) 32%,transparent 72%);
mask-image:linear-gradient(#000 0,rgba(0,0,0,.8) 32%,transparent 72%)}
body>*:not(.bg-bands){position:relative;z-index:1}`,
      }
  }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function heroActions(c: RenderContent): string {
  return `<div class="hero-cta">
    <a href="#contact" class="btn btn-accent">${c.ctaHeadline}</a>
    <a href="#services" class="btn btn-ghost">Услуги</a>
  </div>`
}

function heroImageTag(c: RenderContent, className: string): string {
  if (!c.heroImage) return ""
  return `<img class="${className}" src="${c.heroImage.url}" alt="${c.heroImage.alt}" loading="eager" decoding="async">`
}

function photoCredit(c: RenderContent): string {
  if (!c.heroImage?.credit) return ""
  return `<a class="credit" href="${c.heroImage.credit.url}" target="_blank" rel="noopener noreferrer">Фото: ${c.heroImage.credit.name} / Pexels</a>`
}

export function heroSection({ content: c, spec }: RenderContext): SectionOutput {
  const common = `
.hero{padding-top:calc(var(--pad) * .9)}
.hero .badge{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:6px 15px;font-size:13px;font-weight:600;margin-bottom:22px;color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);background:color-mix(in srgb,var(--accent) 10%,transparent)}
.hero .sub{font-size:18px;color:var(--text-muted);margin:20px 0 32px;max-width:56ch}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap}
.btn-accent{${ctaCss(spec)}}
.credit{display:inline-block;margin-top:8px;font-size:11px;color:var(--text-muted)}
`

  switch (spec.heroVariant) {
    case "split-image":
      return {
        html: `<section class="hero" id="hero"><div class="wrap hero-split">
  <div class="reveal">
    <p class="badge">${c.tagline}</p>
    <h1>${c.headline}</h1>
    <p class="sub">${c.subheadline}</p>
    ${heroActions(c)}
  </div>
  <div class="hero-media reveal">${heroImageTag(c, "hero-img")}${photoCredit(c)}</div>
</div></section>`,
        css: `${common}
.hero-split{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(320px,.92fr);gap:clamp(32px,4vw,52px);align-items:center}
.hero-split h1{max-width:15ch}
.hero-img{width:100%;aspect-ratio:4/3;object-fit:cover;${imageCss(spec)}}
@media(max-width:860px){.hero-split{grid-template-columns:1fr;gap:32px}.hero-split h1{max-width:18ch}}`,
      }

    case "centered":
      return {
        html: `<section class="hero" id="hero"><div class="wrap hero-centered reveal">
  <p class="badge">${c.tagline}</p>
  <h1>${c.headline}</h1>
  <p class="sub">${c.subheadline}</p>
  ${heroActions(c)}
  ${c.heroImage ? `<div class="hero-media">${heroImageTag(c, "hero-img")}${photoCredit(c)}</div>` : ""}
</div></section>`,
        css: `${common}
.hero-centered{text-align:center;max-width:820px}
.hero-centered h1{max-width:18ch;margin-left:auto;margin-right:auto}
.hero-centered .sub{margin-left:auto;margin-right:auto}
.hero-centered .hero-cta{justify-content:center}
.hero-centered .hero-media{margin-top:48px}
.hero-img{width:100%;aspect-ratio:16/9;object-fit:cover;${imageCss(spec)}}`,
      }

    case "editorial":
      return {
        html: `<section class="hero" id="hero"><div class="wrap">
  <div class="reveal hero-editorial">
    <p class="badge">${c.tagline}</p>
    <h1>${c.headline}</h1>
    <div class="hero-ed-row">
      <p class="sub">${c.subheadline}</p>
      ${heroActions(c)}
    </div>
  </div>
  ${c.heroImage ? `<div class="hero-media reveal">${heroImageTag(c, "hero-img")}${photoCredit(c)}</div>` : ""}
</div></section>`,
        css: `${common}
.hero-editorial h1{max-width:15ch}
.hero-ed-row{display:grid;grid-template-columns:1fr auto;gap:36px;align-items:end;margin-top:28px;padding-top:28px;border-top:1px solid var(--border)}
.hero-img{width:100%;height:clamp(240px,42vh,440px);object-fit:cover;margin-top:44px;${imageCss(spec)}}
@media(max-width:860px){.hero-ed-row{grid-template-columns:1fr;align-items:start;gap:24px}}`,
      }

    case "full-bleed":
      return {
        html: `<section class="hero hero-full" id="hero">
  ${heroImageTag(c, "hero-bg")}
  <div class="hero-scrim" aria-hidden="true"></div>
  <div class="wrap hero-full-inner reveal">
    <p class="badge">${c.tagline}</p>
    <h1>${c.headline}</h1>
    <p class="sub">${c.subheadline}</p>
    ${heroActions(c)}
  </div>
</section>`,
        css: `${common}
.hero-full{position:relative;min-height:min(84vh,760px);display:flex;align-items:center;overflow:hidden;padding:0}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;${spec.imageTreatment === "duotone" ? "filter:grayscale(1) contrast(1.15);" : ""}}
.hero-scrim{position:absolute;inset:0;background:linear-gradient(90deg,var(--bg) 12%,color-mix(in srgb,var(--bg) 55%,transparent) 55%,transparent 100%)}
.hero-full-inner{position:relative;max-width:var(--w);width:100%}
.hero-full-inner h1,.hero-full-inner .sub{max-width:22ch}
.hero-full .sub{max-width:46ch}
@media(max-width:860px){.hero-scrim{background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 40%,transparent),var(--bg) 78%)}.hero-full{min-height:auto;padding:calc(var(--pad) * .9) 0}}`,
      }

    case "statement":
      return {
        html: `<section class="hero hero-statement" id="hero"><div class="wrap reveal">
  <p class="badge">${c.tagline}</p>
  <h1>${c.headline}</h1>
  <div class="statement-row">
    <p class="sub">${c.subheadline}</p>
    ${heroActions(c)}
  </div>
</div></section>`,
        css: `${common}
.hero-statement h1{font-size:clamp(42px,7vw,92px);line-height:.98;max-width:13ch}
.statement-row{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;flex-wrap:wrap;margin-top:40px;border-top:2px solid var(--accent);padding-top:32px}
.hero-statement .sub{margin:0;max-width:42ch}`,
      }
  }
}

// ─── Trust (полоса метрик) ────────────────────────────────────────────────────

export function trustSection({ content: c }: RenderContext): SectionOutput {
  if (c.stats.length === 0) return EMPTY

  return {
    html: `<section class="trust"><div class="wrap trust-row">
  ${c.stats
    .map(
      (s) => `<div class="trust-item reveal">
    <div class="trust-val${s.verified ? "" : " trust-val-empty"}"${s.verified ? " data-count" : ""}>${s.value}</div>
    <div class="trust-lbl">${s.label}</div>
  </div>`
    )
    .join("")}
</div></section>`,
    css: `
.trust{padding:calc(var(--pad) * .55) 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.trust-row{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--gap)}
.trust-item{text-align:center}
.trust-val{font-family:var(--font-display);font-size:clamp(28px,4vw,44px);font-weight:700;color:var(--accent);line-height:1}
/* Неподтверждённая метрика видна как пустое место под цифру, а не как факт. */
.trust-val-empty{color:var(--text-muted);opacity:.55}
.trust-lbl{font-size:13px;color:var(--text-muted);margin-top:8px}
@media(max-width:640px){.trust-row{grid-template-columns:1fr;gap:24px}}`,
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────

export function servicesSection({ content: c, spec }: RenderContext): SectionOutput {
  if (c.services.length === 0) return EMPTY
  const head = sectionHead("Услуги", "Что мы делаем")

  switch (spec.servicesVariant) {
    case "cards":
      return {
        html: `<section id="services"><div class="wrap">${head}
  <div class="svc-grid">
    ${c.services
      .map(
        (s, i) => `<article class="svc-card reveal">
      <span class="svc-num">${String(i + 1).padStart(2, "0")}</span>
      <h3>${s.name}</h3>
      <p class="muted">${s.description}</p>
      ${s.price ? `<p class="svc-price">${s.price}</p>` : ""}
    </article>`
      )
      .join("")}
  </div>
</div></section>`,
        css: `
.svc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--gap);align-items:start}
.svc-card{padding:clamp(20px,2.2vw,26px);border-radius:var(--r-lg);${cardCss(spec)}}
.svc-num{font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--accent);letter-spacing:2px}
.svc-card h3{font-size:19px;margin:14px 0 10px}
.svc-card p{font-size:14.5px;line-height:1.68}
.svc-price{margin-top:14px;font-weight:700;color:var(--accent);font-size:15px}`,
      }

    case "list":
      return {
        html: `<section id="services"><div class="wrap">${head}
  <div class="svc-list">
    ${c.services
      .map(
        (s) => `<div class="svc-row reveal">
      <h3>${s.name}</h3>
      <p class="muted">${s.description}</p>
      ${s.price ? `<span class="svc-price">${s.price}</span>` : "<span></span>"}
    </div>`
      )
      .join("")}
  </div>
</div></section>`,
        css: `
.svc-list{border-top:1px solid var(--border)}
.svc-row{display:grid;grid-template-columns:minmax(180px,1fr) 2fr auto;gap:32px;align-items:start;padding:30px 0;border-bottom:1px solid var(--border)}
.svc-row h3{font-size:21px}
.svc-row p{font-size:15px}
.svc-price{font-weight:700;color:var(--accent);white-space:nowrap}
@media(max-width:860px){.svc-row{grid-template-columns:1fr;gap:10px}}`,
      }

    case "numbered":
      return {
        html: `<section id="services"><div class="wrap">${head}
  <div class="svc-numbered">
    ${c.services
      .map(
        (s, i) => `<div class="svc-nrow reveal">
      <span class="svc-bignum">${String(i + 1).padStart(2, "0")}</span>
      <div><h3>${s.name}</h3><p class="muted">${s.description}</p>${s.price ? `<p class="svc-price">${s.price}</p>` : ""}</div>
    </div>`
      )
      .join("")}
  </div>
</div></section>`,
        css: `
.svc-numbered{display:flex;flex-direction:column;gap:calc(var(--gap) * 1.6)}
.svc-nrow{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:start}
.svc-bignum{font-family:var(--font-display);font-size:clamp(44px,6vw,76px);font-weight:800;line-height:.85;color:transparent;-webkit-text-stroke:1.5px var(--accent)}
.svc-nrow h3{font-size:22px;margin-bottom:10px}
.svc-nrow p{font-size:15px;max-width:62ch}
@media(max-width:640px){.svc-nrow{grid-template-columns:1fr;gap:8px}}`,
      }

    case "alternating":
      return {
        html: `<section id="services"><div class="wrap">${head}
  <div class="svc-alt">
    ${c.services
      .map(
        (s, i) => `<div class="svc-arow reveal${i % 2 ? " svc-arow-rev" : ""}">
      <div class="svc-atext"><h3>${s.name}</h3><p class="muted">${s.description}</p>${s.price ? `<p class="svc-price">${s.price}</p>` : ""}</div>
      <div class="svc-aside" aria-hidden="true"><span>${String(i + 1).padStart(2, "0")}</span></div>
    </div>`
      )
      .join("")}
  </div>
</div></section>`,
        css: `
.svc-alt{display:flex;flex-direction:column;gap:var(--gap)}
.svc-arow{display:grid;grid-template-columns:1.4fr 1fr;gap:36px;align-items:center;padding:28px;border-radius:var(--r-lg);${cardCss(spec)}}
.svc-arow-rev .svc-atext{order:2}
.svc-arow h3{font-size:21px;margin-bottom:10px}
.svc-arow p{font-size:15px}
.svc-aside{display:flex;align-items:center;justify-content:center;min-height:120px;border-radius:var(--r-md);background:color-mix(in srgb,var(--accent) 12%,transparent)}
.svc-aside span{font-family:var(--font-display);font-size:52px;font-weight:800;color:var(--accent);opacity:.75}
@media(max-width:860px){.svc-arow{grid-template-columns:1fr}.svc-arow-rev .svc-atext{order:0}.svc-aside{display:none}}`,
      }
  }
}

// ─── Process ──────────────────────────────────────────────────────────────────

export function processSection({ content: c, spec }: RenderContext): SectionOutput {
  if (c.features.length === 0) return EMPTY
  const head = sectionHead("Как мы работаем", "Процесс")

  switch (spec.processVariant) {
    case "steps-row":
      return {
        html: `<section id="process"><div class="wrap">${head}
  <div class="steps-row">
    ${c.features
      .map(
        (f, i) => `<div class="step reveal"><span class="step-n">${String(i + 1).padStart(2, "0")}</span><h3>${f.title}</h3><p class="muted">${f.description}</p></div>`
      )
      .join("")}
  </div>
</div></section>`,
        css: `
.steps-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:var(--gap);align-items:start}
.step{padding:clamp(20px,2.2vw,26px);border-radius:var(--r-lg);${cardCss(spec)}}
.step-n{font-family:var(--font-display);font-size:12px;font-weight:700;letter-spacing:2px;color:var(--accent)}
.step h3{font-size:18px;margin:12px 0 8px}
.step p{font-size:14.5px}`,
      }

    case "timeline":
      return {
        html: `<section id="process"><div class="wrap">${head}
  <ol class="timeline">
    ${c.features
      .map(
        (f, i) => `<li class="tl-item reveal"><span class="tl-dot" aria-hidden="true"></span><div><span class="tl-n">Шаг ${i + 1}</span><h3>${f.title}</h3><p class="muted">${f.description}</p></div></li>`
      )
      .join("")}
  </ol>
</div></section>`,
        css: `
.timeline{list-style:none;position:relative;padding-left:34px}
.timeline::before{content:'';position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:var(--border)}
.tl-item{position:relative;padding-bottom:34px}
.tl-item:last-child{padding-bottom:0}
.tl-dot{position:absolute;left:-34px;top:5px;width:16px;height:16px;border-radius:50%;background:var(--accent);border:3px solid var(--bg)}
.tl-n{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent)}
.tl-item h3{font-size:19px;margin:8px 0}
.tl-item p{font-size:15px;max-width:62ch}`,
      }

    case "accordion":
      return {
        html: `<section id="process"><div class="wrap">${head}
  <div class="proc-acc">
    ${c.features
      .map(
        (f, i) => `<details class="proc-item reveal"${i === 0 ? " open" : ""}>
      <summary><span class="proc-n">${String(i + 1).padStart(2, "0")}</span>${f.title}<span class="proc-plus" aria-hidden="true">+</span></summary>
      <p class="muted">${f.description}</p>
    </details>`
      )
      .join("")}
  </div>
</div></section>`,
        css: `
.proc-acc{display:flex;flex-direction:column;gap:10px}
.proc-item{border-radius:var(--r-md);${cardCss(spec)};overflow:hidden}
.proc-item summary{list-style:none;display:flex;align-items:center;gap:14px;padding:20px 24px;font-weight:600;font-size:17px;cursor:pointer}
.proc-item summary::-webkit-details-marker{display:none}
.proc-n{font-family:var(--font-display);font-size:13px;color:var(--accent);font-weight:700}
.proc-plus{margin-left:auto;font-size:22px;color:var(--accent);transition:transform .25s;font-weight:300}
.proc-item[open] .proc-plus{transform:rotate(45deg)}
.proc-item p{padding:0 24px 20px 52px;font-size:15px}`,
      }
  }
}

// ─── Proof ────────────────────────────────────────────────────────────────────

export function proofSection({ content: c, spec }: RenderContext): SectionOutput {
  // Блок отзыва рендерится ТОЛЬКО при наличии реального отзыва.
  // Если его нет, показываем не выдуманную цитату, а гарантии, которые
  // владелец подтвердил, либо не показываем ничего.
  if (spec.proofVariant === "none") return EMPTY

  if (spec.proofVariant === "quote") {
    if (!c.testimonial) {
      return c.guarantees.length > 0 ? guaranteesBlock(c, spec) : EMPTY
    }
    return {
      html: `<section class="proof"><div class="wrap proof-quote reveal">
  <blockquote>${c.testimonial.text}</blockquote>
  <footer><strong>${c.testimonial.author}</strong>${c.testimonial.role ? `<span class="muted"> — ${c.testimonial.role}</span>` : ""}</footer>
</div></section>`,
      css: `
.proof-quote{max-width:820px;margin:0 auto;text-align:center}
.proof-quote blockquote{font-family:var(--font-display);font-size:clamp(20px,2.6vw,30px);line-height:1.45;margin-bottom:24px}
.proof-quote footer{font-size:15px}`,
    }
  }

  if (spec.proofVariant === "logos") {
    return c.guarantees.length > 0 ? guaranteesBlock(c, spec) : EMPTY
  }

  // proofVariant "stats-bar" рисует ту же полосу метрик, что и секция trust.
  // Если trust уже есть в порядке секций, вторая такая же полоса — визуальный
  // дубль: выглядит как ошибка вёрстки и разрывает страницу пополам.
  if (spec.sectionOrder.includes("trust")) {
    return c.guarantees.length > 0 ? guaranteesBlock(c, spec) : EMPTY
  }

  return trustSection({ content: c, spec })
}

/** Подтверждённые гарантии — честная замена выдуманному отзыву. */
function guaranteesBlock(c: RenderContent, spec: DesignSpec): SectionOutput {
  return {
    html: `<section class="proof"><div class="wrap">${sectionHead("Условия", "Что мы гарантируем")}
  <ul class="guarantees">
    ${c.guarantees.map((g) => `<li class="reveal">${g}</li>`).join("")}
  </ul>
</div></section>`,
    css: `
.guarantees{list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--gap)}
.guarantees li{padding:22px;border-radius:var(--r-md);font-size:15.5px;${cardCss(spec)};border-left:3px solid var(--accent)}`,
  }
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export function gallerySection({ content: c, spec }: RenderContext): SectionOutput {
  if (spec.galleryVariant === "none" || c.gallery.length === 0) return EMPTY

  const items = c.gallery
    .map(
      (img) =>
        `<figure class="g-item reveal"><img src="${img.url}" alt="${img.alt}" loading="lazy" decoding="async"></figure>`
    )
    .join("")

  const head = sectionHead("Портфолио", "Примеры работ")

  if (spec.galleryVariant === "carousel") {
    return {
      html: `<section id="gallery"><div class="wrap">${head}</div>
  <div class="g-carousel">${items}</div>
</section>`,
      css: `
.g-carousel{display:flex;gap:var(--gap);overflow-x:auto;scroll-snap-type:x mandatory;padding:0 24px 12px}
.g-carousel .g-item{flex:0 0 min(78vw,420px);scroll-snap-align:start;margin:0}
.g-item img{width:100%;aspect-ratio:4/3;object-fit:cover;${imageCss(spec)}}`,
    }
  }

  return {
    html: `<section id="gallery"><div class="wrap">${head}
  <div class="g-${spec.galleryVariant}">${items}</div>
</div></section>`,
    css:
      spec.galleryVariant === "masonry"
        ? `
.g-masonry{columns:3;column-gap:var(--gap)}
.g-masonry .g-item{break-inside:avoid;margin:0 0 var(--gap)}
.g-item img{width:100%;${imageCss(spec)}}
@media(max-width:860px){.g-masonry{columns:2}}
@media(max-width:520px){.g-masonry{columns:1}}`
        : `
.g-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--gap)}
.g-grid .g-item{margin:0}
.g-item img{width:100%;aspect-ratio:4/3;object-fit:cover;${imageCss(spec)}}`,
  }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export function faqSection(
  { spec }: RenderContext,
  items: Array<{ q: string; a: string }>
): SectionOutput {
  if (items.length === 0) return EMPTY
  const head = sectionHead("Вопросы", "Частые вопросы")

  if (spec.faqVariant === "two-column") {
    return {
      html: `<section id="faq"><div class="wrap">${head}
  <div class="faq-cols">
    ${items.map((i) => `<div class="faq-cell reveal"><h3>${i.q}</h3><p class="muted">${i.a}</p></div>`).join("")}
  </div>
</div></section>`,
      css: `
.faq-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:calc(var(--gap) * 1.5)}
.faq-cell h3{font-size:17px;margin-bottom:10px}
.faq-cell p{font-size:15px}`,
    }
  }

  return {
    html: `<section id="faq"><div class="wrap">${head}
  <div class="faq-acc">
    ${items
      .map(
        (i) => `<details class="faq-item reveal"><summary>${i.q}<span class="faq-plus" aria-hidden="true">+</span></summary><p class="muted">${i.a}</p></details>`
      )
      .join("")}
  </div>
</div></section>`,
    css: `
.faq-acc{max-width:820px}
.faq-item{border-bottom:1px solid var(--border)}
.faq-item summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 0;font-weight:600;font-size:17px;cursor:pointer}
.faq-item summary::-webkit-details-marker{display:none}
.faq-plus{font-size:22px;color:var(--accent);transition:transform .25s;font-weight:300;flex-shrink:0}
.faq-item[open] .faq-plus{transform:rotate(45deg)}
.faq-item p{padding-bottom:22px;font-size:15px;max-width:70ch}`,
  }
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export function contactSection({ content: c, spec }: RenderContext): SectionOutput {
  const links = `<a href="${c.phone.href}" class="btn btn-accent">${c.phone.label}</a>
  <a href="${c.email.href}" class="btn btn-ghost">${c.email.label}</a>`

  const common = `
.contact-links{display:flex;gap:12px;flex-wrap:wrap}
.contact .sub{color:var(--text-muted);font-size:17px;margin:14px 0 28px;max-width:52ch}`

  switch (spec.contactVariant) {
    case "banner":
      return {
        html: `<section class="contact contact-banner" id="contact"><div class="wrap reveal">
  <h2>${c.ctaHeadline}</h2><p class="sub">${c.ctaSubtext}</p>
  <div class="contact-links">${links}</div>
</div></section>`,
        css: `${common}
.contact-banner{background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 16%,var(--bg)),var(--bg))}
.contact-banner .sub{margin-bottom:28px}`,
      }

    case "split":
      return {
        html: `<section class="contact" id="contact"><div class="wrap contact-split reveal">
  <div><h2>${c.ctaHeadline}</h2><p class="sub">${c.ctaSubtext}</p></div>
  <div class="contact-links">${links}</div>
</div></section>`,
        css: `${common}
.contact-split{display:grid;grid-template-columns:1.3fr auto;gap:40px;align-items:center;padding-top:calc(var(--pad) * .5);border-top:1px solid var(--border)}
.contact-split .contact-links{flex-direction:column}
@media(max-width:860px){.contact-split{grid-template-columns:1fr}.contact-split .contact-links{flex-direction:row}}`,
      }

    case "boxed":
      return {
        html: `<section class="contact" id="contact"><div class="wrap">
  <div class="contact-box reveal">
    <h2>${c.ctaHeadline}</h2><p class="sub">${c.ctaSubtext}</p>
    <div class="contact-links">${links}</div>
  </div>
</div></section>`,
        css: `${common}
.contact-box{padding:clamp(36px,6vw,72px);border-radius:var(--r-lg);text-align:center;${cardCss(spec)}}
.contact-box .sub{margin-left:auto;margin-right:auto}
.contact-box .contact-links{justify-content:center}`,
      }

    case "minimal":
      return {
        html: `<section class="contact" id="contact"><div class="wrap reveal">
  <h2>${c.ctaHeadline}</h2><p class="sub">${c.ctaSubtext}</p>
  <div class="contact-links">${links}</div>
</div></section>`,
        css: common,
      }
  }
}

export { BASE_CSS }
