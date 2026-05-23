"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Category { id: string; name: string; icon: string }
interface Instructor { id: string; name: string }

export function NewCourseForm({ categories, instructors }: { categories: Category[]; instructors: Instructor[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    oldPrice: "",
    categoryId: "",
    instructorId: "",
    duration: "",
    level: "BEGINNER",
    badge: "",
    thumbEmoji: "📚",
    thumbColor: "#DBEAFE",
    published: false,
  })

  const handle = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined, duration: form.duration ? Number(form.duration) : undefined }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || "Xatolik"); return }
    router.push("/admin/courses")
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13.5px" }}>{error}</div>}

      <FormGroup label="Kurs nomi *">
        <input style={inputS} value={form.title} onChange={(e) => handle("title", e.target.value)} required placeholder="Kurs nomini kiriting" />
      </FormGroup>

      <FormGroup label="Tavsif">
        <textarea style={{ ...inputS, height: "100px", resize: "vertical" }} value={form.description} onChange={(e) => handle("description", e.target.value)} placeholder="Kurs haqida qisqacha" />
      </FormGroup>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FormGroup label="Narx (so'm) *">
          <input style={inputS} type="number" value={form.price} onChange={(e) => handle("price", e.target.value)} required placeholder="399000" />
        </FormGroup>
        <FormGroup label="Eski narx (so'm)">
          <input style={inputS} type="number" value={form.oldPrice} onChange={(e) => handle("oldPrice", e.target.value)} placeholder="650000" />
        </FormGroup>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FormGroup label="Kategoriya *">
          <select style={inputS} value={form.categoryId} onChange={(e) => handle("categoryId", e.target.value)} required>
            <option value="">Tanlang</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Ustoz *">
          <select style={inputS} value={form.instructorId} onChange={(e) => handle("instructorId", e.target.value)} required>
            <option value="">Tanlang</option>
            {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </FormGroup>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        <FormGroup label="Davomiyligi (soat)">
          <input style={inputS} type="number" value={form.duration} onChange={(e) => handle("duration", e.target.value)} placeholder="42" />
        </FormGroup>
        <FormGroup label="Daraja">
          <select style={inputS} value={form.level} onChange={(e) => handle("level", e.target.value)}>
            <option value="BEGINNER">Boshlang'ich</option>
            <option value="INTERMEDIATE">O'rta</option>
            <option value="ADVANCED">Yuqori</option>
          </select>
        </FormGroup>
        <FormGroup label="Badge">
          <select style={inputS} value={form.badge} onChange={(e) => handle("badge", e.target.value)}>
            <option value="">Yo'q</option>
            <option value="HOT">HOT 🔥</option>
            <option value="NEW">NEW ✨</option>
            <option value="TOP">TOP ⭐</option>
          </select>
        </FormGroup>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <FormGroup label="Emoji (thumbnail)">
          <input style={inputS} value={form.thumbEmoji} onChange={(e) => handle("thumbEmoji", e.target.value)} placeholder="📊" />
        </FormGroup>
        <FormGroup label="Fon rangi (hex)">
          <input style={inputS} value={form.thumbColor} onChange={(e) => handle("thumbColor", e.target.value)} placeholder="#DBEAFE" />
        </FormGroup>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input type="checkbox" id="published" checked={form.published} onChange={(e) => handle("published", e.target.checked)} />
        <label htmlFor="published" style={{ fontSize: "14px", fontWeight: 700, color: "var(--dark)", cursor: "pointer" }}>Nashr qilish (saytda ko&apos;rinadi)</label>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button type="submit" disabled={loading} style={{ background: "var(--primary)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "8px", fontFamily: "inherit", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
          {loading ? "Saqlanmoqda..." : "Kurs yaratish"}
        </button>
        <button type="button" onClick={() => router.back()} style={{ background: "transparent", border: "1.5px solid var(--border)", color: "var(--text2)", padding: "12px 20px", borderRadius: "8px", fontFamily: "inherit", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
          Bekor qilish
        </button>
      </div>
    </form>
  )
}

function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13.5px", fontWeight: 700, color: "var(--dark)", marginBottom: "6px" }}>{label}</label>
      {children}
    </div>
  )
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
}
