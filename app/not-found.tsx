import type { Metadata } from "next";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink, EmptyState, Logo } from "@kahade/ui";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan — Kahade",
  description: "Alamat yang kamu tuju tidak ada atau sudah dipindahkan.",
};

export default function NotFound() {
  return (
    <main
      id="konten"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center bg-white px-5"
    >
      <div className="mb-6 flex items-center gap-2.5">
        <Logo size={26} />
        <span className="text-base font-extrabold tracking-tight text-black">
          Status Kahade
        </span>
      </div>
      <EmptyState
        icon={MagnifyingGlass}
        // Dimensi D audit batch 8: headingLevel=1 agar halaman 404 punya
        // satu h1 sungguhan ("Halaman tidak ditemukan").
        headingLevel={1}
        title="Halaman tidak ditemukan"
        description="Alamat yang kamu tuju tidak ada atau sudah dipindahkan."
        action={
          <ButtonLink href="/">Kembali ke Status Layanan</ButtonLink>
        }
      />
    </main>
  );
}
