# Business-Career-Kickoff
# Business Career Kickoff

Business Career Kickoff is a production-minded, multi-page Next.js application for college business seniors and recent graduates. It combines private user accounts, structured AI generation, PDF resume analysis, and live job discovery into a personalized career guidance hub.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Polished component primitives inspired by shadcn/ui
- Framer Motion
- PostgreSQL + Prisma ORM
- Auth.js email magic-link authentication with Resend
- OpenAI API for structured guidance generation
- Adzuna jobs API via a provider abstraction layer

## Features

- Email magic-link authentication
- Multi-step onboarding with required career inputs
- Personalized dashboard with saved insights
- Role recommendations with fit reasoning, keywords, skill gaps, and competitiveness
- PDF-only resume upload, parsing, storage, and feedback history
- Outreach templates with copy-to-clipboard support
- Application strategy and timeline planning
- Personalized jobs feed with provider abstraction, recency filtering, caching, bookmarks, and apply links
- Private account page, Privacy Policy page, and Terms page

## Project structure

```text
app/                  Routes, layouts, API handlers
components/           UI primitives and page-level components
lib/                  Prisma client, auth, validators, AI, jobs, server actions
prisma/               Prisma schema, SQL migration, seed script
scripts/              Reserved for future automation helpers
