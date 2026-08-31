import assert from "node:assert/strict"
import test from "node:test"
import {
  GENERATION_QUOTA_LIMIT,
  calendarDate,
  readGenerationQuota,
  writeGenerationQuota,
} from "../generation-quota.ts"

const secret = "test-secret"
const sessionId = "session-123"

test("считает календарную дату по Минску", () => {
  assert.equal(calendarDate(new Date("2026-08-31T21:30:00.000Z")), "2026-09-01")
})

test("подписанная квота читается только для своей сессии и даты", () => {
  const now = new Date("2026-08-31T10:00:00.000Z")
  const cookie = writeGenerationQuota({ date: "2026-08-31", count: 1 }, sessionId, secret)

  assert.deepEqual(readGenerationQuota(cookie, sessionId, now, secret), { date: "2026-08-31", count: 1 })
  assert.deepEqual(readGenerationQuota(cookie, "other-session", now, secret), { date: "2026-08-31", count: 0 })
  assert.deepEqual(readGenerationQuota(cookie, sessionId, new Date("2026-09-01T00:00:00.000Z"), secret), { date: "2026-09-01", count: 0 })
})

test("квота ограничена двумя генерациями", () => {
  const cookie = writeGenerationQuota({ date: "2026-08-31", count: GENERATION_QUOTA_LIMIT + 4 }, sessionId, secret)
  assert.deepEqual(
    readGenerationQuota(cookie, sessionId, new Date("2026-08-31T10:00:00.000Z"), secret),
    { date: "2026-08-31", count: GENERATION_QUOTA_LIMIT },
  )
})
