import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const { role: newRole } = await req.json()

  const user = await prisma.user.update({ where: { id }, data: { role: newRole } })
  return NextResponse.json({ id: user.id, role: user.role })
}
