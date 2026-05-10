"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES_STATIC = [
  { id: "tops", name: "Tops & Blouses" },
  { id: "dresses", name: "Dresses & Sets" },
  { id: "bags", name: "Bags & Totes" },
  { id: "accessories", name: "Accessories" },
  { id: "sets", name: "Co-ord Sets" },
  { id: "custom", name: "Custom Orders" },
];

export default function NewProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", shortDescription: "",
    price: "", comparePrice: "", categoryId: "",
    stock: "10", status: "ACTIVE", isPreOrder: false,
    isFeatured: false, isBestSeller: false, isNew: true,
    estimatedDelivery: "", material: "", tags: "", colors: "", sizes: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories || CATEGORIES_STATIC));
  }, []);

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) setImages(prev => [...prev, data.url]);
      }
      toast.success("Images uploaded!");
    } catch { toast.error("Upload failed"); } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast.error("Please fill all required fields"); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
          stock: parseInt(form.stock),
          images,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
          colors: form.colors.split(",").map(c => c.trim()).filter(Boolean),
          sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success("Product created! 🌸");
      router.push("/admin/products");
    } catch { toast.error("Failed to create product"); } finally { setLoading(false); }
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "", required = false) => (
    <div key={key}>
      <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder} className="input-brand" required={required} />
    </div>
  );

  return (
    <div className="min-h-screen pt-8 pb-16 px-8" style={{ background: "var(--warm-white)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="btn-ghost">← Back</button>
          <h1 className="text-2xl font-display" style={{ color: "var(--text-primary)" }}>New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6 space-y-4 !transform-none">
            <h2 className="text-lg font-display mb-2" style={{ color: "var(--text-primary)" }}>Basic Information</h2>
            {field("name", "Product Name", "text", "e.g. Boho Crochet Crop Top", true)}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Slug (URL)</label>
              <input value={form.slug || autoSlug(form.name)} onChange={e => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated-from-name" className="input-brand" />
            </div>
            {field("shortDescription", "Short Description", "text", "One-line summary")}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Full Description <span className="text-red-500">*</span></label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4}
                placeholder="Describe the product, materials, sizing, care instructions..."
                className="input-brand resize-none" required />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="card p-6 space-y-4 !transform-none">
            <h2 className="text-lg font-display mb-2" style={{ color: "var(--text-primary)" }}>Pricing & Stock</h2>
            <div className="grid grid-cols-2 gap-4">
              {field("price", "Price (KSH)", "number", "2500", true)}
              {field("comparePrice", "Compare Price (KSH)", "number", "3000")}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field("stock", "Stock Quantity", "number", "10")}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Category <span className="text-red-500">*</span></label>
                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="input-brand" required>
                  <option value="">Select category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-6 !transform-none">
            <h2 className="text-lg font-display mb-4" style={{ color: "var(--text-primary)" }}>Product Images</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden" style={{ background: "var(--cream)" }}>
                  <img src={img} alt={`img-${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white"
                    style={{ background: "rgba(0,0,0,0.5)" }}><X size={10} /></button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-beige"
                style={{ border: "2px dashed var(--border)", background: "var(--cream)" }}>
                {uploading ? <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-muted)" }} /> : <><Upload size={18} style={{ color: "var(--text-muted)" }} /><span className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>Upload</span></>}
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Upload via Cloudinary. First image is the main product image.</p>
          </div>

          {/* Extra Details */}
          <div className="card p-6 space-y-4 !transform-none">
            <h2 className="text-lg font-display mb-2" style={{ color: "var(--text-primary)" }}>Details & Tags</h2>
            {field("material", "Material", "text", "e.g. 100% Cotton Yarn")}
            {field("estimatedDelivery", "Estimated Delivery", "text", "e.g. 7-10 business days")}
            {field("tags", "Tags (comma-separated)", "text", "e.g. boho, summer, beach")}
            {field("colors", "Available Colors (comma-separated)", "text", "e.g. Cream, Beige, Brown")}
            {field("sizes", "Available Sizes (comma-separated)", "text", "e.g. S, M, L, XL")}
          </div>

          {/* Flags */}
          <div className="card p-6 !transform-none">
            <h2 className="text-lg font-display mb-4" style={{ color: "var(--text-primary)" }}>Product Flags</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["isFeatured", "isBestSeller", "isNew", "isPreOrder"] as const).map((key) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-cream transition-colors"
                  style={{ border: "1px solid var(--border-light)" }}>
                  <input type="checkbox" checked={form[key] as boolean} onChange={e => setForm({ ...form, [key]: e.target.checked })}
                    className="w-4 h-4 rounded" />
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {key === "isFeatured" ? "Featured" : key === "isBestSeller" ? "Best Seller" : key === "isNew" ? "New Arrival" : "Pre-Order"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <><Plus size={16} /> Create Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
