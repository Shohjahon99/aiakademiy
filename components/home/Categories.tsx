import { prisma } from "@/lib/prisma"
import { CategoryCard } from "./CategoryCard"

export async function Categories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { courses: { where: { published: true } } } } },
  })

  return (
    <div className="r-px" style={{ padding: "72px 48px 40px", background: "#fff" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            display: "inline-block",
            background: "var(--primary-light)",
            color: "var(--primary)",
            padding: "5px 16px", borderRadius: "20px",
            fontSize: "12px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "1px",
            marginBottom: "12px",
          }}>
            Ta&apos;lim yo&apos;nalishlari
          </div>
          <div style={{
            fontFamily: "var(--font-raleway), Raleway, sans-serif",
            fontSize: "34px", fontWeight: 900,
            color: "var(--dark)", letterSpacing: "-0.5px",
            marginBottom: "10px",
          }}>
            Barcha sohalarda ekspert bo&apos;ling
          </div>
          <div style={{ fontSize: "15.5px", color: "var(--text2)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
            50+ yo&apos;nalishda kurslar — har biri professional ustoz tomonidan tayyorlangan
          </div>
        </div>

        <div className="r-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              slug={cat.slug}
              icon={cat.icon}
              name={cat.name}
              color={cat.color}
              courseCount={cat._count.courses}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
