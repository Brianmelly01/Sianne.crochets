import Link from "next/link";
import { CheckCircle, Package, Home, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center px-4" style={{ background: "var(--cream)" }}>
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in"
          style={{ background: "var(--cream-dark)" }}>
          <CheckCircle size={40} style={{ color: "var(--nude-dark)" }} />
        </div>
        <h1 className="text-3xl font-display font-light mb-3" style={{ color: "var(--text-primary)" }}>
          Order Placed! 🌸
        </h1>
        <p className="text-base mb-2" style={{ color: "var(--text-secondary)" }}>
          Thank you for your order! We'll start crafting your beautiful piece right away.
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          You'll receive a confirmation notification shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/orders" className="btn-primary gap-2">
            <Package size={16} /> Track Order
          </Link>
          <Link href="/shop" className="btn-secondary gap-2">
            <Home size={16} /> Continue Shopping
          </Link>
        </div>
        <div className="mt-8 p-4 rounded-2xl text-left" style={{ background: "white", border: "1px solid var(--border-light)" }}>
          <p className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>What happens next?</p>
          {["We'll confirm your order within 1-2 hours", "Your item will be handcrafted with love (3-7 days)", "We'll notify you when it's dispatched", "Enjoy your beautiful crochet piece!"].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mt-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                style={{ background: "var(--beige)", color: "var(--nude-dark)" }}>{i + 1}</div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
