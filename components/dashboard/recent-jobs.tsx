import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function RecentJobs({
  jobs,
}: {
  jobs: {
    id: string;
    title: string;
    company: string;
    location: string;
    datePosted: Date | null;
    applicationUrl: string;
  }[];
}) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">Saved jobs</h3>
          <Link className="text-sm font-medium text-primary" href="/jobs">
            Open jobs page
          </Link>
        </div>
        <div className="space-y-3">
          {jobs.length ? (
            jobs.map((job) => (
              <div
                className="rounded-2xl border border-border bg-white/80 p-4"
                key={job.id}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{job.title}</p>
                    <p className="text-sm text-muted">
                      {job.company} · {job.location}
                    </p>
                    <p className="text-xs text-muted">
                      {job.datePosted ? formatDate(job.datePosted) : "Recent"}
                    </p>
                  </div>
                  <a
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                    href={job.applicationUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Apply
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">Save jobs to keep a shortlist here.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
