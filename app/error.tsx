"use client";

import { useEffect } from "react";
import { ArrowLeft, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink, EmptyState, Logo } from "@kahade/ui";

/**
 * Error boundary rute: tampil saat ada galat client-side di halaman status.
 * Copy Bahasa Indonesia + tombol "Coba lagi" (reset) sesuai dimensi C audit.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Catat ke console untuk diagnosis; tidak menampilkan detail teknis ke pengguna.
    // eslint-disable-next-line no-console
    console.error("Status page error:", error);
  }, [error]);

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
        icon={WarningCircle}
        title="Ada yang tidak beres"
        description="Halaman status gagal dimuat. Coba muat ulang — bila masih gagal, laporkan ke tim Kahade lewat pusat bantuan."
        action={
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button onClick={reset} leftIcon={ArrowLeft}>
              Coba lagi
            </Button>
            <ButtonLink
              variant="secondary"
              href="https://bantuan.kahade.id/kontak"
            >
              Hubungi bantuan
            </ButtonLink>
          </div>
        }
      />
    </main>
  );
}
