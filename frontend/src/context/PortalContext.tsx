import React, { createContext, useContext, useState } from 'react';
import type { CandidateProfile, VerificationItem, Appointment, DocumentCredential } from '../lib/types';

export interface PortalContextType {
  candidates: CandidateProfile[];
  verificationItems: VerificationItem[];
  appointments: Appointment[];
  documentCredentials: DocumentCredential[];
  addCandidate: (candidate: Omit<CandidateProfile, 'id' | 'pbasVerified' | 'pbasPending' | 'assessmentCompleted' | 'lastCheckIn' | 'fivePillars'> & Partial<CandidateProfile>) => void;
  addVerificationItem: (item: Omit<VerificationItem, 'id' | 'dateSubmitted' | 'status'>) => void;
  approveVerification: (id: string, note?: string) => void;
  declineVerification: (id: string, note?: string) => void;
  updateVerificationStatus: (id: string, status: 'Approved' | 'Declined', note?: string) => void;
  updateCandidateRequirements: (
    candidateId: string,
    targetOrUpdates?: number | Partial<CandidateProfile>,
    startDate?: string,
    finishDate?: string
  ) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateFivePillars: (candidateId: string, pillars: CandidateProfile['fivePillars']) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([
    {
      id: 'CAN-101',
      name: 'Alex Mercer',
      email: 'alex@workready.com',
      phone: '0412 345 678',
      status: 'High Risk',
      pbasTarget: 100,
      pbasVerified: 45,
      pbasPending: 25,
      startDate: '2026-01-15',
      finishDate: '2026-07-15',
      assessmentCompleted: true,
      primaryChallenge: 'Transport & Interview Anxiety',
      lastCheckIn: '2026-03-10',
      fivePillars: {
        jobSearch: 60,
        interviewReadiness: 40,
        technicalSkills: 75,
        logistics: 35,
        mindset: 50,
      },
    },
  ]);

  const [verificationItems, setVerificationItems] = useState<VerificationItem[]>([
    {
      id: 'VER-901',
      candidateId: 'CAN-101',
      candidateName: 'Alex Mercer',
      activityType: 'Job Placement',
      title: 'Full-Time Warehouse Assistant Claim',
      refId: 'EMP-882190',
      points: 50,
      notes: 'Signed contract attached. Commencing next Monday.',
      status: 'Pending',
      dateSubmitted: '2026-03-14',
      isPriority: true,
      evidenceFileName: 'Alex_Mercer_Offer_Letter.pdf',
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'APP-301',
      candidateId: 'CAN-101',
      candidateName: 'Alex Mercer',
      title: 'Fortnightly Mutual Obligation Review',
      type: 'In-Person',
      hostName: 'Casey (Case Manager)',
      date: '2026-03-20',
      time: '10:30 AM',
      createdBy: 'case_manager',
    },
  ]);

  const [documentCredentials, setDocumentCredentials] = useState<DocumentCredential[]>([
    {
      id: 'DOC-501',
      candidateId: 'CAN-101',
      title: 'Forklift Licence (TLILIC0003)',
      fileName: 'Forklift_Licence_AlexMercer.pdf',
      fileSize: '1.2 MB',
      uploadedDate: '2026-02-10',
      status: 'Verified',
      downloadUrl: '#',
    },
  ]);

  const addCandidate: PortalContextType['addCandidate'] = (candidateInput) => {
    const newCandidate: CandidateProfile = {
      id: candidateInput.id || `CAN-${Math.floor(100 + Math.random() * 900)}`,
      name: candidateInput.name,
      email: candidateInput.email,
      phone: candidateInput.phone,
      status: candidateInput.status,
      pbasTarget: candidateInput.pbasTarget,
      pbasVerified: candidateInput.pbasVerified ?? 0,
      pbasPending: candidateInput.pbasPending ?? 0,
      startDate: candidateInput.startDate,
      finishDate: candidateInput.finishDate,
      assessmentCompleted: candidateInput.assessmentCompleted ?? false,
      primaryChallenge: candidateInput.primaryChallenge,
      lastCheckIn: candidateInput.lastCheckIn ?? new Date().toISOString().split('T')[0],
      fivePillars: candidateInput.fivePillars ?? {
        jobSearch: 50,
        interviewReadiness: 50,
        technicalSkills: 50,
        logistics: 50,
        mindset: 50,
      },
    };
    setCandidates((prev) => [...prev, newCandidate]);
  };

  const addVerificationItem = (item: Omit<VerificationItem, 'id' | 'dateSubmitted' | 'status'>) => {
    const newItem: VerificationItem = {
      ...item,
      id: `VER-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      dateSubmitted: new Date().toISOString().split('T')[0],
    };
    setVerificationItems((prev) => [newItem, ...prev]);

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === item.candidateId
          ? { ...c, pbasPending: c.pbasPending + item.points }
          : c
      )
    );
  };

  const updateVerificationStatus = (id: string, status: 'Approved' | 'Declined', note?: string) => {
    setVerificationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, notes: note || item.notes } : item))
    );

    const targetItem = verificationItems.find((i) => i.id === id);
    if (targetItem && status === 'Approved') {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === targetItem.candidateId
            ? {
                ...c,
                pbasVerified: c.pbasVerified + targetItem.points,
                pbasPending: Math.max(0, c.pbasPending - targetItem.points),
              }
            : c
        )
      );
    }
  };

  const approveVerification = (id: string, note?: string) => updateVerificationStatus(id, 'Approved', note);
  const declineVerification = (id: string, note?: string) => updateVerificationStatus(id, 'Declined', note);

  const updateCandidateRequirements = (
    candidateId: string,
    targetOrUpdates?: number | Partial<CandidateProfile>,
    startDate?: string,
    finishDate?: string
  ) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        if (typeof targetOrUpdates === 'number') {
          return {
            ...c,
            pbasTarget: targetOrUpdates,
            startDate: startDate || c.startDate,
            finishDate: finishDate || c.finishDate,
          };
        }
        return { ...c, ...targetOrUpdates };
      })
    );
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newApp: Appointment = {
      ...appointment,
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setAppointments((prev) => [...prev, newApp]);
  };

  const updateFivePillars = (candidateId: string, pillars: CandidateProfile['fivePillars']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, fivePillars: pillars } : c))
    );
  };

  return (
    <PortalContext.Provider
      value={{
        candidates,
        verificationItems,
        appointments,
        documentCredentials,
        addCandidate,
        addVerificationItem,
        approveVerification,
        declineVerification,
        updateVerificationStatus,
        updateCandidateRequirements,
        addAppointment,
        updateFivePillars,
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