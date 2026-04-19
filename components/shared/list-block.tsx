import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";

export function ListBlock({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <ul className="space-y-3">
          {items.map((item) => (
            <li className="flex gap-3 text-sm leading-7 text-muted" key={item}>
              <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
