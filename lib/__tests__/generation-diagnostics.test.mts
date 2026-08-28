import { describe, test } from "node:test"
import assert from "node:assert/strict"

import {
  classifyProviderHttpFailure,
  getGenerationFailureCopy,
} from "../generation-diagnostics.ts"

describe("диагностика AI-провайдера", () => {
  test("отличает квоту, таймаут и ошибку ключа", () => {
    assert.equal(classifyProviderHttpFailure(429), "ai_quota_exceeded")
    assert.equal(classifyProviderHttpFailure(504), "ai_timeout")
    assert.equal(classifyProviderHttpFailure(403), "ai_auth_error")
    assert.equal(
      classifyProviderHttpFailure(400, "API key not valid. Please pass a valid API key."),
      "ai_auth_error"
    )
    assert.equal(classifyProviderHttpFailure(500), "ai_unavailable")
  })

  test("не советует повторять запрос при отсутствующей конфигурации", () => {
    const copy = getGenerationFailureCopy("ai_not_configured")
    assert.match(copy.title, /не настроен/i)
    assert.match(copy.retryHint, /не поможет/i)
  })
})
