import { describe, test } from "node:test"
import assert from "node:assert/strict"

import { readApiResponse } from "../api-response.ts"

describe("readApiResponse", () => {
  test("читает обычный JSON", async () => {
    const result = await readApiResponse<{ html: string }>(
      new Response(JSON.stringify({ html: "<main>ok</main>" }), { status: 200 }),
      "Ошибка"
    )
    assert.equal(result.html, "<main>ok</main>")
  })

  test("превращает пустой timeout-ответ в понятную ошибку", async () => {
    const result = await readApiResponse(
      new Response(null, { status: 504 }),
      "Ошибка генерации"
    )
    assert.match(result.error ?? "", /не успел завершить генерацию/i)
  })

  test("не показывает пользователю ошибку парсинга HTML-страницы", async () => {
    const result = await readApiResponse(
      new Response("<html>Bad gateway</html>", { status: 502 }),
      "Ошибка генерации"
    )
    assert.equal(result.error, "Сервис временно недоступен. Попробуйте ещё раз.")
  })
})
