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
  heroImageCredit?: { name: string; url: string }
}

// ─── Нишевые сиды ─────────────────────────────────────────────────────────────

const NICHE_SEEDS: Array<[RegExp, string, string]> = [
  [/стоматол|зуб|дент/i,                                    "dentist",     "dental clinic interior"],
  [/ресторан|кафе|суши|пицц|бургер|шашлык|еда|бар/i,        "restaurant",  "restaurant interior cozy"],
  [/салон|красот|барбер|парикмах|маникюр|педикюр|макияж|перманент/i, "beauty", "beauty salon interior"],
  [/фитнес|спорт|тренаж|йога|зал|бокс/i,                    "fitness",     "gym fitness training"],
  [/медицин|клиник|врач|больниц|лечени/i,                    "medical",     "medical clinic doctor"],
  [/юрист|адвокат|право|нотар|юридич/i,                      "justice",     "law office lawyer"],
  [/строительств|строитель|ремонт|отделк|кровл|монтаж|экскаватор|землян/i, "construction", "construction site building"],
  [/\bit\b|айти|разработк|программ|сайт|приложен/i,          "technology",  "modern office team technology"],
  [/курс|обучен|школ|образован|репетитор/i,                  "education",   "classroom education learning"],
  [/бухгалт|налог|аудит|финанс/i,                            "finance",     "finance office accounting"],
  [/недвижим|риелтор|квартир|аренда/i,                       "interior",    "modern apartment interior"],
  [/авто|шиномонтаж|сто|кузов|машин/i,                       "automobile",  "car repair garage mechanic"],
  [/свадьб|праздник|event|мероприят/i,                       "wedding",     "wedding event photography"],
  [/доставка|логистик|курьер|транспорт/i,                    "logistics",   "delivery logistics warehouse"],
  [/фото|видео|съёмк/i,                                      "studio",      "photography studio camera"],
]

export function getNicheImage(businessType: string, w = 800, h = 500): string {
  const seed = NICHE_SEEDS.find(([re]) => re.test(businessType))?.[1] ?? "office"
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

export function getNicheQuery(businessType: string): string {
  return NICHE_SEEDS.find(([re]) => re.test(businessType))?.[2] ?? "modern office business team"
}

// ─── Атрибуция фото ───────────────────────────────────────────────────────────

function creditBadge(d: DesignContent): string {
  if (!d.heroImageCredit) return ""
  return `<a href="${d.heroImageCredit.url}" target="_blank" rel="noopener noreferrer" style="position:absolute;top:10px;right:10px;z-index:3;font-size:10px;font-weight:500;color:rgba(255,255,255,.7);text-decoration:none;background:rgba(0,0,0,.35);padding:3px 7px;border-radius:6px;backdrop-filter:blur(4px)">📷 Pexels</a>`
}

function creditCaption(d: DesignContent): string {
  if (!d.heroImageCredit) return ""
  return `<div style="max-width:1140px;margin:6px auto 0;padding:0 32px;text-align:right"><a href="${d.heroImageCredit.url}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#9CA3AF;text-decoration:none">Фото: ${d.heroImageCredit.name} / Pexels</a></div>`
}

function buildFaqItems(d: DesignContent): Array<{ q: string; a: string }> {
  const svcs = d.services.slice(0, 3)
  return [
    {
      q: svcs[0] ? `Сколько стоит «${svcs[0].name}»?` : "Как рассчитывается стоимость?",
      a: svcs[0]?.price
        ? `Базовая стоимость — ${svcs[0].price}. Точная цена зависит от объёма задачи — позвоните или напишите, рассчитаем за 15 минут.`
        : "Стоимость рассчитывается индивидуально под ваш запрос. Позвоните или напишите — ответим в течение 15 минут.",
    },
    {
      q: svcs[1] ? `Что входит в услугу «${svcs[1].name}»?` : "Что включает базовая услуга?",
      a: svcs[1] ? svcs[1].description : "Подробный состав услуги обсуждается на первой консультации.",
    },
    {
      q: "Работаете ли вы по договору?",
      a: "Да. Стоимость и сроки фиксируем в договоре до начала работ — никаких скрытых доплат и устных договорённостей.",
    },
    {
      q: "Как быстро можно приступить к работе?",
      a: "Обычно начинаем в течение 1–3 рабочих дней после согласования. Свяжитесь с нами, уточним вашу ситуацию.",
    },
  ]
}

// ─── Нишевые шрифты ───────────────────────────────────────────────────────────

interface NicheFont {
  fontUrl: string
  fontFamily: string
  displayFontFamily: string
}

const DEFAULT_NICHE_FONT: NicheFont = { fontUrl: "", fontFamily: "", displayFontFamily: "" }

function getNicheFont(businessType: string): NicheFont {
  const t = businessType
  if (/салон|красот|барбер|парикмах|маникюр|педикюр|макияж|перманент|косметолог/i.test(t))
    return { fontUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", displayFontFamily: "'Cormorant Garamond',Georgia,serif" }
  if (/ресторан|кафе|суши|пицц|бургер|еда|бар|кофе/i.test(t))
    return { fontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@400;700&display=swap", fontFamily: "'Lato',system-ui,sans-serif", displayFontFamily: "'Playfair Display',Georgia,serif" }
  if (/медицин|клиник|врач|больниц|лечени|стоматол|дентист/i.test(t))
    return { fontUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", displayFontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }
  if (/юрист|адвокат|право|нотар|юридич|бухгалт|налог|финанс/i.test(t))
    return { fontUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,700;1,400&family=IBM+Plex+Sans:wght@400;500;600&display=swap", fontFamily: "'IBM Plex Sans',system-ui,sans-serif", displayFontFamily: "'IBM Plex Serif',Georgia,serif" }
  if (/строительств|ремонт|отделк|кровл|монтаж/i.test(t))
    return { fontUrl: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap", fontFamily: "'Manrope',system-ui,sans-serif", displayFontFamily: "'Manrope',system-ui,sans-serif" }
  if (/фитнес|спорт|тренаж|йога|зал|бокс/i.test(t))
    return { fontUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&display=swap", fontFamily: "'Barlow',system-ui,sans-serif", displayFontFamily: "'Bebas Neue',sans-serif" }
  return DEFAULT_NICHE_FONT
}

// ─── head() — общий для всех шаблонов ────────────────────────────────────────

function head(
  title: string,
  accent: string,
  extraCss = "",
  fontUrl = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
  fontFamily = "'Space Grotesk',system-ui,sans-serif",
) {
  return `<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${fontUrl}" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:${fontFamily}}
:root{--a:${accent}}
a{text-decoration:none;color:inherit}
img{display:block;max-width:100%}
${extraCss}
</style>`
}

// ─── Общие анимации ───────────────────────────────────────────────────────────

const ANIM_CSS = `
@keyframes fu{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.fu{animation:fu .7s cubic-bezier(.16,1,.3,1) both}
.fi{animation:fi .55s ease both}
.d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.30s}.d4{animation-delay:.44s}.d5{animation-delay:.60s}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1)}
.reveal.in{opacity:1;transform:translateY(0)}`

// ─── Scroll-reveal + анимированные счётчики ───────────────────────────────────

const ANIM_JS = `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>
(function(){
if(typeof lucide!=='undefined')lucide.createIcons();
var io=new IntersectionObserver(function(e){e.forEach(function(n){if(n.isIntersecting){n.target.classList.add('in');io.unobserve(n.target)}})},{threshold:.1,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.reveal').forEach(function(el){
  var p=el.closest('.grid3,.feats-grid,.steps-grid,.trust-strip');
  if(p){var i=Array.from(p.children).indexOf(el);el.style.transitionDelay=(i*.1)+'s'}
  io.observe(el)
});
function countUp(el){
  var orig=el.dataset.target||el.textContent.trim();
  el.dataset.target=orig;
  var m=orig.match(/(\d[\d ]*\.?\d*)/);
  if(!m)return;
  var num=parseFloat(m[1].replace(/ /g,''));
  if(isNaN(num)||num===0)return;
  var pre=orig.slice(0,orig.indexOf(m[1]));
  var suf=orig.slice(orig.indexOf(m[1])+m[1].length);
  var hasDot=m[1].includes('.');
  var dec=hasDot?m[1].split('.')[1].length:0;
  var t0=null;var dur=1600;
  function tick(ts){
    if(!t0)t0=ts;
    var p=Math.min((ts-t0)/dur,1);
    var ease=1-Math.pow(1-p,3);
    var v=ease*num;
    el.textContent=pre+(hasDot?v.toFixed(dec):Math.floor(v).toLocaleString('ru-RU'))+suf;
    if(p<1)requestAnimationFrame(tick);
    else el.textContent=orig;
  }
  requestAnimationFrame(tick)
}
var cio=new IntersectionObserver(function(e){e.forEach(function(n){if(n.isIntersecting){countUp(n.target);cio.unobserve(n.target)}})},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(function(el){
  el.dataset.target=el.textContent.trim();
  cio.observe(el)
})
})()
</script>`

// ─────────────────────────────────────────────────────────────────────────────
// MODERN — Aurora Glassmorphism
// ─────────────────────────────────────────────────────────────────────────────

export function buildModern(d: DesignContent, _nf: NicheFont = DEFAULT_NICHE_FONT): string {
  const svcs  = d.services.slice(0, 3)
  const feats = d.features.slice(0, 3)
  const stats = d.stats.slice(0, 3)

  const css = `
${ANIM_CSS}
html{background:#05050F}
body{background:transparent;color:#fff;position:relative;z-index:1;min-height:100vh}

/* Aurora */
.aurora{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.ab{position:absolute;border-radius:50%;will-change:transform}
.ab1{width:700px;height:700px;top:-15%;left:-5%;background:radial-gradient(circle,color-mix(in srgb,var(--a) 38%,transparent),transparent 70%);filter:blur(90px);opacity:.5;animation:ab1 16s ease-in-out infinite}
.ab2{width:580px;height:580px;top:30%;right:-8%;background:radial-gradient(circle,rgba(139,92,246,.28),transparent 70%);filter:blur(100px);opacity:.45;animation:ab2 21s ease-in-out infinite}
.ab3{width:480px;height:480px;bottom:-8%;left:38%;background:radial-gradient(circle,rgba(59,130,246,.22),transparent 70%);filter:blur(80px);opacity:.4;animation:ab3 26s ease-in-out infinite}
@keyframes ab1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,-60px) scale(1.15)}66%{transform:translate(-50px,40px) scale(.9)}}
@keyframes ab2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-90px,70px) scale(1.1)}75%{transform:translate(50px,-40px) scale(.87)}}
@keyframes ab3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-80px) scale(1.2)}}

/* Noise texture */
.noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.035;background-image:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}

/* Glass utility */
.glass{background:rgba(255,255,255,.06);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1)}

/* Header */
.hdr{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(5,5,15,.8);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.07)}
.hdr-inner{max-width:1180px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:17px;font-weight:700;letter-spacing:-.3px}
nav a{color:rgba(255,255,255,.5);font-size:14px;font-weight:500;margin-left:28px;transition:color .2s}
nav a:hover{color:#fff}
.btn{display:inline-flex;align-items:center;border-radius:12px;font-weight:600;font-size:14px;padding:12px 22px;transition:all .25s;cursor:pointer}
.btn-p{background:linear-gradient(135deg,var(--a),color-mix(in srgb,var(--a) 55%,#818cf8));color:#fff;box-shadow:0 4px 20px color-mix(in srgb,var(--a) 35%,transparent);position:relative;overflow:hidden}
.btn-p::after{content:'';position:absolute;top:0;left:-120%;width:70%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transform:skewX(-15deg);transition:left .5s ease;pointer-events:none}
.btn-p:hover::after{left:140%}
.btn-p:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 32px color-mix(in srgb,var(--a) 45%,transparent)}
.btn-s{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:rgba(255,255,255,.85)}
.btn-s:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.22)}

/* Hero */
.hero{padding:118px 24px 64px;position:relative;z-index:2}
.hero-inner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr 410px;gap:56px;align-items:center}
.badge{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:6px 16px;font-size:13px;font-weight:500;margin-bottom:28px;background:color-mix(in srgb,var(--a) 12%,transparent);border:1px solid color-mix(in srgb,var(--a) 30%,transparent);color:color-mix(in srgb,var(--a) 85%,#fff)}
.bdot{width:6px;height:6px;border-radius:50%;background:var(--a);box-shadow:0 0 8px var(--a);animation:float 2.4s ease-in-out infinite;flex-shrink:0}
@keyframes gh1{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
h1{font-size:clamp(38px,5vw,64px);font-weight:700;line-height:1.04;letter-spacing:-2.5px;margin-bottom:22px;background:linear-gradient(135deg,#fff 0%,color-mix(in srgb,var(--a) 75%,#fff) 42%,#a78bfa 72%,#fff 100%);background-size:300% 300%;animation:gh1 8s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sub{font-size:17px;color:rgba(255,255,255,.5);line-height:1.75;margin-bottom:36px;max-width:490px}
.ctas{display:flex;gap:12px;flex-wrap:wrap}

/* Hero visual */
.hero-visual{display:flex;flex-direction:column;gap:10px}
.gp{border-radius:20px;overflow:hidden;position:relative;border:1px solid rgba(255,255,255,.1)}
.gp-img{height:290px;position:relative;overflow:hidden}
.gp-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}
.gp:hover .gp-img img{transform:scale(1.04)}
.gp-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.15) 50%,transparent 100%)}
.gp-stats{position:absolute;bottom:16px;left:16px;right:16px;display:flex;gap:8px}
.gpstat{flex:1;background:rgba(255,255,255,.1);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:11px 8px;text-align:center}
.gpval{font-size:17px;font-weight:700;color:#fff;letter-spacing:-.4px}
.gplbl{font-size:10px;color:rgba(255,255,255,.55);margin-top:2px;line-height:1.3}
.float-card{border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;transition:transform .3s;background:rgba(255,255,255,.07);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1)}
.float-card:hover{transform:translateX(-4px)}
.fc-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:color-mix(in srgb,var(--a) 90%,#fff);background:color-mix(in srgb,var(--a) 15%,transparent);border:1px solid color-mix(in srgb,var(--a) 28%,transparent);flex-shrink:0}
.fc-name{font-size:14px;font-weight:600;color:#fff}
.fc-price{font-size:12px;color:color-mix(in srgb,var(--a) 80%,#fff);margin-top:2px}

/* Stats bar */
.stats-bar{position:relative;z-index:2;max-width:1180px;margin:20px auto 0;padding:0 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.sbi{border-radius:16px;padding:20px 16px;text-align:center;background:rgba(255,255,255,.05);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);transition:all .3s}
.sbi:hover{background:rgba(255,255,255,.08);transform:translateY(-2px);border-color:rgba(255,255,255,.14)}
.sbi-val{font-size:26px;font-weight:700;letter-spacing:-1px;background:linear-gradient(135deg,#fff 30%,var(--a) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sbi-lbl{font-size:11px;color:rgba(255,255,255,.38);margin-top:4px;text-transform:uppercase;letter-spacing:.5px}

/* Sections */
.sec{padding:80px 24px;position:relative;z-index:2}
.inner{max-width:1180px;margin:0 auto}
.sec-head{text-align:center;margin-bottom:52px}
.sec-tag{font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:color-mix(in srgb,var(--a) 80%,#fff);margin-bottom:12px}
h2{font-size:clamp(28px,3.5vw,40px);font-weight:700;letter-spacing:-1.5px;color:#fff}

/* Service cards */
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.card{border-radius:20px;padding:28px;position:relative;overflow:hidden;cursor:default;background:rgba(255,255,255,.05);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.08);transition:all .3s}
.card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 85% 8%,color-mix(in srgb,var(--a) 10%,transparent),transparent 58%);opacity:0;transition:opacity .3s;pointer-events:none}
.card::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--a) 55%,transparent),transparent);opacity:0;transition:opacity .3s;pointer-events:none}
.card:hover{border-color:rgba(255,255,255,.15);transform:translateY(-5px);box-shadow:0 24px 60px -12px rgba(0,0,0,.7)}
.card:hover::before,.card:hover::after{opacity:1}
.ibox{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;letter-spacing:-.5px;color:color-mix(in srgb,var(--a) 90%,#fff);background:color-mix(in srgb,var(--a) 14%,transparent);border:1px solid color-mix(in srgb,var(--a) 26%,transparent);margin-bottom:18px;transition:all .25s}
.card:hover .ibox{border-color:color-mix(in srgb,var(--a) 55%,transparent);background:color-mix(in srgb,var(--a) 22%,transparent);transform:scale(1.08)}
.card h3{font-size:16px;font-weight:600;margin-bottom:8px;color:#fff;letter-spacing:-.3px}
.card p{font-size:13.5px;color:rgba(255,255,255,.44);line-height:1.72}
.price{font-size:13px;font-weight:600;color:color-mix(in srgb,var(--a) 85%,#fff);margin-top:14px}

/* Process steps */
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;position:relative}
.steps-grid::before{content:'';position:absolute;top:28px;left:calc(100%/6);right:calc(100%/6);height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--a) 40%,rgba(255,255,255,.15)),transparent);z-index:0;pointer-events:none}
.step{text-align:center;padding:0 28px;position:relative;z-index:1}
.step-num{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:color-mix(in srgb,var(--a) 75%,#fff);margin-bottom:14px}
.step-circle{width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.06);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid color-mix(in srgb,var(--a) 35%,rgba(255,255,255,.1));display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 20px}
.step h3{font-size:15px;font-weight:600;color:#fff;margin-bottom:8px;letter-spacing:-.2px}
.step p{font-size:13px;color:rgba(255,255,255,.42);line-height:1.7}

/* Testimonial */
.quote-sec{padding:80px 24px;position:relative;z-index:2;text-align:center}
.qbox{max-width:780px;margin:0 auto;border-radius:24px;padding:52px 48px;background:rgba(255,255,255,.05);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.09)}
.qmark{font-size:72px;line-height:.75;color:color-mix(in srgb,var(--a) 55%,transparent);margin-bottom:20px;font-weight:700}
blockquote{font-size:19px;font-weight:400;line-height:1.72;color:rgba(255,255,255,.78);margin-bottom:28px;letter-spacing:-.1px}
.author{display:inline-flex;align-items:center;gap:12px}
.avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--a),rgba(139,92,246,.6));flex-shrink:0}
.author-name{font-size:14px;font-weight:600;color:#fff;text-align:left}
.author-role{font-size:12px;color:rgba(255,255,255,.38);margin-top:2px;text-align:left}

/* CTA */
.cta-sec{padding:80px 24px;position:relative;z-index:2}
.cta-box{max-width:880px;margin:0 auto;border-radius:28px;padding:72px 56px;text-align:center;background:rgba(255,255,255,.05);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.09);position:relative;overflow:hidden}
.cta-glow{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 0%,color-mix(in srgb,var(--a) 25%,transparent),transparent 70%);pointer-events:none;animation:gpulse 4s ease-in-out infinite}
@keyframes gpulse{0%,100%{opacity:.7}50%{opacity:1}}
.cta-box h2{font-size:clamp(26px,3.5vw,38px);font-weight:700;letter-spacing:-1.5px;margin-bottom:14px;position:relative}
.cta-sub{font-size:16px;color:rgba(255,255,255,.48);max-width:520px;margin:0 auto 40px;position:relative;line-height:1.7}

/* Footer */
footer{position:relative;z-index:2;border-top:1px solid rgba(255,255,255,.06);padding:28px 24px}
.footer-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-logo{font-size:16px;font-weight:700;color:#fff}
.footer-inner span{font-size:13px;color:rgba(255,255,255,.3)}

/* Dark band */
.dark-band{background:rgba(0,0,0,.2)}

/* FAQ */
.faq-sec{padding:80px 24px;position:relative;z-index:2}
.faq-list{max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:10px}
details.faq{border-radius:14px;background:rgba(255,255,255,.05);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);overflow:hidden;transition:border-color .2s}
details.faq[open]{border-color:color-mix(in srgb,var(--a) 35%,transparent)}
summary.faq-q{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;font-size:15px;font-weight:600;color:#fff;cursor:pointer;-webkit-user-select:none;user-select:none}
summary.faq-q::-webkit-details-marker{display:none}
.faq-plus{font-size:22px;color:color-mix(in srgb,var(--a) 80%,#fff);flex-shrink:0;transition:transform .25s;line-height:1;font-weight:300}
details.faq[open] .faq-plus{transform:rotate(45deg)}
.faq-a{padding:0 24px 20px;font-size:13.5px;color:rgba(255,255,255,.45);line-height:1.75}

@media(max-width:920px){.hero-inner{grid-template-columns:1fr}.hero-visual{display:none}}
@media(max-width:768px){nav,.btn-hdr{display:none}.grid3{grid-template-columns:1fr}.stats-bar{grid-template-columns:1fr 1fr}.steps-grid{grid-template-columns:1fr}.steps-grid::before{display:none}.cta-box{padding:40px 24px}}`

  return `<!DOCTYPE html>
<html lang="ru">
<head>${head(d.businessName, d.accentColor, css)}</head>
<body>

<div class="aurora" aria-hidden="true"><div class="ab ab1"></div><div class="ab ab2"></div><div class="ab ab3"></div></div>
<div class="noise" aria-hidden="true"></div>

<header class="hdr">
  <div class="hdr-inner">
    <span class="logo">${d.businessName}</span>
    <nav>
      <a href="#services">Услуги</a>
      <a href="#process">Как работаем</a>
      <a href="#contact">Контакты</a>
    </nav>
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-p btn-hdr" style="padding:10px 18px;font-size:13px">Позвонить</a>
  </div>
</header>

<section class="hero">
  <div class="hero-inner">
    <div>
      <div class="badge fu"><span class="bdot"></span>${d.tagline}</div>
      <h1 class="fu d1">${d.headline}</h1>
      <p class="sub fu d2">${d.subheadline}</p>
      <div class="ctas fu d3">
        <a href="#contact" class="btn btn-p">Получить консультацию</a>
        <a href="#services" class="btn btn-s">Наши услуги</a>
      </div>
    </div>
    <div class="hero-visual fu d2">
      <div class="gp">
        <div class="gp-img">
          ${d.heroImageUrl ? `<img src="${d.heroImageUrl}" alt="${d.businessName}" loading="eager">` : ""}
          <div class="gp-overlay"></div>
          <div class="gp-stats">
            ${stats.map(s => `<div class="gpstat"><div class="gpval" data-count>${s.value}</div><div class="gplbl">${s.label}</div></div>`).join("")}
          </div>
          ${creditBadge(d)}
        </div>
      </div>
      ${svcs[0] ? `<div class="float-card"><div class="fc-icon">01</div><div><div class="fc-name">${svcs[0].name}</div>${svcs[0].price ? `<div class="fc-price">${svcs[0].price}</div>` : ""}</div></div>` : ""}
    </div>
  </div>
</section>

<div class="stats-bar fu d4">
  ${stats.map(s => `<div class="sbi reveal"><div class="sbi-val" data-count>${s.value}</div><div class="sbi-lbl">${s.label}</div></div>`).join("")}
</div>

<section class="sec" id="services">
  <div class="inner">
    <div class="sec-head reveal"><p class="sec-tag">Что мы предлагаем</p><h2>Наши услуги</h2></div>
    <div class="grid3">
      ${svcs.map((s, i) => `<div class="card reveal"><div class="ibox">0${i+1}</div><h3>${s.name}</h3><p>${s.description}</p>${s.price ? `<p class="price">${s.price}</p>` : ""}</div>`).join("")}
    </div>
  </div>
</section>

<section class="sec dark-band" id="process">
  <div class="inner">
    <div class="sec-head reveal"><p class="sec-tag">Как мы работаем</p><h2>Три шага к результату</h2></div>
    <div class="steps-grid">
      ${feats.map((f, i) => `<div class="step reveal"><div class="step-num">0${i + 1}</div><h3>${f.title}</h3><p>${f.description}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="quote-sec">
  <div class="qbox reveal">
    <div class="qmark">&#8220;</div>
    <blockquote>${d.testimonial.text}</blockquote>
    <div class="author">
      <div class="avatar"></div>
      <div><div class="author-name">${d.testimonial.author}</div><div class="author-role">${d.testimonial.role}</div></div>
    </div>
  </div>
</section>

<section class="faq-sec" id="faq">
  <div class="inner">
    <div class="sec-head reveal"><p class="sec-tag">Частые вопросы</p><h2>FAQ</h2></div>
    <div class="faq-list">
      ${buildFaqItems(d).map(item => `<details class="faq reveal"><summary class="faq-q">${item.q}<span class="faq-plus">+</span></summary><p class="faq-a">${item.a}</p></details>`).join("")}
    </div>
  </div>
</section>

<section class="cta-sec" id="contact">
  <div class="cta-box reveal">
    <div class="cta-glow"></div>
    <h2>${d.ctaHeadline}</h2>
    <p class="cta-sub">${d.ctaSubtext}</p>
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

// ─────────────────────────────────────────────────────────────────────────────
// MINIMAL — Editorial Swiss
// ─────────────────────────────────────────────────────────────────────────────

export function buildMinimal(d: DesignContent, nf: NicheFont = DEFAULT_NICHE_FONT): string {
  const svcs  = d.services.slice(0, 3)
  const feats = d.features.slice(0, 3)
  const stats = d.stats.slice(0, 3)

  const FONT_URL = nf.fontUrl || "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap"
  const FONT_FAM = nf.fontFamily || "'DM Sans',system-ui,sans-serif"
  const DISPLAY_FAM = nf.displayFontFamily || "'DM Serif Display',Georgia,serif"

  const css = `
${ANIM_CSS}
body{background:#FAFAF9;color:#111}
.hdr{position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(250,250,249,.95);backdrop-filter:blur(12px);border-bottom:1px solid #E5E7EB}
.hdr-inner{max-width:1140px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-size:17px;font-weight:700;letter-spacing:-.4px;color:#111}
nav a{color:#6B7280;font-size:14px;font-weight:500;margin-left:28px;transition:color .2s}
nav a:hover{color:#111}
.btn{display:inline-flex;align-items:center;border-radius:10px;font-weight:600;font-size:14px;padding:12px 22px;transition:all .22s;cursor:pointer}
.btn-p{background:#111;color:#fff}
.btn-p:hover{background:#333;transform:translateY(-1px)}
.btn-s{border:1.5px solid #D1D5DB;color:#111}
.btn-s:hover{border-color:var(--a);color:var(--a)}

/* Hero */
.hero{padding:148px 32px 80px;max-width:1140px;margin:0 auto}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--a);margin-bottom:28px}
.eyebrow-line{width:28px;height:2px;background:var(--a);border-radius:2px;animation:fi .8s ease both .1s}
h1{font-family:${DISPLAY_FAM};font-size:clamp(56px,8vw,112px);font-weight:400;line-height:1.0;letter-spacing:-4px;color:#111;margin-bottom:32px;max-width:880px}
h1 em{font-style:italic;color:var(--a)}
.sub{font-size:18px;color:#4B5563;max-width:520px;line-height:1.75;margin-bottom:44px}
.ctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:64px}
.stats-inline{display:flex;gap:0;border-top:1px solid #E5E7EB;padding-top:40px}
.si{flex:1;padding-right:40px}
.si+.si{border-left:1px solid #E5E7EB;padding-left:40px}
.si-val{font-family:${DISPLAY_FAM};font-size:40px;font-weight:400;letter-spacing:-2px;color:var(--a)}
.si-lbl{font-size:13px;color:#6B7280;margin-top:6px}

/* Hero banner (inside hero) */
.hero-banner{border-radius:16px;overflow:hidden;position:relative;margin:40px 0 52px}
.hero-banner img{width:100%;height:400px;object-fit:cover;display:block;transition:transform .7s ease}
.hero-banner:hover img{transform:scale(1.025)}
.hero-banner-overlay{position:absolute;inset:0;background:linear-gradient(120deg,rgba(0,0,0,.3) 0%,transparent 55%);pointer-events:none}

/* Sections */
.sec{padding:88px 32px;max-width:1140px;margin:0 auto}
.divider{height:1px;background:#E5E7EB;max-width:1140px;margin:0 auto}
.sec-tag{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--a);margin-bottom:16px}
h2{font-family:${DISPLAY_FAM};font-size:clamp(32px,4vw,54px);font-weight:400;letter-spacing:-2px;color:#111;margin-bottom:0;line-height:1.08}
.h2-sub{font-size:16px;color:#6B7280;margin-top:14px;margin-bottom:52px;max-width:520px;line-height:1.7}

/* Editorial service list */
.svc-list{display:flex;flex-direction:column;gap:0;margin-top:48px}
.svc-row{display:grid;grid-template-columns:56px 1fr auto;gap:24px;align-items:start;padding:32px 0;border-bottom:1px solid #E5E7EB;transition:background .2s;cursor:default;position:relative}
.svc-row::before{content:'';position:absolute;left:-16px;right:-16px;top:0;bottom:0;background:color-mix(in srgb,var(--a) 4%,transparent);border-radius:12px;opacity:0;transition:opacity .2s}
.svc-row:hover::before{opacity:1}
.svc-icon{font-family:${DISPLAY_FAM};font-size:32px;font-weight:400;font-style:italic;color:var(--a);line-height:1;padding-top:6px;opacity:.65;transition:opacity .2s}
.svc-row:hover .svc-icon{opacity:1}
.svc-body{position:relative}
.svc-name{font-size:20px;font-weight:700;color:#111;margin-bottom:8px;letter-spacing:-.4px}
.svc-desc{font-size:14px;color:#6B7280;line-height:1.7}
.svc-price{font-size:16px;font-weight:700;color:var(--a);white-space:nowrap;padding-top:4px;position:relative}

/* Features — editorial numbered list */
.feats-list{margin-top:52px}
.feat-row{display:grid;grid-template-columns:72px 1fr;gap:36px;align-items:start;padding:32px 0;border-bottom:1px solid #E5E7EB;cursor:default;transition:background .2s}
.feat-row:first-child{border-top:1px solid #E5E7EB}
.feat-num{font-family:${DISPLAY_FAM};font-size:52px;font-weight:400;font-style:italic;color:var(--a);line-height:1;opacity:.6;padding-top:2px;transition:opacity .2s}
.feat-row:hover .feat-num{opacity:1}
.feat-icon{font-size:22px;margin-bottom:10px}
.feat-title{font-size:18px;font-weight:700;color:#111;margin-bottom:8px;letter-spacing:-.3px}
.feat-desc{font-size:14px;color:#6B7280;line-height:1.72}

/* Testimonial */
.quote-sec{background:#fff;border-top:1px solid #E5E7EB;border-bottom:1px solid #E5E7EB;padding:96px 32px;text-align:center}
.qmark-big{font-family:${DISPLAY_FAM};font-size:120px;line-height:.7;color:var(--a);margin-bottom:24px;font-style:italic}
blockquote{font-family:${DISPLAY_FAM};font-size:clamp(20px,2.5vw,28px);font-weight:400;font-style:italic;color:#111;max-width:760px;margin:0 auto 32px;line-height:1.55;letter-spacing:-.3px}
.author{display:inline-flex;align-items:center;gap:14px}
.avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--a),rgba(139,92,246,.5));flex-shrink:0}
.author-name{font-size:14px;font-weight:700;text-align:left;color:#111}
.author-role{font-size:12px;color:#9CA3AF;text-align:left;margin-top:2px}

/* CTA */
.cta-sec{padding:96px 32px;text-align:center}
.cta-tag{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--a);margin-bottom:20px}
.cta-h{font-family:${DISPLAY_FAM};font-size:clamp(32px,5vw,60px);font-weight:400;letter-spacing:-2.5px;max-width:640px;margin:0 auto 16px;line-height:1.0;color:#111}
.cta-sub{font-size:16px;color:#6B7280;margin-bottom:40px;line-height:1.7}

footer{border-top:1px solid #E5E7EB;padding:28px 32px}
.footer-inner{max-width:1140px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-logo{font-size:15px;font-weight:700;color:#111}
.footer-inner span{font-size:13px;color:#9CA3AF}

/* FAQ */
.faq-sec{padding:88px 32px;max-width:1140px;margin:0 auto}
.faq-list{margin-top:44px;display:flex;flex-direction:column;gap:0}
details.faq{border-bottom:1px solid #E5E7EB;overflow:hidden}
details.faq:first-child{border-top:1px solid #E5E7EB}
summary.faq-q{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 0;font-size:16px;font-weight:700;color:#111;cursor:pointer;-webkit-user-select:none;user-select:none}
summary.faq-q::-webkit-details-marker{display:none}
.faq-plus{font-size:22px;color:var(--a);flex-shrink:0;transition:transform .25s;line-height:1;font-weight:300}
details.faq[open] .faq-plus{transform:rotate(45deg)}
.faq-a{padding:0 0 22px;font-size:14px;color:#6B7280;line-height:1.75;max-width:640px}

@media(max-width:768px){
  nav,.btn-hdr{display:none}
  h1{letter-spacing:-2px}
  .stats-inline{flex-direction:column;gap:24px}
  .si+.si{border-left:none;border-top:1px solid #E5E7EB;padding-left:0;padding-top:24px}
  .feat-row{grid-template-columns:48px 1fr;gap:20px}
  .feat-num{font-size:36px}
  .svc-row{grid-template-columns:40px 1fr;gap:16px}
  .svc-price{display:none}
  .hero-banner img{height:220px}
  .hero-banner{margin:28px 0 40px}
}`

  const firstWord = d.headline.split(" ")[0] ?? ""
  const restWords = d.headline.split(" ").slice(1).join(" ")

  return `<!DOCTYPE html>
<html lang="ru">
<head>${head(d.businessName, d.accentColor, css, FONT_URL, FONT_FAM)}</head>
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
  <div class="eyebrow fu"><span class="eyebrow-line"></span>${d.tagline}</div>
  <h1 class="fu d1"><em>${firstWord}</em>${restWords ? ` ${restWords}` : ""}</h1>
  <p class="sub fu d2">${d.subheadline}</p>
  <div class="ctas fu d3">
    <a href="#contact" class="btn btn-p">Связаться с нами</a>
    <a href="#services" class="btn btn-s">Смотреть услуги</a>
  </div>
  ${d.heroImageUrl ? `<div class="hero-banner fu d4"><img src="${d.heroImageUrl}" alt="${d.businessName}" loading="eager" onerror="this.parentElement.style.display='none'"><div class="hero-banner-overlay"></div>${creditBadge(d)}</div>` : ""}
  <div class="stats-inline fu d5">
    ${stats.map(s => `<div class="si"><div class="si-val" data-count>${s.value}</div><div class="si-lbl">${s.label}</div></div>`).join("")}
  </div>
</section>

<div class="divider"></div>

<section class="sec" id="services">
  <div class="reveal"><p class="sec-tag">Услуги</p><h2>Что мы делаем</h2><p class="h2-sub">${d.subheadline}</p></div>
  <div class="svc-list">
    ${svcs.map((s, i) => `<div class="svc-row reveal">
      <div class="svc-icon">0${i+1}</div>
      <div class="svc-body"><div class="svc-name">${s.name}</div><div class="svc-desc">${s.description}</div></div>
      ${s.price ? `<div class="svc-price">${s.price}</div>` : ""}
    </div>`).join("")}
  </div>
</section>

<div class="divider"></div>

<section class="sec" id="about">
  <div class="reveal"><p class="sec-tag">Почему выбирают нас</p><h2>Наши преимущества</h2></div>
  <div class="feats-list">
    ${feats.map((f, i) => `<div class="feat-row reveal">
      <div class="feat-num">0${i + 1}</div>
      <div><div class="feat-title">${f.title}</div><div class="feat-desc">${f.description}</div></div>
    </div>`).join("")}
  </div>
</section>

<section class="quote-sec">
  <div class="qmark-big reveal">&#8221;</div>
  <blockquote class="reveal">${d.testimonial.text}</blockquote>
  <div class="author reveal">
    <div class="avatar"></div>
    <div><div class="author-name">${d.testimonial.author}</div><div class="author-role">${d.testimonial.role}</div></div>
  </div>
</section>

<div class="divider"></div>

<section class="faq-sec" id="faq">
  <div class="reveal"><p class="sec-tag">Частые вопросы</p><h2>FAQ</h2></div>
  <div class="faq-list">
    ${buildFaqItems(d).map(item => `<details class="faq reveal"><summary class="faq-q">${item.q}<span class="faq-plus">+</span></summary><p class="faq-a">${item.a}</p></details>`).join("")}
  </div>
</section>

<section class="cta-sec" id="contact">
  <p class="cta-tag reveal">Начать работу</p>
  <h2 class="cta-h reveal">${d.ctaHeadline}</h2>
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

// ─────────────────────────────────────────────────────────────────────────────
// BOLD — Brutalist Kinetic
// ─────────────────────────────────────────────────────────────────────────────

export function buildBold(d: DesignContent, _nf: NicheFont = DEFAULT_NICHE_FONT): string {
  const svcs  = d.services.slice(0, 3)
  const feats = d.features.slice(0, 3)
  const stats = d.stats.slice(0, 3)

  const FONT_URL = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500&display=swap"
  const FONT_FAM = "'Barlow',system-ui,sans-serif"

  const boldAnimCss = `
@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
.fu{animation:fu .42s cubic-bezier(.2,.8,.3,1) both}
.fi{animation:fi .38s ease both}
.d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.21s}.d4{animation-delay:.32s}.d5{animation-delay:.45s}
.reveal{opacity:0;transform:translateY(12px);transition:opacity .42s cubic-bezier(.2,.8,.3,1),transform .42s cubic-bezier(.2,.8,.3,1)}
.reveal.in{opacity:1;transform:translateY(0)}`

  const css = `
${boldAnimCss}
body{background:#000;color:#fff}
.hdr{position:fixed;top:0;left:0;right:0;z-index:50;background:#000;border-bottom:2px solid rgba(255,255,255,.1)}
.hdr-inner{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;letter-spacing:.5px;text-transform:uppercase}
nav a{color:rgba(255,255,255,.45);font-size:12px;font-weight:700;margin-left:28px;transition:color .2s;text-transform:uppercase;letter-spacing:1px;font-family:'Barlow Condensed',sans-serif}
nav a:hover{color:#fff}
.btn{display:inline-flex;align-items:center;font-weight:700;font-size:13px;padding:13px 26px;transition:all .2s;cursor:pointer;text-transform:uppercase;letter-spacing:.8px;font-family:'Barlow Condensed',sans-serif}
.btn-p{background:var(--a);color:#fff;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)}
.btn-p:hover{opacity:.85;transform:translateY(-1px)}
.btn-s{border:2px solid rgba(255,255,255,.2);color:#fff}
.btn-s:hover{border-color:rgba(255,255,255,.6)}

/* Hero */
.hero{padding:148px 24px 72px;max-width:1200px;margin:0 auto;position:relative;overflow:hidden}
.ghost-word{position:absolute;top:80px;right:-20px;font-family:'Barlow Condensed',sans-serif;font-size:clamp(100px,15vw,180px);font-weight:900;line-height:1;color:rgba(255,255,255,.025);pointer-events:none;text-transform:uppercase;letter-spacing:-6px;user-select:none}
.hero-num{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:20px;display:flex;align-items:center;gap:12px}
.hero-num::before{content:'';width:40px;height:1px;background:var(--a)}
h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(56px,8vw,96px);font-weight:900;line-height:.97;letter-spacing:-2px;text-transform:uppercase;margin-bottom:16px}
h1 .aw{color:var(--a)}
.h1-rest{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,3.8vw,52px);font-weight:700;text-transform:uppercase;letter-spacing:-1px;color:rgba(255,255,255,.3);line-height:1.05;margin-bottom:28px}
.sub{font-size:17px;color:rgba(255,255,255,.45);max-width:500px;line-height:1.7;margin-bottom:44px;border-left:3px solid var(--a);padding-left:18px}
.ctas{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:80px}

/* Ticker */
.ticker-wrap{overflow:hidden;background:#0a0a0a;border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07);padding:16px 0}
.ticker-inner{display:flex;width:max-content;animation:ticker 22s linear infinite}
@keyframes ticker{to{transform:translateX(-50%)}}
.ticker-half{white-space:nowrap;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.35);padding-right:80px}
.ticker-half .ti{color:var(--a);margin:0 16px}

/* Stats diagonal */
.stats-diag{background:#050505;clip-path:polygon(0 6%,100% 0,100% 94%,0 100%);padding:90px 24px;margin:-2% 0}
.stats-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.06)}
.sdi{background:#050505;padding:36px 28px;text-align:center;transition:background .2s}
.sdi:hover{background:#111}
.sdi-val{font-family:'Barlow Condensed',sans-serif;font-size:52px;font-weight:900;letter-spacing:-2px;color:var(--a);line-height:1}
.sdi-lbl{font-size:12px;color:rgba(255,255,255,.35);margin-top:8px;text-transform:uppercase;letter-spacing:1.5px}

/* Image banner */
.img-banner{height:380px;overflow:hidden;position:relative}
.img-banner img{width:100%;height:100%;object-fit:cover;filter:brightness(.6)}
.img-banner::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,.7) 0%,transparent 55%)}
.ib-label{position:absolute;bottom:28px;left:28px;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.45)}

/* Services */
.sec{padding:88px 24px;max-width:1200px;margin:0 auto}
.sec-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:48px;flex-wrap:wrap;gap:16px}
.sec-tag{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--a);margin-bottom:10px}
h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(32px,5vw,56px);font-weight:900;letter-spacing:-1px;text-transform:uppercase;line-height:.95}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.07)}
.card{background:#000;padding:36px 28px;transition:background .2s;position:relative;overflow:hidden;cursor:default}
.card::after{content:'';position:absolute;left:0;bottom:0;width:0;height:2px;background:var(--a);transition:width .35s;box-shadow:0 0 12px color-mix(in srgb,var(--a) 60%,transparent)}
.card:hover{background:#0d0d0d}
.card:hover::after{width:100%}
.card-num{font-family:'Barlow Condensed',sans-serif;font-size:56px;font-weight:900;color:rgba(255,255,255,.06);letter-spacing:-2px;line-height:1;margin-bottom:-8px}
.ibox{font-size:28px;margin-bottom:16px;display:block}
.card h3{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px}
.card p{font-size:14px;color:rgba(255,255,255,.42);line-height:1.7}
.price{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;color:var(--a);margin-top:16px}

/* Features */
.feats-sec{background:#060606;border-top:1px solid rgba(255,255,255,.06);padding:88px 24px}
.feats-inner{max-width:1200px;margin:0 auto}
.feats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.07);margin-top:48px}
.feat{background:#060606;padding:36px 28px;transition:background .2s}
.feat:hover{background:#0e0e0e}
.feat-icon{font-family:'Barlow Condensed',sans-serif;font-size:38px;font-weight:800;color:var(--a);margin-bottom:12px;letter-spacing:-1px;line-height:1}
.feat h3{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.feat p{font-size:13.5px;color:rgba(255,255,255,.42);line-height:1.7}

/* Testimonial */
.quote-sec{padding:88px 24px;text-align:center}
.qmark{font-family:'Barlow Condensed',sans-serif;font-size:140px;font-weight:900;line-height:.7;color:var(--a);margin-bottom:16px}
blockquote{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3vw,34px);font-weight:700;color:rgba(255,255,255,.85);max-width:800px;margin:0 auto 32px;line-height:1.35;text-transform:uppercase;letter-spacing:-.5px}
.author{display:inline-flex;align-items:center;gap:14px}
.author-line{width:32px;height:2px;background:var(--a)}
.author-name{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1px;text-align:left}
.author-role{font-size:12px;color:rgba(255,255,255,.35);margin-top:3px;text-transform:uppercase;letter-spacing:.5px;text-align:left}

/* CTA */
.cta-sec{background:var(--a);padding:96px 24px;text-align:center;position:relative;overflow:hidden}
.cta-sec::before,.cta-sec::after{content:'';position:absolute;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none}
.cta-sec::before{width:600px;height:600px;top:-50%;right:-15%}
.cta-sec::after{width:450px;height:450px;bottom:-50%;left:-10%}
.cta-h{font-family:'Barlow Condensed',sans-serif;font-size:clamp(36px,6vw,72px);font-weight:900;letter-spacing:-2px;text-transform:uppercase;margin-bottom:14px;position:relative}
.cta-sub{font-size:17px;color:rgba(255,255,255,.75);margin-bottom:44px;position:relative;max-width:540px;margin-left:auto;margin-right:auto;line-height:1.6}
.btn-dark{background:#000;color:#fff;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%);position:relative}
.btn-dark:hover{background:#111}

footer{border-top:2px solid rgba(255,255,255,.08);padding:28px 24px}
.footer-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-logo{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:1px}
.footer-inner span{font-size:12px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.5px}

/* FAQ */
.faq-b-sec{background:#060606;border-top:1px solid rgba(255,255,255,.06);padding:88px 24px}
.faq-b-inner{max-width:1200px;margin:0 auto}
.faq-b-list{margin-top:48px;display:flex;flex-direction:column;gap:0;border-top:1px solid rgba(255,255,255,.07)}
details.faq-b{border-bottom:1px solid rgba(255,255,255,.07);overflow:hidden;transition:background .2s}
details.faq-b[open]{background:#0d0d0d}
summary.faq-b-q{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 4px;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#fff;cursor:pointer;-webkit-user-select:none;user-select:none}
summary.faq-b-q::-webkit-details-marker{display:none}
.faq-b-plus{font-size:20px;color:var(--a);flex-shrink:0;transition:transform .25s;line-height:1;font-weight:300}
details.faq-b[open] .faq-b-plus{transform:rotate(45deg)}
.faq-b-a{padding:0 4px 22px;font-size:14px;color:rgba(255,255,255,.42);line-height:1.72}

@media(max-width:768px){
  nav,.btn-hdr{display:none}
  h1{letter-spacing:-1px}
  .ghost-word{display:none}
  .grid3,.feats-grid,.stats-inner{grid-template-columns:1fr}
  .stats-diag{clip-path:none;padding:60px 24px;margin:0}
  .img-banner{height:220px}}`

  const words = d.headline.split(" ")
  const h1Words = words.slice(0, 5)
  const restWords = words.slice(5)
  const accentIdx = Math.floor(h1Words.length / 2)
  const h1Html = h1Words.map((w, i) => i === accentIdx ? `<span class="aw">${w}</span>` : w).join(" ")
  const restHtml = restWords.join(" ")

  const tickerBase = `${d.tagline} <span class="ti">·</span> ${svcs.map(s => s.name).join(' <span class="ti">·</span> ')} <span class="ti">·</span> `

  return `<!DOCTYPE html>
<html lang="ru">
<head>${head(d.businessName, d.accentColor, css, FONT_URL, FONT_FAM)}</head>
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
  <div class="ghost-word fu d5">${d.businessName.split(" ")[0]?.toUpperCase() ?? ""}</div>
  <div class="hero-num fu">${d.tagline}</div>
  <h1 class="fu d1">${h1Html}</h1>
  ${restHtml ? `<p class="h1-rest fu d2">${restHtml}</p>` : ""}
  <p class="sub fu d3">${d.subheadline}</p>
  <div class="ctas fu d4">
    <a href="#contact" class="btn btn-p">Начать сейчас</a>
    <a href="#services" class="btn btn-s">Наши услуги</a>
  </div>
</section>

<div class="ticker-wrap fu d4">
  <div class="ticker-inner">
    <span class="ticker-half">${tickerBase}</span>
    <span class="ticker-half" aria-hidden="true">${tickerBase}</span>
  </div>
</div>

<div class="stats-diag">
  <div class="stats-inner">
    ${stats.map(s => `<div class="sdi reveal"><div class="sdi-val" data-count>${s.value}</div><div class="sdi-lbl">${s.label}</div></div>`).join("")}
  </div>
</div>

${d.heroImageUrl ? `<div class="img-banner"><img src="${d.heroImageUrl}" alt="${d.businessName}" loading="lazy" onerror="this.parentElement.style.display='none'"><div class="ib-label">${d.tagline}</div>${creditBadge(d)}</div>` : ""}

<section class="sec" id="services">
  <div class="sec-head reveal">
    <div><p class="sec-tag">Что мы делаем</p><h2>Услуги</h2></div>
  </div>
  <div class="grid3">
    ${svcs.map((s, i) => `<div class="card reveal"><div class="card-num">0${i + 1}</div><h3>${s.name}</h3><p>${s.description}</p>${s.price ? `<p class="price">${s.price}</p>` : ""}</div>`).join("")}
  </div>
</section>

<section class="feats-sec" id="about">
  <div class="feats-inner">
    <div class="sec-head reveal"><div><p class="sec-tag">Наши принципы</p><h2>Преимущества</h2></div></div>
    <div class="feats-grid">
      ${feats.map((f, i) => `<div class="feat reveal"><div class="feat-icon">0${i+1}</div><h3>${f.title}</h3><p>${f.description}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="faq-b-sec" id="faq">
  <div class="faq-b-inner">
    <div class="sec-head reveal"><div><p class="sec-tag">Частые вопросы</p><h2>FAQ</h2></div></div>
    <div class="faq-b-list">
      ${buildFaqItems(d).map(item => `<details class="faq-b reveal"><summary class="faq-b-q">${item.q}<span class="faq-b-plus">+</span></summary><p class="faq-b-a">${item.a}</p></details>`).join("")}
    </div>
  </div>
</section>

<section class="quote-sec">
  <div class="qmark reveal">&#8220;</div>
  <blockquote class="reveal">${d.testimonial.text}</blockquote>
  <div class="author reveal">
    <div class="author-line"></div>
    <div><div class="author-name">${d.testimonial.author}</div><div class="author-role">${d.testimonial.role}</div></div>
  </div>
</section>

<section class="cta-sec" id="contact">
  <h2 class="cta-h reveal">${d.ctaHeadline}</h2>
  <p class="cta-sub reveal">${d.ctaSubtext}</p>
  <div class="ctas reveal" style="justify-content:center">
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-dark">${d.phone}</a>
    <a href="mailto:${d.email}" class="btn" style="border:2px solid rgba(255,255,255,.4);color:#fff;clip-path:none">${d.email}</a>
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

// ─────────────────────────────────────────────────────────────────────────────
// CORPORATE — Professional Trust
// ─────────────────────────────────────────────────────────────────────────────

export function buildCorporate(d: DesignContent, nf: NicheFont = DEFAULT_NICHE_FONT): string {
  const svcs  = d.services.slice(0, 3)
  const feats = d.features.slice(0, 3)
  const stats = d.stats.slice(0, 3)

  const CORP_FONT_URL = nf.fontUrl || "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
  const CORP_FONT_FAM = nf.fontFamily || "'Inter',system-ui,sans-serif"
  const CORP_DISPLAY_FAM = nf.displayFontFamily || CORP_FONT_FAM

  const css = `
${ANIM_CSS}
body{background:#F8FAFC;color:#0F172A}
.hdr{position:fixed;top:0;left:0;right:0;z-index:50;background:#fff;border-bottom:1px solid #E2E8F0;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.hdr-inner{max-width:1180px;margin:0 auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;height:66px}
.logo{font-size:18px;font-weight:800;color:var(--a);letter-spacing:-.4px}
nav a{color:#475569;font-size:14px;font-weight:500;margin-left:28px;transition:color .2s}
nav a:hover{color:var(--a)}
.btn{display:inline-flex;align-items:center;border-radius:8px;font-weight:600;font-size:14px;padding:11px 22px;transition:all .22s;cursor:pointer}
.btn-p{background:var(--a);color:#fff;box-shadow:0 2px 8px color-mix(in srgb,var(--a) 32%,transparent)}
.btn-p:hover{opacity:.88;transform:translateY(-1px);box-shadow:0 6px 20px color-mix(in srgb,var(--a) 42%,transparent)}
.btn-s{border:1.5px solid #CBD5E1;background:#fff;color:#334155}
.btn-s:hover{border-color:var(--a);color:var(--a)}

/* Hero */
.hero{padding:130px 28px 64px;background:#fff;border-bottom:1px solid #E2E8F0}
.hero-inner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.tag{display:inline-flex;align-items:center;gap:6px;background:color-mix(in srgb,var(--a) 8%,transparent);color:var(--a);border:1px solid color-mix(in srgb,var(--a) 20%,transparent);border-radius:6px;padding:5px 12px;font-size:12px;font-weight:600;margin-bottom:22px}
.tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--a)}
h1{font-family:${CORP_DISPLAY_FAM};font-size:clamp(38px,4.5vw,62px);font-weight:800;line-height:1.06;letter-spacing:-2px;color:#0F172A;margin-bottom:18px}
.sub{font-size:16px;color:#64748B;line-height:1.75;margin-bottom:36px;max-width:460px}
.ctas{display:flex;gap:12px;flex-wrap:wrap}
.hero-right{background:linear-gradient(135deg,color-mix(in srgb,var(--a) 6%,#fff),color-mix(in srgb,var(--a) 3%,#F8FAFC));border:1px solid color-mix(in srgb,var(--a) 18%,transparent);border-radius:20px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.12),0 0 0 1px color-mix(in srgb,var(--a) 8%,transparent)}
.hr-photo{height:260px;overflow:hidden;position:relative}
.hr-photo img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.hr-photo:hover img{transform:scale(1.04)}
.hr-photo::after{content:'';position:absolute;bottom:0;left:0;right:0;height:60px;background:linear-gradient(to top,color-mix(in srgb,var(--a) 5%,#fff),transparent);pointer-events:none}
.hr-photo::before{content:'';position:absolute;inset:0;background:color-mix(in srgb,var(--a) 12%,transparent);mix-blend-mode:multiply;pointer-events:none;z-index:1}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:24px}
.hstat{background:#fff;border:1px solid #E2E8F0;border-radius:10px;padding:20px 16px;text-align:center;transition:all .25s}
.hstat:hover{border-color:color-mix(in srgb,var(--a) 35%,transparent);box-shadow:0 4px 14px rgba(0,0,0,.07);transform:translateY(-2px)}
.hstat-val{font-size:26px;font-weight:800;color:var(--a);letter-spacing:-1px}
.hstat-lbl{font-size:11px;color:#94A3B8;margin-top:4px;line-height:1.4}
.hstat-big{grid-column:1/-1}

/* Trust strip */
.trust-sec{background:#fff;border-bottom:1px solid #E2E8F0;padding:20px 28px}
.trust-inner{max-width:1180px;margin:0 auto}
.trust-strip{display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap}
.trust-item{display:flex;align-items:center;gap:8px;padding:12px 28px;font-size:13px;font-weight:600;color:#334155;border-right:1px solid #E2E8F0}
.trust-item:last-child{border-right:none}
.trust-icon{font-size:16px}
.trust-check{color:var(--a);font-weight:700;margin-right:2px}

/* Sections */
.sec{padding:80px 28px;max-width:1180px;margin:0 auto}
.sec-head{margin-bottom:44px}
.sec-tag{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--a);margin-bottom:10px}
h2{font-size:clamp(24px,3vw,38px);font-weight:800;letter-spacing:-1px;color:#0F172A}

/* Service cards */
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.card{background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:28px;transition:all .22s;box-shadow:0 1px 3px rgba(0,0,0,.04);position:relative;overflow:hidden;cursor:default}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--a),color-mix(in srgb,var(--a) 50%,#818cf8));transform:scaleX(0);transform-origin:left;transition:transform .3s}
.card:hover{border-color:color-mix(in srgb,var(--a) 35%,transparent);box-shadow:0 8px 28px rgba(0,0,0,.09);transform:translateY(-3px)}
.card:hover::before{transform:scaleX(1)}
.ibox{width:46px;height:46px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;letter-spacing:-.5px;color:var(--a);background:color-mix(in srgb,var(--a) 10%,transparent);margin-bottom:16px;transition:all .22s}
.card:hover .ibox{background:color-mix(in srgb,var(--a) 18%,transparent);transform:scale(1.1)}
.card h3{font-size:15px;font-weight:700;margin-bottom:8px;color:#1E293B}
.card p{font-size:13.5px;color:#64748B;line-height:1.72}
.price{font-size:14px;font-weight:700;color:var(--a);margin-top:14px}
.card-featured{background:linear-gradient(145deg,color-mix(in srgb,var(--a) 7%,#fff),color-mix(in srgb,var(--a) 3%,#F8FAFC));border-color:color-mix(in srgb,var(--a) 30%,transparent);box-shadow:0 4px 24px color-mix(in srgb,var(--a) 12%,transparent)}
.card-featured::before{transform:scaleX(1)}
.card-featured .ibox{background:color-mix(in srgb,var(--a) 18%,transparent)}
.card-badge{display:inline-flex;align-items:center;gap:5px;background:var(--a);color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;margin-bottom:14px;letter-spacing:.3px}

/* Process steps */
.proc-sec{background:#fff;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0}
.proc-inner{max-width:1180px;margin:0 auto;padding:80px 28px}
.proc-steps{display:flex;flex-direction:column;gap:0;margin-top:44px;position:relative}
.proc-steps::before{content:'';position:absolute;left:23px;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,var(--a),color-mix(in srgb,var(--a) 20%,transparent))}
.pstep{display:grid;grid-template-columns:48px 1fr;gap:24px;padding:28px 0;position:relative}
.pstep+.pstep{border-top:1px solid #F1F5F9}
.pstep-num{width:48px;height:48px;border-radius:50%;background:var(--a);color:#fff;font-size:16px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;z-index:1;box-shadow:0 0 0 4px #fff,0 0 0 5px color-mix(in srgb,var(--a) 25%,transparent)}
.pstep-body{}
.pstep-icon{font-size:22px;margin-bottom:8px}
.pstep h3{font-size:16px;font-weight:700;color:#1E293B;margin-bottom:6px;letter-spacing:-.2px}
.pstep p{font-size:14px;color:#64748B;line-height:1.7}

/* Testimonial */
.quote-sec{padding:80px 28px;background:#F8FAFC;border-bottom:1px solid #E2E8F0}
.quote-inner{max-width:780px;margin:0 auto;text-align:center}
.stars{font-size:20px;color:#FBBF24;letter-spacing:2px;margin-bottom:20px}
.qbox{background:#fff;border:1px solid color-mix(in srgb,var(--a) 14%,transparent);border-radius:18px;padding:48px 40px;box-shadow:0 4px 20px rgba(0,0,0,.06)}
.qmark{font-size:48px;line-height:.8;color:var(--a);margin-bottom:16px;font-weight:800}
blockquote{font-size:18px;font-weight:500;color:#334155;line-height:1.72;margin-bottom:28px}
.author{display:flex;align-items:center;justify-content:center;gap:12px}
.avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--a),color-mix(in srgb,var(--a) 55%,#fff));flex-shrink:0}
.author-name{font-size:14px;font-weight:700;color:#1E293B;text-align:left}
.author-role{font-size:12px;color:#94A3B8;text-align:left;margin-top:2px}

/* CTA */
.cta-sec{padding:80px 28px;background:linear-gradient(135deg,var(--a),color-mix(in srgb,var(--a) 78%,#1E3A8A));text-align:center;position:relative;overflow:hidden}
.cta-sec::after{content:'';position:absolute;bottom:-60px;right:-60px;width:320px;height:320px;border-radius:50%;background:rgba(255,255,255,.07);pointer-events:none}
.cta-h{font-size:clamp(26px,3.5vw,42px);font-weight:800;letter-spacing:-1px;color:#fff;margin-bottom:12px;position:relative}
.cta-sub{font-size:16px;color:rgba(255,255,255,.75);margin-bottom:32px;position:relative;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.7}
.guarantee{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:6px 16px;font-size:13px;color:rgba(255,255,255,.9);font-weight:500;margin-bottom:32px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.btn-white{background:#fff;color:var(--a);font-weight:700}
.btn-white:hover{background:#F8FAFC;transform:translateY(-1px)}
.btn-outline-w{border:2px solid rgba(255,255,255,.35);color:#fff}
.btn-outline-w:hover{border-color:rgba(255,255,255,.7)}

footer{background:#fff;border-top:1px solid #E2E8F0;padding:24px 28px}
.footer-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.footer-logo{font-size:16px;font-weight:800;color:var(--a)}
.footer-inner span{font-size:13px;color:#94A3B8}

/* FAQ */
.faq-c-sec{background:#fff;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;padding:80px 28px}
.faq-c-inner{max-width:780px;margin:0 auto}
.faq-c-list{margin-top:40px;display:flex;flex-direction:column;gap:12px}
details.faq-c{background:#fff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;transition:border-color .2s,box-shadow .2s}
details.faq-c[open]{border-color:color-mix(in srgb,var(--a) 30%,transparent);box-shadow:0 4px 14px rgba(0,0,0,.06)}
summary.faq-c-q{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 22px;font-size:15px;font-weight:600;color:#1E293B;cursor:pointer;-webkit-user-select:none;user-select:none}
summary.faq-c-q::-webkit-details-marker{display:none}
.faq-c-plus{font-size:22px;color:var(--a);flex-shrink:0;transition:transform .25s;line-height:1;font-weight:300}
details.faq-c[open] .faq-c-plus{transform:rotate(45deg)}
.faq-c-a{padding:0 22px 20px;font-size:14px;color:#64748B;line-height:1.75}

@media(max-width:900px){nav,.btn-hdr{display:none}.hero-inner{grid-template-columns:1fr}.hero-right{display:none}.grid3{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.grid3{grid-template-columns:1fr}.trust-item{padding:10px 16px}.pstep{grid-template-columns:40px 1fr;gap:16px}}`

  return `<!DOCTYPE html>
<html lang="ru">
<head>${head(d.businessName, d.accentColor, css, CORP_FONT_URL, CORP_FONT_FAM)}</head>
<body>

<header class="hdr">
  <div class="hdr-inner">
    <span class="logo">${d.businessName}</span>
    <nav>
      <a href="#services">Услуги</a>
      <a href="#process">Как работаем</a>
      <a href="#contact">Контакты</a>
    </nav>
    <a href="tel:${d.phone.replace(/\s/g, "")}" class="btn btn-p btn-hdr" style="padding:9px 18px;font-size:13px">Позвонить</a>
  </div>
</header>

<section class="hero">
  <div class="hero-inner">
    <div>
      <div class="tag fu">${d.tagline}</div>
      <h1 class="fu d1">${d.headline}</h1>
      <p class="sub fu d2">${d.subheadline}</p>
      <div class="ctas fu d3">
        <a href="#contact" class="btn btn-p">Получить предложение</a>
        <a href="#services" class="btn btn-s">Наши услуги</a>
      </div>
    </div>
    <div class="hero-right fu d2">
      ${d.heroImageUrl ? `<div class="hr-photo"><img src="${d.heroImageUrl}" alt="${d.businessName}" loading="eager" onerror="this.parentElement.style.display='none'">${creditBadge(d)}</div>` : ""}
      <div class="stat-grid">
        ${stats.map((s, i) => `<div class="hstat${i === 0 ? " hstat-big" : ""} reveal"><div class="hstat-val" data-count>${s.value}</div><div class="hstat-lbl">${s.label}</div></div>`).join("")}
      </div>
    </div>
  </div>
</section>

<section class="trust-sec">
  <div class="trust-inner">
    <div class="trust-strip">
      <div class="trust-item"><i data-lucide="shield-check" style="width:16px;height:16px;color:var(--a);flex-shrink:0" aria-hidden="true"></i><span><span class="trust-check">✓</span>Гарантия на работу</span></div>
      <div class="trust-item"><i data-lucide="file-text" style="width:16px;height:16px;color:var(--a);flex-shrink:0" aria-hidden="true"></i><span><span class="trust-check">✓</span>Договор и акты</span></div>
      <div class="trust-item"><i data-lucide="clock" style="width:16px;height:16px;color:var(--a);flex-shrink:0" aria-hidden="true"></i><span><span class="trust-check">✓</span>Фиксированные сроки</span></div>
      <div class="trust-item"><i data-lucide="message-circle" style="width:16px;height:16px;color:var(--a);flex-shrink:0" aria-hidden="true"></i><span><span class="trust-check">✓</span>Поддержка 24/7</span></div>
    </div>
  </div>
</section>

<section class="sec" id="services">
  <div class="sec-head reveal"><p class="sec-tag">Услуги</p><h2>Что мы предлагаем</h2></div>
  <div class="grid3">
    ${svcs.map((s, i) => `<div class="card${i === 0 ? " card-featured" : ""} reveal">${i === 0 ? `<div class="card-badge">★ Популярно</div>` : ""}<div class="ibox">0${i+1}</div><h3>${s.name}</h3><p>${s.description}</p>${s.price ? `<p class="price">${s.price}</p>` : ""}</div>`).join("")}
  </div>
</section>

<section class="proc-sec" id="process">
  <div class="proc-inner">
    <div class="sec-head reveal"><p class="sec-tag">Как мы работаем</p><h2>Три шага к результату</h2></div>
    <div class="proc-steps">
      ${feats.map((f, i) => `<div class="pstep reveal">
        <div class="pstep-num">${i + 1}</div>
        <div class="pstep-body"><h3>${f.title}</h3><p>${f.description}</p></div>
      </div>`).join("")}
    </div>
  </div>
</section>

<section class="quote-sec">
  <div class="quote-inner">
    <div class="qbox reveal">
      <div class="stars">★★★★★</div>
      <div class="qmark">&#8220;</div>
      <blockquote>${d.testimonial.text}</blockquote>
      <div class="author">
        <div class="avatar"></div>
        <div><div class="author-name">${d.testimonial.author}</div><div class="author-role">${d.testimonial.role}</div></div>
      </div>
    </div>
  </div>
</section>

<section class="faq-c-sec" id="faq">
  <div class="faq-c-inner">
    <div class="sec-head reveal"><p class="sec-tag">Частые вопросы</p><h2>FAQ</h2></div>
    <div class="faq-c-list">
      ${buildFaqItems(d).map(item => `<details class="faq-c reveal"><summary class="faq-c-q">${item.q}<span class="faq-c-plus">+</span></summary><p class="faq-c-a">${item.a}</p></details>`).join("")}
    </div>
  </div>
</section>

<section class="cta-sec" id="contact">
  <p class="guarantee reveal"><i data-lucide="lock" style="width:13px;height:13px;flex-shrink:0" aria-hidden="true"></i>Без риска — 100% возврат, если работа не устроит</p>
  <h2 class="cta-h reveal">${d.ctaHeadline}</h2>
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

export function fillTemplate(style: string, content: DesignContent, businessType = ""): string {
  const nf = getNicheFont(businessType)
  switch (style) {
    case "minimal":   return buildMinimal(content, nf)
    case "bold":      return buildBold(content, nf)
    case "corporate": return buildCorporate(content, nf)
    default:          return buildModern(content, nf)
  }
}
