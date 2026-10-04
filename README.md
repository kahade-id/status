# Status Kahade — status.kahade.id

Halaman status layanan Kahade: dashboard operasional + riwayat insiden.

## Cara memperbarui status

Cukup edit **`lib/status.ts`** — tidak perlu menyentuh komponen:

- `overall.status`: `"operational"` | `"degraded"` | `"incident"` (+ `updatedAt`)
- `services[]`: tambah/ubah layanan (`status`: `"operational"` | `"degraded"` | `"down"`, `uptime90d`: `"99.98%"` atau `null`)
- `uptimeHistory` (opsional): array 90 entri `"up"` | `"down"` | `null` (terlama → terbaru) untuk grafik 90 hari. Kosongkan/`null` bila belum ada data — tampil "—". **Jangan mengarang data.**
- `incidents[]`: tambah insiden baru di **awal** array (terbaru di atas). Tambahkan `isoDate: "2026-10-04"` agar muncul benar di feed RSS. Kosongkan array bila tidak ada insiden — halaman otomatis menampilkan status kosong "Belum ada insiden".
- `maintenances[]`: jadwal pemeliharaan (terdekat di atas). Kosongkan bila tidak ada — tampil "Belum ada pemeliharaan terjadwal".

## Feed RSS & langganan

- Insiden + pemeliharaan otomatis masuk feed **`/feed.xml`** (RSS 2.0, bisa di-subscribe).
- Kartu "Berlangganan pembaruan" di halaman: tautan RSS + daftar via email (mailto).

Konvensi data:
- Semua tanggal/waktu dalam **WIB**.
- `uptime90d: null` menampilkan "—" (jangan mengarang angka uptime).

Setelah edit: commit & push ke `main` — Vercel deploy otomatis ke status.kahade.id.

## Pengembangan lokal

```bash
npm install
npm run dev
```

## Teknologi

Next.js 16 + Tailwind CSS v4 + komponen `@kahade/ui` (design system Kahade).
