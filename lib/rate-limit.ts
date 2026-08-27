// lib/rate-limit.ts — простой ограничитель частоты запросов.
//
// ВАЖНО ПРО ОГРАНИЧЕНИЯ: счётчики живут в памяти процесса. На Vercel это
// значит «per-instance»: при нескольких инстансах реальный лимит кратно выше
// заявленного, а при холодном старте счётчики обнуляются.
//
// Этого достаточно, чтобы один клиент случайно или намеренно не сжёг квоту
// Gemini кнопкой «Ещё раз». Для защиты от распределённого абьюза нужен общий
// стор (Upstash Redis / Vercel KV) — см. TODO в _docs/DECISIONS.md.

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

// Чтобы Map не рос бесконечно на долгоживущем инстансе.
const MAX_BUCKETS = 10_000

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export interface RateLimitResult {
  ok: boolean
  /** Сколько запросов ещё доступно в текущем окне. */
  remaining: number
  /** Через сколько секунд окно сбросится (для заголовка Retry-After). */
  retryAfterSeconds: number
}

/**
 * Скользящее окно фиксированного размера.
 *
 * @param key       идентификатор клиента (обычно IP + имя маршрута)
 * @param limit     сколько запросов разрешено в окне
 * @param windowMs  длина окна в миллисекундах
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()

  if (buckets.size > MAX_BUCKETS) sweep(now)

  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterSeconds: Math.ceil(windowMs / 1000) }
  }

  existing.count += 1
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))

  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfterSeconds }
  }

  return { ok: true, remaining: limit - existing.count, retryAfterSeconds }
}

/**
 * IP клиента. За прокси Vercel заголовок x-forwarded-for содержит цепочку —
 * берём первый адрес, он и есть исходный клиент.
 */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown"
}

/** Только для тестов: сбрасывает состояние между кейсами. */
export function __resetRateLimit() {
  buckets.clear()
}
