import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Sianne.crochets orders, delivery, payments, and custom pieces.",
};

const FAQS = [
  { q: "How long does it take to make my order?", a: "Since everything is handmade to order, production typically takes 3-7 business days depending on the piece. Pre-order items may take 10-14 business days. You'll receive updates throughout the process." },
  { q: "Do you offer custom sizing?", a: "Absolutely! All our pieces can be made to your exact measurements at no extra charge. Simply leave your measurements in the order notes or contact us via WhatsApp before ordering." },
  { q: "How do I pay with M-Pesa?", a: "At checkout, select M-Pesa as your payment method and enter your M-Pesa registered phone number. You'll receive an STK Push notification on your phone — enter your PIN to complete payment. Simple and secure!" },
  { q: "What are your delivery options?", a: "We deliver across Kenya! Nairobi CBD delivery is KES 150, Nairobi suburbs KES 200, nearby counties KES 300, and all other counties KES 450. Orders over KES 5,000 qualify for free delivery within Nairobi." },
  { q: "Can I return or exchange my item?", a: "Since each piece is handmade to order, we do not accept returns unless the item arrives damaged or significantly different from what was ordered. We'll work with you to make it right! Exchanges for sizing issues are accepted within 7 days." },
  { q: "What yarn/materials do you use?", a: "We use premium quality yarns including 100% cotton, cotton-linen blends, mercerized cotton, and raffia. All materials are carefully sourced to ensure softness, durability, and longevity." },
  { q: "How do I care for my crochet piece?", a: "Hand wash in cold water with a gentle detergent. Lay flat to dry — never tumble dry or wring. Store folded, not hung, to maintain the shape. Iron on low heat if needed, using a pressing cloth." },
  { q: "Do you ship internationally?", a: "Currently, we ship within Kenya only. We're working on international shipping — follow our Instagram @sianne.crochets for updates!" },
  { q: "How do I track my order?", a: "Once your order is dispatched, you'll receive a notification with tracking information. You can also check your order status anytime in your dashboard under 'My Orders'." },
  { q: "Can I order a completely custom design?", a: "Yes! We love custom orders. Contact us via WhatsApp (0746 187 020) or our contact form with your design idea, measurements, and color preferences. We'll provide a quote within 24 hours." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ background: "var(--warm-white)" }}>
      <div className="container-brand max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label">Got Questions?</p>
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="section-subtitle mx-auto text-center">
            Everything you need to know about ordering from Sianne.crochets
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <details key={i}
              className="group rounded-2xl overflow-hidden transition-all duration-200"
              style={{ border: "1px solid var(--border-light)", background: "white" }}>
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none"
                style={{ color: "var(--text-primary)" }}>
                <span className="font-medium text-sm pr-4">{faq.q}</span>
                <span className="text-xl flex-shrink-0 transition-transform duration-200 group-open:rotate-45"
                  style={{ color: "var(--nude-dark)" }}>+</span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-14 p-8 rounded-3xl text-center" style={{ background: "var(--cream)", border: "1px solid var(--border-light)" }}>
          <p className="font-display text-xl mb-2" style={{ color: "var(--text-primary)" }}>Still have questions?</p>
          <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
            We're always happy to help! Reach us via WhatsApp or email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/254746187020" target="_blank" rel="noopener noreferrer"
              className="btn-primary gap-2">💬 WhatsApp Us</a>
            <a href="/contact" className="btn-secondary">Send an Email</a>
          </div>
        </div>
      </div>
    </div>
  );
}
