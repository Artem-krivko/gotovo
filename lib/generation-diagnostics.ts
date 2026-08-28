import type { GenerationFailureReason } from "./types.ts"

/**
 * Приводит ответы разных AI-провайдеров к небольшому стабильному набору
 * причин. Текст ответа используется только для распознавания типичных ошибок
 * ключа и никогда не возвращается клиенту: сообщения провайдера могут
 * содержать внутренние сведения о проекте.
 */
export function classifyProviderHttpFailure(
  status: number,
  providerDetail = ""
): GenerationFailureReason {
  if (status === 429) return "ai_quota_exceeded"
  if (status === 408 || status === 504) return "ai_timeout"

  const detail = providerDetail.toLowerCase()
  if (
    status === 401 ||
    status === 403 ||
    /api[_ ]?key|permission denied|unauthenticated|invalid credential/.test(detail)
  ) {
    return "ai_auth_error"
  }

  return "ai_unavailable"
}

export interface GenerationFailureCopy {
  title: string
  description: string
  retryHint: string
}

/** Пользовательский текст без технического жаргона и ложных обещаний. */
export function getGenerationFailureCopy(
  reason: GenerationFailureReason
): GenerationFailureCopy {
  switch (reason) {
    case "ai_not_configured":
      return {
        title: "Генератор временно не настроен.",
        description: "Сервер не получил ключ AI-провайдера. Показан только нейтральный черновик структуры.",
        retryHint: "Повторная попытка не поможет, пока конфигурация не будет восстановлена.",
      }
    case "ai_quota_exceeded":
      return {
        title: "Лимит AI временно исчерпан.",
        description: "Провайдер отклонил запрос из-за ограничения частоты или суточной квоты.",
        retryHint: "Попробуйте позже — показанный черновик не является результатом AI.",
      }
    case "ai_auth_error":
      return {
        title: "AI-провайдер отклонил доступ.",
        description: "Ключ недействителен, ограничен или не имеет доступа к выбранной модели.",
        retryHint: "Показан нейтральный черновик; конфигурацию должен проверить владелец сайта.",
      }
    case "ai_timeout":
      return {
        title: "AI не успел ответить.",
        description: "Запрос превысил безопасное время ожидания, поэтому показан нейтральный черновик.",
        retryHint: "Попробуйте «Ещё раз» через минуту.",
      }
    case "ai_invalid_json":
      return {
        title: "AI вернул неполный результат.",
        description: "Ответ не прошёл проверку структуры и не используется как готовый дизайн.",
        retryHint: "Попробуйте «Ещё раз» — новый ответ может пройти проверку.",
      }
    case "quality_rejected":
      return {
        title: "Результат не прошёл проверку качества.",
        description: "Мы не показываем некорректный дизайн и заменили его нейтральным черновиком.",
        retryHint: "Уточните описание бизнеса или попробуйте «Ещё раз».",
      }
    default:
      return {
        title: "AI сейчас недоступен.",
        description: "Показан нейтральный черновик структуры без выдуманных текстов и цифр.",
        retryHint: "Попробуйте «Ещё раз» через минуту.",
      }
  }
}
