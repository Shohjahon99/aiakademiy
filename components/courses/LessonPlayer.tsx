"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface QuizQuestion {
  id: string
  question: string
  options: string // JSON array
  answer: number
  order: number
}

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
  quizQuestions: QuizQuestion[]
}

type Mode = "watching" | "quiz" | "result"

interface QuizResult {
  score: number
  passed: boolean
  correct: number
  total: number
}

const LETTERS = ["A", "B", "C", "D"]

export function LessonPlayer({ lesson, enrollmentId, nextLessonId, courseId, isCompleted, quizQuestions }: Props) {
  const [completed, setCompleted] = useState(isCompleted)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<Mode>("watching")
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const parsedQuestions = quizQuestions.map((q) => ({
    ...q,
    opts: (() => { try { return JSON.parse(q.options) as string[] } catch { return [] } })(),
  }))

  const markCompleteNoQuiz = async () => {
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

  const handleDoneClick = () => {
    if (completed) return
    if (parsedQuestions.length > 0) {
      setMode("quiz")
    } else {
      markCompleteNoQuiz()
    }
  }

  const submitQuiz = async () => {
    const unanswered = parsedQuestions.find((q) => answers[q.id] === undefined)
    if (unanswered) {
      alert("Iltimos, barcha savollarga javob bering!")
      return
    }
    setSubmitting(true)
    const res = await fetch("/api/quiz/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, enrollmentId, answers }),
    })
    const data: QuizResult = await res.json()
    setSubmitting(false)
    setResult(data)
    setMode("result")
    if (data.passed) {
      setCompleted(true)
      router.refresh()
    }
  }

  const retryQuiz = () => {
    setAnswers({})
    setResult(null)
    setMode("watching")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* ── VIDEO (watching mode) ── */}
      {mode === "watching" && (
        <div style={{ flex: 1, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
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
      )}

      {/* ── QUIZ MODE ── */}
      {mode === "quiz" && (
        <div style={{ flex: 1, overflowY: "auto", background: "#0F172A", padding: "32px 24px" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>❓</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "20px", fontFamily: "var(--font-raleway, Raleway, sans-serif)" }}>
                Dars testi
              </div>
              <div style={{ color: "#64748B", fontSize: "13px", marginTop: "6px" }}>
                {parsedQuestions.length} ta savol • 50% dan oshsa o&apos;tadi
              </div>
            </div>

            {/* Questions */}
            {parsedQuestions.map((q, qi) => (
              <div key={q.id} style={{ background: "#1E293B", borderRadius: "12px", padding: "18px 20px", marginBottom: "16px", border: "1px solid #334155" }}>
                <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: "14px", marginBottom: "14px", lineHeight: 1.5 }}>
                  <span style={{ color: "#94A3B8", marginRight: "6px" }}>{qi + 1}.</span>
                  {q.question}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {q.opts.map((opt, i) => {
                    const selected = answers[q.id] === i
                    return (
                      <button
                        key={i}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: selected ? "2px solid #3B82F6" : "1.5px solid #334155",
                          background: selected ? "#1D4ED820" : "#0F172A",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all .15s",
                        }}
                      >
                        <span style={{
                          width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: selected ? "#3B82F6" : "#1E293B",
                          border: selected ? "none" : "1.5px solid #475569",
                          fontSize: "11px", fontWeight: 800, color: selected ? "#fff" : "#64748B",
                        }}>
                          {LETTERS[i]}
                        </span>
                        <span style={{ color: selected ? "#93C5FD" : "#CBD5E1", fontSize: "13.5px", fontWeight: selected ? 600 : 500 }}>
                          {opt}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Submit */}
            <button
              onClick={submitQuiz}
              disabled={submitting || parsedQuestions.some((q) => answers[q.id] === undefined)}
              style={{
                width: "100%", marginTop: "8px",
                background: parsedQuestions.some((q) => answers[q.id] === undefined)
                  ? "#334155" : "linear-gradient(135deg,#2563EB,#1D4ED8)",
                color: "#fff", border: "none", padding: "14px",
                borderRadius: "10px", fontFamily: "inherit", fontWeight: 800, fontSize: "15px",
                cursor: parsedQuestions.some((q) => answers[q.id] === undefined) ? "not-allowed" : "pointer",
                transition: "all .2s",
              }}
            >
              {submitting ? "⏳ Tekshirilmoqda..." : "✓ Javoblarni yuborish"}
            </button>

            <button
              onClick={() => { setMode("watching"); setAnswers({}) }}
              style={{ width: "100%", marginTop: "10px", background: "transparent", color: "#64748B", border: "1px solid #334155", padding: "10px", borderRadius: "8px", fontFamily: "inherit", fontSize: "13px", cursor: "pointer" }}
            >
              ← Videoga qaytish
            </button>
          </div>
        </div>
      )}

      {/* ── RESULT MODE ── */}
      {mode === "result" && result && (
        <div style={{ flex: 1, overflowY: "auto", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
          <div style={{ maxWidth: "480px", width: "100%", background: "#1E293B", borderRadius: "20px", padding: "40px 32px", textAlign: "center", border: `2px solid ${result.passed ? "#22C55E" : "#EF4444"}` }}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>{result.passed ? "🎉" : "😔"}</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: "24px", marginBottom: "8px", fontFamily: "var(--font-raleway, Raleway, sans-serif)" }}>
              {result.passed ? "Tabriklaymiz!" : "Natija yetarli emas"}
            </div>

            {/* Score circle */}
            <div style={{
              width: "100px", height: "100px", borderRadius: "50%",
              background: result.passed ? "#14532D20" : "#7F1D1D20",
              border: `4px solid ${result.passed ? "#22C55E" : "#EF4444"}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              margin: "20px auto",
            }}>
              <div style={{ color: result.passed ? "#4ADE80" : "#F87171", fontWeight: 900, fontSize: "28px" }}>
                {result.score}%
              </div>
              <div style={{ color: "#64748B", fontSize: "11px", fontWeight: 600 }}>ball</div>
            </div>

            <div style={{ color: "#94A3B8", fontSize: "14px", marginBottom: "24px" }}>
              {result.correct} / {result.total} ta to&apos;g&apos;ri javob
              {result.passed
                ? " — Dars muvaffaqiyatli tugatildi! ✅"
                : " — O'tish uchun kamida 50% kerak. Videoni qayta ko'ring."}
            </div>

            {result.passed ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {nextLessonId && (
                  <button
                    onClick={() => router.push(`/learn/${courseId}/${nextLessonId}`)}
                    style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff", border: "none", padding: "13px 24px", borderRadius: "10px", fontFamily: "inherit", fontWeight: 800, fontSize: "15px", cursor: "pointer" }}
                  >
                    Keyingi dars →
                  </button>
                )}
                <button
                  onClick={() => router.push(`/learn/${courseId}/${lesson.id}`)}
                  style={{ background: "transparent", color: "#64748B", border: "1px solid #334155", padding: "10px 16px", borderRadius: "8px", fontFamily: "inherit", fontSize: "13px", cursor: "pointer" }}
                >
                  Videoni qayta ko&apos;rish
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={retryQuiz}
                  style={{ background: "#1D4ED8", color: "#fff", border: "none", padding: "13px 24px", borderRadius: "10px", fontFamily: "inherit", fontWeight: 800, fontSize: "15px", cursor: "pointer" }}
                >
                  📹 Videoni ko&apos;rib, qayta urinib ko&apos;ring
                </button>
                <button
                  onClick={() => setMode("quiz")}
                  style={{ background: "transparent", color: "#94A3B8", border: "1px solid #334155", padding: "10px 16px", borderRadius: "8px", fontFamily: "inherit", fontSize: "13px", cursor: "pointer" }}
                >
                  Testni qayta topshirish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── BOTTOM CONTROLS (watching mode only) ── */}
      {mode === "watching" && (
        <div style={{ padding: "20px 28px", borderTop: "1px solid #1E293B", background: "var(--dark2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>{lesson.title}</div>
            {lesson.duration && (
              <div style={{ color: "#64748B", fontSize: "13px", marginTop: "2px" }}>⏱ {lesson.duration} daqiqa</div>
            )}
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {!completed ? (
              <button
                onClick={handleDoneClick}
                disabled={loading}
                style={{
                  background: parsedQuestions.length > 0 ? "#D97706" : "var(--accent2)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {loading ? "..." : parsedQuestions.length > 0 ? "❓ Testga o'tish" : "✓ Tugatildi"}
              </button>
            ) : (
              <div style={{ color: "#22C55E", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                ✅ Tugallangan
              </div>
            )}
            {completed && nextLessonId && (
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
      )}
    </div>
  )
}
