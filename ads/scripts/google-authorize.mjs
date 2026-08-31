import { createServer } from "node:http"
import { randomBytes } from "node:crypto"
import { readFile, writeFile, chmod } from "node:fs/promises"

const ENV_PATH = new URL("../.env.local", import.meta.url)
const REDIRECT_URI = "http://127.0.0.1:53682"
const SCOPE = "https://www.googleapis.com/auth/adwords"

function requiredEnvironment(name) {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Не заполнена переменная ${name}`)
  return value
}

async function saveRefreshToken(refreshToken) {
  const current = await readFile(ENV_PATH, "utf8")
  const updated = current.replace(
    /^GOOGLE_ADS_REFRESH_TOKEN=.*$/m,
    `GOOGLE_ADS_REFRESH_TOKEN=${refreshToken}`
  )
  await writeFile(ENV_PATH, updated, { encoding: "utf8", mode: 0o600 })
  await chmod(ENV_PATH, 0o600)
}

async function main() {
  const clientId = requiredEnvironment("GOOGLE_ADS_CLIENT_ID")
  const clientSecret = requiredEnvironment("GOOGLE_ADS_CLIENT_SECRET")
  const state = randomBytes(24).toString("hex")

  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  authorizationUrl.searchParams.set("client_id", clientId)
  authorizationUrl.searchParams.set("redirect_uri", REDIRECT_URI)
  authorizationUrl.searchParams.set("response_type", "code")
  authorizationUrl.searchParams.set("scope", SCOPE)
  authorizationUrl.searchParams.set("access_type", "offline")
  authorizationUrl.searchParams.set("prompt", "consent")
  authorizationUrl.searchParams.set("state", state)

  const server = createServer(async (request, response) => {
    try {
      const callbackUrl = new URL(request.url ?? "/", REDIRECT_URI)
      if (callbackUrl.searchParams.get("state") !== state) {
        response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" })
        response.end("Некорректный OAuth state.")
        return
      }

      const code = callbackUrl.searchParams.get("code")
      if (!code) throw new Error(callbackUrl.searchParams.get("error") ?? "OAuth code не получен")

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }),
        signal: AbortSignal.timeout(15_000),
      })
      const tokenBody = await tokenResponse.json()
      if (!tokenResponse.ok || !tokenBody.refresh_token) {
        throw new Error(tokenBody.error_description ?? tokenBody.error ?? "Refresh token не получен")
      }

      await saveRefreshToken(tokenBody.refresh_token)
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      response.end("<h1>Google Ads API подключён</h1><p>Refresh token сохранён локально. Эту вкладку можно закрыть.</p>")
      console.log("Refresh token получен и сохранён в ads/.env.local.")
      server.close()
    } catch (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
      response.end("Не удалось завершить OAuth.")
      console.error(error instanceof Error ? error.message : "Неизвестная ошибка OAuth")
      server.close()
      process.exitCode = 1
    }
  })

  server.listen(53682, "127.0.0.1", () => {
    console.log("Откройте URL и подтвердите доступ Google Ads:")
    console.log(authorizationUrl.toString())
  })
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Неизвестная ошибка OAuth")
  process.exitCode = 1
})
