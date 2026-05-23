"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { ChevronDown, User, BookOpen, LogOut, LayoutDashboard, GraduationCap, Award } from "lucide-react"

const navLinks = [
  { href: "/courses?cat=bugalteriya", label: "Bugalteriya" },
  { href: "/courses?cat=ai", label: "AI & Texnologiya" },
  { href: "/courses?cat=it", label: "IT & Dasturlash" },
  { href: "/courses?cat=biznes", label: "Biznes" },
  { href: "/courses", label: "Barcha kurslar" },
]

export function Navbar() {
  const { data: session } = useSession()
  const [dropOpen, setDropOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      style={{
        background: scrolled
          ? "rgba(13,27,75,0.97)"
          : "linear-gradient(135deg, #0D1B4B 0%, #112266 60%, #1E3A8A 100%)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        padding: "0 48px",
        display: "flex",
        alignItems: "center",
        height: "68px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        gap: "32px",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.06)",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 32px rgba(13,27,75,0.5)" : "none",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563EB, #60A5FA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
            }}
          >
            <GraduationCap size={20} color="#fff" />
          </div>
          <div
            style={{
              fontFamily: "var(--font-raleway), Raleway, sans-serif",
              fontWeight: 900,
              fontSize: "20px",
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            AI<span style={{ color: "#60A5FA" }}>Akademiy</span>
          </div>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "2px", flex: 1, marginLeft: "8px" }}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: "rgba(255,255,255,0.75)",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: 600,
              padding: "7px 14px",
              borderRadius: "var(--radius-sm)",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.background = "rgba(255,255,255,0.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.75)"
              e.currentTarget.style.background = "transparent"
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Auth area */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
        {session ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropOpen(!dropOpen)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                fontFamily: "inherit",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all .2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.18)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)"
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                {session.user?.name?.[0]?.toUpperCase() || <User size={13} />}
              </div>
              {session.user?.name?.split(" ")[0]}
              <ChevronDown size={14} style={{ opacity: 0.7 }} />
            </button>
            {dropOpen && (
              <>
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 150 }}
                  onClick={() => setDropOpen(false)}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    background: "#fff",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "8px",
                    minWidth: "220px",
                    boxShadow: "0 20px 60px rgba(13,27,75,0.2)",
                    zIndex: 200,
                  }}
                >
                  <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid var(--border)", marginBottom: "6px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--dark)" }}>{session.user?.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text3)", fontWeight: 500 }}>{session.user?.email}</div>
                  </div>
                  {isAdmin && (
                    <Link href="/admin/dashboard" style={dropItem} onClick={() => setDropOpen(false)}>
                      <LayoutDashboard size={15} /> Admin panel
                    </Link>
                  )}
                  <Link href="/dashboard" style={dropItem} onClick={() => setDropOpen(false)}>
                    <BookOpen size={15} /> Dashboard
                  </Link>
                  <Link href="/my-courses" style={dropItem} onClick={() => setDropOpen(false)}>
                    <GraduationCap size={15} /> Mening kurslarim
                  </Link>
                  <Link href="/certificates" style={dropItem} onClick={() => setDropOpen(false)}>
                    <Award size={15} /> Sertifikatlar
                  </Link>
                  <div style={{ borderTop: "1px solid var(--border)", marginTop: "6px", paddingTop: "6px" }}>
                    <button
                      style={{ ...dropItem, border: "none", background: "none", cursor: "pointer", color: "#DC2626", width: "100%" } as React.CSSProperties}
                      onClick={() => { signOut({ callbackUrl: "/" }); setDropOpen(false) }}
                    >
                      <LogOut size={15} /> Chiqish
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link href="/login">
              <button
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                  padding: "8px 20px",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "inherit",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
              >
                Kirish
              </button>
            </Link>
            <Link href="/register">
              <button
                style={{
                  background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                  border: "none",
                  color: "#fff",
                  padding: "9px 22px",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "inherit",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.5)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.4)" }}
              >
                Ro&apos;yxatdan o&apos;tish
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

const dropItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "9px 12px",
  borderRadius: "var(--radius-sm)",
  fontSize: "13.5px",
  fontWeight: 600,
  color: "var(--text)",
  textDecoration: "none",
  cursor: "pointer",
  width: "100%",
  transition: "background .15s",
}
