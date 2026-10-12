import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Mark Kahade — path identik dengan komponen `Logo` di @kahade/ui
   (viewBox 0 0 417.6 512), kuning brand di atas latar hitam. */
const MARK = (
  <svg width="78" height="96" viewBox="0 0 417.6 512" fill="#FFD200">
    <path d="M164.7 248.4 C155.5 215.9 180.8 198.3 206.8 186.5 C257 163.9 336.5 149 378.6 127.8 C430.6 101.7 419.4 61.4 368.9 44 C350.5 37.6 331.7 32.4 313.4 25.9 C286.9 16.6 259.5 6.9 232.2 0 C231.3 55.4 211.7 57.7 166.8 77.2 C137.7 89.8 45.4 120.3 28.3 130.9 C-15 157.8 -7.1 197.4 41.7 213.6 C58 219.1 74.6 223.6 90.9 229 C114.7 237 140 243.8 164.7 248.4Z" />
    <path d="M252.9 263.6 C262.1 296.1 236.8 313.7 210.7 325.5 C160.5 348.1 81 363 39 384.2 C-13.1 410.3 -1.8 450.6 48.7 468 C67.1 474.4 85.8 479.6 104.2 486.1 C130.7 495.4 158.1 505.1 185.3 512 C186.2 456.6 205.8 454.3 250.7 434.8 C279.9 422.2 372.2 391.7 389.3 381.1 C432.5 354.2 424.7 314.6 375.9 298.4 C359.5 292.9 343 288.4 326.7 283 C302.9 275 277.6 268.2 252.9 263.6Z" />
  </svg>
);

const TITLE = "Status Layanan Kahade";
const SUBTITLE = "Status operasional layanan Kahade.";
const HOST = "status.kahade.id";

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 500 | 800;
  style: "normal";
};

/**
 * Plus Jakarta Sans (500 & 800) dari Google Fonts, di-subset ke teks OG.
 * Satori butuh TTF/OTF/WOFF — CSS API mengirim TTF ke klien non-browser.
 * Gagal (mis. build offline) → undefined, fallback ke font bawaan.
 */
async function loadFonts(): Promise<OgFont[] | undefined> {
  try {
    const text = encodeURIComponent(`${TITLE}${SUBTITLE}${HOST}`);
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;800&text=${text}`,
    ).then((res) => (res.ok ? res.text() : ""));
    const faces = [
      ...css.matchAll(
        /font-weight:\s*(\d+);[^}]*?src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype|woff)'\)/g,
      ),
    ];
    const fonts = await Promise.all(
      faces.map(async ([, weight, url]) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`font ${res.status}`);
        return {
          name: "Plus Jakarta Sans",
          data: await res.arrayBuffer(),
          weight: (weight === "800" ? 800 : 500) as OgFont["weight"],
          style: "normal" as const,
        };
      }),
    );
    return fonts.length > 0 ? fonts : undefined;
  } catch {
    return undefined;
  }
}

export default async function OgImage() {
  const fonts = await loadFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#000000",
          color: "#ffffff",
          fontFamily: fonts ? "'Plus Jakarta Sans'" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>{MARK}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "80px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-3px",
            }}
          >
            {TITLE}
          </div>
          <div
            style={{
              marginTop: "28px",
              display: "flex",
              fontSize: "30px",
              fontWeight: 500,
              color: "#d4d4d4",
            }}
          >
            {SUBTITLE}
          </div>
          <div
            style={{
              marginTop: "40px",
              paddingTop: "28px",
              borderTop: "1px solid #333333",
              display: "flex",
              fontSize: "24px",
              fontWeight: 500,
              color: "#a3a3a3",
            }}
          >
            {HOST}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
