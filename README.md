# Status Kahade — status.kahade.id

Halaman status layanan Kahade: dashboard operasional + riwayat insiden.

## Cara memperbarui status

Cukup edit **`lib/status.ts`** — tidak perlu menyentuh komponen:

- `overall.status`: `"operational"` | `"degraded"` | `"incident"` (+ `updatedAt`)
- `services[]`: tambah/ubah layanan (`status`: `"operational"` | `"degraded"` | `"down"`, `uptime90d`: `"99.98%"` atau `null`)
- `incidents[]`: tambah insiden baru di **awal** array (terbaru di atas). Kosongkan array bila tidak ada insiden — halaman otomatis menampilkan status kosong "Belum ada insiden".

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
