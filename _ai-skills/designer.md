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

// Способ 4: наложение (overlap) — карточка выходит за край секции
<section className="pb-32">  // секция снизу даёт место
<div className="-mt-16 relative z-10">  // следующий элемент заходит вверх
```

### Иконки и визуальные акценты

```tsx
// Emoji как иконки — быстро, выразительно
<span className="text-3xl" aria-hidden="true">⚡</span>

// Кастомный SVG в цветном круге
<div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400">
  <svg>...</svg>
</div>

// Номер как декоративный элемент
<span className="text-8xl font-black text-white/5 absolute -top-4 -left-4 select-none">01</span>

// Градиентная иконка-пятно
<div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
  <svg className="text-white">...</svg>
</div>
```

---

## 🏗️ ДИЗАЙН-СИСТЕМА ПРОЕКТА GOTOVO

### Бренд
- **Название:** gotovo
- **Характер:** технологичный, уверенный, дружелюбный. Не корпоративный.
- **Тема:** ТЁМНАЯ. Всегда. bg-[#0A0A0F] на всё.
- **Шрифт:** Sora (не Inter, не Geist)
- **Референсы:** Linear.app, Vercel.com — технологичность + элегантность

### Цветовая палитра

```css
--bg-base: #0A0A0F;         /* Основной фон */
--bg-surface: #13131A;      /* Карточки */
--bg-elevated: #1C1C28;     /* Hover, модалы */
--bg-subtle: #16161F;       /* Чередование секций */

--accent-purple: #7C3AED;   /* Primary */
--accent-blue: #3B82F6;     /* Secondary */
--accent-pink: #EC4899;     /* В градиентах */

--text-primary: #F8F8FF;
--text-secondary: #A1A1B5;
--text-muted: #6B6B80;

--border-subtle: rgba(255,255,255,0.06);
--border-default: rgba(255,255,255,0.10);
```

### Tailwind классы — шпаргалка

```tsx
// Фоны
bg-[#0A0A0F]  bg-[#13131A]  bg-[#1C1C28]  bg-[#16161F]

// Текст
text-white  text-[#A1A1B5]  text-[#6B6B80]
text-violet-400  text-blue-400

// Границы
border-white/[0.06]  border-white/10  border-white/20
border-violet-500/30  border-violet-500/50

// Акцент
bg-gradient-to-r from-violet-600 to-blue-600
bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500
text — bg-gradient-to-r + bg-clip-text + text-transparent

// Shadows (glow)
shadow-lg shadow-violet-500/25
shadow-xl shadow-violet-500/30
```

### Кнопки

```tsx
// PRIMARY
<button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 hover:-translate-y-0.5">

// SECONDARY
<button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10 hover:border-white/20">

// GHOST
<button className="text-sm text-[#A1A1B5] hover:text-white transition-colors">
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

### Шрифт: Sora
```tsx
import { Sora } from "next/font/google"
const sora = Sora({ subsets: ["latin", "cyrillic"], variable: "--font-sora" })
```

### Размеры
```
Hero H1:    text-5xl sm:text-6xl lg:text-7xl  font-bold tracking-tight
H2:         text-3xl sm:text-4xl              font-bold tracking-tight
H3:         text-xl sm:text-2xl              font-semibold
Body:       text-base sm:text-lg             leading-7 text-[#A1A1B5]
Small:      text-sm                          text-[#6B6B80]
Badge:      text-xs uppercase tracking-widest font-semibold
```

### Градиентный текст (только для ключевых слов)
```tsx
<span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
  ключевое слово
</span>
// НЕ делай весь заголовок градиентным — теряется акцент
```

---

## 🚫 ЧТО НИКОГДА НЕ ДЕЛАТЬ

```
❌ Белый фон (#fff) на страницах gotovo
❌ Шрифт Geist или Inter в gotovo — только Sora
❌ border-radius меньше rounded-xl (12px)
❌ Серые безликие карточки без характера
❌ Весь заголовок в градиентном цвете
❌ Одинаковые кнопки — primary/secondary/ghost должны различаться
❌ Анимации которые мешают контенту
❌ Текст меньше text-xs (10px)
❌ Иконки без смысла
❌ Симметрия ради симметрии — асимметрия живее
```
