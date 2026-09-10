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

## Demo-mode cleanup (final)
There is no demo mode anywhere in the codebase — no `IS_DEMO_MODE` flag, `demoUsers` list, quick-login
component or demo overlay exists (grep for `demo` returns only code comments and the words
"mock interview"/"demonstrating").

- `/` **and** `/login` both render `Login.tsx` only; `*` also falls back to `/login`. The old
  `RootRedirect` that sent a stored session straight to a dashboard is gone — that auto-login was what
  looked like "demo mode" on load.
- `lib/useSessionValidation.ts` re-checks any stored session against `GET /api/users/{id}` before a
  protected route renders and discards it if the account is missing, inactive or archived. App renders a
  brief "Loading…" gate while that check runs.
- Seeded accounts use the `@hves.com.au` domain (Hunter Valley Employment Services);
  the old addresses no longer exist (login returns 401). Backend tests updated to match.

## Security & privacy hardening (final pass)
- **Hard AI caps** are server-side only: `POST /api/interviews/start` and `POST /api/participants/{pid}/resumes`
  return **HTTP 402** with an "Upgrade Required — …" message once the account's 3-per-month allowance is
  spent (a case manager grant or plan upgrade clears it). Job search entries stay at 429/20 per month.
- **Voice consent**: `components/VoiceConsentDialog.tsx` gates the microphone — the first mic press opens
  "Allow voice recording for AI feedback" and dictation only starts after Allow; the choice is remembered in
  localStorage (`workready.voiceConsent`). Declining leaves the mic idle and typing always works.
- **Legal placeholders**: `/privacy` and `/terms` (`pages/LegalPage.tsx`) linked from the login page footer.
- **Tenant isolation (coach surfaces)**: `_roster_rows` filters on `{coach_id, role, organization_id}`,
  `_participant_in_tenant()` guards participant detail / case notes / AI grants (foreign jobseeker → **404**,
  never 403, so existence isn't leaked), the CSV/PDF exports run through the same scoped roster, cohort names
  resolve only within the caller's organisation, and the retention sweep is scoped to the caller's org.
  Verified with a second seeded organisation: cross-tenant reads/writes 404, each export contains only its
  own jobseekers.


## Role hierarchy, labels and access override
Stored role values are unchanged; only the UI wording was relabelled (single source:
`frontend/src/lib/roles.ts`).

| stored | UI label | can add |
|---|---|---|
| `owner` | System Admin | Providers (org + first admin), Case Managers, Learners; sees every org |
| `admin` | Provider | Case Managers and Learners in their own org |
| `coach` | Case Manager | Learners on their own caseload |
| `participant` | Learner | submits job applications + proof files |

**Role Switcher** (`components/RoleSwitcher.tsx`, System Admin only) calls
`GET /api/role-switch/{owner_id}` for one real active user per role (preferring an org that has
learners) and impersonates them. The original System Admin is stored in the
`workready.impersonator` localStorage key, a banner shows who is being previewed, and
"Back to System Admin" restores the session. Non-owners get 403 and never see the control.

## Job Search Evidence
Learners attach a proof file (PDF/image/receipt, <= 5MB) to a PBAS job search log; it is stored
inline in Mongo as base64 (`evidence_data`, never returned in list responses — only via download).
`routers/evidence.py`:
- `GET /api/evidence/{staff_id}` -> `EvidenceSummary` (rows + pending/approved/flagged/with_file
  counts), scoped: coach = own caseload, admin = own org, owner = all.
- `GET /api/evidence/{staff_id}/{log_id}/file` -> streams the file as a download.
- `PATCH /api/evidence/{staff_id}/{log_id}/review` -> approve (also marks the log `verified`) or
  flag, recording `reviewed_by` / `reviewed_at` / `review_note`.
Frontend: `pages/Evidence.tsx` at `/evidence` (nav item for Case Manager, Provider, System Admin),
with search, status filters, download, an approve/flag dialog and a link to the learner profile.
Replacing a file resets the review to pending.

## Invite emails (Resend)
`POST /api/invite-email/{inviter_id}/{user_id}` re-issues the magic link, renders the onboarding
template (`lib/email.py`) and sends it via Resend. It returns `status` = `sent` | `unavailable` |
`failed` plus the subject, body, onboarding URL and a `mailto:` draft, so
`components/SendInviteButton.tsx` always gives the inviter a way to deliver it. `RESEND_API_KEY` is
blank in `backend/.env` -> status `unavailable` and no email is sent; set the key to enable delivery.
`APP_URL` controls the link host.

## Legal pages
`/privacy` and `/terms` (`pages/LegalPage.tsx`) hold full Australian Privacy Principles (APP 1-13)
and platform Terms of Use content. `components/LegalFooter.tsx` puts Privacy/Terms links in the app
shell footer on every signed-in screen and on the login page. Legacy hash links (`/#/privacy`, `/#/terms`, `/#/accept-invite`) are rewritten to the clean path in
`main.tsx` *before* BrowserRouter reads the URL; `/accept-invite` redirects to `/register`.

## Authentication — 3-tier B2B, invite-only (current)
Roles: **owner** (system/platform owner) → **admin** (Provider Admin) → **coach** (Case Manager) →
**participant** (Jobseeker). There is **no public sign-up** and no email sending anywhere.

- `POST /api/auth/login` → `User` (401 bad credentials, 403 inactive/archived). `must_change_password`
  on the returned user forces the frontend to `/change-password` before any dashboard renders
  (`Protected` in `App.tsx`).
- **Magic invite links**: adding a user mints a single-use `invite_token` and returns `InviteResult`
  (`user`, `invite_token`, `invite_path` = `/register?invite=TOKEN`, `welcome_message`). The inviter
  copies the link out of `components/InviteLinkDialog.tsx`. Endpoints: `POST /api/owner/{id}/providers`,
  `POST /api/admin/{id}/users`, `POST /api/coaches/{id}/participants`, plus
  `POST .../invite-link` on each tier to re-issue. Invited accounts sit at `status: "pending"`
  (they hold a seat) until `POST /api/auth/invites/{token}/complete` sets their password → `active`.
  `GET /api/auth/invites/{token}` powers the Complete Registration screen (`pages/Register.tsx`).
- **Password reset / override**: `POST /api/admin/{id}/users/{uid}/reset-password` and
  `POST /api/coaches/{id}/participants/{pid}/reset-password` return a one-off `temporary_password`
  (shown in `TempPasswordDialog`) and set `must_change_password`. The user then changes it via
  `POST /api/auth/change-password` (`pages/ChangePassword.tsx`).
- **Forgot password**: `POST /api/auth/forgot-password` returns who can help (case manager, else a
  provider admin) — surfaced in a dialog on the login page. No reset emails.
- **Seat limits**: `Organization.coach_seat_limit` / `participant_seat_limit`, set by the Owner via
  `PATCH /api/owner/{id}/providers/{org}/seats` (409 if below current usage). Every invite runs through
  `lib/invites.assert_seat_available` → **409** "Seat limit reached…" when exhausted.
- **Owner dashboard** (`pages/OwnerDashboard.tsx`, `/owner`): totals, provider list with seats used vs
  sold, inline seat editing, create-provider form (org + first Provider Admin via magic link) and
  invite-link re-issue.
- Site registration codes and the public `/signup` page were removed with public sign-up.

`/login` is a clean B2B sign-in: email + password, POST `/api/auth/login` (401 on bad credentials),
with a "Don't have an account? Sign Up" link. The demo quick-login cards and the
Quick-login cards and the account-listing endpoint no longer exist.

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
Org: Hunter Valley Employment Services (Workforce Australia), 5 case manager / 100 jobseeker seats.
Accounts (all `Training2026!`): owner@straightuptraining.com.au (owner), eleanor@hves.com.au (admin),
marcus@hves.com.au (coach), sarah@hves.com.au + 5 more jobseekers.
Cohorts: Morning Job Club, TtW Youth Cohort.
5 modules with 5-question quizzes each. Sarah Chen: 2 modules complete, 1 in progress, 4 job logs, 1 case note.
5 extra jobseekers assigned to Marcus Vance with varied progress.

## Pod/infra gotchas found while building this feature
- The public preview had been served by a stray `npx serve -s dist -l 5173` process bound to all
  interfaces, so the ingress was returning a **stale static build** (the source of the "demo cards
  keep coming back" reports). That process was killed; the ingress now reaches Vite on port 3000.
- `frontend/vite.config.ts` and `frontend/src/index.css` had been overwritten with minimal/incorrect
  content (index.css literally contained HTML, and the config had lost the Tailwind v4 plugin, the
  `/api` proxy and `port: 3000`). Both were restored from git — if the dev server 502s or styling
  disappears, check these two files first.
- `APP_URL` is exported by supervisor with a stale UUID host, so `routers/invite_email.app_url()`
  reads `backend/.env` with `dotenv_values` and lets the file win.

## Update — quiz/interview length, read-aloud, PDF scorecard
- Module quizzes: every quiz in `backend/seed.py` QUIZZES now has exactly 7 MCQs (re-run `python backend/seed.py` to apply).
- Mock interviews: exactly 8 questions (`backend/lib/ai.py` prompts + FALLBACK_QUESTIONS / LLND_FALLBACK_QUESTIONS).
- Per-question read-aloud buttons on interviewer turns in `frontend/src/pages/Interview.tsx` (window.speechSynthesis, en-AU).
- PDF scorecard generator: `pdf.interview_scorecard_pdf()` served by `GET /api/interviews/{id}/scorecard.pdf`; frontend "Download PDF scorecard" (text export retained).
