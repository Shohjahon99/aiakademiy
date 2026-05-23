import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Login kerak" }, { status: 401 })

  const { lessonId, enrollmentId, answers } = await req.json()
  // answers: Record<questionId, selectedOptionIndex>
  if (!lessonId || !enrollmentId || !answers)
    return NextResponse.json({ error: "Ma'lumot yetishmayapti" }, { status: 400 })

  const questions = await prisma.quizQuestion.findMany({
    where: { lessonId },
    orderBy: { order: "asc" },
  })

  if (questions.length === 0)
    return NextResponse.json({ error: "Savollar topilmadi" }, { status: 404 })

  let correct = 0
  for (const q of questions) {
    if (Number(answers[q.id]) === q.answer) correct++
  }

  const score = Math.round((correct / questions.length) * 100)
  const passed = score >= 50

  // If passed → mark lesson as completed
  if (passed) {
    await prisma.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
      update: {},
      create: { enrollmentId, lessonId },
    })
  }

  return NextResponse.json({
    score,
    passed,
    correct,
    total: questions.length,
  })
}
