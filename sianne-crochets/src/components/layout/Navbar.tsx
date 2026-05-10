"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Package, LogOut, Settings, Home } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import CartDrawer from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop", children: [
    { href: "/shop", label: "All Products" },
    { href: "/categories/tops", label: "Tops & Blouses" },
    { href: "/categories/dresses", label: "Dresses & Sets" },
    { href: "/categories/bags", label: "Bags & Totes" },
    { href: "/categories/accessories", label: "Accessories" },
    { href: "/categories/custom", label: "Custom Orders" },
  ]},
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { toggleCart, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const cartCount = getItemCount();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false); setSearchQuery("");
    }
  };

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-brand-sm border-b border-brand" : "bg-transparent")}>
        <div className="container-brand">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Sianne.crochets" fill sizes="48px" className="object-contain" priority />
              </div>
              <span className="text-xl font-light hidden sm:block font-display" style={{ color: "var(--text-primary)" }}>
                sianne<span style={{ color: "var(--nude-dark)" }}>.crochets</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}>
                  <Link href={link.href}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-cream-dark"
                    style={{ color: "var(--text-primary)" }}>
                    {link.label}
                    {link.children && <ChevronDown size={14} className={cn("transition-transform duration-200", activeDropdown === link.label ? "rotate-180" : "")} />}
                  </Link>
                  {link.children && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-2 w-52 rounded-2xl overflow-hidden animate-scale-in z-50"
                      style={{ background: "white", boxShadow: "var(--shadow-xl)", border: "1px solid var(--border-light)" }}>
                      {link.children.map((c) => (
                        <Link key={c.href} href={c.href}
                          className="flex items-center px-5 py-3 text-sm transition-colors hover:bg-cream"
                          style={{ color: "var(--text-secondary)" }}>{c.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(!searchOpen)} className="btn-ghost w-10 h-10 !px-0 !py-0" aria-label="Search">
                <Search size={18} />
              </button>
              <Link href="/wishlist" className="btn-ghost w-10 h-10 !px-0 !py-0 relative" aria-label="Wishlist">
                <Heart size={18} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-medium flex items-center justify-center"
                    style={{ background: "var(--rose)", color: "white" }}>{wishlistItems.length}</span>
                )}
              </Link>
              <button onClick={toggleCart} className="btn-ghost w-10 h-10 !px-0 !py-0 relative" aria-label="Cart">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "var(--charcoal)", color: "white" }}>{cartCount > 9 ? "9+" : cartCount}</span>
                )}
              </button>

              {session ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 btn-ghost px-3 h-10 rounded-full">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={{ background: "var(--beige)", color: "var(--nude-dark)" }}>
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown size={14} />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-40 animate-scale-in"
                        style={{ background: "white", boxShadow: "var(--shadow-xl)", border: "1px solid var(--border-light)" }}>
                        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-light)" }}>
                          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{session.user?.name}</p>
                          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{session.user?.email}</p>
                        </div>
                        {[
                          { href: "/dashboard", icon: Home, label: "Dashboard" },
                          { href: "/dashboard/orders", icon: Package, label: "My Orders" },
                          ...(isAdmin ? [{ href: "/admin", icon: Settings, label: "Admin Panel" }] : []),
                        ].map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-cream"
                            style={{ color: "var(--text-secondary)" }}>
                            <item.icon size={15} />{item.label}
                          </Link>
                        ))}
                        <button onClick={() => { signOut(); setUserMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 border-t"
                          style={{ borderColor: "var(--border-light)" }}>
                          <LogOut size={15} />Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login" className="btn-primary hidden sm:flex ml-2 !px-5 !py-2 text-xs">Sign In</Link>
              )}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden btn-ghost w-10 h-10 !px-0 !py-0 ml-1">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="pb-4 animate-fade-in">
              <form onSubmit={handleSearch} className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input ref={searchRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for crochet tops, dresses, bags..." className="input-brand pl-10 pr-4" />
                <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X size={14} style={{ color: "var(--text-muted)" }} />
                </button>
              </form>
            </div>
          )}
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t animate-fade-in" style={{ background: "white", borderColor: "var(--border-light)" }}>
            <div className="container-brand py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <div key={link.href}>
                  <Link href={link.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium hover:bg-cream transition-colors"
                    style={{ color: "var(--text-primary)" }}>{link.label}</Link>
                  {link.children && (
                    <div className="ml-4 space-y-0.5">
                      {link.children.slice(1).map((child) => (
                        <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)}
                          className="flex items-center px-4 py-2 rounded-xl text-xs hover:bg-cream transition-colors"
                          style={{ color: "var(--text-secondary)" }}>{child.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {!session && (
                <div className="pt-2 flex gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center">Sign In</Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
