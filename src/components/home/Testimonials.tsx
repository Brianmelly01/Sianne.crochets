import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  { name: "Amina W.", location: "Nairobi", rating: 5, text: "I ordered a custom crochet top and it was absolutely stunning! The quality is incredible and it arrived in perfect condition. Sianne has real talent! 🌸", initials: "AW" },
  { name: "Fatuma K.", location: "Mombasa", rating: 5, text: "The crochet bag I bought is my everyday go-to. So many compliments! The craftsmanship is top-tier. Will definitely order again.", initials: "FK" },
  { name: "Grace M.", location: "Kisumu", rating: 5, text: "Ordered a matching set for a beach vacation and I got so many compliments! The delivery was fast and packaging was beautiful. 10/10!", initials: "GM" },
  { name: "Joy N.", location: "Nairobi", rating: 5, text: "Finally a Kenyan brand that feels truly luxury! The attention to detail in every stitch is remarkable. I'm obsessed with my crochet dress.", initials: "JN" },
];

export default function Testimonials() {
  return (
    <section className="py-24" style={{ background: "var(--charcoal)" }}>
      <div className="container-brand">
        <div className="text-center mb-14">
          <p className="section-label" style={{ color: "var(--nude)" }}>Customer Love</p>
          <h2 className="section-title" style={{ color: "var(--cream)" }}>What Our Customers Say</h2>
          <p className="section-subtitle mx-auto text-center" style={{ color: "var(--text-muted)" }}>
            Real stories from real women who wear Sianne.crochets
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl relative"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Quote size={24} className="mb-4" style={{ color: "var(--nude)" }} />
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--beige)" }}>{t.text}</p>
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={13} fill={s <= t.rating ? "var(--gold-light)" : "none"}
                    stroke={s <= t.rating ? "var(--gold-light)" : "var(--beige)"} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: "var(--nude)", color: "white" }}>{t.initials}</div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--cream)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
