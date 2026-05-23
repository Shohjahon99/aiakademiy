import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

async function checkAdmin() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  return role === "ADMIN"
}

// GET: fetch exam for course
export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const courseId = req.nextUrl.searchParams.get("courseId")
  if (!courseId) return NextResponse.json({ error: "courseId kerak" }, { status: 400 })

  const exam = await prisma.courseExam.findUnique({
    where: { courseId },
    include: { questions: { orderBy: { order: "asc" } } },
  })
  return NextResponse.json(exam)
}

// POST: create or update exam
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const { courseId, title, passMark } = await req.json()
  if (!courseId) return NextResponse.json({ error: "courseId kerak" }, { status: 400 })

  const exam = await prisma.courseExam.upsert({
    where: { courseId },
    update: { title: title || "Yakuniy test", passMark: passMark ?? 70 },
    create: { courseId, title: title || "Yakuniy test", passMark: passMark ?? 70 },
    include: { questions: { orderBy: { order: "asc" } } },
  })
  return NextResponse.json(exam)
}

// DELETE: remove exam
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
  const { courseId } = await req.json()
  await prisma.courseExam.delete({ where: { courseId } })
  return NextResponse.json({ ok: true })
}
