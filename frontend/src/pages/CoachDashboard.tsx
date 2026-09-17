import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import type { VerificationItem, CandidateProfile } from '../lib/types';
import { 
  Users, CheckCircle2, Search, Filter, History, LogOut, Check, ChevronRight, Eye,
  Award, Briefcase, Calendar, Sparkles, MessageSquare, AlertCircle, FileText, CheckSquare, X, Send, Clock,
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
    approveVerification,
    declineVerification,
  } = usePortal();

  const [currentCoachName] = useState('Casey Smith');
  const [selectedCaseload, setSelectedCaseload] = useState<string>('casey');
  const [activeTab, setActiveTab] = useState<'pending' | 'roster' | 'audit'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<VerificationItem | null>(null);
  const [inspectCandidate, setInspectCandidate] = useState<CandidateProfile | null>(null);

  // Away Status Toggle State
  const [isAway, setIsAway] = useState<boolean>(() => {
    return localStorage.getItem('workready_cm_is_away') === 'true';
  });

  // Collapsible Roster State (stores candidate IDs that are expanded)
  const [expandedCandidates, setExpandedCandidates] = useState<Record<string, boolean>>({});

  // Drawer Messaging State
  const [messagingCandidate, setMessagingCandidate] = useState<CandidateProfile | null>(null);
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

  const handleApprove = (item: VerificationItem) => {
    approveVerification(item.id);
    addAuditEntry(item.candidateName, `Approved ${item.title} (+${item.points} Pts)`);
    setSelectedEvidence(null);
  };

  const handleDecline = (item: VerificationItem) => {
    declineVerification(item.id);
    addAuditEntry(item.candidateName, `Declined ${item.title}`);
    setSelectedEvidence(null);
  };

  const filteredCandidates = candidates.filter((c: CandidateProfile) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCaseload === 'casey') return matchesSearch && (c.id === 'alex' || c.name.includes('Alex'));
    if (selectedCaseload === 'jordan') return matchesSearch && c.id !== 'alex';
    return matchesSearch;
  });

  const pendingItems = verificationItems.filter((v: VerificationItem) => v.status === 'Pending');
  const victoryItems = pendingItems.filter(v => v.activityType === 'Job Placement' || v.activityType === 'Interview');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-gradient-to-r from-[#1e1b4b] via-[#24083b] to-[#1e1b4b] text-white px-6 py-4 border-b border-purple-900/50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
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
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  WorkReady Partner
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
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
                    <p className="text-[11px] text-emerald-100">{item.notes}</p>
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
                {pendingItems.map((item: VerificationItem) => (
                  <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-300 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 font-bold text-xs rounded-full">
                          {item.candidateName}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-md">
                          +{item.points} PBAS Pts
                        </span>
                        <span className="text-xs text-slate-400">{item.dateSubmitted}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                      <p className="text-xs text-slate-600">{item.notes || 'Submitted for verification.'}</p>
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
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate roster by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-purple-600"
                />
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Showing {filteredCandidates.length} Candidates
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCandidates.map((candidate: CandidateProfile) => {
                const isExpanded = expandedCandidates[candidate.id] ?? true;

                return (
                  <div key={candidate.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 relative">
                    <div className="flex items-start justify-between pr-8">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                          <span>{candidate.name}</span>
                        </h4>
                        <p className="text-xs text-slate-500">{candidate.email} • WA ID: WA-882194</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-full">
                        {candidate.status}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExpandCandidate(candidate.id)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-purple-950 hover:bg-slate-100 rounded-lg transition-all"
                      title={isExpanded ? "Collapse View" : "Expand Roster Details"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-purple-950 font-bold" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">PBAS Monthly Verified Points</span>
                        <span className="text-purple-950">{candidate.pbasVerified} / {candidate.pbasTarget} Pts</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-emerald-500 h-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (candidate.pbasVerified / candidate.pbasTarget) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-slate-100 animate-fadeIn">
                        {candidate.fivePillars && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <div className="font-bold text-slate-800 flex items-center justify-between">
                              <span>5 Pillars Diagnostic Mirror</span>
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            </div>
                            <div className="grid grid-cols-5 gap-1.5 text-center font-bold text-[10px]">
                              <div className="bg-purple-100 text-purple-900 p-1.5 rounded">
                                <div>Job Search</div>
                                <div className="text-xs text-purple-950">{candidate.fivePillars.jobSearch}%</div>
                              </div>
                              <div className="bg-emerald-100 text-emerald-900 p-1.5 rounded">
                                <div>Interview</div>
                                <div className="text-xs text-emerald-950">{candidate.fivePillars.interviewReadiness}%</div>
                              </div>
                              <div className="bg-blue-100 text-blue-900 p-1.5 rounded">
                                <div>Skills</div>
                                <div className="text-xs text-blue-950">{candidate.fivePillars.technicalSkills}%</div>
                              </div>
                              <div className="bg-amber-100 text-amber-900 p-1.5 rounded">
                                <div>Logistics</div>
                                <div className="text-xs text-amber-950">{candidate.fivePillars.logistics}%</div>
                              </div>
                              <div className="bg-rose-100 text-rose-900 p-1.5 rounded">
                                <div>Mindset</div>
                                <div className="text-xs text-rose-950">{candidate.fivePillars.mindset}%</div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex justify-between items-center text-xs gap-2">
                          <button 
                            onClick={() => setMessagingCandidate(candidate)}
                            className="px-3 py-1.5 bg-purple-50 text-purple-900 border border-purple-200 font-bold rounded-xl hover:bg-purple-100 flex items-center space-x-1 text-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Message / Schedule</span>
                          </button>

                          <button 
                            onClick={() => {
                              setInspectCandidate(candidate);
                              addAuditEntry(candidate.name, 'Opened candidate readiness mirror & STAR history');
                            }}
                            className="text-purple-950 font-bold hover:underline flex items-center space-x-1 text-xs"
                          >
                            <span>Locker</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{inspectCandidate.name} — Candidate Evidence Locker</h3>
                <p className="text-xs text-slate-500">WA ID: WA-882194 • {inspectCandidate.email}</p>
              </div>
              <button onClick={() => setInspectCandidate(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

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

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setInspectCandidate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close Locker
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
                {selectedEvidence.notes || 'No additional notes provided.'}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedEvidence(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => handleApprove(selectedEvidence)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
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