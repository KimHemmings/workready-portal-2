"""Pydantic v2 models for WorkReady Portal. Mirrored by frontend/src/lib/types.ts."""

import uuid
from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, Field


def new_id() -> str:
    return str(uuid.uuid4())


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


Role = Literal["participant", "coach", "admin", "owner"]
OrgType = Literal["School", "Workforce Australia", "TtW", "DES"]
ProgressStatus = Literal["not_started", "in_progress", "completed"]


class Organization(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    type: OrgType
    branding_logo: str = ""
    primary_color: str = "#1E3A8A"
    site_code: str = ""
    coach_seat_limit: int = 5
    participant_seat_limit: int = 100
    created_at: datetime = Field(default_factory=now_utc)


class SeatUpdate(BaseModel):
    coach_seat_limit: int = Field(ge=0, le=500)
    participant_seat_limit: int = Field(ge=0, le=10000)


class User(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    email: str
    role: Role
    organization_id: str
    phone: str = ""
    status: Literal["active", "inactive", "archived", "pending"] = "active"
    coach_id: str | None = None
    cohort_id: str | None = None
    last_login: datetime | None = None
    archived_at: datetime | None = None
    must_change_password: bool = False
    invite_token: str | None = None
    invited_by: str | None = None


class InviteResult(BaseModel):
    """Returned whenever a user is added, so the inviter can hand over a magic link immediately."""

    user: User
    invite_token: str
    invite_path: str
    welcome_message: str


class InvitePreview(BaseModel):
    email: str
    name: str
    role: Role
    organization_name: str
    organization_logo: str = ""
    already_completed: bool = False


class CompleteRegistrationRequest(BaseModel):
    password: str = Field(min_length=8)


class ResetPasswordResult(BaseModel):
    user_id: str
    name: str
    email: str
    temporary_password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ForgotPasswordResponse(BaseModel):
    message: str
    contact_name: str = ""
    contact_email: str = ""


class ChangePasswordRequest(BaseModel):
    user_id: str
    current_password: str
    new_password: str = Field(min_length=8)


class ProviderCreate(BaseModel):
    organization_name: str = Field(min_length=2)
    type: OrgType = "Workforce Australia"
    admin_name: str = Field(min_length=2)
    admin_email: str
    coach_seat_limit: int = Field(default=5, ge=0, le=500)
    participant_seat_limit: int = Field(default=100, ge=0, le=10000)


class ProviderRow(BaseModel):
    organization: Organization
    admins: list[User]
    coach_seats_used: int
    participant_seats_used: int


class OwnerOverview(BaseModel):
    providers: list[ProviderRow]
    total_providers: int
    total_coaches: int
    total_participants: int


class UserCreate(BaseModel):
    name: str
    email: str
    role: Role
    phone: str = ""
    coach_id: str | None = None
    cohort_id: str | None = None
    password: str = ""


class AssignUpdate(BaseModel):
    coach_id: str | None = None
    cohort_id: str | None = None


class Cohort(BaseModel):
    id: str = Field(default_factory=new_id)
    name: str
    organization_id: str
    coach_id: str | None = None


class TrainingModule(BaseModel):
    id: str = Field(default_factory=new_id)
    title: str
    category: str
    description: str
    video_url: str = ""
    content_markdown: str = ""
    estimated_minutes: int = 15
    order: int = 0


class QuizQuestion(BaseModel):
    question: str
    options: list[str]
    correct_answer: int
    explanation: str
    scenario: str = ""


class Quiz(BaseModel):
    id: str = Field(default_factory=new_id)
    module_id: str
    questions: list[QuizQuestion] = []


class ModuleDetail(BaseModel):
    module: TrainingModule
    quiz: Quiz | None = None
    progress: "ParticipantProgress | None" = None


class ParticipantProgress(BaseModel):
    id: str = Field(default_factory=new_id)
    participant_id: str
    module_id: str
    status: ProgressStatus = "not_started"
    quiz_score: int | None = None
    completed_at: datetime | None = None


class QuizSubmission(BaseModel):
    answers: list[int]


class QuizAnswerResult(BaseModel):
    question: str
    selected: int
    correct_answer: int
    is_correct: bool
    explanation: str


class QuizResult(BaseModel):
    score: int
    passed: bool
    correct: int
    total: int
    results: list[QuizAnswerResult]
    certificate_earned: bool
    new_certificates: list["Certificate"] = []


class JobSearchLog(BaseModel):
    id: str = Field(default_factory=new_id)
    participant_id: str
    employer_name: str
    position_title: str
    application_date: str
    application_type: str
    evidence_filename: str = ""
    notes: str = ""
    status: Literal["submitted", "verified"] = "submitted"
    points: int = 5
    created_at: datetime = Field(default_factory=now_utc)


class JobSearchLogCreate(BaseModel):
    employer_name: str
    position_title: str
    application_date: str
    application_type: str
    evidence_filename: str = ""
    notes: str = ""


class Resume(BaseModel):
    id: str = Field(default_factory=new_id)
    participant_id: str
    title: str
    contact_info_json: dict[str, Any] = {}
    work_history_json: list[dict[str, Any]] = []
    education_json: list[dict[str, Any]] = []
    skills_json: list[str] = []
    generated_markdown: str = ""
    cover_letter_markdown: str = ""
    created_at: datetime = Field(default_factory=now_utc)


class ResumeCreate(BaseModel):
    title: str
    contact_info_json: dict[str, Any] = {}
    work_history_json: list[dict[str, Any]] = []
    education_json: list[dict[str, Any]] = []
    skills_json: list[str] = []
    target_role: str = ""
    include_cover_letter: bool = True


class ResumeUpdate(BaseModel):
    """Free text edits to an already generated document — never spends AI credits."""

    generated_markdown: str | None = None
    cover_letter_markdown: str | None = None


UsageKind = Literal["interviews", "resumes", "cover_letters", "job_logs"]


class UsageMetric(BaseModel):
    kind: UsageKind
    used: int
    limit: int
    base_limit: int
    granted_extra: int
    remaining: int


class UsageSummary(BaseModel):
    participant_id: str
    month: str
    interviews: UsageMetric
    resumes: UsageMetric
    cover_letters: UsageMetric
    job_logs: UsageMetric


class GrantRequest(BaseModel):
    kind: UsageKind = "interviews"
    amount: int = 1


class TranscriptTurn(BaseModel):
    role: Literal["interviewer", "participant", "coach"]
    content: str


class SkillScore(BaseModel):
    skill: str
    score: int
    comment: str


class FeedbackSummary(BaseModel):
    strengths: list[str] = []
    improvements: list[str] = []
    skills: list[SkillScore] = []
    summary: str = ""


InterviewMode = Literal["standard", "llnd"]


class InterviewSession(BaseModel):
    id: str = Field(default_factory=new_id)
    participant_id: str
    job_target: str
    industry: str
    mode: InterviewMode = "standard"
    transcript_json: list[TranscriptTurn] = []
    questions: list[str] = []
    current_index: int = 0
    finished: bool = False
    overall_score: int | None = None
    feedback_summary_json: FeedbackSummary | None = None
    created_at: datetime = Field(default_factory=now_utc)


class InterviewStart(BaseModel):
    participant_id: str
    job_target: str
    industry: str
    mode: InterviewMode = "standard"


class InterviewAnswer(BaseModel):
    answer: str


class CaseNote(BaseModel):
    id: str = Field(default_factory=new_id)
    participant_id: str
    coach_id: str
    coach_name: str = ""
    body: str
    created_at: datetime = Field(default_factory=now_utc)


CertificateKind = Literal["category", "interview"]


class Certificate(BaseModel):
    id: str = Field(default_factory=new_id)
    certificate_id: str
    participant_id: str
    participant_name: str
    kind: CertificateKind
    title: str
    subtitle: str = ""
    organization_id: str
    organization_name: str
    organization_logo: str = ""
    score: int | None = None
    issued_at: datetime = Field(default_factory=now_utc)


class CaseNoteCreate(BaseModel):
    body: str


class ParticipantDashboard(BaseModel):
    user: User
    total_modules: int
    completed_modules: int
    in_progress_modules: int
    completion_percent: int
    next_module: TrainingModule | None = None
    recent_logs: list[JobSearchLog] = []
    pbas_points: int = 0
    pbas_target: int = 100
    certificates: int = 0
    latest_interview_score: int | None = None
    usage: UsageSummary


class RosterRow(BaseModel):
    participant: User
    completion_percent: int
    completed_modules: int
    job_applications: int
    pbas_points: int
    last_login: datetime | None = None
    risk: Literal["on_track", "watch", "at_risk"]


class CoachParticipantDetail(BaseModel):
    participant: User
    completion_percent: int
    progress: list[ParticipantProgress]
    modules: list[TrainingModule]
    job_logs: list[JobSearchLog]
    resumes: list[Resume]
    interviews: list[InterviewSession]
    notes: list[CaseNote]
    certificates: list[Certificate]
    pbas_points: int
    usage: UsageSummary


class NameCount(BaseModel):
    name: str
    value: int


class AdminOverview(BaseModel):
    organization: Organization
    total_participants: int
    total_coaches: int
    total_cohorts: int
    average_completion: int
    module_engagement: list[NameCount]
    cohort_completion: list[NameCount]
    users: list[User]
    cohorts: list[Cohort]
    coaches: list[User]
    participant_seats_used: int = 0
    participant_seat_limit: int = 100
    coach_seats_used: int = 0
    coach_seat_limit: int = 5
    archived_participants: int = 0
    logo_max_bytes: int = 2097152
