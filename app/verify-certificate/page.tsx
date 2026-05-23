export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CertificateVerifyForm } from "@/components/CertificateVerifyForm"

export default async function VerifyCertificatePage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams

  let certificate = null
  if (code) {
    certificate = await prisma.certificate.findUnique({
      where: { code },
      include: {
        enrollment: {
          include: {
            course: { include: { category: true, instructor: true } },
            user: { select: { name: true, email: true } },
          },
        },
      },
    })
  }

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "calc(100vh - 64px)", padding: "60px 20px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏆</div>
            <div style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "32px", fontWeight: 900, color: "var(--dark)" }}>
              Sertifikat tekshirish
            </div>
            <p style={{ color: "var(--text2)", marginTop: "8px", fontSize: "15px" }}>
              Sertifikat kodini kiriting va uning haqiqiyligini tekshiring
            </p>
          </div>

          <CertificateVerifyForm initialCode={code} />

          {code && (
            <div style={{ marginTop: "32px" }}>
              {certificate ? (
                <div style={{ background: "#fff", border: "2px solid #22C55E", borderRadius: "var(--radius)", overflow: "hidden" }}>
                  <div style={{ background: "linear-gradient(135deg, #1A56DB 0%, #0F172A 100%)", padding: "32px", textAlign: "center" }}>
                    <div style={{ color: "#22C55E", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                      ✓ Tasdiqlandi — Haqiqiy sertifikat
                    </div>
                    <div style={{ color: "#fff", fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "20px", fontWeight: 900, lineHeight: 1.4, marginBottom: "8px" }}>
                      {certificate.enrollment.course.title}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                      #{certificate.code}
                    </div>
                  </div>
                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {[
                        { label: "Sertifikat egasi", value: certificate.enrollment.user.name || "—" },
                        { label: "Kurs", value: certificate.enrollment.course.title },
                        { label: "Ustoz", value: certificate.enrollment.course.instructor.name },
                        { label: "Berilgan sana", value: new Date(certificate.issuedAt).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" }) },
                      ].map((item) => (
                        <div key={item.label}>
                          <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--dark)" }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: "#fff", border: "2px solid #DC2626", borderRadius: "var(--radius)", padding: "32px", textAlign: "center" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>❌</div>
                  <div style={{ fontWeight: 700, fontSize: "18px", color: "var(--dark)", marginBottom: "8px" }}>
                    Sertifikat topilmadi
                  </div>
                  <p style={{ color: "var(--text2)", fontSize: "14px" }}>
                    <strong>{code}</strong> kodli sertifikat mavjud emas yoki noto&apos;g&apos;ri kiritildi
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
