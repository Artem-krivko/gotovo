const API_BASE = "https://api.direct.yandex.com/json/v5"
const READ_ONLY_METHODS = new Set(["get"])

function requiredEnvironment(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Не заполнена переменная ${name}`)
  return value
}

export function loadYandexConfig() {
  if (process.env.ADS_API_MODE !== "read_only") {
    throw new Error("ADS_API_MODE должен оставаться read_only")
  }
  if (process.env.ADS_ALLOW_ACCOUNT_WRITES !== "false") {
    throw new Error("ADS_ALLOW_ACCOUNT_WRITES должен оставаться false")
  }
  if (process.env.ADS_ALLOW_SPEND !== "false") {
    throw new Error("ADS_ALLOW_SPEND должен оставаться false")
  }

  return {
    token: requiredEnvironment("YANDEX_DIRECT_TOKEN"),
    login: requiredEnvironment("YANDEX_LOGIN"),
  }
}

export async function callYandexReadOnly(config, service, method, params) {
  if (!READ_ONLY_METHODS.has(method.toLowerCase())) {
    throw new Error(`Метод ${method} запрещён в read-only клиенте`)
  }

  const response = await fetch(`${API_BASE}/${service}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Client-Login": config.login,
      "Accept-Language": "ru",
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ method, params }),
    signal: AbortSignal.timeout(15_000),
  })

  const body = await response.json()
  if (!response.ok || body.error) {
    const code = body.error?.error_code ?? response.status
    const message = body.error?.error_string ?? "Ошибка HTTP"
    const detail = body.error?.error_detail ?? response.statusText
    throw new Error(`Yandex Direct API ${code}: ${message} — ${detail}`)
  }

  return body.result
}
