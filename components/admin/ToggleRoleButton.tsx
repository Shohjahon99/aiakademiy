"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function ToggleRoleButton({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggle = async () => {
    const next = currentRole === "ADMIN" ? "STUDENT" : currentRole === "STUDENT" ? "ADMIN" : "STUDENT"
    setLoading(true)
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: next }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        background: loading ? "#F1F5F9" : "#EFF6FF",
        border: "1.5px solid #DBEAFE",
        color: loading ? "#94A3B8" : "#2563EB",
        padding: "5px 12px",
        borderRadius: "7px",
        fontSize: "12px",
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {loading ? "⏳" : "🔄"} {loading ? "..." : "Rol o'zgartir"}
    </button>
  )
}
