import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { CourseCard } from "./CourseCard"

export async function PopularCourses() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: { category: true, instructor: true },
    orderBy: { studentCount: "desc" },
    take: 6,
  })

  return (
    <div style={{ padding: "64px 48px", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "36px" }}>
          <div>
            <div style={{
              display: "inline-block",
              background: "var(--primary-light)", color: "var(--primary)",
              padding: "5px 16px", borderRadius: "20px",
              fontSize: "12px", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "1px",
              marginBottom: "10px",
            }}>
              Mashhur kurslar
            </div>
            <div style={{
              fontFamily: "var(--font-raleway), Raleway, sans-serif",
              fontSize: "32px", fontWeight: 900,
              color: "var(--dark)", letterSpacing: "-0.5px",
            }}>
              Eng ko&apos;p sotib olingan kurslar
            </div>
          </div>
          <Link
            href="/courses"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              color: "var(--primary)", fontWeight: 700, fontSize: "14px",
              textDecoration: "none", padding: "9px 18px",
              border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
              background: "#fff", transition: "all .2s",
              marginBottom: "4px",
            }}
          >
            Barchasini ko&apos;rish →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "22px" }}>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              slug={course.slug}
              price={course.price}
              oldPrice={course.oldPrice}
              thumbEmoji={course.thumbEmoji}
              thumbColor={course.thumbColor}
              badge={course.badge}
              rating={course.rating}
              ratingCount={course.ratingCount}
              studentCount={course.studentCount}
              duration={course.duration}
              categoryName={course.category.name}
              instructorName={course.instructor.name}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
