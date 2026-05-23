"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LessonDetailEditor } from "@/components/admin/LessonDetailEditor"
import { CourseExamEditor } from "@/components/admin/CourseExamEditor"

interface Category { id: string; name: string; icon: string }
interface Instructor { id: string; name: string }
interface Lesson { id: string; title: string; videoId: string | null; duration: number | null; order: number; isFree: boolean }
interface Section { id: string; title: string; order: number; lessons: Lesson[] }

// Lazy loader for lesson detail (fetches quiz & resources on demand)
function LessonDetailLoader({ lessonId }: { lessonId: string }) {
  const [data, setData] = useState<{ resources: unknown[]; questions: unknown[] } | null>(null)
  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/resources?lessonId=${lessonId}`).then((r) => r.json()),
      fetch(`/api/admin/quiz?lessonId=${lessonId}`).then((r) => r.json()),
    ]).then(([resources, questions]) => setData({ resources, questions }))
  }, [lessonId])

  if (!data) return <div style={{ padding: "12px 0", color: "#94A3B8", fontSize: "13px" }}>⏳ Yuklanmoqda...</div>
  return (
    <LessonDetailEditor
      lessonId={lessonId}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialResources={data.resources as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialQuestions={data.questions as any}
    />
  )
}
interface Course {
  id: string
  title: string
  description: string | null
  price: number
  oldPrice: number | null
  categoryId: string
  instructorId: string
  duration: number | null
  level: string
  badge: string | null
  thumbEmoji: string | null
  thumbColor: string | null
  published: boolean
  sections: Section[]
}

const inputS: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--border)",
  borderRadius: "8px",
  fontFamily: "inherit",
  fontSize: "14px",
  color: "var(--text)",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13.5px", fontWeight: 700, color: "var(--dark)", marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  )
}

export function EditCourseForm({
  course,
  categories,
  instructors,
}: {
  course: Course
  categories: Category[]
  instructors: Instructor[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    title: course.title,
    description: course.description || "",
    price: String(course.price),
    oldPrice: course.oldPrice ? String(course.oldPrice) : "",
    categoryId: course.categoryId,
    instructorId: course.instructorId,
    duration: course.duration ? String(course.duration) : "",
    level: course.level,
    badge: course.badge || "",
    thumbEmoji: course.thumbEmoji || "📚",
    thumbColor: course.thumbColor || "#DBEAFE",
    published: course.published,
  })

  const [sections, setSections] = useState<Section[]>(course.sections)
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [addingSection, setAddingSection] = useState(false)
  const [newLesson, setNewLesson] = useState<Record<string, { title: string; videoId: string; duration: string; isFree: boolean }>>({})
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)

  const handle = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setSuccess(""); setLoading(true)
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        duration: form.duration ? Number(form.duration) : null,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || "Xatolik"); return }
    setSuccess("Saqlandi ✓")
    setTimeout(() => setSuccess(""), 3000)
    router.refresh()
  }

  const deleteCourse = async () => {
    if (!confirm("Kursni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi!")) return
    const res = await fetch(`/api/admin/courses/${course.id}`, { method: "DELETE" })
    if (res.ok) router.push("/admin/courses")
  }

  const addSection = async () => {
    if (!newSectionTitle.trim()) return
    setAddingSection(true)
    const res = await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newSectionTitle, courseId: course.id, order: sections.length }),
    })
    const data = await res.json()
    setAddingSection(false)
    if (res.ok) {
      setSections((s) => [...s, { ...data, lessons: [] }])
      setNewSectionTitle("")
    }
  }

  const deleteSection = async (sectionId: string) => {
    if (!confirm("Bo'limni o'chirishni tasdiqlaysizmi?")) return
    const res = await fetch("/api/admin/sections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sectionId }),
    })
    if (res.ok) setSections((s) => s.filter((sec) => sec.id !== sectionId))
  }

  const addLesson = async (sectionId: string) => {
    const ln = newLesson[sectionId]
    if (!ln?.title?.trim()) return
    const res = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: ln.title,
        videoId: ln.videoId || null,
        duration: ln.duration ? Number(ln.duration) : null,
        isFree: ln.isFree,
        sectionId,
        order: (sections.find((s) => s.id === sectionId)?.lessons.length ?? 0),
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setSections((s) => s.map((sec) => sec.id === sectionId ? { ...sec, lessons: [...sec.lessons, data] } : sec))
      setNewLesson((n) => ({ ...n, [sectionId]: { title: "", videoId: "", duration: "", isFree: false } }))
    }
  }

  const deleteLesson = async (sectionId: string, lessonId: string) => {
    const res = await fetch("/api/admin/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lessonId }),
    })
    if (res.ok) setSections((s) => s.map((sec) => sec.id === sectionId ? { ...sec, lessons: sec.lessons.filter((l) => l.id !== lessonId) } : sec))
  }

  return (
    <div>
      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
        {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13.5px" }}>{error}</div>}
        {success && <div style={{ background: "#DCFCE7", color: "#15803D", padding: "10px 14px", borderRadius: "8px", fontSize: "13.5px" }}>{success}</div>}

        <FormGroup label="Kurs nomi *">
          <input style={inputS} value={form.title} onChange={(e) => handle("title", e.target.value)} required />
        </FormGroup>

        <FormGroup label="Tavsif">
          <textarea style={{ ...inputS, height: "100px", resize: "vertical" }} value={form.description} onChange={(e) => handle("description", e.target.value)} />
        </FormGroup>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <FormGroup label="Narx (so'm) *">
            <input style={inputS} type="number" value={form.price} onChange={(e) => handle("price", e.target.value)} required />
          </FormGroup>
          <FormGroup label="Eski narx (so'm)">
            <input style={inputS} type="number" value={form.oldPrice} onChange={(e) => handle("oldPrice", e.target.value)} />
          </FormGroup>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <FormGroup label="Kategoriya *">
            <select style={inputS} value={form.categoryId} onChange={(e) => handle("categoryId", e.target.value)} required>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Ustoz *">
            <select style={inputS} value={form.instructorId} onChange={(e) => handle("instructorId", e.target.value)} required>
              {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </FormGroup>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <FormGroup label="Davomiyligi (soat)">
            <input style={inputS} type="number" value={form.duration} onChange={(e) => handle("duration", e.target.value)} />
          </FormGroup>
          <FormGroup label="Daraja">
            <select style={inputS} value={form.level} onChange={(e) => handle("level", e.target.value)}>
              <option value="BEGINNER">Boshlang&apos;ich</option>
              <option value="INTERMEDIATE">O&apos;rta</option>
              <option value="ADVANCED">Yuqori</option>
            </select>
          </FormGroup>
          <FormGroup label="Badge">
            <select style={inputS} value={form.badge} onChange={(e) => handle("badge", e.target.value)}>
              <option value="">Yo&apos;q</option>
              <option value="HOT">HOT 🔥</option>
              <option value="NEW">NEW ✨</option>
              <option value="TOP">TOP ⭐</option>
            </select>
          </FormGroup>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <FormGroup label="Emoji (thumbnail)">
            <input style={inputS} value={form.thumbEmoji} onChange={(e) => handle("thumbEmoji", e.target.value)} />
          </FormGroup>
          <FormGroup label="Fon rangi (hex)">
            <input style={inputS} value={form.thumbColor} onChange={(e) => handle("thumbColor", e.target.value)} />
          </FormGroup>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="checkbox" id="published" checked={form.published} onChange={(e) => handle("published", e.target.checked)} />
          <label htmlFor="published" style={{ fontSize: "14px", fontWeight: 700, color: "var(--dark)", cursor: "pointer" }}>
            Nashr qilish (saytda ko&apos;rinadi)
          </label>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" disabled={loading} style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "8px", fontFamily: "inherit", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </button>
          <button type="button" onClick={() => router.back()} style={{ background: "transparent", border: "1.5px solid var(--border)", color: "var(--text2)", padding: "12px 20px", borderRadius: "8px", fontFamily: "inherit", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
            Orqaga
          </button>
          <button type="button" onClick={deleteCourse} style={{ marginLeft: "auto", background: "#FEE2E2", color: "#DC2626", border: "none", padding: "12px 20px", borderRadius: "8px", fontFamily: "inherit", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
            🗑 O&apos;chirish
          </button>
        </div>
      </form>

      {/* Sections & Lessons */}
      <div style={{ borderTop: "2px solid var(--border)", paddingTop: "32px" }}>
        <div style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "20px", fontWeight: 900, color: "var(--dark)", marginBottom: "20px" }}>
          Dars bo&apos;limlari
        </div>

        {sections.map((section, si) => (
          <div key={section.id} style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", marginBottom: "16px", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--dark)" }}>
                {si + 1}. {section.title}
                <span style={{ marginLeft: "8px", fontSize: "12px", color: "var(--text3)", fontWeight: 600 }}>
                  ({section.lessons.length} dars)
                </span>
              </div>
              <button onClick={() => deleteSection(section.id)} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "13px", fontWeight: 700 }}>
                O&apos;chirish
              </button>
            </div>

            <div style={{ padding: "12px 18px" }}>
              {section.lessons.length > 0 ? (
                <div style={{ marginBottom: "12px" }}>
                  {section.lessons.map((lesson, li) => (
                    <div key={lesson.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                          <span style={{ fontSize: "12px", color: "var(--text3)", fontWeight: 700, minWidth: "24px" }}>{li + 1}.</span>
                          <span style={{ fontSize: "13.5px", color: "var(--dark)", fontWeight: 600 }}>{lesson.title}</span>
                          {lesson.isFree && <span style={{ background: "#DCFCE7", color: "#15803D", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>Bepul</span>}
                          {lesson.videoId && <span style={{ background: "#EEF2FF", color: "#4F46E5", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: 700 }}>▶ Video</span>}
                          {lesson.duration && <span style={{ fontSize: "12px", color: "var(--text3)" }}>{lesson.duration} min</span>}
                        </div>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <button
                            onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                            style={{ background: expandedLesson === lesson.id ? "#EEF2FF" : "var(--bg)", border: "1px solid var(--border)", color: "#4F46E5", cursor: "pointer", fontSize: "11.5px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px" }}
                          >
                            {expandedLesson === lesson.id ? "▲ Yopish" : "▼ Test & Resurs"}
                          </button>
                          <button onClick={() => deleteLesson(section.id, lesson.id)} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}>
                            ✕
                          </button>
                        </div>
                      </div>
                      {expandedLesson === lesson.id && (
                        <div style={{ paddingBottom: "10px" }}>
                          <LessonDetailLoader lessonId={lesson.id} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "var(--text3)", fontStyle: "italic", marginBottom: "12px" }}>Hali dars qo&apos;shilmagan</p>
              )}

              {/* Add lesson */}
              <div style={{ background: "var(--bg)", borderRadius: "8px", padding: "12px", marginTop: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text2)", marginBottom: "10px" }}>+ Yangi dars qo&apos;shish</div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: "8px", marginBottom: "8px" }}>
                  <input
                    style={{ ...inputS, fontSize: "13px", padding: "8px 12px" }}
                    placeholder="Dars nomi *"
                    value={newLesson[section.id]?.title || ""}
                    onChange={(e) => setNewLesson((n) => ({ ...n, [section.id]: { ...n[section.id], title: e.target.value } }))}
                  />
                  <input
                    style={{ ...inputS, fontSize: "13px", padding: "8px 12px" }}
                    placeholder="YouTube Video ID (opsional)"
                    value={newLesson[section.id]?.videoId || ""}
                    onChange={(e) => setNewLesson((n) => ({ ...n, [section.id]: { ...n[section.id], videoId: e.target.value } }))}
                  />
                  <input
                    style={{ ...inputS, fontSize: "13px", padding: "8px 12px" }}
                    placeholder="Muddat (min)"
                    type="number"
                    value={newLesson[section.id]?.duration || ""}
                    onChange={(e) => setNewLesson((n) => ({ ...n, [section.id]: { ...n[section.id], duration: e.target.value } }))}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={newLesson[section.id]?.isFree || false}
                      onChange={(e) => setNewLesson((n) => ({ ...n, [section.id]: { ...n[section.id], isFree: e.target.checked } }))}
                    />
                    Bepul ko&apos;rish
                  </label>
                  <button
                    onClick={() => addLesson(section.id)}
                    style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "7px 16px", borderRadius: "6px", fontFamily: "inherit", fontWeight: 700, fontSize: "12.5px", cursor: "pointer" }}
                  >
                    Qo&apos;shish
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add section */}
        <div style={{ background: "#fff", border: "1.5px dashed var(--border)", borderRadius: "var(--radius)", padding: "16px 18px", display: "flex", gap: "10px" }}>
          <input
            style={{ ...inputS, flex: 1 }}
            placeholder="Yangi bo'lim nomi (masalan: 1-modul: Kirish)"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSection()}
          />
          <button
            onClick={addSection}
            disabled={addingSection}
            style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontFamily: "inherit", fontWeight: 700, fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {addingSection ? "..." : "+ Bo'lim qo'shish"}
          </button>
        </div>
      </div>

      {/* Final Course Exam */}
      <div style={{ borderTop: "2px solid var(--border)", paddingTop: "32px", marginTop: "8px" }}>
        <div style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "20px", fontWeight: 900, color: "var(--dark)", marginBottom: "4px" }}>
          Yakuniy kurs testi
        </div>
        <div style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "16px" }}>
          Barcha darslarni tugatgan talaba uchun yakuniy imtihon. O&apos;tsa — sertifikat beriladi.
        </div>
        <CourseExamEditor courseId={course.id} />
      </div>
    </div>
  )
}
