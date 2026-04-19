import Link from "next/link";

import { requireUser } from "@/lib/auth-helpers";
import { getUserWorkspace } from "@/lib/data";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/shared/page-hero";
import { HistoryList } from "@/components/shared/history-list";
import { ResumeUploadCard } from "@/components/resume/upload-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const authUser = await requireUser();
  const user = await getUserWorkspace(authUser.id);

  return (
    <SiteShell>
      <div className="space-y-8">
        <PageHero
          badge="Profile and account"
          title="Manage your profile, resume, and saved outputs"
          description="All data shown here is private to your account and scoped to your sign-in session."
          action={
            <Button asChild variant="secondary">
              <Link href="/onboarding">Edit profile</Link>
            </Button>
          }
        />
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-ink">Account basics</h3>
              <div className="space-y-2 text-sm text-muted">
                <p>Email: {user?.email}</p>
                <p>Name: {user?.profile?.fullName ?? user?.name ?? "Not set"}</p>
                <p>Major: {user?.profile?.major ?? "Not set"}</p>
                <p>Industry interest: {user?.profile?.industryInterest ?? "Not set"}</p>
                <p>Preferred locations: {user?.profile?.preferredLocations.join(", ") || "Not set"}</p>
              </div>
            </div>
          </Card>
          <ResumeUploadCard />
        </div>
        <HistoryList
          items={
            user?.generatedHistory.map((item) => ({
              id: item.id,
              title: item.title,
              createdAt: item.createdAt,
            })) ?? []
          }
        />
      </div>
    </SiteShell>
  );
}
