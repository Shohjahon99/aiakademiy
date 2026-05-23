import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: { category: true, instructor: true, sections: { include: { lessons: true } } },
      },
      progresses: true,
      certificate: true,
    },
    orderBy: { enrolledAt: "desc" },
  })

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "28px", fontWeight: 900, color: "var(--dark)" }}>
          Xush kelibsiz, {session.user.name?.split(" ")[0]}! 👋
        </div>
        <p style={{ color: "var(--text2)", marginTop: "8px" }}>O&apos;rganishni davom ettiring</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "40px" }}>
        {[
          { icon: "📚", label: "Kurslar", value: enrollments.length },
          { icon: "✅", label: "Tugatilgan", value: enrollments.filter((e) => e.completedAt).length },
          { icon: "🏆", label: "Sertifikatlar", value: enrollments.filter((e) => e.certificate).length },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--dark)", fontFamily: "var(--font-raleway), Raleway, sans-serif" }}>{stat.value}</div>
            <div style={{ fontSize: "13px", color: "var(--text2)", fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "22px", fontWeight: 900, color: "var(--dark)", marginBottom: "20px" }}>
        Mening kurslarim
      </h2>

      {enrollments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
          <div style={{ fontWeight: 700, fontSize: "18px", color: "var(--dark)" }}>Hali kurs sotib olmadingiz</div>
          <Link href="/courses" style={{ display: "inline-block", marginTop: "16px", background: "var(--primary)", color: "#fff", padding: "10px 24px", borderRadius: "var(--radius-sm)", textDecoration: "none", fontWeight: 700 }}>
            Kurslarni ko&apos;rish
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
          {enrollments.map((enrollment) => {
            const totalLessons = enrollment.course.sections.reduce((acc, s) => acc + s.lessons.length, 0)
            const progress = totalLessons > 0 ? Math.round((enrollment.progresses.length / totalLessons) * 100) : 0
            const firstLesson = enrollment.course.sections[0]?.lessons[0]?.id

            return (
              <div key={enrollment.id} style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ height: "120px", background: enrollment.course.thumbColor || "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
                  {enrollment.course.thumbEmoji || "📚"}
                </div>
                <div style={{ padding: "16px" }}>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--dark)", marginBottom: "4px", lineHeight: 1.4 }}>
                    {enrollment.course.title}
                  </div>
                  <div style={{ fontSize: "12.5px", color: "var(--text2)", marginBottom: "12px" }}>
                    {enrollment.course.instructor.name}
                  </div>

                  <div style={{ background: "var(--bg)", borderRadius: "10px", height: "6px", marginBottom: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: "var(--accent2)", borderRadius: "10px", transition: "width .3s" }} />
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text2)", fontWeight: 600, marginBottom: "12px" }}>
                    {progress}% tugatildi
                  </div>

                  {firstLesson ? (
                    <Link
                      href={`/learn/${enrollment.courseId}/${firstLesson}`}
                      style={{ display: "block", background: "var(--primary)", color: "#fff", padding: "8px 0", borderRadius: "var(--radius-sm)", textAlign: "center", textDecoration: "none", fontWeight: 700, fontSize: "13.5px" }}
                    >
                      {progress > 0 ? "Davom ettirish ▶" : "Boshlash ▶"}
                    </Link>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
