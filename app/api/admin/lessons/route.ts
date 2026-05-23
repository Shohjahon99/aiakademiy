import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function isAdmin() {
  const session = await auth()
  return (session?.user as { role?: string })?.role === "ADMIN"
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { title, videoId, duration, order, isFree, sectionId } = await req.json()
  const lesson = await prisma.lesson.create({
    data: { title, videoId: videoId || null, duration: duration ? Number(duration) : null, order: order ?? 0, isFree: Boolean(isFree), sectionId },
  })
  return NextResponse.json(lesson)
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id, title, videoId, duration, order, isFree } = await req.json()
  const lesson = await prisma.lesson.update({
    where: { id },
    data: { title, videoId: videoId || null, duration: duration ? Number(duration) : null, order: Number(order), isFree: Boolean(isFree) },
  })
  return NextResponse.json(lesson)
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await req.json()
  await prisma.lesson.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
