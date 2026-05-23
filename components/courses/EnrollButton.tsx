"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { formatPrice } from "@/lib/utils"

interface Props {
  courseId: string
  courseTitle: string
  price: number
  isEnrolled: boolean
  isLoggedIn: boolean
  firstLesson?: string
  courseSlug: string
}

export function EnrollButton({ courseId, courseTitle, price, isEnrolled, isLoggedIn, firstLesson, courseSlug }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  if (isEnrolled && firstLesson) {
    return (
      <button
        onClick={() => router.push(`/learn/${courseId}/${firstLesson}`)}
        style={btnStyle("#10B981")}
      >
        ▶ O&apos;rganishni davom ettirish
      </button>
    )
  }

  const handleEnroll = async (method: "CLICK" | "PAYME") => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/courses/${courseSlug}`)
      return
    }
    setLoading(true)
    const res = await fetch("/api/payment/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, method }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert("To'lov tizimida xatolik")
    }
    setLoading(false)
  }

  if (!isLoggedIn) {
    return (
      <button onClick={() => router.push(`/login?redirect=/courses/${courseSlug}`)} style={btnStyle("var(--primary)")}>
        Kursga yozilish — {formatPrice(price)}
      </button>
    )
  }

  if (showPayment) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--dark)", marginBottom: "4px" }}>To'lov usulini tanlang:</div>
        <button
          onClick={() => handleEnroll("CLICK")}
          disabled={loading}
          style={{ ...btnStyle("#1A56DB"), display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          💳 Click orqali to&apos;lash
        </button>
        <button
          onClick={() => handleEnroll("PAYME")}
          disabled={loading}
          style={{ ...btnStyle("#00B3E3"), display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          💙 Payme orqali to&apos;lash
        </button>
        <button
          onClick={() => setShowPayment(false)}
          style={{ background: "transparent", border: "1.5px solid var(--border)", color: "var(--text2)", padding: "10px", borderRadius: "var(--radius-sm)", fontFamily: "inherit", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}
        >
          Bekor qilish
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setShowPayment(true)} style={btnStyle("var(--primary)")}>
      Kursga yozilish — {formatPrice(price)}
    </button>
  )
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    width: "100%",
    background: bg,
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "var(--radius-sm)",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  }
}
