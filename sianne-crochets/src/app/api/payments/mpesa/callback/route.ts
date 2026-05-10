import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("M-Pesa Callback:", JSON.stringify(body, null, 2));

    const { Body } = body;
    if (!Body?.stkCallback) return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = Body.stkCallback;

    const payment = await prisma.payment.findFirst({ where: { checkoutRequestId: CheckoutRequestID } });
    if (!payment) return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

    if (ResultCode === 0) {
      // Extract metadata
      const items = CallbackMetadata?.Item || [];
      const get = (name: string) => items.find((i: any) => i.Name === name)?.Value;
      const receiptNumber = get("MpesaReceiptNumber");
      const transactionDate = get("TransactionDate");

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "COMPLETED",
            mpesaReceiptNumber: receiptNumber,
            transactionDate: transactionDate ? new Date(String(transactionDate)) : new Date(),
          },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "CONFIRMED", paymentStatus: "COMPLETED" },
        }),
      ]);
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", failureReason: ResultDesc },
      });
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: "FAILED" },
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
