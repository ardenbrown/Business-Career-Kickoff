import type { JobListing } from "@/lib/types";

export type JobSearchInput = {
  query: string;
  location?: string;
  experienceLevel?: string;
  companyType?: string;
  roleCategory?: string;
  remoteMode?: string;
  recencyDays?: number;
  sort?: "newest" | "relevance";
};

export interface JobsProvider {
  source: string;
  searchJobs(input: JobSearchInput): Promise<JobListing[]>;
}
