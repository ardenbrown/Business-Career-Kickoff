import type { ReactNode } from "react";

type AccordionItem = {
  title: string;
  content: ReactNode;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          className="rounded-3xl border border-border bg-white/85 p-5 shadow-sm"
          key={item.title}
        >
          <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
            {item.title}
          </summary>
          <div className="pt-4 text-sm leading-7 text-muted">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
