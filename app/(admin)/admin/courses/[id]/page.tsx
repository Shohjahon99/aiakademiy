import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { EditCourseForm } from "@/components/admin/EditCourseForm"

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [course, categories, instructors] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          include: { lessons: { orderBy: { order: "asc" } } },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.category.findMany(),
    prisma.instructor.findMany(),
  ])

  if (!course) notFound()

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AdminHeader
        title={course.title}
        subtitle="Kursni tahrirlash va darslar boshqaruvi"
        breadcrumbs={[
          { label: "Admin" },
          { label: "Kurslar", href: "/admin/courses" },
          { label: course.title },
        ]}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ maxWidth: "860px" }}>
          <EditCourseForm course={course} categories={categories} instructors={instructors} />
        </div>
      </div>
    </div>
  )
}
