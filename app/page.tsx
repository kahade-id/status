import {
  Badge,
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeader,
  StatusDot,
  TextLink,
  type BadgeVariant,
  type StatusTone,
} from "@kahade/ui";
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

/* ── Pemetaan status → makna visual ────────────────────────────────────
   Hijau/amber/merah HANYA untuk makna status (DESIGN-LANGUAGE §4). */

const serviceStatusMeta: Record<
  ServiceStatus,
  { tone: StatusTone; badge: BadgeVariant; label: string; desc: string }
> = {
  operational: {
    tone: "positive",
    badge: "success",
    label: "Operasional",
    desc: "Layanan berjalan normal tanpa kendala yang diketahui.",
  },
  degraded: {
    tone: "caution",
    badge: "warning",
    label: "Gangguan",
    desc: "Layanan berjalan tetapi ada gangguan sebagian — mis. lambat atau fitur tertentu terganggu.",
  },
  down: {
    tone: "critical",
    badge: "danger",
    label: "Tidak beroperasi",
    desc: "Layanan tidak dapat digunakan untuk sementara waktu.",
  },
};

const overallMeta: Record<
  OverallStatus,
  { tone: StatusTone; halo: string; title: string; message: string }
> = {
  operational: {
    tone: "positive",
    halo: "bg-positive-soft",
    title: "Semua sistem operasional",
    message: "Seluruh layanan Kahade berjalan normal.",
  },
  degraded: {
    tone: "caution",
    halo: "bg-caution-soft",
    title: "Sebagian layanan mengalami gangguan",
    message:
      "Sebagian layanan Kahade sedang mengalami gangguan. Tim kami sedang menanganinya — lihat detail di bawah.",
  },
  incident: {
    tone: "caution",
    halo: "bg-caution-soft",
    title: "Sedang ada insiden aktif",
    message:
      "Tim Kahade sedang menangani insiden yang berdampak pada layanan. Lihat riwayat insiden di bawah untuk pembaruan.",
  },
};

const incidentStatusMeta: Record<
  Incident["status"],
  { badge: BadgeVariant; label: string }
> = {
  resolved: { badge: "success", label: "Selesai" },
  monitoring: { badge: "warning", label: "Dipantau" },
  investigating: { badge: "warning", label: "Investigasi" },
};

const maintenanceStatusMeta: Record<
  Maintenance["status"],
  { badge: BadgeVariant; label: string }
> = {
  scheduled: { badge: "warning", label: "Terjadwal" },
  "in-progress": { badge: "warning", label: "Berlangsung" },
  completed: { badge: "success", label: "Selesai" },
};

const HISTORY_DAYS = 90;

type Day = "up" | "down" | null;

const dayColor: Record<"up" | "down" | "none", string> = {
  up: "bg-positive",
  down: "bg-critical",
  none: "bg-line",
};

/**
 * Bar riwayat 90 hari. Data-driven dari `service.uptimeHistory`
 * (null = belum ada data). Tanpa data, bar tampil abu netral apa adanya —
 * tidak ada persentase uptime yang dikarang.
 */
function HistoryBar({ service }: { service: Service }) {
  const history = service.uptimeHistory;
  const hasData = !!history && history.length > 0;
  const recorded: Day[] = hasData ? history.slice(-HISTORY_DAYS) : [];
  // Selalu 90 slot: hari tanpa catatan di awal diisi null (abu).
  const days: Day[] = [
    ...Array<Day>(HISTORY_DAYS - recorded.length).fill(null),
    ...recorded,
  ];
  const upDays = recorded.filter((d) => d === "up").length;
  const downDays = recorded.filter((d) => d === "down").length;
  const noDataDays = HISTORY_DAYS - upDays - downDays;

  const summary = !hasData
    ? "Belum ada data pengukuran"
    : service.uptime90d
      ? `Uptime ${service.uptime90d}`
      : `${upDays} dari ${recorded.length} hari operasional`;

  return (
    <div className="mt-4">
      <div aria-hidden="true" className="flex h-8 gap-px sm:gap-0.5">
        {days.map((d, i) => (
          <span
            key={i}
            className={`min-w-0 flex-1 rounded-full ${dayColor[d ?? "none"]}`}
          />
        ))}
      </div>
      <p className="mt-2 flex items-center justify-between gap-3 text-caption text-fg-subtle">
        <span aria-hidden="true">90 hari lalu</span>
        <span className="text-center">
          <span className="sr-only">Riwayat 90 hari: </span>
          {summary}
          {hasData && (
            <span className="sr-only">
              {`. ${upDays} hari operasional`}
              {downDays > 0 && `, ${downDays} hari gangguan`}
              {noDataDays > 0 && `, ${noDataDays} hari tanpa data`}.
            </span>
          )}
        </span>
        <span aria-hidden="true">Hari ini</span>
      </p>
    </div>
  );
}

function ServiceRow({ service }: { service: Service }) {
  const meta = serviceStatusMeta[service.status];
  return (
    <li className="border-b border-line py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-h4 text-fg">{service.name}</h3>
          <p className="mt-0.5 text-small text-fg-muted">
            {service.description}
          </p>
        </div>
        <Badge variant={meta.badge} className="mt-0.5 shrink-0 gap-2">
          <StatusDot tone={meta.tone} />
          {meta.label}
        </Badge>
      </div>
      <HistoryBar service={service} />
    </li>
  );
}

/** Baris kronologis (insiden / pemeliharaan): tanggal kiri, isi kanan. */
function LogItem({
  date,
  isoDate,
  title,
  description,
  badge,
}: {
  date: string;
  isoDate?: string;
  title: string;
  description: string;
  badge: { badge: BadgeVariant; label: string };
}) {
  return (
    <li className="grid gap-2 border-b border-line py-6 sm:grid-cols-12 sm:gap-8">
      <div className="sm:col-span-4">
        <time
          dateTime={isoDate}
          className="text-small font-medium text-fg-subtle tabular-nums"
        >
          {date}
        </time>
      </div>
      <div className="min-w-0 sm:col-span-8">
        <Badge variant={badge.badge}>{badge.label}</Badge>
        <h3 className="mt-3 text-h4 text-fg">{title}</h3>
        <p className="mt-1 text-small text-fg-muted sm:text-body">
          {description}
        </p>
      </div>
    </li>
  );
}

/** Keadaan kosong yang tenang: satu baris berhairline, tanpa ikon besar. */
function QuietEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 border-y border-line py-6">
      <StatusDot tone="neutral" className="mt-2" />
      <div>
        <p className="font-semibold text-fg">{title}</p>
        <p className="mt-1 text-small text-fg-muted">{description}</p>
      </div>
    </div>
  );
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PT Kawal Hak Dengan Aman",
  url: "https://status.kahade.id",
  logo: "https://status.kahade.id/favicon.svg",
  sameAs: [
    "https://kahade.id",
    "https://karir.kahade.id",
    "https://legal.kahade.id",
    "https://bantuan.kahade.id",
    "https://status.kahade.id",
    "https://investor.kahade.id",
    "https://artikel.kahade.id",
  ],
};

export default function StatusPage() {
  const meta = overallMeta[overall.status];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      {/* ── Kepala: status keseluruhan ─────────────────────────────── */}
      <header className="border-b border-line">
        <Container size="narrow" className="pt-10 pb-12 sm:pt-14 sm:pb-14 lg:pt-20 lg:pb-16">
          <Eyebrow className="mb-5">Status layanan Kahade</Eyebrow>
          <h1 className="flex items-start gap-[0.3em] text-h1 text-fg">
            {/* Ukuran halo dalam em agar selalu sejajar baris pertama judul. */}
            <span
              aria-hidden="true"
              className={`mt-[0.175em] inline-flex size-[0.7em] shrink-0 items-center justify-center rounded-full ${meta.halo}`}
            >
              <StatusDot tone={meta.tone} className="scale-150 lg:scale-[1.75]" />
            </span>
            <span className="min-w-0">{meta.title}</span>
          </h1>
          <p className="mt-5 max-w-[40rem] text-lead text-fg-muted sm:mt-6">
            {meta.message}
          </p>
          <p className="mt-4 max-w-[40rem] text-body text-fg-muted">
            Kahade masih dalam tahap pengembangan dan dijadwalkan meluncur pada{" "}
            <strong className="font-semibold whitespace-nowrap text-fg">
              8 Desember 2026
            </strong>.
            Halaman ini menampilkan kondisi terkini layanan Kahade.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6 sm:mt-12 sm:flex sm:flex-wrap sm:gap-x-12">
            <div className="min-w-0">
              <dt className="text-caption text-fg-subtle">Pembaruan terakhir</dt>
              <dd className="mt-1 text-small font-semibold text-fg tabular-nums">
                {overall.updatedAt} (WIB)
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-caption text-fg-subtle">Cara pembaruan</dt>
              <dd className="mt-1 text-small font-semibold text-fg">
                Manual oleh tim Kahade
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-caption text-fg-subtle">Zona waktu</dt>
              <dd className="mt-1 text-small font-semibold text-fg">
                WIB (UTC+7)
              </dd>
            </div>
          </dl>
        </Container>
      </header>

      {/* ── 01 Layanan ─────────────────────────────────────────────── */}
      <Section id="layanan" containerSize="narrow" spacing="sm">
        <SectionHeader
          index="01"
          eyebrow="Layanan"
          title="Status per layanan"
          size="h3"
          description="Kondisi saat ini dan riwayat 90 hari terakhir. Bar abu-abu berarti belum ada data pengukuran."
        />
        <ul className="mt-8 border-t border-line">
          {services.map((s) => (
            <ServiceRow key={s.name} service={s} />
          ))}
        </ul>

        <div className="mt-10">
          <h3 className="text-small font-semibold text-fg">Arti status</h3>
          <dl className="mt-4 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {(Object.keys(serviceStatusMeta) as ServiceStatus[]).map((key) => {
              const m = serviceStatusMeta[key];
              return (
                <div key={key}>
                  <dt className="flex items-center gap-2.5 text-small font-semibold text-fg">
                    <StatusDot tone={m.tone} />
                    {m.label}
                  </dt>
                  <dd className="mt-0.5 pl-[18px] text-small text-fg-muted">{m.desc}</dd>
                </div>
              );
            })}
            <div>
              <dt className="flex items-center gap-2.5 text-small font-semibold text-fg">
                <span aria-hidden="true" className="h-3.5 w-2 shrink-0 rounded-full bg-line" />
                Belum ada data
              </dt>
              <dd className="mt-0.5 pl-[18px] text-small text-fg-muted">
                Bar abu-abu: belum ada data pengukuran untuk hari tersebut.
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* ── 02 Insiden ─────────────────────────────────────────────── */}
      <Section id="insiden" containerSize="narrow" spacing="sm" divider>
        <SectionHeader index="02" eyebrow="Insiden" title="Riwayat insiden" size="h3" />
        <div className="mt-8">
          {incidents.length === 0 ? (
            <QuietEmpty
              title="Belum ada insiden"
              description="Tidak ada insiden layanan yang tercatat."
            />
          ) : (
            <ul className="border-t border-line">
              {incidents.map((i) => (
                <LogItem
                  key={`${i.date}-${i.title}`}
                  date={i.date}
                  isoDate={i.isoDate}
                  title={i.title}
                  description={i.description}
                  badge={incidentStatusMeta[i.status]}
                />
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* ── 03 Pemeliharaan ────────────────────────────────────────── */}
      <Section id="pemeliharaan" containerSize="narrow" spacing="sm" divider>
        <SectionHeader
          index="03"
          eyebrow="Pemeliharaan"
          title="Jadwal pemeliharaan"
          size="h3"
        />
        <div className="mt-8">
          {maintenances.length === 0 ? (
            <QuietEmpty
              title="Belum ada pemeliharaan terjadwal"
              description="Jadwal pemeliharaan akan diumumkan di sini sebelumnya."
            />
          ) : (
            <ul className="border-t border-line">
              {maintenances.map((m) => (
                <LogItem
                  key={`${m.date}-${m.title}`}
                  date={`${m.date} (WIB)`}
                  isoDate={m.isoDate}
                  title={m.title}
                  description={m.description}
                  badge={maintenanceStatusMeta[m.status]}
                />
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* ── 04 Langganan ───────────────────────────────────────────── */}
      <Section id="langganan" containerSize="narrow" spacing="sm" divider>
        <SectionHeader
          index="04"
          eyebrow="Langganan"
          title="Ikuti pembaruan"
          size="h3"
          description="Ikuti insiden dan jadwal pemeliharaan lewat RSS, atau email kami untuk didaftarkan ke notifikasi."
        />
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1">
          <TextLink href="/feed.xml">Feed RSS</TextLink>
          <TextLink href="mailto:halo@kahade.id?subject=Berlangganan%20pembaruan%20status%20Kahade">
            Daftar via email
          </TextLink>
        </div>
      </Section>

      {/* ── Ajakan penutup ─────────────────────────────────────────── */}
      <section className="bg-surface-inverse text-white">
        <Container
          size="narrow"
          className="flex flex-col gap-8 py-14 sm:py-16 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-md">
            <h2 className="text-h3 text-white">Mengalami gangguan?</h2>
            <p className="mt-3 text-body-lg text-white/70">
              Laporkan kendala yang kamu alami ke tim Kahade melalui pusat
              bantuan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="https://bantuan.kahade.id/kontak" variant="inverse">
              Lapor gangguan
            </ButtonLink>
            <ButtonLink href="https://bantuan.kahade.id/" variant="inverseSecondary">
              Pusat bantuan
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
