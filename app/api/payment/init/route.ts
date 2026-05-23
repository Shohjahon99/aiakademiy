import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { courseId, method } = await req.json()
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  })
  if (existing) return NextResponse.json({ error: "Already enrolled" }, { status: 400 })

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      courseId,
      amount: course.price,
      method,
      status: "PENDING",
    },
  })

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  if (method === "CLICK") {
    const clickServiceId = process.env.CLICK_SERVICE_ID || "TEST_SERVICE"
    const clickMerchantId = process.env.CLICK_MERCHANT_ID || "TEST_MERCHANT"
    const url = `https://my.click.uz/services/pay?service_id=${clickServiceId}&merchant_id=${clickMerchantId}&amount=${course.price}&transaction_param=${payment.id}&return_url=${baseUrl}/payment/success`
    return NextResponse.json({ url })
  }

  if (method === "PAYME") {
    const paymeMerchantId = process.env.PAYME_MERCHANT_ID || "TEST_PAYME"
    const encoded = Buffer.from(`m=${paymeMerchantId};ac.order_id=${payment.id};a=${course.price * 100}`).toString("base64")
    const url = `https://checkout.paycom.uz/${encoded}`
    return NextResponse.json({ url })
  }

  return NextResponse.json({ error: "Invalid method" }, { status: 400 })
}
