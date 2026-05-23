import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { method, params, id } = body

  const response = (result: object) => NextResponse.json({ jsonrpc: "2.0", id, result })
  const error = (code: number, message: string) => NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } })

  if (method === "CheckPerformTransaction") {
    const payment = await prisma.payment.findUnique({ where: { id: params.account?.order_id } })
    if (!payment) return error(-31050, "Order not found")
    return response({ allow: true })
  }

  if (method === "CreateTransaction") {
    const payment = await prisma.payment.findUnique({ where: { id: params.account?.order_id } })
    if (!payment) return error(-31050, "Order not found")
    return response({ create_time: Date.now(), transaction: params.id, state: 1 })
  }

  if (method === "PerformTransaction") {
    const payment = await prisma.payment.findFirst({ where: { status: "PENDING" } })
    if (!payment) return error(-31008, "Transaction not found")
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "PAID", transId: params.id } })
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      create: { userId: payment.userId, courseId: payment.courseId },
      update: {},
    })
    await prisma.course.update({ where: { id: payment.courseId }, data: { studentCount: { increment: 1 } } })
    return response({ transaction: params.id, perform_time: Date.now(), state: 2 })
  }

  if (method === "CancelTransaction") {
    return response({ transaction: params.id, cancel_time: Date.now(), state: -1 })
  }

  if (method === "CheckTransaction") {
    return response({ create_time: Date.now(), perform_time: 0, cancel_time: 0, transaction: params.id, state: 1, reason: null })
  }

  return error(-32601, "Method not found")
}
