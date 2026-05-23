import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function isAdmin() {
  const session = await auth()
  return (session?.user as { role?: string })?.role === "ADMIN"
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  const { name, bio, role, avatar, rating, initials, avatarColor } = await req.json()
  const autoInitials = initials || name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
  const instructor = await prisma.instructor.update({
    where: { id },
    data: {
      name,
      bio: bio || null,
      role: role || "Ustoz",
      avatar: avatar || null,
      rating: rating ? Number(rating) : 4.8,
      initials: autoInitials,
      avatarColor: avatarColor || "#1A56DB",
    },
  })
  return NextResponse.json(instructor)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { id } = await params
  await prisma.instructor.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
