import type { Metadata, Viewport } from "next";
import "./globals.css";

const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap";

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
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Status Layanan Kahade"
          href="/feed.xml"
        />
      </head>
      <body>
        {/* Dimensi A2 audit: skip-to-content link. Target #konten ada di
            page.tsx, not-found.tsx, dan error.tsx. */}
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-black focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
