"use client"

import Link from "next/link"

export function CTA() {
  return (
    <div className="r-px" style={{
      background: "linear-gradient(145deg, #0D1B4B 0%, #112266 50%, #2563EB 100%)",
      padding: "80px 48px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "400px",
          background: "radial-gradient(ellipse, rgba(96,165,250,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.35)",
          color: "#34D399",
          padding: "6px 18px", borderRadius: "40px",
          fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.5px",
          marginBottom: "24px", textTransform: "uppercase",
        }}>
          ✓ Birinchi kurslar bepul
        </div>

        <div style={{
          fontFamily: "var(--font-raleway), Raleway, sans-serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 900, color: "#fff",
          letterSpacing: "-1px", lineHeight: 1.12, marginBottom: "18px",
        }}>
          Bugun{" "}
          <span style={{
            background: "linear-gradient(135deg, #60A5FA, #93C5FD)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            o&apos;rganishni
          </span>
          {" "}boshlang!
        </div>

        <p style={{
          fontSize: "17px", color: "rgba(255,255,255,0.6)",
          marginBottom: "36px", fontWeight: 500, lineHeight: 1.75,
          maxWidth: "540px", margin: "0 auto 36px",
        }}>
          15,000+ talabaga qo&apos;shilib, kasbiy ko&apos;nikmalaringizni oshiring.
          Sertifikatli kurslar, amaliy loyihalar va professional ustozlar sizni kutmoqda.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
          <Link href="/register">
            <button style={{
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#fff", border: "none",
              padding: "15px 40px", borderRadius: "var(--radius)",
              fontFamily: "inherit", fontSize: "16px", fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(245,158,11,0.4)",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(245,158,11,0.5)" }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(245,158,11,0.4)" }}
            >
              Bepul boshlash →
            </button>
          </Link>
          <Link href="/courses">
            <button style={{
              background: "rgba(255,255,255,0.08)",
              border: "2px solid rgba(255,255,255,0.25)",
              color: "#fff",
              padding: "15px 40px", borderRadius: "var(--radius)",
              fontFamily: "inherit", fontSize: "16px", fontWeight: 700,
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)" }}
            >
              Kurslarni ko&apos;rish
            </button>
          </Link>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "40px", flexWrap: "wrap" }}>
          {["🔒 Xavfsiz to'lov", "✅ Rasmiy sertifikat", "📱 Mobil ilova", "💬 24/7 Yordam"].map((badge) => (
            <div key={badge} style={{
              fontSize: "13px", color: "rgba(255,255,255,0.45)",
              fontWeight: 600,
            }}>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
