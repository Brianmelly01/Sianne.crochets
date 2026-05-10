"use client";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ background: "var(--warm-white)" }}>
      <div className="container-brand">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="section-label">Saved Items</p>
            <h1 className="section-title">My Wishlist</h1>
          </div>
          {items.length > 0 && (
            <button onClick={() => { clearWishlist(); toast("Wishlist cleared", { icon: "🗑️" }); }}
              className="btn-secondary text-sm">Clear All</button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "var(--cream-dark)" }}>
              <Heart size={32} style={{ color: "var(--beige-dark)" }} />
            </div>
            <h2 className="text-xl font-display" style={{ color: "var(--text-primary)" }}>Your wishlist is empty</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Save items you love and come back to them anytime</p>
            <Link href="/shop" className="btn-primary">Explore Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <ProductCard key={item.id} product={{
                id: item.id, name: item.name, slug: item.slug, price: item.price,
                comparePrice: item.comparePrice, images: [item.image], stock: 10, reviews: [],
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
