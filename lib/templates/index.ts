// lib/templates/index.ts — HTML-скелеты дизайна. AI заполняет только контент (JSON).

export interface DesignContent {
  businessName: string
  headline: string
  subheadline: string
  tagline: string
  accentColor: string
  services: Array<{ icon: string; name: string; description: string; price?: string }>
  features: Array<{ icon: string; title: string; description: string }>
  stats: Array<{ value: string; label: string }>
  testimonial: { text: string; author: string; role: string }
  ctaHeadline: string
  ctaSubtext: string
  phone: string
  email: string
  footerTagline: string
  heroImageUrl?: string
}

// ─── Подбор фото по нише бизнеса (picsum.photos — стабильный, без API ключа) ──

const NICHE_SEEDS: Array<[RegExp, string]> = [
  [/стоматол|зуб|дент/i,                                   "dentist"],
  [/ресторан|кафе|суши|пицц|бургер|шашлык|еда|бар/i,       "restaurant"],
  [/салон|красот|барбер|парикмах|маникюр|педикюр|макияж|перманент/i, "beauty"],
  [/фитнес|спорт|тренаж|йога|зал|бокс/i,                   "fitness"],
  [/медицин|клиник|врач|больниц|лечени/i,                   "medical"],
  [/юрист|адвокат|право|нотар/i,                            "justice"],
  [/строительств|ремонт|отделк|кровл|монтаж|экскаватор|землян/i, "construction"],
  [/ит|it|разработк|программ|сайт|приложен/i,               "technology"],
  [/курс|обучен|школ|образован|репетитор/i,                 "education"],
  [/бухгалт|налог|аудит|финанс/i,                           "finance"],
  [/недвижим|риелтор|квартир|аренда/i,                      "interior"],
  [/авто|шиномонтаж|сто|кузов|машин/i,                      "automobile"],
  [/свадьб|праздник|event|мероприят/i,                      "wedding"],
  [/доставка|логистик|курьер|транспорт/i,                   "logistics"],
  [/фото|видео|съёмк/i,                                     "studio"],
]

export function getNicheImage(businessType: string, w = 800, h = 500): string {
  const seed = NICHE_SEEDS.find(([re]) => re.test(businessType))?.[1] ?? "office"
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

// ─── Shared head snippet ──────────────────────────────────────────────────────

function head(title: string, accent: string, extraCss = "") {
  return `<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Inter',sans-serif}
:root{--a:${accent}}
a{text-decoration:none;color:inherit}
${extraCss}
</style>`
}

// ─── Shared animation CSS ─────────────────────────────────────────────────────

const ANIM_CSS = `
@keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.fu{animation:fu .65s cubic-bezier(.16,1,.3,1) both}
.fi{animation:fi .5s ease both}
.d1{animation-delay:.07s}.d2{animation-delay:.17s}.d3{animation-delay:.29s}.d4{animation-delay:.43s}.d5{animation-delay:.59s}
.reveal{opacity:0;transform:translateY(14px);transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)}
.reveal.in{opacity:1;transform:translateY(0)}`

// ─── Shared scroll-reveal JS ──────────────────────────────────────────────────

const ANIM_JS = `<script>
(function(){
var io=new IntersectionObserver(function(e){e.forEach(function(n){if(n.isIntersecting){n.target.classList.add('in');io.unobserve(n.target)}})},{threshold:.1,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(function(el){
  var p=el.closest('.grid3,.feats-grid,.feats3,.stat-row');
  if(p){var i=Array.from(p.children).indexOf(el);el.style.transitionDelay=(i*.11)+'s'}
  io.observe(el)
})
})()
</script>`

// ─── MODERN (тёмный, сплит-hero, акцентный градиент) ─────────────────────────

export function buildModern(d: DesignContent): string {
  const svcs = d.services.slice(0, 3)
  const feats = d.features.slice(0, 3)
  const stats = d.stats.slice(0, 3)

  const css = `
${ANIM_CSS}
body{background:#09090b;color:#fff}
.hdr{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(9,9,11,.85);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.07)}
.hdr-inner{max-width:1180px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:17px;font-weight:700}
nav a{color:rgba(255,255,255,.55);font-size:14px;font-weight:500;margin-left:28px;transition:color .2s}
nav a:hover{color:#fff}
.btn{display:inline-flex;align-items:center;border-radius:12px;font-weight:600;font-size:14px;padding:12px 24px;transition:all .2s;cursor:pointer}
.btn-p{background:var(--a);color:#fff;box-shadow:0 4px 24px color-mix(in srgb,var(--a) 38%,transparent)}
.btn-p:hover{opacity:.88;transform:translateY(-1px)}
.btn-s{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#fff}
.btn-s:hover{background:rgba(255,255,255,.1)}
.hero{padding:118px 24px 72px;position:relative;overflow:hidden}
.hero-dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px);background-size:26px 26px;mask-image:radial-gradient(ellipse 100% 100% at 50% 50%,black 0%,transparent 72%);pointer-events:none}
.hero-glow{position:absolute;top:-8%;left:50%;transform:translateX(-50%);width:860px;height:680px;background:radial-gradient(ellipse,color-mix(in srgb,var(--a) 20%,transparent),transparent 68%);pointer-events:none;animation:fi 1.2s ease both .15s}
.hero-inner{position:relative;max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr 400px;gap:52px;align-items:center}
.badge{display:inline-flex;align-items:center;gap:8px;border:1px solid color-mix(in srgb,var(--a) 35%,transparent);background:color-mix(in srgb,var(--a) 10%,transparent);border-radius:999px;padding:6px 16px;font-size:13px;font-weight:500;color:color-mix(in srgb,var(--a) 80%,#fff);margin-bottom:28px}
.dot{width:6px;height:6px;border-radius:50%;background:var(--a);animation:float 2.4s ease-in-out infinite}
h1{font-size:clamp(38px,5vw,60px);font-weight:900;line-height:1.04;letter-spacing:-2.5px;margin-bottom:22px;background:linear-gradient(140deg,#fff 0%,color-mix(in srgb,var(--a) 65%,#ddd6fe) 55%,#c4b5fd 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sub{font-size:17px;color:rgba(255,255,255,.5);max-width:480px;margin:0 0 36px;line-height:1.75}
.ctas{display:flex;gap:14px;flex-wrap:wrap}
.hero-panel{display:flex;flex-direction:column;gap:10px}
.panel-photo{position:relative;border-radius:20px;overflow:hidden;height:360px;border:1px solid rgba(255,255,255,.1);flex-shrink:0}
.panel-photo img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
.panel-photo:hover img{transform:scale(1.04)}
.panel-photo-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.3) 45%,transparent 100%);pointer-events:none}
.panel-photo-stats{position:absolute;bottom:20px;left:20px;right:20px;display:flex;gap:10px}
.pstat{flex:1;background:rgba(255,255,255,.08);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:12px 10px;text-align:center}
.pstat-val{font-size:20px;font-weight:800;letter-spacing:-.5px;background:linear-gradient(135deg,#fff,var(--a));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.pstat-lbl{font-size:10px;color:rgba(255,255,255,.5);margin-top:3px;line-height:1.3}
.panel-card{background:#18181b;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;transition:all .25s;cursor:default}
.panel-card:hover{border-color:color-mix(in srgb,var(--a) 30%,transparent);transform:translateX(-4px);background:#1c1c1f}
.panel-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;background:color-mix(in srgb,var(--a) 12%,transparent);border:1px solid color-mix(in srgb,var(--a) 25%,transparent)}
.panel-name{font-size:14px;font-weight:600;color:#fff;line-height:1.3}
.panel-price{font-size:12px;color:color-mix(in srgb,var(--a) 85%,#fff);margin-top:3px;font-weight:500}
.panel-stat{background:linear-gradient(135deg,color-mix(in srgb,var(--a) 14%,#18181b),#18181b);border:1px solid color-mix(in srgb,var(--a) 25%,transparent);border-radius:14px;padding:20px 18px;text-align:center}
.panel-stat-val{font-size:30px;font-weight:900;letter-spacing:-1px;background:linear-gradient(135deg,#fff 0%,var(--a) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.panel-stat-lbl{font-size:11px;color:rgba(255,255,255,.4);margin-top:4px;text-transform:uppercase;letter-spacing:.5px}
.stats-row{position:relative;max-width:1180px;margin:52px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.stat{background:#18181b;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:22px 16px;text-align:center}
.stat-val{font-size:28px;font-weight:800}
.stat-lbl{font-size:11px;color:rgba(255,255,255,.4);margin-top:4px;line-height:1.4}
.sec{padding:80px 24px}
.inner{max-width:1180px;margin:0 auto}
.sec-head{text-align:center;margin-bottom:52px}
.sec-tag{font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:color-mix(in srgb,var(--a) 80%,#fff);margin-bottom:12px}
h2{font-size:clamp(28px,3.5vw,40px);font-weight:800;letter-spacing:-1px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.card{background:#18181b;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px;transition:all .2s;position:relative;overflow:hidden}
.card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 100% 0%,color-mix(in srgb,var(--a) 8%,transparent),transparent 60%);opacity:0;transition:opacity .3s}
.card:hover{border-color:rgba(255,255,255,.15);background:#1c1c1f;transform:translateY(-2px)}
.card:hover::before{opacity:1}
.ibox{width:46px;height:46px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:22px;background:color-mix(in srgb,var(--a) 14%,transparent);border:1px solid color-mix(in srgb,var(--a) 28%,transparent);margin-bottom:18px}
.card h3{font-size:16px;font-weight:700;margin-bottom:8px}
.card p{font-size:13.5px;color:rgba(255,255,255,.48);line-height:1.7}
.price{font-size:13px;font-weight:600;color:var(--a);margin-top:14px}
.dark-sec{background:#111113}
.quote-sec{padding:80px 24px;text-align:center}
.qmark{font-size:80px;line-height:.8;color:color-mix(in srgb,var(--a) 50%,transparent);margin-bottom:20px}
blockquote{font-size:20px;font-weight:500;line-height:1.65;color:rgba(255,255,255,.82);max-width:720px;margin:0 auto 28px}
.author{display:inline-flex;align-items:center;gap:12px}
.avatar{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--a),rgba(255,255,255,.3))}
.author-name{font-size:14px;font-weight:700;text-align:left}
.author-role{font-size:12px;color:rgba(255,255,255,.4);margin-top:2px;text-align:left}
.cta-sec{padding:80px 24px}
.cta-box{max-width:860px;margin:0 auto;background:linear-gradient(135deg,color-mix(in srgb,var(--a) 22%,#18181b),#18181b);border:1px solid color-mix(in srgb,var(--a) 28%,transparent);border-radius:24px;padding:64px 48px;text-align:center;position:relative;overflow:hidden}
.cta-glow{position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 50% 0%,color-mix(in srgb,var(--a) 22%,transparent),transparent 70%);pointer-events:none}
.cta-box h2{font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-1px;margin-bottom:14px}
.cta-box .sub{font-size:16px;margin-bottom:36px;max-width:100%}
footer{border-top:1px solid rgba(255,255,255,.06);padding:28px 24px}
.footer-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-inner span{font-size:13px;color:rgba(255,255,255,.32)}
.footer-logo{font-size:15px;font-weight:700;color:#fff}
@keyframes glow-pulse{0%,100%{opacity:.75}50%{opacity:1}}
.hero-glow{animation:fi 1.2s ease both .15s,glow-pulse 5s ease-in-out 1.5s infinite}
.dot{box-shadow:0 0 8px 3px color-mix(in srgb,var(--a) 65%,transparent)}
.stat{transition:all .25s}
.stat:hover{border-color:color-mix(in srgb,var(--a) 30%,transparent);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.stat-val{background:linear-gradient(135deg,#fff 30%,color-mix(in srgb,var(--a) 90%,#fff) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:30px}
.card:hover{transform:translateY(-5px);box-shadow:0 24px 64px -12px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.1)}
.card::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--a) 60%,transparent),transparent);opacity:0;transition:opacity .3s;pointer-events:none}
.card:hover::after{opacity:1}
.btn-p{position:relative;overflow:hidden}
.btn-p::after{content:'';position:absolute;top:0;left:-120%;width:80%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);transform:skewX(-15deg);transition:left .55s ease;pointer-events:none}
.btn-p:hover::after{left:140%}
.cta-glow{animation:glow-pulse 3.5s ease-in-out infinite}
.ibox{transition:all .25s}
.card:hover .ibox{border-color:color-mix(in srgb,var(--a) 50%,transparent);background:color-mix(in srgb,var(--a) 20%,transparent);transform:scale(1.08)}
.panel-stat{transition:all .3s}
.panel-stat:hover{border-color:color-mix(in srgb,var(--a) 45%,transparent);box-shadow:0 8px 32px color-mix(in srgb,var(--a) 18%,transparent)}
@media(max-width:900px){
  .hero-inner{grid-template-columns:1fr}
  .hero-panel{display:none}
}
@media(max-width:768px){
  nav,.btn-hdr{display:none}
  .grid3{grid-template-columns:1fr}
  .stats-row{grid-template-columns:1fr 1fr}
  .cta-box{padding:36px 24px}
}`

  return `<!DOCTYPE html>
<html lang="ru">
<head>${head(d.businessName, d.accentColor, css)}</head>
<body>

<header class="hdr">
  <div class="hdr-inner">
    <span class="logo">${d.businessName}</span>
    <nav>
      <a href="#services">Услуги</a>
      <a href="#about">О нас</a>
      <a href="#contact">Контакты</a>
    </nav>
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-p btn-hdr" style="padding:10px 18px;font-size:13px">Позвонить</a>
  </div>
</header>

<section class="hero">
  <div class="hero-dots"></div>
  <div class="hero-glow"></div>
  <div class="hero-inner">
    <div class="hero-copy">
      <div class="badge fu"><span class="dot"></span>${d.tagline}</div>
      <h1 class="fu d1">${d.headline}</h1>
      <p class="sub fu d2">${d.subheadline}</p>
      <div class="ctas fu d3">
        <a href="#contact" class="btn btn-p">Получить консультацию</a>
        <a href="#services" class="btn btn-s">Наши услуги</a>
      </div>
    </div>
    <div class="hero-panel fu d2">
      <div class="panel-photo">
        ${d.heroImageUrl ? `<img src="${d.heroImageUrl}" alt="${d.businessName}" loading="eager">` : ""}
        <div class="panel-photo-overlay"></div>
        <div class="panel-photo-stats">
          ${stats.slice(0, 3).map(s => `<div class="pstat"><div class="pstat-val">${s.value}</div><div class="pstat-lbl">${s.label}</div></div>`).join("")}
        </div>
      </div>
      ${svcs[0] ? `<div class="panel-card"><div class="panel-icon">${svcs[0].icon}</div><div><div class="panel-name">${svcs[0].name}</div>${svcs[0].price ? `<div class="panel-price">${svcs[0].price}</div>` : ""}</div></div>` : ""}
    </div>
  </div>
  <div class="stats-row fu d4">
    ${stats.map(s => `<div class="stat reveal"><div class="stat-val">${s.value}</div><div class="stat-lbl">${s.label}</div></div>`).join("")}
  </div>
</section>

<section class="sec" id="services">
  <div class="inner">
    <div class="sec-head reveal">
      <p class="sec-tag">Что мы предлагаем</p>
      <h2>Наши услуги</h2>
    </div>
    <div class="grid3">
      ${svcs.map(s => `<div class="card reveal"><div class="ibox">${s.icon}</div><h3>${s.name}</h3><p>${s.description}</p>${s.price ? `<p class="price">${s.price}</p>` : ""}</div>`).join("")}
    </div>
  </div>
</section>

<section class="sec dark-sec" id="about">
  <div class="inner">
    <div class="sec-head reveal">
      <p class="sec-tag">Почему выбирают нас</p>
      <h2>Наши преимущества</h2>
    </div>
    <div class="grid3">
      ${feats.map(f => `<div class="card reveal" style="background:#131315"><div class="ibox">${f.icon}</div><h3>${f.title}</h3><p>${f.description}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="quote-sec reveal">
  <div class="qmark">"</div>
  <blockquote>${d.testimonial.text}</blockquote>
  <div class="author">
    <div class="avatar"></div>
    <div class="author-info">
      <div class="author-name">${d.testimonial.author}</div>
      <div class="author-role">${d.testimonial.role}</div>
    </div>
  </div>
</section>

<section class="cta-sec" id="contact">
  <div class="cta-box reveal">
    <div class="cta-glow"></div>
    <h2>${d.ctaHeadline}</h2>
    <p class="sub">${d.ctaSubtext}</p>
    <div class="ctas" style="justify-content:center">
      <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-p">${d.phone}</a>
      <a href="mailto:${d.email}" class="btn btn-s">${d.email}</a>
    </div>
  </div>
</section>

<footer>
  <div class="footer-inner">
    <span class="footer-logo">${d.businessName}</span>
    <span>${d.footerTagline}</span>
    <span>© ${new Date().getFullYear()}</span>
  </div>
</footer>
${ANIM_JS}
</body>
</html>`
}

// ─── MINIMAL (светлый, воздушный, типографика) ────────────────────────────────

export function buildMinimal(d: DesignContent): string {
  const svcs = d.services.slice(0, 3)
  const feats = d.features.slice(0, 3)
  const stats = d.stats.slice(0, 3)

  const css = `
${ANIM_CSS}
body{background:#fff;color:#0a0a0b}
.hdr{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid #f0f0f0}
.hdr-inner{max-width:1140px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:17px;font-weight:700;letter-spacing:-.4px}
nav a{color:#71717a;font-size:14px;font-weight:500;margin-left:28px;transition:color .2s}
nav a:hover{color:#0a0a0b}
.btn{display:inline-flex;align-items:center;border-radius:10px;font-weight:600;font-size:14px;padding:12px 22px;transition:all .2s;cursor:pointer}
.btn-p{background:#0a0a0b;color:#fff}
.btn-p:hover{background:#27272a;transform:translateY(-1px)}
.btn-s{border:1.5px solid #e4e4e7;color:#0a0a0b}
.btn-s:hover{border-color:#a1a1aa}
.hero{padding:148px 32px 90px;max-width:1140px;margin:0 auto}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--a);margin-bottom:24px}
.eyebrow-line{width:32px;height:2px;background:var(--a);border-radius:2px;animation:fi .8s ease both .1s}
h1{font-size:clamp(42px,5.5vw,72px);font-weight:900;line-height:1.02;letter-spacing:-3px;margin-bottom:28px;max-width:820px}
h1 em{font-style:normal;color:var(--a)}
.sub{font-size:18px;color:#52525b;max-width:520px;line-height:1.75;margin-bottom:44px}
.ctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:72px}
.stats-row{display:flex;gap:48px;border-top:1px solid #f0f0f0;padding-top:40px}
.stat-val{font-size:32px;font-weight:800;letter-spacing:-1px}
.stat-lbl{font-size:13px;color:#71717a;margin-top:4px}
.sec{padding:96px 32px;max-width:1140px;margin:0 auto}
.divider{height:1px;background:#f0f0f0;max-width:1140px;margin:0 auto}
.sec-tag{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--a);margin-bottom:14px}
h2{font-size:clamp(26px,3vw,42px);font-weight:800;letter-spacing:-1.2px;margin-bottom:52px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border:1px solid #f0f0f0;border-radius:16px;overflow:hidden}
.card{padding:32px;background:#fff;transition:background .2s;position:relative;overflow:hidden}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--a);transform:scaleX(0);transform-origin:left;transition:transform .3s}
.card:hover{background:#fafafa}
.card:hover::before{transform:scaleX(1)}
.card+.card{border-left:1px solid #f0f0f0}
.ibox{font-size:26px;margin-bottom:18px}
.card h3{font-size:16px;font-weight:700;margin-bottom:8px;letter-spacing:-.3px}
.card p{font-size:14px;color:#71717a;line-height:1.7}
.price{font-size:14px;font-weight:700;color:var(--a);margin-top:14px}
.feats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
.feat{position:relative;padding-left:0}
.feat-icon{font-size:28px;margin-bottom:16px}
.feat h3{font-size:16px;font-weight:700;margin-bottom:8px;letter-spacing:-.3px}
.feat p{font-size:14px;color:#71717a;line-height:1.7}
.quote-sec{background:#fafafa;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;padding:96px 32px;text-align:center}
.qmark{font-size:96px;font-weight:900;line-height:.7;color:var(--a);margin-bottom:24px}
blockquote{font-size:22px;font-weight:500;color:#18181b;max-width:680px;margin:0 auto 32px;line-height:1.6;letter-spacing:-.3px}
.author{display:inline-flex;align-items:center;gap:14px}
.avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--a),#c4b5fd)}
.author-name{font-size:14px;font-weight:700;text-align:left}
.author-role{font-size:12px;color:#71717a;text-align:left;margin-top:2px}
.cta-sec{padding:96px 32px;text-align:center}
.cta-tag{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--a);margin-bottom:20px}
.cta-sec h2{font-size:clamp(30px,4vw,52px);font-weight:900;letter-spacing:-2px;max-width:640px;margin:0 auto 16px}
.cta-sub{font-size:16px;color:#52525b;margin-bottom:40px}
footer{border-top:1px solid #f0f0f0;padding:28px 32px}
.footer-inner{max-width:1140px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-inner span{font-size:13px;color:#a1a1aa}
.footer-logo{font-size:15px;font-weight:700;color:#0a0a0b}
@keyframes shine{0%{left:-120%}100%{left:140%}}
.stat-val{color:var(--a)}
.stat:hover .stat-val{opacity:.85}
.card{transition:all .2s}
.card:hover{background:#f5f3ff;box-shadow:0 8px 32px rgba(0,0,0,.07);transform:translateY(-2px)}
.card:hover::before{transform:scaleX(1)}
.btn-p{position:relative;overflow:hidden}
.btn-p::after{content:'';position:absolute;top:0;left:-120%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:skewX(-15deg);animation:none;pointer-events:none}
.btn-p:hover::after{animation:shine .55s ease forwards}
.feat h3::before{content:'';display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--a);margin-right:8px;vertical-align:middle}
.hero-photo{max-width:1140px;margin:0 auto;padding:0 32px 64px;overflow:hidden}
.hero-photo img{width:100%;height:420px;object-fit:cover;border-radius:20px;display:block;transition:transform .6s ease}
.hero-photo img:hover{transform:scale(1.02)}
@media(max-width:768px){
  nav,.btn-hdr{display:none}
  .grid3{grid-template-columns:1fr;border-radius:12px}
  .card+.card{border-left:none;border-top:1px solid #f0f0f0}
  .feats-grid{grid-template-columns:1fr;gap:28px}
  .stats-row{flex-direction:column;gap:24px}
  .hero-photo img{height:240px}
}`

  return `<!DOCTYPE html>
<html lang="ru">
<head>${head(d.businessName, d.accentColor, css)}</head>
<body>

<header class="hdr">
  <div class="hdr-inner">
    <span class="logo">${d.businessName}</span>
    <nav>
      <a href="#services">Услуги</a>
      <a href="#about">О нас</a>
      <a href="#contact">Контакты</a>
    </nav>
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-p btn-hdr" style="padding:10px 18px;font-size:13px">Позвонить</a>
  </div>
</header>

<section class="hero">
  <div class="hero-eyebrow fu"><span class="eyebrow-line"></span>${d.tagline}</div>
  <h1 class="fu d1">${d.headline.split(" ").map((w, i) => i === 0 ? `<em>${w}</em>` : w).join(" ")}</h1>
  <p class="sub fu d2">${d.subheadline}</p>
  <div class="ctas fu d3">
    <a href="#contact" class="btn btn-p">Связаться с нами</a>
    <a href="#services" class="btn btn-s">Смотреть услуги</a>
  </div>
  <div class="stats-row fu d4">
    ${stats.map(s => `<div><div class="stat-val">${s.value}</div><div class="stat-lbl">${s.label}</div></div>`).join("")}
  </div>
</section>

${d.heroImageUrl ? `<div class="hero-photo reveal"><img src="${d.heroImageUrl}" alt="${d.businessName}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : ""}

<div class="divider"></div>

<section class="sec" id="services">
  <p class="sec-tag reveal">Услуги</p>
  <h2 class="reveal">Что мы делаем</h2>
  <div class="grid3">
    ${svcs.map(s => `<div class="card reveal"><div class="ibox">${s.icon}</div><h3>${s.name}</h3><p>${s.description}</p>${s.price ? `<p class="price">${s.price}</p>` : ""}</div>`).join("")}
  </div>
</section>

<div class="divider"></div>

<section class="sec" id="about">
  <p class="sec-tag reveal">Преимущества</p>
  <h2 class="reveal">Почему выбирают нас</h2>
  <div class="feats-grid">
    ${feats.map(f => `<div class="feat reveal"><div class="feat-icon">${f.icon}</div><h3>${f.title}</h3><p>${f.description}</p></div>`).join("")}
  </div>
</section>

<section class="quote-sec">
  <div class="qmark reveal">&#8220;</div>
  <blockquote class="reveal">${d.testimonial.text}</blockquote>
  <div class="author reveal">
    <div class="avatar"></div>
    <div>
      <div class="author-name">${d.testimonial.author}</div>
      <div class="author-role">${d.testimonial.role}</div>
    </div>
  </div>
</section>

<section class="cta-sec" id="contact">
  <p class="cta-tag reveal">Начать работу</p>
  <h2 class="reveal">${d.ctaHeadline}</h2>
  <p class="cta-sub reveal">${d.ctaSubtext}</p>
  <div class="ctas reveal" style="justify-content:center">
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-p">${d.phone}</a>
    <a href="mailto:${d.email}" class="btn btn-s">${d.email}</a>
  </div>
</section>

<footer>
  <div class="footer-inner">
    <span class="footer-logo">${d.businessName}</span>
    <span>${d.footerTagline}</span>
    <span>© ${new Date().getFullYear()}</span>
  </div>
</footer>
${ANIM_JS}
</body>
</html>`
}

// ─── BOLD (тёмный, крупная типографика, высокий контраст) ────────────────────

export function buildBold(d: DesignContent): string {
  const svcs = d.services.slice(0, 3)
  const feats = d.features.slice(0, 3)
  const stats = d.stats.slice(0, 3)

  // Для bold чуть другая анимация — быстрее и резче
  const boldAnimCss = `
@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
.fu{animation:fu .45s cubic-bezier(.2,.8,.3,1) both}
.fi{animation:fi .4s ease both}
.d1{animation-delay:.06s}.d2{animation-delay:.14s}.d3{animation-delay:.24s}.d4{animation-delay:.36s}.d5{animation-delay:.50s}
.reveal{opacity:0;transform:translateY(12px);transition:opacity .45s cubic-bezier(.2,.8,.3,1),transform .45s cubic-bezier(.2,.8,.3,1)}
.reveal.in{opacity:1;transform:translateY(0)}`

  const css = `
${boldAnimCss}
body{background:#000;color:#fff}
.hdr{position:fixed;top:0;left:0;right:0;z-index:50;background:#000;border-bottom:1px solid rgba(255,255,255,.1)}
.hdr-inner{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:18px;font-weight:900;letter-spacing:-.5px}
nav a{color:rgba(255,255,255,.5);font-size:12px;font-weight:600;margin-left:28px;transition:color .2s;text-transform:uppercase;letter-spacing:.5px}
nav a:hover{color:#fff}
.btn{display:inline-flex;align-items:center;font-weight:700;font-size:14px;padding:13px 26px;transition:all .2s;cursor:pointer;text-transform:uppercase;letter-spacing:.5px}
.btn-p{background:var(--a);color:#fff;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)}
.btn-p:hover{opacity:.85;transform:translateY(-1px)}
.btn-s{border:2px solid rgba(255,255,255,.25);color:#fff}
.btn-s:hover{border-color:#fff}
.hero{padding:160px 24px 80px;max-width:1200px;margin:0 auto;position:relative}
.hero-accent{position:absolute;top:120px;right:0;font-size:clamp(120px,18vw,200px);font-weight:900;line-height:1;color:rgba(255,255,255,.025);pointer-events:none;letter-spacing:-8px;text-transform:uppercase;user-select:none}
.hero-num{font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:20px;display:flex;align-items:center;gap:12px}
.hero-num::before{content:'';width:40px;height:1px;background:var(--a)}
h1{font-size:clamp(48px,7vw,84px);font-weight:900;line-height:.97;letter-spacing:-4px;text-transform:uppercase;margin-bottom:32px;position:relative}
h1 .accent-word{color:var(--a)}
.sub{font-size:17px;color:rgba(255,255,255,.45);max-width:480px;line-height:1.7;margin-bottom:44px;border-left:3px solid var(--a);padding-left:18px}
.ctas{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:80px}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.08);border-top:1px solid rgba(255,255,255,.08)}
.stat{padding:32px 20px;background:#000}
.stat-val{font-size:40px;font-weight:900;letter-spacing:-2px;color:var(--a)}
.stat-lbl{font-size:12px;color:rgba(255,255,255,.35);margin-top:6px;text-transform:uppercase;letter-spacing:1px}
.sec{padding:96px 24px;max-width:1200px;margin:0 auto}
.sec-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:52px;flex-wrap:wrap;gap:16px}
.sec-tag{font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--a);margin-bottom:12px}
h2{font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-2px;text-transform:uppercase;line-height:1}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.08)}
.card{background:#0a0a0a;padding:36px 28px;transition:background .2s;position:relative;overflow:hidden}
.card::after{content:'';position:absolute;left:0;bottom:0;width:0;height:2px;background:var(--a);transition:width .3s}
.card:hover{background:#111}
.card:hover::after{width:100%}
.card-num{font-size:48px;font-weight:900;color:rgba(255,255,255,.07);letter-spacing:-2px;margin-bottom:-8px;line-height:1}
.ibox{font-size:28px;margin-bottom:16px}
.card h3{font-size:17px;font-weight:800;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px}
.card p{font-size:14px;color:rgba(255,255,255,.45);line-height:1.7}
.price{font-size:15px;font-weight:800;color:var(--a);margin-top:16px}
.feats-sec{background:#060606;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);padding:96px 24px}
.quote-sec{padding:96px 24px;text-align:center}
.qmark{font-size:120px;font-weight:900;line-height:.7;color:var(--a);margin-bottom:20px}
blockquote{font-size:24px;font-weight:700;color:rgba(255,255,255,.85);max-width:760px;margin:0 auto 32px;line-height:1.5;text-transform:uppercase;letter-spacing:-.5px}
.author{display:inline-flex;align-items:center;gap:14px}
.author-line{width:30px;height:2px;background:var(--a)}
.author-name{font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;text-align:left}
.author-role{font-size:11px;color:rgba(255,255,255,.4);margin-top:3px;text-transform:uppercase;letter-spacing:.5px;text-align:left}
.cta-sec{background:var(--a);padding:96px 24px;text-align:center;position:relative;overflow:hidden}
.cta-sec::before{content:'';position:absolute;top:-50%;right:-20%;width:600px;height:600px;background:rgba(255,255,255,.08);border-radius:50%;pointer-events:none}
.cta-sec h2{font-size:clamp(32px,5vw,64px);font-weight:900;letter-spacing:-3px;text-transform:uppercase;margin-bottom:16px;position:relative}
.cta-sub{font-size:17px;color:rgba(255,255,255,.75);margin-bottom:44px;position:relative}
.btn-dark{background:#000;color:#fff;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%);position:relative}
.btn-dark:hover{background:#111}
footer{border-top:2px solid rgba(255,255,255,.1);padding:28px 24px}
.footer-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-inner span{font-size:12px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.5px}
.footer-logo{font-size:16px;font-weight:900;color:#fff}
@keyframes bold-pulse{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 28px 4px color-mix(in srgb,var(--a) 40%,transparent)}}
.stat{transition:all .25s}
.stat:hover{background:#111;box-shadow:inset 0 1px 0 var(--a)}
.card{transition:background .2s,transform .25s,box-shadow .25s}
.card:hover{background:#161616;transform:translateY(-3px);box-shadow:0 20px 48px rgba(0,0,0,.7)}
.card:hover::after{width:100%;box-shadow:0 0 12px color-mix(in srgb,var(--a) 70%,transparent)}
.btn-p{position:relative;overflow:hidden;transition:all .2s}
.btn-p::before{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:rgba(255,255,255,.15);transform:skewX(-15deg);transition:left .4s ease;pointer-events:none}
.btn-p:hover::before{left:140%}
.btn-p:hover{opacity:1;transform:translateY(-2px);animation:bold-pulse .6s ease .15s 1}
.cta-sec::after{content:'';position:absolute;bottom:-50%;left:-20%;width:500px;height:500px;background:rgba(255,255,255,.06);border-radius:50%;pointer-events:none}
.img-banner{overflow:hidden;height:380px;position:relative}
.img-banner img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.7)}
.img-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,.65) 0%,transparent 55%)}
.img-banner-label{position:absolute;bottom:32px;left:24px;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.5)}
@media(max-width:768px){
  nav,.btn-hdr{display:none}
  .grid3{grid-template-columns:1fr}
  h1{letter-spacing:-2px}
  .sec-head{flex-direction:column;align-items:flex-start}
  .stats-row{grid-template-columns:1fr}
  .hero-accent{display:none}
  .img-banner{height:220px}
}`

  const words = d.headline.split(" ")
  const accentIdx = Math.floor(words.length / 2)
  const h1 = words.map((w, i) => i === accentIdx ? `<span class="accent-word">${w}</span>` : w).join(" ")

  return `<!DOCTYPE html>
<html lang="ru">
<head>${head(d.businessName, d.accentColor, css)}</head>
<body>

<header class="hdr">
  <div class="hdr-inner">
    <span class="logo">${d.businessName}</span>
    <nav>
      <a href="#services">Услуги</a>
      <a href="#about">О нас</a>
      <a href="#contact">Контакты</a>
    </nav>
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-p btn-hdr" style="padding:10px 18px">Звонок</a>
  </div>
</header>

<section class="hero">
  <div class="hero-accent fu d5">${d.businessName.split(" ")[0]?.toUpperCase() ?? ""}</div>
  <div class="hero-num fu">${d.tagline}</div>
  <h1 class="fu d1">${h1}</h1>
  <p class="sub fu d2">${d.subheadline}</p>
  <div class="ctas fu d3">
    <a href="#contact" class="btn btn-p">Начать сейчас</a>
    <a href="#services" class="btn btn-s">Наши услуги</a>
  </div>
</section>

<div class="stats-row fu d4">
  ${stats.map(s => `<div class="stat reveal"><div class="stat-val">${s.value}</div><div class="stat-lbl">${s.label}</div></div>`).join("")}
</div>

${d.heroImageUrl ? `<div class="img-banner"><img src="${d.heroImageUrl}" alt="${d.businessName}" loading="lazy" onerror="this.parentElement.style.display='none'"><div class="img-banner-label">${d.tagline}</div></div>` : ""}

<section class="sec" id="services">
  <div class="sec-head reveal">
    <div>
      <p class="sec-tag">Что мы делаем</p>
      <h2>Услуги</h2>
    </div>
  </div>
  <div class="grid3">
    ${svcs.map((s, i) => `<div class="card reveal"><div class="card-num">0${i + 1}</div><div class="ibox">${s.icon}</div><h3>${s.name}</h3><p>${s.description}</p>${s.price ? `<p class="price">${s.price}</p>` : ""}</div>`).join("")}
  </div>
</section>

<section class="feats-sec" id="about">
  <div style="max-width:1200px;margin:0 auto">
    <div class="sec-head reveal">
      <div>
        <p class="sec-tag">Наши принципы</p>
        <h2>Преимущества</h2>
      </div>
    </div>
    <div class="grid3">
      ${feats.map(f => `<div class="card reveal" style="background:#060606"><div class="ibox">${f.icon}</div><h3>${f.title}</h3><p>${f.description}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="quote-sec">
  <div class="qmark reveal">&#8220;</div>
  <blockquote class="reveal">${d.testimonial.text}</blockquote>
  <div class="author reveal">
    <div class="author-line"></div>
    <div>
      <div class="author-name">${d.testimonial.author}</div>
      <div class="author-role">${d.testimonial.role}</div>
    </div>
  </div>
</section>

<section class="cta-sec" id="contact">
  <h2 class="reveal">${d.ctaHeadline}</h2>
  <p class="cta-sub reveal">${d.ctaSubtext}</p>
  <div class="ctas reveal" style="justify-content:center">
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-dark">${d.phone}</a>
    <a href="mailto:${d.email}" class="btn" style="border:2px solid rgba(255,255,255,.4);color:#fff">${d.email}</a>
  </div>
</section>

<footer>
  <div class="footer-inner">
    <span class="footer-logo">${d.businessName}</span>
    <span>${d.footerTagline}</span>
    <span>© ${new Date().getFullYear()}</span>
  </div>
</footer>
${ANIM_JS}
</body>
</html>`
}

// ─── CORPORATE (светлый, синий, профессиональный) ─────────────────────────────

export function buildCorporate(d: DesignContent): string {
  const svcs = d.services.slice(0, 3)
  const feats = d.features.slice(0, 3)
  const stats = d.stats.slice(0, 3)

  const css = `
${ANIM_CSS}
body{background:#f8fafc;color:#0f172a}
.hdr{position:fixed;top:0;left:0;right:0;z-index:50;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.hdr-inner{max-width:1180px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:66px}
.logo{font-size:17px;font-weight:800;color:var(--a);letter-spacing:-.4px}
nav a{color:#475569;font-size:14px;font-weight:500;margin-left:28px;transition:color .2s}
nav a:hover{color:var(--a)}
.btn{display:inline-flex;align-items:center;border-radius:8px;font-weight:600;font-size:14px;padding:11px 22px;transition:all .2s;cursor:pointer}
.btn-p{background:var(--a);color:#fff;box-shadow:0 2px 8px color-mix(in srgb,var(--a) 35%,transparent)}
.btn-p:hover{opacity:.88;transform:translateY(-1px)}
.btn-s{border:1.5px solid #cbd5e1;background:#fff;color:#334155}
.btn-s:hover{border-color:var(--a);color:var(--a)}
.hero{padding:132px 28px 72px;background:#fff;border-bottom:1px solid #e2e8f0}
.hero-inner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.hero-left{}
.tag{display:inline-flex;align-items:center;gap:6px;background:color-mix(in srgb,var(--a) 8%,transparent);color:var(--a);border:1px solid color-mix(in srgb,var(--a) 20%,transparent);border-radius:6px;padding:5px 12px;font-size:12px;font-weight:600;margin-bottom:22px}
h1{font-size:clamp(34px,4vw,52px);font-weight:800;line-height:1.1;letter-spacing:-1.5px;color:#0f172a;margin-bottom:20px}
.sub{font-size:16px;color:#64748b;line-height:1.75;margin-bottom:36px;max-width:460px}
.ctas{display:flex;gap:12px;flex-wrap:wrap}
.hero-right{background:linear-gradient(135deg,color-mix(in srgb,var(--a) 8%,#fff),color-mix(in srgb,var(--a) 4%,#fff));border:1px solid color-mix(in srgb,var(--a) 15%,transparent);border-radius:16px;padding:36px;overflow:hidden}
.hr-photo{margin:-36px -36px 24px;height:260px;overflow:hidden;position:relative}
.hr-photo img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
.hr-photo:hover img{transform:scale(1.04)}
.hr-photo::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60px;background:linear-gradient(to top,color-mix(in srgb,var(--a) 6%,#fff),transparent);pointer-events:none}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.hstat{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:22px 18px;text-align:center;transition:border-color .2s,box-shadow .2s}
.hstat:hover{border-color:color-mix(in srgb,var(--a) 30%,transparent);box-shadow:0 4px 12px rgba(0,0,0,.06)}
.hstat-val{font-size:28px;font-weight:800;color:var(--a);letter-spacing:-1px}
.hstat-lbl{font-size:11px;color:#94a3b8;margin-top:4px;line-height:1.4}
.hstat-big{grid-column:1/-1}
.sec{padding:80px 28px;max-width:1180px;margin:0 auto}
.sec-head{margin-bottom:44px}
.sec-tag{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--a);margin-bottom:10px}
h2{font-size:clamp(24px,3vw,38px);font-weight:800;letter-spacing:-1px;color:#0f172a}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:28px;transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.04);position:relative;overflow:hidden}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--a),color-mix(in srgb,var(--a) 50%,#818cf8));transform:scaleX(0);transform-origin:left;transition:transform .3s}
.card:hover{border-color:color-mix(in srgb,var(--a) 40%,transparent);box-shadow:0 4px 20px rgba(0,0,0,.08);transform:translateY(-2px)}
.card:hover::before{transform:scaleX(1)}
.ibox{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;background:color-mix(in srgb,var(--a) 10%,transparent);margin-bottom:16px}
.card h3{font-size:15px;font-weight:700;margin-bottom:8px;color:#1e293b}
.card p{font-size:13.5px;color:#64748b;line-height:1.7}
.price{font-size:14px;font-weight:700;color:var(--a);margin-top:14px}
.feats-sec{background:#fff;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0}
.quote-sec{padding:80px 28px;background:#fff;border-bottom:1px solid #e2e8f0}
.quote-inner{max-width:760px;margin:0 auto;text-align:center}
.qbox{background:color-mix(in srgb,var(--a) 5%,#fff);border:1px solid color-mix(in srgb,var(--a) 15%,transparent);border-radius:18px;padding:48px 40px}
.qmark{font-size:52px;line-height:.8;color:var(--a);margin-bottom:16px;font-weight:800}
blockquote{font-size:18px;font-weight:500;color:#334155;line-height:1.7;margin-bottom:28px}
.author{display:flex;align-items:center;justify-content:center;gap:12px}
.avatar{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--a),color-mix(in srgb,var(--a) 60%,#fff))}
.author-name{font-size:14px;font-weight:700;color:#1e293b;text-align:left}
.author-role{font-size:12px;color:#94a3b8;text-align:left;margin-top:2px}
.cta-sec{padding:80px 28px;background:linear-gradient(135deg,var(--a),color-mix(in srgb,var(--a) 80%,#1e3a8a));text-align:center;position:relative;overflow:hidden}
.cta-sec::after{content:'';position:absolute;bottom:-60px;right:-60px;width:320px;height:320px;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none}
.cta-sec h2{font-size:clamp(26px,3.5vw,42px);font-weight:800;letter-spacing:-1px;color:#fff;margin-bottom:14px;position:relative}
.cta-sub{font-size:16px;color:rgba(255,255,255,.75);margin-bottom:36px;position:relative}
.btn-white{background:#fff;color:var(--a);font-weight:700}
.btn-white:hover{background:#f8fafc;transform:translateY(-1px)}
.btn-outline-w{border:2px solid rgba(255,255,255,.35);color:#fff}
.btn-outline-w:hover{border-color:#fff}
footer{background:#fff;border-top:1px solid #e2e8f0;padding:24px 28px}
.footer-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-logo{font-size:15px;font-weight:800;color:var(--a)}
.footer-inner span{font-size:13px;color:#94a3b8}
@keyframes corp-shine{0%{left:-120%}100%{left:140%}}
.hstat{transition:all .25s}
.hstat:hover{border-color:color-mix(in srgb,var(--a) 50%,transparent);box-shadow:0 6px 18px color-mix(in srgb,var(--a) 12%,transparent);transform:translateY(-2px)}
.card:hover{border-color:color-mix(in srgb,var(--a) 45%,transparent);box-shadow:0 8px 28px rgba(0,0,0,.1);transform:translateY(-3px)}
.card:hover .ibox{background:color-mix(in srgb,var(--a) 18%,transparent);transform:scale(1.1);transition:all .25s}
.btn-p{position:relative;overflow:hidden}
.btn-p::after{content:'';position:absolute;top:0;left:-120%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:skewX(-15deg);pointer-events:none}
.btn-p:hover::after{animation:corp-shine .5s ease forwards}
.btn-p:hover{opacity:1;box-shadow:0 6px 20px color-mix(in srgb,var(--a) 40%,transparent);transform:translateY(-2px)}
.qbox{transition:all .3s}
.qbox:hover{box-shadow:0 8px 32px color-mix(in srgb,var(--a) 10%,transparent);transform:translateY(-2px)}
@media(max-width:900px){
  nav,.btn-hdr{display:none}
  .hero-inner{grid-template-columns:1fr}
  .hero-right{display:none}
  .grid3{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){
  .grid3{grid-template-columns:1fr}
}`

  return `<!DOCTYPE html>
<html lang="ru">
<head>${head(d.businessName, d.accentColor, css)}</head>
<body>

<header class="hdr">
  <div class="hdr-inner">
    <span class="logo">${d.businessName}</span>
    <nav>
      <a href="#services">Услуги</a>
      <a href="#about">О нас</a>
      <a href="#contact">Контакты</a>
    </nav>
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-p btn-hdr" style="padding:9px 18px;font-size:13px">Позвонить</a>
  </div>
</header>

<section class="hero">
  <div class="hero-inner">
    <div class="hero-left">
      <div class="tag fu">${d.tagline}</div>
      <h1 class="fu d1">${d.headline}</h1>
      <p class="sub fu d2">${d.subheadline}</p>
      <div class="ctas fu d3">
        <a href="#contact" class="btn btn-p">Получить предложение</a>
        <a href="#services" class="btn btn-s">Наши услуги</a>
      </div>
    </div>
    <div class="hero-right fu d2">
      ${d.heroImageUrl ? `<div class="hr-photo"><img src="${d.heroImageUrl}" alt="${d.businessName}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : ""}
      <div class="stat-grid">
        ${stats.map((s, i) => `<div class="hstat${i === 0 ? " hstat-big" : ""}"><div class="hstat-val">${s.value}</div><div class="hstat-lbl">${s.label}</div></div>`).join("")}
      </div>
    </div>
  </div>
</section>

<section class="sec" id="services">
  <div class="sec-head reveal">
    <p class="sec-tag">Услуги</p>
    <h2>Что мы предлагаем</h2>
  </div>
  <div class="grid3">
    ${svcs.map(s => `<div class="card reveal"><div class="ibox">${s.icon}</div><h3>${s.name}</h3><p>${s.description}</p>${s.price ? `<p class="price">${s.price}</p>` : ""}</div>`).join("")}
  </div>
</section>

<section class="feats-sec sec" id="about">
  <div class="sec-head reveal">
    <p class="sec-tag">Почему мы</p>
    <h2>Наши преимущества</h2>
  </div>
  <div class="grid3">
    ${feats.map(f => `<div class="card reveal"><div class="ibox">${f.icon}</div><h3>${f.title}</h3><p>${f.description}</p></div>`).join("")}
  </div>
</section>

<section class="quote-sec">
  <div class="quote-inner">
    <div class="qbox reveal">
      <div class="qmark">&#8220;</div>
      <blockquote>${d.testimonial.text}</blockquote>
      <div class="author">
        <div class="avatar"></div>
        <div>
          <div class="author-name">${d.testimonial.author}</div>
          <div class="author-role">${d.testimonial.role}</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="cta-sec" id="contact">
  <h2 class="reveal">${d.ctaHeadline}</h2>
  <p class="cta-sub reveal">${d.ctaSubtext}</p>
  <div class="ctas reveal" style="justify-content:center">
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-white">${d.phone}</a>
    <a href="mailto:${d.email}" class="btn btn-outline-w">${d.email}</a>
  </div>
</section>

<footer>
  <div class="footer-inner">
    <span class="footer-logo">${d.businessName}</span>
    <span>${d.footerTagline}</span>
    <span>© ${new Date().getFullYear()}</span>
  </div>
</footer>
${ANIM_JS}
</body>
</html>`
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function fillTemplate(style: string, content: DesignContent): string {
  switch (style) {
    case "minimal":   return buildMinimal(content)
    case "bold":      return buildBold(content)
    case "corporate": return buildCorporate(content)
    default:          return buildModern(content)
  }
}
