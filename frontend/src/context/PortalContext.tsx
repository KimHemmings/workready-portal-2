import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ==========================================
// 1. COMPREHENSIVE INTERFACES & EXPORTS
// ==========================================

export interface FivePillars {
  resume: number;
  interview: number;
  whs: number;
  digital: number;
  careerPlan: number;
  // Backward compatibility keys for OwnerDashboard
  jobSearch?: number;
  skills?: number;
  logistics?: number;
  mindset?: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'On Track' | 'Medium Risk' | 'High Risk' | 'Exempt';
  pbasTarget: number;
  pbasVerified: number;
  pbasEarned: number;
  pbasPending: number;
  verifiedPoints?: number;
  points?: number;
  startDate: string;
  finishDate: string;
  primaryChallenge: string;
  assignedCaseManager: 'Casey Smith' | 'Jordan Vance' | 'Sam Taylor';
  fivePillars: FivePillars;
  
  // Direct Pillar Accessors for OwnerDashboard
  jobSearch?: number;
  interview?: number;
  skills?: number;
  logistics?: number;
  mindset?: number;
  resume?: number;
  whs?: number;
  digital?: number;
  careerPlan?: number;

  assessmentCompleted: boolean;
  lastCheckIn?: string;
  waId?: string;
  contractFramework?: 'Workforce Australia' | 'Inclusive Employment Australia (IEA)' | 'DES' | 'TtW' | 'RTO';
  programType?: 'workforce_australia' | '(IEA)' | 'ttw' | 'rto_graduate'; // Added to resolve TS2339
  licenseePartnerName?: string;
  starRunsCompleted?: number;
}

// Backward compatibility alias for OwnerDashboard.tsx / CaseManager.tsx
export type CandidateProfile = Candidate;

export interface VerificationItem {
  id: string;
  candidateId: string;
  candidateName: string;
  type: 'STAR Interview' | 'LMS Micro-credential' | 'Job Placement' | 'Interview Claim' | 'Job Search';
  title: string;
  submittedDate: string;
  points: number;
  status: 'Pending' | 'Verified' | 'Rejected';
  details?: string;
  employer?: string;
  role?: string;
  payRate?: string;
  startDate?: string;
  retentionExpiryDate: string; // ISO / Date + 36 Months DEWR Stamp
}

export interface SupportMessage {
  id: string;
  candidateId: string;
  candidateName: string;
  topic: string;
  message: string;
  date: string;
  status: 'Unread' | 'Responded';
  coachingResponse?: string;
  senderRole?: 'Case Manager' | 'Candidate';
}

export interface OutcomeClaim {
  id: string;
  candidateId: string;
  candidateName: string;
  type: 'Job Placement' | 'Interview';
  employer: string;
  role: string;
  hourlyRate?: string;
  payRate?: string;
  startDate?: string;
  date: string;
  points: number;
  status: 'Pending Verification' | 'Verified' | 'Rejected';
}

// Backward compatibility alias
export type CandidateClaim = OutcomeClaim;

interface PortalContextType {
  // Global App Controls & Sandbox
  activeContract: 'Workforce Australia' | 'Inclusive Employment Australia (IEA)' | 'DES' | 'TtW' | 'RTO';
  setActiveContract: (contract: 'Workforce Australia' | 'Inclusive Employment Australia (IEA)' | 'DES' | 'TtW' | 'RTO') => void;
  activeRole: 'Candidate' | 'Case Manager' | 'Business Manager' | 'Sales Partner' | 'System Admin';
  setActiveRole: (role: 'Candidate' | 'Case Manager' | 'Business Manager' | 'Sales Partner' | 'System Admin') => void;
  selectedStaff: string;
  setSelectedStaff: (staff: string) => void;
  resetSandboxState: () => void;

  // Candidates Data
  candidates: Candidate[];
  activeCandidate: Candidate | null;
  setActiveCandidate: (candidate: Candidate | null) => void;
  addCandidate: (candidate: any) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  updateCandidatePbas: (candidateId: string, pointsEarned: number, pointsPending: number) => void;

  // Verification Queue
  verificationItems: VerificationItem[];
  addVerificationItem: (item: Omit<VerificationItem, 'id' | 'submittedDate' | 'retentionExpiryDate'>) => void;
  updateVerificationStatus: (id: string, status: 'Verified' | 'Rejected', note?: string) => void;
  undoVerificationStatus: (id: string) => void;

  // Support Inbox & Coaching Loop
  supportMessages: SupportMessage[];
  addSupportMessage: (msg: Omit<SupportMessage, 'id' | 'date' | 'status'>) => void;
  respondToMessage: (id: string, response: string) => void;

  // Outcome Claims
  outcomeClaims: OutcomeClaim[];
  candidateClaims: OutcomeClaim[]; // Alias for candidate portal
  addOutcomeClaim: (claim: Omit<OutcomeClaim, 'id' | 'date' | 'status'>) => void;
  submitCandidateClaim: (claim: Omit<OutcomeClaim, 'id' | 'date' | 'status'>) => void;
  verifyOutcomeClaim: (id: string) => void;
  rejectOutcomeClaim: (id: string) => void;
}

// ==========================================
// 2. HELPER UTILITIES
// ==========================================

const getThreeYearRetentionDate = (): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + 36);
  return d.toISOString().split('T')[0];
};

// ==========================================
// 3. INITIAL SEED DATA
// ==========================================

const initialCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Alex Mercer',
    email: 'alex.mercer@workready.com',
    phone: '0412 345 678',
    status: 'On Track',
    pbasTarget: 100,
    pbasVerified: 45,
    pbasEarned: 45,
    pbasPending: 25,
    verifiedPoints: 45,
    points: 45,
    waId: 'WA-882190',
    startDate: '2026-01-10',
    finishDate: '2026-12-31',
    primaryChallenge: 'Interview Preparation',
    assignedCaseManager: 'Casey Smith',
    fivePillars: { resume: 85, interview: 88, whs: 100, digital: 90, careerPlan: 75, jobSearch: 85, skills: 88, logistics: 90, mindset: 80 },
    jobSearch: 85,
    interview: 88,
    skills: 88,
    logistics: 90,
    mindset: 80,
    resume: 85,
    whs: 100,
    digital: 90,
    careerPlan: 75,
    assessmentCompleted: true,
    lastCheckIn: '2026-10-02',
    contractFramework: 'Workforce Australia',
    starRunsCompleted: 0,
  },
  {
    id: 'c2',
    name: 'Jordan Smith',
    email: 'jordan.smith@workready.com',
    phone: '0423 456 789',
    status: 'On Track',
    pbasTarget: 80,
    pbasVerified: 60,
    pbasEarned: 60,
    pbasPending: 10,
    verifiedPoints: 60,
    points: 60,
    waId: 'WA-904112',
    startDate: '2026-02-01',
    finishDate: '2026-12-31',
    primaryChallenge: 'Resume Enhancement',
    assignedCaseManager: 'Casey Smith',
    fivePillars: { resume: 60, interview: 70, whs: 80, digital: 65, careerPlan: 50, jobSearch: 60, skills: 70, logistics: 80, mindset: 65 },
    jobSearch: 60,
    interview: 70,
    skills: 70,
    logistics: 80,
    mindset: 65,
    resume: 60,
    whs: 80,
    digital: 65,
    careerPlan: 50,
    assessmentCompleted: true,
    lastCheckIn: '2026-09-28',
    contractFramework: 'Inclusive Employment Australia (IEA)',
    starRunsCompleted: 1,
  },
  {
    id: 'c3',
    name: 'Sam Taylor',
    email: 'sam.taylor@workready.com',
    phone: '0434 567 890',
    status: 'High Risk',
    pbasTarget: 100,
    pbasVerified: 15,
    pbasEarned: 15,
    pbasPending: 0,
    verifiedPoints: 15,
    points: 15,
    waId: 'WA-712399',
    startDate: '2026-03-15',
    finishDate: '2026-12-31',
    primaryChallenge: 'WHS Safety Compliance',
    assignedCaseManager: 'Casey Smith',
    fivePillars: { resume: 40, interview: 50, whs: 60, digital: 45, careerPlan: 30, jobSearch: 40, skills: 50, logistics: 60, mindset: 45 },
    jobSearch: 40,
    interview: 50,
    skills: 50,
    logistics: 60,
    mindset: 45,
    resume: 40,
    whs: 60,
    digital: 45,
    careerPlan: 30,
    assessmentCompleted: false,
    lastCheckIn: '2026-09-15',
    contractFramework: 'TtW',
    starRunsCompleted: 0,
  },
  {
    id: 'c4',
    name: 'Sally Fields',
    email: 'sally.fields@workready.com',
    phone: '0445 678 901',
    status: 'On Track',
    pbasTarget: 100,
    pbasVerified: 50,
    pbasEarned: 50,
    pbasPending: 25,
    verifiedPoints: 50,
    points: 50,
    waId: 'WA-882590',
    startDate: '2026-01-20',
    finishDate: '2026-12-31',
    primaryChallenge: 'Job Search Activity',
    assignedCaseManager: 'Jordan Vance',
    fivePillars: { resume: 70, interview: 75, whs: 85, digital: 80, careerPlan: 65, jobSearch: 70, skills: 75, logistics: 85, mindset: 80 },
    jobSearch: 70,
    interview: 75,
    skills: 75,
    logistics: 85,
    mindset: 80,
    resume: 70,
    whs: 85,
    digital: 80,
    careerPlan: 65,
    assessmentCompleted: true,
    lastCheckIn: '2026-09-30',
    contractFramework: 'Workforce Australia',
    starRunsCompleted: 2,
  },
  {
    id: 'c5',
    name: 'Tom Sawyer',
    email: 'tom.sawyer@workready.com',
    phone: '0456 789 012',
    status: 'On Track',
    pbasTarget: 100,
    pbasVerified: 35,
    pbasEarned: 35,
    pbasPending: 10,
    verifiedPoints: 35,
    points: 35,
    waId: 'WA-882490',
    startDate: '2026-02-10',
    finishDate: '2026-12-31',
    primaryChallenge: 'Confidence Building',
    assignedCaseManager: 'Sam Taylor',
    fivePillars: { resume: 65, interview: 60, whs: 90, digital: 70, careerPlan: 60, jobSearch: 65, skills: 60, logistics: 90, mindset: 70 },
    jobSearch: 65,
    interview: 60,
    skills: 60,
    logistics: 90,
    mindset: 70,
    resume: 65,
    whs: 90,
    digital: 70,
    careerPlan: 60,
    assessmentCompleted: true,
    lastCheckIn: '2026-10-01',
    contractFramework: 'RTO',
    starRunsCompleted: 0,
  },
];

const initialVerificationItems: VerificationItem[] = [
  {
    id: 'ver-101',
    candidateId: 'c1',
    candidateName: 'Alex Mercer',
    type: 'STAR Interview',
    title: 'STAR Practice Run - Customer Conflict Resolution',
    submittedDate: '2026-10-03',
    points: 25,
    status: 'Pending',
    details: 'STAR Rubric Score: 88%. Effective Situation and Action breakdown.',
    retentionExpiryDate: getThreeYearRetentionDate(),
  },
  {
    id: 'ver-102',
    candidateId: 'c1',
    candidateName: 'Alex Mercer',
    type: 'LMS Micro-credential',
    title: 'WHS Essentials & Workplace Safety Certification',
    submittedDate: '2026-10-01',
    points: 10,
    status: 'Verified',
    details: 'Passed with 100% score on safety protocols.',
    retentionExpiryDate: getThreeYearRetentionDate(),
  },
];

// ==========================================
// 4. CONTEXT PROVIDER COMPONENT
// ==========================================

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeContract, setActiveContract] = useState<'Workforce Australia' | 'Inclusive Employment Australia (IEA)' | 'DES' | 'TtW' | 'RTO'>('Workforce Australia');
  const [activeRole, setActiveRole] = useState<'Candidate' | 'Case Manager' | 'Business Manager' | 'Sales Partner' | 'System Admin'>('Case Manager');
  const [selectedStaff, setSelectedStaff] = useState<string>('Casey Smith');

  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(initialCandidates[0]);

  const [verificationItems, setVerificationItems] = useState<VerificationItem[]>(initialVerificationItems);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    {
      id: 'msg-1',
      candidateId: 'c1',
      candidateName: 'Alex Mercer',
      topic: 'STAR Interview Practice Review',
      message: 'Hi Casey, I completed my Warehouse Role interview practice session. Can you review my WHS safety response?',
      date: new Date().toLocaleDateString('en-AU'),
      status: 'Unread',
    },
  ]);
  const [outcomeClaims, setOutcomeClaims] = useState<OutcomeClaim[]>([]);

  // Enhanced Demo Sandbox Reset Handler
  const resetSandboxState = () => {
    // 1. Wipe all local storage keys used across modules
    localStorage.removeItem('workready_completed_timestamps');
    localStorage.removeItem('workready_cm_audit_logs');
    localStorage.removeItem('workready_cm_is_away');
    localStorage.removeItem('workready_star_history');

    // 2. Reset queues & context states back to seed defaults
    setVerificationItems(initialVerificationItems);
    setOutcomeClaims([]);
    setSupportMessages([
      {
        id: 'msg-1',
        candidateId: 'c1',
        candidateName: 'Alex Mercer',
        topic: 'STAR Interview Practice Review',
        message: 'Hi Casey, I completed my Warehouse Role interview practice session. Can you review my WHS safety response?',
        date: new Date().toLocaleDateString('en-AU'),
        status: 'Responded',
        coachingResponse: 'Great effort Alex! Your WHS safety protocol response was clear and thorough. Approved +25 Pts.',
        senderRole: 'Case Manager'
      },
    ]);

    setCandidates(initialCandidates);
    setActiveCandidate(initialCandidates[0]);
    setActiveContract('Workforce Australia');
    setActiveRole('Candidate');

    // Trigger window event so components re-evaluate localStorage states
    window.dispatchEvent(new Event('moduleCompleted'));
    alert('🔄 Sandbox reset complete! Local storage cleared and initial seed data restored.');
  };

  // Update Candidate PBAS Points Helper
  const updateCandidatePbas = (candidateId: string, pointsEarned: number, pointsPending: number) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const newVerified = Math.max(0, c.pbasVerified + pointsEarned);
          return {
            ...c,
            pbasVerified: newVerified,
            pbasEarned: newVerified,
            verifiedPoints: newVerified,
            points: newVerified,
            pbasPending: Math.max(0, c.pbasPending + pointsPending),
          };
        }
        return c;
      })
    );
  };

  const addCandidate = (newCand: any) => {
    const candidate: Candidate = {
      id: newCand.id || `c${candidates.length + 1}`,
      name: newCand.name || 'New Candidate',
      email: newCand.email || 'candidate@workready.com',
      phone: newCand.phone || '0400 000 000',
      status: newCand.status || 'On Track',
      pbasTarget: newCand.pbasTarget || 100,
      pbasVerified: newCand.pbasVerified || 0,
      pbasEarned: newCand.pbasEarned || newCand.pbasVerified || 0,
      pbasPending: newCand.pbasPending || 0,
      verifiedPoints: newCand.verifiedPoints || 0,
      points: newCand.points || newCand.pbasVerified || 0,
      waId: newCand.waId || `WA-${Math.floor(100000 + Math.random() * 900000)}`,
      startDate: newCand.startDate || new Date().toISOString().split('T')[0],
      finishDate: newCand.finishDate || '2026-12-31',
      primaryChallenge: newCand.primaryChallenge || 'General Support',
      assignedCaseManager: newCand.assignedCaseManager || 'Casey Smith',
      fivePillars: newCand.fivePillars || { resume: 50, interview: 50, whs: 50, digital: 50, careerPlan: 50, jobSearch: 50, skills: 50, logistics: 50, mindset: 50 },
      jobSearch: newCand.jobSearch || 50,
      interview: newCand.interview || 50,
      skills: newCand.skills || 50,
      logistics: newCand.logistics || 50,
      mindset: newCand.mindset || 50,
      resume: newCand.resume || 50,
      whs: newCand.whs || 50,
      digital: newCand.digital || 50,
      careerPlan: newCand.careerPlan || 50,
      assessmentCompleted: newCand.assessmentCompleted ?? false,
      contractFramework: newCand.contractFramework || activeContract,
      starRunsCompleted: 0,
    };
    setCandidates((prev) => [...prev, candidate]);
  };

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  // Verification Queue Handlers
  const addVerificationItem = (item: Omit<VerificationItem, 'id' | 'submittedDate' | 'retentionExpiryDate'>) => {
    const newItem: VerificationItem = {
      ...item,
      id: `ver-${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0],
      retentionExpiryDate: getThreeYearRetentionDate(),
    };
    setVerificationItems((prev) => [newItem, ...prev]);
  };

  const updateVerificationStatus = (id: string, status: 'Verified' | 'Rejected', note?: string) => {
    setVerificationItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (status === 'Verified' && item.status !== 'Verified') {
            updateCandidatePbas(item.candidateId, item.points, -item.points);
          }
          return { ...item, status, details: note ? `${item.details || ''} | Note: ${note}` : item.details };
        }
        return item;
      })
    );
  };

  const undoVerificationStatus = (id: string) => {
    setVerificationItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.status === 'Verified') {
            updateCandidatePbas(item.candidateId, -item.points, item.points);
          }
          return { ...item, status: 'Pending' };
        }
        return item;
      })
    );
  };

  // Support Messages Handlers
  const addSupportMessage = (msg: Omit<SupportMessage, 'id' | 'date' | 'status'>) => {
    const newMsg: SupportMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toLocaleDateString('en-AU'),
      status: 'Unread',
    };
    setSupportMessages((prev) => [newMsg, ...prev]);
  };

  const respondToMessage = (id: string, response: string) => {
    setSupportMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Responded', coachingResponse: response } : m))
    );
  };

  // Outcome Claims Handlers
  const addOutcomeClaim = (claim: Omit<OutcomeClaim, 'id' | 'date' | 'status'>) => {
    const newClaim: OutcomeClaim = {
      ...claim,
      id: `claim-${Date.now()}`,
      date: new Date().toLocaleDateString('en-AU'),
      status: 'Pending Verification',
    };
    setOutcomeClaims((prev) => [newClaim, ...prev]);

    // Push into verification queue for Case Manager 1-click verification
    addVerificationItem({
      candidateId: claim.candidateId,
      candidateName: claim.candidateName,
      type: claim.type === 'Job Placement' ? 'Job Placement' : 'Interview Claim',
      title: `${claim.type}: ${claim.role} at ${claim.employer}`,
      points: claim.points,
      status: 'Pending',
      employer: claim.employer,
      role: claim.role,
      payRate: claim.hourlyRate || claim.payRate,
      startDate: claim.startDate,
      details: `Submitted Outcome Claim: ${claim.type} at ${claim.employer} (${claim.role}).`,
    });
  };

  const verifyOutcomeClaim = (id: string) => {
    const claim = outcomeClaims.find((c) => c.id === id);
    if (claim) {
      setOutcomeClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Verified' } : c)));
      updateCandidatePbas(claim.candidateId, claim.points, 0);
    }
  };

  const rejectOutcomeClaim = (id: string) => {
    setOutcomeClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Rejected' } : c)));
  };

  return (
    <PortalContext.Provider
      value={{
        activeContract,
        setActiveContract,
        activeRole,
        setActiveRole,
        selectedStaff,
        setSelectedStaff,
        resetSandboxState,
        candidates,
        activeCandidate,
        setActiveCandidate,
        addCandidate,
        updateCandidate,
        updateCandidatePbas,
        verificationItems,
        addVerificationItem,
        updateVerificationStatus,
        undoVerificationStatus,
        supportMessages,
        addSupportMessage,
        respondToMessage,
        outcomeClaims,
        candidateClaims: outcomeClaims,
        addOutcomeClaim,
        submitCandidateClaim: addOutcomeClaim,
        verifyOutcomeClaim,
        rejectOutcomeClaim,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};