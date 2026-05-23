"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError("Email yoki parol noto'g'ri")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontWeight: 900, fontSize: "28px", color: "var(--dark)" }}>
              AI<span style={{ color: "var(--accent)" }}>Akademiy</span>
            </div>
          </Link>
          <div style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "24px", fontWeight: 900, color: "var(--dark)", marginTop: "20px" }}>
            Xush kelibsiz!
          </div>
          <p style={{ color: "var(--text2)", marginTop: "8px", fontSize: "14px" }}>
            Hisobingizga kiring
          </p>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "32px" }}>
          {error && (
            <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#DC2626", padding: "10px 14px", borderRadius: "var(--radius-sm)", marginBottom: "16px", fontSize: "13.5px", fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13.5px", fontWeight: 700, color: "var(--dark)", marginBottom: "6px" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13.5px", fontWeight: 700, color: "var(--dark)", marginBottom: "6px" }}>
                Parol
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#93BFFD" : "var(--primary)",
                color: "#fff",
                border: "none",
                padding: "13px",
                borderRadius: "var(--radius-sm)",
                fontFamily: "inherit",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "8px",
              }}
            >
              {loading ? "Kirish..." : "Kirish"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13.5px", color: "var(--text2)" }}>
            Hisobingiz yo&apos;qmi?{" "}
            <Link href="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
              Ro&apos;yxatdan o&apos;ting
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  fontFamily: "inherit",
  fontSize: "14px",
  color: "var(--text)",
  outline: "none",
  background: "#fff",
}
