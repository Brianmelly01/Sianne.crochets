import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products — list products with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const where: any = { status: "ACTIVE" };
  if (category) where.category = { slug: category };
  if (search) where.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { description: { contains: search, mode: "insensitive" } },
    { tags: { has: search } },
  ];

  const orderBy: any =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    sort === "popular" ? { orderItems: { _count: "desc" } } :
    { createdAt: "desc" };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, reviews: { select: { rating: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
