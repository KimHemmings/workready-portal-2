// ==========================================
// ORIGINAL WORKREADY APP TYPES (STRICT SAFE)
// ==========================================

export type Role = 'candidate' | 'coach' | 'owner' | 'sales' | 'admin' | 'participant';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  organizationId?: string;
  organization_id?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issueDate?: string;
  issued_at: string;
  issuer?: string;
  credentialUrl?: string;
  recipientName?: string;
  kind: string;
  organization_logo: string;
  organization_name: string;
  participant_name: string;
  subtitle: string;
  score: number;
  certificate_id: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  branding_logo?: string;
}

export interface InviteResult {
  success: boolean;
  message?: string;
  invite_path: string;
  user: User;
  welcome_message: string;
}

export interface ResetPasswordResult {
  success: boolean;
  message?: string;
  name: string;
  email: string;
  temporary_password: string;
}

export interface RoleSwitchTarget {
  role: Role;
  label: string;
  user: User;
}

export interface InviteEmailResult {
  success: boolean;
  message?: string;
  status: string;
  recipient: string;
  detail: string;
  subject: string;
  body: string;
  mailto_url: string;
  invite_url: string;
}

export interface UsageMetric {
  name: string;
  value: number;
  limit: number;
  remaining: number;
  kind: string;
  granted_extra: number;
}

export interface EvidenceRow {
  id: string;
  type: string;
  title: string;
  date: string;
  status: string;
  learner_name: string;
  learner_id: string;
  organization_name?: string;
  has_file?: boolean;
  log?: any;
}

export interface EvidenceSummary {
  totalSubmitted: number;
  approved: number;
  pending: number;
  rows?: EvidenceRow[];
  flagged?: number;
  with_file?: number;
}

export interface JobSearchLog {
  id: string;
  jobTitle: string;
  company: string;
  dateApplied: string;
  status: string;
  review_status: string;
  review_note: string;
  points: number;
  application_date: string;
  employer_name: string;
  position_title: string;
  application_type: string;
  evidence_size: string;
  evidence_filename: string;
}

export type InterviewMode = 'practice' | 'mock' | 'assessment' | 'standard' | 'llnd';

export interface InterviewSession {
  id: string;
  title: string;
  date: string;
  score?: number;
  job_target: string;
  feedback_summary_json: any;
  industry: string;
  created_at: string;
  overall_score: number;
  transcript_json: any;
  questions: any;
  finished: boolean;
  mode: InterviewMode;
  current_index: number;
}

export interface UsageSummary {
  creditsUsed: number;
  creditsRemaining: number;
  interviews: any;
  job_logs: any;
  resumes: any;
  cover_letters: any;
}

export interface ParticipantProgress {
  moduleId: string;
  module_id: string;
  completed: boolean;
  score?: number;
  status: string;
  quiz_score: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: string;
  estimated_minutes: number;
}

export interface ModuleDetail {
  id: string;
  title: string;
  content: string;
  progress?: any;
  module?: any;
  quiz?: any;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  new_certificates: any[];
  results: any[];
  certificate_earned: boolean;
  correct: number;
  total: number;
}

export interface InvitePreview {
  email: string;
  role: Role;
  already_completed: boolean;
  name: string;
  organization_name: string;
}

export interface Resume {
  id: string;
  title: string;
  lastUpdated: string;
  generated_markdown: string;
  cover_letter_markdown: string;
  created_at: string;
}

// ==========================================
// SHARED PORTAL DATA STORE TYPES
// ==========================================

export interface FivePillars {
  jobSearch: number;
  interviewReadiness: number;
  technicalSkills: number;
  logistics: number;
  mindset: number;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'On Track' | 'Compliant' | 'High Risk' | 'Blocked' | 'Needs Support';
  pbasTarget: number;
  pbasVerified: number;
  pbasPending: number;
  startDate: string;
  finishDate: string;
  assessmentCompleted: boolean;
  primaryChallenge: string;
  lastCheckIn: string;
  fivePillars: FivePillars;
}

export interface VerificationItem {
  id: string;
  candidateId: string;
  candidateName: string;
  activityType: 'Job Placement' | 'Interview' | 'Job Search' | 'LMS Module' | 'Credential Upload' | 'Support Request';
  title: string;
  refId: string;
  points: number;
  evidenceUrl?: string;
  evidenceFileName?: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Declined';
  dateSubmitted: string;
  isPriority?: boolean;
}

export interface Appointment {
  id: string;
  candidateId: string;
  candidateName: string;
  title: string;
  type: 'Virtual / Online' | 'In-Person' | 'Phone Call';
  hostName: string;
  date: string;
  time: string;
  createdBy: 'case_manager' | 'candidate';
}

export interface DocumentCredential {
  id: string;
  candidateId: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedDate: string;
  status: 'Verified' | 'Pending Review';
  downloadUrl: string;
}