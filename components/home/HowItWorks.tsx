const steps = [
  {
    icon: "📝",
    num: "01",
    title: "Ro'yxatdan o'ting",
    desc: "1 daqiqada bepul hisob yarating. Elektron pochta yoki telefon raqam yetarli.",
    color: "#2563EB",
  },
  {
    icon: "🎯",
    num: "02",
    title: "Kurs tanlang",
    desc: "200+ kurs orasidan o'zingizga mos yo'nalishni toping va qulay narxda xarid qiling.",
    color: "#7C3AED",
  },
  {
    icon: "📚",
    num: "03",
    title: "O'rganib boring",
    desc: "Video darslar, topshiriqlar va amaliy loyihalar orqali chuqur bilim oling.",
    color: "#059669",
  },
  {
    icon: "🏆",
    num: "04",
    title: "Sertifikat oling",
    desc: "Kursni yakunlab, rasmiy sertifikat oling va karyerangizni yuksaltiring.",
    color: "#D97706",
  },
]

export function HowItWorks() {
  return (
    <div style={{
      background: "linear-gradient(180deg, #fff 0%, var(--bg) 100%)",
      padding: "72px 48px",
    }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{
            display: "inline-block",
            background: "var(--primary-light)", color: "var(--primary)",
            padding: "5px 16px", borderRadius: "20px",
            fontSize: "12px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "1px",
            marginBottom: "12px",
          }}>
            Qanday ishlaydi
          </div>
          <div style={{
            fontFamily: "var(--font-raleway), Raleway, sans-serif",
            fontSize: "34px", fontWeight: 900,
            color: "var(--dark)", letterSpacing: "-0.5px",
          }}>
            O&apos;rganish bu qadar oson
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", position: "relative" }}>
          {/* Connector line */}
          <div style={{
            position: "absolute", top: "52px",
            left: "calc(12.5% + 28px)", right: "calc(12.5% + 28px)",
            height: "2px",
            background: "linear-gradient(90deg, #2563EB, #7C3AED, #059669, #D97706)",
            opacity: 0.25,
            zIndex: 0,
          }} />

          {steps.map((step, i) => (
            <div key={step.title} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "88px", height: "88px", borderRadius: "50%",
                    background: `linear-gradient(135deg, ${step.color}15, ${step.color}08)`,
                    border: `2px solid ${step.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto",
                    fontSize: "32px",
                    boxShadow: `0 8px 28px ${step.color}20`,
                    transition: "all .3s",
                  }}
                >
                  {step.icon}
                </div>
                <div style={{
                  position: "absolute", top: "-6px", right: "-6px",
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: step.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 900, color: "#fff",
                  boxShadow: `0 4px 10px ${step.color}50`,
                }}>
                  {i + 1}
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--dark)", marginBottom: "10px" }}>
                {step.title}
              </div>
              <div style={{ fontSize: "13.5px", color: "var(--text2)", fontWeight: 500, lineHeight: 1.65 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
