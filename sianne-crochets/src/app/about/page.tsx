import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Sianne.crochets — our story, our passion for handmade crochet fashion, and our commitment to quality.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ background: "var(--warm-white)" }}>
      <div className="container-brand max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <p className="section-label mb-2">Our Story</p>
          <h1 className="section-title mb-4">Crafted with Love,<br />Worn with Pride</h1>
          <p className="section-subtitle mx-auto text-center max-w-2xl">
            Sianne.crochets is a Nairobi-based handmade fashion boutique dedicated to creating
            premium crochet pieces that celebrate femininity, creativity, and Kenyan craftsmanship.
          </p>
        </div>

        {/* Brand values */}
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Heart, title: "Made with Love", desc: "Every stitch is a labor of love. We pour care and intention into each handcrafted piece." },
            { icon: Sparkles, title: "Premium Quality", desc: "We use only the finest yarns and materials to ensure longevity and luxury feel." },
            { icon: Award, title: "Uniquely Yours", desc: "No two pieces are exactly alike. Your crochet piece is as unique as you are." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--cream-dark)" }}>
                <Icon size={20} style={{ color: "var(--nude-dark)" }} />
              </div>
              <h3 className="font-display text-lg mb-2" style={{ color: "var(--text-primary)" }}>{title}</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="p-8 rounded-3xl mb-16" style={{ background: "var(--cream)", border: "1px solid var(--border-light)" }}>
          <h2 className="text-2xl font-display mb-4" style={{ color: "var(--text-primary)" }}>The Sianne Story</h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <p>Sianne.crochets was born out of a simple passion — a love for the art of crochet and a desire to share that beauty with the world. What started as a hobby quickly grew into something much larger.</p>
            <p>Based in the vibrant city of Nairobi, Kenya, we create handmade crochet fashion that blends African creativity with global luxury aesthetics. Each piece in our collection is carefully designed and handcrafted to order, ensuring that every customer receives something truly special.</p>
            <p>We believe that fashion should be personal, sustainable, and meaningful. That's why we make everything to order — reducing waste and ensuring that each piece is crafted with intentionality.</p>
          </div>
        </div>

        <div className="text-center">
          <p className="section-label mb-3">Join Our Journey</p>
          <Link href="/shop" className="btn-primary">Shop the Collection</Link>
        </div>
      </div>
    </div>
  );
}
