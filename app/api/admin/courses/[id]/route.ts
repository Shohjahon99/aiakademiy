import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function isAdmin() {
  const session = await auth()
  return (session?.user as { role?: string })?.role === "ADMIN"
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  const course = await prisma.course.findUnique({
    where: { id },
    include: { sections: { include: { lessons: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } } },
  })
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(course)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  const body = await req.json()

  const { title, description, price, oldPrice, categoryId, instructorId, duration, level, badge, thumbEmoji, thumbColor, published } = body

  const course = await prisma.course.update({
    where: { id },
    data: {
      title,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      categoryId,
      instructorId,
      duration: duration ? Number(duration) : null,
      level,
      badge: badge || null,
      thumbEmoji,
      thumbColor,
      published: Boolean(published),
    },
  })
  return NextResponse.json(course)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  await prisma.course.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
