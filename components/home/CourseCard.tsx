"use client"

import Link from "next/link"
import { formatPrice } from "@/lib/utils"

interface CourseCardProps {
  id: string
  title: string
  slug: string
  price: number
  oldPrice?: number | null
  thumbEmoji?: string | null
  thumbColor?: string | null
  badge?: string | null
  rating: number
  ratingCount: number
  studentCount: number
  duration?: number | null
  categoryName: string
  instructorName: string
}

const badgeColors: Record<string, { bg: string; color: string; glow: string }> = {
  HOT: { bg: "linear-gradient(135deg,#DC2626,#EF4444)", color: "#fff", glow: "rgba(220,38,38,0.3)" },
  NEW: { bg: "linear-gradient(135deg,#059669,#10B981)", color: "#fff", glow: "rgba(5,150,105,0.3)" },
  TOP: { bg: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", glow: "rgba(79,70,229,0.3)" },
}

export function CourseCard({
  title, slug, price, oldPrice, thumbEmoji, thumbColor,
  badge, rating, ratingCount, studentCount, duration,
  categoryName, instructorName,
}: CourseCardProps) {
  const badgeStyle = badge ? badgeColors[badge] : null

  return (
    <Link href={`/courses/${slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          background: "#fff",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.boxShadow = "0 20px 60px rgba(37,99,235,0.15)"
          el.style.transform = "translateY(-6px)"
          el.style.borderColor = "rgba(37,99,235,0.3)"
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.boxShadow = "none"
          el.style.transform = "none"
          el.style.borderColor = "var(--border)"
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            height: "168px",
            background: thumbColor
              ? `linear-gradient(135deg, ${thumbColor}, ${thumbColor}cc)`
              : "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "52px", position: "relative",
          }}
        >
          {/* Subtle pattern */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.06) 0%, transparent 50%)",
          }} />
          <span style={{ position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>
            {thumbEmoji || "📚"}
          </span>
          {badge && badgeStyle && (
            <span style={{
              position: "absolute", top: "12px", left: "12px",
              padding: "4px 12px", borderRadius: "20px",
              fontSize: "10.5px", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.5px",
              background: badgeStyle.bg, color: badgeStyle.color,
              boxShadow: `0 4px 12px ${badgeStyle.glow}`,
            }}>
              {badge === "HOT" ? "🔥 " : badge === "NEW" ? "✨ " : "⭐ "}{badge}
            </span>
          )}
          {oldPrice && (
            <span style={{
              position: "absolute", top: "12px", right: "12px",
              background: "rgba(245,158,11,0.9)",
              backdropFilter: "blur(4px)",
              color: "#fff", padding: "4px 10px",
              borderRadius: "20px", fontSize: "10.5px", fontWeight: 800,
            }}>
              -{Math.round((1 - price / oldPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "18px 18px 14px" }}>
          <div style={{
            fontSize: "11px", fontWeight: 800, color: "var(--primary)",
            textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "7px",
          }}>
            {categoryName}
          </div>
          <div style={{
            fontWeight: 800, fontSize: "15px", color: "var(--dark)",
            lineHeight: 1.4, marginBottom: "8px",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {title}
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--text2)", fontWeight: 600, marginBottom: "14px", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{
              width: "22px", height: "22px", borderRadius: "50%",
              background: "linear-gradient(135deg, #2563EB, #60A5FA)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px", color: "#fff", fontWeight: 800, flexShrink: 0,
            }}>
              {instructorName[0]}
            </span>
            {instructorName}
          </div>

          {/* Rating & Price */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#F59E0B", fontSize: "13px", letterSpacing: "1px" }}>★★★★★</span>
              <span style={{ color: "var(--text3)", fontWeight: 600, fontSize: "12px" }}>({ratingCount.toLocaleString()})</span>
            </div>
            <div style={{ textAlign: "right" }}>
              {oldPrice && (
                <div style={{ fontSize: "12px", color: "var(--text3)", textDecoration: "line-through", fontWeight: 500 }}>
                  {formatPrice(oldPrice)}
                </div>
              )}
              <div style={{
                fontSize: "17px", fontWeight: 900,
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {formatPrice(price)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "11px 18px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg)",
        }}>
          <div style={{ fontSize: "12px", color: "var(--text2)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
            <span>⏱</span> {duration} soat
          </div>
          <div style={{ fontSize: "12px", color: "var(--text2)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
            <span>👥</span> {studentCount.toLocaleString()} talaba
          </div>
        </div>
      </div>
    </Link>
  )
}
