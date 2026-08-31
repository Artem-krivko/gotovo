# Доступы к рекламным API

## Правила безопасности

- Все секреты находятся только в `ads/.env.local`.
- Файл исключён из Git корневым и локальным `.gitignore`.
- Значения токенов не копируются в Markdown, логи, issue или сообщения.
- Для gotovo создаются отдельные OAuth-приложения. Доступы проекта
  `abiturients-belarus` не переиспользуются.
- Первый технический тест API выполняется только операциями чтения.
- Создание, изменение, включение кампаний и работа с оплатой требуют отдельного
  подтверждения.

## Яндекс Директ

Понадобятся:

1. Яндекс-аккаунт, которому принадлежит рекламный кабинет gotovo.
2. OAuth-приложение с доступом к API Яндекс Директа.
3. Одобрение доступа приложения к API Директа, если его запросит Яндекс.
4. OAuth access token.
5. Логин рекламодателя и валюта кабинета.

Переменные: `YANDEX_CLIENT_ID`, `YANDEX_CLIENT_SECRET`,
`YANDEX_DIRECT_TOKEN`, `YANDEX_LOGIN`, `YANDEX_METRIKA_COUNTER_ID`.

Статус на 31 августа 2026 года: найдено существующее подключённое приложение
`gotovo-direct-api` с единственным дополнительным правом `direct:api`. OAuth
реквизиты сохранены локально. Проверка кабинета выполняется командой
`npm run ads:yandex:check`; клиент допускает только метод `get`.

## Google Ads

Понадобятся:

1. Google Ads customer ID.
2. Google Cloud project и OAuth consent screen.
3. OAuth client типа Desktop app или Web application — тип фиксируется перед
   реализацией потока авторизации.
4. Google Ads API developer token. До одобрения он может иметь тестовый уровень
   доступа.
5. OAuth refresh token пользователя с доступом к рекламному аккаунту.
6. При использовании manager account — его `login_customer_id`.

Переменные: `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`,
`GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`,
`GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_LOGIN_CUSTOMER_ID`.

Статус на 31 августа 2026 года: используется Cloud-проект `gotovo-seo`,
Google Ads API включён, OAuth-клиент `gotovo-ads` имеет тип Desktop. Управляющий
аккаунт — `570-737-3950`, клиент `usegotovo.by` — `211-905-4297`. Developer
token создан, но пока имеет тестовый уровень доступа; для реального клиента
нужен базовый уровень. Локальный REST-клиент использует актуальную версию v25
и допускает только операции чтения. OAuth refresh token получен с единственным
scope `https://www.googleapis.com/auth/adwords`; проверка
`listAccessibleCustomers` успешно увидела шесть доступных аккаунтов. Заявка
Basic Access отправлена 31 августа 2026 года и принята Google; стандартный
первичный review обычно занимает до пяти рабочих дней.

Google Ads и GA4 остаются отдельным контуром от Яндекс Директа и Метрики.
