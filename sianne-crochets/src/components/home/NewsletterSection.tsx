"use client";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("You're on the list! 🌸");
        setEmail("");
      } else {
        toast.error("Already subscribed or something went wrong.");
      }
    } catch {
      toast.error("Failed to subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24" style={{ background: "var(--cream)" }}>
      <div className="container-brand">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--beige)" }}>
            <Mail size={22} style={{ color: "var(--nude-dark)" }} />
          </div>
          <p className="section-label">Stay Connected</p>
          <h2 className="section-title">Get First Access</h2>
          <p className="section-subtitle mx-auto text-center mt-3 mb-8">
            Be the first to know about new collections, exclusive offers, and behind-the-scenes content.
            No spam — just beautiful crochet.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="input-brand flex-1"
            />
            <button type="submit" disabled={loading} className="btn-primary flex-shrink-0">
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
            Join 500+ women who love handmade fashion ✨
          </p>
        </div>
      </div>
    </section>
  );
}
