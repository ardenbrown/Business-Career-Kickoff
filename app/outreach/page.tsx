import { requireUser } from "@/lib/auth-helpers";
import { getUserWorkspace, toStringArray } from "@/lib/data";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/shared/page-hero";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState } from "@/components/ui/empty-state";

export default async function OutreachPage() {
  const authUser = await requireUser();
  const user = await getUserWorkspace(authUser.id);
  const outreach = user?.outreachTemplateSets[0];

  if (!outreach) {
    return (
      <SiteShell>
        <EmptyState
          actionHref="/onboarding"
          actionLabel="Generate outreach"
          description="Complete onboarding to generate personalized networking, follow-up, and thank-you templates."
          title="No outreach guidance yet"
        />
      </SiteShell>
    );
  }

  const blocks = [
    { title: "Networking email", value: outreach.networkingEmail as { subject: string; body: string } },
    { title: "LinkedIn outreach", value: outreach.linkedInMessage as { body: string } },
    { title: "Informational interview request", value: outreach.interviewRequest as { subject: string; body: string } },
    { title: "Follow-up note", value: outreach.followUpNote as { subject: string; body: string } },
    { title: "Thank-you email", value: outreach.thankYouEmail as { subject: string; body: string } },
  ];

  return (
    <SiteShell>
      <div className="space-y-8">
        <PageHero
          badge="Outreach toolkit"
          title="Personalized templates for networking and follow-up"
          description={`Generated in a ${outreach.tone.toLowerCase()} tone and aligned to your current search stage.`}
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {blocks.map((block) => (
            <Card className="p-6" key={block.title}>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-ink">{block.title}</h3>
                  <CopyButton value={JSON.stringify(block.value, null, 2)} />
                </div>
                {"subject" in block.value ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Subject</p>
                    <p className="mt-2 text-sm text-ink">{block.value.subject}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Message</p>
                  <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-slateBlue/40 p-4 text-sm leading-7 text-ink">
                    {block.value.body}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ink">Context-aware tips</h3>
            <ul className="space-y-3">
              {toStringArray(outreach.tips).map((tip) => (
                <li className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-muted" key={tip}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </SiteShell>
  );
}
