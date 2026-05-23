import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function CertificatesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const certificates = await prisma.certificate.findMany({
    where: { enrollment: { userId: session.user.id } },
    include: {
      enrollment: {
        include: {
          course: { include: { category: true, instructor: true } },
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  })

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "28px", fontWeight: 900, color: "var(--dark)" }}>
          Mening sertifikatlarim
        </div>
        <p style={{ color: "var(--text2)", marginTop: "8px" }}>{certificates.length} ta sertifikat</p>
      </div>

      {certificates.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius)" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🏆</div>
          <div style={{ fontWeight: 700, fontSize: "20px", color: "var(--dark)", marginBottom: "8px" }}>
            Hali sertifikat olmagansiz
          </div>
          <p style={{ color: "var(--text2)", marginBottom: "24px" }}>
            Kursni to&apos;liq tugatgach sertifikat beriladi
          </p>
          <Link
            href="/my-courses"
            style={{ display: "inline-block", background: "var(--primary)", color: "#fff", padding: "12px 28px", borderRadius: "var(--radius-sm)", textDecoration: "none", fontWeight: 700 }}
          >
            Mening kurslarim
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {certificates.map((cert) => (
            <div
              key={cert.id}
              style={{
                background: "#fff",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
              }}
            >
              {/* Certificate visual */}
              <div
                style={{
                  background: "linear-gradient(135deg, #1A56DB 0%, #0F172A 100%)",
                  padding: "32px 24px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏆</div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                  Muvaffaqiyat sertifikati
                </div>
                <div style={{ color: "#fff", fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "16px", fontWeight: 900, lineHeight: 1.4 }}>
                  {cert.enrollment.course.title}
                </div>
                <div style={{ marginTop: "16px", padding: "6px 16px", background: "rgba(245, 158, 11, 0.2)", borderRadius: "20px", display: "inline-block" }}>
                  <span style={{ color: "#F59E0B", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>
                    #{cert.code}
                  </span>
                </div>
              </div>

              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "8px",
                      background: cert.enrollment.course.thumbColor || "#DBEAFE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      flexShrink: 0,
                    }}
                  >
                    {cert.enrollment.course.thumbEmoji || "📚"}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--dark)", lineHeight: 1.4 }}>
                      {cert.enrollment.course.title}
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--text2)", fontWeight: 600, marginTop: "2px" }}>
                      👨‍🏫 {cert.enrollment.course.instructor.name}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "12px", color: "var(--text3)" }}>
                    📅 {new Date(cert.issuedAt).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  <a
                    href={`/verify/${cert.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "12.5px", color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}
                  >
                    Tekshirish →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
