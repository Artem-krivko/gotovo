import { callYandexReadOnly, loadYandexConfig } from "./lib/yandex-direct.mjs"

async function main() {
  const config = loadYandexConfig()
  const result = await callYandexReadOnly(config, "campaigns", "get", {
    SelectionCriteria: {},
    FieldNames: ["Id", "Name", "Status", "State"],
  })

  const campaigns = Array.isArray(result?.Campaigns) ? result.Campaigns : []
  console.log(`Доступ к Яндекс Директу подтверждён для логина ${config.login}.`)
  console.log(`Кампаний доступно: ${campaigns.length}.`)
  console.log("Проверка выполнена только методом campaigns.get; изменений нет.")
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Неизвестная ошибка API")
  process.exitCode = 1
})
