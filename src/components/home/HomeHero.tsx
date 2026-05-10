"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const HERO_WORDS = ["Elegance", "Artistry", "Grace", "Beauty"];

export default function HomeHero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % HERO_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-30 animate-float"
        style={{ background: "radial-gradient(circle, var(--beige) 0%, transparent 70%)" }} />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-20 animate-float"
        style={{ background: "radial-gradient(circle, var(--nude) 0%, transparent 70%)", animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full opacity-10 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, var(--gold-pale) 0%, transparent 70%)" }} />

      {/* Crochet pattern dots */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(var(--nude-dark) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

      <div className="container-brand relative z-10 pt-28 pb-16">
        <div className="max-w-3xl">
          {/* Label */}
          <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
            <Sparkles size={14} style={{ color: "var(--gold-light)" }} />
            <span className="section-label">Handcrafted in Nairobi, Kenya</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-6 animate-fade-in-up font-display"
            style={{ animationDelay: "0.1s" }}>
            Wear the Art of{" "}
            <span
              className="text-gold-gradient italic"
              style={{ display: "inline-block", transition: "opacity 0.3s ease", opacity: visible ? 1 : 0 }}>
              {HERO_WORDS[wordIndex]}
            </span>
          </h1>

          <p className="text-lg leading-relaxed mb-10 max-w-xl animate-fade-in-up"
            style={{ color: "var(--text-secondary)", animationDelay: "0.2s" }}>
            Every stitch tells a story. Discover our premium collection of handcrafted crochet
            fashion — tops, dresses, bags and accessories made with love for the modern woman.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/shop" className="btn-primary gap-2">
              Shop Collection <ArrowRight size={16} />
            </Link>
            <Link href="/categories/custom" className="btn-secondary">
              Custom Order
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-beige animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}>
            {[
              { value: "500+", label: "Happy Customers" },
              { value: "100%", label: "Handmade" },
              { value: "Made to", label: "Order" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-display font-medium" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Scroll</p>
        <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, var(--beige), transparent)" }} />
      </div>
    </section>
  );
}
