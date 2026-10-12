import type { Metadata } from "next";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink, Container, EmptyState } from "@kahade/ui";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan — Kahade",
  description: "Alamat yang kamu tuju tidak ada atau sudah dipindahkan.",
};

/**
 * Halaman 404: di-render DI DALAM root layout (SiteHeader + SiteFooter sudah
 * tersedia) — hanya isi konten. headingLevel=1 agar ada satu h1 sungguhan.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <EmptyState
        icon={MagnifyingGlass}
        headingLevel={1}
        title="Halaman tidak ditemukan"
        description="Alamat yang kamu tuju tidak ada atau sudah dipindahkan."
        action={<ButtonLink href="/">Kembali ke status layanan</ButtonLink>}
      />
    </Container>
  );
}
