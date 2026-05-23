import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const studentPaths = ["/dashboard", "/my-courses", "/learn", "/certificates"]
  const adminPaths = ["/admin"]

  const isStudentPath = studentPaths.some((p) => pathname.startsWith(p))
  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p))

  if (isStudentPath || isAdminPath) {
    const sessionToken = req.cookies.get("authjs.session-token")?.value || req.cookies.get("__Secure-authjs.session-token")?.value

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/my-courses/:path*", "/learn/:path*", "/certificates/:path*", "/admin/:path*"],
}
