import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

interface TrendingProductsProps {
  products: any[];
  title: string;
  subtitle: string;
  showBg?: boolean;
}

export default function TrendingProducts({ products, title, subtitle, showBg }: TrendingProductsProps) {
  const displayProducts = products.length > 0 ? products : SAMPLE_PRODUCTS;

  return (
    <section className="py-24" style={{ background: showBg ? "var(--cream)" : "var(--warm-white)" }}>
      <div className="container-brand">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-label">Collection</p>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>
          <Link href="/shop"
            className="flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:gap-3 flex-shrink-0"
            style={{ color: "var(--nude-dark)" }}>
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

const SAMPLE_PRODUCTS = [
  { id: "1", name: "Boho Crochet Crop Top", slug: "boho-crochet-crop-top", price: 2800, comparePrice: 3500, images: ["/placeholder.jpg"], isNew: true, stock: 5, category: { name: "Tops" }, reviews: [{ rating: 5 }, { rating: 4 }] },
  { id: "2", name: "Lace Midi Dress", slug: "lace-midi-dress", price: 5500, images: ["/placeholder.jpg"], isBestSeller: true, stock: 3, category: { name: "Dresses" }, reviews: [{ rating: 5 }] },
  { id: "3", name: "Market Tote Bag", slug: "market-tote-bag", price: 1800, images: ["/placeholder.jpg"], stock: 10, category: { name: "Bags" }, reviews: [] },
  { id: "4", name: "Sunset Beach Set", slug: "sunset-beach-set", price: 7200, comparePrice: 8000, images: ["/placeholder.jpg"], isNew: true, stock: 2, category: { name: "Sets" }, reviews: [{ rating: 5 }, { rating: 5 }] },
  { id: "5", name: "Boho Headband", slug: "boho-headband", price: 850, images: ["/placeholder.jpg"], stock: 20, category: { name: "Accessories" }, reviews: [{ rating: 4 }] },
  { id: "6", name: "Open-Back Crochet Top", slug: "open-back-crochet-top", price: 3200, images: ["/placeholder.jpg"], isBestSeller: true, stock: 4, category: { name: "Tops" }, reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }] },
  { id: "7", name: "Mini Shoulder Bag", slug: "mini-shoulder-bag", price: 2200, images: ["/placeholder.jpg"], stock: 8, category: { name: "Bags" }, reviews: [{ rating: 4 }] },
  { id: "8", name: "Festival Dress", slug: "festival-dress", price: 6800, images: ["/placeholder.jpg"], isPreOrder: true, stock: 0, category: { name: "Dresses" }, reviews: [] },
];
