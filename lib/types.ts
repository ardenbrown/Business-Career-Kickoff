import type { JobSearchStage, Prisma } from "@prisma/client";

export type ProfileInput = {
  fullName: string;
  major: string;
  otherMajor?: string;
  industryInterest: string;
  otherIndustryInterest?: string;
  companyTypes: string[];
  otherCompanyType?: string;
  preferredLocations: string[];
  otherPreferredLocation?: string;
  yearsExperience: string;
  graduationDate: string;
  jobSearchStage: JobSearchStage;
  earliestStartDate: string;
  bio?: string;
  targetRoleFocus?: string;
};

export type DashboardPayload = {
  headline: string;
  bestFitDirections: string[];
  resumePriorities: string[];
  outreachPriorities: string[];
  applicationPriorities: string[];
  timingAdvice: string[];
  nextActions: string[];
};

export type RoleRecommendationsPayload = {
  summary: string;
  roleCategories: {
    category: string;
    fitReason: string;
    titles: string[];
    companyGuidance: string;
    skillGaps: string[];
  }[];
  competitiveness: { path: string; competitiveness: string; advice: string }[];
  keywords: string[];
};

export type ResumeAnalysisPayload = {
  overallAssessment: string;
  strengths: string[];
  weaknesses: string[];
  atsConcerns: string[];
  framingSuggestions: string[];
  bulletRewriteIdeas: { original: string; rewrite: string }[];
  tailoredRecommendations: string[];
};

export type OutreachPayload = {
  networkingEmail: { subject: string; body: string };
  linkedInMessage: { subject?: string; body: string };
  informationalInterviewRequest: { subject: string; body: string };
  followUpNote: { subject: string; body: string };
  thankYouEmail: { subject: string; body: string };
  tips: string[];
};

export type ApplicationPlanPayload = {
  summary: string;
  weeklyTarget: string;
  realisticRoles: string[];
  prioritization: string[];
  followUpCadence: string[];
  tailoringChecklist: string[];
};

export type TimelinePayload = {
  summary: string;
  timelineMode: "weekly" | "monthly";
  milestones: {
    label: string;
    timeframe: string;
    description: string;
    editable?: boolean;
  }[];
};

export type JobListing = {
  providerJobId: string;
  source: string;
  title: string;
  company: string;
  location: string;
  datePosted?: string;
  employmentType?: string;
  shortDescription: string;
  applicationUrl: string;
  roleCategory?: string;
  remoteMode?: string;
  matchRationale?: string;
};

export type JsonValue = Prisma.JsonValue;
