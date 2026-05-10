import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { generateOrderNumber, calculateDeliveryFee, getDeliveryEstimate } from "@/lib/utils";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    color: z.string().optional(),
    size: z.string().optional(),
  })),
  deliveryAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    county: z.string(),
  }),
  paymentMethod: z.enum(["MPESA", "CARD", "COD"]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = orderSchema.parse(body);

    const userId = (session.user as any).id;
    const subtotal = data.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = calculateDeliveryFee(data.deliveryAddress.county);

    // Apply coupon
    let discount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: data.couponCode.toUpperCase(), isActive: true, expiresAt: { gt: new Date() } },
      });
      if (coupon) {
        discount = coupon.isPercent ? (subtotal * coupon.discount) / 100 : coupon.discount;
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      }
    }

    const total = subtotal + deliveryFee - discount;
    const isPreOrder = data.items.some(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      return product?.isPreOrder;
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod: data.paymentMethod as any,
        deliveryAddress: data.deliveryAddress as any,
        couponCode: data.couponCode,
        notes: data.notes,
        isPreOrder: false,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const isAdmin = (session.user as any).role === "ADMIN";

  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId },
    include: { items: { include: { product: { select: { name: true, images: true, slug: true } } } }, payment: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
