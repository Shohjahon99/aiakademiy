import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Login kerak" }, { status: 401 })
  const userId = session.user.id

  const { courseId, answers } = await req.json()
  if (!courseId || !answers)
    return NextResponse.json({ error: "Ma'lumot yetishmayapti" }, { status: 400 })

  const exam = await prisma.courseExam.findUnique({
    where: { courseId },
    include: { questions: true },
  })
  if (!exam) return NextResponse.json({ error: "Test topilmadi" }, { status: 404 })

  let correct = 0
  for (const q of exam.questions) {
    if (Number(answers[q.id]) === q.answer) correct++
  }

  const score = exam.questions.length > 0
    ? Math.round((correct / exam.questions.length) * 100)
    : 0
  const passed = score >= exam.passMark

  const attempt = await prisma.examAttempt.create({
    data: { userId, examId: exam.id, courseId, score, passed },
  })

  // If passed → issue certificate if not already issued
  if (passed) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    })
    if (enrollment) {
      const existing = await prisma.certificate.findUnique({
        where: { enrollmentId: enrollment.id },
      })
      if (!existing) {
        await prisma.certificate.create({ data: { enrollmentId: enrollment.id } })
      }
      // Mark enrollment as completed
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { completedAt: new Date() },
      })
    }
  }

  return NextResponse.json({
    score,
    passed,
    correct,
    total: exam.questions.length,
    passMark: exam.passMark,
    attemptId: attempt.id,
  })
}
