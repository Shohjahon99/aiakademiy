import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function checkAdmin() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  return role === "ADMIN"
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const { lessonId, title, url } = await req.json()
  if (!lessonId || !title || !url)
    return NextResponse.json({ error: "To'liq ma'lumot kiriting" }, { status: 400 })

  const r = await prisma.lessonResource.create({ data: { lessonId, title, url } })
  return NextResponse.json(r)
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const { id } = await req.json()
  await prisma.lessonResource.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
