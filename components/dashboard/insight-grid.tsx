import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export function InsightGrid({
  cards,
}: {
  cards: { title: string; items: string[]; href: string }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Link href={card.href} key={card.title}>
          <Card className="flex h-full flex-col justify-between p-5 transition hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                  {card.title}
                </h3>
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <ul className="space-y-3">
                {card.items.slice(0, 3).map((item) => (
                  <li className="text-sm leading-6 text-muted" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
