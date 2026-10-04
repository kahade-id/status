import { incidents, maintenances } from "@/lib/status";

const BASE = "https://status.kahade.id";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** "2026-10-04" → RFC-822 untuk pubDate RSS. null bila tidak valid. */
function toRfc822(isoDate?: string): string | null {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const d = new Date(`${isoDate}T00:00:00+07:00`);
  return Number.isNaN(d.getTime()) ? null : d.toUTCString();
}

export async function GET(): Promise<Response> {
  const items = [
    ...incidents.map((i) => ({
      title: `Insiden: ${i.title}`,
      description: i.description,
      pubDate: toRfc822(i.isoDate),
      // Tanggal ikut di guid agar tetap unik bila dua insiden punya judul sama.
      guid: `${BASE}/#${encodeURIComponent(`Insiden: ${i.title}`)}${i.isoDate ? `-${i.isoDate}` : ""}`,
    })),
    ...maintenances.map((m) => ({
      title: `Pemeliharaan: ${m.title}`,
      description: `${m.date} (WIB). ${m.description}`,
      pubDate: toRfc822(m.isoDate),
      guid: `${BASE}/#${encodeURIComponent(`Pemeliharaan: ${m.title}`)}${m.isoDate ? `-${m.isoDate}` : ""}`,
    })),
  ];

  const itemsXml = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${BASE}/</link>
      <guid>${item.guid}</guid>
      <description>${escapeXml(item.description)}</description>${item.pubDate ? `\n      <pubDate>${item.pubDate}</pubDate>` : ""}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Status Layanan Kahade</title>
    <link>${BASE}/</link>
    <description>Insiden dan jadwal pemeliharaan layanan Kahade.</description>
    <language>id</language>
${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
