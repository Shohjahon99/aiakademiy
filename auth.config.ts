import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      const studentPaths = ["/dashboard", "/my-courses", "/learn", "/certificates"]
      const adminPaths = ["/admin"]

      const isStudentPath = studentPaths.some((p) => pathname.startsWith(p))
      const isAdminPath = adminPaths.some((p) => pathname.startsWith(p))

      if ((isStudentPath || isAdminPath) && !isLoggedIn) return false
      if (isAdminPath && isLoggedIn) {
        const role = (auth?.user as { role?: string })?.role
        if (role !== "ADMIN") return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
  },
}
