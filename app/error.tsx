"use client";

import { useEffect } from "react";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink, Container, EmptyState } from "@kahade/ui";

/**
 * Error boundary rute: tampil saat ada galat client-side di halaman status.
 * Di-render di dalam root layout (header & footer DS tetap tampil).
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
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <EmptyState
        icon={WarningCircle}
        title="Ada yang tidak beres"
        description="Halaman status gagal dimuat. Coba muat ulang — bila masih gagal, laporkan ke tim Kahade lewat pusat bantuan."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button type="button" onClick={() => reset()}>
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
    </Container>
  );
}
