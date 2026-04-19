import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border bg-white/90 px-4 py-2 text-sm text-ink shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
