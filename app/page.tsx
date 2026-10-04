import { Alert, Badge, ButtonLink, Card, Divider, Icon, Logo } from "@kahade/ui";
import {
  ArrowSquareOut,
  CheckCircle,
  Headset,
  Rss,
} from "@phosphor-icons/react/dist/ssr";
import {
  incidents,
  maintenances,
  overall,
  services,
  type Incident,
  type Maintenance,
  type OverallStatus,
  type Service,
  type ServiceStatus,
} from "@/lib/status";


const serviceStatusMeta: Record<
  ServiceStatus,
  { dot: string; badge: "success" | "warning" | "danger"; label: string }
> = {
  operational: { dot: "bg-green-500", badge: "success", label: "Operasional" },
  degraded: { dot: "bg-amber-500", badge: "warning", label: "Gangguan" },
  down: {
    dot: "bg-red-500",
    badge: "danger",
    label: "Tidak beroperasi",
  },
};

const overallMeta: Record<OverallStatus, { title: string; message: string }> = {
  operational: {
    title: "Semua sistem operasional",
    message:
      "Seluruh layanan Kahade berjalan normal. Halaman ini diperbarui secara manual oleh tim Kahade.",
  },
  degraded: {
    title: "Sebagian layanan mengalami gangguan",
    message:
      "Sebagian layanan Kahade sedang mengalami gangguan. Tim kami sedang menanganinya — lihat detail di bawah.",
  },
  incident: {
    title: "Sedang ada insiden aktif",
    message:
      "Tim Kahade sedang menangani insiden yang berdampak pada layanan. Lihat riwayat insiden di bawah untuk pembaruan.",
  },
};

const incidentStatusMeta: Record<
  Incident["status"],
  { badge: "success" | "warning"; label: string }
> = {
  resolved: { badge: "success", label: "Selesai" },
  monitoring: { badge: "warning", label: "Dipantau" },
  investigating: { badge: "warning", label: "Investigasi" },
};

const maintenanceStatusMeta: Record<
  Maintenance["status"],
  { badge: "success" | "warning"; label: string }
> = {
  scheduled: { badge: "warning", label: "Terjadwal" },
  "in-progress": { badge: "warning", label: "Berlangsung" },
  completed: { badge: "success", label: "Selesai" },
};

/**
 * Grafik 90 hari per layanan. Data-driven dari `service.uptimeHistory`
 * (null = belum ada data → tampil "—", tanpa mengarang).
 * Selalu menyertakan ringkasan sr-only agar terbaca screen reader.
 */
function UptimeBars({ service }: { service: Service }) {
  const history = service.uptimeHistory;
  if (!history || history.length === 0) {
    return (
      <span className="hidden text-sm text-neutral-500 tabular-nums sm:block">
        —
      </span>
    );
  }
  const days = history.slice(-90);
  const upDays = days.filter((d) => d === "up").length;
  const downDays = days.filter((d) => d === "down").length;
  const noDataDays = days.length - upDays - downDays;
  return (
    <span className="hidden items-center gap-3 sm:flex">
      <span
        aria-hidden="true"
        className="flex items-end gap-[2px]"
        title={`${upDays} hari operasional, ${downDays} hari gangguan dari ${days.length} hari terakhir`}
      >
        {days.map((d, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full ${
              d === "up"
                ? "bg-green-500"
                : d === "down"
                  ? "bg-red-500"
                  : "bg-neutral-200"
            } ${d === "up" || d === "down" ? "h-6" : "h-3"}`}
          />
        ))}
      </span>
      {service.uptime90d && (
        <span className="text-sm text-neutral-500 tabular-nums">
          {service.uptime90d}
        </span>
      )}
      <span className="sr-only">
        {service.name}: {upDays} dari {days.length} hari terakhir operasional
        {downDays > 0 && `, ${downDays} hari gangguan`}
        {noDataDays > 0 && `, ${noDataDays} hari tanpa data`}.
      </span>
    </span>
  );
}

function ServiceRow({ service }: { service: Service }) {
  const meta = serviceStatusMeta[service.status];
  return (
    <li className="flex items-center gap-4 px-5 py-4 sm:px-6">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`}
      />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-black">{service.name}</p>
        <p className="truncate text-sm text-neutral-500">
          {service.description}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <UptimeBars service={service} />
        <Badge variant={meta.badge}>{meta.label}</Badge>
      </div>
    </li>
  );
}

function IncidentItem({ incident }: { incident: Incident }) {
  const meta = incidentStatusMeta[incident.status];
  return (
    <li className="px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-medium text-neutral-500">{incident.date}</p>
        <Badge variant={meta.badge}>{meta.label}</Badge>
      </div>
      <p className="mt-1.5 font-semibold text-black">{incident.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-neutral-600">
        {incident.description}
      </p>
    </li>
  );
}

export default function StatusPage() {
  const meta = overallMeta[overall.status];
  const alertVariant =
    overall.status === "operational" ? "success" : "warning";

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <header className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-black">
              Status Kahade
            </h1>
            <p className="text-sm text-neutral-500">
              Status operasional layanan Kahade
            </p>
          </div>
        </header>

        {/* Banner status keseluruhan */}
        <div className="mt-8">
          <Alert variant={alertVariant} title={meta.title}>
            {meta.message}{" "}
            <span className="text-neutral-500">
              Diperbarui {overall.updatedAt} (WIB).
            </span>
          </Alert>
        </div>

        {/* Penjelasan halaman */}
        <p className="mt-6 text-sm leading-relaxed text-neutral-500">
          Halaman ini menampilkan kondisi terkini layanan Kahade. Kahade
          masih dalam tahap pengembangan dan dijadwalkan meluncur pada{" "}
          <span className="font-semibold text-neutral-700">
            8 Desember 2026
          </span>
          . Semua waktu di halaman ini dalam WIB.
        </p>

        {/* Daftar layanan */}
        <section aria-labelledby="layanan" className="mt-10">
          <h2
            id="layanan"
            className="text-lg font-bold tracking-tight text-black"
          >
            Layanan
          </h2>
          <Card className="mt-4 p-0">
            <ul className="divide-y divide-neutral-100">
              {services.map((s) => (
                <ServiceRow key={s.name} service={s} />
              ))}
            </ul>
            <div className="border-t border-neutral-100 px-5 py-3 sm:px-6">
              <p className="text-xs text-neutral-400">
                Grafik 90 hari · “—” berarti belum ada data pengukuran
              </p>
            </div>
          </Card>
        </section>

        {/* Arti status */}
        <section aria-labelledby="arti-status" className="mt-10">
          <h2
            id="arti-status"
            className="text-lg font-bold tracking-tight text-black"
          >
            Arti status
          </h2>
          <Card className="mt-4">
            <dl className="space-y-3">
              {(
                [
                  {
                    status: "operational" as ServiceStatus,
                    desc: "Layanan berjalan normal tanpa kendala yang diketahui.",
                  },
                  {
                    status: "degraded" as ServiceStatus,
                    desc: "Layanan berjalan tetapi ada gangguan sebagian — mis. lambat atau fitur tertentu terganggu.",
                  },
                  {
                    status: "down" as ServiceStatus,
                    desc: "Layanan tidak dapat digunakan untuk sementara waktu.",
                  },
                ]
              ).map((item) => {
                const m = serviceStatusMeta[item.status];
                return (
                  <div key={item.status} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${m.dot}`}
                    />
                    <div>
                      <dt className="font-semibold text-black">{m.label}</dt>
                      <dd className="text-sm text-neutral-500">{item.desc}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </Card>
        </section>

        {/* Riwayat insiden */}
        <section aria-labelledby="insiden" className="mt-10">
          <h2
            id="insiden"
            className="text-lg font-bold tracking-tight text-black"
          >
            Riwayat insiden
          </h2>
          <Card className="mt-4 p-0">
            {incidents.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <Icon
                  icon={CheckCircle}
                  size={32}
                  className="text-neutral-300"
                />
                <p className="mt-3 font-semibold text-black">
                  Belum ada insiden
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Tidak ada insiden layanan yang tercatat.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {incidents.map((i) => (
                  <IncidentItem
                    key={`${i.date}-${i.title}`}
                    incident={i}
                  />
                ))}
              </ul>
            )}
          </Card>
        </section>

        {/* Jadwal pemeliharaan */}
        <section aria-labelledby="pemeliharaan" className="mt-10">
          <h2
            id="pemeliharaan"
            className="text-lg font-bold tracking-tight text-black"
          >
            Jadwal pemeliharaan
          </h2>
          <Card className="mt-4 p-0">
            {maintenances.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <p className="font-semibold text-black">
                  Belum ada pemeliharaan terjadwal
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Jadwal pemeliharaan akan diumumkan di sini sebelumnya.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {maintenances.map((m) => {
                  const meta = maintenanceStatusMeta[m.status];
                  return (
                    <li
                      key={`${m.date}-${m.title}`}
                      className="px-5 py-5 sm:px-6"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-neutral-500">
                          {m.date} (WIB)
                        </p>
                        <Badge variant={meta.badge}>{meta.label}</Badge>
                      </div>
                      <p className="mt-1.5 font-semibold text-black">
                        {m.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                        {m.description}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </section>

        {/* Lapor gangguan & berlangganan */}
        <section aria-labelledby="tetap-terinformasi" className="mt-10">
          <h2
            id="tetap-terinformasi"
            className="text-lg font-bold tracking-tight text-black"
          >
            Tetap terinformasi
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Card className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-100">
                <Icon icon={Rss} size={22} className="text-neutral-700" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold tracking-tight text-black">
                  Berlangganan pembaruan
                </p>
                <p className="mt-0.5 text-sm text-neutral-500">
                  Ikuti insiden & jadwal pemeliharaan via RSS, atau email
                  kami untuk didaftarkan ke notifikasi.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ButtonLink href="/feed.xml">Feed RSS</ButtonLink>
                  <a
                    href="mailto:halo@kahade.id?subject=Berlangganan%20pembaruan%20status%20Kahade"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 bg-white px-6 text-sm font-semibold text-black transition-all duration-150 hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.97]"
                  >
                    Daftar via email
                  </a>
                </div>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-100">
                <Icon icon={Headset} size={22} className="text-neutral-700" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold tracking-tight text-black">
                  Mengalami gangguan?
                </p>
                <p className="mt-0.5 text-sm text-neutral-500">
                  Laporkan kendala yang kamu alami ke tim Kahade melalui
                  pusat bantuan.
                </p>
                <div className="mt-3">
                  <ButtonLink href="https://bantuan.kahade.id/kontak">
                    Lapor gangguan
                  </ButtonLink>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <Divider className="my-10" />

        {/* Catatan kaki */}
        <footer className="text-center text-sm text-neutral-500">
          <nav
            aria-label="Situs Kahade"
            className="mb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            {[
              { label: "kahade.id", href: "https://kahade.id" },
              { label: "Karir", href: "https://karir.kahade.id" },
              { label: "Legalitas", href: "https://legal.kahade.id" },
              { label: "Bantuan", href: "https://bantuan.kahade.id" },
              { label: "Investor", href: "https://investor.kahade.id" },
              { label: "Artikel", href: "https://artikel.kahade.id" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-medium text-neutral-600 transition-colors hover:text-black"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <p>
            Halaman ini diperbarui manual oleh tim Kahade. Butuh bantuan?{" "}
            <a
              href="https://bantuan.kahade.id"
              className="inline-flex items-center gap-1 font-semibold text-black underline-offset-4 hover:underline"
            >
              Kunjungi Bantuan
              <Icon icon={ArrowSquareOut} size={14} />
            </a>
          </p>
          <p className="mt-3 text-xs text-neutral-400">
            © {new Date().getFullYear()} PT Kawal Hak Dengan Aman · Kahade
            adalah aplikasi jual-beli pengguna ke pengguna yang
            tampilannya seperti media sosial.
          </p>
        </footer>
      </main>
    </div>
  );
}
