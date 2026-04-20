import { subDays } from "date-fns";

import { env } from "@/lib/env";
import type { JobListing } from "@/lib/types";
import type { JobSearchInput, JobsProvider } from "@/lib/jobs/types";

type AdzunaResponse = {
  results: Array<{
    id: string;
    title: string;
    company?: { display_name?: string };
    location?: { display_name?: string; area?: string[] };
    created?: string;
    contract_time?: string;
    description?: string;
    redirect_url?: string;
    category?: { label?: string };
  }>;
};

export class AdzunaProvider implements JobsProvider {
  source = "Adzuna";

  async searchJobs(input: JobSearchInput): Promise<JobListing[]> {
    if (!env.ADZUNA_APP_ID || !env.ADZUNA_APP_KEY) {
      throw new Error("Adzuna credentials are not configured.");
    }

    const params = new URLSearchParams({
      app_id: env.ADZUNA_APP_ID,
      app_key: env.ADZUNA_APP_KEY,
      results_per_page: "20",
      what: input.query,
    });

    if (input.sort === "newest") {
      params.set("sort_by", "date");
    }

    if (input.location) {
      params.set("where", input.location);
    }

    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/${env.ADZUNA_COUNTRY}/search/1?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Adzuna request failed with ${response.status}: ${details}`);
    }

    const data = (await response.json()) as AdzunaResponse;
    const recencyThreshold = input.recencyDays
      ? subDays(new Date(), input.recencyDays)
      : null;

    return data.results
      .filter((job) => {
        if (!recencyThreshold || !job.created) {
          return true;
        }

        return new Date(job.created) >= recencyThreshold;
      })
      .map((job) => ({
        providerJobId: String(job.id),
        source: this.source,
        title: job.title,
        company: job.company?.display_name ?? "Unknown company",
        location:
          job.location?.display_name ??
          job.location?.area?.join(", ") ??
          input.location ??
          "Location not listed",
        datePosted: job.created,
        employmentType: job.contract_time ?? "Not specified",
        shortDescription: (job.description ?? "").slice(0, 220),
        applicationUrl: job.redirect_url ?? "#",
        roleCategory: job.category?.label ?? input.roleCategory,
        remoteMode: input.remoteMode,
      }));
  }
}
