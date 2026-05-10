"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice, calculateDeliveryFee, getDeliveryEstimate } from "@/lib/utils";
import toast from "react-hot-toast";
import { MapPin, Phone, User, Smartphone, CreditCard, ChevronRight } from "lucide-react";

const STEPS = ["Address", "Delivery", "Payment", "Confirm"];
const COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kiambu", "Machakos", "Kajiado", "Nyeri", "Meru", "Kakamega", "Other County"];

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getSubtotal, couponDiscount, couponCode, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ fullName: session?.user?.name || "", phone: "", street: "", city: "", county: "Nairobi" });
  const [paymentMethod, setPaymentMethod] = useState<"MPESA" | "CARD" | "COD">("MPESA");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [mpesaPending, setMpesaPending] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = calculateDeliveryFee(address.county);
  const discount = couponDiscount;
  const total = subtotal + deliveryFee - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4 px-4" style={{ background: "var(--cream)" }}>
        <div className="text-5xl">🛒</div>
        <h2 className="text-2xl font-display" style={{ color: "var(--text-primary)" }}>Your cart is empty</h2>
        <button onClick={() => router.push("/shop")} className="btn-primary">Continue Shopping</button>
      </div>
    );
  }

  const createOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price, color: i.color, size: i.size })),
          deliveryAddress: address,
          paymentMethod,
          couponCode: couponCode || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return null; }
      return data.order;
    } catch { toast.error("Failed to create order"); return null; } finally { setLoading(false); }
  };

  const handleMpesaPayment = async () => {
    const order = await createOrder();
    if (!order) return;
    setOrderId(order.id);
    setLoading(true);
    try {
      const res = await fetch("/api/payments/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mpesaPhone, orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success("M-Pesa prompt sent to your phone! 📱", { duration: 6000 });
      setMpesaPending(true);
      // Poll for payment status
      const poll = setInterval(async () => {
        const vRes = await fetch(`/api/payments/verify/${order.id}`);
        const vData = await vRes.json();
        if (vData.order?.paymentStatus === "COMPLETED") {
          clearInterval(poll);
          clearCart();
          router.push(`/checkout/success?orderId=${order.id}`);
        } else if (vData.order?.paymentStatus === "FAILED") {
          clearInterval(poll);
          toast.error("Payment failed. Please try again.");
          setMpesaPending(false);
        }
      }, 3000);
      setTimeout(() => { clearInterval(poll); setMpesaPending(false); toast.error("Payment timeout. Please try again."); }, 90000);
    } catch { toast.error("Payment error"); } finally { setLoading(false); }
  };

  const handleCOD = async () => {
    const order = await createOrder();
    if (!order) return;
    clearCart();
    router.push(`/checkout/success?orderId=${order.id}`);
  };

  const stepContent = [
    // Step 0: Address
    <div key="address" className="space-y-4">
      <h2 className="text-xl font-display mb-6" style={{ color: "var(--text-primary)" }}>Delivery Address</h2>
      {[
        { key: "fullName", label: "Full Name", placeholder: "Jane Doe", icon: User },
        { key: "phone", label: "Phone Number", placeholder: "07XX XXX XXX", icon: Phone },
        { key: "street", label: "Street / Building", placeholder: "e.g. Kenyatta Avenue, Sunrise Apts", icon: MapPin },
        { key: "city", label: "Town / City", placeholder: "e.g. Nairobi", icon: MapPin },
      ].map(({ key, label, placeholder, icon: Icon }) => (
        <div key={key}>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
          <div className="relative">
            <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input value={(address as any)[key]} onChange={e => setAddress({ ...address, [key]: e.target.value })}
              placeholder={placeholder} required className="input-brand pl-10" />
          </div>
        </div>
      ))}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>County</label>
        <select value={address.county} onChange={e => setAddress({ ...address, county: e.target.value })} className="input-brand">
          {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <button onClick={() => { if (!address.fullName || !address.phone || !address.street || !address.city) { toast.error("Please fill all required fields"); return; } setStep(1); }} className="btn-primary w-full justify-center mt-4">
        Continue to Delivery <ChevronRight size={16} />
      </button>
    </div>,

    // Step 1: Delivery Summary
    <div key="delivery" className="space-y-4">
      <h2 className="text-xl font-display mb-6" style={{ color: "var(--text-primary)" }}>Delivery Details</h2>
      <div className="p-4 rounded-xl" style={{ background: "var(--cream)", border: "1px solid var(--border)" }}>
        <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>{address.fullName}</p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{address.street}, {address.city}, {address.county}</p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{address.phone}</p>
      </div>
      <div className="p-4 rounded-xl" style={{ background: "var(--cream)", border: "1px solid var(--border)" }}>
        <div className="flex justify-between text-sm mb-1">
          <span style={{ color: "var(--text-secondary)" }}>Delivery fee</span>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--text-secondary)" }}>Estimated time</span>
          <span className="font-medium" style={{ color: "var(--nude-dark)" }}>{getDeliveryEstimate(address.county)}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setStep(0)} className="btn-secondary flex-1 justify-center">Back</button>
        <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center">Choose Payment <ChevronRight size={16} /></button>
      </div>
    </div>,

    // Step 2: Payment
    <div key="payment" className="space-y-4">
      <h2 className="text-xl font-display mb-6" style={{ color: "var(--text-primary)" }}>Payment Method</h2>
      {[
        { method: "MPESA" as const, label: "M-Pesa", desc: "Pay via STK Push to your phone", icon: "📱" },
        { method: "COD" as const, label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "💵" },
      ].map(({ method, label, desc, icon }) => (
        <button key={method} onClick={() => setPaymentMethod(method)}
          className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200"
          style={{
            background: paymentMethod === method ? "var(--cream-dark)" : "white",
            border: `2px solid ${paymentMethod === method ? "var(--nude)" : "var(--border)"}`,
          }}>
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
          </div>
        </button>
      ))}
      {paymentMethod === "MPESA" && (
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>M-Pesa Phone Number</label>
          <div className="relative">
            <Smartphone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} placeholder="07XX XXX XXX"
              className="input-brand pl-10" />
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-2">
        <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">Back</button>
        <button onClick={() => setStep(3)} className="btn-primary flex-1 justify-center">Review Order <ChevronRight size={16} /></button>
      </div>
    </div>,

    // Step 3: Confirm
    <div key="confirm" className="space-y-4">
      <h2 className="text-xl font-display mb-6" style={{ color: "var(--text-primary)" }}>Order Summary</h2>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span style={{ color: "var(--text-secondary)" }}>{item.name} × {item.quantity}</span>
            <span style={{ color: "var(--text-primary)" }}>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
        <div className="flex justify-between text-sm"><span style={{ color: "var(--text-secondary)" }}>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span style={{ color: "var(--text-secondary)" }}>Delivery</span><span>{formatPrice(deliveryFee)}</span></div>
        {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
        <div className="flex justify-between font-semibold text-base pt-2 border-t" style={{ borderColor: "var(--border)" }}>
          <span>Total</span><span className="font-display text-lg" style={{ color: "var(--nude-dark)" }}>{formatPrice(total)}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center">Back</button>
        <button disabled={loading || mpesaPending}
          onClick={paymentMethod === "MPESA" ? handleMpesaPayment : handleCOD}
          className="btn-gold flex-1 justify-center">
          {loading ? "Processing..." : mpesaPending ? "Waiting for M-Pesa..." : `Pay ${formatPrice(total)}`}
        </button>
      </div>
      {mpesaPending && (
        <div className="text-center p-4 rounded-xl animate-pulse" style={{ background: "var(--cream)" }}>
          <p className="text-sm font-medium">📱 Check your phone for the M-Pesa prompt</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Enter your M-Pesa PIN to complete payment</p>
        </div>
      )}
    </div>,
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4" style={{ background: "var(--cream)" }}>
      <div className="container-brand max-w-2xl mx-auto">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${i <= step ? "text-white" : ""}`}
                  style={{ background: i <= step ? "var(--charcoal)" : "var(--beige)", color: i <= step ? "white" : "var(--text-muted)" }}>
                  {i + 1}
                </div>
                <span className="text-xs hidden sm:block" style={{ color: i === step ? "var(--text-primary)" : "var(--text-muted)" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-6 sm:w-12 h-px" style={{ background: i < step ? "var(--charcoal)" : "var(--beige)" }} />}
            </div>
          ))}
        </div>

        <div className="card p-6 sm:p-8">{stepContent[step]}</div>
      </div>
    </div>
  );
}
