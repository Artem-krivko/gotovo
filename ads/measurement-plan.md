# План измерения до платного трафика

## Основные конверсии

Яндекс Метрика/Директ:

- `yd_lead_submitted` — прямая форма успешно принята сервером.
- `yd_generator_lead_submitted` — заявка из результата AI-генератора успешно
  принята сервером.

Google Analytics/Google Ads:

- `ga_lead_submitted` — прямая форма успешно принята сервером.
- `ga_generator_lead_submitted` — заявка из результата AI-генератора успешно
  принята сервером.

## Вторичные действия

Яндекс:

- `yd_phone_clicked`;
- `yd_email_clicked`;
- `yd_telegram_clicked`;
- `yd_generator_started`;
- `yd_generation_succeeded`.

Google:

- `ga_phone_clicked`;
- `ga_email_clicked`;
- `ga_telegram_clicked`;
- `ga_generator_started`;
- `ga_generation_succeeded`.

Вторичные действия не оптимизируют первую поисковую кампанию как равнозначные
заявке.

## Атрибуция

Для каждой заявки сохраняются отдельно:

- first-touch и last-touch;
- landing path и referrer;
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`;
- `yclid` и `gclid`;
- время первого и последнего визита;
- уникальный ID заявки и её квалификационный статус.

Яндекс оценивается через Метрику и цели Директа. Google оценивается через GA4 и
Google Ads. Сводный бизнес-отчёт допустим, но платформенная атрибуция и
оптимизация не смешиваются.
