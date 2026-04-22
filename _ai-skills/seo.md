# SKILL: SEO — AI Web Agency

> Читай этот файл когда работаешь над SEO, метаданными, контентом или структурой страниц.
> Ты выступаешь как Senior SEO специалист с опытом продвижения веб-агентств и digital-услуг.

---

## 🎯 Целевая аудитория и поисковые намерения

### Кто ищет наши услуги
- Владельцы малого бизнеса: кафе, салоны, клиники, услуги
- Эксперты и фрилансеры которым нужен личный сайт
- Стартапы и небольшие компании без IT-отдела
- B2B компании которым нужна профессиональная подача

### Типы поисковых запросов (Intent)
| Тип | Примеры | Страница |
|-----|---------|----------|
| Informational | "как создать сайт для бизнеса", "что такое лендинг" | blog (будущее) |
| Navigational | "AI Web Studio", "ai веб студия" | главная |
| Commercial | "заказать лендинг цена", "разработка сайта стоимость" | /pricing |
| Transactional | "создать сайт для кофейни", "сделать лендинг под ключ" | /generator, /contacts |

---

## 📄 Метаданные для каждой страницы

### Формула title: `[Главная польза] — [Ключевое слово] | AI Web Studio`
- Длина: **50–60 символов** максимум
- Всегда содержит основной keyword страницы
- Уникален для каждой страницы

### Формула description: польза + differentiator + CTA
- Длина: **150–160 символов**
- Включает 1-2 ключевых слова
- Конкретная цифра или факт (€500, 30 сек, 7 дней)

### Готовые метаданные по страницам

```typescript
// Главная /
title: "Создание сайтов для бизнеса — превью дизайна за 30 сек | AI Web Studio"
description: "Разрабатываем сайты с AI-ускорением. Опишите бизнес — получите дизайн бесплатно за 30 секунд. Лендинги от €500, бизнес-сайты от €800. Видите до оплаты."

// /generator
title: "AI Генератор дизайна сайта — бесплатно за 30 секунд | AI Web Studio"
description: "Опишите ваш бизнес и получите живой дизайн сайта за 30 секунд. Бесплатно, без регистрации. Нравится — заказываете разработку от €500."

// /services
title: "Разработка сайтов для бизнеса: лендинги и бизнес-сайты | AI Web Studio"
description: "Лендинги от €500 за 7–10 дней, бизнес-сайты от €800 за 10–14 дней. Кастомная разработка без шаблонов. Видите дизайн до оплаты через AI генератор."

// /pricing
title: "Стоимость разработки сайта: лендинг от €500 | AI Web Studio"
description: "Прозрачные цены: лендинг €500–700 за 7 дней, бизнес-сайт €800–1200 за 14 дней. Фиксированный объём, без скрытых доплат. Оплата 50/50."

// /process
title: "Как проходит разработка сайта — 7 этапов от идеи до запуска | AI Web Studio"
description: "Понятный процесс: генератор показывает дизайн до оплаты → бриф → прототип → разработка → запуск. 7–14 рабочих дней под ключ."

// /about
title: "О студии AI Web Studio — разработка сайтов с AI-ускорением"
description: "AI Web Studio — студия где вы видите дизайн до оплаты. AI ускоряет разработку, человек контролирует качество. Лендинги от €500 под ключ."

// /contacts
title: "Контакты и заявка на разработку сайта | AI Web Studio"
description: "Оставьте заявку на разработку сайта. Ответим в течение нескольких часов. Или попробуйте бесплатный генератор дизайна прямо сейчас."
```

---

## 🔑 Семантическое ядро

### Кластер 1 — Создание/разработка сайтов (основной)
```
создание сайта для бизнеса
разработка сайта под ключ
заказать сайт для малого бизнеса
сделать сайт для компании
создать корпоративный сайт
```

### Кластер 2 — Лендинги
```
заказать лендинг
создать лендинг пейдж
разработка лендинга цена
лендинг для бизнеса
сделать одностраничный сайт
```

### Кластер 3 — AI / уникальность
```
ai генератор сайтов
создать сайт с помощью ии
ai разработка сайтов
генератор дизайна сайта
```

### Кластер 4 — Цена/стоимость
```
сколько стоит сделать сайт
стоимость разработки лендинга
цена создания сайта для бизнеса
разработка сайта от 500 евро
```

### Кластер 5 — Ниши (long-tail — высокая конверсия)
```
сайт для кофейни
сайт для стоматологии
сайт для салона красоты
сайт для юриста
сайт для фитнес-клуба
лендинг для врача
сайт для строительной компании
```

---

## 🏗️ Техническое SEO

### Обязательный чеклист для каждой страницы
```typescript
export const metadata: Metadata = {
  title: "...",           // уникальный, 50-60 символов
  description: "...",    // уникальный, 150-160 символов
  alternates: {
    canonical: "https://your-domain.com/page-slug",  // ВСЕГДА canonical
  },
  openGraph: {
    title: "...",
    description: "...",
    url: "https://your-domain.com/page-slug",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
}
```

### Schema.org разметка

**Главная страница — ProfessionalService:**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AI Web Studio",
  "description": "Разработка сайтов для бизнеса с AI-ускорением",
  "url": "https://your-domain.com",
  "serviceType": "Web Development",
  "priceRange": "€€",
  "areaServed": "Worldwide",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Пакеты разработки",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Лендинг",
        "price": "500",
        "priceCurrency": "EUR",
        "description": "Одностраничный сайт за 7-10 дней"
      },
      {
        "@type": "Offer",
        "name": "Бизнес-сайт",
        "price": "800",
        "priceCurrency": "EUR",
        "description": "Многостраничный сайт за 10-14 дней"
      }
    ]
  }
}
```

**Страница /pricing — ItemList с ценами:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Лендинг €500-700" },
    { "@type": "ListItem", "position": 2, "name": "Бизнес-сайт €800-1200" },
    { "@type": "ListItem", "position": 3, "name": "SEO-запуск €150-250" }
  ]
}
```

**Страница /process — HowTo:**
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Как заказать разработку сайта в AI Web Studio",
  "step": [
    { "@type": "HowToStep", "name": "Генератор", "text": "Опишите бизнес — ИИ создаст дизайн за 30 секунд" },
    { "@type": "HowToStep", "name": "Заявка", "text": "Оставьте заявку если понравился дизайн" },
    { "@type": "HowToStep", "name": "Запуск", "text": "Получите готовый сайт через 7-14 дней" }
  ]
}
```

**Страница /services — FAQ блок:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Сколько стоит разработка лендинга?",
      "acceptedAnswer": { "@type": "Answer", "text": "Лендинг стоит €500-700 и разрабатывается за 7-10 рабочих дней." }
    },
    {
      "@type": "Question",
      "name": "Можно ли увидеть дизайн до оплаты?",
      "acceptedAnswer": { "@type": "Answer", "text": "Да — используйте бесплатный AI генератор дизайна на нашем сайте." }
    }
  ]
}
```

---

## 📝 Контентная SEO-стратегия

### Почему контент критичен для агентства
Агентства по разработке сайтов конкурируют в высококонкурентной нише. Единственный способ получать органический трафик без огромного бюджета — **long-tail keywords + полезный контент**.

### Приоритетные темы для блога (добавить в Фазе 4)

**Tier 1 — Высокий приоритет (коммерческий intent):**
- "Сколько стоит сделать сайт для кофейни в 2025"
- "Лендинг vs корпоративный сайт — что выбрать для малого бизнеса"
- "Как понять нужен ли вашему бизнесу сайт"
- "Чек-лист: как принять сайт у разработчика"

**Tier 2 — Средний приоритет (informational):**
- "Что такое лендинг и зачем он нужен бизнесу"
- "5 ошибок которые убивают конверсию на сайте"
- "Как AI помогает в разработке сайтов"

### Внутренняя перелинковка (обязательно)
```
Главная → /generator (основной CTA)
Главная → /services, /pricing, /process
/services → /pricing (ссылка "посмотреть цены")
/pricing → /services (ссылка "подробнее об услугах")
/process → /generator (ссылка "попробовать генератор")
/about → /services, /process, /pricing (навигационный блок)
/contacts → /generator (альтернативный путь)
```

---

## 🚀 Core Web Vitals — технические требования

### Целевые показатели
- **LCP** (Largest Contentful Paint): < 2.5 сек
- **FID/INP** (Interaction to Next Paint): < 200 мс
- **CLS** (Cumulative Layout Shift): < 0.1

### Что делать в коде

```typescript
// 1. Изображения — ВСЕГДА next/image с приоритетом для above-fold
import Image from 'next/image'
<Image src="/hero.jpg" alt="..." width={1200} height={630} priority />

// 2. Шрифты — preload через next/font (уже настроено в layout.tsx)
// НЕ подключать шрифты через <link> в head вручную

// 3. Server Components для всего что не нужно на клиенте
// Client Components только для интерактива (форма генератора, аккордеон)

// 4. Динамический импорт для тяжёлых компонентов
import dynamic from 'next/dynamic'
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
})
```

---

## 🗺️ Sitemap и robots.txt

### app/sitemap.ts — обновить с актуальными страницами
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://your-domain.com'

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/generator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/process`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contacts`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ]
}
```

### app/robots.ts
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://your-domain.com'
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/thank-you'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

---

## 🔗 Внешнее SEO (Off-page)

### Приоритетные источники ссылок для веб-агентства
1. **Профили на маркетплейсах** — Upwork, Freelancehunt, Kwork (ссылка на сайт в профиле)
2. **Google Business Profile** — создать карточку организации (даёт локальное SEO)
3. **Каталоги агентств** — Clutch, DesignRush, Awwwards (если попадёшь)
4. **Статьи-гостевые посты** — написать статью для тематических блогов
5. **Кейсы клиентов** — когда появятся реальные клиенты, публиковать кейсы и просить backlink с сайта клиента

### Первые шаги (без бюджета)
- [ ] Создать Google Business Profile
- [ ] Зарегистрироваться на Clutch (бесплатно)
- [ ] Добавить сайт в каталог на vc.ru / хабр (если будет блог)
- [ ] Разместить профиль на LinkedIn с ссылкой на сайт

---

## 📊 Аналитика и отслеживание

### Что подключить (приоритет)
1. **Vercel Analytics** — бесплатно, встроено, нулевая настройка
2. **Google Search Console** — обязательно после деплоя, отслеживает позиции
3. **Google Analytics 4** — опционально, для детальной аналитики

### Ключевые метрики для агентства
- Органический трафик на `/generator` (основная цель)
- Конверсия: посетитель → запуск генератора
- Конверсия: генератор → форма заявки
- CTR в поисковой выдаче (Search Console)
- Позиции по ключевым запросам

### Код для Vercel Analytics (добавить в layout.tsx когда будет деплой)
```typescript
import { Analytics } from '@vercel/analytics/react'

// В RootLayout return:
<>
  {children}
  <Analytics />
</>
```

---

## ✅ SEO чеклист перед деплоем

### Технический
- [ ] Все страницы имеют уникальный title (50-60 символов)
- [ ] Все страницы имеют уникальный description (150-160 символов)
- [ ] Canonical URL прописан на каждой странице
- [ ] OG-изображение создано (1200×630px) → `/public/og-image.png`
- [ ] sitemap.xml доступен по `/sitemap.xml`
- [ ] robots.txt настроен
- [ ] Schema.org разметка на главной (ProfessionalService)
- [ ] Schema.org FAQ на страницах с вопросами (/services, /pricing)
- [ ] NEXT_PUBLIC_SITE_URL задан в Vercel env variables
- [ ] Google Search Console подключён после деплоя

### Контентный
- [ ] H1 есть на каждой странице (только один)
- [ ] H2/H3 используются для структуры, содержат ключевые слова
- [ ] Все изображения имеют alt-теги с описанием
- [ ] Внутренние ссылки между страницами настроены
- [ ] Главная ссылается на /generator как основной CTA

### Скорость
- [ ] Lighthouse score > 90 на мобилке
- [ ] Нет неоптимизированных изображений (все через next/image)
- [ ] Нет блокирующих скриптов в <head>
