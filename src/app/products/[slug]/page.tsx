import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import ProductCard from "@/components/products/ProductCard";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, select: { name: true, shortDescription: true } });
  return { title: product?.name || "Product", description: product?.shortDescription || "" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, status: "ACTIVE", NOT: { id: product.id } },
    include: { category: true, reviews: { select: { rating: true } } },
    take: 4,
  });

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: "var(--warm-white)" }}>
      <div className="container-brand">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--text-muted)" }}>
          <a href="/" className="hover:underline">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:underline">Shop</a>
          <span>/</span>
          <a href={`/categories/${product.category?.slug}`} className="hover:underline">{product.category?.name}</a>
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
        </nav>

        <ProductDetailClient product={product as any} avgRating={avgRating} />

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="mt-20">
            <div className="mb-8">
              <p className="section-label">Customer Reviews</p>
              <h2 className="text-2xl font-display mt-1" style={{ color: "var(--text-primary)" }}>
                {avgRating.toFixed(1)} / 5 · {product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {product.reviews.map((review: any) => (
                <div key={review.id} className="card p-5 !transform-none">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={{ background: "var(--beige)", color: "var(--nude-dark)" }}>
                      {review.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{review.user?.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDate(review.createdAt)}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      {[1,2,3,4,5].map((s: number) => (
                        <span key={s} className="text-sm" style={{ color: s <= review.rating ? "var(--gold-light)" : "var(--beige)" }}>★</span>
                      ))}
                    </div>
                  </div>
                  {review.title && <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>{review.title}</p>}
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <p className="section-label">You May Also Like</p>
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {related.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
