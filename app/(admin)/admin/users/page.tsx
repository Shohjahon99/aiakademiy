export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { AdminHeader, tH, tD } from "@/components/admin/AdminHeader"
import { ToggleRoleButton } from "@/components/admin/ToggleRoleButton"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: "desc" },
  })

  const admins = users.filter((u) => u.role === "ADMIN").length
  const instructors = users.filter((u) => u.role === "INSTRUCTOR").length
  const students = users.filter((u) => u.role === "STUDENT").length

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AdminHeader
        title="Foydalanuvchilar"
        subtitle={`Jami ${users.length} ta foydalanuvchi`}
        breadcrumbs={[{ label: "Admin" }, { label: "Foydalanuvchilar" }]}
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Jami", value: users.length, icon: "👥", bg: "#EFF6FF", color: "#2563EB" },
            { label: "Talabalar", value: students, icon: "🎓", bg: "#ECFDF5", color: "#059669" },
            { label: "Ustozlar", value: instructors, icon: "👨‍🏫", bg: "#FFFBEB", color: "#D97706" },
            { label: "Adminlar", value: admins, icon: "🔐", bg: "#F5F3FF", color: "#7C3AED" },
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
            <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A" }}>Barcha foydalanuvchilar</div>
            <div style={{ fontSize: "12px", color: "#94A3B8" }}>{users.length} ta natija</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Foydalanuvchi", "Email", "Telefon", "Rol", "Kurslar", "Qo'shilgan", "Amallar"].map((h) => (
                    <th key={h} style={tH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={tD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "50%",
                          background: u.role === "ADMIN"
                            ? "linear-gradient(135deg, #7C3AED, #A78BFA)"
                            : u.role === "INSTRUCTOR"
                            ? "linear-gradient(135deg, #059669, #34D399)"
                            : "linear-gradient(135deg, #2563EB, #60A5FA)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "13px", fontWeight: 800, color: "#fff", flexShrink: 0,
                        }}>
                          {u.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#0F172A" }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tD, fontSize: "13px", color: "#64748B" }}>{u.email}</td>
                    <td style={{ ...tD, fontSize: "13px", color: "#64748B" }}>{u.phone || "—"}</td>
                    <td style={tD}>
                      <span style={{
                        background: u.role === "ADMIN" ? "#F5F3FF" : u.role === "INSTRUCTOR" ? "#F0FDF4" : "#EFF6FF",
                        color: u.role === "ADMIN" ? "#7C3AED" : u.role === "INSTRUCTOR" ? "#15803D" : "#2563EB",
                        padding: "3px 10px", borderRadius: "20px",
                        fontSize: "11.5px", fontWeight: 700,
                      }}>
                        {u.role === "ADMIN" ? "🔐 Admin" : u.role === "INSTRUCTOR" ? "👨‍🏫 Ustoz" : "🎓 Talaba"}
                      </span>
                    </td>
                    <td style={tD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontWeight: 700, color: "#334155" }}>{u._count.enrollments}</span>
                        <span style={{ fontSize: "11px", color: "#94A3B8" }}>ta kurs</span>
                      </div>
                    </td>
                    <td style={{ ...tD, fontSize: "12px", color: "#94A3B8" }}>
                      {new Date(u.createdAt).toLocaleDateString("uz-UZ")}
                    </td>
                    <td style={tD}>
                      <ToggleRoleButton userId={u.id} currentRole={u.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>👥</div>
              <div style={{ fontWeight: 700, color: "#334155" }}>Foydalanuvchilar yo&apos;q</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
