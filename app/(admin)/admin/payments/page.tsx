import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"
import { AdminHeader, tH, tD } from "@/components/admin/AdminHeader"

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { user: { select: { name: true, email: true } }, course: { select: { title: true, thumbEmoji: true } } },
    orderBy: { createdAt: "desc" },
  })

  const paid = payments.filter((p) => p.status === "PAID")
  const pending = payments.filter((p) => p.status === "PENDING")
  const failed = payments.filter((p) => p.status === "FAILED")
  const totalPaid = paid.reduce((acc, p) => acc + p.amount, 0)
  const clickCount = paid.filter((p) => p.method === "CLICK").length
  const paymeCount = paid.filter((p) => p.method === "PAYME").length

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AdminHeader
        title="To'lovlar"
        subtitle="Barcha to'lovlar tarixi"
        breadcrumbs={[{ label: "Admin" }, { label: "To'lovlar" }]}
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Jami daromad", value: formatPrice(totalPaid), icon: "💰", bg: "#F5F3FF", color: "#7C3AED" },
            { label: "Muvaffaqiyatli", value: paid.length, icon: "✅", bg: "#ECFDF5", color: "#059669" },
            { label: "Kutilmoqda", value: pending.length, icon: "⏳", bg: "#FFFBEB", color: "#D97706" },
            { label: "Rad etilgan", value: failed.length, icon: "❌", bg: "#FEF2F2", color: "#DC2626" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "12px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#0F172A", fontFamily: "var(--font-raleway), Raleway, sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Method split */}
        {paid.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "12px", padding: "16px 22px", marginBottom: "20px", display: "flex", gap: "32px", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "#334155" }}>To&apos;lov usullari:</div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#EFF6FF", color: "#2563EB", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>Click</span>
                <span style={{ fontWeight: 800, color: "#0F172A" }}>{clickCount} ta</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ background: "#ECFDF5", color: "#059669", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 700 }}>Payme</span>
                <span style={{ fontWeight: 800, color: "#0F172A" }}>{paymeCount} ta</span>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #E8EDF4", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 800, fontSize: "14px", color: "#0F172A" }}>To&apos;lovlar ro&apos;yxati</div>
            <div style={{ fontSize: "12px", color: "#94A3B8" }}>{payments.length} ta yozuv</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Talaba", "Kurs", "Summa", "Usul", "Holat", "Trans ID", "Sana"].map((h) => (
                    <th key={h} style={tH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td style={tD}>
                      <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#0F172A" }}>{p.user.name}</div>
                      <div style={{ fontSize: "11.5px", color: "#94A3B8" }}>{p.user.email}</div>
                    </td>
                    <td style={{ ...tD, maxWidth: "200px" }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "13px" }}>
                        {p.course.thumbEmoji} {p.course.title}
                      </div>
                    </td>
                    <td style={tD}>
                      <span style={{ fontWeight: 800, fontSize: "13.5px", color: "#059669" }}>{formatPrice(p.amount)}</span>
                    </td>
                    <td style={tD}>
                      <span style={{
                        background: p.method === "CLICK" ? "#EFF6FF" : "#ECFDF5",
                        color: p.method === "CLICK" ? "#2563EB" : "#059669",
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 700,
                      }}>
                        {p.method}
                      </span>
                    </td>
                    <td style={tD}>
                      <span style={{
                        background: p.status === "PAID" ? "#DCFCE7" : p.status === "PENDING" ? "#FEF3C7" : "#FEE2E2",
                        color: p.status === "PAID" ? "#15803D" : p.status === "PENDING" ? "#B45309" : "#DC2626",
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 700,
                      }}>
                        {p.status === "PAID" ? "✓ To'langan" : p.status === "PENDING" ? "⏳ Kutilmoqda" : "✗ Rad etildi"}
                      </span>
                    </td>
                    <td style={{ ...tD, fontFamily: "monospace", fontSize: "11.5px", color: "#94A3B8" }}>
                      {p.transId || "—"}
                    </td>
                    <td style={{ ...tD, color: "#94A3B8", fontSize: "12px" }}>
                      {new Date(p.createdAt).toLocaleDateString("uz-UZ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {payments.length === 0 && (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>💳</div>
              <div style={{ fontWeight: 700, color: "#334155" }}>Hali to&apos;lov yo&apos;q</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
