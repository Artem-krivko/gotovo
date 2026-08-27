import { NextRequest, NextResponse } from "next/server"
import { composePage } from "@/lib/design/compose"
import { checkQuality } from "@/lib/design/quality"
import { adjustSpec, baseSpecFor, parseDesignSpec, SPEC_ADJUSTMENTS, type SpecAdjustment } from "@/lib/design/spec"
import { parsePageAssets, parsePageContent } from "@/lib/design/parse-content"
import { clientIp, rateLimit } from "@/lib/rate-limit"
import { db } from "@/lib/db"

/**
 * Быстрые правки визуального решения без обращения к модели.
 *
 * Это прямое следствие того, что композиция стала данными: чтобы сделать
 * страницу «премиальнее» или поменять hero, достаточно изменить DesignSpec
 * и пересобрать HTML — миллисекунды вместо новой генерации и её стоимости.
 *
 * В БД тут ничего не пишется намеренно: иначе перебор вариантов засорял бы
 * таблицу Design десятками почти одинаковых строк.
 */

// Правки дешёвые, поэтому лимит мягче, чем у генерации.
const RATE_LIMIT = { limit: 60, windowMs: 10 * 60 * 1000 }
const CUID_RE = /^c[a-z0-9]{20,32}$/i
const SESSION_COOKIE = "session_id"

export async function POST(req: NextRequest) {
  const ip = clientIp(req)

  const limit = rateLimit(`adjust:${ip}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Слишком много правок подряд. Попробуйте через минуту." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 })
  }

  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>

  const adjustment = b.adjustment
  if (
    typeof adjustment !== "string" ||
    !(SPEC_ADJUSTMENTS as readonly string[]).includes(adjustment)
  ) {
    return NextResponse.json({ error: "Неизвестная правка" }, { status: 400 })
  }

  // Контент и спека приходят от клиента, поэтому проходят те же проверки,
  // что и данные от модели: спека — по allow-list, контент — через
  // экранирование в composePage.
  const content = parsePageContent(b.content)
  if (!content) {
    return NextResponse.json({ error: "Некорректный контент" }, { status: 400 })
  }

  const assets = parsePageAssets(b.assets)
  if (!assets) {
    return NextResponse.json({ error: "Некорректные изображения" }, { status: 400 })
  }

  const spec = parseDesignSpec(b.spec, baseSpecFor("modern"))
  const nextSpec = adjustSpec(spec, adjustment as SpecAdjustment)

  const { html, renderedSections } = composePage(content, nextSpec, assets)
  const quality = checkQuality(html, content, nextSpec, renderedSections)

  if (!quality.ok) {
    // Правка не должна ухудшать результат: если после неё страница не проходит
    // проверки, оставляем прежний вариант и честно об этом сообщаем.
    console.warn("[adjust] quality_gate_failed", {
      adjustment,
      issues: quality.issues.filter((i) => i.severity === "error").map((i) => i.code),
    })
    return NextResponse.json(
      { error: "Этот вариант получился хуже — оставили текущий" },
      { status: 422 }
    )
  }

  const parentId = typeof b.designId === "string" && CUID_RE.test(b.designId) ? b.designId : null
  let designId: string | null = parentId
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value
  if (parentId && sessionId) {
    try {
      const parent = await db.design.findFirst({
        where: { id: parentId, sessionId },
        select: { sessionId: true, prompt: true, businessType: true, style: true, language: true },
      })
      if (parent) {
        const saved = await db.design.create({
          data: { ...parent, htmlContent: html },
          select: { id: true },
        })
        designId = saved.id
      }
    } catch (error) {
      // Persistence remains a side effect: a valid visual adjustment must not
      // be lost merely because the database is temporarily unavailable.
      console.error("[adjust] persist_failed", { parentId, error: String(error) })
    }
  }

  return NextResponse.json({ html, spec: nextSpec, assets, designId }, { status: 200 })
}
