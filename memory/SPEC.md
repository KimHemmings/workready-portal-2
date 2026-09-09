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

## Authentication (real email + password — no demo mode)
`/login` is a clean B2B sign-in: email + password, POST `/api/auth/login` (401 on bad credentials),
with a "Don't have an account? Sign Up" link. The demo quick-login cards and the
`/api/auth/demo-accounts` endpoint have been removed.

`/signup` (page `Signup.tsx`) posts to `/api/auth/register` with full name, organisation/site name,
email, password (min 8 chars) and an optional Site Invite Code. A valid code joins that organisation and
auto-assigns the site's case manager; no code creates the person's own organisation. Registration always
produces role `participant` — coach/admin accounts are created by a Provider Admin invite.

Passwords are PBKDF2-HMAC-SHA256 (200k iterations) via `backend/lib/security.py`; the hash lives in the
user document as `password_hash` and is never part of the `User` response model. Admin-invited users get
`Welcome2026!` unless the admin supplies a password.

Site registration codes live on `Organization.site_code`. Admin → Organisation branding shows a
copyable/editable code, "Generate new code" (`POST /api/admin/{id}/site-code/regenerate`) and a
"Copy invite link" that yields `/signup?code=…`, which pre-fills the field. Codes are uppercased,
4–24 chars, unique across organisations.

## Platform caps & AI cost protection (this session)
Server-anchored monthly caps live in `backend/lib/limits.py` (month = UTC calendar month):
3 AI interviews, 3 AI resumes, 3 AI cover letters, 20 job search log entries per participant;
100 active jobseeker seats and 5 case manager seats per organisation; 2MB max logo upload;
participants with no login for 60 days are set to `archived` (sweep runs on coach roster load,
admin overview load, and the admin "Run 60-day archive sweep" button).

Case managers top up an individual allowance with `POST /api/coaches/{coach_id}/participants/{pid}/grant-ai`
(`{kind, amount}`), stored per participant per month in the `usage_overrides` collection — "Grant Extra
AI Session" on the participant detail page. Usage is exposed via `GET /api/participants/{pid}/usage`
and embedded in the participant dashboard and coach detail payloads.

Saved resumes/cover letters are edited free of charge via `PATCH /api/participants/{pid}/resumes/{id}`
and downloaded unlimited times as vector PDFs (`frontend/src/lib/docPdf.ts`).

Voice input: `frontend/src/lib/speech.ts` wraps `webkitSpeechRecognition` (en-AU, interim results) and
the "Speak answer" mic button in the interview appends recognised phrases into the answer box for editing.

## Certificate modal preview (audit fixes)
The on-screen artwork is authored at a fixed 1000px width and scaled with a ResizeObserver-driven
`transform: scale()` inside an `aspect-[1.414/1]` frame. The dialog is rendered through
`createPortal(..., document.body)` — inside the page tree an animated (transformed) ancestor became the
containing block for `position: fixed` and clipped the modal. Certificates are also re-hydrated with the
organisation's *current* name/logo on read (`lib/certificates.hydrate`), so a logo uploaded after a
certificate was issued still appears on its PDF.

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
