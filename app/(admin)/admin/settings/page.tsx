import { prisma } from "@/lib/prisma"
import { SettingsForm } from "@/components/admin/SettingsForm"
import { AdminHeader } from "@/components/admin/AdminHeader"

export default async function AdminSettingsPage() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } })
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: "settings" } })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AdminHeader
        title="Sozlamalar"
        subtitle="To'lov tizimlarini ulash va boshqarish"
        breadcrumbs={[{ label: "Admin" }, { label: "Sozlamalar" }]}
      />

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ maxWidth: "680px" }}>
          <SettingsForm settings={settings} />
        </div>
      </div>
    </div>
  )
}
