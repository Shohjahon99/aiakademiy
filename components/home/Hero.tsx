"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const stats = [
  { num: "15,000+", label: "Talaba", icon: "👥" },
  { num: "200+", label: "Kurs", icon: "📚" },
  { num: "50+", label: "Ustoz", icon: "👨‍🏫" },
  { num: "4.9 ★", label: "Reyting", icon: "⭐" },
]

export function Hero() {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) router.push(`/courses?q=${encodeURIComponent(search)}`)
  }

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #0D1B4B 0%, #0F2460 30%, #1E3A8A 65%, #2563EB 100%)",
        padding: "90px 48px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-120px", right: "-60px",
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", left: "5%",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 65%)",
        }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div style={{ maxWidth: "980px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(245,158,11,0.12)",
          border: "1px solid rgba(245,158,11,0.35)",
          color: "#FCD34D",
          padding: "7px 18px", borderRadius: "40px",
          fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.5px",
          marginBottom: "28px", textTransform: "uppercase",
          boxShadow: "0 0 20px rgba(245,158,11,0.1)",
        }}>
          🇺🇿 O&apos;zbekistondagi №1 onlayn ta&apos;lim platformasi
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: "var(--font-raleway), Raleway, sans-serif",
          fontSize: "clamp(36px, 5.5vw, 58px)",
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1.1,
          letterSpacing: "-1.5px",
          marginBottom: "22px",
        }}>
          Kelajakka{" "}
          <span style={{
            background: "linear-gradient(135deg, #60A5FA, #93C5FD)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            bilim
          </span>{" "}bilan
          <br />
          <span style={{ opacity: 0.9 }}>ishonchli qadam qo&apos;ying</span>
        </h1>

        <p style={{
          fontSize: "17px", color: "rgba(255,255,255,0.65)",
          maxWidth: "580px", margin: "0 auto 38px",
          fontWeight: 500, lineHeight: 1.75,
        }}>
          Bugalteriya, Sun&apos;iy intellekt, IT, Marketing va 50+ yo&apos;nalishda
          professional sertifikatli kurslar. O&apos;z tezligingizda o&apos;rganing.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch}>
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.97)",
            borderRadius: "var(--radius)",
            padding: "6px 6px 6px 22px",
            maxWidth: "620px", margin: "0 auto 52px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
          }}>
            <span style={{ fontSize: "18px", marginRight: "8px", opacity: 0.5, alignSelf: "center" }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qaysi ko'nikmani o'rganmoqchisiz? (Python, 1C, Excel...)"
              style={{
                flex: 1, border: "none", outline: "none",
                fontFamily: "inherit", fontSize: "14.5px",
                color: "var(--text)", fontWeight: 500,
                background: "transparent",
              }}
            />
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "#fff", border: "none",
                padding: "11px 26px", borderRadius: "10px",
                fontFamily: "inherit", fontSize: "14px",
                fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                whiteSpace: "nowrap",
              }}
            >
              Qidirish
            </button>
          </div>
        </form>

        {/* Popular searches */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "52px" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>Mashhur:</span>
          {["1C Buxgalteriya", "Python", "Excel", "Digital Marketing", "ChatGPT"].map((tag) => (
            <Link
              key={tag}
              href={`/courses?q=${encodeURIComponent(tag)}`}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.75)",
                padding: "5px 14px", borderRadius: "20px",
                fontSize: "12.5px", fontWeight: 600,
                textDecoration: "none",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)"
                e.currentTarget.style.color = "#fff"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)"
                e.currentTarget.style.color = "rgba(255,255,255,0.75)"
              }}
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "0",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "var(--radius-lg)",
          backdropFilter: "blur(10px)",
          padding: "8px",
          maxWidth: "700px", margin: "0 auto",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1, textAlign: "center", padding: "16px 12px",
                borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              }}
            >
              <div style={{
                fontSize: "22px", fontWeight: 900, color: "#fff",
                fontFamily: "var(--font-raleway), Raleway, sans-serif",
                letterSpacing: "-0.5px",
              }}>
                {stat.num}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
