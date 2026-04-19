CREATE TYPE "JobSearchStage" AS ENUM ('EXPLORING', 'PREPARING', 'APPLYING', 'INTERVIEWING', 'OFFER_STAGE');
CREATE TYPE "ContentType" AS ENUM ('DASHBOARD', 'ROLE_RECOMMENDATION', 'RESUME_ANALYSIS', 'OUTREACH', 'APPLICATION_PLAN', 'TIMELINE', 'JOB_MATCH');
CREATE TYPE "ResumeStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Profile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "fullName" TEXT NOT NULL,
  "major" TEXT NOT NULL,
  "industryInterest" TEXT NOT NULL,
  "companyTypes" TEXT[] NOT NULL,
  "preferredLocations" TEXT[] NOT NULL,
  "yearsExperience" TEXT NOT NULL,
  "graduationDate" TIMESTAMP(3) NOT NULL,
  "jobSearchStage" "JobSearchStage" NOT NULL,
  "earliestStartDate" TIMESTAMP(3) NOT NULL,
  "otherMajor" TEXT,
  "otherIndustryInterest" TEXT,
  "otherCompanyType" TEXT,
  "otherPreferredLocation" TEXT,
  "bio" TEXT,
  "targetRoleFocus" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Resume" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "content" BYTEA NOT NULL,
  "extractedText" TEXT NOT NULL,
  "status" "ResumeStatus" NOT NULL DEFAULT 'ACTIVE',
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ResumeAnalysis" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "resumeId" TEXT,
  "source" TEXT NOT NULL DEFAULT 'fallback',
  "extractedTextSample" TEXT,
  "overallAssessment" TEXT NOT NULL,
  "strengths" JSONB NOT NULL,
  "weaknesses" JSONB NOT NULL,
  "atsConcerns" JSONB NOT NULL,
  "framingSuggestions" JSONB NOT NULL,
  "bulletRewriteIdeas" JSONB NOT NULL,
  "tailoredRecommendations" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "DashboardInsight" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "headline" TEXT NOT NULL,
  "bestFitDirections" JSONB NOT NULL,
  "resumePriorities" JSONB NOT NULL,
  "outreachPriorities" JSONB NOT NULL,
  "applicationPriorities" JSONB NOT NULL,
  "timingAdvice" JSONB NOT NULL,
  "nextActions" JSONB NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "RoleRecommendation" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "roleCategories" JSONB NOT NULL,
  "keywords" JSONB NOT NULL,
  "competitiveness" JSONB NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OutreachTemplateSet" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "tone" TEXT NOT NULL,
  "networkingEmail" JSONB NOT NULL,
  "linkedInMessage" JSONB NOT NULL,
  "interviewRequest" JSONB NOT NULL,
  "followUpNote" JSONB NOT NULL,
  "thankYouEmail" JSONB NOT NULL,
  "tips" JSONB NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ApplicationPlan" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "weeklyTarget" TEXT NOT NULL,
  "realisticRoles" JSONB NOT NULL,
  "prioritization" JSONB NOT NULL,
  "followUpCadence" JSONB NOT NULL,
  "tailoringChecklist" JSONB NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TimelinePlan" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "timelineMode" TEXT NOT NULL,
  "milestones" JSONB NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SavedJob" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "providerJobId" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "datePosted" TIMESTAMP(3),
  "employmentType" TEXT,
  "shortDescription" TEXT NOT NULL,
  "applicationUrl" TEXT NOT NULL,
  "roleCategory" TEXT,
  "matchRationale" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "SavedJob_userId_providerJobId_source_key" ON "SavedJob"("userId", "providerJobId", "source");

CREATE TABLE "JobCache" (
  "id" TEXT PRIMARY KEY,
  "cacheKey" TEXT NOT NULL UNIQUE,
  "query" TEXT NOT NULL,
  "location" TEXT,
  "experienceLevel" TEXT,
  "roleCategory" TEXT,
  "remoteMode" TEXT,
  "source" TEXT NOT NULL,
  "jobs" JSONB NOT NULL,
  "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "GeneratedContentHistory" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "contentType" "ContentType" NOT NULL,
  "title" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Account" (
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("provider", "providerAccountId")
);

CREATE TABLE "Session" (
  "sessionToken" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier", "token")
);

ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DashboardInsight" ADD CONSTRAINT "DashboardInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleRecommendation" ADD CONSTRAINT "RoleRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OutreachTemplateSet" ADD CONSTRAINT "OutreachTemplateSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApplicationPlan" ADD CONSTRAINT "ApplicationPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TimelinePlan" ADD CONSTRAINT "TimelinePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GeneratedContentHistory" ADD CONSTRAINT "GeneratedContentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
