import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { formatPrice } from "@/lib/utils"
import { EnrollButton } from "@/components/courses/EnrollButton"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await auth()

  const course = await prisma.course.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      instructor: true,
      sections: {
        include: { lessons: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!course) notFound()

  const enrollment = session?.user?.id
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      })
    : null

  const isEnrolled = !!enrollment
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div style={{ background: "var(--dark)", padding: "48px 40px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 400px", gap: "48px", alignItems: "start" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                {course.category.icon} {course.category.name}
              </div>
              {course.badge && (
                <span style={{ background: course.badge === "HOT" ? "#FEE2E2" : course.badge === "NEW" ? "#DCFCE7" : "#EEF2FF", color: course.badge === "HOT" ? "#DC2626" : course.badge === "NEW" ? "#15803D" : "#4F46E5", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, marginBottom: "12px", display: "inline-block" }}>
                  {course.badge}
                </span>
              )}
              <h1 style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "36px", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
                {course.title}
              </h1>
              <p style={{ fontSize: "16px", color: "#94A3B8", lineHeight: 1.7, marginBottom: "24px" }}>
                {course.description}
              </p>
              <div style={{ display: "flex", gap: "24px", color: "#94A3B8", fontSize: "14px" }}>
                <span>⭐ {course.rating} ({course.ratingCount.toLocaleString()} sharh)</span>
                <span>👥 {course.studentCount.toLocaleString()} talaba</span>
                <span>⏱ {course.duration} soat</span>
                <span>📊 {course.level === "BEGINNER" ? "Boshlang'ich" : course.level === "INTERMEDIATE" ? "O'rta" : "Yuqori"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: course.instructor.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>
                  {course.instructor.initials}
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700 }}>{course.instructor.name}</div>
                  <div style={{ color: "#64748B", fontSize: "13px" }}>{course.instructor.role}</div>
                </div>
              </div>
            </div>

            {/* Price card */}
            <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", overflow: "hidden", position: "sticky", top: "80px" }}>
              <div style={{ height: "180px", background: course.thumbColor || "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px" }}>
                {course.thumbEmoji || "📚"}
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "20px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 900, color: "var(--primary)" }}>{formatPrice(course.price)}</span>
                  {course.oldPrice && <span style={{ fontSize: "16px", color: "var(--text3)", textDecoration: "line-through" }}>{formatPrice(course.oldPrice)}</span>}
                </div>

                <EnrollButton
                  courseId={course.id}
                  courseTitle={course.title}
                  price={course.price}
                  isEnrolled={isEnrolled}
                  isLoggedIn={!!session}
                  firstLesson={course.sections[0]?.lessons[0]?.id}
                  courseSlug={course.slug}
                />

                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { icon: "⏱", text: `${course.duration} soat video dars` },
                    { icon: "📱", text: "Telefon va kompyuterdan kirish" },
                    { icon: "🏆", text: "Rasmiy sertifikat" },
                    { icon: "♾️", text: "Umrbod kirish huquqi" },
                  ].map((item) => (
                    <div key={item.text} style={{ display: "flex", gap: "10px", fontSize: "13.5px", color: "var(--text2)", fontWeight: 600 }}>
                      <span>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course content */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "48px" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontSize: "24px", fontWeight: 900, color: "var(--dark)", marginBottom: "24px" }}>
                O&apos;quv dasturi
              </h2>
              <div style={{ fontSize: "14px", color: "var(--text2)", marginBottom: "20px" }}>
                {course.sections.length} bo&apos;lim • {totalLessons} dars
              </div>

              {course.sections.map((section) => (
                <div key={section.id} style={{ marginBottom: "16px", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                  <div style={{ background: "var(--bg)", padding: "14px 18px", fontWeight: 700, fontSize: "14px", color: "var(--dark)" }}>
                    {section.title} ({section.lessons.length} dars)
                  </div>
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      style={{
                        padding: "12px 18px",
                        borderTop: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "13.5px",
                        color: "var(--text2)",
                      }}
                    >
                      <span>{lesson.isFree ? "▶️" : "🔒"}</span>
                      <span style={{ flex: 1 }}>{lesson.title}</span>
                      {lesson.isFree && (
                        <span style={{ fontSize: "11px", background: "#DCFCE7", color: "#15803D", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                          Bepul
                        </span>
                      )}
                      {lesson.duration && <span style={{ color: "var(--text3)" }}>{lesson.duration} min</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ paddingTop: "60px" }}>
              <h3 style={{ fontWeight: 800, fontSize: "18px", color: "var(--dark)", marginBottom: "16px" }}>
                Ustoz haqida
              </h3>
              <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: course.instructor.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "18px" }}>
                    {course.instructor.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--dark)" }}>{course.instructor.name}</div>
                    <div style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 700 }}>{course.instructor.role}</div>
                  </div>
                </div>
                {course.instructor.bio && (
                  <p style={{ fontSize: "13.5px", color: "var(--text2)", lineHeight: 1.7 }}>{course.instructor.bio}</p>
                )}
                <div style={{ display: "flex", gap: "20px", marginTop: "12px", fontSize: "13px", color: "var(--text2)" }}>
                  <span>⭐ {course.instructor.rating} reyting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
