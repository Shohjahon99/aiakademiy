const promoCards = [
  { icon: "📊", name: "1C:Buxgalteriya 8.3", meta: "42 soat • 3,200 talaba", price: "399k" },
  { icon: "🤖", name: "AI Biznesda", meta: "28 soat • 2,100 talaba", price: "279k" },
  { icon: "💻", name: "Excel & Power BI", meta: "35 soat • 2,640 talaba", price: "320k" },
  { icon: "📈", name: "Digital Marketing", meta: "22 soat • 1,890 talaba", price: "199k" },
]

export function PromoBanner() {
  return (
    <div style={{
      background: "linear-gradient(145deg, #0D1B4B 0%, #0F2460 40%, #1E3A8A 100%)",
      padding: "72px 48px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "-80px", right: "30%",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", right: "-40px",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div style={{ maxWidth: "1140px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center", position: "relative" }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.3)",
            color: "#FCD34D",
            padding: "6px 16px", borderRadius: "20px",
            fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.5px",
            marginBottom: "20px", textTransform: "uppercase",
          }}>
            🏢 Korporativ ta&apos;lim
          </div>
          <div style={{
            fontFamily: "var(--font-raleway), Raleway, sans-serif",
            fontSize: "36px", fontWeight: 900, color: "#fff",
            lineHeight: 1.15, letterSpacing: "-0.5px", marginBottom: "16px",
          }}>
            Jamoangizni{" "}
            <span style={{
              background: "linear-gradient(135deg, #60A5FA, #93C5FD)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              zamonaviy
            </span>
            {" "}ko&apos;nikmalar bilan qurollantiring
          </div>
          <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: "28px" }}>
            Korporativ paketlar, progress monitoring va maxsus narxlar bilan xodimlaringiz samaradorligini oshiring.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
            {[
              { icon: "♾️", text: "Cheksiz foydalanuvchilar qo'shish" },
              { icon: "📊", text: "Xodimlar progressini real vaqtda kuzatish" },
              { icon: "🏆", text: "Kompaniya nomidan sertifikat berish" },
              { icon: "🎬", text: "Maxsus kurslar va videolar buyurtma qilish" },
            ].map((f) => (
              <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontSize: "14px",
                }}>
                  {f.icon}
                </div>
                {f.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button style={{
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#fff", border: "none",
              padding: "13px 28px", borderRadius: "var(--radius-sm)",
              fontFamily: "inherit", fontSize: "15px", fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(245,158,11,0.35)",
            }}>
              Bepul demo so&apos;rash
            </button>
            <button style={{
              background: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "13px 28px", borderRadius: "var(--radius-sm)",
              fontFamily: "inherit", fontSize: "15px", fontWeight: 700,
              cursor: "pointer",
            }}>
              Narxlarni ko&apos;rish
            </button>
          </div>
        </div>

        {/* Right side cards */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          backdropFilter: "blur(10px)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>
          <div style={{
            color: "rgba(255,255,255,0.5)", fontSize: "11.5px",
            fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px",
            marginBottom: "16px",
          }}>
            🔥 Mashhur korporativ kurslar
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {promoCards.map((card, i) => (
              <div key={card.name} style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "var(--radius)",
                padding: "14px 16px",
                display: "flex", alignItems: "center", gap: "14px",
                transition: "all .2s",
                cursor: "pointer",
              }}>
                <div style={{
                  width: "46px", height: "46px", borderRadius: "12px",
                  background: `rgba(96,165,250,${0.08 + i * 0.04})`,
                  border: "1px solid rgba(96,165,250,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", flexShrink: 0,
                }}>
                  {card.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>{card.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 600 }}>{card.meta}</div>
                </div>
                <div style={{
                  background: "rgba(96,165,250,0.15)",
                  border: "1px solid rgba(96,165,250,0.3)",
                  color: "#93C5FD", fontWeight: 900, fontSize: "14px",
                  padding: "4px 10px", borderRadius: "8px",
                }}>
                  {card.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
