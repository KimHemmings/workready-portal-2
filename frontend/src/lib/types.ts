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
  status: "active" | "inactive";
  coach_id: string | null;
  cohort_id: string | null;
  last_login: string | null;
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

export interface InterviewSession {
  id: string;
  participant_id: string;
  job_target: string;
  industry: string;
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
  pbas_points: number;
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
}
