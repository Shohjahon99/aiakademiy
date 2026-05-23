import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function checkAdmin() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  return role === "ADMIN"
}

// GET: fetch quiz questions for a lesson
export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const { searchParams } = new URL(req.url)
  const lessonId = searchParams.get("lessonId")
  if (!lessonId) return NextResponse.json([])
  const questions = await prisma.quizQuestion.findMany({
    where: { lessonId },
    orderBy: { order: "asc" },
  })
  return NextResponse.json(questions)
}

// POST: add quiz question
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const { lessonId, question, options, answer, order } = await req.json()
  if (!lessonId || !question || !options || answer === undefined)
    return NextResponse.json({ error: "To'liq ma'lumot kiriting" }, { status: 400 })

  const q = await prisma.quizQuestion.create({
    data: {
      lessonId,
      question,
      options: JSON.stringify(options),
      answer: Number(answer),
      order: order ?? 0,
    },
  })
  return NextResponse.json(q)
}

// DELETE: remove quiz question
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const { id } = await req.json()
  await prisma.quizQuestion.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
