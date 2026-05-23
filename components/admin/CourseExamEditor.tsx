"use client"

import { useState, useEffect } from "react"

interface ExamQuestion { id: string; question: string; options: string; answer: number; order: number }
interface Exam { id: string; title: string; passMark: number; questions: ExamQuestion[] }

const inputS: React.CSSProperties = {
  width: "100%", padding: "9px 13px",
  border: "1.5px solid #E2E8F0", borderRadius: "8px",
  fontFamily: "inherit", fontSize: "13px",
  color: "#0F172A", outline: "none", background: "#fff",
  boxSizing: "border-box",
}
const LETTERS = ["A", "B", "C", "D"]

export function CourseExamEditor({ courseId }: { courseId: string }) {
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState("Yakuniy test")
  const [passMark, setPassMark] = useState(70)
  const [qForm, setQForm] = useState({ question: "", options: ["", "", "", ""], answer: 0 })
  const [qLoading, setQLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/exam?courseId=${courseId}`)
      .then((r) => r.json())
      .then((data) => {
        setExam(data ?? null)
        if (data) { setTitle(data.title); setPassMark(data.passMark) }
        setLoading(false)
      })
  }, [courseId])

  const createExam = async () => {
    setCreating(true)
    const res = await fetch("/api/admin/exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, title, passMark }),
    })
    const data = await res.json()
    setCreating(false)
    if (res.ok) setExam(data)
  }

  const updateExam = async () => {
    if (!exam) return
    setCreating(true)
    const res = await fetch("/api/admin/exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, title, passMark }),
    })
    const data = await res.json()
    setCreating(false)
    if (res.ok) setExam(data)
  }

  const deleteExam = async () => {
    if (!confirm("Yakuniy testni o'chirishni tasdiqlaysizmi?")) return
    await fetch("/api/admin/exam", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    })
    setExam(null)
    setTitle("Yakuniy test"); setPassMark(70)
  }

  const addQuestion = async () => {
    if (!exam || !qForm.question.trim() || qForm.options.some((o) => !o.trim())) return
    setQLoading(true)
    const res = await fetch("/api/admin/exam/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: exam.id,
        question: qForm.question,
        options: qForm.options,
        answer: qForm.answer,
        order: exam.questions.length,
      }),
    })
    const data = await res.json()
    setQLoading(false)
    if (res.ok) {
      setExam((e) => e ? { ...e, questions: [...e.questions, data] } : e)
      setQForm({ question: "", options: ["", "", "", ""], answer: 0 })
    }
  }

  const deleteQuestion = async (id: string) => {
    await fetch("/api/admin/exam/questions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setExam((e) => e ? { ...e, questions: e.questions.filter((q) => q.id !== id) } : e)
  }

  if (loading) return <div style={{ padding: "20px", color: "#94A3B8", fontSize: "13px" }}>⏳ Yuklanmoqda...</div>

  return (
    <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", overflow: "hidden", marginTop: "24px" }}>
      {/* Header */}
      <div style={{ padding: "16px 22px", borderBottom: "1px solid #E8EDF4", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "9px", background: exam ? "#F5F3FF" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
          🏆
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A" }}>Yakuniy test</div>
          <div style={{ fontSize: "12px", color: "#94A3B8" }}>
            {exam ? `${exam.questions.length} ta savol • O'tish bali: ${exam.passMark}%` : "Hali yaratilmagan"}
          </div>
        </div>
        {exam && (
          <button onClick={deleteExam} style={{ background: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 12px", borderRadius: "7px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
            🗑 O&apos;chirish
          </button>
        )}
      </div>

      <div style={{ padding: "20px 22px" }}>
        {/* Settings */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "10px", marginBottom: "20px", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "5px" }}>Test nomi</label>
            <input style={inputS} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Yakuniy test" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "5px" }}>O&apos;tish bali (%)</label>
            <input style={inputS} type="number" min="1" max="100" value={passMark} onChange={(e) => setPassMark(Number(e.target.value))} />
          </div>
          <button
            onClick={exam ? updateExam : createExam}
            disabled={creating}
            style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)", color: "#fff", border: "none", padding: "9px 16px", borderRadius: "8px", fontFamily: "inherit", fontWeight: 700, fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {creating ? "⏳" : exam ? "💾 Yangilash" : "✓ Yaratish"}
          </button>
        </div>

        {exam && (
          <>
            {/* Existing questions */}
            {exam.questions.length > 0 && (
              <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {exam.questions.map((q, qi) => {
                  const opts = (() => { try { return JSON.parse(q.options) } catch { return [] } })()
                  return (
                    <div key={q.id} style={{ background: "#F8FAFC", borderRadius: "9px", padding: "12px 14px", border: "1px solid #E2E8F0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A" }}>{qi + 1}. {q.question}</div>
                        <button onClick={() => deleteQuestion(q.id)} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "14px" }}>✕</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                        {opts.map((opt: string, i: number) => (
                          <div key={i} style={{ fontSize: "12.5px", padding: "4px 10px", borderRadius: "6px", background: i === q.answer ? "#DCFCE7" : "#fff", color: i === q.answer ? "#15803D" : "#64748B", border: `1px solid ${i === q.answer ? "#86EFAC" : "#E2E8F0"}`, fontWeight: i === q.answer ? 700 : 500 }}>
                            {LETTERS[i]}. {opt} {i === q.answer && "✓"}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add question */}
            <div style={{ background: "#EFF6FF", borderRadius: "10px", padding: "14px 16px", border: "1px solid #DBEAFE" }}>
              <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#2563EB", marginBottom: "10px" }}>➕ Yangi savol</div>
              <div style={{ marginBottom: "8px" }}>
                <input style={inputS} placeholder="Savol matni *" value={qForm.question} onChange={(e) => setQForm((f) => ({ ...f, question: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "8px" }}>
                {qForm.options.map((opt, i) => (
                  <div key={i} style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B", width: "16px", flexShrink: 0 }}>{LETTERS[i]}.</span>
                    <input
                      style={{ ...inputS, flex: 1 }}
                      placeholder={`${LETTERS[i]} variant`}
                      value={opt}
                      onChange={(e) => {
                        const o = [...qForm.options]; o[i] = e.target.value
                        setQForm((f) => ({ ...f, options: o }))
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#334155" }}>To&apos;g&apos;ri:</label>
                <select value={qForm.answer} onChange={(e) => setQForm((f) => ({ ...f, answer: Number(e.target.value) }))} style={{ ...inputS, width: "auto", padding: "6px 10px" }}>
                  {LETTERS.map((l, i) => <option key={i} value={i}>{l}</option>)}
                </select>
                <button onClick={addQuestion} disabled={qLoading} style={{ marginLeft: "auto", background: "#2563EB", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "7px", fontFamily: "inherit", fontWeight: 700, fontSize: "12.5px", cursor: "pointer" }}>
                  {qLoading ? "..." : "✓ Qo'shish"}
                </button>
              </div>
            </div>

            {exam.questions.length === 0 && (
              <p style={{ fontSize: "12.5px", color: "#94A3B8", marginTop: "10px", fontStyle: "italic" }}>
                Hali savol yo&apos;q. Yuqoridagi forma orqali savollar qo&apos;shing.
              </p>
            )}
          </>
        )}

        {!exam && (
          <p style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center", padding: "10px 0" }}>
            Yakuniy test yaratilmagan. &quot;Yaratish&quot; tugmasini bosing.
          </p>
        )}
      </div>
    </div>
  )
}
