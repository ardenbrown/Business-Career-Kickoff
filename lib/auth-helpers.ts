import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  return session.user;
}

export async function getCurrentUserWithProfile() {
  const user = await requireUser();

  return prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      resumes: {
        orderBy: { uploadedAt: "desc" },
        take: 1,
      },
    },
  });
}
