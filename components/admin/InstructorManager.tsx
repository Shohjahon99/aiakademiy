"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Instructor {
  id: string
  name: string
  bio: string | null
  role: string
  avatar: string | null
  rating: number
  initials: string
  avatarColor: string
  _count: { courses: number }
}

const inputS: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #E2E8F0",
  borderRadius: "8px",
  fontFamily: "inherit",
  fontSize: "13.5px",
  color: "#0F172A",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
}

const emptyForm = { name: "", bio: "", role: "", avatar: "", rating: "4.8" }

export function InstructorManager({ initialInstructors }: { initialInstructors: Instructor[] }) {
  const router = useRouter()
  const [instructors, setInstructors] = useState(initialInstructors)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handle = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const openNew = () => {
    setEditId(null)
    setForm(emptyForm)
    setShowForm(true)
    setError("")
  }

  const openEdit = (ins: Instructor) => {
    setEditId(ins.id)
    setForm({ name: ins.name, bio: ins.bio || "", role: ins.role || "", avatar: ins.avatar || "", rating: String(ins.rating) })
    setShowForm(true)
    setError("")
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    const url = editId ? `/api/admin/instructors/${editId}` : "/api/admin/instructors"
    const method = editId ? "PUT" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || "Xatolik"); return }
    if (editId) {
      setInstructors((list) => list.map((i) => i.id === editId ? { ...data, _count: i._count } : i))
    } else {
      setInstructors((list) => [{ ...data, _count: { courses: 0 } }, ...list])
    }
    setShowForm(false)
    router.refresh()
  }

  const deleteIns = async (id: string) => {
    if (!confirm("Ustozni o'chirishni tasdiqlaysizmi?")) return
    const res = await fetch(`/api/admin/instructors/${id}`, { method: "DELETE" })
    if (res.ok) setInstructors((list) => list.filter((i) => i.id !== id))
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 600 }}>{instructors.length} ta ustoz</div>
        <button onClick={openNew} style={{
          background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
          color: "#fff", border: "none",
          padding: "9px 20px", borderRadius: "8px",
          fontFamily: "inherit", fontWeight: 700, fontSize: "13.5px",
          cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
        }}>
          ＋ Yangi ustoz
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ fontWeight: 800, fontSize: "15px", color: "#0F172A", marginBottom: "18px" }}>
            {editId ? "✏️ Ustozni tahrirlash" : "➕ Yangi ustoz qo'shish"}
          </div>
          {error && (
            <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13.5px", marginBottom: "14px" }}>
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "5px" }}>Ism *</label>
                <input style={inputS} value={form.name} onChange={(e) => handle("name", e.target.value)} required placeholder="Sardor Rahimov" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "5px" }}>Lavozim</label>
                <input style={inputS} value={form.role} onChange={(e) => handle("role", e.target.value)} placeholder="Senior React Developer" />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "5px" }}>Bio</label>
              <textarea style={{ ...inputS, height: "80px", resize: "vertical" }} value={form.bio} onChange={(e) => handle("bio", e.target.value)} placeholder="Ustoz haqida qisqacha ma'lumot..." />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "5px" }}>Avatar URL (opsional)</label>
                <input style={inputS} value={form.avatar} onChange={(e) => handle("avatar", e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "5px" }}>Reyting (0–5)</label>
                <input style={inputS} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => handle("rating", e.target.value)} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={loading} style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "#fff", border: "none",
                padding: "10px 24px", borderRadius: "8px",
                fontFamily: "inherit", fontWeight: 700, fontSize: "13.5px",
                cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading ? "⏳ Saqlanmoqda..." : editId ? "💾 Saqlash" : "➕ Qo'shish"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                background: "transparent", border: "1.5px solid #E2E8F0",
                color: "#64748B", padding: "10px 18px", borderRadius: "8px",
                fontFamily: "inherit", fontWeight: 600, fontSize: "13.5px", cursor: "pointer",
              }}>
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {instructors.map((ins) => (
          <div key={ins.id} style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: ins.avatar ? "transparent" : "linear-gradient(135deg, #2563EB, #60A5FA)",
                border: "2px solid #DBEAFE",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ins.avatar ? "0px" : "18px", fontWeight: 800, color: "#fff",
                flexShrink: 0, overflow: "hidden",
              }}>
                {ins.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ins.avatar} alt={ins.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "18px" }}>{ins.initials || ins.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: "15px", color: "#0F172A" }}>{ins.name}</div>
                {ins.role && <div style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 600 }}>{ins.role}</div>}
              </div>
            </div>

            {ins.bio && <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.65, margin: 0 }}>{ins.bio}</p>}

            <div style={{ display: "flex", gap: "12px", fontSize: "12.5px", fontWeight: 600, color: "#94A3B8" }}>
              <span style={{ background: "#FFFBEB", color: "#D97706", padding: "2px 8px", borderRadius: "10px" }}>⭐ {ins.rating}</span>
              <span style={{ background: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: "10px" }}>📚 {ins._count.courses} kurs</span>
            </div>

            <div style={{ display: "flex", gap: "8px", paddingTop: "8px", borderTop: "1px solid #F1F5F9" }}>
              <button onClick={() => openEdit(ins)} style={{
                flex: 1, background: "#EFF6FF", border: "none",
                color: "#2563EB", padding: "7px 0", borderRadius: "7px",
                fontFamily: "inherit", fontWeight: 700, fontSize: "12.5px", cursor: "pointer",
              }}>
                ✏️ Tahrirlash
              </button>
              <button onClick={() => deleteIns(ins.id)} style={{
                background: "#FEE2E2", border: "none",
                color: "#DC2626", padding: "7px 14px", borderRadius: "7px",
                fontFamily: "inherit", fontWeight: 700, fontSize: "12.5px", cursor: "pointer",
              }}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {instructors.length === 0 && !showForm && (
        <div style={{ textAlign: "center", padding: "60px", background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>👨‍🏫</div>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#334155", marginBottom: "6px" }}>Hali ustoz qo&apos;shilmagan</div>
          <div style={{ fontSize: "13px", color: "#94A3B8" }}>Yuqoridagi tugma orqali ustoz qo&apos;shing</div>
        </div>
      )}
    </div>
  )
}
