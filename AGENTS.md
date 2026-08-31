# AGENTS.md — gotovo project map

This file is the operating contract for AI agents working in this repository. Read it before changing anything. It reflects the code at `origin/main` commit `43064db31fe62053ad6e3e645dea6b8f5bffd555` (fetched and audited 2026-08-31). If this file and the current code diverge, current code wins; update this map in the same reviewed change.

## 1. Project identity

- Product: **gotovo**, an independent Belarusian web studio with a free AI concept generator.
- Business flow: visitor describes a business → receives three initial visual directions → leaves a lead for paid manual design/development.
- Repository: `https://github.com/Artem-krivko/gotovo`.
- Production: `https://www.usegotovo.by`.
- Production branch: `main`. Never deploy or merge to production without explicit owner approval.
- Monetization is lead generation, not generator subscriptions. An AI result is a concept/draft, never a finished design or finished website.

## 2. Current source of truth

Source precedence:

1. Current fetched `origin/main` code, Prisma schema, tests, workflows and configuration.
2. This `AGENTS.md`.
3. `README.md` and recent entries in `_docs/DECISIONS.md`.
4. Older documents and role prompts only where they agree with the code.

Mandatory reading before scoped work:

- Always: `CLAUDE.md`, `_ai-skills/developer.md` and the relevant code.
- Visual work: `_ai-skills/designer.md`, but use the current editorial system in code/`CLAUDE.md`, not its obsolete “dark always” section.
- SEO/content work: `_ai-skills/seo.md`, then verify all prices, claims, domains and metadata against current code.
- Architectural decisions: `_docs/DECISIONS.md`.

Known documentation drift:

- `_docs/ROADMAP.md` still describes a pre-deploy Anthropic MVP, missing privacy/rate limiting/regenerate and old domains/prices. Production and these features already exist.
- `_docs/ARCHITECTURE.md` describes one Gemini-to-HTML call, streaming, 30-second limits and obsolete fields. Current generator uses structured content + `DesignSpec`, parallel roles and deterministic composition.
- `_ai-skills/designer.md` says the site is always dark; all current public routes use the light editorial system.
- `_ai-skills/seo.md` contains old brand, EUR prices, “30 seconds” and old commercial promises.
- `CLAUDE.md` still contains legacy Anthropic/env and “internal pages are dark” notes; current code and the 2026-08-31 decisions supersede them.
- `README.md` is broadly current, but its default Gemini model (`gemini-3.6-flash`) differs from code (`gemini-3.5-flash-lite`, with `gemini-3.6-flash` fallback), and `NEXT_PUBLIC_SITE_URL` is documented although canonicals now use a fixed production constant.
- `.cursor/rules/main.mdc` is an additional AI instruction file. Its generic coding rules apply unless current architecture deliberately differs.

## 3. Stack

- Next.js `16.1.7`, App Router, React `19.2.3`, TypeScript 5.
- Tailwind CSS 4 via `@tailwindcss/postcss`.
- Prisma 7 + `@prisma/adapter-pg` + PostgreSQL.
- Google Gemini primary AI, Groq fallback, Pexels images.
- Resend email and Telegram Bot API notifications.
- GA4 + Consent Mode; Vercel hosting; GitHub Actions CI.
- Alias `@/*` maps to repository root (`tsconfig.json`). Strict TypeScript is enabled.

There is no `middleware.ts` or `proxy.ts`. Public pages are static/SSG; API handlers are dynamic server routes.

## 4. Repository structure

| Path | Responsibility |
|---|---|
| `app/` | App Router pages, root/nested layouts, metadata routes and API handlers |
| `components/layout/` | Client header and server footer |
| `components/shared/editorial.tsx` | Current server-rendered editorial primitives |
| `components/shared/motion-controller.tsx` | Global reveal observer and reduced-motion handling |
| `components/generator/` | Client gallery, brief, preview, adjustments and order UI |
| `components/seo/` | Shared server template for static SEO service pages |
| `content/` | Public page, city, niche, pricing and gallery data |
| `lib/design/` | `DesignSpec`, tokens, archetypes, section renderers, composition, images and quality gates |
| `lib/analytics.ts`, `lib/attribution.ts` | GA4 funnel events, consent queue and campaign attribution |
| `lib/validation.ts`, `lib/html.ts` | Input schemas/sanitization and HTML/URL escaping boundaries |
| `lib/db.ts`, `prisma/` | Lazy Prisma client, `Design`/`Order` models and migrations |
| `scripts/` | SEO, viewport, reference rendering and indexing utilities |
| `.github/workflows/` | Code Quality and production SEO health workflows |
| `_docs/`, `_ai-skills/` | Decisions and historical role guidance; not automatically authoritative |

Root layout hierarchy (`app/layout.tsx`): Space Grotesk → Organization schema → GA4/Consent Mode → `MotionController` → `SiteHeader` → route content → `SiteFooter` → `AnalyticsConsent` → desktop Telegram shortcut. `app/generator/layout.tsx` adds generator metadata only; it does not replace the root shell. There is no React context provider layer.

Server Components are the default. Client boundaries are used for the header, consent/motion controllers, forms and generator UI. Do not add `"use client"` to static content without a browser/state requirement, and never put `"use server"` on a component.

## 5. Route map

`○` = static prerender, `●` = SSG from `generateStaticParams`, `ƒ` = dynamic API.

| URL | Purpose | Render | Main implementation | Indexed | Primary CTA |
|---|---|---:|---|---:|---|
| `/` | Studio landing page | ○ | `app/page.tsx`, editorial home sections | yes | `/contacts`, `/generator` |
| `/services` | Work formats/services | ○ | `EditorialHero`, `EditorialVisual`, service rows | yes | `/contacts` |
| `/pricing` | BYN prices and 30/40/30 terms | ○ | editorial pricing cards + FAQ | yes | `/contacts` |
| `/process` | Five-stage delivery process | ○ | editorial journey visual + stages | yes | `/contacts` |
| `/about` | Studio positioning/principles | ○ | editorial content + studio image | yes | `/contacts` |
| `/contacts` | Direct enquiry | ○ + client form | `ContactForm` → `/api/lead` | yes | submit lead; `/generator` alternative |
| `/generator` | Interactive concept laboratory | ○ client shell | `GeneratorGallery` → `GeneratorForm` → `GeneratorPreview` | yes | generator order modal / Telegram |
| `/ai-generator-sajta` | SEO landing for generator | ○ | `EditorialServicePage` + generator proof | yes | `/generator`, `/contacts` |
| `/razrabotka-sajtov-minsk` | Minsk web development SEO landing | ○ | `EditorialServicePage` | yes | `/contacts` |
| `/lending-minsk` | Minsk landing-page SEO landing | ○ | `EditorialServicePage` | yes | `/contacts` |
| `/sozdanie-sajtov-dlya-biznesa` | Business-sites SEO landing | ○ | `EditorialServicePage` | yes | `/contacts` |
| `/goroda` | City hub | ○ | `CITY_PAGES` cards | yes | city pages / `/contacts` |
| `/goroda/[slug]` | Minsk, Gomel, Brest, Grodno, Vitebsk, Mogilev | ● (6) | shared city SSG + Service schema/FAQ | yes | `/contacts` |
| `/uslugi` | Niche hub | ○ | `NICHE_PAGES` cards | yes | niche pages / `/contacts` |
| `/uslugi/[slug]` | Dentistry, beauty, restaurant, fitness, legal, clinic | ● (6) | shared niche SSG + Service schema/FAQ | yes | `/contacts` |
| `/privacy` | Privacy/analytics policy | ○ | editorial legal content | yes, but omitted from sitemap | none |
| `/thank-you` | Legacy success page | ○ | standalone success state | **noindex/nofollow** | home / Telegram |
| `/razrabotka-sajtov-ceny` | Legacy price URL | redirect | `next.config.ts` → `/pricing` | no; absent from sitemap | `/pricing` |
| `/api/generate` | Generate three concepts | ƒ POST | AI, images, compose, quality, optional persistence | blocked by robots | n/a |
| `/api/adjust` | Deterministic `DesignSpec` adjustment | ƒ POST | parse → adjust → compose → quality → optional version save | blocked by robots | n/a |
| `/api/design/[id]` | Stored HTML preview | ƒ GET | Prisma + strict sandbox/CSP headers | noindex/nofollow header | n/a |
| `/api/lead` | Direct contact lead | ƒ POST | validate → Resend + Telegram | blocked by robots | n/a |
| `/api/submit-order` | Generator lead/order | ƒ POST | validate → Design/Order → Resend + Telegram | blocked by robots | n/a |
| `/robots.txt`, `/sitemap.xml` | SEO control files | ○ | `app/robots.ts`, `app/sitemap.ts` | n/a | n/a |

Unknown dynamic city/niche slugs call `notFound()`. Keep `generateStaticParams`, content arrays and sitemap generation in sync.

## 6. User and data flows

Direct funnel:

`public page CTA → /contacts → ContactForm → attribution snapshot → POST /api/lead → Resend and Telegram → inline success/error`

Generator funnel:

`/generator gallery → preset or blank brief → POST /api/generate → three directions → sandbox iframe → optional /api/adjust or regenerate → engaged preview → modal/banner/Telegram → POST /api/submit-order`

Data boundaries:

- Browser: consent choice and attribution use `localStorage`; generation session/quota use signed `httpOnly` cookies.
- PostgreSQL: generated HTML and brief metadata in `Design`; generator orders in `Order`, including `attributionJson`.
- Direct `/api/lead` submissions are **not** stored in PostgreSQL; delivery channels/logs are the only record.
- Never put personal contact data into attribution. `normalizeAttribution` allow-lists only campaign/click/path/referrer fields.
- Never read or print secret values. Environment audits may list variable names and `<configured>` only.

## 7. Generator architecture

Canonical flow (`app/api/generate/route.ts`):

1. Burst rate limit: 10 requests / 10 minutes / IP, in process memory.
2. Session and signed quota cookie: maximum 2 successful responses per technical session per Minsk calendar day.
3. `parseGeneratorParams` validates and caps the brief, verified facts and HTTPS reference image URLs.
4. Speculative Pexels searches start immediately from niche queries.
5. AI strategist and AI art director run in parallel from the same brief:
   - strategist → audience/offer/honest `PageContent`;
   - art director → allow-listed `DesignSpec` + optional `VisualBrief`.
6. Provider order: Gemini `GOOGLE_AI_MODEL` (default `gemini-3.5-flash-lite`) → Gemini fallback model (default `gemini-3.6-flash`) → Groq (default `openai/gpt-oss-120b`) → neutral fallback content.
7. Pexels candidates are refined/ranked; user reference images take priority. Missing images disable the gallery variant.
8. `composePage` turns content + `DesignSpec` + assets into a complete HTML document. Models never supply arbitrary HTML.
9. `checkQuality` checks fabricated facts, content, markup, section invariants and design constraints. One controlled retry uses neutral content + base spec without another model call.
10. `curateDesignDirections` derives three sufficiently different directions from one validated result; each is composed and quality-checked independently.
11. Designs are persisted with Prisma as a side effect with a 3-second budget. Persistence failure must not discard a valid preview; `designId` may be `null`.
12. The client shows the current direction in `<iframe srcDoc>` with `sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"` and no `allow-same-origin`.

`POST /api/adjust` accepts only `SPEC_ADJUSTMENTS`, reparses client content/assets/spec, changes the spec deterministically, recomposes, reruns quality and saves a new Design version only when the parent belongs to the same session. Its limit is 60 / 10 minutes / IP. Regenerate calls `/api/generate` again, consumes the normal daily quota and keeps the previous result if the call fails.

Do not change the following without separate explicit agreement and focused tests: prompts; verified-fact policy; `DesignSpec` enums/parsing; composer/escaping/CSP; quality gate/retry semantics; direction distance logic; iframe sandbox; provider order/timeouts; generation quota; persistence independence; preview access model; or the promise that AI output is only an initial concept.

## 8. Lead and notification flow

### Direct leads: `ContactForm` → `/api/lead`

- Client fields: required name/contact/message; attribution attached at submit.
- Server accepts phone, email or Telegram username as contact; sanitizes/caps every field.
- Rate limit: 5 / 10 minutes / IP, in memory.
- Production currently requires both `RESEND_API_KEY` and `LEAD_NOTIFICATION_EMAIL` before delivery is attempted. With them present, Resend and Telegram run independently; either successful channel is enough.
- Resend API errors are checked, Telegram user content is HTML-escaped, and the UI shows loading/success/error inline.
- In development only, missing delivery configuration returns `delivery: "logged_only"`.

### Generator leads: modal/banner → `/api/submit-order`

- `designId` and a valid phone are required; name/email/comment are optional.
- Rate limit: 5 / 10 minutes / IP.
- The route looks up the Design and tries to create an Order with attribution. DB failure does not prevent a Telegram recovery notification.
- Email is sent only when Design and Order exist and Resend is configured; Telegram is independent.
- The request is accepted if a notification was delivered or an Order was durably stored. Otherwise production returns an honest error.

Lead-loss/recovery-sensitive code must preserve: server-side validation, dual-channel result checking, non-false success responses, PII escaping, explicit error UI and Telegram fallback copy.

## 9. Analytics and attribution

- GA4 measurement ID is currently hard-coded in `app/layout.tsx`.
- Consent Mode defaults `analytics_storage` and `ad_storage` to denied. `AnalyticsConsent` stores `granted`/`denied`; events queue in memory until analytics consent, then flush. A denial clears the queue.
- Attribution collection is deliberately independent from analytics consent and stores only technical marketing fields in `gotovo_attribution`.
- Allowed attribution: `landingPath`, host-only `referrerHost`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `yclid` (camel-cased internally, max 200 chars each).
- Direct leads include attribution in email/Telegram. Generator orders additionally persist it in `Order.attributionJson`.

All declared `FunnelEvent` values:

`generator_gallery_view`, `generator_preset_selected`, `generator_form_started`, `generator_submitted`, `generation_succeeded`, `generation_failed`, `regenerate_clicked`, `style_adjustment_clicked`, `design_direction_selected`, `preview_engaged`, `lead_modal_opened`, `lead_submitted`, `lead_form_started`, `lead_submit_failed`, `telegram_clicked`.

Direct funnel events: `lead_form_started` → `lead_submitted` or `lead_submit_failed`.

Generator funnel events: gallery view → preset → form start → submit → generation success/failure → direction/preview/adjust/regenerate → modal → `lead_submitted`; Telegram clicks are separate.

Current limitations: no Yandex Metrica implementation; no first-touch/last-touch pair or timestamps; current path/referrer can overwrite stored entry context; phone/email clicks are not tracked; modal/banner submission failures do not emit `lead_submit_failed`; there is no durable analytics retry queue.

## 10. SEO contract

- `lib/site.ts` fixes production origin to `https://www.usegotovo.by` and creates canonical, Open Graph and Twitter metadata. Preview deploys intentionally canonicalize to production.
- Root `ProfessionalService` JSON-LD lives in `app/layout.tsx`; city and niche SSG pages emit `Service` JSON-LD. FAQ is visible content but is not emitted as FAQ schema.
- `app/sitemap.ts` contains 26 indexable commercial routes: core, generator, SEO landings, hubs, six cities and six niches. It intentionally excludes the redirect, `/thank-you`, APIs and currently `/privacy`.
- `app/robots.ts` allows public crawling and blocks `/api/`. `/thank-you` remains crawlable so its metadata `noindex` can be seen.
- `/razrabotka-sajtov-ceny` permanently redirects (308 in Next) to `/pricing`.
- `scripts/check-seo.mjs` builds a local production contract check for status, one canonical, descriptions, OG parity, sitemap, robots, redirect and thank-you noindex.
- `public/google5a7222da13b88275.html` is a Google verification artifact. Do not assume this proves current Search Console access or ownership state.
- Google Search Console and Yandex Webmaster data were not available through repository credentials/connectors during the audit; rankings, coverage, manual actions and submitted sitemap state remain externally unverified.

Before adding/removing/redirecting a public route, update metadata, sitemap, internal links, schemas and `scripts/check-seo.mjs` together. Do not generate local-city claims, testimonials, rankings, metrics, guarantees or prices without owner-confirmed facts.

### External SEO cabinets — operational record (2026-08-31)

- Production site: `https://www.usegotovo.by`.
- Google Search Console: the domain property `usegotovo.by` was verified through DNS. `https://www.usegotovo.by/sitemap.xml` was submitted and reported as successful; the first coverage and query data may take about a day to appear. Keep the Google verification TXT record in DNS.
- Yandex Webmaster: `https://www.usegotovo.by` was added in the Yandex account currently being checked. DNS verification was initiated, but rights were not yet confirmed at the time of this record; the verification TXT record was visible on both authoritative `hb.by` name servers. After confirmation, submit `https://www.usegotovo.by/sitemap.xml` and inspect indexing/diagnostics.
- Yandex Direct: the owner-reported login identifier is `krivkoArtemk`. The connected account showed 12 campaigns, all `ARCHIVED`, with no active campaigns or current showings visible. The account history referenced `prokolgnb.by`, `dekolux.by` and `gotovo.by`; exact landing URLs for generic campaign names were not established.
- Access policy: advertising integrations remain read-only. Do not start OAuth flows, edit or enable campaigns, change external account settings, or spend budget without a separate explicit owner approval. Never store account passwords, access tokens, verification tokens or secret values in this repository.
- Local access material: secrets, if needed by the existing read-only advertising checks, remain only in the ignored `ads/.env.local`; document variable names and procedures, never values. The mapping between the Yandex Direct login and the Yandex Webmaster profile should be rechecked in the UI rather than inferred from a login name.
- Waiting checklist: retry Yandex rights confirmation after DNS/cache propagation; submit the sitemap after confirmation; then review GSC and Yandex coverage, queries, CTR, Core Web Vitals and conversions before proposing new SEO pages or content changes.

## 11. Design and UI contract

Current V1 is a light editorial system, not the legacy dark system:

- `paper #F2EFE7`, `ink #171712`, `cobalt #2656D8`, `signal #FF6542`, `acid #D8FF52` in `app/globals.css`.
- Space Grotesk is the primary font via `next/font`; Georgia/Times is used only for selective italic editorial accents.
- Sharp geometry, strong grid/borders, oversized type, asymmetry, restrained shadows and clearly distinct CTA hierarchy.
- Shared building blocks: `EditorialHero`, `EditorialVisual`, `EditorialSectionHeader`, `EditorialMetrics`, `EditorialFaq`, `EditorialCta`, `EditorialBreadcrumbs`.
- Header is a client component with fixed desktop/mobile navigation and body scroll lock. Footer is a server component with core/SEO/contact links.
- `MotionController` observes `[data-reveal]`, including dynamically added nodes. CSS respects `prefers-reduced-motion`; keep it that way.
- Tailwind breakpoints in active layouts are primarily `sm` (640), `md` (768) and `lg` (1024); main desktop container is `max-w-[1440px]`.
- Generator output intentionally has its own niche-dependent token system; do not force the studio editorial palette into generated concepts.

To avoid degrading the design: reuse editorial primitives; preserve one dominant visual action; check 390 px and 1280 px; keep touch targets about 44 px; maintain visible labels/focus states; use `next/image` for repository images; do not revive violet/dark legacy UI on public studio pages; do not invent portfolio proof; and do not add motion without reduced-motion behavior.

## 12. Deployment and Git

- Always start with `git status`, current branch and `git fetch origin`. Never overwrite user changes. At the 2026-08-31 audit, the only pre-existing untracked path was `tmp/`; it was left untouched.
- Work branches use `codex/*`. Owner deployment contract: Vercel Preview is created from `codex/*`; production deploys from `main`.
- `.github/workflows/quality.yml` runs on pull requests and pushes to `main` or `codex/**`: install, Prisma generate, lint, tests, typecheck, build, local SEO check, deterministic concept render and mobile/desktop viewport checks.
- `.github/workflows/seo-ping.yml` runs only after pushes to `main`, waits for Vercel, then checks the production sitemap and every sitemap URL.
- `vercel.json` runs the idempotent attribution-column SQL only in `VERCEL_ENV=production`, then Prisma generate and Next build.
- Before production: local checks → CI green → Vercel Preview → manual desktop/mobile smoke test of routes/forms/generator fallback → explicit owner approval → merge/deploy.
- Never run production migrations, deploy production, send test leads, consume paid AI/ads budgets, or change external accounts without explicit approval.

`origin/codex/ads-attribution-v1` is an unmerged, one-commit advertising-tool branch (`28539b1`). It adds `ads/` read-only Google Ads/Yandex Direct access runbooks and scripts, not application attribution code. Its measurement plan is ahead of current implementation in some places (first/last touch, Yandex Metrica and additional events). Keep it isolated until reviewed. Never run OAuth flows or mutate/enable campaigns; account writes and spend are separate owner gates.

## 13. Environment variables

List names/purpose only; never print values.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL for Design/Order persistence |
| `GOOGLE_AI_API_KEY` | Gemini access |
| `GOOGLE_AI_MODEL` | Primary Gemini model override |
| `GOOGLE_AI_FALLBACK_MODEL` | Secondary Gemini model override |
| `GROQ_API_KEY` | Optional AI provider fallback |
| `GROQ_MODEL` | Groq model override |
| `PEXELS_API_KEY` | Optional concept photography search |
| `RESEND_API_KEY` | Lead email delivery and quota-secret fallback |
| `LEAD_NOTIFICATION_EMAIL` | Lead notification recipient |
| `TELEGRAM_BOT_TOKEN` | Telegram delivery and quota-secret fallback |
| `TELEGRAM_CHAT_ID` | Telegram destination |
| `GENERATION_LIMIT_SECRET` | Preferred HMAC secret for daily quota cookie |
| `NEXT_PUBLIC_SITE_URL` | Legacy/documented setting; current canonical code does not read it |
| `NODE_ENV` | Runtime mode; set by platform/tools |
| `VERCEL_ENV` | Vercel build gate for production-only SQL |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google indexing utility credential (`scripts/ping-indexing.mjs`) |
| `SITE_URL` | Optional indexing/production-check script origin override |
| `SEO_CHECK_PORT` | Local SEO check port override |
| `CHROME_PATH` | Viewport-check Chrome binary override |
| `SCREENSHOT_DIR` | Optional viewport screenshot output |

Unmerged ads branch only: `YANDEX_CLIENT_ID`, `YANDEX_CLIENT_SECRET`, `YANDEX_DIRECT_TOKEN`, `YANDEX_LOGIN`, `YANDEX_METRIKA_COUNTER_ID`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_LOGIN_CUSTOMER_ID`, `ADS_API_MODE`, `ADS_ALLOW_ACCOUNT_WRITES`, `ADS_ALLOW_SPEND`.

## 14. Verification commands

Minimum before a PR:

```bash
npm run lint
npm test
npm run typecheck
npm run build
npm run check:seo
```

Generator visual regression parity with CI:

```bash
npm run render:references
npm run check:viewport -- .reference-previews/*.html
```

Remove generated untracked preview artifacts after a local audit if the scripts do not clean them. Never remove pre-existing user files.

Audit baseline at commit `43064db`:

- lint: pass;
- tests: 93/93 pass;
- typecheck: pass;
- production build: pass (36 generated routes);
- SEO: pass (26 indexable pages, redirect and noindex contract);
- 12 reference concepts: no horizontal overflow at 390 px or 1280 px;
- production read-only smoke: `/`, `/contacts`, `/generator` loaded with expected metadata/H1/form/gallery and no browser console errors;
- `npm audit --omit=dev`: **6 high, 0 critical** production advisories — see P0 below.

Do not call external AI, Pexels, Resend, Telegram, indexing or ads APIs merely to “test” without explicit approval. Prefer unit/build/local fixture checks.

## 15. Risks and technical debt

Every item below is tied to code/config or an audit command. Recheck before acting.

### P0 — critical

- **Vulnerable production framework dependency.** `package.json` pins `next@16.1.7`. On 2026-08-31, `npm audit --omit=dev` reported 6 high advisories (0 critical), with Next direct and affected transitive `postcss`/`sharp`; npm offered patched Next `16.3.3`. Upgrade in a dedicated branch, read release notes, then rerun the complete build/SEO/viewport and production-preview smoke suite. Do not apply an unreviewed automatic force fix.

### P1 — important

- **Rate limiting is instance-local.** `lib/rate-limit.ts` uses an in-memory `Map`; Vercel cold starts/multiple instances weaken every advertised IP limit. The signed daily cookie is per technical session and can be reset by starting a new session. Use a shared store if abuse/cost warrants it.
- **Direct leads have no durable queue/store.** `/api/lead` does not use Prisma. Missing Resend configuration returns before Telegram is attempted; simultaneous delivery failure leaves only application logs and a client error. Preserve honest failure behavior, but add durable capture/retry before relying on paid traffic.
- **Generator lead depends on a saved design in the UI contract.** Generation intentionally returns a preview when persistence fails (`designId=null`), but `OrderModal` can still open and `/api/submit-order` rejects an empty ID. The small banner is hidden without an ID, yet the main modal is not. Provide a direct-lead fallback before claiming DB-independent lead capture.
- **Database provisioning is not reproducible from migration history.** The initial migration uses SQLite-style `DATETIME` while current Prisma datasource is PostgreSQL, and Vercel runs a single manual `ALTER TABLE ... IF NOT EXISTS` rather than `prisma migrate deploy`. Audit the live schema and establish a clean PostgreSQL baseline before the next schema change; do not experiment on production.
- **Stored previews have no ownership/expiry gate.** `/api/design/[id]` serves any valid known CUID without session/auth; CSP/noindex/no-store reduce execution/indexing risk, but `Design` and `Order` have no retention/expiry fields. Treat preview links as bearer links and define retention/deletion policy before storing sensitive briefs.

### P2 — improvements

- Add integration tests for the five API routes and both delivery-channel decision matrices; current tests concentrate on `lib/` composition, validation/security helpers and quota.
- Generator client files are large (`generator-form.tsx` ~648 lines, `generator-preview.tsx` ~621), contrary to the local >150-line guidance; split by form sections, lead dialogs and preview controls without changing contracts.
- `components/sections/lead-form.tsx` is unused and lacks current attribution/analytics/label quality; remove only in a reviewed cleanup.
- `package.json` includes apparently unused FFmpeg and SQLite adapter dependencies; verify with build/scripts before removal. `npm test`/reference rendering also warn because package module type is unspecified.
- The main app intentionally has security headers but no CSP (`next.config.ts`); previews do have strict CSP. Add a nonce-based app CSP only as a focused change with Next/GA verification.
- Attribution and generator lead analytics are incomplete as listed in section 9; the ads branch plan must not be treated as implemented.
- The OG asset is declared as 1731×909 rather than the conventional 1200×630. It passes current checks, but validate social crops before redesigning it.
- `/privacy` is indexable and tested but omitted from sitemap. Decide explicitly whether that is intentional.
- Legacy dark CSS/components and stale claims remain in historical content/skills. Do not copy them into new public UI; clean incrementally with route-level visual checks.

### Observations

- No functional P0 was found in the audited production smoke/build/test suite; the P0 above is dependency security exposure.
- Persistence is deliberately a side effect for generation and adjustment, which protects preview availability during DB failures.
- Dynamic preview HTML has strong boundaries: allow-listed spec, sanitization, CSP meta, sandboxed iframe and sandbox response headers.
- Production content matched the audited editorial routes during read-only checks, but the exact Vercel deployment SHA was not independently exposed/verified.
- Search Console/Yandex Webmaster and live advertising dashboards were not inspected; repository verification files or branch runbooks are not substitutes for console data.

## 16. Change guardrails

- Audit first; make the smallest scoped change; keep unrelated user modifications intact.
- Do not read `.env*`, `ads/.env.local`, browser storage/cookies or secret-bearing logs. Check configuration only through boolean presence or variable names.
- Do not alter prices (1,200 / 2,900 / 4,900 BYN; extended SEO from 600 BYN), 30/40/30 terms, contact details, legal copy or factual claims without owner confirmation.
- Never fabricate metrics, testimonials, guarantees, certifications, cases, team members, geography claims or rankings.
- Keep data in `content/` when it is reusable. Keep sanitization at the rendering/notification boundary.
- Any route change needs metadata, sitemap, robots, internal links and SEO test review.
- Any form/API change needs validation, rate-limit, attribution, delivery and failure-state review.
- Any generator change needs XSS, compose, quality, quota and 390/1280 viewport tests.
- Any schema change needs a reviewed PostgreSQL migration and preview verification; production migration requires explicit owner approval.
- Any analytics/ads change must preserve denied-by-default consent and must not transmit PII in attribution. Account writes and spend require separate explicit approvals.
- Finish by showing `git diff -- AGENTS.md <scoped files>` and `git status`; do not stage, commit, push, open a PR or deploy unless asked.
