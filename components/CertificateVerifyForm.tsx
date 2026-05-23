"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CertificateVerifyForm({ initialCode }: { initialCode?: string }) {
  const router = useRouter()
  const [code, setCode] = useState(initialCode || "")

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return
    router.push(`/verify-certificate?code=${trimmed}`)
  }

  return (
    <form onSubmit={search} style={{ display: "flex", gap: "10px" }}>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Sertifikat kodi (masalan: ABC123)"
        style={{
          flex: 1,
          padding: "13px 18px",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          fontFamily: "inherit",
          fontSize: "15px",
          outline: "none",
          background: "#fff",
          color: "var(--dark)",
          letterSpacing: "1px",
          fontWeight: 700,
        }}
      />
      <button
        type="submit"
        style={{
          background: "var(--primary)",
          color: "#fff",
          border: "none",
          padding: "13px 28px",
          borderRadius: "var(--radius-sm)",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: "15px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Tekshirish
      </button>
    </form>
  )
}
