import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function isAdmin() {
  const session = await auth()
  return (session?.user as { role?: string })?.role === "ADMIN"
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const instructors = await prisma.instructor.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  })
  return NextResponse.json(instructors)
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { name, bio, role, avatar, rating, initials, avatarColor } = await req.json()
  if (!name) return NextResponse.json({ error: "Ism kiritilmadi" }, { status: 400 })
  const autoInitials = initials || name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
  const instructor = await prisma.instructor.create({
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
