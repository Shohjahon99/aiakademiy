import { prisma } from "@/lib/prisma"
import { AdminHeader, adminBtn } from "@/components/admin/AdminHeader"
import { NewCourseForm } from "@/components/admin/NewCourseForm"
import Link from "next/link"

export default async function NewCoursePage() {
  const categories = await prisma.category.findMany()
  const instructors = await prisma.instructor.findMany()

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AdminHeader
        title="Yangi kurs yaratish"
        subtitle="Kurs ma'lumotlarini to'ldiring"
        breadcrumbs={[
          { label: "Admin" },
          { label: "Kurslar", href: "/admin/courses" },
          { label: "Yangi kurs" },
        ]}
        action={
          <Link href="/admin/courses" style={{ ...adminBtn, background: "transparent", color: "#64748B", boxShadow: "none", border: "1.5px solid #E2E8F0" }}>
            ← Orqaga
          </Link>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ maxWidth: "800px" }}>
          <NewCourseForm categories={categories} instructors={instructors} />
        </div>
      </div>
    </div>
  )
}
