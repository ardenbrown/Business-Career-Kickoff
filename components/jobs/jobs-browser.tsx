"use client";

import { useState, useTransition } from "react";
import { ArrowUpRight, Bookmark, LayoutGrid, List, RefreshCcw } from "lucide-react";

import type { JobListing } from "@/lib/types";
import { toggleSavedJobAction } from "@/lib/actions/jobs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

type Props = {
  initialJobs: JobListing[];
  profileDefaults: {
    query: string;
    location: string;
    experienceLevel: string;
  };
  savedJobIds: string[];
};

export function JobsBrowser({ initialJobs, profileDefaults, savedJobIds }: Props) {
  const [jobs, setJobs] = useState(initialJobs);
  const [view, setView] = useState("grid");
  const [saved, setSaved] = useState(() => new Set(savedJobIds));
  const [query, setQuery] = useState(profileDefaults.query);
  const [location, setLocation] = useState(profileDefaults.location);
  const [experienceLevel, setExperienceLevel] = useState(profileDefaults.experienceLevel);
  const [companyType, setCompanyType] = useState("");
  const [roleCategory, setRoleCategory] = useState("");
  const [recency, setRecency] = useState("14");
  const [sort, setSort] = useState("newest");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function runSearch() {
    startTransition(async () => {
      setMessage("");
      const params = new URLSearchParams({
        query,
        location,
        companyType,
        roleCategory,
        recency,
        sort,
        experienceLevel,
      });

      const response = await fetch(`/api/jobs/search?${params.toString()}`);
      const payload = (await response.json()) as { jobs?: JobListing[]; error?: string };

      if (!response.ok) {
        setMessage(payload.error ?? "Unable to load jobs right now.");
        return;
      }

      setJobs(payload.jobs ?? []);
    });
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid gap-4 xl:grid-cols-7">
          <Input
            className="xl:col-span-2"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search role titles or keywords"
            value={query}
          />
          <Input
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location"
            value={location}
          />
          <Input
            onChange={(event) => setRoleCategory(event.target.value)}
            placeholder="Role category"
            value={roleCategory}
          />
          <Select onChange={(event) => setCompanyType(event.target.value)} value={companyType}>
            <option value="">Any company type</option>
            <option value="startup">Startup</option>
            <option value="public">Public company</option>
            <option value="agency">Agency</option>
            <option value="nonprofit">Nonprofit</option>
          </Select>
          <Input
            onChange={(event) => setExperienceLevel(event.target.value)}
            placeholder="Experience level"
            value={experienceLevel}
          />
          <Select onChange={(event) => setRecency(event.target.value)} value={recency}>
            <option value="7">Past 7 days</option>
            <option value="14">Past 14 days</option>
            <option value="30">Past 30 days</option>
          </Select>
          <Select onChange={(event) => setSort(event.target.value)} value={sort}>
            <option value="newest">Newest</option>
            <option value="relevance">Relevance</option>
          </Select>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button disabled={isPending} onClick={runSearch}>
              {isPending ? "Loading..." : "Refresh jobs"}
              <RefreshCcw className="ml-2 h-4 w-4" />
            </Button>
            <Toggle
              onChange={setView}
              options={[
                { label: "Grid", value: "grid" },
                { label: "List", value: "list" },
              ]}
              value={view}
            />
          </div>
          {message ? <p className="text-sm text-warning">{message}</p> : null}
        </div>
      </Card>

      <div className={view === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-4"}>
        {jobs.map((job) => {
          const savedKey = `${job.source}:${job.providerJobId}`;
          return (
            <Card className="p-5" key={savedKey}>
              <div className="flex h-full flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-ink">{job.title}</p>
                      <p className="text-sm text-muted">
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {view === "grid" ? <LayoutGrid className="h-4 w-4 text-primary" /> : <List className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted">
                    <span className="rounded-full bg-primary/5 px-3 py-1 text-primary">
                      {job.source}
                    </span>
                    {job.employmentType ? (
                      <span className="rounded-full bg-slateBlue px-3 py-1">
                        {job.employmentType}
                      </span>
                    ) : null}
                    {job.datePosted ? (
                      <span className="rounded-full bg-white px-3 py-1">
                        {new Date(job.datePosted).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-7 text-muted">{job.shortDescription}</p>
                  {job.matchRationale ? (
                    <div className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm leading-7 text-primary/90">
                      {job.matchRationale}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={async () => {
                      await toggleSavedJobAction({
                        providerJobId: job.providerJobId,
                        source: job.source,
                        title: job.title,
                        company: job.company,
                        location: job.location,
                        datePosted: job.datePosted,
                        employmentType: job.employmentType,
                        shortDescription: job.shortDescription,
                        applicationUrl: job.applicationUrl,
                        roleCategory: job.roleCategory,
                        matchRationale: job.matchRationale,
                      });

                      setSaved((current) => {
                        const next = new Set(current);
                        if (next.has(savedKey)) {
                          next.delete(savedKey);
                        } else {
                          next.add(savedKey);
                        }
                        return next;
                      });
                    }}
                    variant="secondary"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    {saved.has(savedKey) ? "Saved" : "Save"}
                  </Button>
                  <Button asChild>
                    <a href={job.applicationUrl} rel="noreferrer" target="_blank">
                      Apply
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {!jobs.length ? (
        <Card className="p-8 text-center text-sm text-muted">
          No jobs matched those filters. Try widening location or recency, or check back for cached
          recent results.
        </Card>
      ) : null}
    </div>
  );
}
