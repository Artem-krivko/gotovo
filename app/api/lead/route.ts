import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sendTelegram, tgField } from "@/lib/telegram";
import { escapeHtml, isValidEmail, isValidPhone } from "@/lib/html";
import { sanitizeUserText } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizeAttribution } from "@/lib/attribution";
import type { AttributionData } from "@/lib/attribution";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

const LIMITS = { contact: 120, name: 80, message: 2000 } as const;

interface LeadFields {
  contact: string;
  name: string;
  message: string;
  attribution: AttributionData;
}

// ─── Валидация ───────────────────────────────────────────────────────────────

function parseLead(body: unknown): { ok: true; value: LeadFields } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Некорректный запрос" };
  }
  const b = body as Record<string, unknown>;

  const contact = sanitizeUserText(b.contact, LIMITS.contact);
  if (!contact) {
    return { ok: false, error: "Укажите телефон или email для связи" };
  }
  // Контакт — единственное, по чему мы можем вернуться к клиенту. Если это
  // не похоже ни на телефон, ни на email, заявка бесполезна: лучше сказать
  // об этом сразу, чем принять её в никуда.
  const telegram = /^@?[a-zA-Z0-9_]{5,32}$/.test(contact);
  if (!isValidPhone(contact) && !isValidEmail(contact) && !telegram) {
    return { ok: false, error: "Проверьте телефон, email или Telegram username" };
  }

  return {
    ok: true,
    value: {
      contact,
      name: sanitizeUserText(b.name, LIMITS.name),
      message: sanitizeUserText(b.message, LIMITS.message),
      attribution: normalizeAttribution(b.attribution),
    },
  };
}

// ─── Письмо ──────────────────────────────────────────────────────────────────

function buildLeadEmail({ contact, name, message, attribution }: LeadFields): string {
  // Значения приходят из открытой формы, поэтому экранируется каждое.
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 16px 12px 0;border-bottom:1px solid #e4e4e7;color:#71717a;vertical-align:top;width:120px">${escapeHtml(label)}</td>
      <td style="padding:12px 0;border-bottom:1px solid #e4e4e7;color:#18181b;font-weight:500">${value}</td>
    </tr>`;

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #18181b; margin-bottom: 24px;">Новая заявка с сайта</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${row("Контакт", escapeHtml(contact))}
        ${name ? row("Имя", escapeHtml(name)) : ""}
        ${message ? row("Задача", escapeHtml(message).replace(/\n/g, "<br>")) : ""}
        ${Object.keys(attribution).length ? row("Атрибуция", escapeHtml(JSON.stringify(attribution))) : ""}
      </table>
      <div style="margin-top: 32px; padding: 16px; background: #f4f4f5; border-radius: 12px;">
        <p style="margin: 0; font-size: 13px; color: #71717a;">
          Заявка отправлена через форму на сайте gotovo
        </p>
      </div>
    </div>`;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  const limit = rateLimit(`lead:${ip}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Слишком много заявок подряд. Попробуйте через несколько минут." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = parseLead(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const lead = parsed.value;

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL;

  // Раньше при незаданных ключах маршрут отвечал { success: true }.
  // В проде это означает: клиент видит «заявка отправлена», а заявки нет
  // нигде — ни в почте, ни в Telegram. Такой ответ недопустим.
  if (!apiKey || !toEmail) {
    console.error("[lead] not_configured", {
      hasResendKey: Boolean(apiKey),
      hasNotificationEmail: Boolean(toEmail),
      // Пишем содержимое в лог, чтобы заявку можно было восстановить вручную.
      contact: lead.contact,
      name: lead.name,
      message: lead.message,
    });

    // В dev без ключей заявка ожидаемо никуда не уходит — не пугаем разработчика.
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ success: true, delivery: "logged_only" });
    }

    return NextResponse.json(
      { error: "Не удалось отправить заявку. Напишите нам в Telegram — ответим сразу." },
      { status: 503 }
    );
  }

  // Два независимых канала: падение одного не отменяет другой.
  const [emailResult, telegramResult] = await Promise.allSettled([
    new Resend(apiKey).emails.send({
      from: "gotovo <noreply@usegotovo.by>",
      to: toEmail,
      reply_to: isValidEmail(lead.contact) ? lead.contact : undefined,
      subject: `Новая заявка от ${lead.name || lead.contact}`,
      html: buildLeadEmail(lead),
    }),
    sendTelegram(
      [
        "🔔 <b>Новая заявка с сайта</b>",
        "",
        tgField("Контакт", lead.contact),
        lead.name ? tgField("Имя", lead.name) : "",
        lead.message ? tgField("Задача", lead.message) : "",
        Object.keys(lead.attribution).length ? tgField("Источник", JSON.stringify(lead.attribution)) : "",
      ]
        .filter(Boolean)
        .join("\n")
    ),
  ]);

  // Resend отвечает 200 с полем error внутри — раньше результат не проверялся
  // вообще, и любая ошибка доставки уходила в пустоту.
  const emailOk = emailResult.status === "fulfilled" && !emailResult.value.error;
  const telegramOk = telegramResult.status === "fulfilled" && telegramResult.value.ok;

  if (!emailOk) {
    console.error("[lead] email_failed", {
      reason:
        emailResult.status === "rejected"
          ? String(emailResult.reason)
          : JSON.stringify(emailResult.value.error),
    });
  }
  if (!telegramOk) {
    console.error("[lead] telegram_failed", {
      reason:
        telegramResult.status === "rejected"
          ? String(telegramResult.reason)
          : telegramResult.value.reason,
    });
  }

  if (!emailOk && !telegramOk) {
    // Последний рубеж: заявка не ушла никуда, поэтому пишем её целиком в лог
    // и честно сообщаем клиенту, что нужно связаться другим способом.
    console.error("[lead] lost", { contact: lead.contact, name: lead.name, message: lead.message });
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Напишите нам в Telegram — ответим сразу." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
