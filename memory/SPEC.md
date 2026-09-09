# WorkReady Portal — Living Spec

Multi-tenant SaaS for Australian employability skills training (Schools, Workforce Australia, TtW, DES).

## Stack
FastAPI + MongoDB (motor) backend on `/api`; Vite + React 19 + Tailwind v4 + shadcn/ui frontend.
AI: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) via `emergentintegrations` + `EMERGENT_LLM_KEY`.
All AI calls have deterministic fallbacks (`backend/lib/ai.py`) so no flow breaks if the LLM fails.

## Auth (demo model)
Passwordless demo login: `POST /api/auth/login {email}` returns the `User`; frontend stores it in
localStorage (`workready.user`, see `frontend/src/lib/session.ts`). Role routing is enforced client-side
by `<Protected roles=[...]>` in `App.tsx` and server-side by role checks in each router
(`_coach`, `_admin`, `get_participant` raise 403 for the wrong role).

## Data model (backend/models/schemas.py)
Organizations (incl. `branding_logo`, `primary_color`), Users (participant/coach/admin, `coach_id`,
`cohort_id`), Cohorts, TrainingModules, Quizzes, ParticipantProgress, JobSearchLogs
(`evidence_filename` + PBAS `points`), Resumes, InterviewSessions, CaseNotes.

## Design system (frontend/src/index.css)
Vibrant provider palette, WCAG AA: background `#F8FAFC`, primary navy `#1E3A8A` (sidebar/nav),
accent purple `#7C3AED` (progress rings, charts), CTA orange `#F97316` (start interview, generate
resume, submit log, sign in), success green `#10B981` (verified tags, passed quizzes, scorecard bars).
Custom tokens: `bg-cta/text-cta-foreground`, `bg-success/success-soft`, `brand-purple/brand-purple-soft`.
Fonts: Outfit (headings), Plus Jakarta Sans (body), IBM Plex Mono (labels).
Provider logo lives in `frontend/src/lib/brand.ts` (`BRAND_LOGO`) — swap that URL to rebrand.

## Key flows
- **Certificates**: auto-issued by `backend/lib/certificates.py` on two triggers — completing every
  module in a category, or scoring >70 on an AI mock interview. Idempotent (unique index on
  participant+kind+title); IDs look like `CERT-2026-8942`. Participants see them under a
  Certificates nav item (`/participant/certificates`); coaches see them on a Certificates tab of the
  participant detail page. Both open a landscape navy/purple modal and download a print-ready PDF
  drawn as true vector content with jsPDF (`downloadCertificatePdf`) — html2canvas was removed
  because it cannot parse Tailwind v4 colour functions.
- **Participant**: dashboard (progress ring, PBAS bar, next module, recent logs) → Learning Centre →
  module detail (video + markdown + MCQ quiz, 80% to pass and earn a certificate) → AI Interview
  Simulator (5 questions, per-answer coaching tips, scorecard + .txt download) → Resume Builder
  (AI markdown resume + cover letter) → PBAS Job Search Logger.
- **Coach**: roster with search + risk flags, KPIs, participant detail (progress/jobs/interviews/
  resumes tabs + private case notes), CSV and PDF compliance exports
  (`/api/coaches/{id}/export.csv|.pdf`).
- **Admin**: KPIs, recharts module-engagement bar + cohort-completion pie, invite users,
  activate/deactivate accounts.

## Certificate modal preview (audit fix, this session)
The on-screen artwork is authored at a fixed 1000px width and scaled down with a ResizeObserver-driven
`transform: scale()` inside an `aspect-[1.414/1]` frame, so the preview fits desktop, tablet and mobile
without clipping. The PDF path is untouched (vector jsPDF) and embeds the Admin-uploaded org logo.

## PBAS points
Online/Email/Phone/Agency = 5, In person = 10, Interview attended = 20. Monthly target 100.

## Seed data (`cd /app/backend && python seed.py`, idempotent — wipes and re-seeds)
Org: Hunter Valley Employment Services (Workforce Australia). Cohorts: Morning Job Club, TtW Youth Cohort.
5 modules with 5-question quizzes each. Sarah Chen: 2 modules complete, 1 in progress, 4 job logs, 1 case note.
5 extra jobseekers assigned to Marcus Vance with varied progress.
