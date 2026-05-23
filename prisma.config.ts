import "dotenv/config";
import { defineConfig } from "prisma/config";

// Railway PostgreSQL uchun SSL qo'shamiz
const rawUrl = process.env["DATABASE_URL"] || "";
const url = rawUrl && !rawUrl.includes("sslmode") && rawUrl.includes("railway")
  ? `${rawUrl}?sslmode=require`
  : rawUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: { url },
});
