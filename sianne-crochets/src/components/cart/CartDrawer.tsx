"use client";
import { useCartStore } from "@/store/cartStore";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, couponDiscount } = useCartStore();
  const subtotal = getSubtotal();
  const discount = couponDiscount;
  const total = subtotal - discount;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="overlay animate-fade-in" onClick={closeCart} />
      )}

      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col transition-transform duration-400",
        isOpen ? "translate-x-0" : "translate-x-full"
      )} style={{ background: "var(--warm-white)", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "var(--border-light)" }}>
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} style={{ color: "var(--nude-dark)" }} />
            <h2 className="text-lg font-medium font-display" style={{ color: "var(--text-primary)" }}>
              Your Cart
            </h2>
            {items.length > 0 && (
              <span className="badge badge-bestseller">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            )}
          </div>
          <button onClick={closeCart} className="btn-ghost w-9 h-9 !px-0 !py-0 rounded-full">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "var(--cream-dark)" }}>
                <ShoppingBag size={32} style={{ color: "var(--beige-dark)" }} />
              </div>
              <div>
                <p className="font-medium font-display text-lg" style={{ color: "var(--text-primary)" }}>Your cart is empty</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Add some beautiful pieces!</p>
              </div>
              <Link href="/shop" onClick={closeCart} className="btn-primary">Browse Shop</Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-2xl animate-fade-in"
                style={{ background: "white", border: "1px solid var(--border-light)" }}>
                <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: "var(--cream)" }}>
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} onClick={closeCart}
                    className="text-sm font-medium leading-tight line-clamp-2 hover:underline"
                    style={{ color: "var(--text-primary)" }}>{item.name}</Link>
                  {(item.color || item.size) && (
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {[item.color, item.size].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="text-sm font-semibold mt-2" style={{ color: "var(--nude-dark)" }}>
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.size)}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-cream-dark"
                      style={{ border: "1px solid var(--border)" }}>
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.size)}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-cream-dark"
                      style={{ border: "1px solid var(--border)" }}>
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeItem(item.productId, item.color, item.size)}
                      className="ml-auto w-7 h-7 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t space-y-3" style={{ borderColor: "var(--border-light)", background: "white" }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span style={{ color: "var(--text-primary)" }}>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Discount</span>
                <span className="text-green-600">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base pt-2 border-t" style={{ borderColor: "var(--border-light)" }}>
              <span style={{ color: "var(--text-primary)" }}>Total</span>
              <span className="font-display text-lg" style={{ color: "var(--nude-dark)" }}>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>Delivery calculated at checkout</p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full justify-center text-center">
              Proceed to Checkout
            </Link>
            <Link href="/cart" onClick={closeCart}
              className="btn-secondary w-full justify-center text-center text-xs">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
