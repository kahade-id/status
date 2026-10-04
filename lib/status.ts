/**
 * DATA STATUS LAYANAN KAHADE
 * ──────────────────────────
 * Untuk memperbarui halaman status, cukup edit file ini — tidak perlu
 * menyentuh komponen. Setelah edit, commit & push; Vercel deploy otomatis.
 *
 * Panduan:
 * - `status` layanan: "operational" | "degraded" | "down"
 * - `uptime90d`: persentase string ("99.98%") atau null bila belum ada data.
 *   JANGAN mengarang angka — null menampilkan "—".
 * - `uptimeHistory`: array 90 entri ("up" | "down" | null, urutan lama → baru)
 *   untuk grafik 90 hari. null = belum ada data (tampil "—"). JANGAN mengarang.
 * - Insiden baru: tambahkan di AWAL array `incidents` (terbaru di atas).
 * - `overall`: "operational" bila semua layanan operasional, "degraded" bila
 *   ada yang degraded, "incident" bila ada insiden aktif.
 * - Pemeliharaan terjadwal: tambah di array `maintenances` (terdekat di atas).
 * - Semua tanggal/waktu dalam WIB. Format tanggal tampil: "4 Okt 2026".
 */

export type ServiceStatus = "operational" | "degraded" | "down";
export type OverallStatus = "operational" | "degraded" | "incident";

export interface Service {
  name: string;
  description: string;
  status: ServiceStatus;
  /** Uptime 90 hari, mis. "99.98%". null = belum ada data (tampil "—"). */
  uptime90d: string | null;
  /**
   * Riwayat 90 hari untuk grafik (urutan: terlama → terbaru).
   * Tiap entri: "up" | "down" | null (null = tidak ada data hari itu).
   * null/undefined = belum ada data sama sekali (tampil "—"). JANGAN mengarang.
   */
  uptimeHistory?: ("up" | "down" | null)[] | null;
}

export interface Incident {
  /** Format: "4 Okt 2026" (WIB). */
  date: string;
  /** Opsional: tanggal ISO untuk feed RSS, mis. "2026-10-04". */
  isoDate?: string;
  title: string;
  /** "resolved" | "monitoring" | "investigating" */
  status: "resolved" | "monitoring" | "investigating";
  description: string;
}

export interface Maintenance {
  /** Format: "10 Okt 2026, 01.00–03.00" (WIB). */
  date: string;
  /** Opsional: tanggal ISO untuk feed RSS, mis. "2026-10-10". */
  isoDate?: string;
  title: string;
  description: string;
  /** "scheduled" | "in-progress" | "completed" */
  status: "scheduled" | "in-progress" | "completed";
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

/**
 * Urutan: insiden terbaru paling atas.
 * Kosongkan array bila tidak ada insiden — halaman menampilkan
 * status kosong "Belum ada insiden" secara otomatis.
 */
export const incidents: Incident[] = [];

/**
 * Jadwal pemeliharaan layanan.
 * Urutan: yang terdekat paling atas. Kosongkan array bila tidak ada
 * jadwal — halaman menampilkan "Belum ada pemeliharaan terjadwal".
 */
export const maintenances: Maintenance[] = [];
