import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const design = await db.design.findUnique({ where: { id } })

  if (!design) {
    return new NextResponse("Дизайн не найден", { status: 404 })
  }

  return new NextResponse(design.htmlContent, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
