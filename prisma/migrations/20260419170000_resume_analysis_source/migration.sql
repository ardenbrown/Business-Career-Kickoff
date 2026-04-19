ALTER TABLE "ResumeAnalysis"
ADD COLUMN "source" TEXT NOT NULL DEFAULT 'fallback',
ADD COLUMN "extractedTextSample" TEXT;
