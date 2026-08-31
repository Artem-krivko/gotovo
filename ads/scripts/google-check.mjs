import {
  listAccessibleCustomers,
  loadGoogleConfig,
  refreshGoogleAccessToken,
} from "./lib/google-ads.mjs"

async function main() {
  const config = loadGoogleConfig()
  const accessToken = await refreshGoogleAccessToken(config)
  const customers = await listAccessibleCustomers(config, accessToken)

  console.log(`OAuth Google подтверждён. Доступно аккаунтов: ${customers.length}.`)
  console.log(`Целевой аккаунт: ${config.customerId}; управляющий: ${config.loginCustomerId}.`)
  console.log("Проверка выполнена только методом listAccessibleCustomers; изменений нет.")
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Неизвестная ошибка API")
  process.exitCode = 1
})
