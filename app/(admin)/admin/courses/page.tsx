export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { AdminHeader, adminBtn, tH, tD } from "@/components/admin/AdminHeader"

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { category: true, instructor: true, _count: { select: { enrollments: true } } },
    orderBy: { createdAt: "desc" },
  })

  const published = courses.filter((c) => c.published).length
  const drafts = courses.length - published

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AdminHeader
        title="Kurslar"
        subtitle={`Jami ${courses.length} ta kurs`}
        breadcrumbs={[{ label: "Admin" }, { label: "Kurslar" }]}
        action={
          <Link href="/admin/courses/new" style={adminBtn}>
            <span>＋</span> Yangi kurs
          </Link>
        }
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Jami kurslar", value: courses.length, icon: "📚", bg: "#EFF6FF", color: "#2563EB" },
            { label: "Nashr qilingan", value: published, icon: "✅", bg: "#ECFDF5", color: "#059669" },
            { label: "Qoralamalar", value: drafts, icon: "📝", bg: "#FFFBEB", color: "#D97706" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "12px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "#0F172A", fontFamily: "var(--font-raleway), Raleway, sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A" }}>Barcha kurslar</div>
            <div style={{ fontSize: "12px", color: "#94A3B8" }}>{courses.length} ta natija</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Kurs", "Kategoriya", "Ustoz", "Narx", "Talabalar", "Holat", "Amallar"].map((h) => (
                    <th key={h} style={tH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <td style={tD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "42px", height: "42px", borderRadius: "10px",
                          background: c.thumbColor || "#EFF6FF",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "20px", flexShrink: 0,
                        }}>
                          {c.thumbEmoji || "📚"}
                        </div>
                        <div style={{ maxWidth: "220px" }}>
                          <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#0F172A", lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.title}
                          </div>
                          {c.badge && (
                            <span style={{ fontSize: "10px", fontWeight: 700, background: "#FEF9C3", color: "#A16207", padding: "1px 7px", borderRadius: "10px" }}>
                              {c.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={tD}>
                      <span style={{ fontSize: "13px", color: "#334155" }}>{c.category.icon} {c.category.name}</span>
                    </td>
                    <td style={tD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #2563EB, #60A5FA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                          {c.instructor.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span style={{ fontSize: "13px", color: "#334155", fontWeight: 600 }}>{c.instructor.name}</span>
                      </div>
                    </td>
                    <td style={tD}>
                      <span style={{ fontWeight: 800, color: "#059669", fontSize: "13.5px" }}>{formatPrice(c.price)}</span>
                    </td>
                    <td style={tD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ fontSize: "14px" }}>👤</span>
                        <span style={{ fontWeight: 700, fontSize: "13px", color: "#334155" }}>{c._count.enrollments}</span>
                      </div>
                    </td>
                    <td style={tD}>
                      <span style={{
                        background: c.published ? "#DCFCE7" : "#FEF3C7",
                        color: c.published ? "#15803D" : "#B45309",
                        padding: "3px 10px", borderRadius: "20px",
                        fontSize: "11.5px", fontWeight: 700,
                      }}>
                        {c.published ? "● Nashr" : "○ Qoralama"}
                      </span>
                    </td>
                    <td style={tD}>
                      <Link href={`/admin/courses/${c.id}`} style={{
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        background: "#EFF6FF", color: "#2563EB",
                        padding: "5px 12px", borderRadius: "7px",
                        fontSize: "12.5px", fontWeight: 700, textDecoration: "none",
                      }}>
                        ✏️ Tahrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {courses.length === 0 && (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📚</div>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: "8px" }}>Hali kurs qo&apos;shilmagan</div>
              <Link href="/admin/courses/new" style={{ ...adminBtn, display: "inline-flex" }}>
                ＋ Birinchi kursni yarating
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
