import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { enrollmentId, lessonId } = await req.json()

  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, userId: session.user.id },
  })
  if (!enrollment) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
    create: { enrollmentId, lessonId },
    update: {},
  })

  const course = await prisma.course.findUnique({
    where: { id: enrollment.courseId },
    include: { sections: { include: { lessons: true } } },
  })
  const totalLessons = course?.sections.reduce((acc, s) => acc + s.lessons.length, 0) ?? 0
  const completedCount = await prisma.lessonProgress.count({ where: { enrollmentId } })

  if (totalLessons > 0 && completedCount >= totalLessons) {
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { completedAt: new Date() },
    })
    const existing = await prisma.certificate.findUnique({ where: { enrollmentId } })
    if (!existing) {
      await prisma.certificate.create({ data: { enrollmentId } })
    }
  }

  return NextResponse.json({ ok: true })
}
