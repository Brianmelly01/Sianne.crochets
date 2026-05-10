"use client";
import Image from "next/image";
import Link from "next/link";
import { Camera, Users, MessageCircle, Mail, Phone, MapPin, Heart } from "lucide-react";
const Instagram = Camera;
const Facebook = Users;
const Twitter = MessageCircle;

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/categories/tops", label: "Tops & Blouses" },
  { href: "/categories/dresses", label: "Dresses & Sets" },
  { href: "/categories/bags", label: "Bags" },
  { href: "/categories/accessories", label: "Accessories" },
  { href: "/categories/custom", label: "Custom Orders" },
];

const HELP_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/track-order", label: "Track My Order" },
  { href: "/delivery-info", label: "Delivery Info" },
  { href: "/contact", label: "Contact Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--charcoal)", color: "var(--cream)" }}>
      <div className="container-brand py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 bg-white rounded-full p-1">
                <Image src="/logo.png" alt="Sianne.crochets" fill sizes="48px" className="object-contain" />
              </div>
              <span className="text-xl font-light font-display" style={{ color: "var(--cream)" }}>
                sianne<span style={{ color: "var(--nude)" }}>.crochets</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
              Handcrafted with love in Nairobi. Each piece is a unique work of art,
              made to order and crafted with premium quality yarns.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
                { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
                { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.1)", color: "var(--beige)" }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-5 font-body" style={{ color: "var(--nude)" }}>
              Shop
            </h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm transition-colors duration-200 hover:text-nude"
                    style={{ color: "var(--text-muted)" }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-5 font-body" style={{ color: "var(--nude)" }}>
              Help
            </h4>
            <ul className="space-y-3">
              {HELP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm transition-colors duration-200 hover:text-nude"
                    style={{ color: "var(--text-muted)" }}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase mb-5 font-body" style={{ color: "var(--nude)" }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="mt-0.5 flex-shrink-0" style={{ color: "var(--nude)" }} />
                <div>
                  <p className="text-sm" style={{ color: "var(--cream)" }}>0746 187 020</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Mon – Sat, 9am – 6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="mt-0.5 flex-shrink-0" style={{ color: "var(--nude)" }} />
                <p className="text-sm" style={{ color: "var(--cream)" }}>hello@sianne-crochets.com</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 flex-shrink-0" style={{ color: "var(--nude)" }} />
                <p className="text-sm" style={{ color: "var(--cream)" }}>Nairobi, Kenya</p>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Get new collection alerts</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--cream)" }} />
                <button type="submit" className="px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                  style={{ background: "var(--nude)", color: "white" }}>
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Sianne.crochets. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
            Made with <Heart size={11} style={{ color: "var(--rose)" }} /> in Nairobi, Kenya
          </p>
          <div className="flex items-center gap-4">
            {["M-Pesa", "Visa", "Mastercard"].map((p) => (
              <span key={p} className="text-xs px-2 py-1 rounded"
                style={{ background: "rgba(255,255,255,0.08)", color: "var(--beige)" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
