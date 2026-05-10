import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, Eye, BarChart3, Package, Users } from "lucide-react";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/");

  const products = await prisma.product.findMany({
    include: { category: true, _count: { select: { orderItems: true, reviews: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--warm-white)" }}>
      <div className="flex">
        <aside className="admin-sidebar flex-shrink-0">
          <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-lg font-display" style={{ color: "var(--cream)" }}>sianne<span style={{ color: "var(--nude)" }}>.admin</span></p>
          </div>
          <nav className="p-4 space-y-1">
            {[
              { href: "/admin", icon: BarChart3, label: "Overview" },
              { href: "/admin/products", icon: Package, label: "Products" },
              { href: "/admin/orders", icon: Package, label: "Orders" },
              { href: "/admin/customers", icon: Users, label: "Customers" },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
                style={{ color: "var(--beige)", opacity: 0.8 }}>
                <Icon size={16} /> {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-light" style={{ color: "var(--text-primary)" }}>Products</h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{products.length} total products</p>
            </div>
            <Link href="/admin/products/new" className="btn-primary gap-2"><Plus size={16} /> Add Product</Link>
          </div>

          <div className="card !transform-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)", background: "var(--cream)" }}>
                    {["Product", "Category", "Price", "Stock", "Sales", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold tracking-wide uppercase"
                        style={{ color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-sm" style={{ color: "var(--text-muted)" }}>
                      No products yet. <Link href="/admin/products/new" className="underline" style={{ color: "var(--nude-dark)" }}>Add your first product</Link>
                    </td></tr>
                  ) : products.map((product) => (
                    <tr key={product.id} className="border-b transition-colors hover:bg-cream"
                      style={{ borderColor: "var(--border-light)" }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                            style={{ background: "var(--cream)" }}>
                            {product.images[0] && (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium line-clamp-1" style={{ color: "var(--text-primary)" }}>{product.name}</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>{product.category?.name}</td>
                      <td className="px-5 py-4 text-sm font-medium" style={{ color: "var(--nude-dark)" }}>{formatPrice(product.price)}</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${product.stock === 0 ? "badge-oos" : product.stock < 5 ? "badge-preorder" : "badge-bestseller"}`}>
                          {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>{product._count.orderItems} sold</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${product.status === "ACTIVE" ? "badge-new" : "badge-oos"}`}>{product.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/products/${product.slug}`} className="btn-ghost !p-1.5 rounded-lg" title="View"><Eye size={14} /></Link>
                          <Link href={`/admin/products/${product.id}/edit`} className="btn-ghost !p-1.5 rounded-lg" title="Edit"><Pencil size={14} /></Link>
                          <AdminDeleteProduct productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminDeleteProduct({ productId }: { productId: string }) {
  return (
    <form action={async () => {
      "use server";
      const { auth: getAuth } = await import("@/auth");
      const session = await getAuth();
      if ((session?.user as any)?.role !== "ADMIN") return;
      await (await import("@/lib/prisma")).prisma.product.update({
        where: { id: productId }, data: { status: "DISCONTINUED" },
      });
    }}>
      <button type="submit" className="btn-ghost !p-1.5 rounded-lg text-red-400 hover:bg-red-50" title="Delete">
        <Trash2 size={14} />
      </button>
    </form>
  );
}
