import React from "react"
import Link from "next/link"

interface Breadcrumb { label: string; href?: string }

interface AdminHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  action?: React.ReactNode
}

export function AdminHeader({ title, subtitle, breadcrumbs, action }: AdminHeaderProps) {
  return (
    <div style={{
      background: "#fff",
      borderBottom: "1px solid #E8EDF4",
      padding: "20px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      flexShrink: 0,
    }}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={b.label}>
                {i > 0 && <span style={{ color: "#CBD5E1", fontSize: "12px" }}>›</span>}
                {b.href ? (
                  <Link href={b.href} style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 600, textDecoration: "none" }}>
                    {b.label}
                  </Link>
                ) : (
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#0F172A", fontFamily: "var(--font-raleway), Raleway, sans-serif", letterSpacing: "-0.3px" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "13.5px", color: "#64748B", marginTop: "2px", fontWeight: 500 }}>{subtitle}</p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}

export const adminBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
  color: "#fff",
  border: "none",
  padding: "9px 20px",
  borderRadius: "8px",
  fontFamily: "inherit",
  fontWeight: 700,
  fontSize: "13.5px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
  textDecoration: "none",
}

export const adminCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E8EDF4",
  borderRadius: "12px",
  overflow: "hidden",
}

export const tH: React.CSSProperties = {
  padding: "11px 20px",
  textAlign: "left",
  fontSize: "11.5px",
  fontWeight: 700,
  color: "#94A3B8",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  whiteSpace: "nowrap",
}

export const tD: React.CSSProperties = {
  padding: "13px 20px",
  fontSize: "13.5px",
  color: "#334155",
  borderBottom: "1px solid #F1F5F9",
  verticalAlign: "middle",
}
