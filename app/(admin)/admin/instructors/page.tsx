export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { InstructorManager } from "@/components/admin/InstructorManager"
import { AdminHeader } from "@/components/admin/AdminHeader"

export default async function AdminInstructorsPage() {
  const instructors = await prisma.instructor.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AdminHeader
        title="Ustozlar"
        subtitle={`Jami ${instructors.length} ta ustoz`}
        breadcrumbs={[{ label: "Admin" }, { label: "Ustozlar" }]}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <InstructorManager initialInstructors={instructors} />
      </div>
    </div>
  )
}
