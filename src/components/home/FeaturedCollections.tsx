import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  tops: "👚",
  dresses: "👗",
  bags: "👜",
  accessories: "💍",
  sets: "✨",
  custom: "🎨",
};

const FALLBACK_COLORS = [
  "linear-gradient(135deg, #E8D5C0, #FDF8F3)",
  "linear-gradient(135deg, #F5D0C8, #FDF8F3)",
  "linear-gradient(135deg, #D4B896, #E8D5C0)",
  "linear-gradient(135deg, #C9A882, #E8D5C0)",
  "linear-gradient(135deg, #E8D5C0, #C9A882)",
  "linear-gradient(135deg, #F0E4A8, #E8D5C0)",
];

export default function FeaturedCollections({ categories }: { categories: Category[] }) {
  const displayCategories = categories.length > 0 ? categories : [
    { id: "1", name: "Tops & Blouses", slug: "tops" },
    { id: "2", name: "Dresses & Sets", slug: "dresses" },
    { id: "3", name: "Bags & Totes", slug: "bags" },
    { id: "4", name: "Accessories", slug: "accessories" },
    { id: "5", name: "Co-ord Sets", slug: "sets" },
    { id: "6", name: "Custom Orders", slug: "custom" },
  ];

  return (
    <section className="py-24" style={{ background: "var(--warm-white)" }}>
      <div className="container-brand">
        <div className="text-center mb-14">
          <p className="section-label">Browse by Category</p>
          <h2 className="section-title">Our Collections</h2>
          <p className="section-subtitle mx-auto text-center">
            From casual tops to statement dresses — find your perfect handcrafted piece
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.slice(0, 6).map((cat, i) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                background: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
              }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>
                {CATEGORY_EMOJIS[cat.slug] || "🧶"}
              </div>
              <p className="text-xs font-medium text-center leading-snug"
                style={{ color: "var(--text-primary)" }}>{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
