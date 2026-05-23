"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(180deg, #0D1B4B 0%, #0A1535 100%)",
      padding: "56px 48px 28px",
      color: "#94A3B8",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1fr 1fr 1fr",
          gap: "48px",
          marginBottom: "48px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
              }}>
                <GraduationCap size={20} color="#fff" />
              </div>
              <div style={{
                fontFamily: "var(--font-raleway), Raleway, sans-serif",
                fontWeight: 900, fontSize: "20px", color: "#fff",
                letterSpacing: "-0.5px",
              }}>
                AI<span style={{ color: "#60A5FA" }}>Akademiy</span>
              </div>
            </div>
            <p style={{
              fontSize: "13.5px", lineHeight: 1.75, color: "#475569",
              maxWidth: "260px", marginBottom: "20px",
            }}>
              O&apos;zbekistondagi eng yirik onlayn ta&apos;lim platformasi. 200+ kurs, 50+ ustoz, 15,000+ talaba.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["📱 App Store", "🤖 Google Play"].map((b) => (
                <div key={b} style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.5)",
                  padding: "6px 14px", borderRadius: "8px",
                  fontSize: "11.5px", fontWeight: 700, cursor: "pointer",
                }}>
                  {b}
                </div>
              ))}
            </div>
          </div>

          <FooterCol title="Kurslar">
            <FooterLink href="/courses?cat=bugalteriya">Bugalteriya</FooterLink>
            <FooterLink href="/courses?cat=ai">Sun&apos;iy Intellekt</FooterLink>
            <FooterLink href="/courses?cat=it">IT & Dasturlash</FooterLink>
            <FooterLink href="/courses?cat=marketing">Marketing</FooterLink>
            <FooterLink href="/courses?cat=dizayn">Dizayn</FooterLink>
            <FooterLink href="/courses?cat=biznes">Biznes</FooterLink>
          </FooterCol>

          <FooterCol title="Platforma">
            <FooterLink href="/about">Haqimizda</FooterLink>
            <FooterLink href="/become-instructor">Ustoz bo&apos;lish</FooterLink>
            <FooterLink href="/corporate">Korporativ ta&apos;lim</FooterLink>
            <FooterLink href="/verify-certificate">Sertifikat tekshirish</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
          </FooterCol>

          <FooterCol title="Aloqa">
            <FooterLink href="tel:+998711234567">📞 +998 71 123-45-67</FooterLink>
            <FooterLink href="mailto:info@aiakademiy.uz">✉️ info@aiakademiy.uz</FooterLink>
            <FooterLink href="#">📍 Toshkent, O&apos;zbekiston</FooterLink>
            <FooterLink href="https://t.me/aiakademiy">💬 Telegram</FooterLink>
          </FooterCol>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "22px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "12px",
        }}>
          <div style={{ fontSize: "13px", color: "#334155", fontWeight: 600 }}>
            © 2024–2026 AIAkademiy. Barcha huquqlar himoyalangan.
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["🔒 Xavfsiz to'lov", "✅ Rasmiy sertifikat", "🇺🇿 O'zbek tili"].map((b) => (
              <div key={b} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#334155",
                padding: "5px 12px", borderRadius: "20px",
                fontSize: "11.5px", fontWeight: 700,
              }}>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: "13.5px", color: "rgba(255,255,255,0.85)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {title}
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        style={{ color: "#475569", textDecoration: "none", fontSize: "13.5px", fontWeight: 600, transition: "color .15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#94A3B8" }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#475569" }}
      >
        {children}
      </Link>
    </li>
  )
}
