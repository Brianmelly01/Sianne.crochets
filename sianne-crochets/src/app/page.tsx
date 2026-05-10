import { prisma } from "@/lib/prisma";
import HomeHero from "@/components/home/HomeHero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import TrendingProducts from "@/components/home/TrendingProducts";
import Testimonials from "@/components/home/Testimonials";
import BrandBanner from "@/components/home/BrandBanner";
import NewsletterSection from "@/components/home/NewsletterSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sianne.crochets — Luxury Handmade Crochet Fashion",
  description: "Premium handcrafted crochet fashion from Nairobi. Tops, dresses, bags, accessories — all made to order with love.",
};

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isFeatured: true, status: "ACTIVE" },
      include: { category: true, reviews: { select: { rating: true } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch { return []; }
}

async function getTrendingProducts() {
  try {
    return await prisma.product.findMany({
      where: { isBestSeller: true, status: "ACTIVE" },
      include: { category: true, reviews: { select: { rating: true } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch { return []; }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch { return []; }
}

export default async function HomePage() {
  const [featured, trending, categories] = await Promise.all([
    getFeaturedProducts(),
    getTrendingProducts(),
    getCategories(),
  ]);

  return (
    <div className="overflow-x-hidden">
      <HomeHero />
      <FeaturedCollections categories={categories} />
      <TrendingProducts products={featured} title="Featured Collection" subtitle="Handpicked pieces from our latest crochet collection" />
      <BrandBanner />
      <TrendingProducts products={trending} title="Best Sellers" subtitle="Our most-loved pieces — crafted to perfection" showBg />
      <Testimonials />
      <NewsletterSection />
    </div>
  );
}
