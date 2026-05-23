import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const data = await req.json()
  const settings = await prisma.siteSettings.upsert({
    where: { id: "settings" },
    create: { id: "settings", ...data },
    update: data,
  })
  return NextResponse.json(settings)
}
