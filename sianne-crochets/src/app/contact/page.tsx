"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import toast from "react-hot-toast";
import type { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours 🌸");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ background: "var(--warm-white)" }}>
      <div className="container-brand max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label">Get in Touch</p>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle mx-auto text-center">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl" style={{ background: "var(--cream)", border: "1px solid var(--border-light)" }}>
              <h2 className="text-lg font-display mb-5" style={{ color: "var(--text-primary)" }}>Reach Us</h2>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: "Phone / WhatsApp", value: "0746 187 020", href: "tel:+254746187020" },
                  { icon: Mail, label: "Email", value: "hello@sianne-crochets.com", href: "mailto:hello@sianne-crochets.com" },
                  { icon: MapPin, label: "Location", value: "Nairobi, Kenya", href: null },
                  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us instantly", href: `https://wa.me/254746187020?text=${encodeURIComponent("Hi! I'd like to know more about your crochet pieces 🌸")}` },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--beige)" }}>
                      <Icon size={16} style={{ color: "var(--nude-dark)" }} />
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer" className="text-sm font-medium hover:underline"
                          style={{ color: "var(--text-primary)" }}>{value}</a>
                      ) : (
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl" style={{ background: "var(--charcoal)" }}>
              <p className="text-sm font-display text-lg mb-2" style={{ color: "var(--cream)" }}>Business Hours</p>
              <div className="space-y-2">
                {[["Monday – Friday", "9:00 AM – 6:00 PM"], ["Saturday", "10:00 AM – 4:00 PM"], ["Sunday", "Closed"]].map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span style={{ color: "var(--beige)" }}>{day}</span>
                    <span style={{ color: "var(--nude)" }}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="card p-8 space-y-4 !transform-none">
            <h2 className="text-lg font-display mb-2" style={{ color: "var(--text-primary)" }}>Send a Message</h2>
            {[
              { key: "name", label: "Your Name", type: "text", placeholder: "Jane Doe" },
              { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
              { key: "subject", label: "Subject", type: "text", placeholder: "Custom order inquiry" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
                <input type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder} required className="input-brand" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5}
                placeholder="Tell us about your inquiry, custom order, or question..." required
                className="input-brand resize-none" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2">
              {loading ? "Sending..." : <><Send size={15} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
