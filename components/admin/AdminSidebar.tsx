"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/admin/courses", icon: "📚", label: "Kurslar" },
  { href: "/admin/instructors", icon: "👨‍🏫", label: "Ustozlar" },
  { href: "/admin/users", icon: "👥", label: "Foydalanuvchilar" },
  { href: "/admin/payments", icon: "💳", label: "To'lovlar" },
  { href: "/admin/feedbacks", icon: "💬", label: "Sharhlar" },
  { href: "/admin/settings", icon: "⚙️", label: "Sozlamalar" },
]

export function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <nav style={{ flex: 1, padding: "10px 12px", overflowY: "auto" }}>
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
              padding: "10px 14px",
              color: active ? "#fff" : "rgba(255,255,255,0.55)",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: active ? 700 : 600,
              borderRadius: "10px",
              marginBottom: "2px",
              background: active
                ? "rgba(255,255,255,0.14)"
                : "transparent",
              borderLeft: active ? "3px solid #60A5FA" : "3px solid transparent",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.color = "#fff"
                e.currentTarget.style.background = "rgba(255,255,255,0.08)"
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.color = "rgba(255,255,255,0.55)"
                e.currentTarget.style.background = "transparent"
              }
            }}
          >
            <span style={{ fontSize: "17px", minWidth: "20px", textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
