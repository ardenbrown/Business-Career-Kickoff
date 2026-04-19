import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-3xl border border-border bg-white/90 px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
