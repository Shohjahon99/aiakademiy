"use client"

import { useState } from "react"

interface Settings {
  clickServiceId: string | null
  clickMerchantId: string | null
  clickSecretKey: string | null
  paymeLogin: string | null
  paymePassword: string | null
  paymeMerchantId: string | null
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState({
    clickServiceId: settings.clickServiceId ?? "",
    clickMerchantId: settings.clickMerchantId ?? "",
    clickSecretKey: settings.clickSecretKey ?? "",
    paymeLogin: settings.paymeLogin ?? "",
    paymePassword: settings.paymePassword ?? "",
    paymeMerchantId: settings.paymeMerchantId ?? "",
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handle = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {saved && (
        <div style={{
          background: "#DCFCE7", border: "1px solid #86EFAC",
          color: "#15803D", padding: "12px 16px",
          borderRadius: "10px", fontSize: "13.5px", fontWeight: 600,
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          ✅ Sozlamalar muvaffaqiyatli saqlandi!
        </div>
      )}

      {/* Click */}
      <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #E8EDF4", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
            💳
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A" }}>Click To&apos;lov tizimi</div>
            <div style={{ fontSize: "12px", color: "#94A3B8" }}>Click Merchant API kalitlari</div>
          </div>
          <div style={{ marginLeft: "auto", background: "#EFF6FF", color: "#2563EB", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>
            {form.clickServiceId ? "✓ Ulangan" : "○ Ulanmagan"}
          </div>
        </div>
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <Field label="Service ID" value={form.clickServiceId} onChange={(v) => handle("clickServiceId", v)} placeholder="12345" />
          <Field label="Merchant ID" value={form.clickMerchantId} onChange={(v) => handle("clickMerchantId", v)} placeholder="12345" />
          <Field label="Secret Key" value={form.clickSecretKey} onChange={(v) => handle("clickSecretKey", v)} placeholder="secret_key_here" type="password" />
        </div>
      </div>

      {/* Payme */}
      <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #E8EDF4", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
            💙
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A" }}>Payme To&apos;lov tizimi</div>
            <div style={{ fontSize: "12px", color: "#94A3B8" }}>Payme Merchant API kalitlari</div>
          </div>
          <div style={{ marginLeft: "auto", background: "#E0F2FE", color: "#0369A1", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>
            {form.paymeMerchantId ? "✓ Ulangan" : "○ Ulanmagan"}
          </div>
        </div>
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <Field label="Merchant ID" value={form.paymeMerchantId} onChange={(v) => handle("paymeMerchantId", v)} placeholder="merchant_id_here" />
          <Field label="Login" value={form.paymeLogin} onChange={(v) => handle("paymeLogin", v)} placeholder="Paycom" />
          <Field label="Parol" value={form.paymePassword} onChange={(v) => handle("paymePassword", v)} placeholder="password_here" type="password" />
        </div>
      </div>

      {/* Info box */}
      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "14px 18px", fontSize: "13px", color: "#92400E", lineHeight: 1.6 }}>
        ⚠️ <strong>Muhim:</strong> Kalitlarni to&apos;g&apos;ri kiriting. Noto&apos;g&apos;ri kalitlar to&apos;lovlarning ishlamasligiga sabab bo&apos;ladi.
        Test rejimida ishlash uchun Click/Payme test kalitlaridan foydalaning.
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
            color: "#fff", border: "none",
            padding: "11px 28px", borderRadius: "9px",
            fontFamily: "inherit", fontWeight: 700, fontSize: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            display: "inline-flex", alignItems: "center", gap: "8px",
          }}
        >
          {loading ? "⏳ Saqlanmoqda..." : "💾 Saqlash"}
        </button>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px",
          border: "1.5px solid #E2E8F0",
          borderRadius: "8px", fontFamily: "inherit",
          fontSize: "13.5px", outline: "none",
          background: "#fff", color: "#0F172A",
          boxSizing: "border-box",
        }}
      />
    </div>
  )
}
