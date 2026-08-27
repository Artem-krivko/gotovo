import { escapeTelegram } from "@/lib/html"

export interface TelegramResult {
  ok: boolean
  /** "not_configured" — токен/чат не заданы; это не сбой доставки. */
  reason?: "not_configured" | "http_error" | "network_error"
}

/**
 * Отправка уведомления о заявке.
 *
 * Возвращает результат, а не void: раньше функция глотала любую ошибку через
 * .catch(console.error), и вызывающий код не мог отличить доставленное
 * уведомление от потерянного — а именно на этом строился ответ «успешно»,
 * который видел пользователь.
 *
 * Текст собирайте через tgField/tgText: parse_mode=HTML ломается на
 * неэкранированных < и & из пользовательских полей, Telegram отвечает 400,
 * и уведомление не доходит.
 */
export async function sendTelegram(text: string): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return { ok: false, reason: "not_configured" }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      console.error("[telegram] http_error", { status: res.status, detail: detail.slice(0, 300) })
      return { ok: false, reason: "http_error" }
    }

    return { ok: true }
  } catch (error) {
    console.error("[telegram] network_error", { error: String(error) })
    return { ok: false, reason: "network_error" }
  }
}

/** Экранированное значение поля заявки. */
export function tgText(value: unknown): string {
  return escapeTelegram(value)
}

/** Подпись поля + экранированное значение. */
export function tgField(label: string, value: unknown): string {
  return `<b>${escapeTelegram(label)}:</b> ${escapeTelegram(value)}`
}
