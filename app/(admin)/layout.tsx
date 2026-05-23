import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { signOut } from "@/auth"
import { AdminSidebarNav } from "@/components/admin/AdminSidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  const role = (session.user as { role?: string }).role
  if (role !== "ADMIN") redirect("/dashboard")

  const initial = session.user?.name?.[0]?.toUpperCase() ?? "A"

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: "256px", flexShrink: 0,
        background: "linear-gradient(180deg, #0D1B4B 0%, #112266 55%, #1A3A8F 100%)",
        display: "flex", flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #2563EB, #60A5FA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", boxShadow: "0 4px 14px rgba(37,99,235,0.45)",
              flexShrink: 0,
            }}>
              🎓
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-raleway), Raleway, sans-serif", fontWeight: 900, fontSize: "18px", color: "#fff", letterSpacing: "-0.3px" }}>
                AI<span style={{ color: "#60A5FA" }}>Akademiy</span>
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Nav (client component — active state + hover) */}
        <AdminSidebarNav />

        {/* User footer */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: "10px",
            padding: "10px 12px",
            marginBottom: "8px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg, #2563EB, #60A5FA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 800, color: "#fff", flexShrink: 0,
            }}>
              {initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session.user?.name}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Administrator</div>
            </div>
          </div>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
            <button type="submit" style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.45)",
              fontSize: "12.5px", fontWeight: 600,
              cursor: "pointer", padding: "8px 14px",
              borderRadius: "8px", fontFamily: "inherit", width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}>
              🚪 Chiqish
            </button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", background: "#F4F7FB", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  )
}
