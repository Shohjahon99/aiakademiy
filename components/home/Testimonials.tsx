import { prisma } from "@/lib/prisma"

export async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({ take: 3 })

  return (
    <div className="r-px" style={{
      background: "linear-gradient(180deg, var(--bg) 0%, #fff 100%)",
      padding: "72px 48px",
    }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-block",
            background: "var(--primary-light)", color: "var(--primary)",
            padding: "5px 16px", borderRadius: "20px",
            fontSize: "12px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "1px",
            marginBottom: "12px",
          }}>
            Talabalar fikri
          </div>
          <div style={{
            fontFamily: "var(--font-raleway), Raleway, sans-serif",
            fontSize: "34px", fontWeight: 900,
            color: "var(--dark)", letterSpacing: "-0.5px",
          }}>
            Ular nima deydi?
          </div>
        </div>

        <div className="r-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "22px" }}>
          {testimonials.map((t) => (
            <div
              key={t.id}
              style={{
                background: "#fff",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all .3s",
              }}
            >
              {/* Quote mark */}
              <div style={{
                fontSize: "64px", lineHeight: 1, color: "var(--primary-light)",
                fontFamily: "Georgia, serif", marginBottom: "2px",
                position: "absolute", top: "16px", right: "22px",
                opacity: 0.6,
              }}>
                &ldquo;
              </div>

              {/* Stars */}
              <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} style={{ color: "#F59E0B", fontSize: "16px" }}>★</span>
                ))}
              </div>

              <p style={{
                fontSize: "14.5px", color: "var(--text2)",
                lineHeight: 1.75, fontWeight: 500,
                marginBottom: "20px", fontStyle: "italic",
                flex: 1,
              }}>
                &ldquo;{t.text}&rdquo;
              </p>

              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                borderTop: "1px solid var(--border)", paddingTop: "16px",
              }}>
                <div style={{
                  width: "46px", height: "46px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.avatarColor}, ${t.avatarColor}bb)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "15px", color: "#fff",
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${t.avatarColor}40`,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--dark)" }}>{t.authorName}</div>
                  <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 600 }}>{t.authorRole}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
