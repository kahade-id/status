import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SiteFooter } from "@kahade/ui";
import { Header } from "@/components/site/Header";

// Plus Jakarta Sans self-hosted via next/font: tanpa CSS pihak ketiga yang
// memblokir render. Variabel dipasang di <html> agar token --font-sans di
// :root ikut terisi (memasangnya di <body> membuat font jatuh ke fallback).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Status Layanan Kahade — Uptime & Insiden",
  description:
    "Pantau status operasional layanan Kahade: API, aplikasi mobile, dan situs web. Lihat riwayat uptime, insiden, dan jadwal pemeliharaan.",
  metadataBase: new URL("https://status.kahade.id"),
  alternates: {
    // Canonical absolut (di-resolve dari metadataBase) — dimensi E audit.
    canonical: "/",
  },
  icons: {
    // Dimensi D audit batch 7: ikon PNG nyata per ukuran (bukan hanya SVG) +
    // apple-touch-icon 180x180 agar tidak 404 saat iOS meminta.
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Status Kahade",
    title: "Status Layanan Kahade — Uptime & Insiden",
    description:
      "Status operasional layanan Kahade: API, aplikasi mobile, dan situs web — beserta riwayat insiden.",
  },
  // Dimensi D audit: twitter card lengkap (twitter:image diambil otomatis
  // dari opengraph-image.tsx oleh Next.js).
  twitter: {
    card: "summary_large_image",
    title: "Status Layanan Kahade — Uptime & Insiden",
    description:
      "Status operasional layanan Kahade: API, aplikasi mobile, dan situs web — beserta riwayat insiden.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={jakarta.variable} data-scroll-behavior="smooth">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Status Layanan Kahade"
          href="/feed.xml"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#konten-utama" className="kh-skip-link">
          Lewati ke konten utama
        </a>
        <Header />
        <main id="konten-utama" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter
          site="status"
          linkAs={Link}
          note="Halaman status ini diperbarui manual oleh tim Kahade."
        />
      </body>
    </html>
  );
}
