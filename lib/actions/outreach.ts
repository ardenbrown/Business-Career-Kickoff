"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { generateOutreachTemplates } from "@/lib/ai/generators";

export async function regenerateOutreachAction(tone: string) {
  const user = await requireUser();
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    throw new Error("Profile required.");
  }

  const payload = await generateOutreachTemplates(profile, user.id, tone);

  revalidatePath("/outreach");

  return payload;
}
