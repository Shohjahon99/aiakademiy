"use client"

import Link from "next/link"

interface CategoryCardProps {
  id: string
  slug: string
  icon: string
  name: string
  color: string | null
  courseCount: number
}

export function CategoryCard({ slug, icon, name, color, courseCount }: CategoryCardProps) {
  return (
    <Link
      href={`/courses?cat=${slug}`}
      style={{
        background: "#fff",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "22px 18px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        textDecoration: "none",
        color: "inherit",
        transition: "all .25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = "var(--primary)"
        el.style.boxShadow = "0 8px 32px rgba(37,99,235,0.15)"
        el.style.transform = "translateY(-3px)"
        el.style.background = "var(--primary-light)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = "var(--border)"
        el.style.boxShadow = "none"
        el.style.transform = "none"
        el.style.background = "#fff"
      }}
    >
      <div style={{
        width: "48px", height: "48px",
        borderRadius: "12px",
        background: color || "var(--primary-light)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "24px", flexShrink: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--dark)", lineHeight: 1.3, marginBottom: "3px" }}>
          {name}
        </div>
        <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 700 }}>
          {courseCount} kurs →
        </div>
      </div>
    </Link>
  )
}
