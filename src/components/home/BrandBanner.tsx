import { Truck, Shield, RefreshCw, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "Handcrafted Quality", desc: "Every piece is made by hand with premium yarns and meticulous attention to detail." },
  { icon: Truck, title: "Nairobi Delivery", desc: "Fast delivery across Nairobi and shipping to all counties in Kenya." },
  { icon: Shield, title: "Secure Payments", desc: "Pay safely with M-Pesa, Visa or Mastercard. Your transactions are always protected." },
  { icon: RefreshCw, title: "Made to Order", desc: "Custom sizing available. We craft each piece specifically for you upon order." },
];

export default function BrandBanner() {
  return (
    <section className="py-20" style={{ background: "var(--cream-dark)" }}>
      <div className="container-brand">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 duration-300"
                style={{ background: "var(--warm-white)", boxShadow: "var(--shadow-md)" }}>
                <Icon size={22} style={{ color: "var(--nude-dark)" }} />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1 font-display" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
