import { getCurrentUserWithProfile } from "@/lib/auth-helpers";
import { SiteShell } from "@/components/layout/site-shell";
import { MultiStepOnboarding } from "@/components/forms/multi-step-onboarding";
import { PageHero } from "@/components/shared/page-hero";

export default async function OnboardingPage() {
  const user = await getCurrentUserWithProfile();

  return (
    <SiteShell>
      <div className="space-y-8">
        <PageHero
          badge="Onboarding"
          title="Set up your career profile"
          description="Tell the platform what you studied, where you want to go, what experience you have, and when you can start. These inputs drive every personalized section."
        />
        <MultiStepOnboarding
          defaultValues={
            user?.profile
              ? {
                  fullName: user.profile.fullName,
                  major: user.profile.major,
                  otherMajor: user.profile.otherMajor ?? "",
                  industryInterest: user.profile.industryInterest,
                  otherIndustryInterest: user.profile.otherIndustryInterest ?? "",
                  companyTypes: user.profile.companyTypes,
                  otherCompanyType: user.profile.otherCompanyType ?? "",
                  preferredLocations: user.profile.preferredLocations,
                  otherPreferredLocation: user.profile.otherPreferredLocation ?? "",
                  yearsExperience: user.profile.yearsExperience,
                  graduationDate: user.profile.graduationDate.toISOString().slice(0, 10),
                  jobSearchStage: user.profile.jobSearchStage,
                  earliestStartDate: user.profile.earliestStartDate
                    .toISOString()
                    .slice(0, 10),
                  bio: user.profile.bio ?? "",
                  targetRoleFocus: user.profile.targetRoleFocus ?? "",
                }
              : { fullName: user?.name ?? "" }
          }
        />
      </div>
    </SiteShell>
  );
}
