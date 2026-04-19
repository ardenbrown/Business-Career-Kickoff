import { JobSearchStage } from "@prisma/client";
import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  major: z.string().min(1, "Major is required."),
  otherMajor: z.string().optional(),
  industryInterest: z.string().min(1, "Industry interest is required."),
  otherIndustryInterest: z.string().optional(),
  companyTypes: z.array(z.string().min(1)).min(1, "Select at least one company type."),
  otherCompanyType: z.string().optional(),
  preferredLocations: z.array(z.string().min(1)).min(1, "Add at least one preferred location."),
  otherPreferredLocation: z.string().optional(),
  yearsExperience: z.string().min(1, "Years of experience is required."),
  graduationDate: z.string().min(1, "Graduation date is required."),
  jobSearchStage: z.nativeEnum(JobSearchStage, {
    errorMap: () => ({ message: "Job-search stage is required." }),
  }),
  earliestStartDate: z.string().min(1, "Earliest start date is required."),
  bio: z.string().max(800).optional(),
  targetRoleFocus: z.string().max(200).optional(),
});

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email."),
});
