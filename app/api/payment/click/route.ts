import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createHash } from "crypto"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { click_trans_id, service_id, click_paydoc_id, merchant_trans_id, amount, action, sign_time, sign_string } = body

  const secretKey = process.env.CLICK_SECRET_KEY || ""
  const expectedSign = createHash("md5")
    .update(`${click_trans_id}${service_id}${secretKey}${merchant_trans_id}${amount}${action}${sign_time}`)
    .digest("hex")

  if (sign_string !== expectedSign) {
    return NextResponse.json({ error: -1, error_note: "SIGN CHECK FAILED!" })
  }

  const payment = await prisma.payment.findUnique({ where: { id: merchant_trans_id } })
  if (!payment) return NextResponse.json({ error: -5, error_note: "User does not exist" })

  if (action === 0) {
    return NextResponse.json({ click_trans_id, merchant_trans_id, merchant_prepare_id: payment.id, error: 0, error_note: "Success" })
  }

  if (action === 1) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "PAID", transId: click_trans_id } })
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      create: { userId: payment.userId, courseId: payment.courseId },
      update: {},
    })
    await prisma.course.update({ where: { id: payment.courseId }, data: { studentCount: { increment: 1 } } })
    return NextResponse.json({ click_trans_id, merchant_trans_id, merchant_confirm_id: payment.id, error: 0, error_note: "Success" })
  }

  return NextResponse.json({ error: -3, error_note: "Action not found" })
}
