"use server";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/validators/profile";
import type { ProfileInput } from "@/lib/types";
import { regenerateCoreOutputs } from "@/lib/ai/generators";

export async function saveProfileAction(input: ProfileInput) {
  const user = await requireUser();
  const parsed = onboardingSchema.parse(input);

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      ...parsed,
      graduationDate: new Date(parsed.graduationDate),
      earliestStartDate: new Date(parsed.earliestStartDate),
      companyTypes: parsed.companyTypes,
      preferredLocations: parsed.preferredLocations,
    },
    create: {
      userId: user.id,
      ...parsed,
      graduationDate: new Date(parsed.graduationDate),
      earliestStartDate: new Date(parsed.earliestStartDate),
      companyTypes: parsed.companyTypes,
      preferredLocations: parsed.preferredLocations,
    },
  });

  await regenerateCoreOutputs(profile, user.id);

  revalidatePath("/dashboard");
  revalidatePath("/roles");
  revalidatePath("/outreach");
  revalidatePath("/application-strategy");
  revalidatePath("/timeline");
  revalidatePath("/account");

  return { success: true };
}

export async function regenerateOutputsAction() {
  const user = await requireUser();
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    throw new Error("Please complete onboarding first.");
  }

  const results = await regenerateCoreOutputs(profile, user.id);

  revalidatePath("/dashboard");
  revalidatePath("/roles");
  revalidatePath("/outreach");
  revalidatePath("/application-strategy");
  revalidatePath("/timeline");
  revalidatePath("/account");

  return results;
}
