/**
 * DATA STATUS LAYANAN KAHADE
 * ──────────────────────────
 * Untuk memperbarui halaman status, cukup edit file ini — tidak perlu
 * menyentuh komponen. Setelah edit, commit & push; Vercel deploy otomatis.
 *
 * Panduan:
 * - `status` layanan: "operational" | "degraded" | "down"
 * - `uptime90d`: persentase string ("99.98%") atau null bila belum ada data.
 * - Insiden baru: tambahkan di AWAL array `incidents` (terbaru di atas).
 * - `overall`: "operational" bila semua layanan operasional, "degraded" bila
 *   ada yang degraded, "incident" bila ada insiden aktif.
 */

export type ServiceStatus = "operational" | "degraded" | "down";
export type OverallStatus = "operational" | "degraded" | "incident";

export interface Service {
  name: string;
  description: string;
  status: ServiceStatus;
  /** Uptime 90 hari, mis. "99.98%". null = belum ada data. */
  uptime90d: string | null;
}

export interface Incident {
  /** Format bebas, mis. "4 Okt 2026". */
  date: string;
  title: string;
  /** "resolved" | "monitoring" | "investigating" */
  status: "resolved" | "monitoring" | "investigating";
  description: string;
}

export const overall: { status: OverallStatus; updatedAt: string } = {
  status: "operational",
  updatedAt: "4 Okt 2026",
};

export const services: Service[] = [
  {
    name: "API",
    description: "api.kahade.id — layanan backend aplikasi",
    status: "operational",
    uptime90d: null,
  },
  {
    name: "Aplikasi Mobile",
    description: "Kahade untuk Android & iOS",
    status: "operational",
    uptime90d: null,
  },
  {
    name: "kahade.id",
    description: "Situs utama Kahade",
    status: "operational",
    uptime90d: null,
  },
  {
    name: "karir.kahade.id",
    description: "Halaman karier Kahade",
    status: "operational",
    uptime90d: null,
  },
  {
    name: "Admin Panel",
    description: "admin.kahade.id — panel operasional internal",
    status: "operational",
    uptime90d: null,
  },
  {
    name: "OTP WhatsApp",
    description: "Layanan kode verifikasi via WhatsApp",
    status: "operational",
    uptime90d: null,
  },
];

/** Urutan: insiden terbaru paling atas. */
export const incidents: Incident[] = [
  {
    date: "4 Okt 2026",
    title: "Dalam tahap pengembangan",
    status: "monitoring",
    description:
      "Kahade masih dalam tahap pengembangan dan belum diluncurkan untuk publik. Peluncuran perdana dijadwalkan pada 8 Desember 2026. Belum ada insiden layanan yang tercatat.",
  },
];
