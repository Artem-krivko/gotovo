# SKILL: Senior Fullstack Developer Standards

> ОБЯЗАТЕЛЬНО читай перед написанием любого кода.
> Эти стандарты — не рекомендации, а правила. Отступление = технический долг.

---

## 0. КРИТИЧЕСКОЕ — директивы Next.js App Router

```typescript
// ✅ Server Component — директива НЕ НУЖНА (это дефолт в App Router)
export function PricingCard({ plan }: Props) { ... }

// ✅ Client Component — "use client" ТОЛЬКО если есть useState/useEffect/useRef/браузерные API
"use client"
export function GeneratorForm() {
  const [value, setValue] = useState("")
  ...
}

// ✅ Server Action — "use server" ТОЛЬКО внутри async функции-действия
async function submitLead(formData: FormData) {
  "use server"
  await saveLead(formData)
}

// ❌ НИКОГДА — "use server" на обычном компоненте (сломает билд)
"use server"
export function Services({ items }: Props) { ... }  // ОШИБКА: Server Actions must be async
```

**Правило:** `"use server"` = только async функции. `"use client"` = только если нужен browser API.

---

## 1. TypeScript — строго

```typescript
// ❌ Плохо
const handler = (e: any) => { ... }
const items = data.map(i => i.title)

// ✅ Хорошо
const handler = (e: React.MouseEvent<HTMLButtonElement>) => { ... }
const items = data.map((item: ServiceItem) => item.title)
```

- Никаких `any`. Если тип неизвестен — `unknown` + guard.
- Пропсы компонентов типизируются через `interface`, не `type`.
- Переиспользуемые типы — в `lib/types.ts`, не inline.

---

## 2. Template literals — только через backticks

```typescript
// ❌ Сломает код — обычные кавычки не интерполируют переменные
element.style.transform = 'translate(${x}px, ${y}px)'

// ✅ Правильно
element.style.transform = `translate(${x}px, ${y}px)`
```

---

## 3. Компонентная архитектура — данные отдельно от вёрстки

```typescript
// ❌ Данные внутри компонента
export function GeneratorTeaser() {
  const CASES = [{ id: 1, label: "Стоматология" }]
  ...
}

// ✅ Данные в content/, компонент только рендерит
// content/generator-cases.ts → экспортирует GENERATOR_CASES
// components/sections/generator-teaser.tsx → импортирует и рендерит
```

---

## 4. Иконки — компоненты, не JSX в массивах

```typescript
// ❌ Антипаттерн
const ICONS = [<svg key="a">...</svg>, <svg key="b">...</svg>]

// ✅ Lucide React или отдельные функциональные компоненты
import { Zap, Check, ArrowRight } from 'lucide-react'
// или
function IconLanding() {
  return <svg width="22" height="22" aria-hidden="true">...</svg>
}
```

---

## 5. Обработка ошибок в API routes

```typescript
// ✅ Всегда try/catch + типизированный ответ + логирование
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as GenerateRequest

    if (!body.description?.trim()) {
      return NextResponse.json({ error: 'Описание обязательно' }, { status: 400 })
    }

    const result = await callApi(body)
    return NextResponse.json({ html: result }, { status: 200 })

  } catch (error) {
    console.error('[POST /api/generate]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}
```

---

## 6. Доступность (a11y) — базовый минимум

```tsx
// Декоративные SVG и иконки — скрыты от скринридеров
<svg aria-hidden="true">...</svg>
<Zap className="h-5 w-5" aria-hidden="true" />

// Кнопки без текста — с aria-label
<button aria-label="Закрыть" onClick={onClose}><XIcon aria-hidden="true" /></button>

// Изображения с осмысленным alt
<img src={preview} alt={`Превью сайта — ${businessType}`} />

// label связан с input через htmlFor/id
<label htmlFor="description">Описание</label>
<input id="description" name="description" />

// Focus-visible — никогда не убирай без замены
// ❌ className="outline-none"
// ✅ className="outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
```

**Touch targets — минимум 44×44px:**
```tsx
// ❌ Маленькая кнопка без достаточного padding
<button className="p-1"><XIcon /></button>

// ✅ Минимум 44px в высоту и ширину
<button className="p-3 min-w-[44px] min-h-[44px]"><XIcon /></button>
```

**Contrast ratio:**
- Основной текст на bg-[#0A0A0F]: `text-white` (#F8F8FF) → ✅ >15:1
- Вторичный текст: `text-[#A1A1B5]` на bg-[#0A0A0F] → ✅ ~6:1
- Мьютед текст: `text-[#6B6B80]` — только для некритичного контента, не для основного

---

## 7. Производительность

```typescript
// Тяжёлые вычисления — useMemo
const sorted = useMemo(() => plans.sort(...), [plans])

// Колбэки в списках — useCallback
const handleSelect = useCallback((id: string) => setSelected(id), [])

// Изображения — next/image с размерами
import Image from 'next/image'
<Image src="/hero.jpg" alt="..." width={1200} height={800} priority />
// priority только для above-the-fold

// Тяжёлые компоненты — dynamic import
import dynamic from 'next/dynamic'
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div className="animate-pulse bg-white/5 rounded-2xl h-48" />,
})
```

---

## 8. Именование — однозначное

```typescript
// ❌ data, items, handler, onClick
// ✅ generatorResult, featuredPlans, handleGenerateSubmit, handlePlanSelect
```

---

## 9. Структура файла компонента

```typescript
// 1. Директива (только если нужна)
"use client"

// 2. Импорты: React → Next → внешние → внутренние → типы
import { useState } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Section } from '@/components/shared/section'
import type { GeneratorParams } from '@/lib/types'

// 3. Локальные константы (если не выносятся в content/)
const MAX_LENGTH = 500

// 4. Вспомогательные под-компоненты
function LoadingDot() { return <span className="animate-pulse">•</span> }

// 5. Основной компонент — interface Props, затем export function
interface Props { ... }
export function MyComponent({ ... }: Props) {
  // state → memo → callbacks → effects → early returns → return JSX
}
```

---

## 10. Состояния кнопок и интерактивных элементов

Каждая кнопка должна иметь все состояния. Пример полной кнопки:

```tsx
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  isLoading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, isLoading, disabled, variant = 'primary' }: ButtonProps) {
  const base = "rounded-xl px-6 py-3.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90 hover:-translate-y-0.5 focus-visible:outline-violet-500",
    secondary: "border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 focus-visible:outline-white/40",
  }
  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none"

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${base} ${variants[variant]} ${(disabled || isLoading) ? disabledStyles : ''}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
          Загрузка...
        </span>
      ) : children}
    </button>
  )
}
```

---

## Чеклист перед отправкой кода

### Next.js / TypeScript
- [ ] Нет `"use server"` на обычном компоненте
- [ ] `"use client"` только там где реально нужен
- [ ] Все template literals через backticks
- [ ] Нет `any` типов
- [ ] API routes в try/catch
- [ ] Изображения через `next/image`
- [ ] Данные вынесены из компонента
- [ ] Нет `console.log` (только `console.error` в catch)

### Доступность & UX
- [ ] SVG/иконки с `aria-hidden="true"`
- [ ] Кнопки-иконки имеют `aria-label`
- [ ] Все `input` имеют связанный `label` через `htmlFor`
- [ ] Нет `outline-none` без `focus-visible` замены
- [ ] Touch targets ≥ 44×44px
- [ ] Кнопки имеют состояния: hover, focus-visible, disabled, loading (если async)
- [ ] Текст `text-[#6B6B80]` (мьютед) не используется для важного контента

### Производительность
- [ ] Тяжёлые компоненты через `dynamic()`
- [ ] `priority` на изображениях only above-the-fold
- [ ] Нет лишних Client Components
