"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { ChevronDown, User, BookOpen, LogOut, LayoutDashboard, GraduationCap, Award, Menu, X } from "lucide-react"

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <nav
        className="r-nav-padding"
        style={{
          background: scrolled
            ? "rgba(13,27,75,0.97)"
            : "linear-gradient(135deg, #0D1B4B 0%, #112266 60%, #1E3A8A 100%)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          height: "64px",
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
            <div style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "linear-gradient(135deg, #2563EB, #60A5FA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37,99,235,0.4)", flexShrink: 0,
            }}>
              <GraduationCap size={18} color="#fff" />
            </div>
            <div style={{
              fontFamily: "var(--font-raleway), Raleway, sans-serif",
              fontWeight: 900, fontSize: "19px", color: "#fff", letterSpacing: "-0.5px",
            }}>
              AI<span style={{ color: "#60A5FA" }}>Akademiy</span>
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="r-hide" style={{ display: "flex", gap: "2px", flex: 1, marginLeft: "8px", overflow: "hidden" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: "rgba(255,255,255,0.75)",
                textDecoration: "none", fontSize: "13.5px", fontWeight: 600,
                padding: "7px 13px", borderRadius: "var(--radius-sm)", transition: "all .2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.background = "transparent" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth area */}
        <div className="r-hide" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {session ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{
                  background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)",
                  color: "#fff", padding: "7px 14px", borderRadius: "var(--radius-sm)",
                  fontFamily: "inherit", fontSize: "13.5px", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                }}
              >
                <div style={{
                  width: "26px", height: "26px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 800,
                }}>
                  {session.user?.name?.[0]?.toUpperCase() || <User size={13} />}
                </div>
                {session.user?.name?.split(" ")[0]}
                <ChevronDown size={14} style={{ opacity: 0.7 }} />
              </button>
              {dropOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 150 }} onClick={() => setDropOpen(false)} />
                  <div style={{
                    position: "absolute", top: "calc(100% + 10px)", right: 0,
                    background: "#fff", border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius)", padding: "8px",
                    minWidth: "220px", boxShadow: "0 20px 60px rgba(13,27,75,0.2)", zIndex: 200,
                  }}>
                    <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid var(--border)", marginBottom: "6px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--dark)" }}>{session.user?.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text3)" }}>{session.user?.email}</div>
                    </div>
                    {isAdmin && <Link href="/admin/dashboard" style={dropItem} onClick={() => setDropOpen(false)}><LayoutDashboard size={15} /> Admin panel</Link>}
                    <Link href="/dashboard" style={dropItem} onClick={() => setDropOpen(false)}><BookOpen size={15} /> Dashboard</Link>
                    <Link href="/my-courses" style={dropItem} onClick={() => setDropOpen(false)}><GraduationCap size={15} /> Mening kurslarim</Link>
                    <Link href="/certificates" style={dropItem} onClick={() => setDropOpen(false)}><Award size={15} /> Sertifikatlar</Link>
                    <div style={{ borderTop: "1px solid var(--border)", marginTop: "6px", paddingTop: "6px" }}>
                      <button style={{ ...dropItem, border: "none", background: "none", cursor: "pointer", color: "#DC2626", width: "100%" } as React.CSSProperties}
                        onClick={() => { signOut({ callbackUrl: "/" }); setDropOpen(false) }}>
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
                <button style={{
                  background: "transparent", border: "1.5px solid rgba(255,255,255,0.3)",
                  color: "#fff", padding: "8px 20px", borderRadius: "var(--radius-sm)",
                  fontFamily: "inherit", fontSize: "13.5px", fontWeight: 600, cursor: "pointer",
                }}>
                  Kirish
                </button>
              </Link>
              <Link href="/register">
                <button style={{
                  background: "linear-gradient(135deg, #2563EB, #60A5FA)", border: "none",
                  color: "#fff", padding: "9px 22px", borderRadius: "var(--radius-sm)",
                  fontFamily: "inherit", fontSize: "13.5px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                }}>
                  Ro&apos;yxatdan o&apos;tish
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger — hidden by default, shown via CSS on mobile */}
        <button
          className="r-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            marginLeft: "auto",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", width: "40px", height: "40px", borderRadius: "8px",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 90,
        }} onClick={() => setMenuOpen(false)}>
          <div
            style={{
              background: "linear-gradient(180deg, #0D1B4B, #112266)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              padding: "12px 0 20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nav links */}
            <div style={{ display: "flex", flexDirection: "column", padding: "0 16px", marginBottom: "12px" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: "rgba(255,255,255,0.8)", textDecoration: "none",
                    padding: "12px 4px", fontSize: "15px", fontWeight: 600,
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    display: "block",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth section */}
            <div style={{ padding: "8px 16px 0" }}>
              {session ? (
                <div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px", background: "rgba(255,255,255,0.07)",
                    borderRadius: "10px", marginBottom: "10px",
                  }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", fontWeight: 800, color: "#fff", flexShrink: 0,
                    }}>
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{session.user?.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>{session.user?.email}</div>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} style={mobileMenuItem}>
                      <LayoutDashboard size={16} /> Admin panel
                    </Link>
                  )}
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={mobileMenuItem}>
                    <BookOpen size={16} /> Dashboard
                  </Link>
                  <Link href="/my-courses" onClick={() => setMenuOpen(false)} style={mobileMenuItem}>
                    <GraduationCap size={16} /> Mening kurslarim
                  </Link>
                  <Link href="/certificates" onClick={() => setMenuOpen(false)} style={mobileMenuItem}>
                    <Award size={16} /> Sertifikatlar
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false) }}
                    style={{ ...mobileMenuItem, color: "#F87171", background: "none", border: "none", width: "100%", cursor: "pointer", fontFamily: "inherit" } as React.CSSProperties}
                  >
                    <LogOut size={16} /> Chiqish
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <button style={{
                      width: "100%", background: "rgba(255,255,255,0.1)",
                      border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff",
                      padding: "12px", borderRadius: "10px", fontFamily: "inherit",
                      fontSize: "15px", fontWeight: 700, cursor: "pointer",
                    }}>
                      Kirish
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    <button style={{
                      width: "100%", background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                      border: "none", color: "#fff", padding: "13px",
                      borderRadius: "10px", fontFamily: "inherit",
                      fontSize: "15px", fontWeight: 700, cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                    }}>
                      Ro&apos;yxatdan o&apos;tish
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const dropItem: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "10px",
  padding: "9px 12px", borderRadius: "var(--radius-sm)",
  fontSize: "13.5px", fontWeight: 600,
  color: "var(--text)", textDecoration: "none",
  cursor: "pointer", width: "100%", transition: "background .15s",
}

const mobileMenuItem: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "10px",
  padding: "12px 10px", color: "rgba(255,255,255,0.75)",
  fontSize: "14.5px", fontWeight: 600, textDecoration: "none",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
}
