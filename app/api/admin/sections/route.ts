import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function isAdmin() {
  const session = await auth()
  return (session?.user as { role?: string })?.role === "ADMIN"
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { title, courseId, order } = await req.json()
  const section = await prisma.section.create({ data: { title, courseId, order: order ?? 0 } })
  return NextResponse.json(section)
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await req.json()
  await prisma.section.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
