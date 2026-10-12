"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@kahade/ui";

/**
 * Header global DS untuk status.kahade.id. Situs satu halaman — tanpa nav,
 * cukup CTA ke pusat bantuan.
 */
export function Header() {
  const pathname = usePathname();
  return (
    <SiteHeader
      site="status"
      cta={{ label: "Pusat bantuan", href: "https://bantuan.kahade.id/" }}
      pathname={pathname}
      linkAs={Link}
    />
  );
}
