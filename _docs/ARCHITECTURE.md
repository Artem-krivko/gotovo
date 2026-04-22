# ARCHITECTURE.md — Технические решения

---

## Стек

| Слой | Технология | Причина выбора |
|------|-----------|----------------|
| Фреймворк | Next.js 16 (App Router) | SSR, API routes, файловый роутинг |
| Язык | TypeScript | Безопасность типов, автодополнение |
| Стили | Tailwind CSS 4 | Скорость разработки |
| ИИ | Anthropic Claude API (claude-sonnet-4-20250514) | Качество генерации кода/HTML |
| Email | Resend | Бесплатный tier, простая интеграция |
| Деплой | Vercel | Бесплатно для Next.js, автодеплой из GitHub |
| Хранение заявок | JSON файл → Notion API | Без БД на старте |

---

## AI Design Generator — детальная архитектура

### Флоу
```
Клиент заполняет форму
  ↓
POST /api/generate
  ↓
Сборка промпта из параметров пользователя
  ↓
Claude API: claude-sonnet-4-20250514
  ↓
Получение HTML/CSS строки
  ↓
Передача на клиент через streaming (или обычный response)
  ↓
Рендер в <iframe srcDoc={html}>
  ↓
Кнопка "Заказать разработку"
```

### Параметры формы генератора
- `businessType` — тип бизнеса (ресторан, магазин, агентство, портфолио...)
- `businessName` — название (опционально)
- `description` — описание в свободной форме
- `style` — стиль (минимализм, яркий, корпоративный, креативный)
- `colorPreference` — предпочтения по цвету (опционально)
- `language` — язык контента сайта (ru/en/de)
- `pages` — какие страницы нужны (главная, о нас, контакты...)

### Промпт стратегия
Промпт в `lib/prompts.ts` генерирует:
- Полный HTML в одном файле (inline CSS + Tailwind CDN)
- Реалистичный контент (не Lorem Ipsum)
- Адаптивный дизайн
- Современный визуальный стиль

### Ограничения
- Таймаут API route: 30 сек (Vercel hobby limit)
- Стриминг через ReadableStream для UX
- Rate limiting: 10 генераций/час на IP (против злоупотреблений)

---

## Структура папок компонентов

```
components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Nav.tsx
├── sections/              ← секции страниц (крупные блоки)
│   ├── HeroSection.tsx
│   ├── ServicesSection.tsx
│   ├── ProcessSection.tsx
│   └── PricingSection.tsx
├── shared/                ← мелкие переиспользуемые
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── Modal.tsx
└── generator/             ← всё для генератора дизайна
    ├── GeneratorForm.tsx
    ├── GeneratorPreview.tsx
    ├── GeneratorLoading.tsx
    └── RequestModal.tsx
```

---

## API Routes

```
app/api/
├── generate/
│   └── route.ts          ← POST: принимает параметры, возвращает HTML
└── leads/
    └── route.ts          ← POST: сохраняет заявку + отправляет email
```

---

## Переменные окружения (.env.local)

```
ANTHROPIC_API_KEY=          # Claude API ключ
RESEND_API_KEY=             # Email нотификации
LEAD_EMAIL=                 # Куда слать заявки (твой email)
NOTION_TOKEN=               # (Фаза 4) для CRM
NOTION_DATABASE_ID=         # (Фаза 4) ID базы заявок
```
