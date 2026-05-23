export const dynamic = "force-dynamic"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CourseCard } from "@/components/home/CourseCard"
import { prisma } from "@/lib/prisma"

interface Props {
  searchParams: Promise<{ q?: string; cat?: string; level?: string }>
}

export default async function CoursesPage({ searchParams }: Props) {
  const params = await searchParams
  const { q, cat, level } = params

  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: { where: { published: true } } } } },
  })

  const courses = await prisma.course.findMany({
    where: {
      published: true,
      ...(q && { title: { contains: q } }),
      ...(cat && { category: { slug: cat } }),
      ...(level && { level }),
    },
    include: { category: true, instructor: true },
    orderBy: { studentCount: "desc" },
  })

  const activeCat = categories.find((c) => c.slug === cat)
  const pageTitle = q
    ? `"${q}" bo'yicha natijalar`
    : activeCat
    ? `${activeCat.icon} ${activeCat.name}`
    : "Barcha kurslar"

  const levels = [
    { val: "", label: "Barchasi", icon: "🎯" },
    { val: "BEGINNER", label: "Boshlang'ich", icon: "🌱" },
    { val: "INTERMEDIATE", label: "O'rta", icon: "📈" },
    { val: "ADVANCED", label: "Yuqori", icon: "🚀" },
  ]

  return (
    <>
      <Navbar />

      {/* Top hero strip */}
      <div style={{
        background: "linear-gradient(135deg, #0D1B4B 0%, #1E3A8A 60%, #2563EB 100%)",
        padding: "44px 0 40px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px" }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{
              fontFamily: "var(--font-raleway), Raleway, sans-serif",
              fontSize: "30px", fontWeight: 900, color: "#fff",
              letterSpacing: "-0.3px", marginBottom: "6px",
            }}>
              {pageTitle}
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "14.5px" }}>
              <span style={{ fontWeight: 700, color: "#60A5FA" }}>{courses.length}</span> ta kurs topildi
            </div>
          </div>

          {/* Search bar */}
          <form method="GET" action="/courses" style={{ display: "flex", gap: "10px", maxWidth: "540px" }}>
            {cat && <input type="hidden" name="cat" value={cat} />}
            {level && <input type="hidden" name="level" value={level} />}
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{
                position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                fontSize: "16px", pointerEvents: "none",
              }}>🔍</span>
              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Kurs nomi bo'yicha qidiring..."
                style={{
                  width: "100%", padding: "11px 14px 11px 42px",
                  borderRadius: "10px", border: "none",
                  fontSize: "14px", fontFamily: "inherit",
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff", outline: "none",
                  backdropFilter: "blur(8px)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button type="submit" style={{
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#fff", border: "none",
              padding: "11px 22px", borderRadius: "10px",
              fontFamily: "inherit", fontWeight: 700, fontSize: "14px",
              cursor: "pointer", flexShrink: 0,
            }}>
              Qidirish
            </button>
          </form>
        </div>
      </div>

      <main style={{ background: "#F0F7FF", minHeight: "70vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 40px 60px" }}>
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

            {/* Sidebar */}
            <div style={{ width: "230px", flexShrink: 0, position: "sticky", top: "20px" }}>
              <div style={{ background: "#fff", border: "1px solid #DBEAFE", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(37,99,235,0.07)" }}>

                {/* Kategoriyalar */}
                <div style={{ padding: "16px 18px 8px", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
                    Kategoriyalar
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <a
                      href="/courses"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 10px", borderRadius: "9px",
                        textDecoration: "none",
                        background: !cat ? "#EFF6FF" : "transparent",
                        transition: "background .15s",
                      }}
                    >
                      <span style={{ fontSize: "13.5px", fontWeight: !cat ? 700 : 600, color: !cat ? "#2563EB" : "#475569" }}>
                        🎯 Barchasi
                      </span>
                      <span style={{
                        fontSize: "11px", fontWeight: 700,
                        background: !cat ? "#DBEAFE" : "#F1F5F9",
                        color: !cat ? "#2563EB" : "#94A3B8",
                        padding: "1px 7px", borderRadius: "20px",
                      }}>
                        {categories.reduce((s, c) => s + c._count.courses, 0)}
                      </span>
                    </a>
                    {categories.map((c) => {
                      const active = cat === c.slug
                      return (
                        <a
                          key={c.id}
                          href={`/courses?cat=${c.slug}${level ? `&level=${level}` : ""}`}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "8px 10px", borderRadius: "9px",
                            textDecoration: "none",
                            background: active ? "#EFF6FF" : "transparent",
                          }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: active ? 700 : 500, color: active ? "#2563EB" : "#475569" }}>
                            {c.icon} {c.name}
                          </span>
                          <span style={{
                            fontSize: "11px", fontWeight: 700,
                            background: active ? "#DBEAFE" : "#F1F5F9",
                            color: active ? "#2563EB" : "#94A3B8",
                            padding: "1px 7px", borderRadius: "20px",
                          }}>
                            {c._count.courses}
                          </span>
                        </a>
                      )
                    })}
                  </div>
                </div>

                {/* Daraja */}
                <div style={{ padding: "14px 18px 16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
                    Daraja
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {levels.map((l) => {
                      const active = level === l.val || (!level && l.val === "")
                      return (
                        <a
                          key={l.val}
                          href={`/courses?${cat ? `cat=${cat}&` : ""}${q ? `q=${q}&` : ""}level=${l.val}`}
                          style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            padding: "8px 10px", borderRadius: "9px",
                            textDecoration: "none",
                            background: active ? "#EFF6FF" : "transparent",
                          }}
                        >
                          <span style={{ fontSize: "14px" }}>{l.icon}</span>
                          <span style={{ fontSize: "13px", fontWeight: active ? 700 : 500, color: active ? "#2563EB" : "#475569" }}>
                            {l.label}
                          </span>
                          {active && (
                            <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#2563EB" }} />
                          )}
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Reset filters link */}
              {(cat || level || q) && (
                <a href="/courses" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  marginTop: "12px", padding: "9px",
                  background: "#fff", border: "1px solid #DBEAFE",
                  borderRadius: "10px", textDecoration: "none",
                  fontSize: "13px", fontWeight: 700, color: "#64748B",
                }}>
                  ✕ Filtrlarni tozalash
                </a>
              )}
            </div>

            {/* Course grid */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Sort/count bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ fontSize: "13.5px", color: "#64748B", fontWeight: 600 }}>
                  {courses.length > 0 ? (
                    <><span style={{ fontWeight: 800, color: "#0F172A" }}>{courses.length}</span> ta kurs topildi</>
                  ) : "Natija topilmadi"}
                </div>
                {courses.length > 0 && (
                  <div style={{ fontSize: "12px", color: "#94A3B8", background: "#fff", padding: "5px 12px", borderRadius: "8px", border: "1px solid #E2E8F0", fontWeight: 600 }}>
                    🔥 Mashhurlik bo&apos;yicha
                  </div>
                )}
              </div>

              {courses.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "80px 40px",
                  background: "#fff", borderRadius: "20px",
                  border: "1px solid #DBEAFE",
                }}>
                  <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔍</div>
                  <div style={{ fontWeight: 800, fontSize: "18px", color: "#0F172A", marginBottom: "8px" }}>Kurs topilmadi</div>
                  <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "20px" }}>
                    Boshqa kalit so&apos;z yoki kategoriya bilan qidiring
                  </p>
                  <a href="/courses" style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    color: "#fff", textDecoration: "none",
                    padding: "10px 24px", borderRadius: "10px",
                    fontWeight: 700, fontSize: "14px",
                  }}>
                    Barcha kurslar
                  </a>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px" }}>
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
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
