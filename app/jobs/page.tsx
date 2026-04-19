import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { searchJobsWithCache } from "@/lib/jobs/service";
import { SiteShell } from "@/components/layout/site-shell";
import { PageHero } from "@/components/shared/page-hero";
import { JobsBrowser } from "@/components/jobs/jobs-browser";
import { EmptyState } from "@/components/ui/empty-state";

export default async function JobsPage() {
  const authUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      profile: true,
      savedJobs: true,
    },
  });

  if (!user?.profile) {
    return (
      <SiteShell>
        <EmptyState
          actionHref="/onboarding"
          actionLabel="Complete onboarding"
          description="We use your profile to personalize role keywords, location defaults, and job-match rationale."
          title="Your jobs feed needs your profile"
        />
      </SiteShell>
    );
  }

  const initialQuery = user.profile.targetRoleFocus || user.profile.industryInterest;
  const initialLocation = user.profile.preferredLocations[0] ?? "Remote";
  const jobs = await searchJobsWithCache(
    {
      query: initialQuery,
      location: initialLocation,
      experienceLevel: user.profile.yearsExperience,
      recencyDays: 14,
      sort: "newest",
    },
    `${user.profile.major} candidate interested in ${user.profile.industryInterest}`,
  );

  return (
    <SiteShell>
      <div className="space-y-8">
        <PageHero
          badge="Job postings"
          title="Recent roles filtered to your profile"
          description="Browse recent jobs from a compliant provider integration. If live data is unavailable, the page falls back to cached recent results when possible."
        />
        <JobsBrowser
          initialJobs={jobs}
          profileDefaults={{
            query: initialQuery,
            location: initialLocation,
            experienceLevel: user.profile.yearsExperience,
          }}
          savedJobIds={user.savedJobs.map((job) => `${job.source}:${job.providerJobId}`)}
        />
      </div>
    </SiteShell>
  );
}
