import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ textAlign: "center", background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "48px", maxWidth: "440px" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
        <div style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "28px", fontWeight: 900, color: "var(--dark)", marginBottom: "12px" }}>
          To&apos;lov muvaffaqiyatli!
        </div>
        <p style={{ color: "var(--text2)", marginBottom: "28px", lineHeight: 1.7 }}>
          Tabriklaymiz! Kurs sizning kabinetingizga qo&apos;shildi. O&apos;rganishni boshlashingiz mumkin.
        </p>
        <Link href="/dashboard" style={{ background: "var(--primary)", color: "#fff", padding: "13px 32px", borderRadius: "var(--radius-sm)", textDecoration: "none", fontWeight: 700, fontSize: "15px" }}>
          Kabinetga o&apos;tish →
        </Link>
      </div>
    </div>
  )
}
