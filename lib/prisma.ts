import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaClient } from "@/app/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL!
  const authToken = process.env.DATABASE_AUTH_TOKEN // Turso uchun kerak, local SQLite uchun emas

  const adapter = new PrismaLibSql(
    authToken ? { url, authToken } : { url }
  )
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
