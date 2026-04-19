import { requireUser } from "@/lib/auth-helpers";
import { getUserWorkspace } from "@/lib/data";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/shared/page-hero";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default async function TimelinePage() {
  const authUser = await requireUser();
  const user = await getUserWorkspace(authUser.id);
  const timeline = user?.timelinePlans[0];

  if (!timeline) {
    return (
      <SiteShell>
        <EmptyState
          actionHref="/onboarding"
          actionLabel="Generate timeline"
          description="Complete onboarding to generate a personalized timeline using your graduation timing, stage, and earliest start date."
          title="No timeline yet"
        />
      </SiteShell>
    );
  }

  const milestones = timeline.milestones as unknown as Array<{
    label: string;
    timeframe: string;
    description: string;
    editable?: boolean;
  }>;

  return (
    <SiteShell>
      <div className="space-y-8">
        <PageHero
          badge="Timeline planner"
          title="A milestone-based job search timeline"
          description={timeline.summary}
        />
        <div className="relative space-y-4 before:absolute before:left-[1.1rem] before:top-3 before:h-[calc(100%-1rem)] before:w-px before:bg-primary/15">
          {milestones.map((milestone) => (
            <Card className="relative p-6 pl-14" key={`${milestone.label}-${milestone.timeframe}`}>
              <div className="absolute left-6 top-7 h-4 w-4 rounded-full bg-primary shadow-soft" />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {milestone.timeframe}
                </p>
                <h3 className="text-lg font-semibold text-ink">{milestone.label}</h3>
                <p className="text-sm leading-7 text-muted">{milestone.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
