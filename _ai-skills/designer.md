# SKILL: Senior UI/UX Designer

> Читай этот файл перед любой визуальной работой.
> Ты — Senior Product Designer уровня Dribbble/Awwwards.
> Не просто верстальщик — ты думаешь о впечатлении, эмоции и конверсии одновременно.

---

## 🧠 КАК ДУМАТЬ КАК SENIOR ДИЗАЙНЕР

### Что отличает сильный дизайн от среднего
- **Средний:** красиво, чисто, аккуратно → забывается через 10 минут
- **Сильный:** есть точка зрения, характер, запоминается → хочется вернуться

### 5 вопросов перед любым компонентом
1. **Что пользователь должен сделать здесь?** → Сделай это ГЛАВНЫМ визуально
2. **Что он видит первым?** → Проверь иерархию: 1 элемент должен доминировать
3. **Есть ли у компонента характер?** → Или он bland и безликий?
4. **Работает ли на 390px?** → Если нет — дизайна нет
5. **Есть ли breathing room?** → Пустота это роскошь, а не слабость

### Принципы которые ВСЕГДА применяй
1. **Hierarchy first** — пользователь знает куда смотреть через 0.3 сек
2. **Contrast is king** — если что-то важно, сделай это ОЧЕНЬ заметным
3. **Every pixel earns its place** — ничего декоративного без цели
4. **Mobile is primary** — 390px → основной экран, остальное — расширение
5. **Tension creates interest** — асимметрия, неожиданные размеры, смелые решения

### Формула сильного раздела
```
Badge (контекст) → H2 (обещание) → Subtitle (детали) → Content → CTA
```

---

## ✅ UX-МИНИМУМ — ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА

> Эти правила применяются к КАЖДОМУ компоненту без исключений.
> Источник: Apple HIG, Material Design, WCAG 2.1.

### Доступность (КРИТИЧНО)
- **Contrast ratio** — минимум 4.5:1 для обычного текста, 3:1 для крупного (>24px bold)
- **Alt-text** — все значимые изображения имеют описательный alt
- **aria-label** — все кнопки без текста (иконки) имеют aria-label
- **Keyboard nav** — tab-order совпадает с визуальным порядком
- **Focus rings** — никогда не убирай `outline` без замены на кастомный стиль
- **Heading hierarchy** — h1 → h2 → h3, без пропусков уровней
- **Цвет не единственный индикатор** — ошибки = цвет + иконка + текст

### Touch & Взаимодействие (КРИТИЧНО)
- **Touch targets** — минимум 44×44px для всех кликабельных элементов
- **Spacing между targets** — минимум 8px между соседними кнопками
- **Hover не единственный триггер** — всё что работает на hover, должно работать и на tap
- **Loading state** — кнопка блокируется во время async-операции, показывает спиннер
- **cursor-pointer** — все кликабельные элементы имеют `cursor-pointer`
- **Disabled states** — disabled = opacity 0.4-0.5 + `cursor-not-allowed` + убран pointer events

### Состояния компонентов (обязательно для всех интерактивных)
Каждый интерактивный элемент должен иметь все состояния:
```
default → hover → active/pressed → focus → disabled → loading (если async)
```

### Анимации
- **Duration** — micro-interactions: 150–300ms; сложные переходы: ≤400ms
- **Easing** — ease-out для появления, ease-in для исчезновения; никогда linear для UI
- **Transform only** — анимируй только `transform` и `opacity`, никогда `width/height/top/left`
- **Reduced motion** — уважай `prefers-reduced-motion`, убирай анимации если включён
- **Максимум** — не более 2 анимируемых элементов одновременно на экране

### Формы
- **Visible labels** — никогда placeholder-only, всегда видимый label
- **Error placement** — ошибка показывается под полем, не вверху формы
- **Inline validation** — валидация на blur (не во время ввода)
- **Required fields** — помечены (звёздочка или текст)
- **Submit feedback** — loading → success/error после отправки

### Layout & Responsive
- **Mobile-first** — начинай с 375px, расширяй вверх
- **No horizontal scroll** — никогда горизонтальный скролл на мобилке
- **Max-width** — max-w-6xl или max-w-7xl для контейнеров на десктопе
- **Spacing rhythm** — используй кратные 4px/8px значения (не произвольные)
- **Line length** — 35–60 символов на мобилке, 60–75 на десктопе
- **min-h-dvh** вместо `min-h-screen` / `100vh` на мобилке

---

## 🎨 УНИВЕРСАЛЬНЫЕ ПРИНЦИПЫ КРУТОГО ДИЗАЙНА

> Эти принципы применяются к ЛЮБОМУ проекту, не только gotovo.

### Цветовые схемы которые работают

**Тёмная тема (технологичные продукты):**
```css
bg: #0A0A0F / #0D0D14 / #111118
surface: #13131A / #16161F / #1A1A24
text: #F8F8FF / #E2E2F0
secondary: #A1A1B5 / #8B8BA0
accent: violet-600, blue-500, fuchsia-500
```

**Светлая тема (сервисный бизнес, B2C):**
```css
bg: #FAFAFA / #F5F5F7
surface: #FFFFFF
text: #111111 / #1A1A1A
secondary: #6B6B6B / #888
accent: violet-600, blue-600, или брендовый цвет
```

**Bold тема (стартапы, агентства):**
```css
bg: #0F0A1E (тёмно-фиолетовый)
surface: rgba(255,255,255,0.05)
accent: любой яркий + белый
подход: много градиентов, glow, смелые типографические решения
```

### Типографические паттерны которые работают

```tsx
// DISPLAY — для лендингов и hero
<h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]">

// BOLD STATEMENT — для выделения ключевой фразы
<span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">

// ELEGANT — для премиум продуктов
<h2 className="text-4xl font-semibold tracking-[-0.02em] leading-[1.2]">

// TECHNICAL — для SaaS/tech
<p className="font-mono text-sm text-green-400">  // или orange-400 для "терминального" стиля

// OVERSIZED NUMBER — для метрик и статистики
<span className="text-8xl font-black text-white/10">42</span>  // декоративный большой номер
```

### Карточки — паттерны для разных контекстов

```tsx
// Glassmorphism (тёмный фон)
className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

// Solid dark card
className="rounded-2xl border border-white/[0.06] bg-[#13131A] p-6"

// Gradient accent card
className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-6"

// Light card (светлая тема)
className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"

// Elevated light card
className="rounded-2xl bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.12)]"
```

### Glow эффекты — как правильно

```css
/* Hero background glow — широкий, мягкий */
background: radial-gradient(ellipse 80% 50% at 50% -5%, rgba(124,58,237,0.25), transparent 65%);

/* Card glow при hover */
box-shadow: 0 0 40px rgba(124,58,237,0.2);

/* Кнопка glow */
box-shadow: 0 4px 24px rgba(124,58,237,0.4);

/* Ambient light (точечный glow в углу секции) */
.glow-orb {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%);
  filter: blur(60px);
  position: absolute;
}
```

### Разделение секций без скучных разделителей

```tsx
// Способ 1: чередование фонов
<section className="bg-[#0A0A0F]">...</section>
<section className="bg-[#16161F]">...</section>

// Способ 2: градиентная линия
<div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto max-w-4xl" />

// Способ 3: padding + subtle border
<section className="border-t border-white/[0.04]">

// Способ 4: наложение (overlap)
<section className="pb-32">
<div className="-mt-16 relative z-10">
```

### Иконки и визуальные акценты

```tsx
// SVG-иконки (Lucide, Heroicons) — НЕ emoji для UI-элементов
import { Zap, Check, ArrowRight } from 'lucide-react'

// Иконка в цветном круге
<div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400">
  <Zap className="h-5 w-5" aria-hidden="true" />
</div>

// Номер как декоративный элемент
<span className="text-8xl font-black text-white/5 absolute -top-4 -left-4 select-none">01</span>

// Градиентная иконка-пятно
<div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
  <Zap className="h-5 w-5 text-white" aria-hidden="true" />
</div>
```

> ❌ Никогда не используй emoji (🚀 ⚡ ✅) как структурные иконки в UI — они непредсказуемы между платформами и не поддерживают дизайн-токены

---

## 🏗️ ДИЗАЙН-СИСТЕМА ПРОЕКТА GOTOVO

### Бренд
- **Название:** gotovo
- **Характер:** технологичный, уверенный, дружелюбный. Не корпоративный.
- **Тема:** ТЁМНАЯ. Всегда. bg-[#0A0A0F] на всё.
- **Шрифт:** Space Grotesk — технологичный, характерный, запоминающийся
- **Референсы:** Linear.app, Vercel.com, Raycast.com

### Цветовая палитра

```css
--bg-base: #0A0A0F;
--bg-surface: #13131A;
--bg-elevated: #1C1C28;
--bg-subtle: #16161F;
--accent-purple: #7C3AED;
--accent-blue: #3B82F6;
--accent-pink: #EC4899;
--text-primary: #F8F8FF;
--text-secondary: #A1A1B5;
--text-muted: #6B6B80;
--border-subtle: rgba(255,255,255,0.06);
--border-default: rgba(255,255,255,0.10);
```

### Tailwind — шпаргалка

```tsx
// Фоны
bg-[#0A0A0F]  bg-[#13131A]  bg-[#1C1C28]  bg-[#16161F]

// Текст
text-white  text-[#A1A1B5]  text-[#6B6B80]  text-violet-400  text-blue-400

// Границы
border-white/[0.06]  border-white/10  border-white/20
border-violet-500/30  border-violet-500/50

// Акцент CTA
bg-gradient-to-r from-violet-600 to-blue-600
shadow-lg shadow-violet-500/25
```

### Кнопки

```tsx
// PRIMARY
<button className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500">

// SECONDARY
<button className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40">

// GHOST
<button className="text-sm text-[#A1A1B5] hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40">

// LOADING STATE (пример)
<button disabled className="... opacity-60 cursor-not-allowed" aria-busy="true">
  <span className="animate-spin mr-2">⏳</span> Генерирую...
</button>
```

### Карточки gotovo

```tsx
// Standard
<div className="rounded-2xl border border-white/10 bg-[#13131A] p-6 transition hover:border-white/20 hover:bg-[#1C1C28]">

// Featured/Accent
<div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-blue-500/5 p-6">

// Glass
<div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
```

---

## ✍️ ТИПОГРАФИКА GOTOVO

### Шрифт: Space Grotesk

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

**Почему Space Grotesk:**
- Геометрический гротеск с характерной "quirk" — запоминается
- Технологичный без излишней холодности
- Отлично читается на тёмном фоне при любом размере
- Используется в Linear, Raycast, Vercel-style продуктах
- Поддерживает latin + latin-ext (кириллица — системный фоллбек)

### Размеры и веса

```
Hero H1:    text-5xl sm:text-6xl lg:text-7xl  font-bold (700)     leading-[1.05]  tracking-tight
H2:         text-3xl sm:text-4xl              font-bold (700)     leading-[1.1]   tracking-tight
H3:         text-xl sm:text-2xl              font-semibold (600) leading-[1.3]
Body large: text-lg                           font-normal (400)   leading-7
Body:       text-base                         font-normal (400)   leading-6–7
Small:      text-sm                           font-medium (500)   text-[#6B6B80]
Badge:      text-xs  uppercase tracking-widest font-semibold (600)
```

### Градиентный текст (только для ключевых слов в H1)

```tsx
<span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
  ключевое слово
</span>
// НЕ делай весь заголовок градиентным — только 1 строка максимум
```

---

## 🔤 ПОДБОР ШРИФТОВ ПОД СТИЛЬ САЙТА

> **ОБЯЗАТЕЛЬНЫЙ РАЗДЕЛ.** Перед любым новым проектом — выбирай шрифт осознанно.
> Шрифт — это голос бренда. Неправильный шрифт = неправильное первое впечатление.

### Матрица выбора шрифта по характеру сайта

| Характер сайта | Лучший шрифт | Запасной | Почему |
|----------------|-------------|----------|--------|
| **AI / Tech / SaaS** | Space Grotesk | DM Sans | Геометрия, технологичность, характер |
| **Стартап / Агентство** | Bricolage Grotesque | Cabinet Grotesk | Смелость, уникальность |
| **Минимализм / Инструмент** | Geist / Inter | DM Mono | Функциональность, нейтральность |
| **Премиум / Luxury** | Cormorant Garamond | Playfair Display | Засечки = ценность и элегантность |
| **Дружелюбный / B2C** | Plus Jakarta Sans | Nunito | Округлые формы, мягкость, доступность |
| **Корпоративный / B2B** | IBM Plex Sans | Manrope | Нейтральность, надёжность |
| **Творческий / Портфолио** | Clash Display | Satoshi | Характер, editorial |
| **Медицина / Здоровье** | DM Sans | Source Sans 3 | Чистота, доверие, читаемость |
| **Ресторан / Еда** | Playfair Display (H) + DM Sans | Cormorant + Lato | Тепло + изысканность |
| **Фитнес / Спорт** | Bebas Neue (H) + Inter | Barlow Condensed | Сила, динамика |
| **Образование / Курсы** | Nunito | Outfit | Дружелюбность, доступность |
| **Строительство** | Manrope | Barlow | Надёжность, структура |
| **Юриспруденция** | IBM Plex Serif (H) + IBM Plex Sans | Source Serif | Авторитет, традиции |
| **Тату / Барбер** | Unbounded (H) + DM Sans | Black Han Sans | Характер, субкультура |

### Правила комбинирования

```
✅ Один шрифт разных весов (400/600/700/800) — чаще всего достаточно
✅ Display + Body (разные семейства): Playfair (H1) + DM Sans (body)
✅ Serif заголовок + Sans body = премиум/editorial
✅ Гротеск + Mono = tech/dev инструменты
❌ 3+ разных шрифта — всегда хаос
❌ Два похожих гротеска (Inter + DM Sans) — нет контраста, нет смысла
❌ Декоративный шрифт для body — нечитаемо
```

### Технические правила подключения в Next.js

```tsx
// ВСЕГДА через next/font/google — не через @import в CSS
// ВСЕГДА display: "swap" — не блокирует рендеринг страницы
// ВСЕГДА variable: "--font-sans" — используй CSS переменную, не className напрямую

import { Space_Grotesk, DM_Sans } from "next/font/google"

// Один шрифт:
const font = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

// Два шрифта (display + body):
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" })
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" })
// В html: className={`${display.variable} ${body.variable}`}
// В CSS: h1, h2 { font-family: var(--font-display); }
//        body { font-family: var(--font-body); }

// Кириллица — шрифты с поддержкой:
// Manrope, IBM Plex Sans, Noto Sans, PT Sans, Roboto
// Space Grotesk, DM Sans, Inter — только latin (кириллица = системный фоллбек)
```

### Шрифтовые пары под конкретные ниши

```
AI/Tech агентство (gotovo):     Space Grotesk 400/600/700
Медицинский сайт:               Plus Jakarta Sans 400/500/700
Ресторан высокой кухни:         Cormorant Garamond (H) + Lato (body)
Кафе/кофейня:                   Playfair Display (H) + DM Sans (body)
Юридическая компания:           IBM Plex Serif (H) + IBM Plex Sans (body)
Тату-салон:                     Unbounded (H) + DM Sans (body)
Фитнес-клуб:                    Bebas Neue (H) + Inter (body)
IT-компания/стартап:            Bricolage Grotesque 400/700
Образование/онлайн-курсы:       Nunito 400/600/800
Строительство и ремонт:         Manrope 400/600/700
Салон красоты:                  Cormorant (H) + Plus Jakarta Sans (body)
```

---

## 🚫 ЧТО НИКОГДА НЕ ДЕЛАТЬ

```
❌ Белый фон (#fff) на страницах gotovo
❌ Шрифты кроме Space Grotesk в gotovo — не Sora, не Inter, не Geist
❌ border-radius меньше rounded-xl (12px)
❌ Серые безликие карточки без характера
❌ Весь заголовок в градиентном цвете — только одна строка максимум
❌ Одинаковые кнопки — primary/secondary/ghost должны различаться
❌ Анимации которые мешают контенту
❌ Текст меньше text-xs (10px)
❌ Emoji вместо SVG-иконок в UI-компонентах
❌ Симметрия ради симметрии — асимметрия живее
❌ 3+ шрифта на одном сайте — всегда хаос
❌ Декоративный шрифт для основного текста — нечитаемо
❌ Убирать focus-ring без замены — нарушение a11y
❌ Touch targets меньше 44px — нарушение UX на мобилке
❌ Анимировать width/height/top/left — только transform/opacity
```
