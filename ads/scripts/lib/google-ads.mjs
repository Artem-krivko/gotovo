const API_VERSION = "v25"
const API_BASE = `https://googleads.googleapis.com/${API_VERSION}`

function requiredEnvironment(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Не заполнена переменная ${name}`)
  return value
}

export function loadGoogleConfig() {
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
    clientId: requiredEnvironment("GOOGLE_ADS_CLIENT_ID"),
    clientSecret: requiredEnvironment("GOOGLE_ADS_CLIENT_SECRET"),
    refreshToken: requiredEnvironment("GOOGLE_ADS_REFRESH_TOKEN"),
    developerToken: requiredEnvironment("GOOGLE_ADS_DEVELOPER_TOKEN"),
    customerId: requiredEnvironment("GOOGLE_ADS_CUSTOMER_ID"),
    loginCustomerId: requiredEnvironment("GOOGLE_ADS_LOGIN_CUSTOMER_ID"),
  }
}

export async function refreshGoogleAccessToken(config) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(15_000),
  })
  const body = await response.json()
  if (!response.ok || !body.access_token) {
    throw new Error(body.error_description ?? body.error ?? "Access token не получен")
  }
  return body.access_token
}

export async function listAccessibleCustomers(config, accessToken) {
  const response = await fetch(`${API_BASE}/customers:listAccessibleCustomers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": config.developerToken,
      "login-customer-id": config.loginCustomerId,
    },
    signal: AbortSignal.timeout(15_000),
  })
  const body = await response.json()
  if (!response.ok) {
    const message = body.error?.message ?? response.statusText
    throw new Error(`Google Ads API ${response.status}: ${message}`)
  }
  return Array.isArray(body.resourceNames) ? body.resourceNames : []
}
