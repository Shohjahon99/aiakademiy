import { NextResponse } from "next/server"
import { Pool } from "pg"
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
  const dbUrl = process.env.DATABASE_URL || ""

  // Masked URL for debugging
  const maskedUrl = dbUrl.replace(/:([^@]+)@/, ":***@")
  results.push(`DB URL: ${maskedUrl.substring(0, 80)}`)

  // Try different SSL configs
  const sslConfigs = [
    { rejectUnauthorized: false },
    true,
    false,
  ]

  let pool: Pool | null = null
  for (const ssl of sslConfigs) {
    try {
      const testPool = new Pool({ connectionString: dbUrl, ssl })
      const client = await testPool.connect()
      await client.query("SELECT 1")
      client.release()
      pool = testPool
      results.push(`✅ DB ulanish OK (ssl: ${JSON.stringify(ssl)})`)
      break
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      results.push(`⚠️ ssl=${JSON.stringify(ssl)} xato: ${msg.substring(0, 100)}`)
    }
  }

  if (!pool) {
    return NextResponse.json({ success: false, results, error: "Barcha SSL variantlari ishlamadi" }, { status: 500 })
  }

  // Create all tables
  const createSQL = `
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "phone" TEXT,
      "role" TEXT NOT NULL DEFAULT 'STUDENT',
      "avatar" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "User_email_key" UNIQUE ("email")
    );

    CREATE TABLE IF NOT EXISTS "Category" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "icon" TEXT NOT NULL,
      "color" TEXT NOT NULL,
      CONSTRAINT "Category_slug_key" UNIQUE ("slug")
    );

    CREATE TABLE IF NOT EXISTS "Instructor" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "bio" TEXT,
      "avatar" TEXT,
      "initials" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "avatarColor" TEXT NOT NULL DEFAULT '#1A56DB',
      "userId" TEXT,
      CONSTRAINT "Instructor_userId_key" UNIQUE ("userId"),
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Course" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "description" TEXT,
      "price" INTEGER NOT NULL,
      "oldPrice" INTEGER,
      "thumbnail" TEXT,
      "thumbEmoji" TEXT,
      "thumbColor" TEXT,
      "duration" INTEGER,
      "level" TEXT NOT NULL DEFAULT 'BEGINNER',
      "badge" TEXT,
      "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "ratingCount" INTEGER NOT NULL DEFAULT 0,
      "studentCount" INTEGER NOT NULL DEFAULT 0,
      "published" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "categoryId" TEXT NOT NULL,
      "instructorId" TEXT NOT NULL,
      CONSTRAINT "Course_slug_key" UNIQUE ("slug"),
      FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON UPDATE CASCADE,
      FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Section" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      "courseId" TEXT NOT NULL,
      FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Lesson" (
      "id" TEXT PRIMARY KEY,
      "title" TEXT NOT NULL,
      "videoId" TEXT,
      "duration" INTEGER,
      "order" INTEGER NOT NULL,
      "isFree" BOOLEAN NOT NULL DEFAULT false,
      "sectionId" TEXT NOT NULL,
      FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Enrollment" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "courseId" TEXT NOT NULL,
      "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "completedAt" TIMESTAMP(3),
      CONSTRAINT "Enrollment_userId_courseId_key" UNIQUE ("userId", "courseId"),
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON UPDATE CASCADE,
      FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "LessonProgress" (
      "id" TEXT PRIMARY KEY,
      "enrollmentId" TEXT NOT NULL,
      "lessonId" TEXT NOT NULL,
      "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "LessonProgress_enrollmentId_lessonId_key" UNIQUE ("enrollmentId", "lessonId"),
      FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON UPDATE CASCADE,
      FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Certificate" (
      "id" TEXT PRIMARY KEY,
      "enrollmentId" TEXT NOT NULL,
      "code" TEXT NOT NULL,
      "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Certificate_enrollmentId_key" UNIQUE ("enrollmentId"),
      CONSTRAINT "Certificate_code_key" UNIQUE ("code"),
      FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Payment" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "courseId" TEXT NOT NULL,
      "amount" INTEGER NOT NULL,
      "method" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "transId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON UPDATE CASCADE,
      FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "Testimonial" (
      "id" TEXT PRIMARY KEY,
      "text" TEXT NOT NULL,
      "rating" INTEGER NOT NULL DEFAULT 5,
      "authorName" TEXT NOT NULL,
      "authorRole" TEXT NOT NULL,
      "initials" TEXT NOT NULL,
      "avatarColor" TEXT NOT NULL DEFAULT '#1A56DB',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "userId" TEXT,
      "courseId" TEXT,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
      FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "SiteSettings" (
      "id" TEXT PRIMARY KEY,
      "clickServiceId" TEXT NOT NULL DEFAULT '',
      "clickMerchantId" TEXT NOT NULL DEFAULT '',
      "clickSecretKey" TEXT NOT NULL DEFAULT '',
      "paymeLogin" TEXT NOT NULL DEFAULT '',
      "paymePassword" TEXT NOT NULL DEFAULT '',
      "paymeMerchantId" TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS "QuizQuestion" (
      "id" TEXT PRIMARY KEY,
      "lessonId" TEXT NOT NULL,
      "question" TEXT NOT NULL,
      "options" TEXT NOT NULL,
      "answer" INTEGER NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "LessonResource" (
      "id" TEXT PRIMARY KEY,
      "lessonId" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "CourseExam" (
      "id" TEXT PRIMARY KEY,
      "courseId" TEXT NOT NULL,
      "title" TEXT NOT NULL DEFAULT 'Yakuniy test',
      "passMark" INTEGER NOT NULL DEFAULT 70,
      CONSTRAINT "CourseExam_courseId_key" UNIQUE ("courseId"),
      FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "ExamQuestion" (
      "id" TEXT PRIMARY KEY,
      "examId" TEXT NOT NULL,
      "question" TEXT NOT NULL,
      "options" TEXT NOT NULL,
      "answer" INTEGER NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY ("examId") REFERENCES "CourseExam"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "ExamAttempt" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "examId" TEXT NOT NULL,
      "courseId" TEXT NOT NULL,
      "score" INTEGER NOT NULL,
      "passed" BOOLEAN NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON UPDATE CASCADE,
      FOREIGN KEY ("examId") REFERENCES "CourseExam"("id") ON UPDATE CASCADE
    );
  `

  try {
    await pool.query(createSQL)
    results.push("✅ Barcha jadvallar yaratildi")
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    results.push(`❌ Jadval yaratish xatosi: ${msg}`)
    await pool.end()
    return NextResponse.json({ success: false, results, error: msg }, { status: 500 })
  }

  // Generate CUID-like IDs
  function cuid() {
    return "c" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  try {
    // Categories
    const cats = [
      { id: cuid(), name: "Bugalteriya & Moliya", slug: "bugalteriya", icon: "📊", color: "#DBEAFE" },
      { id: cuid(), name: "Sun'iy Intellekt (AI)", slug: "ai", icon: "🤖", color: "#F0FDF4" },
      { id: cuid(), name: "IT & Dasturlash", slug: "it", icon: "💻", color: "#FEF3C7" },
      { id: cuid(), name: "Marketing", slug: "marketing", icon: "📈", color: "#FDF4FF" },
      { id: cuid(), name: "Grafik Dizayn", slug: "dizayn", icon: "🎨", color: "#FFF1F2" },
      { id: cuid(), name: "Til O'rganish", slug: "til", icon: "🌐", color: "#ECFDF5" },
      { id: cuid(), name: "Video Montaj", slug: "video", icon: "📹", color: "#EFF6FF" },
      { id: cuid(), name: "Biznes & Boshqaruv", slug: "biznes", icon: "🏢", color: "#FFFBEB" },
    ]
    for (const c of cats) {
      await pool.query(
        `INSERT INTO "Category" ("id","name","slug","icon","color") VALUES ($1,$2,$3,$4,$5) ON CONFLICT ("slug") DO NOTHING`,
        [c.id, c.name, c.slug, c.icon, c.color]
      )
    }
    results.push("✅ Kategoriyalar kiritildi")

    // Admin user
    const adminPwd = await hash("admin123456", 12)
    const adminId = cuid()
    await pool.query(
      `INSERT INTO "User" ("id","name","email","password","role") VALUES ($1,$2,$3,$4,$5) ON CONFLICT ("email") DO NOTHING`,
      [adminId, "Admin", "admin@aiakademiy.uz", adminPwd, "ADMIN"]
    )
    results.push("✅ Admin yaratildi: admin@aiakademiy.uz / admin123456")

    // Instructors
    const insts = [
      { id: "inst-1", name: "Sardor Toshmatov", role: "Bugalteriya & 1C eksperti", initials: "ST", rating: 4.9, avatarColor: "#1A56DB", bio: "10+ yillik tajribaga ega mutaxassis." },
      { id: "inst-2", name: "Nilufar Xasanova", role: "AI & Prompt Engineering", initials: "NX", rating: 4.9, avatarColor: "#10B981", bio: "AI va Machine Learning ekspert." },
      { id: "inst-3", name: "Jasur Rahimov", role: "Python & Data Science", initials: "JR", rating: 4.8, avatarColor: "#F59E0B", bio: "Python 7 yillik tajriba." },
      { id: "inst-4", name: "Kamola Mirzayeva", role: "Excel & Moliyaviy tahlil", initials: "KM", rating: 4.9, avatarColor: "#8B5CF6", bio: "Moliyaviy tahlil professional." },
    ]
    for (const i of insts) {
      await pool.query(
        `INSERT INTO "Instructor" ("id","name","role","initials","rating","avatarColor","bio") VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT ("id") DO NOTHING`,
        [i.id, i.name, i.role, i.initials, i.rating, i.avatarColor, i.bio]
      )
    }
    results.push("✅ Ustozlar kiritildi")

    // Get category IDs
    const catRows = await pool.query(`SELECT id, slug FROM "Category"`)
    const catMap: Record<string, string> = {}
    for (const row of catRows.rows) catMap[row.slug] = row.id

    // Courses
    const now = new Date().toISOString()
    const courses = [
      { id: "course-1", title: "1C:Buxgalteriya 8.3 — To'liq kurs", slug: "1c-buxgalteriya-83", description: "1C ni noldan o'rganing.", price: 399000, oldPrice: 650000, catSlug: "bugalteriya", instId: "inst-1", duration: 42, badge: "HOT", thumbEmoji: "📊", thumbColor: "#DBEAFE", rating: 5.0, ratingCount: 1240, studentCount: 3200 },
      { id: "course-2", title: "ChatGPT va AI asboblarini biznesda qo'llash", slug: "chatgpt-ai-biznesda", description: "AI asboblarini qo'llang.", price: 279000, oldPrice: 450000, catSlug: "ai", instId: "inst-2", duration: 28, badge: "NEW", thumbEmoji: "🤖", thumbColor: "#F0FDF4", rating: 5.0, ratingCount: 876, studentCount: 2100 },
      { id: "course-3", title: "Python dasturlash — Ma'lumotlar tahlili", slug: "python-malumotlar-tahlili", description: "Python, Pandas, NumPy.", price: 349000, oldPrice: 599000, catSlug: "it", instId: "inst-3", duration: 56, badge: "TOP", thumbEmoji: "🐍", thumbColor: "#FEF3C7", rating: 5.0, ratingCount: 2050, studentCount: 5400 },
      { id: "course-4", title: "Instagram & TikTok orqali biznes", slug: "instagram-tiktok-biznes", description: "Ijtimoiy tarmoqlar orqali biznes.", price: 199000, oldPrice: 380000, catSlug: "marketing", instId: "inst-2", duration: 22, badge: "HOT", thumbEmoji: "📈", thumbColor: "#FDF4FF", rating: 4.5, ratingCount: 634, studentCount: 1890 },
      { id: "course-5", title: "Figma va UI/UX Dizayn", slug: "figma-uiux-dizayn", description: "Professional UI/UX dizayn.", price: 299000, oldPrice: 500000, catSlug: "dizayn", instId: "inst-1", duration: 38, badge: "NEW", thumbEmoji: "🎨", thumbColor: "#FFF1F2", rating: 5.0, ratingCount: 412, studentCount: 980 },
      { id: "course-6", title: "Excel & Power BI — Moliyaviy tahlil", slug: "excel-powerbi-moliyaviy-tahlil", description: "Excel va Power BI.", price: 320000, oldPrice: 480000, catSlug: "bugalteriya", instId: "inst-4", duration: 35, badge: "TOP", thumbEmoji: "💰", thumbColor: "#ECFDF5", rating: 5.0, ratingCount: 1108, studentCount: 2640 },
    ]
    for (const c of courses) {
      await pool.query(
        `INSERT INTO "Course" ("id","title","slug","description","price","oldPrice","categoryId","instructorId","duration","badge","thumbEmoji","thumbColor","rating","ratingCount","studentCount","published","createdAt","updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,true,$16,$16)
         ON CONFLICT ("id") DO NOTHING`,
        [c.id, c.title, c.slug, c.description, c.price, c.oldPrice, catMap[c.catSlug], c.instId, c.duration, c.badge, c.thumbEmoji, c.thumbColor, c.rating, c.ratingCount, c.studentCount, now]
      )
    }
    results.push("✅ Kurslar kiritildi")

    // Sections & Lessons
    await pool.query(`INSERT INTO "Section" ("id","title","order","courseId") VALUES ($1,$2,$3,$4) ON CONFLICT ("id") DO NOTHING`, ["sec-1-1", "Kirish va o'rnatish", 1, "course-1"])
    await pool.query(`INSERT INTO "Section" ("id","title","order","courseId") VALUES ($1,$2,$3,$4) ON CONFLICT ("id") DO NOTHING`, ["sec-1-2", "Asosiy operatsiyalar", 2, "course-1"])
    const lessons = [
      ["lesson-1", "1C nima va nima uchun kerak?", "dQw4w9WgXcQ", 12, 1, true, "sec-1-1"],
      ["lesson-2", "Dasturni o'rnatish va sozlash", null, 20, 2, true, "sec-1-1"],
      ["lesson-3", "Birinchi kompaniya yaratish", null, 15, 3, false, "sec-1-1"],
      ["lesson-4", "Xodimlar ro'yxati va maosh", null, 25, 1, false, "sec-1-2"],
      ["lesson-5", "Soliq hisoboti", null, 30, 2, false, "sec-1-2"],
    ]
    for (const l of lessons) {
      await pool.query(`INSERT INTO "Lesson" ("id","title","videoId","duration","order","isFree","sectionId") VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT ("id") DO NOTHING`, l)
    }
    results.push("✅ Darslar kiritildi")

    // Testimonials
    const testis = [
      [cuid(), "1C kursi menga ish topishda juda yordam berdi!", 5, "Zulfiya Abdullayeva", "Buxgalter, Toshkent", "ZA", "#1A56DB"],
      [cuid(), "AI kursidan so'ng biznesimda vaqtim 3 barobarga qisqardi.", 5, "Bobur Xolmatov", "Tadbirkor, Samarqand", "BX", "#10B981"],
      [cuid(), "Python kursini tamomladim, Data Analyst bo'ldim.", 5, "Sherzod Nazarov", "Data Analyst, IT kompaniya", "SN", "#F59E0B"],
    ]
    for (const t of testis) {
      await pool.query(`INSERT INTO "Testimonial" ("id","text","rating","authorName","authorRole","initials","avatarColor") VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`, t)
    }
    results.push("✅ Sharhlar kiritildi")

    // SiteSettings
    await pool.query(`INSERT INTO "SiteSettings" ("id") VALUES ('settings') ON CONFLICT DO NOTHING`)
    results.push("✅ Sozlamalar yaratildi")

    results.push("\n🎉 Database muvaffaqiyatli ishga tushdi!")
    results.push("📧 Admin: admin@aiakademiy.uz | 🔑 Parol: admin123456")

    await pool.end()
    return NextResponse.json({ success: true, results })

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    results.push(`❌ Seed xatosi: ${msg}`)
    await pool.end()
    return NextResponse.json({ success: false, results, error: msg }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "DB init endpoint. POST qiling (x-init-secret: aiakademiy-init-2024 header bilan)"
  })
}
