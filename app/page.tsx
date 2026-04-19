import Link from "next/link";

import { auth } from "@/auth";
import { SiteShell } from "@/components/layout/site-shell";
import { Hero } from "@/components/marketing/hero";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function HomePage() {
  const session = await auth();

  return (
    <SiteShell>
      <div className="space-y-12 pb-10">
        <Hero />
        <FeatureGrid />
        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Profile-driven role direction",
              description:
                "See which business career paths make sense based on your major, timing, interests, and experience.",
            },
            {
              title: "Private AI resume analysis",
              description:
                "Store resumes securely in your account and re-run feedback as your goals shift.",
            },
            {
              title: "Application and timeline planning",
              description:
                "Move from scattered job-search effort to a clear weekly plan with milestones and follow-ups.",
            },
          ].map((item) => (
            <Card className="p-6" key={item.title}>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="text-sm leading-7 text-muted">{item.description}</p>
              </div>
            </Card>
          ))}
        </section>
        <section className="rounded-[32px] border border-white/70 bg-primary px-6 py-10 text-white shadow-soft sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">Start building your search hub</h2>
              <p className="max-w-2xl text-sm leading-7 text-white/80">
                Save your profile, upload your resume, generate tailored content, and track jobs in
                one place.
              </p>
            </div>
            <Button asChild className="bg-white text-primary hover:bg-white/95" size="lg">
              <Link href={session?.user ? "/dashboard" : "/auth/sign-in"}>
                {session?.user ? "Open dashboard" : "Create your account"}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
