import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RecommendedActions({ actions }: { actions: string[] }) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Recommended next actions</h3>
        <ul className="space-y-3">
          {actions.length ? (
            actions.map((action, index) => (
              <li className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-muted" key={`${action}-${index}`}>
                {action}
              </li>
            ))
          ) : (
            <li className="text-sm text-muted">Complete onboarding to generate next actions.</li>
          )}
        </ul>
        <Button asChild variant="secondary">
          <Link href="/onboarding">Update profile</Link>
        </Button>
      </div>
    </Card>
  );
}
