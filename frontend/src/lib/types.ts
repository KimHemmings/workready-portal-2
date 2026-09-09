// Hand-written mirrors of backend/models/schemas.py — keep both sides in sync.

export type Role = "participant" | "coach" | "admin";
export type OrgType = "School" | "Workforce Australia" | "TtW" | "DES";
export type ProgressStatus = "not_started" | "in_progress" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization_id: string;
  phone: string;
  status: "active" | "inactive" | "archived";
  coach_id: string | null;
  cohort_id: string | null;
  last_login: string | null;
  archived_at: string | null;
}

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  branding_logo: string;
  primary_color: string;
  created_at: string;
}

export interface Cohort {
  id: string;
  name: string;
  organization_id: string;
  coach_id: string | null;
}

export interface TrainingModule {
  id: string;
  title: string;
  category: string;
  description: string;
  video_url: string;
  content_markdown: string;
  estimated_minutes: number;
  order: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  scenario: string;
}

export interface Quiz {
  id: string;
  module_id: string;
  questions: QuizQuestion[];
}

export interface ParticipantProgress {
  id: string;
  participant_id: string;
  module_id: string;
  status: ProgressStatus;
  quiz_score: number | null;
  completed_at: string | null;
}

export interface ModuleDetail {
  module: TrainingModule;
  quiz: Quiz | null;
  progress: ParticipantProgress | null;
}

export interface QuizAnswerResult {
  question: string;
  selected: number;
  correct_answer: number;
  is_correct: boolean;
  explanation: string;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  results: QuizAnswerResult[];
  certificate_earned: boolean;
  new_certificates: Certificate[];
}

export interface JobSearchLog {
  id: string;
  participant_id: string;
  employer_name: string;
  position_title: string;
  application_date: string;
  application_type: string;
  evidence_filename: string;
  notes: string;
  status: "submitted" | "verified";
  points: number;
  created_at: string;
}

export interface JobSearchLogCreate {
  employer_name: string;
  position_title: string;
  application_date: string;
  application_type: string;
  evidence_filename?: string;
  notes?: string;
}

export interface Resume {
  id: string;
  participant_id: string;
  title: string;
  contact_info_json: Record<string, string>;
  work_history_json: Record<string, string>[];
  education_json: Record<string, string>[];
  skills_json: string[];
  generated_markdown: string;
  cover_letter_markdown: string;
  created_at: string;
}

export interface ResumeCreate {
  title: string;
  contact_info_json: Record<string, string>;
  work_history_json: Record<string, string>[];
  education_json: Record<string, string>[];
  skills_json: string[];
  target_role: string;
  include_cover_letter?: boolean;
}

export interface ResumeUpdate {
  generated_markdown?: string;
  cover_letter_markdown?: string;
}

export type UsageKind = "interviews" | "resumes" | "cover_letters" | "job_logs";

export interface UsageMetric {
  kind: UsageKind;
  used: number;
  limit: number;
  base_limit: number;
  granted_extra: number;
  remaining: number;
}

export interface UsageSummary {
  participant_id: string;
  month: string;
  interviews: UsageMetric;
  resumes: UsageMetric;
  cover_letters: UsageMetric;
  job_logs: UsageMetric;
}

export interface GrantRequest {
  kind: UsageKind;
  amount: number;
}

export interface TranscriptTurn {
  role: "interviewer" | "participant" | "coach";
  content: string;
}

export interface SkillScore {
  skill: string;
  score: number;
  comment: string;
}

export interface FeedbackSummary {
  strengths: string[];
  improvements: string[];
  skills: SkillScore[];
  summary: string;
}

export type InterviewMode = "standard" | "llnd";

export interface InterviewSession {
  id: string;
  participant_id: string;
  job_target: string;
  industry: string;
  mode: InterviewMode;
  transcript_json: TranscriptTurn[];
  questions: string[];
  current_index: number;
  finished: boolean;
  overall_score: number | null;
  feedback_summary_json: FeedbackSummary | null;
  created_at: string;
}

export interface CaseNote {
  id: string;
  participant_id: string;
  coach_id: string;
  coach_name: string;
  body: string;
  created_at: string;
}

export type CertificateKind = "category" | "interview";

export interface Certificate {
  id: string;
  certificate_id: string;
  participant_id: string;
  participant_name: string;
  kind: CertificateKind;
  title: string;
  subtitle: string;
  organization_id: string;
  organization_name: string;
  organization_logo: string;
  score: number | null;
  issued_at: string;
}

export interface ParticipantDashboard {
  user: User;
  total_modules: number;
  completed_modules: number;
  in_progress_modules: number;
  completion_percent: number;
  next_module: TrainingModule | null;
  recent_logs: JobSearchLog[];
  pbas_points: number;
  pbas_target: number;
  certificates: number;
  latest_interview_score: number | null;
  usage: UsageSummary;
}

export interface RosterRow {
  participant: User;
  completion_percent: number;
  completed_modules: number;
  job_applications: number;
  pbas_points: number;
  last_login: string | null;
  risk: "on_track" | "watch" | "at_risk";
}

export interface CoachParticipantDetail {
  participant: User;
  completion_percent: number;
  progress: ParticipantProgress[];
  modules: TrainingModule[];
  job_logs: JobSearchLog[];
  resumes: Resume[];
  interviews: InterviewSession[];
  notes: CaseNote[];
  certificates: Certificate[];
  pbas_points: number;
  usage: UsageSummary;
}

export interface NameCount {
  name: string;
  value: number;
}

export interface AdminOverview {
  organization: Organization;
  total_participants: number;
  total_coaches: number;
  total_cohorts: number;
  average_completion: number;
  module_engagement: NameCount[];
  cohort_completion: NameCount[];
  users: User[];
  cohorts: Cohort[];
  coaches: User[];
  participant_seats_used: number;
  participant_seat_limit: number;
  coach_seats_used: number;
  coach_seat_limit: number;
  archived_participants: number;
  logo_max_bytes: number;
}
