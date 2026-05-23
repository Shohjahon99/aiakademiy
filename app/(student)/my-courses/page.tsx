import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function MyCoursesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          category: true,
          instructor: true,
          sections: { include: { lessons: true }, orderBy: { order: "asc" } },
        },
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
          Mening kurslarim
        </div>
        <p style={{ color: "var(--text2)", marginTop: "8px" }}>{enrollments.length} ta kurs sotib olingan</p>
      </div>

      {enrollments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius)" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>
          <div style={{ fontWeight: 700, fontSize: "20px", color: "var(--dark)", marginBottom: "8px" }}>Hali kurs sotib olmadingiz</div>
          <p style={{ color: "var(--text2)", marginBottom: "24px" }}>O&apos;z rivojlanishingizni boshlang va yangi bilimlar oling</p>
          <Link href="/courses" style={{ display: "inline-block", background: "var(--primary)", color: "#fff", padding: "12px 28px", borderRadius: "var(--radius-sm)", textDecoration: "none", fontWeight: 700 }}>
            Kurslarni ko&apos;rish
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {enrollments.map((enrollment) => {
            const totalLessons = enrollment.course.sections.reduce((acc, s) => acc + s.lessons.length, 0)
            const completed = enrollment.progresses.length
            const progress = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0

            const lastSection = enrollment.course.sections.find((s) =>
              s.lessons.some((l) => !enrollment.progresses.find((p) => p.lessonId === l.id))
            )
            const nextLesson = lastSection?.lessons.find((l) => !enrollment.progresses.find((p) => p.lessonId === l.id))
            const firstLesson = enrollment.course.sections[0]?.lessons[0]

            const continueLesson = nextLesson || firstLesson

            return (
              <div
                key={enrollment.id}
                style={{
                  background: "#fff",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "24px",
                  display: "flex",
                  gap: "24px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "12px",
                    background: enrollment.course.thumbColor || "#DBEAFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                    flexShrink: 0,
                  }}
                >
                  {enrollment.course.thumbEmoji || "📚"}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                        {enrollment.course.category.icon} {enrollment.course.category.name}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: "17px", color: "var(--dark)", marginBottom: "4px", lineHeight: 1.4 }}>
                        {enrollment.course.title}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text2)", fontWeight: 600 }}>
                        👨‍🏫 {enrollment.course.instructor.name}
                      </div>
                    </div>

                    {enrollment.certificate && (
                      <span style={{ background: "#DCFCE7", color: "#15803D", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                        🏆 Sertifikat olindi
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600, color: "var(--text2)", marginBottom: "6px" }}>
                      <span>{completed}/{totalLessons} dars tugatildi</span>
                      <span>{progress}%</span>
                    </div>
                    <div style={{ background: "var(--bg)", borderRadius: "10px", height: "8px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          background: progress === 100 ? "#22C55E" : "var(--primary)",
                          borderRadius: "10px",
                          transition: "width .3s",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {continueLesson && (
                      <Link
                        href={`/learn/${enrollment.courseId}/${continueLesson.id}`}
                        style={{
                          background: "var(--primary)",
                          color: "#fff",
                          padding: "9px 20px",
                          borderRadius: "var(--radius-sm)",
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: "13.5px",
                        }}
                      >
                        {progress > 0 && progress < 100 ? "▶ Davom ettirish" : progress === 100 ? "🔄 Qayta ko'rish" : "▶ Boshlash"}
                      </Link>
                    )}
                    <Link
                      href={`/courses/${enrollment.course.slug}`}
                      style={{
                        border: "1.5px solid var(--border)",
                        color: "var(--text2)",
                        padding: "9px 20px",
                        borderRadius: "var(--radius-sm)",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "13.5px",
                      }}
                    >
                      Kurs sahifasi
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
