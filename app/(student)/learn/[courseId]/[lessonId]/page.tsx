export const dynamic = "force-dynamic"

import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { LessonPlayer } from "@/components/courses/LessonPlayer"

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>
}

export default async function LearnPage({ params }: Props) {
  const { courseId, lessonId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    include: { progresses: true },
  })
  if (!enrollment) redirect(`/courses`)

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        include: { lessons: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  })
  if (!course) notFound()

  const currentLesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!currentLesson) notFound()

  const completedIds = new Set(enrollment.progresses.map((p) => p.lessonId))
  const allLessons = course.sections.flatMap((s) => s.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const nextLesson = allLessons[currentIndex + 1]

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          flexShrink: 0,
          background: "var(--dark2)",
          overflowY: "auto",
          borderRight: "1px solid #334155",
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #334155" }}>
          <Link href={`/courses/${course.slug}`} style={{ color: "#64748B", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
            ← Kursga qaytish
          </Link>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px", marginTop: "8px", lineHeight: 1.4 }}>
            {course.title}
          </div>
        </div>
        {course.sections.map((section) => (
          <div key={section.id}>
            <div style={{ padding: "10px 16px", background: "#1E293B", fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {section.title}
            </div>
            {section.lessons.map((lesson) => {
              const isDone = completedIds.has(lesson.id)
              const isCurrent = lesson.id === lessonId
              return (
                <Link
                  key={lesson.id}
                  href={`/learn/${courseId}/${lesson.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 16px",
                    background: isCurrent ? "#1A56DB20" : "transparent",
                    borderLeft: isCurrent ? "3px solid var(--primary)" : "3px solid transparent",
                    textDecoration: "none",
                    transition: "all .2s",
                  }}
                >
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>{isDone ? "✅" : isCurrent ? "▶️" : "⭕"}</span>
                  <span style={{ fontSize: "13px", color: isCurrent ? "#fff" : "#94A3B8", fontWeight: isCurrent ? 700 : 500, lineHeight: 1.4 }}>
                    {lesson.title}
                  </span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Video player */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0F172A", overflow: "hidden" }}>
        <LessonPlayer
          lesson={currentLesson}
          enrollmentId={enrollment.id}
          nextLessonId={nextLesson?.id}
          courseId={courseId}
          isCompleted={completedIds.has(lessonId)}
        />
      </div>
    </div>
  )
}
