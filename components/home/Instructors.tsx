import { prisma } from "@/lib/prisma"

export async function Instructors() {
  const instructors = await prisma.instructor.findMany({
    take: 4,
    include: { _count: { select: { courses: true } } },
  })

  return (
    <div className="r-px" style={{ padding: "72px 48px", background: "#fff" }}>
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
            Ustoz va murabbiylar
          </div>
          <div style={{
            fontFamily: "var(--font-raleway), Raleway, sans-serif",
            fontSize: "34px", fontWeight: 900,
            color: "var(--dark)", letterSpacing: "-0.5px", marginBottom: "10px",
          }}>
            Professional ustozlardan o&apos;rganing
          </div>
          <div style={{ fontSize: "15.5px", color: "var(--text2)", maxWidth: "480px", margin: "0 auto" }}>
            Har biri o&apos;z sohasida 5+ yillik tajribaga ega amaliyotchi mutaxassislar
          </div>
        </div>

        <div className="r-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "22px" }}>
          {instructors.map((inst) => (
            <div
              key={inst.id}
              style={{
                background: "#fff",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "28px 20px 22px",
                textAlign: "center",
                transition: "all .3s",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background accent */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "80px",
                background: `linear-gradient(135deg, ${inst.avatarColor}15, ${inst.avatarColor}08)`,
              }} />

              {/* Avatar */}
              <div style={{
                width: "80px", height: "80px", borderRadius: "50%",
                margin: "0 auto 16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", fontWeight: 800, color: "#fff",
                background: `linear-gradient(135deg, ${inst.avatarColor}, ${inst.avatarColor}bb)`,
                boxShadow: `0 8px 24px ${inst.avatarColor}50`,
                border: "3px solid #fff",
                position: "relative",
              }}>
                {inst.initials}
              </div>

              <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--dark)", marginBottom: "4px" }}>
                {inst.name}
              </div>
              <div style={{
                fontSize: "12.5px", color: "var(--primary)", fontWeight: 700,
                marginBottom: "16px",
                background: "var(--primary-light)", display: "inline-block",
                padding: "3px 12px", borderRadius: "20px",
              }}>
                {inst.role}
              </div>

              <div style={{
                display: "flex", justifyContent: "center", gap: "20px",
                paddingTop: "14px", borderTop: "1px solid var(--border)",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontWeight: 900, fontSize: "18px", color: "var(--dark)",
                    fontFamily: "var(--font-raleway), Raleway, sans-serif",
                  }}>
                    {inst.rating}⭐
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px", marginTop: "2px" }}>
                    Reyting
                  </div>
                </div>
                <div style={{ width: "1px", background: "var(--border)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontWeight: 900, fontSize: "18px", color: "var(--dark)",
                    fontFamily: "var(--font-raleway), Raleway, sans-serif",
                  }}>
                    {inst._count.courses}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px", marginTop: "2px" }}>
                    Kurs
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
