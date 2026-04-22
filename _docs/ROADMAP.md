# ROADMAP.md — Дорожная карта проекта

> Статусы: ⬜ не начато | 🔄 в процессе | ✅ готово | ⏸️ на паузе

---

## ФАЗА 1 — Фундамент ✅ ЗАВЕРШЕНА

- ✅ Все страницы (главная, services, process, pricing, about, contacts)
- ✅ Тёмная тема gotovo — bg-[#0A0A0F], шрифт Sora, дизайн-система
- ✅ Мобильный UX: snap-scroll, аккордеоны, горизонтальные метрики
- ✅ API route /api/lead + Resend — письма приходят ✓
- ✅ content/ файлы для всех страниц
- ✅ SEO: метаданные, Schema.org, sitemap, robots
- ✅ Hero: 3D мокап + реальное видео roomforia.ru + CSS анимация
- ✅ Блок примеров: SVG-превью стоматология / тату-салон / спортзал

---

## ФАЗА 2 — AI Design Generator ⏸️ ЖДЁТ API КЛЮЧ

- ✅ lib/types.ts, lib/prompts.ts — промпты готовы
- ✅ app/api/generate/route.ts — Claude API + HTML заглушка без ключа
- ✅ components/generator/ — форма, превью, модал заявки
- ✅ app/generator/page.tsx — split-layout, работает с заглушкой
- ✅ app/thank-you/page.tsx

- ⏸️ ANTHROPIC_API_KEY — ждём оплату (найти кто платит из ЕС/РФ)
- ⬜ После ключа: протестировать генерацию, поправить промпт если нужно
- ⬜ Сделать 3 реальных скриншота → заменить SVG-примеры на главной

---

## ФАЗА 3 — Деплой ← СЛЕДУЮЩАЯ

### Перед деплоем (сделать один раз)
- ⬜ Создать OG-изображение 1200×630px → /public/og-image.png
- ⬜ Обновить реальные контакты в content/contacts.ts (Telegram, email)
- ⬜ Проверить на реальном мобильном устройстве (iPhone/Android)
- ⬜ npm run build — убедиться что нет ошибок сборки

### GitHub + Vercel
- ⬜ git init + git add + git commit
- ⬜ Создать репозиторий на github.com
- ⬜ git remote add origin + git push
- ⬜ Подключить репо к Vercel (vercel.com → New Project)
- ⬜ Добавить env variables в Vercel:
    RESEND_API_KEY=...
    LEAD_NOTIFICATION_EMAIL=krivko219319@gmail.com
    NEXT_PUBLIC_SITE_URL=https://gotovo.studio
    ANTHROPIC_API_KEY=... (добавить когда получим)
- ⬜ Первый деплой → проверить что всё работает

### После деплоя
- ⬜ Подключить домен gotovo.studio (если есть) в Vercel
- ⬜ Google Search Console → добавить сайт → подтвердить
- ⬜ Vercel Analytics → добавить в layout.tsx
- ⬜ Проверить форму заявки на проде (реальное письмо)

---

## ФАЗА 4 — После запуска генератора
- ⬜ Rate limiting (10 генераций/час на IP)
- ⬜ Страница /privacy
- ⬜ Кнопка Regenerate в генераторе
- ⬜ Загрузка референс-скриншота клиентом
- ⬜ Notion API CRM для заявок

---

## 📝 Лог

| Дата | Задача |
|------|--------|
| 2026-04-19 | Инициализация, документация, скиллы |
| 2026-04-20 | Рефакторинг главной страницы |
| 2026-04-21 | Все страницы переработаны, форма Resend |
| 2026-04-21 | AI Design Generator MVP |
| 2026-04-22 | Полный ребрендинг на gotovo, тёмная тема |
| 2026-04-22 | Hero: 3D мокап + видео + SVG примеры |
| 2026-04-23 | SEO скилл, Schema.org, sitemap |
