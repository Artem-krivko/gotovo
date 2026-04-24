# CLAUDE.md — Контекст проекта AI Web Agency / gotovo

> Читай этот файл в начале каждого нового чата.
> Затем читай `_ai-skills/developer.md` перед кодом.
> Затем читай `_ai-skills/designer.md` перед любой визуальной работой.
> Затем читай `_ai-skills/seo.md` перед метаданными и контентом.

---

## 🎯 Суть проекта

**gotovo** — AI веб-агентство с генератором дизайна.
Клиент описывает бизнес → ИИ генерирует превью сайта → клиент оставляет заявку.

**Монетизация:** лид-генерация. Генератор бесплатный, платят за разработку.
**Стек:** Next.js 16 App Router + TypeScript + Tailwind CSS 4

---

## 🎨 ДИЗАЙН-СИСТЕМА (ОБЯЗАТЕЛЬНО ЗНАТЬ)

> Подробности в `_ai-skills/designer.md`. Здесь — самое критичное.

### Тема: ТЁМНАЯ. Всегда.
```
bg-[#0A0A0F]   ← фон страницы
bg-[#13131A]   ← карточки
bg-[#1C1C28]   ← elevated / hover
```

### Цвета акцентов
```
Фиолетовый:  violet-600 (#7C3AED) — primary кнопки, акценты
Синий:       blue-500 (#3B82F6)   — вторичный акцент
Фуксия:      fuchsia-500          — в градиентах
Градиент:    from-violet-600 to-blue-600 — primary CTA
```

### Шрифт: Space Grotesk (не Sora, не Inter, не Geist)
```tsx
import { Space_Grotesk } from "next/font/google"
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})
// В html: className={spaceGrotesk.variable}
// В body: style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
```

### Текст
```
Основной:    text-white
Вторичный:   text-[#A1A1B5]
Мьютед:      text-[#6B6B80]
```

### Кнопки
```tsx
// PRIMARY
className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-90 hover:-translate-y-0.5 transition"

// SECONDARY
className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition"
```

### Карточки
```tsx
// Стандартная
className="rounded-2xl border border-white/10 bg-[#13131A] p-6 hover:border-white/20 hover:bg-[#1C1C28] transition"

// Акцентная
className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-6"
```

---

## 🤖 Инструкции для Claude/Cursor

1. **Читай этот файл** в начале каждого нового чата
2. **Читай `_ai-skills/designer.md`** перед ЛЮБОЙ визуальной работой
3. **Читай `_ai-skills/developer.md`** перед написанием ЛЮБОГО кода
4. **Читай `_ai-skills/seo.md`** перед метаданными, Schema.org, sitemap
5. **Тёмная тема везде** — bg-[#0A0A0F], никакого белого фона на страницах
6. **Шрифт Space Grotesk** — переменная `--font-sans`, не Sora, не Inter, не Geist
7. **Template literals** — ТОЛЬКО через backticks
8. **Компоненты** — Server Components по умолчанию
9. **Данные** — в `content/`, не хардкодить в компонентах
10. **После решений** — обновляй `_docs/DECISIONS.md`

---

## 📱 МОБИЛЬНЫЙ UX — ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА

**Карточки в ряд (3+)** → горизонтальный snap-scroll на мобилке:
```tsx
<div className="-mx-4 overflow-x-auto px-4 sm:hidden">
  <div className="flex gap-4 pb-3" style={{ scrollSnapType: "x mandatory" }}>
    {items.map(item => (
      <div key={item.id} style={{ scrollSnapAlign: "start" }}>
        <Card className="w-[80vw] max-w-[300px] shrink-0" />
      </div>
    ))}
    <div className="w-4 shrink-0" aria-hidden="true" />
  </div>
</div>
<div className="hidden sm:grid sm:grid-cols-3 gap-5">...</div>
```

**Длинные списки (5+)** → аккордеон на мобилке

**Двухколоночные секции** → скрывать декоративную колонку:
```tsx
<div className="hidden lg:grid lg:grid-cols-2">...</div>
<div className="lg:hidden">...</div>
```

**Метрики в ряд** → горизонтальный скролл:
```tsx
<div className="-mx-4 overflow-x-auto px-4 sm:hidden">
  <div className="flex gap-3 pb-1">
    {metrics.map(m => <MetricCard className="min-w-[140px] shrink-0" />)}
  </div>
</div>
<div className="hidden sm:grid sm:grid-cols-3 gap-3">...</div>
```

**Запрещено:**
- ❌ 3+ карточки в стопку без snap-scroll
- ❌ Двухколоночный layout без мобильной версии
- ❌ Touch targets меньше py-3.5
- ❌ Текст мельче text-xs

---

## 🔍 SEO — ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА

Каждая страница:
```typescript
export const metadata: Metadata = {
  title: "...",         // 50-60 символов, keyword
  description: "...",  // 150-160 символов, цифры
  alternates: { canonical: `${SITE_URL}/slug` },
  openGraph: { url: `${SITE_URL}/slug`, images: [{ url: "/og-image.png" }] },
}
```

---

## 📁 Структура проекта

```
ai-agency-starter/
├── CLAUDE.md
├── _ai-skills/
│   ├── developer.md      ← код (читать перед кодом)
│   ├── designer.md       ← дизайн + подбор шрифтов (читать перед версткой)
│   ├── seo.md            ← SEO (читать перед метаданными)
│   ├── pm.md
│   ├── copywriter.md
│   └── prompt-engineer.md
├── app/
│   ├── page.tsx
│   ├── generator/
│   ├── services/ pricing/ process/ about/ contacts/ thank-you/
│   ├── razrabotka-sajtov-minsk/
│   ├── lending-minsk/
│   ├── sozdanie-sajtov-dlya-biznesa/
│   ├── razrabotka-sajtov-ceny/
│   ├── ai-generator-sajta/
│   └── api/ (generate/, lead/)
├── components/
│   ├── generator/
│   ├── layout/
│   ├── sections/
│   └── shared/
├── content/
└── lib/
    ├── types.ts
    └── prompts.ts
```

---

## ⚙️ Технические решения

- **AI Generator:** Claude API → HTML → `<iframe srcDoc>`
- **Без API ключа:** HTML-заглушка (генератор работает всегда)
- **Заявки:** Resend API → email
- **Деплой:** Vercel (Artem-krivko/gotovo)
- **ENV:** `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`, `NEXT_PUBLIC_SITE_URL`

---

## 👤 Команда

**Владелец:** Артём (Беларусь, Минск)
**Инструменты:** Claude (claude.ai), Cursor IDE, Vercel
