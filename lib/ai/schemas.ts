import { z } from "zod";

export const dashboardSchema = z.object({
  headline: z.string(),
  bestFitDirections: z.array(z.string()).min(3),
  resumePriorities: z.array(z.string()).min(3),
  outreachPriorities: z.array(z.string()).min(3),
  applicationPriorities: z.array(z.string()).min(3),
  timingAdvice: z.array(z.string()).min(3),
  nextActions: z.array(z.string()).min(3),
});

export const roleRecommendationsSchema = z.object({
  summary: z.string(),
  roleCategories: z.array(
    z.object({
      category: z.string(),
      fitReason: z.string(),
      titles: z.array(z.string()).min(3),
      companyGuidance: z.string(),
      skillGaps: z.array(z.string()).min(2),
    }),
  ),
  competitiveness: z.array(
    z.object({
      path: z.string(),
      competitiveness: z.string(),
      advice: z.string(),
    }),
  ),
  keywords: z.array(z.string()).min(5),
});

export const resumeAnalysisSchema = z.object({
  overallAssessment: z.string(),
  strengths: z.array(z.string()).min(3),
  weaknesses: z.array(z.string()).min(3),
  atsConcerns: z.array(z.string()).min(2),
  framingSuggestions: z.array(z.string()).min(2),
  bulletRewriteIdeas: z.array(
    z.object({
      original: z.string(),
      rewrite: z.string(),
    }),
  ),
  tailoredRecommendations: z.array(z.string()).min(3),
});

export const outreachSchema = z.object({
  networkingEmail: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  linkedInMessage: z.object({
    subject: z.string().optional(),
    body: z.string(),
  }),
  informationalInterviewRequest: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  followUpNote: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  thankYouEmail: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  tips: z.array(z.string()).min(3),
});

export const applicationPlanSchema = z.object({
  summary: z.string(),
  weeklyTarget: z.string(),
  realisticRoles: z.array(z.string()).min(3),
  prioritization: z.array(z.string()).min(3),
  followUpCadence: z.array(z.string()).min(2),
  tailoringChecklist: z.array(z.string()).min(3),
});

export const timelineSchema = z.object({
  summary: z.string(),
  timelineMode: z.enum(["weekly", "monthly"]),
  milestones: z.array(
    z.object({
      label: z.string(),
      timeframe: z.string(),
      description: z.string(),
      editable: z.boolean().optional(),
    }),
  ),
});
