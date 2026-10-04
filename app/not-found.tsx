import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { EmptyState, Logo } from "@kahade/ui";
import { ButtonLink } from "@/components/ButtonLink";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-5">
      <div className="mb-6 flex items-center gap-2.5">
        <Logo size={26} />
        <span className="text-base font-extrabold tracking-tight text-black">
          Status Kahade
        </span>
      </div>
      <EmptyState
        icon={MagnifyingGlass}
        title="Halaman tidak ditemukan"
        description="Alamat yang kamu tuju tidak ada atau sudah dipindahkan."
        action={
          <ButtonLink href="/">Kembali ke Status Layanan</ButtonLink>
        }
      />
    </div>
  );
}
