import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Ma'lumotlar noto'g'ri" }, { status: 400 })
    }

    const { name, email, phone, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword },
    })

    return NextResponse.json({ id: user.id, name: user.name, email: user.email })
  } catch {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
