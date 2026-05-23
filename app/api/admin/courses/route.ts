import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"

export async function POST(req: NextRequest) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const { title, description, price, oldPrice, categoryId, instructorId, duration, level, badge, thumbEmoji, thumbColor, published } = body

  if (!title || !price || !categoryId || !instructorId) {
    return NextResponse.json({ error: "Majburiy maydonlar to'ldirilmagan" }, { status: 400 })
  }

  let slug = generateSlug(title)
  const existing = await prisma.course.findUnique({ where: { slug } })
  if (existing) slug = slug + "-" + Date.now()

  const course = await prisma.course.create({
    data: { title, slug, description, price, oldPrice, categoryId, instructorId, duration, level, badge: badge || null, thumbEmoji, thumbColor, published },
  })

  return NextResponse.json(course)
}

export async function GET() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const courses = await prisma.course.findMany({
    include: { category: true, instructor: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(courses)
}
