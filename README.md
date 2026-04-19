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
```

## Environment variables

Copy `.env.example` to `.env.local` and set the following:

```bash
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
RESEND_API_KEY=
AUTH_EMAIL_FROM="Business Career Kickoff <noreply@example.com>"
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
ADZUNA_COUNTRY=us
DEMO_SEED_EMAIL=demo@kickoff.local
```

Notes:

- `RESEND_API_KEY` and `AUTH_EMAIL_FROM` power magic-link email delivery.
- `OPENAI_API_KEY` powers structured role guidance, resume feedback, outreach, strategy, and timeline generation.
- `ADZUNA_*` powers the live jobs feed. The jobs service is abstracted so more providers can be added later in `lib/jobs/`.
- If `OPENAI_API_KEY` is absent, the app falls back to deterministic local guidance so development can continue.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

3. Run the initial migration against PostgreSQL:

   ```bash
   npm run prisma:migrate
   ```

4. Seed demo content:

   ```bash
   npm run seed
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Demo account and local testing

- The seed script creates a verified demo user at the email in `DEMO_SEED_EMAIL`.
- Because authentication uses magic links, local sign-in still requires valid Resend configuration to send mail.
- For local testing, you can use the seeded account data after signing in with the same email.

## OpenAI integration

AI generation happens in `lib/ai/generators.ts`. Each generation path:

- serializes the saved profile
- requests a structured JSON response
- validates the result with Zod
- stores the normalized payload in Prisma tables
- records a history entry in `GeneratedContentHistory`

Supported AI sections:

- dashboard insights
- role recommendations
- resume analysis
- outreach templates
- application strategy
- timeline planning

## Resume upload and privacy

- PDF only
- 5MB max
- resume bytes are stored privately in PostgreSQL in the `Resume` table
- extracted text is stored privately and never exposed publicly
- each resume and analysis query is scoped by the authenticated user

Visible UI copy near the uploader states:

> Your resume will be stored privately in your account and used only to generate personalized feedback. It will not be shared with other users or third parties.

## Jobs provider architecture

The jobs system is intentionally abstracted.

- `lib/jobs/types.ts` defines the shared provider interface
- `lib/jobs/adzuna.ts` implements a real provider
- `lib/jobs/service.ts` handles normalization, cache lookup, and fallback behavior

The system normalizes results into a common internal job shape with:

- title
- company
- location
- date posted
- employment type
- source
- short description
- application URL

Future providers can be added without changing the page UI. If you want to add LinkedIn or Indeed later, link out to their public job pages or use compliant partner APIs. Do not implement direct scraping.

## Deployment to Vercel

1. Push this repository to GitHub.
2. Create a new Vercel project and import the repo.
3. Add all environment variables from `.env.example` in the Vercel dashboard.
4. Provision a PostgreSQL database, for example Vercel Postgres or Neon.
5. Run the Prisma migration against the production database:

   ```bash
   npx prisma migrate deploy
   ```

6. Deploy the project.

Recommended Vercel settings:

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`

## Custom domain connection on Vercel

1. Open your Vercel project.
2. Go to `Settings -> Domains`.
3. Add your custom domain.
4. Update DNS records at your registrar using the values Vercel provides.
5. After DNS propagation completes, verify the domain in Vercel and update `AUTH_URL` to the production domain.

## Security and privacy notes

- Protected routes are enforced in `middleware.ts`.
- Authenticated data access always scopes queries to `userId`.
- Resume uploads are validated for type and size before parsing.
- The app avoids exposing resume text or generated private outputs publicly.
- Secrets are loaded from environment variables only.

## Remaining integration notes

- Resend configuration is required for real magic-link email delivery.
- Adzuna availability varies by region and API plan.
- For large-scale file storage, moving resume bytes from PostgreSQL to a dedicated private object store would be a reasonable future improvement.
