import { createHmac, timingSafeEqual } from "node:crypto"

export const GENERATION_QUOTA_COOKIE = "gotovo_generation_quota"
export const GENERATION_QUOTA_LIMIT = 2

export interface GenerationQuota {
  date: string
  count: number
}

function secret(): string {
  return (
    process.env.GENERATION_LIMIT_SECRET?.trim() ||
    process.env.TELEGRAM_BOT_TOKEN?.trim() ||
    process.env.RESEND_API_KEY?.trim() ||
    "gotovo-generation-quota-dev"
  )
}

/** Календарная дата по Минску, независимо от timezone Vercel-инстанса. */
export function calendarDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Minsk",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

function signature(payload: string, signingSecret: string): string {
  return createHmac("sha256", signingSecret).update(payload).digest("hex")
}

function validSignature(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual, "hex")
  const expectedBuffer = Buffer.from(expected, "hex")
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

export function readGenerationQuota(
  raw: string | undefined,
  sessionId: string,
  now = new Date(),
  signingSecret = secret(),
): GenerationQuota {
  const date = calendarDate(now)
  if (!raw) return { date, count: 0 }

  const [savedDate, savedCount, savedSignature] = raw.split(".")
  const count = Number(savedCount)
  if (
    savedDate !== date ||
    !/^\d{4}-\d{2}-\d{2}$/.test(savedDate) ||
    !Number.isInteger(count) ||
    count < 0 ||
    count > GENERATION_QUOTA_LIMIT ||
    !savedSignature
  ) {
    return { date, count: 0 }
  }

  const payload = `${sessionId}.${savedDate}.${count}`
  return validSignature(savedSignature, signature(payload, signingSecret))
    ? { date, count }
    : { date, count: 0 }
}

export function writeGenerationQuota(
  quota: GenerationQuota,
  sessionId: string,
  signingSecret = secret(),
): string {
  const count = Math.min(GENERATION_QUOTA_LIMIT, Math.max(0, Math.floor(quota.count)))
  const payload = `${sessionId}.${quota.date}.${count}`
  return `${quota.date}.${count}.${signature(payload, signingSecret)}`
}
