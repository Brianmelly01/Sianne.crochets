import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  try {
    const payment = await prisma.payment.findFirst({ where: { orderId } });
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { paymentStatus: true, status: true } });
    return NextResponse.json({ payment, order });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
