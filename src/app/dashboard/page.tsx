import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, User, MapPin, Heart, LogOut } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "badge-preorder", CONFIRMED: "badge-new", PROCESSING: "badge-new",
  DISPATCHED: "badge-bestseller", DELIVERED: "badge", CANCELLED: "badge-oos",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const [user, orders, wishlistCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, phone: true, createdAt: true } }),
    prisma.order.findMany({
      where: { userId }, take: 5,
      include: { items: { include: { product: { select: { name: true, images: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.wishlistItem.count({ where: { userId } }),
  ]);

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ background: "var(--warm-white)" }}>
      <div className="container-brand max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold"
            style={{ background: "var(--beige)", color: "var(--nude-dark)" }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-display" style={{ color: "var(--text-primary)" }}>Hello, {user?.name?.split(" ")[0]}! 🌸</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Member since {formatDate(user?.createdAt || new Date())}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Orders", value: orders.length, icon: Package },
            { label: "Wishlist Items", value: wishlistCount, icon: Heart },
            { label: "Account Type", value: "Member", icon: User },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--cream)" }}>
                <Icon size={18} style={{ color: "var(--nude-dark)" }} />
              </div>
              <div>
                <p className="text-xl font-display font-medium" style={{ color: "var(--text-primary)" }}>{value}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { href: "/dashboard/orders", label: "My Orders", icon: "📦" },
            { href: "/wishlist", label: "Wishlist", icon: "❤️" },
            { href: "/dashboard/profile", label: "Edit Profile", icon: "👤" },
            { href: "/dashboard/addresses", label: "Addresses", icon: "📍" },
          ].map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className="card p-4 flex flex-col items-center gap-2 text-center hover:!transform-none hover:shadow-brand-md">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-display" style={{ color: "var(--text-primary)" }}>Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm hover:underline" style={{ color: "var(--nude-dark)" }}>View all</Link>
          </div>
          {orders.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-4xl mb-3">🛍️</p>
              <p className="font-medium font-display" style={{ color: "var(--text-primary)" }}>No orders yet</p>
              <p className="text-sm mt-1 mb-4" style={{ color: "var(--text-muted)" }}>Start shopping and your orders will appear here</p>
              <Link href="/shop" className="btn-primary">Shop Now</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 !transform-none !shadow-brand-sm">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>#{order.orderNumber}</p>
                      <span className={`badge ${STATUS_COLORS[order.status] || "badge"}`}>{order.status}</span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold font-display" style={{ color: "var(--nude-dark)" }}>{formatPrice(order.total)}</p>
                    <Link href={`/dashboard/orders/${order.id}`} className="text-xs hover:underline mt-1 block" style={{ color: "var(--nude-dark)" }}>View details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
