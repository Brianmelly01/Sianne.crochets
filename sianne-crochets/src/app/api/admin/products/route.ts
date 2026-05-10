import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, slug, description, shortDescription, price, comparePrice, categoryId,
      stock, status, isPreOrder, isFeatured, isBestSeller, isNew,
      estimatedDelivery, material, tags, colors, sizes, images } = body;

    // Find category by id or slug
    let category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      category = await prisma.category.findUnique({ where: { slug: categoryId } });
    }
    if (!category) {
      category = await prisma.category.create({ data: { name: categoryId, slug: slugify(categoryId) } });
    }

    const product = await prisma.product.create({
      data: {
        name, slug: slug || slugify(name), description, shortDescription,
        price, comparePrice, stock, status,
        isPreOrder: isPreOrder || false, isFeatured: isFeatured || false,
        isBestSeller: isBestSeller || false, isNew: isNew || false,
        estimatedDelivery, material, tags: tags || [], colors: colors || [],
        sizes: sizes || [], images: images || [],
        categoryId: category.id,
      },
    });
    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002") return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await req.json();
    const { id, ...data } = body;
    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
