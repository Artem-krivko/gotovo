import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

function buildEmail({ name, phone, email, comment, design, orderId }: {
  name: string; phone: string; email: string; comment?: string
  design: { businessType: string; prompt: string; style: string; language: string; id: string }
  orderId: string
}) {
  const designUrl = `${SITE_URL}/api/design/${design.id}`
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">

    <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:28px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">🎯 Новая заявка на разработку</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:14px">${design.businessType} · ${design.style} · ${design.language}</p>
    </div>

    <div style="padding:28px 32px">
      <h2 style="margin:0 0 16px;font-size:16px;color:#18181b">Контакты клиента</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#71717a;font-size:14px;width:110px">Имя</td><td style="padding:8px 0;color:#18181b;font-size:14px;font-weight:600">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a;font-size:14px">Телефон</td><td style="padding:8px 0;color:#18181b;font-size:14px;font-weight:600">${phone}</td></tr>
        <tr><td style="padding:8px 0;color:#71717a;font-size:14px">Email</td><td style="padding:8px 0;color:#18181b;font-size:14px;font-weight:600">${email}</td></tr>
        ${comment ? `<tr><td style="padding:8px 0;color:#71717a;font-size:14px;vertical-align:top">Комментарий</td><td style="padding:8px 0;color:#18181b;font-size:14px">${comment}</td></tr>` : ""}
      </table>

      <hr style="border:none;border-top:1px solid #f4f4f5;margin:20px 0">

      <h2 style="margin:0 0 8px;font-size:16px;color:#18181b">О бизнесе</h2>
      <p style="margin:0 0 4px;color:#71717a;font-size:14px">${design.prompt}</p>

      <div style="margin-top:24px;text-align:center">
        <a href="${designUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700">
          👁 Посмотреть сгенерированный дизайн
        </a>
      </div>
    </div>

    <div style="padding:16px 32px;background:#fafafa;border-top:1px solid #f4f4f5">
      <p style="margin:0;color:#a1a1aa;font-size:12px">ID заявки: ${orderId}</p>
    </div>

  </div>
</body>
</html>`
}

interface SubmitOrderRequest {
  designId: string
  name: string
  phone: string
  email: string
  comment?: string
}

function validate(body: unknown): body is SubmitOrderRequest {
  if (!body || typeof body !== "object") return false
  const b = body as Record<string, unknown>
  return (
    typeof b.designId === "string" && b.designId.length > 0 &&
    typeof b.name === "string" && b.name.trim().length > 0 &&
    typeof b.phone === "string" && b.phone.trim().length > 0 &&
    typeof b.email === "string" && b.email.includes("@")
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown

    if (!validate(body)) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      )
    }

    const { designId, name, phone, email, comment } = body as SubmitOrderRequest

    // Проверяем что дизайн существует
    const design = await db.design.findUnique({ where: { id: designId } })
    if (!design) {
      return NextResponse.json(
        { error: "Дизайн не найден" },
        { status: 404 }
      )
    }

    // Сохраняем заявку
    const order = await db.order.create({
      data: { designId, name: name.trim(), phone: phone.trim(), email: email.trim(), comment: comment?.trim() },
    })

    // Отправляем email если настроен Resend
    const resendKey = process.env.RESEND_API_KEY
    const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL
    if (resendKey && notifyEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: "gotovo <noreply@usegotovo.by>",
          to: [notifyEmail],
          subject: `🎯 Новая заявка от ${name} — ${design.businessType}`,
          html: buildEmail({ name, phone, email, comment, design, orderId: order.id }),
        }),
      })
    }

    return NextResponse.json({ success: true, orderId: order.id })

  } catch (error) {
    console.error("[POST /api/submit-order]", error)
    return NextResponse.json({ error: "Внутренняя ошибка. Попробуйте ещё раз." }, { status: 500 })
  }
}
