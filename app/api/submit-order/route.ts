import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendTelegram, tgField } from "@/lib/telegram"
import { escapeHtml, isValidEmail, isValidPhone } from "@/lib/html"
import { sanitizeUserText } from "@/lib/validation"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { normalizeAttribution } from "@/lib/attribution"
import type { AttributionData } from "@/lib/attribution"
import { SITE_URL } from "@/lib/site"

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }

const LIMITS = { name: 80, phone: 32, email: 120, comment: 2000 } as const

const CUID_RE = /^c[a-z0-9]{20,32}$/i

interface OrderFields {
  designId: string
  name: string
  phone: string
  email: string
  comment: string
  attribution: AttributionData
}

// ─── Валидация ───────────────────────────────────────────────────────────────

function parseOrder(body: unknown): { ok: true; value: OrderFields } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Некорректный запрос" }
  }
  const b = body as Record<string, unknown>

  const designId = sanitizeUserText(b.designId, 40)
  if (!CUID_RE.test(designId)) {
    return { ok: false, error: "Дизайн не найден" }
  }

  const phone = sanitizeUserText(b.phone, LIMITS.phone)
  if (!phone) {
    return { ok: false, error: "Укажите телефон" }
  }
  if (!isValidPhone(phone)) {
    return { ok: false, error: "Проверьте номер телефона" }
  }

  const email = sanitizeUserText(b.email, LIMITS.email)
  if (email && !isValidEmail(email)) {
    return { ok: false, error: "Проверьте email" }
  }

  return {
    ok: true,
    value: {
      designId,
      phone,
      email,
      name: sanitizeUserText(b.name, LIMITS.name),
      comment: sanitizeUserText(b.comment, LIMITS.comment),
      attribution: normalizeAttribution(b.attribution),
    },
  }
}

// ─── Письмо ──────────────────────────────────────────────────────────────────

function buildEmail({
  order,
  design,
  orderId,
}: {
  order: OrderFields
  design: { businessType: string; prompt: string; style: string; language: string; id: string }
  orderId: string
}) {
  // Все динамические значения экранируются: и поля клиента, и businessType
  // с prompt — они пришли из открытой формы генератора.
  const designUrl = `${SITE_URL}/api/design/${encodeURIComponent(design.id)}`
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 0;color:#71717a;font-size:14px;width:110px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;color:#18181b;font-size:14px;font-weight:600">${escapeHtml(value)}</td></tr>`

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">

    <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:28px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">Новая заявка на разработку</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:14px">${escapeHtml(design.businessType)} · ${escapeHtml(design.style)} · ${escapeHtml(design.language)}</p>
    </div>

    <div style="padding:28px 32px">
      <h2 style="margin:0 0 16px;font-size:16px;color:#18181b">Контакты клиента</h2>
      <table style="width:100%;border-collapse:collapse">
        ${row("Телефон", order.phone)}
        ${order.name ? row("Имя", order.name) : ""}
        ${order.email ? row("Email", order.email) : ""}
        ${order.comment ? row("Комментарий", order.comment) : ""}
        ${Object.keys(order.attribution).length ? row("Атрибуция", JSON.stringify(order.attribution)) : ""}
      </table>

      <hr style="border:none;border-top:1px solid #f4f4f5;margin:20px 0">

      <h2 style="margin:0 0 8px;font-size:16px;color:#18181b">О бизнесе</h2>
      <p style="margin:0 0 4px;color:#71717a;font-size:14px">${escapeHtml(design.prompt)}</p>

      <div style="margin-top:24px;text-align:center">
        <a href="${escapeHtml(designUrl)}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700">
          Посмотреть сгенерированный концепт
        </a>
      </div>
    </div>

    <div style="padding:16px 32px;background:#fafafa;border-top:1px solid #f4f4f5">
      <p style="margin:0;color:#a1a1aa;font-size:12px">ID заявки: ${escapeHtml(orderId)}</p>
    </div>

  </div>
</body>
</html>`
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = clientIp(req)

  const limit = rateLimit(`order:${ip}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Слишком много заявок подряд. Попробуйте через несколько минут." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 })
  }

  const parsed = parseOrder(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }
  const order = parsed.value

  let design: {
    id: string
    businessType: string
    prompt: string
    style: string
    language: string
  } | null = null
  let orderId: string | null = null

  try {
    design = await db.design.findUnique({
      where: { id: order.designId },
      select: { id: true, businessType: true, prompt: true, style: true, language: true },
    })
    if (!design) {
      return NextResponse.json({ error: "Дизайн не найден" }, { status: 404 })
    }

    const created = await db.order.create({
      data: {
        designId: order.designId,
        name: order.name,
        phone: order.phone,
        email: order.email,
        comment: order.comment || null,
        attributionJson: Object.keys(order.attribution).length ? JSON.stringify(order.attribution) : null,
      },
      select: { id: true },
    })
    orderId = created.id
  } catch (error) {
    // БД недоступна — но заявка важнее записи. Продолжаем и пытаемся
    // доставить её уведомлением, иначе горячий лид просто потеряется.
    console.error("[order] db_failed", { designId: order.designId, error: String(error) })
  }

  const resendKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL
  const designUrl = design ? `${SITE_URL}/api/design/${encodeURIComponent(design.id)}` : ""

  const telegramText = [
    "🎯 <b>Новая заявка на разработку</b>",
    "",
    orderId ? tgField("ID заявки", orderId) : "",
    tgField("Телефон", order.phone),
    order.name ? tgField("Имя", order.name) : "",
    order.email ? tgField("Email", order.email) : "",
    design ? tgField("Бизнес", design.businessType) : "",
    design ? tgField("Стиль", design.style) : "",
    design ? tgField("Описание", design.prompt) : "",
    order.comment ? tgField("Комментарий", order.comment) : "",
    Object.keys(order.attribution).length ? tgField("Источник", JSON.stringify(order.attribution)) : "",
    designUrl ? `\n<a href="${designUrl}">Открыть сгенерированный дизайн</a>` : "",
    orderId ? "" : "\n⚠️ Заявку не удалось записать в БД — сохраните контакт вручную.",
  ]
    .filter(Boolean)
    .join("\n")

  const canEmail = Boolean(resendKey && notifyEmail && design && orderId)

  const [emailResult, telegramResult] = await Promise.allSettled([
    canEmail
      ? fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
          body: JSON.stringify({
            from: "gotovo <noreply@usegotovo.by>",
            to: [notifyEmail],
            reply_to: order.email || undefined,
            subject: `Новая заявка от ${order.name || order.phone} — ${design!.businessType}`,
            html: buildEmail({ order, design: design!, orderId: orderId! }),
          }),
          signal: AbortSignal.timeout(10_000),
        })
      : Promise.reject(new Error("email_not_configured")),
    sendTelegram(telegramText),
  ])

  // Прежняя версия делала fetch к Resend и игнорировала ответ полностью:
  // ошибка 4xx/5xx выглядела так же, как успешная отправка.
  const emailOk = emailResult.status === "fulfilled" && emailResult.value.ok
  const telegramOk = telegramResult.status === "fulfilled" && telegramResult.value.ok

  if (!emailOk) {
    console.error("[order] email_failed", {
      reason:
        emailResult.status === "rejected"
          ? String(emailResult.reason)
          : `http_${emailResult.value.status}`,
    })
  }
  if (!telegramOk) {
    console.error("[order] telegram_failed", {
      reason:
        telegramResult.status === "rejected"
          ? String(telegramResult.reason)
          : telegramResult.value.reason,
    })
  }

  // Заявка считается принятой, если она либо записана в БД, либо доставлена
  // хотя бы одним каналом. Иначе — честная ошибка вместо ложного «успешно».
  const delivered = emailOk || telegramOk
  if (!delivered && !orderId) {
    console.error("[order] lost", {
      phone: order.phone,
      name: order.name,
      email: order.email,
      comment: order.comment,
    })

    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ success: true, delivery: "logged_only" })
    }

    return NextResponse.json(
      { error: "Не удалось отправить заявку. Напишите нам в Telegram — ответим сразу." },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true, orderId })
}
