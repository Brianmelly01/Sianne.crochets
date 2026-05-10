"use client";
import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, Truck, Shield, RefreshCw, Star, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string; name: string; slug: string; price: number; comparePrice?: number | null;
  images: string[]; description: string; shortDescription?: string | null;
  material?: string | null; careInstructions?: string | null; estimatedDelivery?: string | null;
  colors: string[]; sizes: string[]; stock: number; isPreOrder: boolean;
  isNew: boolean; isBestSeller: boolean; tags: string[];
  category?: { name: string; slug: string } | null;
}

export default function ProductDetailClient({ product, avgRating }: { product: Product; avgRating: number }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : ["/placeholder.jpg"];
  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  const handleAddToCart = () => {
    if (product.stock === 0 && !product.isPreOrder) { toast.error("This item is out of stock"); return; }
    addItem({ id: product.id, productId: product.id, name: product.name, price: product.price,
      image: images[0], quantity, color: selectedColor, size: selectedSize, slug: product.slug, stock: product.stock });
    openCart();
    toast.success("Added to cart! 🛍️");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Images */}
      <div className="space-y-4">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: "var(--cream)", aspectRatio: "4/5" }}>
          <Image src={images[selectedImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
          {images.length > 1 && (
            <>
              <button onClick={() => setSelectedImage(i => (i - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(253,248,243,0.9)", backdropFilter: "blur(8px)" }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setSelectedImage(i => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(253,248,243,0.9)", backdropFilter: "blur(8px)" }}>
                <ChevronRight size={18} />
              </button>
            </>
          )}
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && <span className="badge badge-new">New</span>}
            {product.isBestSeller && <span className="badge badge-bestseller">Bestseller</span>}
            {product.isPreOrder && <span className="badge badge-preorder">Pre-Order</span>}
            {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
          </div>
        </div>
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)}
                className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all"
                style={{ border: `2px solid ${i === selectedImage ? "var(--nude)" : "var(--border-light)"}`, background: "var(--cream)" }}>
                <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        {product.category && (
          <p className="section-label mb-2">{product.category.name}</p>
        )}
        <h1 className="text-3xl lg:text-4xl font-display font-light leading-tight mb-3" style={{ color: "var(--text-primary)" }}>
          {product.name}
        </h1>

        {/* Rating */}
        {avgRating > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} size={15} fill={s <= avgRating ? "var(--gold-light)" : "none"} stroke={s <= avgRating ? "var(--gold-light)" : "var(--beige)"} />)}
            </div>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>{avgRating.toFixed(1)}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-5">
          <span className="text-3xl font-display font-medium" style={{ color: "var(--nude-dark)" }}>{formatPrice(product.price)}</span>
          {product.comparePrice && <span className="text-lg line-through" style={{ color: "var(--text-muted)" }}>{formatPrice(product.comparePrice)}</span>}
          {discount > 0 && <span className="badge badge-sale text-sm">{discount}% off</span>}
        </div>

        {product.shortDescription && (
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>{product.shortDescription}</p>
        )}

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Color: <span style={{ color: "var(--text-primary)" }}>{selectedColor}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button key={color} onClick={() => setSelectedColor(color)}
                  className="px-3 py-1.5 rounded-full text-xs transition-all"
                  style={{
                    border: `1.5px solid ${selectedColor === color ? "var(--nude)" : "var(--border)"}`,
                    background: selectedColor === color ? "var(--cream-dark)" : "white",
                    color: "var(--text-primary)",
                  }}>{color}</button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Size: <span style={{ color: "var(--text-primary)" }}>{selectedSize}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className="w-10 h-10 rounded-xl text-sm font-medium transition-all"
                  style={{
                    border: `1.5px solid ${selectedSize === size ? "var(--nude)" : "var(--border)"}`,
                    background: selectedSize === size ? "var(--cream-dark)" : "white",
                    color: "var(--text-primary)",
                  }}>{size}</button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Quantity</p>
          <div className="flex items-center gap-3 p-1.5 rounded-full" style={{ border: "1.5px solid var(--border)" }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-cream transition-colors text-lg">−</button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-cream transition-colors text-lg">+</button>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {product.stock > 0 ? `${product.stock} in stock` : product.isPreOrder ? "Pre-order available" : "Out of stock"}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 mb-8">
          <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center gap-2">
            <ShoppingBag size={16} /> {product.isPreOrder && product.stock === 0 ? "Pre-Order Now" : "Add to Cart"}
          </button>
          <button onClick={() => { toggleItem({ id: product.id, name: product.name, price: product.price, image: images[0], slug: product.slug }); toast(inWishlist ? "Removed from wishlist" : "Added to wishlist ♥", { icon: inWishlist ? "💔" : "❤️" }); }}
            className="btn-secondary w-12 h-12 !px-0 !py-0 justify-center rounded-full flex-shrink-0">
            <Heart size={18} fill={inWishlist ? "var(--rose)" : "none"} stroke={inWishlist ? "var(--rose)" : "currentColor"} />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="space-y-3 pt-6 border-t" style={{ borderColor: "var(--border-light)" }}>
          {[
            { icon: Truck, text: product.estimatedDelivery ? `Estimated delivery: ${product.estimatedDelivery}` : "Fast delivery across Kenya" },
            { icon: Shield, text: "Secure checkout — M-Pesa, Visa & Mastercard accepted" },
            { icon: RefreshCw, text: "Made to order — each piece crafted specifically for you" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon size={15} style={{ color: "var(--nude)" }} />
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Description Accordion */}
        <div className="mt-6 space-y-3">
          {[
            { title: "Description", content: product.description },
            ...(product.material ? [{ title: "Material & Care", content: `Material: ${product.material}${product.careInstructions ? `\n\nCare: ${product.careInstructions}` : ""}` }] : []),
          ].map(({ title, content }) => (
            <details key={title} className="border rounded-xl overflow-hidden" style={{ borderColor: "var(--border-light)" }}>
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium list-none"
                style={{ color: "var(--text-primary)" }}>{title} <span>+</span></summary>
              <div className="px-4 pb-4 text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{content}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
