"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function toggleSavedJobAction(input: {
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
  matchRationale?: string;
}) {
  const user = await requireUser();

  const existing = await prisma.savedJob.findUnique({
    where: {
      userId_providerJobId_source: {
        userId: user.id,
        providerJobId: input.providerJobId,
        source: input.source,
      },
    },
  });

  if (existing) {
    await prisma.savedJob.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.savedJob.create({
      data: {
        userId: user.id,
        providerJobId: input.providerJobId,
        source: input.source,
        title: input.title,
        company: input.company,
        location: input.location,
        datePosted: input.datePosted ? new Date(input.datePosted) : null,
        employmentType: input.employmentType,
        shortDescription: input.shortDescription,
        applicationUrl: input.applicationUrl,
        roleCategory: input.roleCategory,
        matchRationale: input.matchRationale,
      },
    });
  }

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  revalidatePath("/account");

  return { success: true };
}
