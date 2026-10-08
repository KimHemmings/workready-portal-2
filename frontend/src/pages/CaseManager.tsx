import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { EvidenceInspectorModal } from '../components/EvidenceInspectorModal';
import { 
  CheckCircle2, XCircle, Clock, Search, TrendingUp, RefreshCw, Eye, ShieldCheck,
  Check, UserPlus, Sliders, Users, MessageSquare, Download, Upload, Award, Send,
  FileSpreadsheet, Briefcase, BookOpen, BarChart3, FileText, Calendar, FolderLock,
  Plus, File, AlertTriangle, UserCheck, LogOut, Sparkles, X, RotateCcw, HelpCircle, LifeBuoy
} from 'lucide-react';

interface CandidateDisplay {
  id: string;
  name: string;
  waId: string;
  pbasTarget: number;
  verifiedPoints: number;
  status: 'On Track' | 'Action Needed' | 'Exempt';
  ownerStaff: string;
}

interface ActivityLog {
  id: string;
  type: 'Job Search' | 'Interview' | 'Job Placement' | 'LMS Module' | 'Confidence Review';
  title: string;
  reference: string;
  points: number;
  status: 'Pending Verification' | 'Verified' | 'Rejected';
  date: string;
  candidateId: string;
  candidateName: string;
  reportData?: any;
  employer?: string;
}

interface Appointment {
  id: string;
  candidateId: string;
  candidateName: string;
  type: string;
  date: string;
  time: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Rescheduled';
}

interface DocumentFile {
  id: string;
  candidateId: string;
  candidateName: string;
  name: string;
  category: 'Resume' | 'Cover Letter' | 'Compliance' | 'Provider Upload';
  uploadedBy: string;
  date: string;
  size: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  staffName: string;
  candidateName: string;
  action: string;
}

export const CaseManager: React.FC = () => {
  const { 
    candidates: contextCandidates, 
    verificationItems, 
    outcomeClaims, 
    supportMessages: contextMessages,
    activeContract,
    respondToMessage,
    verifyOutcomeClaim,
    rejectOutcomeClaim,
    updateVerificationStatus,
    undoVerificationStatus,
    updateCandidate
  } = usePortal();

  // Navigation & Scope
  const [activeTab, setActiveTab] = useState<'queue' | 'profile' | 'appointments' | 'documents' | 'communication' | 'auditLog'>('queue');
  const [caseloadScope, setCaseloadScope] = useState<'MyCaseload' | 'Coverage' | 'All'>('MyCaseload');
  const [cmStatus, setCmStatus] = useState<'Active' | 'Away'>('Active');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals visibility
  const [showObligationModal, setShowObligationModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [showSupportBmModal, setShowSupportBmModal] = useState(false);

  // Form States
  const [newTargetPoints, setNewTargetPoints] = useState<number>(100);
  const [newCandidateStatus, setNewCandidateStatus] = useState<'On Track' | 'Action Needed' | 'Exempt'>('On Track');
  const [exemptionNote, setExemptionNote] = useState('');

  const [aptType, setAptType] = useState('Monthly PBAS Progress Audit');
  const [aptDate, setAptDate] = useState('2026-10-20');
  const [aptTime, setAptTime] = useState('10:00 AM');
  const [aptLocation, setAptLocation] = useState('Provider Office (In-Person)');

  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<'Resume' | 'Cover Letter' | 'Compliance' | 'Provider Upload'>('Provider Upload');

  const [bmSupportTopic, setBmSupportTopic] = useState('PBAS Points Discrepancy');
  const [bmSupportMessage, setBmSupportMessage] = useState('');

  // Local Roster Mapping
  const [localCandidates, setLocalCandidates] = useState<CandidateDisplay[]>([
    { id: 'c1', name: 'Alex Mercer', waId: 'WA-882190', pbasTarget: 100, verifiedPoints: 45, status: 'On Track', ownerStaff: 'Casey Smith' },
    { id: 'c2', name: 'Jordan Smith', waId: 'WA-904112', pbasTarget: 80, verifiedPoints: 60, status: 'On Track', ownerStaff: 'Casey Smith' },
    { id: 'c3', name: 'Sam Taylor', waId: 'WA-712399', pbasTarget: 100, verifiedPoints: 15, status: 'Action Needed', ownerStaff: 'Casey Smith' },
    { id: 'c4', name: 'Sally Fields', waId: 'WA-882590', pbasTarget: 100, verifiedPoints: 50, status: 'On Track', ownerStaff: 'Jordan Vance' },
    { id: 'c5', name: 'Tom Sawyer', waId: 'WA-882490', pbasTarget: 100, verifiedPoints: 35, status: 'On Track', ownerStaff: 'Sam Taylor' }
  ]);

  useEffect(() => {
    if (contextCandidates && contextCandidates.length > 0) {
      setLocalCandidates((prev) => {
        return contextCandidates.map((c, idx) => {
          const existing = prev.find((p) => p.id === c.id);
          return {
            id: c.id || `c${idx + 1}`,
            name: c.name,
            waId: c.waId || `WA-${882190 + idx * 100}`,
            pbasTarget: c.pbasTarget || 100,
            verifiedPoints: c.pbasVerified || 35,
            status: (c.status === 'High Risk' ? 'Action Needed' : c.status === 'Exempt' ? 'Exempt' : 'On Track') as CandidateDisplay['status'],
            ownerStaff: c.assignedCaseManager || existing?.ownerStaff || (idx % 2 === 0 ? 'Casey Smith' : 'Jordan Vance')
          };
        });
      });
    }
  }, [contextCandidates]);

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('c1');

  // Filter Roster by Scope & Search
  const displayedCandidates = localCandidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.waId.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (caseloadScope === 'MyCaseload') return c.ownerStaff === 'Casey Smith';
    if (caseloadScope === 'Coverage') return c.ownerStaff !== 'Casey Smith';
    return true;
  });

  const activeCandidate = localCandidates.find((c) => c.id === selectedCandidateId) || displayedCandidates[0] || localCandidates[0];

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    { id: 'log-1', timestamp: '04/10/2026 09:15 AM', staffName: 'Casey Smith', candidateName: 'Alex Mercer', action: 'Verified LMS Module: WHS Fundamentals (+10 Pts)' }
  ]);

  const addAuditEntry = (actionStr: string) => {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-AU'),
      staffName: 'Casey Smith',
      candidateName: activeCandidate.name,
      action: actionStr
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Activities Queue
  const mappedActivities: ActivityLog[] = verificationItems.map((v) => ({
    id: v.id,
    type: v.type as any,
    title: v.title,
    reference: (v as any).reference || v.id,
    points: v.points,
    status: v.status === 'Verified' ? 'Verified' : v.status === 'Rejected' ? 'Rejected' : 'Pending Verification',
    date: v.submittedDate || '04/10/2026',
    candidateId: v.candidateId,
    candidateName: v.candidateName,
    employer: v.employer,
    reportData: {
      question: 'Describe a situation where you had to prioritize workplace safety.',
      situation: 'Busy loading dock during peak delivery hours.',
      task: 'Ensure pallets were stacked safely without blocking exit corridors.',
      action: 'Re-routed forklift traffic and instituted clear floor markers.',
      result: 'Zero incidents and 100% safety compliance during audit.'
    }
  }));

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'apt-1', candidateId: 'c1', candidateName: 'Alex Mercer', type: 'Monthly PBAS Progress Audit', date: '2026-10-15', time: '10:00 AM', location: 'Provider Office (In-Person)', status: 'Scheduled' }
  ]);

  const [documents, setDocuments] = useState<DocumentFile[]>([
    { id: 'doc-1', candidateId: 'c1', candidateName: 'Alex Mercer', name: 'Alex_Mercer_Resume_2026.pdf', category: 'Resume', uploadedBy: 'Alex Mercer', date: '12/09/2026', size: '1.2 MB' }
  ]);

  const [coachingInput, setCoachingInput] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Handlers
  const handleApprove = (id: string, points: number, candidateId: string) => {
    updateVerificationStatus(id, 'Verified');
    setLocalCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, verifiedPoints: Math.min(c.verifiedPoints + points, c.pbasTarget) } : c)));
    addAuditEntry(`Approved Evidence (+${points} Pts)`);
  };

  const handleReject = (id: string) => {
    updateVerificationStatus(id, 'Rejected');
    addAuditEntry(`Rejected Evidence Submission`);
  };

  const handleUndo = (id: string, points: number, candidateId: string) => {
    undoVerificationStatus(id);
    setLocalCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, verifiedPoints: Math.max(c.verifiedPoints - points, 0) } : c)));
    addAuditEntry(`Reversed Decision for Evidence`);
  };

  const handleSendCoachingNote = (msgId: string) => {
    if (!coachingInput.trim()) return;
    respondToMessage(msgId, coachingInput);
    addAuditEntry(`Sent Coaching Note response`);
    setCoachingInput('');
    alert('ðŸ“© Coaching Note sent to candidate dashboard!');
  };

  const handleSaveObligations = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalCandidates((prev) => prev.map((c) => c.id === activeCandidate.id ? { ...c, pbasTarget: newTargetPoints, status: newCandidateStatus } : c));
    updateCandidate(activeCandidate.id, { pbasTarget: newTargetPoints, status: newCandidateStatus as any });
    addAuditEntry(`Adjusted PBAS Obligations: Target set to ${newTargetPoints} Pts | Status: ${newCandidateStatus}`);
    setShowObligationModal(false);
    alert(`âš™ï¸ Obligations Updated! ${activeCandidate.name}'s target set to ${newTargetPoints} Pts.`);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      candidateId: activeCandidate.id,
      candidateName: activeCandidate.name,
      type: aptType,
      date: aptDate,
      time: aptTime,
      location: aptLocation,
      status: 'Scheduled'
    };
    setAppointments((prev) => [newApt, ...prev]);
    addAuditEntry(`Scheduled Appointment: ${aptType} on ${aptDate}`);
    setShowAppointmentModal(false);
    alert(`ðŸ“… Appointment scheduled for ${activeCandidate.name}!`);
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    const newDoc: DocumentFile = {
      id: `doc-${Date.now()}`,
      candidateId: activeCandidate.id,
      candidateName: activeCandidate.name,
      name: docName.trim(),
      category: docCategory,
      uploadedBy: 'Casey Smith (Case Manager)',
      date: new Date().toLocaleDateString('en-AU'),
      size: '1.4 MB'
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditEntry(`Uploaded Document: ${docName.trim()} (${docCategory})`);
    setDocName('');
    setShowDocUploadModal(false);
    alert(`ðŸ“¤ Document uploaded to ${activeCandidate.name}'s Locker!`);
  };

  const handleSendBmSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bmSupportMessage.trim()) return;
    addAuditEntry(`Escalated Support Ticket to Business Manager: ${bmSupportTopic}`);
    setBmSupportMessage('');
    setShowSupportBmModal(false);
    alert('ðŸ†˜ Support ticket dispatched directly to the Business Manager!');
  };

  const handleDownloadFullAuditPackage = () => {
    const retentionExpiry = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU');
    const headers = ['Candidate Name', 'WA ID', 'Evidence Type', 'Title', 'Ref ID', 'Points', 'Status', 'Retention Expiry'];
    const rows = mappedActivities.filter((a) => a.candidateId === activeCandidate.id).map((a) => [
      `"${a.candidateName}"`,
      `"${activeCandidate.waId}"`,
      `"${a.type}"`,
      `"${a.title}"`,
      `"${a.reference}"`,
      a.points,
      `"${a.status}"`,
      `"${retentionExpiry}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DEWR_PBAS_Full_Audit_Package_${activeCandidate.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addAuditEntry(`Exported Complete 3-Year DEWR Audit Evidence Package`);
  };

  const handleSignOut = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  // Dynamic Contract Header Text
  const getHeaderContractSubtitle = () => {
    switch (activeContract) {
      case 'TtW':
        return 'Transition to Work (TtW) â€¢ Youth Activation, Milestone & Readiness Hub';
      case 'RTO':
        return 'Vocational Education & RTO Hub â€¢ Competency Verification & Unit Tracking';
      case 'DES':
        return 'Disability Employment Services (DES) â€¢ Benchmark Hours & Capacity Support';
      default:
        return 'Workforce Australia & DES â€¢ Verification, Target Controls & Coverage Hub';
    }
  };

  const activeCandidateClaims = outcomeClaims.filter((cl) => cl.candidateId === activeCandidate.id && cl.status === 'Pending Verification');
  const myCaseloadCount = localCandidates.filter((c) => c.ownerStaff === 'Casey Smith').length;
  const coverageCount = localCandidates.filter((c) => c.ownerStaff !== 'Casey Smith').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* HEADER BAR */}
      <header className="bg-linear-to-r from-[#1e1b4b] via-[#24083b] to-[#1e1b4b] text-white px-6 py-4 border-b border-purple-900/50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Straight Up Training Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('logo.png')) {
                    target.src = '/White_Background_PNG.png';
                  } else {
                    target.onerror = null;
                    target.parentElement!.innerHTML = '<span class="font-extrabold text-purple-950 text-sm">SU</span>';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white">Straight Up Training</h1>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Case Manager Workspace
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                {getHeaderContractSubtitle()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowSupportBmModal(true)}
              className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 border border-rose-400/30 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <LifeBuoy className="w-3.5 h-3.5" /> ðŸ†˜ Platform Support to BM
            </button>

            <button
              onClick={() => setCmStatus(cmStatus === 'Active' ? 'Away' : 'Active')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                cmStatus === 'Active' ? 'bg-emerald-500 text-purple-950' : 'bg-amber-400 text-purple-950'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{cmStatus === 'Active' ? 'Active On-Duty' : 'Away (Coverage Mode)'}</span>
            </button>

            <button onClick={handleSignOut} className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* CASELOAD SCOPE & ROSTER SELECTOR */}
      <section className="bg-white border-b border-slate-200 p-4 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-purple-950 tracking-wider">Caseload Scope:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setCaseloadScope('MyCaseload')}
                  className={`px-3 py-1 rounded-lg transition-all ${caseloadScope === 'MyCaseload' ? 'bg-purple-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  My Primary Caseload ({myCaseloadCount})
                </button>
                <button
                  onClick={() => setCaseloadScope('Coverage')}
                  className={`px-3 py-1 rounded-lg transition-all ${caseloadScope === 'Coverage' ? 'bg-amber-500 text-purple-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Coverage Mode (Jordan / Sam) ({coverageCount})
                </button>
                <button
                  onClick={() => setCaseloadScope('All')}
                  className={`px-3 py-1 rounded-lg transition-all ${caseloadScope === 'All' ? 'bg-purple-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All Site Roster ({localCandidates.length})
                </button>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate or WA ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-medium focus:bg-white focus:border-purple-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
            {displayedCandidates.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCandidateId(c.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedCandidateId === c.id
                    ? 'bg-purple-950 text-white border-purple-950 shadow-sm ring-2 ring-purple-400/50'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="font-extrabold text-xs truncate">{c.name}</div>
                <div className="flex justify-between items-center text-[10px] mt-1">
                  <span className={selectedCandidateId === c.id ? 'text-purple-200' : 'text-slate-500'}>{c.waId}</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded ${c.verifiedPoints >= c.pbasTarget ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-purple-950'}`}>
                    {c.verifiedPoints}/{c.pbasTarget} Pt
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVE CANDIDATE CONTROL TOOLBAR */}
      <section className="bg-purple-950/5 border-b border-purple-900/10 py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-purple-950 text-white rounded-xl font-extrabold flex items-center justify-center text-xs shadow-xs">
              {activeCandidate.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                <span>{activeCandidate.name}</span>
                <span className="font-mono text-xs text-purple-800/80">({activeCandidate.waId})</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeCandidate.status === 'On Track' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {activeCandidate.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Primary CM: {activeCandidate.ownerStaff} â€¢ PBAS Cycle Target: <strong>{activeCandidate.verifiedPoints} / {activeCandidate.pbasTarget} Pts</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadFullAuditPackage}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-emerald-200" /> ðŸ“¦ Download Complete PBAS Audit Package
            </button>

            <button
              onClick={() => {
                setNewTargetPoints(activeCandidate.pbasTarget);
                setNewCandidateStatus(activeCandidate.status);
                setShowObligationModal(true);
              }}
              className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-300" /> âš™ï¸ Adjust Obligations
            </button>
          </div>
        </div>
      </section>

      {/* SUB-NAVIGATION TABS */}
      <section className="bg-white border-b border-slate-200 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto text-xs font-bold">
          <button onClick={() => setActiveTab('queue')} className={`px-4 py-2 rounded-xl flex items-center gap-1.5 ${activeTab === 'queue' ? 'bg-purple-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Sign-Off Queue
          </button>
          <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-xl flex items-center gap-1.5 ${activeTab === 'profile' ? 'bg-purple-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            <BarChart3 className="w-4 h-4 text-purple-300" /> 5-Pillar Diagnostics
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`px-4 py-2 rounded-xl flex items-center gap-1.5 ${activeTab === 'appointments' ? 'bg-purple-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Calendar className="w-4 h-4 text-amber-400" /> Appointments ({appointments.length})
          </button>
          <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-xl flex items-center gap-1.5 ${activeTab === 'documents' ? 'bg-purple-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            <FolderLock className="w-4 h-4 text-blue-400" /> Document Locker ({documents.length})
          </button>
          <button onClick={() => setActiveTab('communication')} className={`px-4 py-2 rounded-xl flex items-center gap-1.5 ${activeTab === 'communication' ? 'bg-purple-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            <MessageSquare className="w-4 h-4 text-rose-400" /> Support Inbox ({contextMessages.length})
          </button>
          <button onClick={() => setActiveTab('auditLog')} className={`px-4 py-2 rounded-xl flex items-center gap-1.5 ${activeTab === 'auditLog' ? 'bg-purple-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Clock className="w-4 h-4 text-emerald-400" /> Audit Access Trail ({auditLogs.length})
          </button>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* CANDIDATE-TRIGGERED CELEBRATION OUTCOME CLAIMS */}
        {activeCandidateClaims.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-black text-sm text-purple-950 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-500" /> ðŸš¨ URGENT: High-Impact Outcome Claim Awaiting Verification
            </h3>
            {activeCandidateClaims.map((claim) => (
              <div key={claim.id} className="p-5 bg-linear-to-r from-purple-900 via-purple-950 to-slate-900 text-white rounded-2xl border-2 border-amber-400/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Candidate Submitted Milestone: {claim.type}
                  </span>
                  <h4 className="text-lg font-black text-white">{claim.employer} â€” {claim.role}</h4>
                  <p className="text-xs text-purple-200">
                    Submitted Date: {claim.date} â€¢ Pay Rate: AUD ${claim.hourlyRate || claim.payRate || '28.50'}/hr â€¢ Reward Credit: +{claim.points} PBAS Points
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      verifyOutcomeClaim(claim.id);
                      addAuditEntry(`Verified Outcome Claim: ${claim.type} at ${claim.employer} (+${claim.points} Pts)`);
                    }}
                    className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-purple-950 font-black text-xs rounded-xl shadow-md transition-all"
                  >
                    ðŸŸ¢ Verify Outcome (+{claim.points} Pts)
                  </button>
                  <button
                    onClick={() => {
                      rejectOutcomeClaim(claim.id);
                      addAuditEntry(`Rejected Outcome Claim: ${claim.type}`);
                    }}
                    className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Reject Claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 1: VERIFICATION QUEUE */}
        {activeTab === 'queue' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-700" /> Evidence Verification Queue for {activeCandidate.name}
                </h3>
                <p className="text-xs text-slate-500">Inspect proof artifacts, generate formatted certificates, or undo decisions.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-3">Submitted</th>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Points</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Auditor Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {mappedActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="p-3 text-slate-500">{act.date}</td>
                      <td className="p-3 font-bold text-slate-900">{act.candidateName}</td>
                      <td className="p-3 font-bold text-purple-900">{act.type}</td>
                      <td className="p-3 text-slate-700">{act.title}</td>
                      <td className="p-3 font-mono text-slate-500">{act.reference}</td>
                      <td className="p-3 font-extrabold text-emerald-600">+{act.points} Pts</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          act.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {act.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedReport(act)}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-bold flex items-center gap-1 ml-auto transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect & Print Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: 5-PILLAR DIAGNOSTICS */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-purple-950">5-Pillar Work Readiness & Diagnostic Profile: {activeCandidate.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                <span className="font-bold text-purple-900 uppercase text-[10px]">Pillar Readiness Breakdown</span>
                <div className="space-y-1 text-slate-800">
                  <div className="flex justify-between"><span>Resume & Cover Letter:</span><span className="font-extrabold text-emerald-700">Level 4/5 (Strong)</span></div>
                  <div className="flex justify-between"><span>STAR Interview Practice:</span><span className="font-extrabold text-purple-900">Level 3/5 (Proficient)</span></div>
                  <div className="flex justify-between"><span>WHS Safety Knowledge:</span><span className="font-extrabold text-emerald-700">Level 5/5 (Mastered)</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-purple-950">Scheduled Appointments for {activeCandidate.name}</h3>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="px-3.5 py-1.5 bg-purple-950 hover:bg-purple-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> + Book New Appointment
              </button>
            </div>
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900">{apt.type}</div>
                  <div className="text-slate-500">ðŸ“… {apt.date} at {apt.time} â€¢ {apt.location}</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">{apt.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: DOCUMENT LOCKER */}
        {activeTab === 'documents' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-purple-950">Bi-Directional Document Locker</h3>
              <button
                onClick={() => setShowDocUploadModal(true)}
                className="px-3.5 py-1.5 bg-purple-950 hover:bg-purple-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" /> ðŸ“¤ Upload Document to Candidate
              </button>
            </div>
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 bg-slate-50 border rounded-xl flex justify-between items-center text-xs font-semibold">
                <div>
                  <div className="font-bold text-slate-900">{doc.name}</div>
                  <div className="text-slate-500">{doc.category} â€¢ Uploaded by {doc.uploadedBy} â€¢ {doc.date}</div>
                </div>
                <button onClick={() => alert(`Downloading ${doc.name}...`)} className="px-3 py-1.5 bg-white border rounded-xl flex items-center gap-1 text-purple-950 font-bold">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: SUPPORT INBOX */}
        {activeTab === 'communication' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-purple-950">Candidate Support Inbox</h3>
            {contextMessages.map((msg) => (
              <div key={msg.id} className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between font-bold text-purple-950">
                  <span>Topic: {msg.topic}</span>
                  <span className="text-slate-400 font-mono">{msg.date}</span>
                </div>
                <p className="text-slate-700">{msg.message}</p>
                {msg.coachingResponse && (
                  <div className="p-3 bg-white border border-purple-200 rounded-xl text-purple-900 font-semibold">
                    <strong className="block text-[10px] text-purple-950 uppercase">Case Manager Coaching Response:</strong>
                    {msg.coachingResponse}
                  </div>
                )}
                <div className="pt-2 space-y-2">
                  <textarea
                    rows={2}
                    value={coachingInput}
                    onChange={(e) => setCoachingInput(e.target.value)}
                    placeholder="Type coaching response..."
                    className="w-full p-2 border rounded-xl text-xs outline-none focus:border-purple-800"
                  />
                  <button onClick={() => handleSendCoachingNote(msg.id)} className="px-3 py-1.5 bg-purple-950 text-white font-bold rounded-lg flex items-center gap-1">
                    <Send className="w-3 h-3" /> Send Response
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: AUDIT ACCESS TRAIL */}
        {activeTab === 'auditLog' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" /> Tamper-Evident Multi-Staff Audit Access Trail
            </h3>
            <p className="text-xs text-slate-500">Every sign-off decision, coverage inspection, and obligation change is recorded here.</p>
            <div className="divide-y divide-slate-100 text-xs font-semibold">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-purple-950">{log.staffName}</span>
                    <span className="text-slate-500"> on </span>
                    <span className="font-bold text-slate-900">{log.candidateName}</span>
                    <p className="text-slate-700 font-mono text-[11px] mt-0.5">{log.action}</p>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: ADJUST OBLIGATIONS */}
      {showObligationModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Adjust Mutual Obligations</h3>
              <button onClick={() => setShowObligationModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveObligations} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Monthly PBAS Target Points</label>
                <input
                  type="number"
                  value={newTargetPoints}
                  onChange={(e) => setNewTargetPoints(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-800 font-extrabold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Compliance Status Override</label>
                <select
                  value={newCandidateStatus}
                  onChange={(e) => setNewCandidateStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                >
                  <option value="On Track">On Track</option>
                  <option value="Action Needed">Action Needed</option>
                  <option value="Exempt">Exempt / Medical Leave</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Exemption / Target Adjustment Justification</label>
                <textarea
                  rows={2}
                  value={exemptionNote}
                  onChange={(e) => setExemptionNote(e.target.value)}
                  placeholder="e.g. Medical certificate verified â€” Target capped at 50 Pts."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowObligationModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-950 text-white font-bold rounded-xl shadow-sm">
                  Save Adjustments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BOOK APPOINTMENT */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Book Appointment for {activeCandidate.name}</h3>
              <button onClick={() => setShowAppointmentModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Appointment Type</label>
                <select value={aptType} onChange={(e) => setAptType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold">
                  <option value="Monthly PBAS Progress Audit">Monthly PBAS Progress Audit</option>
                  <option value="STAR Interview Coaching Session">STAR Interview Coaching Session</option>
                  <option value="Barrier Review & Job Plan Update">Barrier Review & Job Plan Update</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input type="date" value={aptDate} onChange={(e) => setAptDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold" required />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time</label>
                  <input type="text" value={aptTime} onChange={(e) => setAptTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold" required />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / Method</label>
                <input type="text" value={aptLocation} onChange={(e) => setAptLocation(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium" required />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAppointmentModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-950 text-white font-bold rounded-xl shadow-sm">
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: UPLOAD DOCUMENT */}
      {showDocUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Upload File to {activeCandidate.name}'s Locker</h3>
              <button onClick={() => setShowDocUploadModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                <input type="text" placeholder="e.g. Tailored_Job_Leads_Oct_2026.pdf" value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium" required />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select value={docCategory} onChange={(e) => setDocCategory(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold">
                  <option value="Provider Upload">Provider Upload</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Resume">Resume</option>
                  <option value="Cover Letter">Cover Letter</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowDocUploadModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-950 text-white font-bold rounded-xl shadow-sm">
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: BM SUPPORT TICKET */}
      {showSupportBmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Escalate Support Issue to Business Manager</h3>
              <button onClick={() => setShowSupportBmModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBmSupportTicket} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Topic</label>
                <select value={bmSupportTopic} onChange={(e) => setBmSupportTopic(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold">
                  <option value="PBAS Points Discrepancy">PBAS Points Discrepancy</option>
                  <option value="Caseload Allocation Request">Caseload Allocation Request</option>
                  <option value="System Technical Issue">System Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description of Issue</label>
                <textarea rows={3} value={bmSupportMessage} onChange={(e) => setBmSupportMessage(e.target.value)} placeholder="Describe the issue requiring Business Manager intervention..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-medium" required />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowSupportBmModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORMATTED CERTIFICATE INSPECTOR MODAL */}
      <EvidenceInspectorModal
        selectedReport={selectedReport}
        activeCandidate={activeCandidate}
        onClose={() => setSelectedReport(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onUndo={handleUndo}
      />

    </div>
  );
};

export default CaseManager;