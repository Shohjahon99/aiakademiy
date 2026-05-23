export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

export default async function AdminDashboard() {
  const [userCount, courseCount, paymentData, enrollmentCount, recentPayments, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true }, _count: true }),
    prisma.enrollment.count(),
    prisma.payment.findMany({
      where: { status: "PAID" },
      include: { user: { select: { name: true, email: true } }, course: { select: { title: true, thumbEmoji: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, role: true },
    }),
  ])

  const stats = [
    { icon: "👥", label: "Foydalanuvchilar", value: userCount.toLocaleString(), sub: "Jami ro'yxatdan o'tganlar", color: "#2563EB", bg: "#EFF6FF" },
    { icon: "📚", label: "Faol kurslar", value: courseCount.toLocaleString(), sub: "Nashr qilingan kurslar", color: "#059669", bg: "#ECFDF5" },
    { icon: "📝", label: "Ro'yxatlar", value: enrollmentCount.toLocaleString(), sub: "Kursga yozilganlar", color: "#D97706", bg: "#FFFBEB" },
    { icon: "💰", label: "Daromad", value: formatPrice(paymentData._sum.amount ?? 0), sub: `${paymentData._count} ta to'lov`, color: "#7C3AED", bg: "#F5F3FF" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AdminHeader title="Dashboard" subtitle="Platformaning umumiy ko'rinishi" />

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginBottom: "28px" }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              background: "#fff",
              border: "1px solid #E8EDF4",
              borderRadius: "14px",
              padding: "22px 24px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: "80px", height: "80px",
                background: s.bg,
                borderRadius: "0 14px 0 100%",
              }} />
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", marginBottom: "14px",
              }}>
                {s.icon}
              </div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A", fontFamily: "var(--font-raleway), Raleway, sans-serif", marginBottom: "4px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#334155" }}>{s.label}</div>
              <div style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 500, marginTop: "2px" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
          {/* Recent Payments */}
          <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "15px", color: "#0F172A" }}>So&apos;nggi to&apos;lovlar</div>
                <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "1px" }}>Oxirgi muvaffaqiyatli to&apos;lovlar</div>
              </div>
              <Link href="/admin/payments" style={{ fontSize: "13px", color: "#2563EB", fontWeight: 700, textDecoration: "none" }}>
                Hammasini ko&apos;rish →
              </Link>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Talaba", "Kurs", "Summa", "Usul", "Sana"].map((h) => (
                    <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ padding: "11px 18px", borderBottom: "1px solid #F8FAFC" }}>
                      <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A" }}>{p.user.name}</div>
                      <div style={{ fontSize: "11.5px", color: "#94A3B8" }}>{p.user.email}</div>
                    </td>
                    <td style={{ padding: "11px 18px", borderBottom: "1px solid #F8FAFC", fontSize: "13px", color: "#334155", maxWidth: "180px" }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.course.thumbEmoji} {p.course.title}
                      </div>
                    </td>
                    <td style={{ padding: "11px 18px", borderBottom: "1px solid #F8FAFC" }}>
                      <span style={{ fontWeight: 800, fontSize: "13.5px", color: "#059669" }}>{formatPrice(p.amount)}</span>
                    </td>
                    <td style={{ padding: "11px 18px", borderBottom: "1px solid #F8FAFC" }}>
                      <span style={{ background: p.method === "CLICK" ? "#EFF6FF" : "#ECFDF5", color: p.method === "CLICK" ? "#2563EB" : "#059669", padding: "3px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 700 }}>
                        {p.method}
                      </span>
                    </td>
                    <td style={{ padding: "11px 18px", borderBottom: "1px solid #F8FAFC", fontSize: "12.5px", color: "#94A3B8" }}>
                      {new Date(p.createdAt).toLocaleDateString("uz-UZ")}
                    </td>
                  </tr>
                ))}
                {recentPayments.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>Hali to&apos;lov yo&apos;q</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Users + Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Quick links */}
            <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", padding: "18px" }}>
              <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A", marginBottom: "14px" }}>Tez harakatlar</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { href: "/admin/courses/new", icon: "➕", label: "Yangi kurs qo'shish", color: "#EFF6FF", text: "#2563EB" },
                  { href: "/admin/instructors", icon: "👨‍🏫", label: "Ustoz qo'shish", color: "#ECFDF5", text: "#059669" },
                  { href: "/admin/users", icon: "👥", label: "Foydalanuvchilar", color: "#F5F3FF", text: "#7C3AED" },
                  { href: "/admin/settings", icon: "⚙️", label: "Sozlamalar", color: "#FFFBEB", text: "#D97706" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 14px", borderRadius: "10px",
                    background: item.color, textDecoration: "none",
                    transition: "opacity .15s",
                  }}>
                    <span style={{ fontSize: "17px" }}>{item.icon}</span>
                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: item.text }}>{item.label}</span>
                    <span style={{ marginLeft: "auto", color: item.text, opacity: 0.5 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent users */}
            <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", padding: "18px", flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A", marginBottom: "14px" }}>
                Yangi foydalanuvchilar
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentUsers.map((u) => (
                  <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 800, color: "#fff", flexShrink: 0,
                    }}>
                      {u.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: "11.5px", color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {u.email}
                      </div>
                    </div>
                    <span style={{
                      fontSize: "10.5px", fontWeight: 700,
                      background: u.role === "ADMIN" ? "#F5F3FF" : "#F0FDF4",
                      color: u.role === "ADMIN" ? "#7C3AED" : "#15803D",
                      padding: "2px 8px", borderRadius: "20px",
                    }}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
