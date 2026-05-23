"use client"

import { useState } from "react"

interface Resource { id: string; title: string; url: string }
interface QuizQuestion { id: string; question: string; options: string; answer: number; order: number }

interface Props {
  lessonId: string
  initialResources: Resource[]
  initialQuestions: QuizQuestion[]
}

const inputS: React.CSSProperties = {
  width: "100%", padding: "8px 12px",
  border: "1.5px solid #E2E8F0", borderRadius: "7px",
  fontFamily: "inherit", fontSize: "13px",
  color: "#0F172A", outline: "none", background: "#fff",
  boxSizing: "border-box",
}

const LETTERS = ["A", "B", "C", "D"]

export function LessonDetailEditor({ lessonId, initialResources, initialQuestions }: Props) {
  const [tab, setTab] = useState<"resources" | "quiz">("resources")
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions)

  // Resource form
  const [resForm, setResForm] = useState({ title: "", url: "" })
  const [resLoading, setResLoading] = useState(false)

  // Quiz form
  const [qForm, setQForm] = useState({ question: "", options: ["", "", "", ""], answer: 0 })
  const [qLoading, setQLoading] = useState(false)

  // --- Resources ---
  const addResource = async () => {
    if (!resForm.title.trim() || !resForm.url.trim()) return
    setResLoading(true)
    const res = await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, ...resForm }),
    })
    const data = await res.json()
    setResLoading(false)
    if (res.ok) {
      setResources((r) => [...r, data])
      setResForm({ title: "", url: "" })
    }
  }

  const deleteResource = async (id: string) => {
    await fetch("/api/admin/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setResources((r) => r.filter((x) => x.id !== id))
  }

  // --- Quiz ---
  const addQuestion = async () => {
    if (!qForm.question.trim() || qForm.options.some((o) => !o.trim())) return
    setQLoading(true)
    const res = await fetch("/api/admin/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId,
        question: qForm.question,
        options: qForm.options,
        answer: qForm.answer,
        order: questions.length,
      }),
    })
    const data = await res.json()
    setQLoading(false)
    if (res.ok) {
      setQuestions((q) => [...q, data])
      setQForm({ question: "", options: ["", "", "", ""], answer: 0 })
    }
  }

  const deleteQuestion = async (id: string) => {
    await fetch("/api/admin/quiz", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setQuestions((q) => q.filter((x) => x.id !== id))
  }

  return (
    <div style={{ borderTop: "1px solid #EFF6FF", marginTop: "8px", paddingTop: "12px" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "14px" }}>
        {(["resources", "quiz"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "5px 14px", borderRadius: "7px", border: "none",
              fontFamily: "inherit", fontWeight: 700, fontSize: "12.5px",
              cursor: "pointer",
              background: tab === t ? "#2563EB" : "#EFF6FF",
              color: tab === t ? "#fff" : "#2563EB",
            }}
          >
            {t === "resources" ? `📎 Resurslar (${resources.length})` : `❓ Test savollari (${questions.length})`}
          </button>
        ))}
      </div>

      {/* RESOURCES TAB */}
      {tab === "resources" && (
        <div>
          {resources.length > 0 && (
            <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {resources.map((r) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F8FAFC", borderRadius: "8px", padding: "8px 12px" }}>
                  <span style={{ fontSize: "14px" }}>📎</span>
                  <span style={{ flex: 1, fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>{r.title}</span>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: "11.5px", color: "#2563EB", fontWeight: 600, textDecoration: "none", background: "#EFF6FF", padding: "2px 8px", borderRadius: "5px" }}>
                    Link ↗
                  </a>
                  <button onClick={() => deleteResource(r.id)} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "13px", padding: "0 2px" }}>✕</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr auto", gap: "6px", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Resurs nomi *</label>
              <input style={inputS} placeholder="Python PDF" value={resForm.title} onChange={(e) => setResForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11.5px", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>Havola (URL) *</label>
              <input style={inputS} placeholder="https://..." value={resForm.url} onChange={(e) => setResForm((f) => ({ ...f, url: e.target.value }))} />
            </div>
            <button
              onClick={addResource} disabled={resLoading}
              style={{ background: "#2563EB", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "7px", fontFamily: "inherit", fontWeight: 700, fontSize: "12.5px", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {resLoading ? "..." : "+ Qo'shish"}
            </button>
          </div>
        </div>
      )}

      {/* QUIZ TAB */}
      {tab === "quiz" && (
        <div>
          {questions.length > 0 && (
            <div style={{ marginBottom: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {questions.map((q, qi) => {
                const opts = (() => { try { return JSON.parse(q.options) } catch { return [] } })()
                return (
                  <div key={q.id} style={{ background: "#F8FAFC", borderRadius: "9px", padding: "10px 14px", border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                        {qi + 1}. {q.question}
                      </div>
                      <button onClick={() => deleteQuestion(q.id)} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "13px" }}>✕</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                      {opts.map((opt: string, i: number) => (
                        <div key={i} style={{ fontSize: "12px", padding: "3px 8px", borderRadius: "5px", background: i === q.answer ? "#DCFCE7" : "#fff", color: i === q.answer ? "#15803D" : "#64748B", border: i === q.answer ? "1px solid #86EFAC" : "1px solid #E2E8F0", fontWeight: i === q.answer ? 700 : 500 }}>
                          {LETTERS[i]}. {opt} {i === q.answer && "✓"}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add question form */}
          <div style={{ background: "#EFF6FF", borderRadius: "10px", padding: "12px 14px", border: "1px solid #DBEAFE" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#2563EB", marginBottom: "10px" }}>Yangi savol qo&apos;shish</div>
            <div style={{ marginBottom: "8px" }}>
              <input
                style={inputS}
                placeholder="Savol matni *"
                value={qForm.question}
                onChange={(e) => setQForm((f) => ({ ...f, question: e.target.value }))}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "8px" }}>
              {qForm.options.map((opt, i) => (
                <div key={i} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748B", width: "16px", flexShrink: 0 }}>{LETTERS[i]}.</span>
                  <input
                    style={{ ...inputS, flex: 1 }}
                    placeholder={`${LETTERS[i]} variant`}
                    value={opt}
                    onChange={(e) => {
                      const opts = [...qForm.options]
                      opts[i] = e.target.value
                      setQForm((f) => ({ ...f, options: opts }))
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#334155" }}>To&apos;g&apos;ri javob:</label>
                <select
                  value={qForm.answer}
                  onChange={(e) => setQForm((f) => ({ ...f, answer: Number(e.target.value) }))}
                  style={{ ...inputS, width: "auto", padding: "6px 10px" }}
                >
                  {LETTERS.map((l, i) => <option key={i} value={i}>{l} variant</option>)}
                </select>
              </div>
              <button
                onClick={addQuestion} disabled={qLoading}
                style={{ background: "#2563EB", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "7px", fontFamily: "inherit", fontWeight: 700, fontSize: "12.5px", cursor: "pointer", marginLeft: "auto" }}
              >
                {qLoading ? "..." : "✓ Savol qo'shish"}
              </button>
            </div>
          </div>

          {questions.length === 0 && (
            <p style={{ fontSize: "12.5px", color: "#94A3B8", marginTop: "8px", fontStyle: "italic" }}>
              Hali savol qo&apos;shilmagan. Test bo&apos;lmasa, talaba &quot;Tugatildi&quot; tugmasini bosib darsni yakunlaydi.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
