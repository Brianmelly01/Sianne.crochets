import { NextRequest, NextResponse } from "next/server";
import { initiateSTKPush } from "@/lib/mpesa";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { phone, orderId } = await req.json();
    if (!phone || !orderId) return NextResponse.json({ error: "Phone and orderId required" }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const result = await initiateSTKPush({
      phone,
      amount: order.total,
      orderId,
      orderNumber: order.orderNumber,
    });

    if (result.ResponseCode === "0") {
      await prisma.payment.create({
        data: {
          orderId,
          method: "MPESA",
          amount: order.total,
          status: "PENDING",
          mpesaPhone: phone,
          checkoutRequestId: result.CheckoutRequestID,
          merchantRequestId: result.MerchantRequestID,
        },
      });
      return NextResponse.json({
        success: true,
        message: "STK Push sent! Check your phone",
        checkoutRequestId: result.CheckoutRequestID,
      });
    } else {
      return NextResponse.json({ error: result.ResponseDescription || "STK Push failed" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("M-Pesa error:", err.response?.data || err.message);
    return NextResponse.json({ error: "M-Pesa payment initiation failed" }, { status: 500 });
  }
}
