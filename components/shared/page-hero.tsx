import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type PageHeroProps = {
  badge?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHero({ badge, title, description, action }: PageHeroProps) {
  return (
    <div className="rounded-[32px] border border-white/70 bg-white/70 px-6 py-8 shadow-panel sm:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          {badge ? <Badge>{badge}</Badge> : null}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  );
}
