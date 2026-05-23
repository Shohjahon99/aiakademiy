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
  const { examId, question, options, answer, order } = await req.json()
  if (!examId || !question || !options || answer === undefined)
    return NextResponse.json({ error: "To'liq ma'lumot kiriting" }, { status: 400 })

  const q = await prisma.examQuestion.create({
    data: {
      examId,
      question,
      options: JSON.stringify(options),
      answer: Number(answer),
      order: order ?? 0,
    },
  })
  return NextResponse.json(q)
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const { id } = await req.json()
  await prisma.examQuestion.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
