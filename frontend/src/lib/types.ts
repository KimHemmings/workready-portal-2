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