import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * Tautan dengan visual persis DS Button (variant primary).
 * Dipakai karena komponen Button DS hanya me-render <button> —
 * menaruh <button> di dalam <a> (atau sebaliknya) adalah HTML invalid
 * dan membingungkan screen reader.
 */
export function ButtonLink({
  children,
  className = "",
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a
      className={[
        "inline-flex items-center justify-center rounded-full font-semibold",
        "h-11 px-6 text-sm gap-2",
        "bg-black text-white hover:bg-neutral-800 active:bg-black",
        "transition-all duration-150 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
        "active:scale-[0.97]",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </a>
  );
}
