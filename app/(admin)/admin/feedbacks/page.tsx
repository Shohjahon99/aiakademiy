export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { AdminHeader } from "@/components/admin/AdminHeader"

export default async function AdminFeedbacksPage() {
  const testimonials = await prisma.testimonial.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, thumbEmoji: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : "0.0"

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AdminHeader
        title="Sharhlar"
        subtitle={`Jami ${testimonials.length} ta sharh`}
        breadcrumbs={[{ label: "Admin" }, { label: "Sharhlar" }]}
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Jami sharhlar", value: testimonials.length, icon: "💬", bg: "#EFF6FF", color: "#2563EB" },
            { label: "O'rtacha reyting", value: avgRating + " ★", icon: "⭐", bg: "#FFFBEB", color: "#D97706" },
            { label: "5 yulduz", value: testimonials.filter((t) => t.rating === 5).length, icon: "🏆", bg: "#ECFDF5", color: "#059669" },
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

        {testimonials.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>💬</div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "#334155", marginBottom: "6px" }}>Hali sharh yo&apos;q</div>
            <div style={{ fontSize: "13.5px", color: "#94A3B8" }}>Talabalar kurslarni baholashgandan so&apos;ng bu yerda ko&apos;rinadi</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {testimonials.map((t) => (
              <div key={t.id} style={{
                background: "#fff", border: "1px solid #E8EDF4",
                borderRadius: "14px", padding: "20px 24px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "12px", flex: 1 }}>
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", fontWeight: 800, color: "#fff", flexShrink: 0,
                    }}>
                      {t.user?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A" }}>{t.user?.name || t.user?.email || "—"}</span>
                        {t.course && (
                          <span style={{ fontSize: "12px", background: "#EFF6FF", color: "#2563EB", padding: "2px 8px", borderRadius: "20px", fontWeight: 600 }}>
                            {t.course.thumbEmoji} {t.course.title}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "14px", color: "#334155", lineHeight: 1.65, margin: 0 }}>{t.text}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < t.rating ? "#F59E0B" : "#E2E8F0", fontSize: "16px" }}>★</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: "10px", fontSize: "12px", color: "#94A3B8", paddingLeft: "50px" }}>
                  {new Date(t.createdAt).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
