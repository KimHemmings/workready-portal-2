import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import type { Candidate, VerificationItem } from '../context/PortalContext';
import { 
  Users, CheckCircle2, Search, Filter, History, LogOut, Check, ChevronRight, Eye,
  Award, Calendar, Sparkles, MessageSquare, X, Send,
  ChevronDown, ChevronUp, UserCheck, UserX
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  epochMs: number;
  caseManagerName: string;
  candidateName: string;
  action: string;
  mode: 'Direct' | 'Coverage';
}

interface Message {
  id: string;
  sender: 'coach' | 'candidate';
  text: string;
  timestamp: string;
}

export default function CoachDashboard() {
  const {
    candidates,
    verificationItems,
    updateVerificationStatus,
  } = usePortal();

  const [currentCoachName] = useState('Casey Smith');
  const [selectedCaseload, setSelectedCaseload] = useState<string>('casey');
  const [activeTab, setActiveTab] = useState<'pending' | 'roster' | 'audit'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 15;
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTION' | 'AT_RISK' | 'ON_TRACK'>('ALL');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<VerificationItem | null>(null);
  const [inspectCandidate, setInspectCandidate] = useState<Candidate | null>(null);
  const [overridePoints, setOverridePoints] = useState<number | null>(null);
  

  // Away Status Toggle State
  const [isAway, setIsAway] = useState<boolean>(() => {
    return localStorage.getItem('workready_cm_is_away') === 'true';
  });

  // Collapsible Roster State (stores candidate IDs that are expanded)
  const [expandedCandidates, setExpandedCandidates] = useState<Record<string, boolean>>({});

  // Drawer Messaging State
  const [messagingCandidate, setMessagingCandidate] = useState<Candidate | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'candidate', text: 'Hi Casey, I submitted my interview evidence for review!', timestamp: '10:15 AM' },
    { id: '2', sender: 'coach', text: 'Awesome job Alex! Inspecting it now.', timestamp: '10:18 AM' }
  ]);

  // Appointment State
  const [appointments, setAppointments] = useState([
    { id: '1', title: 'Monthly Provider Compliance Check-in', date: '2026-09-22', time: '10:00 AM', status: 'Scheduled' },
    { id: '2', title: 'AI STAR Interview Practice Review', date: '2026-09-25', time: '02:00 PM', status: 'Scheduled' }
  ]);
  const [newApptTitle, setNewApptTitle] = useState('');
  const [newApptDate, setNewApptDate] = useState('2026-09-28');
  const [newApptTime, setNewApptTime] = useState('11:00 AM');

  const [starHistory] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('workready_star_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('workready_cm_audit_logs');
    const logs: AuditLogEntry[] = saved ? JSON.parse(saved) : [
      {
        id: '1',
        timestamp: new Date().toLocaleString(),
        epochMs: Date.now(),
        caseManagerName: 'Casey Smith',
        candidateName: 'Alex Participant',
        action: 'Verified "I Got an Interview!" evidence (+25 Pts)',
        mode: 'Direct'
      }
    ];
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
    return logs.filter(log => (Date.now() - log.epochMs) <= ninetyDaysMs);
  });

  useEffect(() => {
    localStorage.setItem('workready_cm_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('workready_cm_is_away', isAway ? 'true' : 'false');
  }, [isAway]);

  const toggleAwayStatus = () => {
    const nextAway = !isAway;
    setIsAway(nextAway);
    addAuditEntry(
      'Staff Status Update', 
      nextAway ? 'Set status to AWAY (Coverage reassignment enabled)' : 'Set status to ACTIVE / PRESENT'
    );
  };

  const toggleExpandCandidate = (id: string) => {
    setExpandedCandidates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const addAuditEntry = (candidateName: string, action: string) => {
    const isCoverage = selectedCaseload !== 'casey';
    const newEntry: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      epochMs: Date.now(),
      caseManagerName: isCoverage ? `${currentCoachName} (Coverage)` : currentCoachName,
      candidateName,
      action,
      mode: isCoverage ? 'Coverage' : 'Direct'
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !messagingCandidate) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'coach',
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    addAuditEntry(messagingCandidate.name, `Sent support message: "${messageInput.trim()}"`);
    setMessageInput('');
  };

  const handleAddAppointment = () => {
    if (!newApptTitle.trim() || !messagingCandidate) return;
    const appt = {
      id: Date.now().toString(),
      title: newApptTitle.trim(),
      date: newApptDate,
      time: newApptTime,
      status: 'Scheduled'
    };
    setAppointments(prev => [...prev, appt]);
    addAuditEntry(messagingCandidate.name, `Scheduled appointment: ${newApptTitle} on ${newApptDate} at ${newApptTime}`);
    setNewApptTitle('');
  };

  const handleSignOut = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleApprove = (item: VerificationItem, finalPoints?: number) => {
    const pointsToAward = finalPoints ?? overridePoints ?? item.points;
    const updatedItem = { ...item, points: pointsToAward };

    updateVerificationStatus(item.id, 'Verified');
    addAuditEntry(item.candidateName, `Approved ${item.title} (+${pointsToAward} Pts)`);
    setSelectedEvidence(null);
    setOverridePoints(null);
  };

  const handleDecline = (item: VerificationItem) => {
    updateVerificationStatus(item.id, 'Rejected');
    addAuditEntry(item.candidateName, `Declined ${item.title}`);
    setSelectedEvidence(null);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.waId && c.waId.toLowerCase().includes(searchTerm.toLowerCase()));

    const candidateCoach =
      (c as { caseManager?: string; coach?: string; coachName?: string }).caseManager ||
      (c as { caseManager?: string; coach?: string; coachName?: string }).coach ||
      (c as { caseManager?: string; coach?: string; coachName?: string }).coachName ||
      '';

    let matchesCaseload = true;
    if (selectedCaseload === 'casey') {
      matchesCaseload = !candidateCoach || candidateCoach.toLowerCase().includes('casey');
    } else if (selectedCaseload === 'jordan') {
      matchesCaseload = candidateCoach.toLowerCase().includes('jordan');
    } else if (selectedCaseload === 'taylor') {
      matchesCaseload = candidateCoach.toLowerCase().includes('taylor');
    } else if (selectedCaseload === 'all') {
      matchesCaseload = true;
    }

    const verified = c.pbasVerified ?? 45;
    const target = c.pbasTarget ?? 100;
    const progressPct = (verified / target) * 100;

    const hasPending = verificationItems.some(
      (v) =>
        v.candidateName.toLowerCase().includes(c.name.split(' ')[0].toLowerCase()) &&
        v.status === 'Pending'
    );

    const isAtRisk = progressPct < 50 || c.status === 'High Risk';

    let matchesStatus = true;
    if (statusFilter === 'ACTION') matchesStatus = hasPending;
    if (statusFilter === 'AT_RISK') matchesStatus = isAtRisk;
    if (statusFilter === 'ON_TRACK') matchesStatus = !isAtRisk && !hasPending;

    return matchesSearch && matchesCaseload && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = ['Candidate Name', 'Email', 'WA ID', 'Status', 'PBAS Verified', 'PBAS Target'];
    const rows = filteredCandidates.map(c => [
      `"${c.name}"`, `"${c.email}"`, `"${c.waId || ''}"`, `"${c.status || 'On Track'}"`, c.pbasVerified ?? 45, c.pbasTarget ?? 100
    ].join(','));
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI([headers.join(','), ...rows].join('\n'));
    link.download = `Candidate_Roster_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };
  // OBLIGATION CYCLE HANDLERS
  const handleUpdateObligationTarget = (candidateName: string, newTarget: number) => {
    addAuditEntry(candidateName, `Updated PBAS cycle obligation target to ${newTarget} points`);
    alert(`Obligation target updated to ${newTarget} Pts for ${candidateName}.`);
  };

  const handleAdaptObligations = (candidateName: string, adaptationReason: string) => {
    addAuditEntry(candidateName, `Adapted obligations: ${adaptationReason}`);
    alert(`Obligation requirements adapted for ${candidateName}: ${adaptationReason}`);
  };
  // 1-TOUCH FULL PBAS CYCLE AUDIT PACKAGE DOWNLOAD
  const handleDownloadPBASAuditPackage = (candidate: Candidate) => {
    addAuditEntry(
      candidate.name,
      `Downloaded complete timestamped PBAS Cycle Audit Package (Certificates, Evidence & STAR Reports)`
    );
    alert(`Downloading PBAS Audit Package for ${candidate.name}...\n\nIncluded Documents:\n- Timestamped PBAS Verification Summary.pdf\n- AI STAR Practice Coaching Reports.pdf\n- Verified Certificates & Activity Proofs.zip`);
  };

  // RESUME & COVER LETTER DOWNLOAD HANDLERS
  const handleDownloadDoc = (candidateName: string, docType: string) => {
    addAuditEntry(candidateName, `Downloaded candidate ${docType}`);
    alert(`Downloading ${docType} for ${candidateName}...`);
  };

  // DOCUMENT LOCKER UPLOAD HANDLER
  const handleUploadToLocker = (candidateName: string) => {
    addAuditEntry(candidateName, `Uploaded new compliance document to Candidate Document Locker`);
    alert(`Document uploaded successfully to ${candidateName}'s Locker.`);
  };
  // KPI METRICS CALCULATIONS
  const totalCaseloadCount = candidates.length;
  const onTrackCount = candidates.filter(c => ((c.pbasVerified ?? 45) / (c.pbasTarget ?? 100)) >= 0.5).length;
  const atRiskCount = candidates.filter(c => ((c.pbasVerified ?? 45) / (c.pbasTarget ?? 100)) < 0.5).length;
  const pendingItems = verificationItems.filter((v) => v.status === 'Pending');
  const victoryItems = pendingItems.filter(v => v.type === 'Job Placement' || v.type === 'Interview Claim' || v.type === 'STAR Interview');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-gradient-to-r from-[#1e1b4b] via-[#24083b] to-[#1e1b4b] text-white px-6 py-4 border-b border-purple-900/50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* PROMINENT HIGH-VISIBILITY LOGO BADGE */}
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/30 ring-2 ring-purple-400/40 overflow-hidden shrink-0 transition-transform hover:scale-105">
              <img 
                src="/logo.png" 
                alt="Straight Up Training Logo" 
                className="w-full h-full object-cover scale-150 transform transition-transform"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('logo.png')) {
                    target.src = '/White_Background_PNG.png';
                  } else {
                    target.onerror = null;
                    target.parentElement!.innerHTML = '<span class="font-black text-purple-950 text-xl tracking-tighter">SU</span>';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="font-extrabold text-2xl tracking-tight text-white">Straight Up Training</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  WorkReady Partner
                </span>
              </div>
              <p className="text-xs text-purple-200/80 font-medium mt-0.5">
                Case Manager Portal • Staff Overview & PBAS Compliance
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* TOGGLE SET AWAY FUNCTIONALITY */}
            <button
              onClick={toggleAwayStatus}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
                isAway 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 hover:bg-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
              }`}
            >
              {isAway ? (
                <>
                  <UserX className="w-3.5 h-3.5 text-amber-300" />
                  <span>Status: AWAY (Coverage Active)</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Status: Present & Available</span>
                </>
              )}
            </button>

            <div className="bg-white/10 backdrop-blur-md border border-purple-300/20 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-purple-200 font-medium">View Roster:</span>
              <select 
                value={selectedCaseload}
                onChange={(e) => setSelectedCaseload(e.target.value)}
                className="bg-purple-950 text-white font-bold rounded px-2 py-0.5 outline-none border border-purple-700/50 text-xs"
              >
                <option value="casey">My Caseload (Casey)</option>
                <option value="jordan">Coverage Mode (Jordan - Away)</option>
                <option value="taylor">Coverage Mode (Taylor - Away)</option>
                <option value="all">All Site Caseloads</option>
              </select>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-purple-950">
                Welcome back, {currentCoachName}!
              </h2>
              {isAway && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold rounded-full uppercase">
                  Away Mode Active
                </span>
              )}
            </div>
            {/* EXECUTIVE KPI SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 my-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-purple-50 text-purple-900 rounded-xl font-bold text-xs">
              TOTAL
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Active Roster</div>
              <div className="text-xl font-black text-slate-900">{totalCaseloadCount}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs">
              TRACK
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">On Track</div>
              <div className="text-xl font-black text-emerald-700">{onTrackCount}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-bold text-xs">
              RISK
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">At Risk</div>
              <div className="text-xl font-black text-rose-700">{atRiskCount}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl font-bold text-xs">
              PROOFS
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Pending Claims</div>
              <div className="text-xl font-black text-amber-700">{pendingItems.length}</div>
            </div>
          </div>
        </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedCaseload === 'casey' 
                ? "Managing your direct candidate caseload." 
                : `Active Coverage Mode: Staff caseload view set to [${selectedCaseload.toUpperCase()}].`}
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold space-x-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'pending'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pending Approvals ({pendingItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'roster'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Candidate Roster</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'audit'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>90-Day Audit Log</span>
            </button>
          </div>
        </div>

        {victoryItems.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 rounded-2xl shadow-lg space-y-2 border border-emerald-400/30">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-300 animate-bounce" />
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-amber-200">
                Priority Victory Submissions Pending Review ({victoryItems.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {victoryItems.map((item) => (
                <div key={item.id} className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{item.candidateName}</span>
                    <span className="text-emerald-200 ml-2">({item.title})</span>
                    <p className="text-[11px] text-emerald-100">{item.details || 'Submitted for verification.'}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEvidence(item)}
                    className="px-3 py-1.5 bg-white text-emerald-950 font-bold rounded-lg hover:bg-emerald-50 text-xs shadow-sm"
                  >
                    Verify (+{item.points} Pts)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Pending Evidence Sign-offs ({pendingItems.length})
            </h3>

            {pendingItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
                <h4 className="font-bold text-slate-800">All Verification Items Cleared</h4>
                <p className="text-xs text-slate-500 mt-1">There are no pending submissions requiring Case Manager review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-300 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 font-bold text-xs rounded-full">
                          {item.candidateName}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-md">
                          +{item.points} PBAS Pts
                        </span>
                        <span className="text-xs text-slate-400">{item.submittedDate}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                      <p className="text-xs text-slate-600">{item.details || 'Submitted for verification.'}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedEvidence(item)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Evidence</span>
                      </button>
                      <button
                        onClick={() => handleApprove(item)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve (+{item.points} Pts)</span>
                      </button>
                      <button
                        onClick={() => handleDecline(item)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ROSTER WITH EXPAND / COLLAPSE DROPDOWN ARROWS */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
           {/* TOOLBAR: SEARCH, STATUS TRIAGE FILTERS, COUNTER & EXPORT */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 my-3">
              <div className="flex items-center space-x-3 w-full md:w-auto flex-1">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Filter participants by Name or WA ID..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-purple-600"
                  />
                </div>

                {/* COLOR-CODED STATUS TRIAGE PILLS */}
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-[11px] font-extrabold">
                  <button
                    type="button"
                    onClick={() => { setStatusFilter('ALL'); setCurrentPage(1); }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      statusFilter === 'ALL' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStatusFilter('ACTION'); setCurrentPage(1); }}
                    className={`px-3 py-1 rounded-lg transition-all border ${
                      statusFilter === 'ACTION' 
                        ? 'bg-purple-950 text-white border-purple-950 shadow-sm' 
                        : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    Action Needed
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStatusFilter('AT_RISK'); setCurrentPage(1); }}
                    className={`px-3 py-1 rounded-lg transition-all border ${
                      statusFilter === 'AT_RISK' 
                        ? 'bg-rose-700 text-white border-rose-700 shadow-sm' 
                        : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    At Risk
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStatusFilter('ON_TRACK'); setCurrentPage(1); }}
                    className={`px-3 py-1 rounded-lg transition-all border ${
                      statusFilter === 'ON_TRACK' 
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    On Track
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
                <span className="text-xs text-slate-500 font-semibold">
                  Showing {filteredCandidates.length} Candidates
                </span>
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* HIGH-DENSITY CASELOAD TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedCandidateIds.length === filteredCandidates.length && filteredCandidates.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCandidateIds(filteredCandidates.map(c => c.id));
                          } else {
                            setSelectedCandidateIds([]);
                          }
                        }}
                        className="rounded border-slate-300 text-purple-900 focus:ring-purple-600"
                      />
                    </th>
                    <th className="p-4">Participant Name & WA ID</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">PBAS Progress</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedCandidates.map((candidate: Candidate) => {
                    const verified = candidate.pbasVerified ?? 45;
                    const target = candidate.pbasTarget ?? 100;
                    const progressPct = Math.min(100, Math.round((verified / target) * 100));
                    const isAtRisk = progressPct < 50 || candidate.status === 'High Risk';

                    return (
                      <tr key={candidate.id} className="hover:bg-purple-50/50 transition-all">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedCandidateIds.includes(candidate.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCandidateIds(prev => [...prev, candidate.id]);
                              } else {
                                setSelectedCandidateIds(prev => prev.filter(id => id !== candidate.id));
                              }
                            }}
                            className="rounded border-slate-300 text-purple-900 focus:ring-purple-600"
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-extrabold text-slate-900 text-sm">{candidate.name}</div>
                          <div className="text-[11px] text-slate-500">{candidate.email} • {candidate.waId || 'WA-882194'}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 border font-extrabold text-[10px] rounded-full uppercase ${
                            isAtRisk 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {isAtRisk ? 'High Risk' : (candidate.status || 'On Track')}
                          </span>
                        </td>
                        <td className="p-4 w-48">
                          <div className="flex justify-between text-[11px] font-bold mb-1">
                            <span className="text-slate-600">{progressPct}%</span>
                            <span className="text-purple-950">{verified} / {target} Pts</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                isAtRisk 
                                  ? 'bg-gradient-to-r from-rose-500 to-amber-500' 
                                  : 'bg-gradient-to-r from-purple-600 to-emerald-500'
                              }`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setMessagingCandidate(candidate)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                          >
                            Contact
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setInspectCandidate(candidate);
                              addAuditEntry(candidate.name, 'Opened active candidate inspection');
                            }}
                            className="px-3.5 py-1.5 bg-purple-950 hover:bg-purple-900 text-white font-bold rounded-xl text-xs"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* PAGINATION CONTROLS */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 mt-4">
              <span>
                Page {currentPage} of {totalPages || 1} ({filteredCandidates.length} Candidates)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-all"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 disabled:opacity-40 text-white rounded-xl transition-all"
                >
                  Next
                </button>
              </div>
            </div>
            {/* ACTIVE SELECTED CANDIDATE DEEP INSPECTION HUB */}
            {inspectCandidate && (
              <div className="bg-white rounded-2xl border border-purple-200 p-6 shadow-sm space-y-6 mt-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-950 text-white font-extrabold rounded-full flex items-center justify-center text-sm">
                      {inspectCandidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{inspectCandidate.name}</h3>
                      <p className="text-xs text-slate-500">WA ID: {inspectCandidate.waId || 'WA-882190'} • {inspectCandidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setMessagingCandidate(inspectCandidate)}
                      className="px-3.5 py-2 bg-purple-950 text-white font-bold rounded-xl text-xs"
                    >
                      Open Direct Support Hub
                    </button>
                  </div>
                </div>

                {/* 5-PILLARS DIAGNOSTIC SNAPSHOT */}
                {inspectCandidate.fivePillars && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">5-Pillar Diagnostics Baseline</span>
                    <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400">Resume</div>
                        <div className="text-purple-950 font-extrabold">{inspectCandidate.fivePillars.resume}%</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400">Interview</div>
                        <div className="text-purple-950 font-extrabold">{inspectCandidate.fivePillars.interview}%</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400">Digital</div>
                        <div className="text-purple-950 font-extrabold">{inspectCandidate.fivePillars.digital}%</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400">WHS</div>
                        <div className="text-purple-950 font-extrabold">{inspectCandidate.fivePillars.whs}%</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400">Career Plan</div>
                        <div className="text-purple-950 font-extrabold">{inspectCandidate.fivePillars.careerPlan}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                  <History className="w-5 h-5 text-purple-950" />
                  <span>Case Manager Activity & Transparency Log</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated 90-day retention window. Records staff interactions and coverage audits.
                </p>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-900 font-bold text-xs rounded-full border border-purple-200">
                {auditLogs.length} Active Records
              </span>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 font-bold rounded-md text-[10px] uppercase ${
                      log.mode === 'Coverage' 
                        ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {log.mode}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">{log.caseManagerName}</span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span className="text-slate-700">{log.action}</span>
                      <span className="text-slate-400 mx-1.5">for</span>
                      <span className="font-semibold text-purple-950">{log.candidateName}</span>
                    </div>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {messagingCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white max-w-md w-full h-full p-6 flex flex-col justify-between shadow-2xl space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Direct Candidate Hub</h3>
                  <p className="text-xs text-purple-900 font-semibold">Participant: {messagingCandidate.name}</p>
                </div>
                <button onClick={() => setMessagingCandidate(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                  <span>Two-Way Support Chat</span>
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 h-48 overflow-y-auto space-y-2 text-xs">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex flex-col ${m.sender === 'coach' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-2.5 rounded-xl max-w-[80%] ${
                        m.sender === 'coach' 
                          ? 'bg-purple-950 text-white font-medium' 
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5">{m.timestamp}</span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text"
                    placeholder="Type message to candidate..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-purple-600"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="px-3 py-1.5 bg-purple-950 text-white rounded-xl font-bold text-xs flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Schedule Provider Contact</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <input 
                    type="text" 
                    placeholder="Appointment Title (e.g. STAR Coaching Session)"
                    value={newApptTitle}
                    onChange={(e) => setNewApptTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none"
                  />
                  <div className="flex space-x-2">
                    <input 
                      type="date" 
                      value={newApptDate}
                      onChange={(e) => setNewApptDate(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 outline-none"
                    />
                    <input 
                      type="text" 
                      value={newApptTime}
                      onChange={(e) => setNewApptTime(e.target.value)}
                      className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleAddAppointment}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                  >
                    Set Mandatory Appointment
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-bold text-[11px] text-slate-500">Upcoming Scheduled Contacts:</span>
                  {appointments.map((a) => (
                    <div key={a.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900">{a.title}</div>
                        <div className="text-slate-500 text-[10px]">{a.date} at {a.time}</div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setMessagingCandidate(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}

      {inspectCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white max-w-2xl w-full h-full p-6 flex flex-col justify-between shadow-2xl space-y-6 overflow-y-auto">
            <div className="space-y-6">
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-950 text-white font-black rounded-2xl flex items-center justify-center text-base shadow-md">
                    {inspectCandidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">{inspectCandidate.name}</h3>
                    <p className="text-xs text-slate-500">WA ID: {inspectCandidate.waId || 'WA-882190'} • {inspectCandidate.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setInspectCandidate(null)} 
                  className="p-2 text-slate-400 hover:text-slate-600 font-bold rounded-xl bg-slate-50 border border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 5-PILLARS DIAGNOSTIC OVERVIEW */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">5-Pillars Capability Baseline</span>
                <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Resume</div>
                    <div className="text-purple-950 font-black text-sm">{inspectCandidate.fivePillars?.resume || 80}%</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Interview</div>
                    <div className="text-purple-950 font-black text-sm">{inspectCandidate.fivePillars?.interview || 65}%</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Digital</div>
                    <div className="text-purple-950 font-black text-sm">{inspectCandidate.fivePillars?.digital || 90}%</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">WHS</div>
                    <div className="text-purple-950 font-black text-sm">{inspectCandidate.fivePillars?.whs || 100}%</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-400">Career</div>
                    <div className="text-purple-950 font-black text-sm">{inspectCandidate.fivePillars?.careerPlan || 75}%</div>
                  </div>
                </div>
              </div>
              {/* OBLIGATION CYCLE MANAGEMENT & ADAPTATION PANEL */}
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-200/60 pb-2">
                  <div>
                    <h4 className="font-extrabold text-purple-950 text-xs uppercase tracking-wider">Active Obligation Cycle Controls</h4>
                    <p className="text-[11px] text-purple-800 font-medium">Cycle Window: Current Monthly Cycle • Status: Active</p>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-950 text-white font-extrabold text-[10px] rounded-lg uppercase">
                    Monthly Target: {inspectCandidate.pbasTarget || 100} Pts
                  </span>
                </div>

                {/* ADAPT OBLIGATIONS & SET CYCLE TARGETS */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Set Cycle Points Target</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        defaultValue={inspectCandidate.pbasTarget || 100}
                        id="targetInput"
                        className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-black text-center outline-none focus:border-purple-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = (document.getElementById('targetInput') as HTMLInputElement)?.value;
                          handleUpdateObligationTarget(inspectCandidate.name, Number(val));
                        }}
                        className="px-3 py-1 bg-purple-950 hover:bg-purple-900 text-white font-bold text-xs rounded-lg transition-all"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Adapt Obligations / Exemption</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) handleAdaptObligations(inspectCandidate.name, e.target.value);
                      }}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-purple-600"
                    >
                      <option value="">-- Apply Adaptation --</option>
                      <option value="Temporary Medical Reduction (50 Pts)">Temporary Medical Reduction (50 Pts)</option>
                      <option value="Part-time Study Exemption (75 Pts)">Part-time Study Exemption (75 Pts)</option>
                      <option value="Paid Employment Reduction (30 Pts)">Paid Employment Reduction (30 Pts)</option>
                      <option value="Full Exemption (0 Pts)">Full Cycle Exemption (0 Pts)</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* ONE-TOUCH PBAS CYCLE AUDIT DOWNLOAD BAR */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider">End-of-Cycle PBAS Audit Package</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">Timestamped evidence, certificates, STAR reports, and activity logs.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadPBASAuditPackage(inspectCandidate)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
                >
                  Download Complete Audit Bundle
                </button>
              </div>

              {/* RESUME, COVER LETTER & DOCUMENT LOCKER */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Candidate Document Locker & Files</span>
                  <label className="px-3 py-1 bg-purple-950 hover:bg-purple-900 text-white font-bold text-[11px] rounded-lg cursor-pointer">
                    + Upload File
                    <input
                      type="file"
                      className="hidden"
                      onChange={() => handleUploadToLocker(inspectCandidate.name)}
                    />
                  </label>
                </div>

                {/* RESUME & COVER LETTER QUICK DOWNLOADS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-slate-900">Current Resume</div>
                      <div className="text-[10px] text-slate-400">PDF • Updated recently</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(inspectCandidate.name, 'Resume')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]"
                    >
                      Download
                    </button>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-extrabold text-slate-900">Cover Letter</div>
                      <div className="text-[10px] text-slate-400">PDF • Updated recently</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(inspectCandidate.name, 'Cover Letter')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]"
                    >
                      Download
                    </button>
                  </div>
                </div>

                {/* LOCKER ATTACHMENT HISTORY */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Verified Evidence & Certificates</span>
                  <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                    <div className="p-2.5 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Job_Application_Proof_Sept2026.pdf</span>
                      <button
                        type="button"
                        onClick={() => handleDownloadDoc(inspectCandidate.name, 'Application Proof')}
                        className="text-purple-900 font-extrabold hover:underline text-[11px]"
                      >
                        Download
                      </button>
                    </div>
                    <div className="p-2.5 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">First_Aid_Certificate_Verified.pdf</span>
                      <button
                        type="button"
                        onClick={() => handleDownloadDoc(inspectCandidate.name, 'First Aid Certificate')}
                        className="text-purple-900 font-extrabold hover:underline text-[11px]"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI STAR MOCK REPORTS */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-purple-950 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI STAR Practice Coaching Reports (+25 Pts Each)</span>
                </h4>

                {starHistory.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                    No AI STAR Mock practice sessions logged yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {starHistory.map((star: any, idx: number) => (
                      <div key={idx} className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-1.5 text-xs">
                        <div className="flex justify-between font-bold text-purple-950">
                          <span>Role: {star.jobRole || 'General Job Practice'}</span>
                          <span className="text-emerald-700">Score: {star.score || '85'}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-purple-100">
                          <div><strong>Situation:</strong> {star.situation || 'N/A'}</div>
                          <div><strong>Task:</strong> {star.task || 'N/A'}</div>
                          <div><strong>Action:</strong> {star.action || 'N/A'}</div>
                          <div><strong>Result:</strong> {star.result || 'N/A'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMessagingCandidate(inspectCandidate);
                  setInspectCandidate(null);
                }}
                className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white font-bold rounded-xl text-xs"
              >
                Open Direct Support Hub
              </button>
              <button
                onClick={() => setInspectCandidate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEvidence && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Evidence Verification Details</h3>
              <button onClick={() => setSelectedEvidence(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-bold text-slate-900">{selectedEvidence.candidateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Title:</span>
                <span className="font-bold text-purple-950">{selectedEvidence.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PBAS Value:</span>
                <span className="font-bold text-emerald-600">+{selectedEvidence.points} Points</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                <p className="font-semibold mb-1 text-slate-900">Submitted Notes / Details:</p>
                {selectedEvidence.details || 'No additional notes provided.'}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 justify-end">
              <button
                type="button"
                onClick={() => handleDecline(selectedEvidence)}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all"
              >
                Decline Claim
              </button>

              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600">Points:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overridePoints ?? selectedEvidence.points}
                  onChange={(e) => setOverridePoints(Number(e.target.value))}
                  className="w-16 p-1 text-xs font-black text-center bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={() => handleApprove(selectedEvidence, overridePoints ?? selectedEvidence.points)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20"
              >
                Approve & Grant Points
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}