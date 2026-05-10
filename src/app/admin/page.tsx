import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Package, Users, ShoppingBag, TrendingUp, Eye,
  BarChart3, Plus, ArrowRight, Clock
} from "lucide-react";

async function getAdminStats() {
  const [totalOrders, totalRevenue, totalProducts, totalCustomers, recentOrders, pendingOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "COMPLETED" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.findMany({
      take: 5, orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, items: { select: { quantity: true } } },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);
  return { totalOrders, totalRevenue: totalRevenue._sum.total || 0, totalProducts, totalCustomers, recentOrders, pendingOrders };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#F0E4A8", CONFIRMED: "#D4EDDA", PROCESSING: "#CCE5FF",
  DISPATCHED: "#E2D9F3", DELIVERED: "#D4EDDA", CANCELLED: "#F8D7DA",
};
const STATUS_TEXT: Record<string, string> = {
  PENDING: "#856404", CONFIRMED: "#155724", PROCESSING: "#004085",
  DISPATCHED: "#491668", DELIVERED: "#155724", CANCELLED: "#721C24",
};

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/");

  const stats = await getAdminStats();

  return (
    <div className="min-h-screen" style={{ background: "var(--warm-white)" }}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="admin-sidebar flex-shrink-0">
          <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-lg font-display" style={{ color: "var(--cream)" }}>sianne<span style={{ color: "var(--nude)" }}>.admin</span></p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Dashboard Panel</p>
          </div>
          <nav className="p-4 space-y-1">
            {[
              { href: "/admin", icon: BarChart3, label: "Overview" },
              { href: "/admin/products", icon: ShoppingBag, label: "Products" },
              { href: "/admin/orders", icon: Package, label: "Orders" },
              { href: "/admin/customers", icon: Users, label: "Customers" },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 hover:opacity-100"
                style={{ color: "var(--beige)", opacity: 0.75 }}>
                <Icon size={16} /> {label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-6 left-0 right-0 px-4">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ color: "var(--text-muted)" }}>
              <Eye size={16} /> View Store
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-light" style={{ color: "var(--text-primary)" }}>Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: "var(--gold-light)", bg: "var(--gold-pale)" },
              { label: "Total Orders", value: stats.totalOrders, icon: Package, color: "var(--nude-dark)", bg: "var(--cream-dark)" },
              { label: "Active Products", value: stats.totalProducts, icon: ShoppingBag, color: "#3B82F6", bg: "#EFF6FF" },
              { label: "Customers", value: stats.totalCustomers, icon: Users, color: "#10B981", bg: "#D1FAE5" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-5 flex items-center gap-4 !transform-none">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p className="text-2xl font-display font-medium" style={{ color: "var(--text-primary)" }}>{value}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alert: Pending Orders */}
          {stats.pendingOrders > 0 && (
            <div className="mb-8 p-4 rounded-2xl flex items-center gap-4"
              style={{ background: "var(--gold-pale)", border: "1px solid var(--gold-light)" }}>
              <Clock size={20} style={{ color: "var(--gold)" }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {stats.pendingOrders} order{stats.pendingOrders !== 1 ? "s" : ""} awaiting confirmation
                </p>
              </div>
              <Link href="/admin/orders?status=PENDING" className="text-xs font-medium flex items-center gap-1"
                style={{ color: "var(--gold)" }}>
                Review <ArrowRight size={13} />
              </Link>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 card p-6 !transform-none">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display" style={{ color: "var(--text-primary)" }}>Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs flex items-center gap-1 hover:underline" style={{ color: "var(--nude-dark)" }}>
                  All orders <ArrowRight size={12} />
                </Link>
              </div>
              <div className="space-y-3">
                {stats.recentOrders.length === 0 ? (
                  <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>No orders yet</p>
                ) : stats.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0"
                    style={{ borderColor: "var(--border-light)" }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>#{order.orderNumber}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.user?.name} · {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: STATUS_COLORS[order.status] || "#F3F4F6", color: STATUS_TEXT[order.status] || "#374151" }}>
                        {order.status}
                      </span>
                      <p className="text-sm font-semibold" style={{ color: "var(--nude-dark)" }}>{formatPrice(order.total)}</p>
                      <Link href={`/admin/orders/${order.id}`} className="btn-ghost !p-1.5 rounded-lg"><Eye size={14} /></Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 !transform-none">
              <h2 className="text-lg font-display mb-5" style={{ color: "var(--text-primary)" }}>Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { href: "/admin/products/new", icon: Plus, label: "Add New Product", desc: "Create a product listing" },
                  { href: "/admin/orders", icon: Package, label: "Manage Orders", desc: "Update order statuses" },
                  { href: "/admin/customers", icon: Users, label: "View Customers", desc: "Browse customer list" },
                ].map(({ href, icon: Icon, label, desc }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:shadow-brand-sm group"
                    style={{ border: "1px solid var(--border-light)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--cream)" }}>
                      <Icon size={16} style={{ color: "var(--nude-dark)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
