"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Lesson {
  id: string
  title: string
  videoId?: string | null
  duration?: number | null
  isFree: boolean
}

interface Props {
  lesson: Lesson
  enrollmentId: string
  nextLessonId?: string
  courseId: string
  isCompleted: boolean
}

export function LessonPlayer({ lesson, enrollmentId, nextLessonId, courseId, isCompleted }: Props) {
  const [completed, setCompleted] = useState(isCompleted)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const markComplete = async () => {
    if (completed) return
    setLoading(true)
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId, lessonId: lesson.id }),
    })
    setCompleted(true)
    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Video */}
      <div style={{ flex: 1, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {lesson.videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${lesson.videoId}?autoplay=1&rel=0`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div style={{ textAlign: "center", color: "#64748B" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎬</div>
            <div style={{ fontWeight: 600 }}>Video hali yuklanmagan</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding: "20px 28px", borderTop: "1px solid #1E293B", background: "var(--dark2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>{lesson.title}</div>
          {lesson.duration && (
            <div style={{ color: "#64748B", fontSize: "13px", marginTop: "2px" }}>⏱ {lesson.duration} daqiqa</div>
          )}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {!completed ? (
            <button
              onClick={markComplete}
              disabled={loading}
              style={{
                background: "var(--accent2)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ✓ Tugatildi
            </button>
          ) : (
            <div style={{ color: "var(--accent2)", fontWeight: 700, fontSize: "14px" }}>✅ Tugallangan</div>
          )}
          {nextLessonId && (
            <button
              onClick={() => router.push(`/learn/${courseId}/${nextLessonId}`)}
              style={{
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "var(--radius-sm)",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Keyingi dars →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
