import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { searchJobsWithCache } from "@/lib/jobs/service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile required." }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const jobs = await searchJobsWithCache(
      {
        query: searchParams.get("query") || profile.targetRoleFocus || profile.industryInterest,
        location: searchParams.get("location") || profile.preferredLocations[0],
        companyType: searchParams.get("companyType") || undefined,
        roleCategory: searchParams.get("roleCategory") || undefined,
        recencyDays: Number(searchParams.get("recency") || 14),
        sort: (searchParams.get("sort") as "newest" | "relevance") || "newest",
        experienceLevel: searchParams.get("experienceLevel") || profile.yearsExperience,
      },
      `${profile.major} student targeting ${profile.industryInterest}`,
    );

    return NextResponse.json({ jobs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch jobs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
