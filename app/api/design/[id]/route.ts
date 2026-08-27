import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { PREVIEW_CSP } from "@/lib/design/compose"

// cuid — то, что генерирует Prisma (@default(cuid())). Проверяем форму id
// до похода в БД: отсекает мусорные запросы и перебор.
const CUID_RE = /^c[a-z0-9]{20,32}$/i

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!CUID_RE.test(id)) {
    return new NextResponse("Дизайн не найден", { status: 404 })
  }

  let design: { htmlContent: string } | null = null
  try {
    design = await db.design.findUnique({ where: { id }, select: { htmlContent: true } })
  } catch (error) {
    console.error("[GET /api/design/[id]] db_error", { id, error })
    return new NextResponse("Превью временно недоступно", { status: 503 })
  }

  if (!design) {
    return new NextResponse("Дизайн не найден", { status: 404 })
  }

  return new NextResponse(design.htmlContent, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Директива `sandbox` — ключевая. Документ содержит текст от пользователя
      // и от модели, а отдаётся с нашего домена; без неё любая инъекция
      // исполнялась бы в origin сайта, с доступом к cookie. Ссылку на это
      // превью получает владелец в письме о заявке — то есть открывает её
      // человек, залогиненный в свою почту.
      "Content-Security-Policy": `sandbox allow-scripts allow-popups; ${PREVIEW_CSP}`,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  })
}
