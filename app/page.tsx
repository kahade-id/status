import { Alert, Badge, Card, Divider, Icon, Logo } from "@kahade/ui";
import {
  ArrowSquareOut,
  CheckCircle,
  Headset,
} from "@phosphor-icons/react/dist/ssr";
import {
  incidents,
  overall,
  services,
  type Incident,
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
  down: { dot: "bg-red-500", badge: "danger", label: "Down" },
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
        <span className="hidden text-sm text-neutral-500 tabular-nums sm:block">
          {service.uptime90d ?? "—"}
        </span>
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
                Uptime 90 hari · “—” berarti belum ada data pengukuran
              </p>
            </div>
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

        {/* Lapor gangguan */}
        <section aria-labelledby="lapor" className="mt-10">
          <Card className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-100">
              <Icon icon={Headset} size={22} className="text-neutral-700" />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="lapor"
                className="font-bold tracking-tight text-black"
              >
                Mengalami gangguan?
              </h2>
              <p className="mt-0.5 text-sm text-neutral-500">
                Laporkan kendala yang kamu alami ke tim Kahade melalui
                pusat bantuan.
              </p>
            </div>
            <a
              href="https://bantuan.kahade.id/kontak"
              className="shrink-0 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:scale-[0.97]"
            >
              Lapor gangguan
            </a>
          </Card>
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
