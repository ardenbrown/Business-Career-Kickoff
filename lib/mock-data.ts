import { differenceInWeeks, format } from "date-fns";
import { JobSearchStage, type Profile } from "@prisma/client";

import type {
  ApplicationPlanPayload,
  DashboardPayload,
  OutreachPayload,
  ResumeAnalysisPayload,
  RoleRecommendationsPayload,
  TimelinePayload,
} from "@/lib/types";

function profileStageLabel(stage: JobSearchStage) {
  return stage.toLowerCase().replace("_", " ");
}

export function buildDashboardFallback(profile: Profile): DashboardPayload {
  return {
    headline: `${profile.major} candidate with momentum toward ${profile.industryInterest.toLowerCase()} roles`,
    bestFitDirections: [
      `${profile.industryInterest} coordinator and analyst tracks`,
      `Entry-level rotational programs at ${profile.companyTypes[0] ?? "target"} companies`,
      `Hybrid roles in ${profile.preferredLocations[0] ?? "your preferred markets"}`,
    ],
    resumePriorities: [
      "Lead with quantified internship or campus impact.",
      "Align bullets to problem solving, ownership, and communication.",
      "Move the strongest business tools and coursework above lower-signal content.",
    ],
    outreachPriorities: [
      `Reach out to alumni in ${profile.industryInterest.toLowerCase()}.`,
      "Prioritize warm introductions before cold outreach.",
      "Build a short target list of 20 people and follow up consistently.",
    ],
    applicationPriorities: [
      "Focus on high-fit coordinator, analyst, and associate openings.",
      "Tailor the top third of applications each week rather than lightly editing everything.",
      "Use company-type preference to narrow search volume.",
    ],
    timingAdvice: [
      `You are currently in the ${profileStageLabel(profile.jobSearchStage)} stage.`,
      `Target serious application volume 6-10 weeks before ${format(profile.earliestStartDate, "MMM d, yyyy")}.`,
      "Treat resume refresh and networking as parallel tracks, not sequential tasks.",
    ],
    nextActions: [
      "Refresh your top resume bullets this week.",
      "Send five targeted outreach messages in the next seven days.",
      "Bookmark recent roles and build a follow-up tracker.",
    ],
  };
}

export function buildRoleRecommendationsFallback(
  profile: Profile,
): RoleRecommendationsPayload {
  return {
    summary: `Based on your ${profile.major.toLowerCase()} background, ${profile.industryInterest.toLowerCase()} interest, and ${profile.yearsExperience.toLowerCase()}, your best near-term targets are structured entry-level roles with room to grow into strategy or ownership.`,
    roleCategories: [
      {
        category: `${profile.industryInterest} coordinator`,
        fitReason:
          "This path fits business grads who can organize workstreams, communicate with multiple stakeholders, and grow into specialist ownership quickly.",
        titles: [
          "Marketing Coordinator",
          "Business Development Coordinator",
          "Partnerships Coordinator",
        ],
        companyGuidance:
          "Target established teams with defined onboarding if you want skill depth fast; target growth-stage firms if you want broader ownership.",
        skillGaps: [
          "Proof of measurable business outcomes",
          "Sharper portfolio or project examples",
        ],
      },
      {
        category: "Analyst and associate programs",
        fitReason:
          "Analyst tracks give new grads structure, strong signaling on a resume, and better exposure to internal stakeholders.",
        titles: [
          "Business Analyst",
          "Operations Analyst",
          "Growth Analyst",
        ],
        companyGuidance:
          "Use larger companies for rotational or formal analyst programs and mid-sized companies for cross-functional execution roles.",
        skillGaps: ["Advanced spreadsheet storytelling", "Interview-ready case examples"],
      },
    ],
    competitiveness: [
      {
        path: "Brand-name company programs",
        competitiveness: "High",
        advice: "Keep these in the mix, but balance them with mid-market and regional targets.",
      },
      {
        path: "Coordinator roles at growing firms",
        competitiveness: "Moderate",
        advice: "These are often more accessible if you show initiative and relevant execution proof.",
      },
    ],
    keywords: [
      "coordinator",
      "associate",
      "analyst",
      profile.industryInterest,
      profile.preferredLocations[0] ?? "remote",
    ],
  };
}

const ACTION_VERBS = [
  "analyzed",
  "built",
  "coordinated",
  "created",
  "delivered",
  "developed",
  "drove",
  "executed",
  "improved",
  "increased",
  "launched",
  "led",
  "managed",
  "modeled",
  "organized",
  "optimized",
  "presented",
  "researched",
  "streamlined",
  "supported",
];

const BUSINESS_KEYWORDS = [
  "analysis",
  "analyst",
  "budget",
  "campaign",
  "client",
  "crm",
  "customer",
  "dashboard",
  "excel",
  "forecast",
  "market",
  "operations",
  "presentation",
  "project",
  "reporting",
  "sales",
  "sql",
  "strategy",
];

function uniquePush(items: string[], value: string) {
  if (!items.includes(value)) {
    items.push(value);
  }
}

function extractResumeLines(resumeText: string) {
  return resumeText
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function findBulletLines(lines: string[]) {
  return lines.filter((line) => /^[-*•]/.test(line) || /^[A-Z][a-z]+ed\b/.test(line));
}

function stripBulletPrefix(line: string) {
  return line.replace(/^[-*•]\s*/, "").trim();
}

function hasNumber(line: string) {
  return /\d/.test(line);
}

function startsWithActionVerb(line: string) {
  const normalized = stripBulletPrefix(line).toLowerCase();
  return ACTION_VERBS.some((verb) => normalized.startsWith(verb));
}

function containsKeyword(text: string, keyword: string) {
  return new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text);
}

function inferResumeSignals(profile: Profile, resumeText: string) {
  const lines = extractResumeLines(resumeText);
  const bullets = findBulletLines(lines);
  const normalizedText = resumeText.toLowerCase();

  const hasEducation = containsKeyword(normalizedText, "education");
  const hasExperience = containsKeyword(normalizedText, "experience");
  const hasSkills = containsKeyword(normalizedText, "skills");
  const hasSummary = containsKeyword(normalizedText, "summary") || containsKeyword(normalizedText, "profile");
  const bulletsWithNumbers = bullets.filter(hasNumber);
  const bulletsWithActionVerbs = bullets.filter(startsWithActionVerb);
  const keywordHits = BUSINESS_KEYWORDS.filter((keyword) => containsKeyword(normalizedText, keyword));
  const targetHits = [
    profile.industryInterest,
    profile.targetRoleFocus ?? "",
    ...(profile.companyTypes ?? []),
  ].filter(Boolean).filter((keyword) => containsKeyword(normalizedText, keyword.toLowerCase()));

  return {
    lines,
    bullets,
    hasEducation,
    hasExperience,
    hasSkills,
    hasSummary,
    bulletsWithNumbers,
    bulletsWithActionVerbs,
    keywordHits,
    targetHits,
  };
}

function buildRewriteSuggestion(line: string) {
  const stripped = stripBulletPrefix(line);
  const normalized = stripped.replace(/\.$/, "");
  const lower = normalized.toLowerCase();

  if (lower.startsWith("helped ")) {
    return normalized.replace(/^helped\b/i, "Supported") + " by naming the project scope, teammates, and measurable result.";
  }

  if (lower.startsWith("worked on ")) {
    return normalized.replace(/^worked on\b/i, "Executed") + " and finish with the outcome, recommendation, or number affected.";
  }

  if (!hasNumber(stripped)) {
    return `${normalized} Include the scale, output, or result so the bullet ends with a business outcome.`;
  }

  return `${normalized} Tighten this into action + scope + result so the impact is obvious in one line.`;
}

export function buildResumeFallback(profile: Profile, resumeText: string): ResumeAnalysisPayload {
  const signals = inferResumeSignals(profile, resumeText);
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const atsConcerns: string[] = [];
  const framingSuggestions: string[] = [];
  const tailoredRecommendations: string[] = [];

  if (signals.hasEducation) {
    uniquePush(strengths, "Education details are present, which helps early-career recruiters quickly confirm your graduation timing.");
  }

  if (signals.hasExperience || signals.bullets.length >= 3) {
    uniquePush(strengths, "The resume includes experience-style content instead of relying only on coursework or a simple profile summary.");
  }

  if (signals.bulletsWithActionVerbs.length >= Math.max(2, Math.floor(signals.bullets.length / 3))) {
    uniquePush(strengths, "Several bullets already start with action language, which makes the experience read more actively.");
  }

  if (signals.bulletsWithNumbers.length >= 2) {
    uniquePush(strengths, "There are at least a few quantified bullets, which gives recruiters clearer evidence of scope or results.");
  }

  if (signals.keywordHits.length >= 4) {
    uniquePush(
      strengths,
      `The resume already contains useful business keywords like ${signals.keywordHits.slice(0, 4).join(", ")}.`,
    );
  }

  if (signals.targetHits.length > 0) {
    uniquePush(
      strengths,
      `Some of your target-direction language is already present, including ${signals.targetHits.slice(0, 3).join(", ")}.`,
    );
  }

  if (signals.bullets.length === 0) {
    uniquePush(weaknesses, "The PDF text does not show clear bullet-style experience lines, which makes the resume harder to scan quickly.");
  } else {
    if (signals.bulletsWithNumbers.length < Math.max(2, Math.floor(signals.bullets.length / 3))) {
      uniquePush(weaknesses, "Most bullets do not show numbers, scale, frequency, or outcomes yet, so the impact is still undersold.");
    }

    if (signals.bulletsWithActionVerbs.length < Math.max(2, Math.floor(signals.bullets.length / 3))) {
      uniquePush(weaknesses, "Too many bullets start passively or read like duties instead of clear actions and results.");
    }
  }

  if (!signals.hasSummary) {
    uniquePush(weaknesses, "There does not appear to be a short summary or target-role intro near the top to quickly position you.");
  }

  if (!signals.hasSkills) {
    uniquePush(weaknesses, "A visible skills section does not appear in the extracted text, which may hide tools recruiters are screening for.");
  }

  if (signals.keywordHits.length < 4) {
    uniquePush(
      atsConcerns,
      `The resume could mirror more exact keywords from ${profile.industryInterest.toLowerCase()} postings, especially analyst, coordinator, reporting, Excel, and project language.`,
    );
  }

  if (!signals.hasSkills) {
    uniquePush(atsConcerns, "Add a standard Skills section with tools, platforms, and analysis software so ATS systems can match them cleanly.");
  }

  if (!signals.hasEducation || !signals.hasExperience) {
    uniquePush(atsConcerns, "Use standard section headings like Education, Experience, Leadership, and Skills so scanners can classify content reliably.");
  }

  uniquePush(
    framingSuggestions,
    `Frame each strong experience line around a business problem, your action, and the result tied to ${profile.industryInterest.toLowerCase()} work.`,
  );
  uniquePush(
    framingSuggestions,
    "Move the strongest internship, campus leadership, or project examples higher than lower-signal descriptions or generic responsibilities.",
  );

  if (signals.bulletsWithNumbers.length < Math.max(2, Math.floor(signals.bullets.length / 3))) {
    uniquePush(
      framingSuggestions,
      "For each role, revise at least two bullets to include numbers such as timeline, team size, volume, revenue, or percentage change.",
    );
  }

  uniquePush(
    tailoredRecommendations,
    `Tailor the top third of the resume toward ${profile.targetRoleFocus || `${profile.industryInterest} coordinator and analyst roles`} before each application batch.`,
  );
  uniquePush(
    tailoredRecommendations,
    "Keep the most relevant tools, coursework, internships, and leadership examples above older or less relevant content.",
  );
  uniquePush(
    tailoredRecommendations,
    "Rewrite weak bullets into action + scope + result format so the value is obvious in a six-second scan.",
  );

  const candidateBullets = signals.bullets.slice(0, 2).map(stripBulletPrefix).filter(Boolean);
  const bulletRewriteIdeas =
    candidateBullets.length > 0
      ? candidateBullets.map((line) => ({
          original: line,
          rewrite: buildRewriteSuggestion(line),
        }))
      : [
          {
            original: "Helped with marketing campaigns and team projects.",
            rewrite:
              "Coordinated campaign tasks and team deliverables, then add channel scope, deadline, and outcome so the bullet shows real business impact.",
          },
          {
            original: "Worked on a class business project.",
            rewrite:
              "Analyzed a business case with a small team, presented recommendations, and add the result or decision your work influenced.",
          },
        ];

  const overallAssessment = signals.bullets.length
    ? "Your resume has usable early-career material, but the strongest improvement opportunity is turning existing experience lines into clearer business outcomes and role-specific positioning."
    : "The extracted resume text suggests the document is light on scannable experience bullets, so the first priority is making your experience easier to read and easier to match to entry-level business roles.";

  while (strengths.length < 3) {
    uniquePush(strengths, "The resume is clearly aimed at business roles and can be improved without a full rewrite.");
  }

  while (weaknesses.length < 3) {
    uniquePush(weaknesses, "The top third of the resume could communicate your fit for target roles more directly.");
  }

  while (atsConcerns.length < 2) {
    uniquePush(atsConcerns, "Use consistent date formatting and standard headings so applicant tracking systems can parse the document more reliably.");
  }

  while (framingSuggestions.length < 2) {
    uniquePush(framingSuggestions, "Prioritize bullets that show ownership, analysis, communication, or process improvement over generic support work.");
  }

  while (tailoredRecommendations.length < 3) {
    uniquePush(tailoredRecommendations, "Match resume keywords to the role family you are applying for before each application batch.");
  }

  return {
    overallAssessment,
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
    atsConcerns: atsConcerns.slice(0, 3),
    framingSuggestions: framingSuggestions.slice(0, 3),
    bulletRewriteIdeas,
    tailoredRecommendations: tailoredRecommendations.slice(0, 4),
  };
}

export function buildOutreachFallback(
  profile: Profile,
  tone: string,
): OutreachPayload {
  return {
    networkingEmail: {
      subject: `Business student exploring ${profile.industryInterest} careers`,
      body: `Hi [Name],\n\nI’m a ${profile.major} student preparing for ${profile.industryInterest.toLowerCase()} roles and noticed your background in this space. I’m building a focused search around ${profile.targetRoleFocus ?? "entry-level business roles"} and would value 15 minutes to hear how you approached the field.\n\nThank you,\n${profile.fullName}`,
    },
    linkedInMessage: {
      body: `Hi [Name], I’m a ${profile.major} student targeting ${profile.industryInterest.toLowerCase()} roles. Your path stood out to me, and I’d love to connect and learn from your experience if you’re open to it.`,
    },
    informationalInterviewRequest: {
      subject: `Quick informational chat about ${profile.industryInterest}`,
      body: `Hi [Name],\n\nI’m exploring early-career roles in ${profile.industryInterest.toLowerCase()} and am reaching out to a small group of professionals whose paths look especially relevant. If you have 15 minutes in the next two weeks, I’d appreciate the chance to ask a few focused questions.\n\nBest,\n${profile.fullName}`,
    },
    followUpNote: {
      subject: "Following up on my note",
      body: `Hi [Name],\n\nI wanted to follow up in case my last message got buried. I’m continuing to refine my search for ${profile.industryInterest.toLowerCase()} roles and would appreciate a short conversation if your schedule allows.\n\nThank you,\n${profile.fullName}`,
    },
    thankYouEmail: {
      subject: "Thank you",
      body: `Hi [Name],\n\nThank you again for taking the time to speak with me. Your advice about positioning for ${profile.industryInterest.toLowerCase()} roles was especially helpful, and I’m already applying it to my search.\n\nBest,\n${profile.fullName}`,
    },
    tips: [
      `${tone} tone works best when you are early in the process and asking for insight rather than a referral.`,
      "Reference one specific reason you chose that person.",
      "Keep first-touch messages short enough to scan on a phone.",
    ],
  };
}

export function buildApplicationPlanFallback(): ApplicationPlanPayload {
  return {
    summary:
      "Run a focused search built around role families you can credibly win now, with a smaller stream of stretch applications layered on top.",
    weeklyTarget: "8-12 tailored applications plus 5 outreach messages per week",
    realisticRoles: [
      "Coordinator roles",
      "Analyst roles with training support",
      "Associate and rotational programs",
    ],
    prioritization: [
      "Prioritize companies where your location, industry interest, and experience signal align clearly.",
      "Apply to high-fit openings within the first week when possible.",
      "Balance prestige targets with faster-moving mid-sized employers.",
    ],
    followUpCadence: [
      "Follow up 7-10 days after applying if you have a warm contact or high-fit case.",
      "Use a second follow-up only when you can add value or a real update.",
    ],
    tailoringChecklist: [
      "Match the resume headline and keywords to the role family.",
      "Adjust two to four bullets to reflect the posting.",
      "Use the cover note or outreach message to explain fit and timing.",
    ],
  };
}

export function buildTimelineFallback(profile: Profile): TimelinePayload {
  const totalWeeks = Math.max(
    6,
    differenceInWeeks(profile.earliestStartDate, new Date(), { roundingMethod: "ceil" }),
  );
  const milestones = [
    {
      label: "Resume revision sprint",
      timeframe: `Week 1`,
      description: "Rewrite the top section and strongest experience bullets around target roles.",
      editable: true,
    },
    {
      label: "Outreach launch",
      timeframe: `Week 2`,
      description: "Build a 20-person alumni and professional contact list and send your first wave.",
      editable: true,
    },
    {
      label: "Applications ramp",
      timeframe: `Weeks 2-4`,
      description: "Submit tailored applications with a repeatable weekly cadence.",
      editable: true,
    },
    {
      label: "Interview preparation",
      timeframe: `Weeks 4-6`,
      description: "Prepare stories, role-specific questions, and company research briefs.",
      editable: true,
    },
    {
      label: "Offer-readiness window",
      timeframe: `By ${format(profile.earliestStartDate, "MMM d, yyyy")}`,
      description: `Plan backwards from your earliest start date across roughly ${totalWeeks} weeks.`,
      editable: false,
    },
  ];

  return {
    summary:
      "Your plan should front-load positioning work, then shift into a disciplined outreach and application cadence tied to your start-date window.",
    timelineMode: totalWeeks <= 10 ? "weekly" : "monthly",
    milestones,
  };
}

export function buildJobsFallback() {
  return [];
}
