import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CandidateProfile, VerificationItem, Appointment, DocumentCredential } from '../lib/types';

interface PortalContextType {
  candidates: CandidateProfile[];
  verificationItems: VerificationItem[];
  appointments: Appointment[];
  credentials: DocumentCredential[];
  approveVerification: (id: string) => void;
  declineVerification: (id: string, reason?: string) => void;
  addCandidate: (newCandidate: Omit<CandidateProfile, 'id' | 'pbasVerified' | 'pbasPending' | 'assessmentCompleted' | 'lastCheckIn' | 'fivePillars'>) => void;
  updateCandidateRequirements: (candidateId: string, targetPoints: number, startDate: string, finishDate: string) => void;
  logJobSearch: (candidateId: string, candidateName: string, jobTitle: string, employer: string, refId: string) => void;
  submitMilestone: (candidateId: string, candidateName: string, type: 'Job Placement' | 'Interview', title: string, points: number) => void;
  scheduleAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  submitSelfAssessment: (candidateId: string, pillars: CandidateProfile['fivePillars'], challenge: string) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([
    {
      id: 'cand-1',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      phone: '0412 345 678',
      status: 'On Track',
      pbasTarget: 100,
      pbasVerified: 35,
      pbasPending: 15,
      startDate: '01/09/2026',
      finishDate: '30/09/2026',
      assessmentCompleted: false,
      primaryChallenge: 'Resume / Applications',
      lastCheckIn: '14/09/2026',
      fivePillars: { jobSearch: 3, interviewReadiness: 3, technicalSkills: 3, logistics: 3, mindset: 3 },
    },
    {
      id: 'cand-2',
      name: 'Sarah Smith',
      email: 'sarah.s@example.com',
      phone: '0498 765 432',
      status: 'Compliant',
      pbasTarget: 100,
      pbasVerified: 85,
      pbasPending: 20,
      startDate: '01/09/2026',
      finishDate: '30/09/2026',
      assessmentCompleted: true,
      primaryChallenge: 'No Major Blockers',
      lastCheckIn: '12/09/2026',
      fivePillars: { jobSearch: 4, interviewReadiness: 5, technicalSkills: 4, logistics: 4, mindset: 5 },
    },
  ]);

  const [verificationItems, setVerificationItems] = useState<VerificationItem[]>([
    {
      id: 'ver-1',
      candidateId: 'cand-1',
      candidateName: 'Alex Johnson',
      activityType: 'Job Search',
      title: 'Warehouse Assistant — Logistics Co',
      refId: 'JOB-98231',
      points: 5,
      status: 'Pending',
      dateSubmitted: '14/09/2026',
      evidenceFileName: 'Job_Application_Receipt_98231.pdf',
    },
    {
      id: 'ver-2',
      candidateId: 'cand-1',
      candidateName: 'Alex Johnson',
      activityType: 'Interview',
      title: 'Barista / All-Rounder — Star Hospitality',
      refId: 'INT-8821',
      points: 25,
      status: 'Pending',
      dateSubmitted: '15/09/2026',
      evidenceFileName: 'Interview_Confirmation_Email.pdf',
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      candidateId: 'cand-1',
      candidateName: 'Alex Johnson',
      title: 'Bi-Weekly Mutual Obligation Catch-Up',
      type: 'Virtual / Online',
      hostName: 'Casey Smith (Case Manager)',
      date: '18/09/2026',
      time: '10:30 AM',
      createdBy: 'case_manager',
    },
  ]);

  const [credentials] = useState<DocumentCredential[]>([
    {
      id: 'doc-1',
      candidateId: 'cand-1',
      title: 'White Card (WHS)',
      fileName: 'Construction_WhiteCard_AlexJ.pdf',
      fileSize: '1.2 MB',
      uploadedDate: '12/08/2026',
      status: 'Verified',
      downloadUrl: '#',
    },
    {
      id: 'doc-2',
      candidateId: 'cand-1',
      title: 'National Police Check',
      fileName: 'Police_Check_2026_Pending.pdf',
      fileSize: '840 KB',
      uploadedDate: '10/09/2026',
      status: 'Pending Review',
      downloadUrl: '#',
    },
  ]);

  const approveVerification = (id: string) => {
    setVerificationItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          setCandidates((cPrev) =>
            cPrev.map((c) =>
              c.id === item.candidateId
                ? {
                    ...c,
                    pbasVerified: c.pbasVerified + item.points,
                    pbasPending: Math.max(0, c.pbasPending - item.points),
                  }
                : c
            )
          );
          return { ...item, status: 'Approved' };
        }
        return item;
      })
    );
  };

  const declineVerification = (id: string, reason?: string) => {
    setVerificationItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          setCandidates((cPrev) =>
            cPrev.map((c) =>
              c.id === item.candidateId
                ? { ...c, pbasPending: Math.max(0, c.pbasPending - item.points) }
                : c
            )
          );
          return { ...item, status: 'Declined', notes: reason };
        }
        return item;
      })
    );
  };

  const addCandidate = (newCand: Omit<CandidateProfile, 'id' | 'pbasVerified' | 'pbasPending' | 'assessmentCompleted' | 'lastCheckIn' | 'fivePillars'>) => {
    const created: CandidateProfile = {
      ...newCand,
      id: `cand-${Date.now()}`,
      pbasVerified: 0,
      pbasPending: 0,
      assessmentCompleted: false,
      lastCheckIn: new Date().toLocaleDateString('en-GB'),
      fivePillars: { jobSearch: 3, interviewReadiness: 3, technicalSkills: 3, logistics: 3, mindset: 3 },
    };
    setCandidates((prev) => [...prev, created]);
  };

  const updateCandidateRequirements = (candidateId: string, targetPoints: number, startDate: string, finishDate: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              pbasTarget: targetPoints,
              startDate,
              finishDate,
              assessmentCompleted: c.startDate !== startDate ? false : c.assessmentCompleted,
            }
          : c
      )
    );
  };

  const logJobSearch = (candidateId: string, candidateName: string, jobTitle: string, employer: string, refId: string) => {
    const newItem: VerificationItem = {
      id: `ver-${Date.now()}`,
      candidateId,
      candidateName,
      activityType: 'Job Search',
      title: `${jobTitle} — ${employer}`,
      refId,
      points: 5,
      status: 'Pending',
      dateSubmitted: new Date().toLocaleDateString('en-GB'),
    };
    setVerificationItems((prev) => [newItem, ...prev]);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, pbasPending: c.pbasPending + 5 } : c))
    );
  };

  const submitMilestone = (candidateId: string, candidateName: string, type: 'Job Placement' | 'Interview', title: string, points: number) => {
    const newItem: VerificationItem = {
      id: `ver-${Date.now()}`,
      candidateId,
      candidateName,
      activityType: type,
      title,
      refId: `${type === 'Job Placement' ? 'JOB' : 'INT'}-${Math.floor(1000 + Math.random() * 9000)}`,
      points,
      status: 'Pending',
      dateSubmitted: new Date().toLocaleDateString('en-GB'),
      isPriority: true,
    };
    setVerificationItems((prev) => [newItem, ...prev]);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, pbasPending: c.pbasPending + points } : c))
    );
  };

  const scheduleAppointment = (apt: Omit<Appointment, 'id'>) => {
    setAppointments((prev) => [{ ...apt, id: `apt-${Date.now()}` }, ...prev]);
  };

  const submitSelfAssessment = (candidateId: string, pillars: CandidateProfile['fivePillars'], challenge: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              fivePillars: pillars,
              primaryChallenge: challenge,
              assessmentCompleted: true,
              pbasVerified: c.pbasVerified + 10,
            }
          : c
      )
    );
  };

  return (
    <PortalContext.Provider
      value={{
        candidates,
        verificationItems,
        appointments,
        credentials,
        approveVerification,
        declineVerification,
        addCandidate,
        updateCandidateRequirements,
        logJobSearch,
        submitMilestone,
        scheduleAppointment,
        submitSelfAssessment,
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