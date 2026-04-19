import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getUserWorkspace(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      resumes: {
        orderBy: { uploadedAt: "desc" },
        take: 5,
      },
      resumeAnalyses: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      dashboardInsights: {
        orderBy: { generatedAt: "desc" },
        take: 3,
      },
      roleRecommendations: {
        orderBy: { generatedAt: "desc" },
        take: 3,
      },
      outreachTemplateSets: {
        orderBy: { generatedAt: "desc" },
        take: 3,
      },
      applicationPlans: {
        orderBy: { generatedAt: "desc" },
        take: 3,
      },
      timelinePlans: {
        orderBy: { generatedAt: "desc" },
        take: 3,
      },
      savedJobs: {
        orderBy: { createdAt: "desc" },
        take: 12,
      },
      generatedHistory: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

export function toStringArray(value: Prisma.JsonValue | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}
