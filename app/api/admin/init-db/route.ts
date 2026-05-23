import { NextResponse } from "next/server"
import { execSync } from "child_process"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

// Bu endpoint bir marta chaqiriladi DB ni ishga tushirish uchun
// SECRET: INIT_SECRET env var bilan himoyalangan
export async function POST(req: Request) {
  const secret = req.headers.get("x-init-secret")
  const expectedSecret = process.env.INIT_SECRET || "aiakademiy-init-2024"

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results: string[] = []

  try {
    // 1. DB schema push
    results.push("Running prisma db push...")
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "pipe",
      timeout: 60000,
      env: { ...process.env },
    })
    results.push("✅ prisma db push muvaffaqiyatli")
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    results.push(`⚠️ prisma db push xatosi: ${msg.substring(0, 200)}`)
    // Davom etamiz — balki jadvallar allaqachon bor
  }

  try {
    // 2. Kategoriyalar
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
    results.push("✅ Kategoriyalar yaratildi")

    // 3. Admin user
    const adminPassword = await hash("admin123456", 12)
    await prisma.user.upsert({
      where: { email: "admin@aiakademiy.uz" },
      update: {},
      create: { name: "Admin", email: "admin@aiakademiy.uz", password: adminPassword, role: "ADMIN" },
    })
    results.push("✅ Admin yaratildi: admin@aiakademiy.uz / admin123456")

    // 4. Instructors
    const instructors = await Promise.all([
      prisma.instructor.upsert({ where: { id: "inst-1" }, update: {}, create: { id: "inst-1", name: "Sardor Toshmatov", role: "Bugalteriya & 1C eksperti", initials: "ST", rating: 4.9, avatarColor: "#1A56DB", bio: "10+ yillik tajribaga ega mutaxassis." } }),
      prisma.instructor.upsert({ where: { id: "inst-2" }, update: {}, create: { id: "inst-2", name: "Nilufar Xasanova", role: "AI & Prompt Engineering", initials: "NX", rating: 4.9, avatarColor: "#10B981", bio: "AI va Machine Learning ekspert." } }),
      prisma.instructor.upsert({ where: { id: "inst-3" }, update: {}, create: { id: "inst-3", name: "Jasur Rahimov", role: "Python & Data Science", initials: "JR", rating: 4.8, avatarColor: "#F59E0B", bio: "Python 7 yillik tajriba." } }),
      prisma.instructor.upsert({ where: { id: "inst-4" }, update: {}, create: { id: "inst-4", name: "Kamola Mirzayeva", role: "Excel & Moliyaviy tahlil", initials: "KM", rating: 4.9, avatarColor: "#8B5CF6", bio: "Moliyaviy tahlil professional." } }),
    ])
    results.push("✅ Ustozlar yaratildi")

    // 5. Courses
    const coursesData = [
      { id: "course-1", title: "1C:Buxgalteriya 8.3 — To'liq kurs", slug: "1c-buxgalteriya-83", description: "1C:Buxgalteriya 8.3 ni noldan o'rganing.", price: 399000, oldPrice: 650000, categoryId: categories[0].id, instructorId: instructors[0].id, duration: 42, badge: "HOT", thumbEmoji: "📊", thumbColor: "#DBEAFE", rating: 5.0, ratingCount: 1240, studentCount: 3200, published: true },
      { id: "course-2", title: "ChatGPT va AI asboblarini biznesda qo'llash", slug: "chatgpt-ai-biznesda", description: "AI asboblarini biznesda ishlatishni o'rganing.", price: 279000, oldPrice: 450000, categoryId: categories[1].id, instructorId: instructors[1].id, duration: 28, badge: "NEW", thumbEmoji: "🤖", thumbColor: "#F0FDF4", rating: 5.0, ratingCount: 876, studentCount: 2100, published: true },
      { id: "course-3", title: "Python dasturlash — Ma'lumotlar tahlili", slug: "python-malumotlar-tahlili", description: "Python, Pandas, NumPy, Matplotlib.", price: 349000, oldPrice: 599000, categoryId: categories[2].id, instructorId: instructors[2].id, duration: 56, badge: "TOP", thumbEmoji: "🐍", thumbColor: "#FEF3C7", rating: 5.0, ratingCount: 2050, studentCount: 5400, published: true },
      { id: "course-4", title: "Instagram & TikTok orqali biznes", slug: "instagram-tiktok-biznes", description: "Ijtimoiy tarmoqlar orqali biznes.", price: 199000, oldPrice: 380000, categoryId: categories[3].id, instructorId: instructors[1].id, duration: 22, badge: "HOT", thumbEmoji: "📈", thumbColor: "#FDF4FF", rating: 4.5, ratingCount: 634, studentCount: 1890, published: true },
      { id: "course-5", title: "Figma va UI/UX Dizayn", slug: "figma-uiux-dizayn", description: "Professional UI/UX dizayn.", price: 299000, oldPrice: 500000, categoryId: categories[4].id, instructorId: instructors[0].id, duration: 38, badge: "NEW", thumbEmoji: "🎨", thumbColor: "#FFF1F2", rating: 5.0, ratingCount: 412, studentCount: 980, published: true },
      { id: "course-6", title: "Excel & Power BI — Moliyaviy tahlil", slug: "excel-powerbi-moliyaviy-tahlil", description: "Excel va Power BI professional tahlil.", price: 320000, oldPrice: 480000, categoryId: categories[0].id, instructorId: instructors[3].id, duration: 35, badge: "TOP", thumbEmoji: "💰", thumbColor: "#ECFDF5", rating: 5.0, ratingCount: 1108, studentCount: 2640, published: true },
    ]

    for (const c of coursesData) {
      await prisma.course.upsert({ where: { id: c.id }, update: {}, create: c as Parameters<typeof prisma.course.upsert>[0]["create"] })
    }
    results.push("✅ Kurslar yaratildi")

    // 6. Sections & Lessons
    const sec1 = await prisma.section.upsert({ where: { id: "sec-1-1" }, update: {}, create: { id: "sec-1-1", title: "Kirish va o'rnatish", order: 1, courseId: "course-1" } })
    const sec2 = await prisma.section.upsert({ where: { id: "sec-1-2" }, update: {}, create: { id: "sec-1-2", title: "Asosiy operatsiyalar", order: 2, courseId: "course-1" } })

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
    results.push("✅ Darslar yaratildi")

    // 7. Testimonials
    await Promise.all([
      prisma.testimonial.upsert({ where: { id: "testi-1" }, update: {}, create: { id: "testi-1", text: "1C kursi menga ish topishda juda yordam berdi!", rating: 5, authorName: "Zulfiya Abdullayeva", authorRole: "Buxgalter, Toshkent", initials: "ZA", avatarColor: "#1A56DB" } }),
      prisma.testimonial.upsert({ where: { id: "testi-2" }, update: {}, create: { id: "testi-2", text: "AI kursidan so'ng biznesimda vaqtim 3 barobarga qisqardi.", rating: 5, authorName: "Bobur Xolmatov", authorRole: "Tadbirkor, Samarqand", initials: "BX", avatarColor: "#10B981" } }),
      prisma.testimonial.upsert({ where: { id: "testi-3" }, update: {}, create: { id: "testi-3", text: "Python kursini tamomladim, Data Analyst bo'ldim.", rating: 5, authorName: "Sherzod Nazarov", authorRole: "Data Analyst, IT kompaniya", initials: "SN", avatarColor: "#F59E0B" } }),
    ])
    results.push("✅ Sharhlar yaratildi")

    results.push("\n🎉 DB muvaffaqiyatli ishga tushdi!")
    return NextResponse.json({ success: true, results })

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    results.push(`❌ Xato: ${msg}`)
    return NextResponse.json({ success: false, results, error: msg }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "DB init endpoint. POST qiling (x-init-secret header bilan)" })
}
