import "dotenv/config"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../app/generated/prisma/client"
import { hash } from "bcryptjs"

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seed boshlandi...")

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "bugalteriya" }, update: {}, create: { name: "Bugalteriya & Moliya", slug: "bugalteriya", icon: "📊", color: "#DBEAFE" } }),
    prisma.category.upsert({ where: { slug: "ai" }, update: {}, create: { name: "Sun'iy Intellekt (AI)", slug: "ai", icon: "🤖", color: "#F0FDF4" } }),
    prisma.category.upsert({ where: { slug: "it" }, update: {}, create: { name: "IT & Dasturlash", slug: "it", icon: "💻", color: "#FEF3C7" } }),
    prisma.category.upsert({ where: { slug: "marketing" }, update: {}, create: { name: "Marketing", slug: "marketing", icon: "📈", color: "#FDF4FF" } }),
    prisma.category.upsert({ where: { slug: "dizayn" }, update: {}, create: { name: "Grafik Dizayn", slug: "dizayn", icon: "🎨", color: "#FFF1F2" } }),
    prisma.category.upsert({ where: { slug: "til" }, update: {}, create: { name: "Til O'rganish", slug: "til", icon: "🌐", color: "#ECFDF5" } }),
    prisma.category.upsert({ where: { slug: "video" }, update: {}, create: { name: "Video Montaj", slug: "video", icon: "📹", color: "#EFF6FF" } }),
    prisma.category.upsert({ where: { slug: "biznes" }, update: {}, create: { name: "Biznes & Boshqaruv", slug: "biznes", icon: "🏢", color: "#FFFBEB" } }),
  ])
  console.log("✅ Kategoriyalar yaratildi")

  // Admin user
  const adminPassword = await hash("admin123456", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@aiakademiy.uz" },
    update: {},
    create: { name: "Admin", email: "admin@aiakademiy.uz", password: adminPassword, role: "ADMIN" },
  })
  console.log("✅ Admin yaratildi: admin@aiakademiy.uz / admin123456")

  // Instructors
  const instructors = await Promise.all([
    prisma.instructor.upsert({ where: { id: "inst-1" }, update: {}, create: { id: "inst-1", name: "Sardor Toshmatov", role: "Bugalteriya & 1C eksperti", initials: "ST", rating: 4.9, avatarColor: "#1A56DB", bio: "10+ yillik tajribaga ega 1C va bugalteriya bo'yicha mutaxassis. 3000+ talaba." } }),
    prisma.instructor.upsert({ where: { id: "inst-2" }, update: {}, create: { id: "inst-2", name: "Nilufar Xasanova", role: "AI & Prompt Engineering", initials: "NX", rating: 4.9, avatarColor: "#10B981", bio: "AI va Machine Learning bo'yicha ekspert, Google sertifikatlangan mutaxassis." } }),
    prisma.instructor.upsert({ where: { id: "inst-3" }, update: {}, create: { id: "inst-3", name: "Jasur Rahimov", role: "Python & Data Science", initials: "JR", rating: 4.8, avatarColor: "#F59E0B", bio: "Python dasturlash va Data Science bo'yicha 7 yillik tajriba." } }),
    prisma.instructor.upsert({ where: { id: "inst-4" }, update: {}, create: { id: "inst-4", name: "Kamola Mirzayeva", role: "Excel & Moliyaviy tahlil", initials: "KM", rating: 4.9, avatarColor: "#8B5CF6", bio: "Moliyaviy tahlil va Excel bo'yicha professional. 2000+ talaba." } }),
  ])
  console.log("✅ Ustozlar yaratildi")

  // Courses
  const coursesData = [
    {
      id: "course-1",
      title: "1C:Buxgalteriya 8.3 — To'liq kurs (Noldan professionalgacha)",
      slug: "1c-buxgalteriya-83",
      description: "1C:Buxgalteriya 8.3 dasturini noldan o'rganing. Korxona hisobi, soliq hisoboti, moliyaviy tahlil.",
      price: 399000, oldPrice: 650000, categoryId: categories[0].id, instructorId: instructors[0].id,
      duration: 42, badge: "HOT", thumbEmoji: "📊", thumbColor: "#DBEAFE",
      rating: 5.0, ratingCount: 1240, studentCount: 3200, published: true,
    },
    {
      id: "course-2",
      title: "ChatGPT va AI asboblarini biznesda qo'llash",
      slug: "chatgpt-ai-biznesda",
      description: "ChatGPT, Midjourney, Copilot va boshqa AI asboblarini biznesingizda ishlatishni o'rganing.",
      price: 279000, oldPrice: 450000, categoryId: categories[1].id, instructorId: instructors[1].id,
      duration: 28, badge: "NEW", thumbEmoji: "🤖", thumbColor: "#F0FDF4",
      rating: 5.0, ratingCount: 876, studentCount: 2100, published: true,
    },
    {
      id: "course-3",
      title: "Python dasturlash — Ma'lumotlar tahlili uchun",
      slug: "python-malumotlar-tahlili",
      description: "Python dasturlash tilini noldan o'rganing. Pandas, NumPy, Matplotlib bilan ishlang.",
      price: 349000, oldPrice: 599000, categoryId: categories[2].id, instructorId: instructors[2].id,
      duration: 56, badge: "TOP", thumbEmoji: "🐍", thumbColor: "#FEF3C7",
      rating: 5.0, ratingCount: 2050, studentCount: 5400, published: true,
    },
    {
      id: "course-4",
      title: "Instagram & TikTok orqali biznes — 0 dan 10,000 ta mijozgacha",
      slug: "instagram-tiktok-biznes",
      description: "Ijtimoiy tarmoqlar orqali biznesingizni rivojlantiring. Kontent yaratish, targetlash, savdo.",
      price: 199000, oldPrice: 380000, categoryId: categories[3].id, instructorId: instructors[1].id,
      duration: 22, badge: "HOT", thumbEmoji: "📈", thumbColor: "#FDF4FF",
      rating: 4.5, ratingCount: 634, studentCount: 1890, published: true,
    },
    {
      id: "course-5",
      title: "Figma va UI/UX Dizayn — Loyihalar bilan amaliyot",
      slug: "figma-uiux-dizayn",
      description: "Figma dasturida professional UI/UX dizayn o'rganing. Real loyihalar bilan amaliyot.",
      price: 299000, oldPrice: 500000, categoryId: categories[4].id, instructorId: instructors[0].id,
      duration: 38, badge: "NEW", thumbEmoji: "🎨", thumbColor: "#FFF1F2",
      rating: 5.0, ratingCount: 412, studentCount: 980, published: true,
    },
    {
      id: "course-6",
      title: "Excel & Power BI — Moliyaviy tahlil va hisobotlar",
      slug: "excel-powerbi-moliyaviy-tahlil",
      description: "Excel va Power BI yordamida professional moliyaviy tahlil va interaktiv dashboard.",
      price: 320000, oldPrice: 480000, categoryId: categories[0].id, instructorId: instructors[3].id,
      duration: 35, badge: "TOP", thumbEmoji: "💰", thumbColor: "#ECFDF5",
      rating: 5.0, ratingCount: 1108, studentCount: 2640, published: true,
    },
  ]

  for (const c of coursesData) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    })
  }
  console.log("✅ Kurslar yaratildi")

  // Add sections and lessons to first course
  const sec1 = await prisma.section.upsert({
    where: { id: "sec-1-1" },
    update: {},
    create: { id: "sec-1-1", title: "Kirish va o'rnatish", order: 1, courseId: "course-1" },
  })
  const sec2 = await prisma.section.upsert({
    where: { id: "sec-1-2" },
    update: {},
    create: { id: "sec-1-2", title: "Asosiy operatsiyalar", order: 2, courseId: "course-1" },
  })

  const lessons = [
    { id: "lesson-1", title: "1C nima va nima uchun kerak?", videoId: "dQw4w9WgXcQ", duration: 12, order: 1, isFree: true, sectionId: sec1.id },
    { id: "lesson-2", title: "Dasturni o'rnatish va sozlash", videoId: null, duration: 20, order: 2, isFree: true, sectionId: sec1.id },
    { id: "lesson-3", title: "Birinchi kompaniya yaratish", videoId: null, duration: 15, order: 3, isFree: false, sectionId: sec1.id },
    { id: "lesson-4", title: "Xodimlar ro'yxati va maosh", videoId: null, duration: 25, order: 1, isFree: false, sectionId: sec2.id },
    { id: "lesson-5", title: "Soliq hisoboti", videoId: null, duration: 30, order: 2, isFree: false, sectionId: sec2.id },
  ]
  for (const l of lessons) {
    await prisma.lesson.upsert({ where: { id: l.id }, update: {}, create: l })
  }

  // Testimonials
  await Promise.all([
    prisma.testimonial.upsert({
      where: { id: "testi-1" },
      update: {},
      create: {
        id: "testi-1",
        text: "1C kursi menga ish topishda juda yordam berdi. Ustozning tushuntirish usuli juda tushunarli va amaliyotga yo'naltirilgan. Kursni tugatganimdan keyin 2 hafta o'tib ish topdim!",
        rating: 5, authorName: "Zulfiya Abdullayeva", authorRole: "Buxgalter, Toshkent", initials: "ZA", avatarColor: "#1A56DB",
      },
    }),
    prisma.testimonial.upsert({
      where: { id: "testi-2" },
      update: {},
      create: {
        id: "testi-2",
        text: "AI kursidan so'ng biznesimda ChatGPT va boshqa asboblarni qo'llay boshladim. Vaqtim 3 barobarga qisqardi. Bu platforma haqiqatan investitsiya!",
        rating: 5, authorName: "Bobur Xolmatov", authorRole: "Tadbirkor, Samarqand", initials: "BX", avatarColor: "#10B981",
      },
    }),
    prisma.testimonial.upsert({
      where: { id: "testi-3" },
      update: {},
      create: {
        id: "testi-3",
        text: "Python kursini tamomladim, endi Data Analyst lavozimida ishlamoqdaman. Kurs juda strukturalangan, har bir mavzu amaliy loyiha bilan mustahkamlangan.",
        rating: 5, authorName: "Sherzod Nazarov", authorRole: "Data Analyst, IT kompaniya", initials: "SN", avatarColor: "#F59E0B",
      },
    }),
  ])
  console.log("✅ Testimoniallar yaratildi")

  console.log("\n🎉 Seed muvaffaqiyatli tugadi!")
  console.log("📧 Admin: admin@aiakademiy.uz")
  console.log("🔑 Parol: admin123456")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
