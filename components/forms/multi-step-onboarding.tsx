"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { JobSearchStage } from "@prisma/client";

import { saveProfileAction } from "@/lib/actions/profile";
import { uploadResumeAction } from "@/lib/actions/resume";
import type { ProfileInput } from "@/lib/types";
import { onboardingSchema } from "@/lib/validators/profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const majorOptions = ["Accounting", "Economics", "Finance", "Management", "Marketing", "Other"];
const industryOptions = [
  "Consulting",
  "Consumer brands",
  "Entertainment",
  "Financial services",
  "Healthcare",
  "Technology",
  "Other",
];
const companyOptions = [
  "Public companies",
  "Startups",
  "Private mid-market firms",
  "Agencies",
  "Nonprofits",
  "Other",
];
const stageOptions = [
  { label: "Exploring", value: JobSearchStage.EXPLORING },
  { label: "Preparing", value: JobSearchStage.PREPARING },
  { label: "Applying", value: JobSearchStage.APPLYING },
  { label: "Interviewing", value: JobSearchStage.INTERVIEWING },
  { label: "Offer stage", value: JobSearchStage.OFFER_STAGE },
];

const steps = [
  "Core profile",
  "Targets",
  "Experience and timing",
  "Optional context",
];

type Props = {
  defaultValues?: Partial<ProfileInput>;
};

export function MultiStepOnboarding({ defaultValues }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [form, setForm] = useState<ProfileInput>({
    fullName: defaultValues?.fullName ?? "",
    major: defaultValues?.major ?? "",
    otherMajor: defaultValues?.otherMajor ?? "",
    industryInterest: defaultValues?.industryInterest ?? "",
    otherIndustryInterest: defaultValues?.otherIndustryInterest ?? "",
    companyTypes: defaultValues?.companyTypes ?? [],
    otherCompanyType: defaultValues?.otherCompanyType ?? "",
    preferredLocations: defaultValues?.preferredLocations ?? [],
    otherPreferredLocation: defaultValues?.otherPreferredLocation ?? "",
    yearsExperience: defaultValues?.yearsExperience ?? "",
    graduationDate: defaultValues?.graduationDate ?? "",
    jobSearchStage: defaultValues?.jobSearchStage ?? JobSearchStage.EXPLORING,
    earliestStartDate: defaultValues?.earliestStartDate ?? "",
    bio: defaultValues?.bio ?? "",
    targetRoleFocus: defaultValues?.targetRoleFocus ?? "",
  });

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  function toggleArrayValue(field: "companyTypes" | "preferredLocations", value: string) {
    setForm((current) => {
      const set = new Set(current[field]);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }

      return { ...current, [field]: Array.from(set) };
    });
  }

  function saveDraft(next: Partial<ProfileInput>) {
    const merged = { ...form, ...next };
    setForm(merged);
    localStorage.setItem("kickoff-onboarding-draft", JSON.stringify(merged));
  }

  function handleSubmit() {
    setError("");

    const result = onboardingSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please complete all required fields.");
      return;
    }

    startTransition(async () => {
      try {
        await saveProfileAction(form);
        if (resumeFile) {
          const resumeFormData = new FormData();
          resumeFormData.set("resume", resumeFile);
          await uploadResumeAction(resumeFormData);
        }
        localStorage.removeItem("kickoff-onboarding-draft");
        router.push("/dashboard");
        router.refresh();
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Unable to save profile.");
      }
    });
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">
              Step {step + 1} of {steps.length}
            </p>
            <p className="text-sm font-medium text-primary">{steps[step]}</p>
          </div>
          <Progress value={progress} />
        </div>

        {step === 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" required>
              <Input
                onChange={(event) => saveDraft({ fullName: event.target.value })}
                placeholder="Taylor Morgan"
                value={form.fullName}
              />
            </Field>
            <Field label="Major" required>
              <Select
                onChange={(event) => saveDraft({ major: event.target.value })}
                value={form.major}
              >
                <option value="">Select major</option>
                {majorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Field>
            {form.major === "Other" ? (
              <Field className="md:col-span-2" label="Other major" required>
                <Input
                  onChange={(event) => saveDraft({ otherMajor: event.target.value })}
                  placeholder="Write in your major"
                  value={form.otherMajor}
                />
              </Field>
            ) : null}
            <Field className="md:col-span-2" label="Industry interest" required>
              <Select
                onChange={(event) => saveDraft({ industryInterest: event.target.value })}
                value={form.industryInterest}
              >
                <option value="">Select industry interest</option>
                {industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Field>
            {form.industryInterest === "Other" ? (
              <Field className="md:col-span-2" label="Other industry interest" required>
                <Input
                  onChange={(event) =>
                    saveDraft({ otherIndustryInterest: event.target.value })
                  }
                  placeholder="Write in your industry interest"
                  value={form.otherIndustryInterest}
                />
              </Field>
            ) : null}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-6">
            <Field label="Types of companies of interest" required>
              <div className="grid gap-3 md:grid-cols-2">
                {companyOptions.map((option) => (
                  <label
                    className="flex items-center gap-3 rounded-2xl border border-border bg-white/85 px-4 py-3 text-sm text-ink"
                    key={option}
                  >
                    <input
                      checked={form.companyTypes.includes(option)}
                      onChange={() => toggleArrayValue("companyTypes", option)}
                      type="checkbox"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </Field>
            {form.companyTypes.includes("Other") ? (
              <Field label="Other company type" required>
                <Input
                  onChange={(event) => saveDraft({ otherCompanyType: event.target.value })}
                  placeholder="Write in company type"
                  value={form.otherCompanyType}
                />
              </Field>
            ) : null}
            <Field label="Preferred locations" required>
              <div className="flex flex-wrap gap-3">
                {["New York", "Chicago", "Los Angeles", "Remote", "Hybrid", "Other"].map(
                  (option) => (
                    <button
                      className={`rounded-full border px-4 py-2 text-sm ${
                        form.preferredLocations.includes(option)
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-ink"
                      }`}
                      key={option}
                      onClick={() => toggleArrayValue("preferredLocations", option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </Field>
            {form.preferredLocations.includes("Other") ? (
              <Field label="Other preferred location" required>
                <Input
                  onChange={(event) =>
                    saveDraft({ otherPreferredLocation: event.target.value })
                  }
                  placeholder="Write in your preferred location"
                  value={form.otherPreferredLocation}
                />
              </Field>
            ) : null}
            <Field label="Target role focus">
              <Input
                onChange={(event) => saveDraft({ targetRoleFocus: event.target.value })}
                placeholder="Brand marketing, operations, finance, partnerships..."
                value={form.targetRoleFocus}
              />
            </Field>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Years of experience" required>
              <Input
                onChange={(event) => saveDraft({ yearsExperience: event.target.value })}
                placeholder="0-1 years including internships"
                value={form.yearsExperience}
              />
            </Field>
            <Field label="Graduation date" required>
              <Input
                onChange={(event) => saveDraft({ graduationDate: event.target.value })}
                type="date"
                value={form.graduationDate}
              />
            </Field>
            <Field label="Job-search stage" required>
              <Select
                onChange={(event) =>
                  saveDraft({ jobSearchStage: event.target.value as JobSearchStage })
                }
                value={form.jobSearchStage}
              >
                {stageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Earliest possible start date" required>
              <Input
                onChange={(event) => saveDraft({ earliestStartDate: event.target.value })}
                type="date"
                value={form.earliestStartDate}
              />
            </Field>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <Field label="Professional summary">
              <Textarea
                onChange={(event) => saveDraft({ bio: event.target.value })}
                placeholder="Briefly describe your experience, strengths, or what you want the platform to optimize around."
                value={form.bio}
              />
            </Field>
            <Field label="Optional resume upload (PDF only)">
              <Input
                accept="application/pdf"
                onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                type="file"
              />
            </Field>
            <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-5 text-sm leading-7 text-muted">
              Your resume will be stored privately in your account and used only to generate
              personalized feedback. It will not be shared with other users or third parties.
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button disabled={step === 0 || isPending} onClick={() => setStep((value) => value - 1)} variant="secondary">
            Back
          </Button>
          <div className="flex gap-3">
            {step < steps.length - 1 ? (
              <Button disabled={isPending} onClick={() => setStep((value) => value + 1)}>
                Continue
              </Button>
            ) : (
              <Button disabled={isPending} onClick={handleSubmit}>
                {isPending ? "Saving..." : "Save profile and generate guidance"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Field({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium text-ink">
        {label} {required ? <span className="text-primary">*</span> : null}
      </span>
      {children}
    </label>
  );
}
