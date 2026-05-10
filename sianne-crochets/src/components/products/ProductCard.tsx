"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, ArrowRight, Sparkles, Truck, Shield, RefreshCw } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isPreOrder?: boolean;
  stock: number;
  category?: { name: string };
  reviews?: { rating: number }[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0 && !product.isPreOrder) {
      toast.error("This item is out of stock");
      return;
    }
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.jpg",
      quantity: 1,
      slug: product.slug,
      stock: product.stock,
    });
    openCart();
    toast.success("Added to cart!", { icon: "🛍️" });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] || "/placeholder.jpg", slug: product.slug, comparePrice: product.comparePrice ?? undefined });
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist ♥", {
      icon: inWishlist ? "💔" : "❤️",
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="product-card group block">
      <div className="product-image-wrap">
        <Image
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <span className="badge badge-new">New</span>}
          {product.isBestSeller && <span className="badge badge-bestseller">Bestseller</span>}
          {product.isPreOrder && <span className="badge badge-preorder">Pre-Order</span>}
          {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
          {product.stock === 0 && !product.isPreOrder && <span className="badge badge-oos">Sold Out</span>}
        </div>

        {/* Actions */}
        <div className="product-actions">
          <button onClick={handleWishlist} className="action-btn" aria-label="Wishlist">
            <Heart size={15} fill={inWishlist ? "var(--rose)" : "none"} stroke={inWishlist ? "var(--rose)" : "var(--text-secondary)"} />
          </button>
          <button onClick={handleAddToCart} className="action-btn" aria-label="Add to cart">
            <ShoppingBag size={15} stroke="var(--text-secondary)" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {product.category && (
          <p className="section-label text-[10px] mb-1">{product.category.name}</p>
        )}
        <h3 className="text-sm font-medium leading-snug line-clamp-2 font-body mb-2"
          style={{ color: "var(--text-primary)" }}>{product.name}</h3>

        {avgRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={11} fill={s <= avgRating ? "var(--gold-light)" : "none"}
                stroke={s <= avgRating ? "var(--gold-light)" : "var(--beige)"} />
            ))}
            <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>
              ({product.reviews?.length || 0})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm font-display" style={{ color: "var(--nude-dark)" }}>
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
