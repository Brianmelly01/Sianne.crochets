"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Registration failed"); return; }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("Welcome to Sianne.crochets! 🌸");
      router.push("/");
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  };

  const fields = [
    { key: "name" as const, label: "Full Name", type: "text", placeholder: "Your full name", icon: User },
    { key: "email" as const, label: "Email", type: "email", placeholder: "your@email.com", icon: Mail },
    { key: "phone" as const, label: "Phone (optional)", type: "tel", placeholder: "07XX XXX XXX", icon: Phone },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4" style={{ background: "var(--cream)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="relative w-16 h-16"><Image src="/logo.png" alt="Sianne.crochets" fill className="object-contain" /></div>
            <span className="text-2xl font-display font-light" style={{ color: "var(--text-primary)" }}>
              sianne<span style={{ color: "var(--nude-dark)" }}>.crochets</span>
            </span>
          </Link>
          <h1 className="text-3xl font-display font-light mt-6 mb-2" style={{ color: "var(--text-primary)" }}>Create an account</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Join our community of crochet lovers</p>
        </div>

        <div className="card p-8">
          <button onClick={() => signIn("google", { callbackUrl: "/" })} className="btn-secondary w-full mb-6 justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <div className="divider-brand text-xs mb-6" style={{ color: "var(--text-muted)" }}>or</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
              <div key={key}>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                  <input type={type} value={form[key]} onChange={update(key)} placeholder={placeholder}
                    required={key !== "phone"} className="input-brand pl-10" />
                </div>
              </div>
            ))}
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type={showPw ? "text" : "password"} value={form.password} onChange={update("password")} required
                  placeholder="Min. 8 characters" className="input-brand pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff size={15} style={{ color: "var(--text-muted)" }} /> : <Eye size={15} style={{ color: "var(--text-muted)" }} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="password" value={form.confirmPassword} onChange={update("confirmPassword")} required
                  placeholder="Repeat password" className="input-brand pl-10" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--nude-dark)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
