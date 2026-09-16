// ==========================================
// ORIGINAL WORKREADY APP TYPES
// ==========================================

export type Role = 'candidate' | 'coach' | 'owner' | 'sales' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  organizationId?: string;
  createdAt?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issueDate: string;
  issuer: string;
  credentialUrl?: string;
  recipientName?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface InviteResult {
  success: boolean;
  message?: string;
}

export interface ResetPasswordResult {
  success: boolean;
  message?: string;
}

export interface RoleSwitchTarget {
  role: Role;
  label: string;
}

export interface InviteEmailResult {
  success: boolean;
  message?: string;
}

export interface UsageMetric {
  name: string;
  value: number;
  limit: number;
}

export interface EvidenceRow {
  id: string;
  type: string;
  title: string;
  date: string;
  status: string;
}

export interface EvidenceSummary {
  totalSubmitted: number;
  approved: number;
  pending: number;
}

export interface JobSearchLog {
  id: string;
  jobTitle: string;
  company: string;
  dateApplied: string;
  status: string;
}

export type InterviewMode = 'practice' | 'mock' | 'assessment';

export interface InterviewSession {
  id: string;
  title: string;
  date: string;
  score?: number;
}

export interface UsageSummary {
  creditsUsed: number;
  creditsRemaining: number;
}

export interface ParticipantProgress {
  moduleId: string;
  completed: boolean;
  score?: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
}

export interface ModuleDetail {
  id: string;
  title: string;
  content: string;
}

export interface QuizResult {
  score: number;
  passed: boolean;
}

export interface InvitePreview {
  email: string;
  role: Role;
}

export interface Resume {
  id: string;
  title: string;
  lastUpdated: string;
}

// ==========================================
// NEW SHARED PORTAL DATA STORE TYPES
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