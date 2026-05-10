"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort, page: String(page) });
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search, sort, category, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchProducts(); };
  const clearCategory = () => { setCategory(""); setPage(1); };

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ background: "var(--warm-white)" }}>
      <div className="container-brand">
        {/* Header */}
        <div className="mb-10">
          <p className="section-label">Explore</p>
          <h1 className="section-title">Our Shop</h1>
          <p className="section-subtitle">Handcrafted crochet fashion made with love</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..." className="input-brand pl-10" />
          </form>
          <div className="flex gap-3">
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="input-brand w-auto pr-8">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={clearCategory}
              className={`badge transition-all duration-200 cursor-pointer ${!category ? "badge-bestseller font-semibold" : "hover:bg-cream-dark"}`}
              style={!category ? {} : { background: "white", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              All
            </button>
            {categories.map((c: any) => (
              <button key={c.id} onClick={() => { setCategory(c.slug); setPage(1); }}
                className={`badge transition-all duration-200 cursor-pointer ${category === c.slug ? "badge-bestseller font-semibold" : "hover:bg-cream-dark"}`}
                style={category !== c.slug ? { background: "white", color: "var(--text-secondary)", border: "1px solid var(--border)" } : {}}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            {total} product{total !== 1 ? "s" : ""} {search ? `for "${search}"` : ""} {category ? `in ${category}` : ""}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "var(--cream)" }}>
                <div className="shimmer" style={{ aspectRatio: "3/4" }} />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-3 rounded w-1/2" />
                  <div className="shimmer h-4 rounded" />
                  <div className="shimmer h-4 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">🧶</div>
            <p className="text-lg font-display" style={{ color: "var(--text-primary)" }}>No products found</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(""); setCategory(""); }} className="btn-secondary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            {/* Pagination */}
            {total > 12 && (
              <div className="flex justify-center mt-12 gap-2">
                {Array.from({ length: Math.ceil(total / 12) }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-full text-sm transition-all ${page === i + 1 ? "btn-primary !px-0 !py-0" : "btn-ghost"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
