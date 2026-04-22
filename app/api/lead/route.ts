import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ─── Типы ────────────────────────────────────────────────────────────────────

interface LeadRequestBody {
  name: string;
  contact: string;
  message: string;
}

// ─── Валидация ───────────────────────────────────────────────────────────────

function validateLeadBody(body: unknown): body is LeadRequestBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" && b.name.trim().length > 0 &&
    typeof b.contact === "string" && b.contact.trim().length > 0 &&
    typeof b.message === "string" && b.message.trim().length > 0
  );
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;

    if (!validateLeadBody(body)) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    const { name, contact, message } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.LEAD_NOTIFICATION_EMAIL;

    // Если ключи не настроены — логируем и возвращаем успех (dev режим)
    if (!apiKey || !toEmail) {
      console.error("[POST /api/lead] RESEND_API_KEY или LEAD_NOTIFICATION_EMAIL не настроены");
      // В dev режиме — не блокируем форму
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "AI Web Studio <onboarding@resend.dev>",
      to: toEmail,
      subject: `Новая заявка от ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #18181b; margin-bottom: 24px;">Новая заявка с сайта</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a; width: 120px;">Имя</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #18181b; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a;">Контакт</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #18181b; font-weight: 500;">${contact}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px 12px 0; color: #71717a; vertical-align: top;">Задача</td>
              <td style="padding: 12px 0; color: #18181b;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>

          <div style="margin-top: 32px; padding: 16px; background: #f4f4f5; border-radius: 12px;">
            <p style="margin: 0; font-size: 13px; color: #71717a;">
              Заявка отправлена через форму на странице контактов AI Web Studio
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("[POST /api/lead]", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте написать напрямую." },
      { status: 500 }
    );
  }
}
