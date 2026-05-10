import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import SessionProvider from "@/components/providers/SessionProvider";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: {
    default: "Sianne.crochets — Luxury Handmade Crochet Fashion",
    template: "%s | Sianne.crochets",
  },
  description:
    "Discover premium handcrafted crochet fashion — tops, dresses, bags, accessories & more. Made with love, worn with style. Shop the latest collections from Sianne.crochets.",
  keywords: [
    "crochet fashion", "handmade fashion Kenya", "crochet bags", "crochet tops",
    "luxury handmade", "Nairobi fashion", "crochet accessories", "sianne crochets",
  ],
  openGraph: {
    title: "Sianne.crochets — Luxury Handmade Crochet Fashion",
    description: "Premium handcrafted crochet fashion made with love.",
    type: "website",
    locale: "en_KE",
    siteName: "Sianne.crochets",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <SessionProvider session={session}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              className: "toast-brand",
              style: {
                fontFamily: "'Inter', sans-serif",
                borderRadius: "12px",
                border: "1px solid #F0E8DC",
                boxShadow: "0 8px 40px rgba(180,140,100,0.15)",
                background: "#FEFCFA",
                color: "#2C1810",
              },
              success: {
                iconTheme: { primary: "#D4AF37", secondary: "#FEFCFA" },
              },
              error: {
                iconTheme: { primary: "#DC2626", secondary: "#FEFCFA" },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
