import { ContentType, JobSearchStage, Prisma } from "@prisma/client";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  buildApplicationPlanFallback,
  buildDashboardFallback,
  buildOutreachFallback,
  buildRoleRecommendationsFallback,
  buildTimelineFallback,
} from "@/lib/mock-data";

async function main() {
  const email = env.DEMO_SEED_EMAIL;

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "Demo Candidate", emailVerified: new Date() },
    create: {
      email,
      name: "Demo Candidate",
      emailVerified: new Date(),
      profile: {
        create: {
          fullName: "Demo Candidate",
          major: "Marketing",
          industryInterest: "Consumer brands",
          companyTypes: ["Public companies", "High-growth startups"],
          preferredLocations: ["Chicago", "New York", "Remote"],
          yearsExperience: "1-2 years including internships",
          graduationDate: new Date("2026-05-15"),
          earliestStartDate: new Date("2026-06-01"),
          jobSearchStage: JobSearchStage.APPLYING,
          bio: "Senior business student with internship experience in campaign analytics and partnerships.",
          targetRoleFocus: "brand marketing, partnerships, and growth roles",
        },
      },
    },
    include: { profile: true },
  });

  const profile = user.profile!;
  const dashboard = buildDashboardFallback(profile);
  const roles = buildRoleRecommendationsFallback(profile);
  const outreach = buildOutreachFallback(profile, "Professional");
  const plan = buildApplicationPlanFallback(profile);
  const timeline = buildTimelineFallback(profile);

  await prisma.dashboardInsight.create({
    data: {
      userId: user.id,
      headline: dashboard.headline,
      bestFitDirections: dashboard.bestFitDirections as Prisma.JsonArray,
      resumePriorities: dashboard.resumePriorities as Prisma.JsonArray,
      outreachPriorities: dashboard.outreachPriorities as Prisma.JsonArray,
      applicationPriorities: dashboard.applicationPriorities as Prisma.JsonArray,
      timingAdvice: dashboard.timingAdvice as Prisma.JsonArray,
      nextActions: dashboard.nextActions as Prisma.JsonArray,
    },
  });

  await prisma.roleRecommendation.create({
    data: {
      userId: user.id,
      summary: roles.summary,
      roleCategories: roles.roleCategories as Prisma.JsonArray,
      keywords: roles.keywords as Prisma.JsonArray,
      competitiveness: roles.competitiveness as Prisma.JsonArray,
    },
  });

  await prisma.outreachTemplateSet.create({
    data: {
      userId: user.id,
      tone: "Professional",
      networkingEmail: outreach.networkingEmail as Prisma.JsonObject,
      linkedInMessage: outreach.linkedInMessage as Prisma.JsonObject,
      interviewRequest: outreach.informationalInterviewRequest as Prisma.JsonObject,
      followUpNote: outreach.followUpNote as Prisma.JsonObject,
      thankYouEmail: outreach.thankYouEmail as Prisma.JsonObject,
      tips: outreach.tips as Prisma.JsonArray,
    },
  });

  await prisma.applicationPlan.create({
    data: {
      userId: user.id,
      summary: plan.summary,
      weeklyTarget: plan.weeklyTarget,
      realisticRoles: plan.realisticRoles as Prisma.JsonArray,
      prioritization: plan.prioritization as Prisma.JsonArray,
      followUpCadence: plan.followUpCadence as Prisma.JsonArray,
      tailoringChecklist: plan.tailoringChecklist as Prisma.JsonArray,
    },
  });

  await prisma.timelinePlan.create({
    data: {
      userId: user.id,
      summary: timeline.summary,
      timelineMode: timeline.timelineMode,
      milestones: timeline.milestones as Prisma.JsonArray,
    },
  });

  await prisma.generatedContentHistory.createMany({
    data: [
      { userId: user.id, contentType: ContentType.DASHBOARD, title: "Dashboard overview", payload: dashboard as Prisma.JsonObject },
      { userId: user.id, contentType: ContentType.ROLE_RECOMMENDATION, title: "Role recommendations", payload: roles as Prisma.JsonObject },
      { userId: user.id, contentType: ContentType.OUTREACH, title: "Outreach templates", payload: outreach as Prisma.JsonObject },
      { userId: user.id, contentType: ContentType.APPLICATION_PLAN, title: "Application strategy", payload: plan as Prisma.JsonObject },
      { userId: user.id, contentType: ContentType.TIMELINE, title: "Timeline plan", payload: timeline as Prisma.JsonObject },
    ],
  });

  console.log(`Seeded demo user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
