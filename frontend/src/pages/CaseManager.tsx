import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  TrendingUp, 
  RefreshCw,
  Eye,
  ShieldCheck,
  Check,
  UserPlus,
  Sliders,
  Users,
  MessageSquare,
  Download,
  Award,
  Send,
  FileSpreadsheet,
  Briefcase,
  BookOpen,
  BarChart3,
  FileText
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  waId: string;
  pbasTarget: number;
  verifiedPoints: number;
  status: 'On Track' | 'Action Needed' | 'Exempt';
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
}

interface SupportMessage {
  id: string;
  candidateId: string;
  candidateName: string;
  topic: string;
  message: string;
  date: string;
  status: 'Unread' | 'Responded';
  coachingResponse?: string;
}

export const CaseManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'candidate_profile' | 'communication' | 'exports'>('queue');
  const [profileSection, setProfileSection] = useState<'star' | 'job_search' | 'pillars' | 'lms'>('star');

  // Candidate Roster
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: 'c1', name: 'Alex Participant', waId: 'WA-882194', pbasTarget: 100, verifiedPoints: 35, status: 'On Track' },
    { id: 'c2', name: 'Jordan Smith', waId: 'WA-904112', pbasTarget: 80, verifiedPoints: 60, status: 'On Track' },
    { id: 'c3', name: 'Sam Taylor', waId: 'WA-712399', pbasTarget: 100, verifiedPoints: 15, status: 'Action Needed' }
  ]);

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('c1');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Form Inputs
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateWaId, setNewCandidateWaId] = useState('');
  const [newCandidateTarget, setNewCandidateTarget] = useState(100);

  // Queue & Data
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filterType, setFilterType] = useState<string>('All');

  // Support Messages
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    {
      id: 'msg-1',
      candidateId: 'c1',
      candidateName: 'Alex Participant',
      topic: 'Application Feedback',
      message: 'Hi Casey, I submitted my STAR interview practice for the Warehouse role. Can you let me know if the Action section needs more detail?',
      date: '15/09/2026',
      status: 'Unread'
    }
  ]);
  const [coachingInput, setCoachingInput] = useState<string>('');
  const [selectedMsgId, setSelectedMsgId] = useState<string>('msg-1');

  const activeCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const loadSubmissions = () => {
    try {
      const storedHistory = localStorage.getItem('workready_star_history');
      let starActivities: ActivityLog[] = [];

      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        starActivities = parsed.map((item: any) => ({
          id: item.id,
          type: 'Interview',
          title: `STAR Practice: ${item.jobRole} (${item.rubricScore || 'Completed'})`,
          reference: `STAR-${item.id.slice(-6).toUpperCase()}`,
          points: 25,
          status: 'Pending Verification',
          date: item.date || new Date().toLocaleDateString('en-AU'),
          candidateId: 'c1',
          candidateName: 'Alex Participant',
          reportData: item
        }));
      }

      const defaultQueue: ActivityLog[] = [
        {
          id: 'act-2',
          type: 'Job Search',
          title: 'Warehouse Assistant — Logistics Co',
          reference: 'JOB-98231',
          points: 5,
          status: 'Pending Verification',
          date: '14/09/2026',
          candidateId: 'c1',
          candidateName: 'Alex Participant'
        },
        {
          id: 'act-rev-1',
          type: 'Confidence Review',
          title: '5-Pillar Assessment (Resume / Applications)',
          reference: 'REV-9-2026',
          points: 10,
          status: 'Pending Verification',
          date: '15/09/2026',
          candidateId: 'c1',
          candidateName: 'Alex Participant'
        },
        {
          id: 'act-1',
          type: 'LMS Module',
          title: 'WHS Fundamentals & Safe Work',
          reference: 'MOD-WHS-01',
          points: 10,
          status: 'Verified',
          date: '10/09/2026',
          candidateId: 'c1',
          candidateName: 'Alex Participant'
        }
      ];

      const combined = [...starActivities];
      defaultQueue.forEach((item) => {
        if (!combined.some((act) => act.id === item.id)) {
          combined.push(item);
        }
      });

      setActivities(combined);
    } catch (err) {
      console.error('Error loading verification queue', err);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName || !newCandidateWaId) return;

    const newEntry: Candidate = {
      id: `c-${Date.now()}`,
      name: newCandidateName,
      waId: newCandidateWaId,
      pbasTarget: newCandidateTarget,
      verifiedPoints: 0,
      status: 'On Track'
    };

    setCandidates([...candidates, newEntry]);
    setSelectedCandidateId(newEntry.id);
    setNewCandidateName('');
    setNewCandidateWaId('');
    setNewCandidateTarget(100);
    setShowAddModal(false);
  };

  const handleUpdateObligations = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;

    setCandidates((prev) =>
      prev.map((c) => (c.id === editingCandidate.id ? editingCandidate : c))
    );
    setEditingCandidate(null);
  };

  const handleApprove = (id: string, points: number, candidateId: string) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, status: 'Verified' } : act))
    );
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, verifiedPoints: Math.min(c.verifiedPoints + points, c.pbasTarget) }
          : c
      )
    );
  };

  const handleReject = (id: string) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, status: 'Rejected' } : act))
    );
  };

  const handleSendCoachingNote = (msgId: string) => {
    if (!coachingInput.trim()) return;

    setSupportMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, status: 'Responded', coachingResponse: coachingInput }
          : m
      )
    );
    setCoachingInput('');
  };

  const handleExportDewrCsv = () => {
    const headers = ['Candidate Name', 'Workforce Australia ID', 'Activity Type', 'Title', 'Reference ID', 'Points', 'Status', 'Date'];
    const rows = activities.map((act) => [
      `"${act.candidateName}"`,
      `"${activeCandidate.waId}"`,
      `"${act.type}"`,
      `"${act.title}"`,
      `"${act.reference}"`,
      act.points,
      `"${act.status}"`,
      `"${act.date}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DEWR_Compliance_Audit_${activeCandidate.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const candidateActivities = activities.filter((a) => a.candidateId === activeCandidate.id);
  const pendingList = candidateActivities.filter((a) => a.status === 'Pending Verification');
  const pendingPointsTotal = pendingList.reduce((sum, a) => sum + a.points, 0);

  const filteredActivities = candidateActivities.filter((act) => {
    if (filterType === 'All') return true;
    if (filterType === 'Pending') return act.status === 'Pending Verification';
    if (filterType === 'Verified') return act.status === 'Verified';
    return act.type === filterType;
  });

  const activeMsg = supportMessages.find((m) => m.id === selectedMsgId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-[#1e1b4b] via-[#24083b] to-[#1e1b4b] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white">
                  Case Manager Verification Hub
                </span>
                <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Casey Profile
                </span>
              </div>
              <p className="text-xs text-purple-200">Straight Up Training • Workforce Australia Compliance Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Add Candidate
            </button>
            <button
              onClick={loadSubmissions}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
            </button>
          </div>
        </div>
      </header>

      {/* Candidate Roster Selector */}
      <section className="bg-white border-b border-slate-200 shadow-xs py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-2">
              <Users className="w-4 h-4 text-purple-700" /> Roster:
            </span>
            {candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCandidateId(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all whitespace-nowrap ${
                  selectedCandidateId === c.id
                    ? 'bg-[#24083b] text-white border-[#24083b] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{c.name}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                  selectedCandidateId === c.id ? 'bg-purple-800 text-purple-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {c.verifiedPoints}/{c.pbasTarget} Pts
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Candidate Banner */}
      <section className="bg-white border-b border-slate-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm border border-purple-200">
              {activeCandidate.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-[#24083b]">{activeCandidate.name}</h1>
                <button
                  onClick={() => setEditingCandidate({ ...activeCandidate })}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold flex items-center gap-1 border border-slate-200"
                >
                  <Sliders className="w-3 h-3 text-purple-700" /> Adjust Obligations
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Workforce Australia ID: <span className="font-mono text-slate-700">{activeCandidate.waId}</span>
              </p>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'queue' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign-Off Queue
            </button>
            <button
              onClick={() => setActiveTab('candidate_profile')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'candidate_profile' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Candidate Profile Data
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'communication' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Support Inbox
            </button>
            <button
              onClick={() => setActiveTab('exports')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'exports' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> DEWR Exports
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* TAB 1: VERIFICATION QUEUE */}
        {activeTab === 'queue' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Pending Approvals</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">{pendingList.length} Items</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Verified Progress</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">+{activeCandidate.verifiedPoints} Pts</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Monthly Target</p>
                  <p className="text-2xl font-black text-purple-900 mt-1">{activeCandidate.pbasTarget} Pts</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-800 rounded-xl border border-purple-100">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-bold text-base text-[#24083b] flex items-center gap-2">
                    <Search className="w-5 h-5 text-purple-700" /> Submissions for {activeCandidate.name}
                  </h2>
                  <p className="text-xs text-slate-500">Audit candidate practice runs and credit points.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {['All', 'Pending', 'Verified', 'Interview', 'Job Search'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                        filterType === type
                          ? 'bg-[#24083b] text-white border-[#24083b]'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-3">Submitted</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Ref ID</th>
                      <th className="p-3">Points</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredActivities.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400">
                          No submissions found for {activeCandidate.name}.
                        </td>
                      </tr>
                    ) : (
                      filteredActivities.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50 transition-all">
                          <td className="p-3 font-semibold text-slate-500">{act.date}</td>
                          <td className="p-3 font-bold text-purple-900">{act.type}</td>
                          <td className="p-3 text-slate-700">{act.title}</td>
                          <td className="p-3 font-mono text-slate-500">{act.reference}</td>
                          <td className="p-3 font-extrabold text-emerald-600">+{act.points} Pts</td>
                          <td className="p-3">
                            {act.status === 'Verified' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Approved
                              </span>
                            ) : act.status === 'Rejected' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                                Rejected
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Pending Approval
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            {act.reportData && (
                              <button
                                onClick={() => setSelectedReport(act.reportData)}
                                className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold"
                              >
                                Audit Report
                              </button>
                            )}
                            {act.status === 'Pending Verification' && (
                              <button
                                onClick={() => handleApprove(act.id, act.points, act.candidateId)}
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold"
                              >
                                Approve (+{act.points})
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: CANDIDATE PROFILE DATA FULL VIEW */}
        {activeTab === 'candidate_profile' && (
          <div className="space-y-6">
            
            {/* Inner Sub-Navigation Bar for Candidate Data */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setProfileSection('star')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  profileSection === 'star'
                    ? 'bg-[#24083b] text-white border-[#24083b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Award className="w-4 h-4" /> STAR Practice Runs
              </button>

              <button
                onClick={() => setProfileSection('job_search')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  profileSection === 'job_search'
                    ? 'bg-[#24083b] text-white border-[#24083b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Job Search Log
              </button>

              <button
                onClick={() => setProfileSection('pillars')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  profileSection === 'pillars'
                    ? 'bg-[#24083b] text-white border-[#24083b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> 5-Pillar Readiness
              </button>

              <button
                onClick={() => setProfileSection('lms')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  profileSection === 'lms'
                    ? 'bg-[#24083b] text-white border-[#24083b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" /> LMS Modules & Certs
              </button>
            </div>

            {/* SECTION 1: STAR INTERVIEW PRACTICE LOGS */}
            {profileSection === 'star' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#24083b]">STAR Interview Submissions</h3>
                    <p className="text-xs text-slate-500">Full history of recorded STAR responses and qualitative rubrics for {activeCandidate.name}.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-bold">
                    +25 Points / Session
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {candidateActivities.filter((a) => a.type === 'Interview').map((item) => (
                    <div key={item.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{item.title}</span>
                          <span className="text-[10px] font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700">{item.reference}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Submitted: {item.date} • Status: <strong className="text-amber-700">{item.status}</strong></p>
                      </div>
                      {item.reportData && (
                        <button
                          onClick={() => setSelectedReport(item.reportData)}
                          className="px-3 py-1.5 bg-purple-900 text-white rounded-lg text-xs font-bold hover:bg-purple-950 transition-all"
                        >
                          View Full Evaluation
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: JOB SEARCH LOG */}
            {profileSection === 'job_search' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="font-extrabold text-base text-[#24083b]">Job Application History</h3>
                <p className="text-xs text-slate-500">Verified applications logged by {activeCandidate.name} for PBAS compliance.</p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">Warehouse Assistant — Logistics Co</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Applied: 14/09/2026 • Ref ID: <span className="font-mono text-slate-700">JOB-98231</span></p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">+5 Points</span>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">Customer Support Representative — Retail Hub</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Applied: 10/09/2026 • Ref ID: <span className="font-mono text-slate-700">JOB-97102</span></p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">+5 Points</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: 5-PILLAR READINESS */}
            {profileSection === 'pillars' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="font-extrabold text-base text-[#24083b]">5-Pillar Work Readiness Assessment</h3>
                <p className="text-xs text-slate-500">Candidate self-assessment ratings across key employment pillars.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {[
                    { title: 'Resume & Cover Letter', status: 'Strong', score: 'Level 4/5' },
                    { title: 'Job Application Strategy', status: 'Proficient', score: 'Level 3/5' },
                    { title: 'STAR Interview Readiness', status: 'In Development', score: 'Level 2/5' },
                    { title: 'Workplace Health & Safety', status: 'Mastered', score: 'Level 5/5' }
                  ].map((pillar, idx) => (
                    <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{pillar.title}</span>
                        <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full">{pillar.score}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Evaluation Status: <strong>{pillar.status}</strong></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: LMS MODULES */}
            {profileSection === 'lms' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="font-extrabold text-base text-[#24083b]">LMS Training & Certificates</h3>
                <p className="text-xs text-slate-500">Completed training modules and earned accreditation certificates.</p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">Verified Completion</span>
                      <h4 className="font-bold text-xs text-slate-800 mt-1">WHS Fundamentals & Safe Work</h4>
                      <p className="text-[11px] text-slate-500">Completed 10/09/2026 • Ref: MOD-WHS-01</p>
                    </div>
                    <button className="px-3 py-1.5 bg-purple-900 text-white rounded-lg text-xs font-bold hover:bg-purple-950 transition-all">
                      Inspect Certificate
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: SUPPORT INBOX & COACHING */}
        {activeTab === 'communication' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base text-[#24083b] border-b border-slate-100 pb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-700" /> Candidate Support Alerts
              </h3>
              <div className="space-y-2">
                {supportMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMsgId(msg.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      selectedMsgId === msg.id
                        ? 'bg-purple-50/80 border-purple-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">{msg.candidateName}</span>
                      <span className="text-[10px] text-slate-400">{msg.date}</span>
                    </div>
                    <p className="text-xs font-semibold text-purple-900">{msg.topic}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{msg.message}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              {activeMsg ? (
                <>
                  <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
                    <div>
                      <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase">
                        {activeMsg.topic}
                      </span>
                      <h2 className="font-extrabold text-lg text-[#24083b] mt-1">
                        Message from {activeMsg.candidateName}
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400">{activeMsg.date}</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                    "{activeMsg.message}"
                  </div>

                  {activeMsg.coachingResponse && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-800">Casey's Coaching Response:</span>
                      <p className="text-xs text-emerald-950 font-medium">{activeMsg.coachingResponse}</p>
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Attach Case Manager Coaching Note:</label>
                    <textarea
                      rows={4}
                      value={coachingInput}
                      onChange={(e) => setCoachingInput(e.target.value)}
                      placeholder="Type direct guidance, feedback on STAR interview practice, or PBAS scheduling details..."
                      className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:ring-2 focus:ring-purple-700 outline-none"
                    />
                    <button
                      onClick={() => handleSendCoachingNote(activeMsg.id)}
                      className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Coaching Note to {activeMsg.candidateName}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">Select a message to review.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: DEWR EXPORTS */}
        {activeTab === 'exports' && (
          <div className="bg-gradient-to-r from-purple-900 to-[#24083b] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="space-y-1">
              <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                DEWR Compliance Audit Hub
              </span>
              <h2 className="text-lg font-black tracking-tight">Export Participant Activity Records</h2>
              <p className="text-xs text-purple-200">
                Generate auditor-ready CSV files containing verified PBAS point logs for Department audit verification.
              </p>
            </div>

            <button
              onClick={handleExportDewrCsv}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="w-4 h-4" /> Download DEWR CSV Report
            </button>
          </div>
        )}

      </main>

      {/* MODAL 1: ADD CANDIDATE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddCandidate} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 font-sans">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-[#24083b]">Add New Candidate Profile</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Candidate Name:</label>
                <input
                  type="text"
                  required
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  placeholder="e.g. Taylor Reed"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Workforce Australia ID:</label>
                <input
                  type="text"
                  required
                  value={newCandidateWaId}
                  onChange={(e) => setNewCandidateWaId(e.target.value)}
                  placeholder="e.g. WA-991204"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly PBAS Points Schedule Target:</label>
                <select
                  value={newCandidateTarget}
                  onChange={(e) => setNewCandidateTarget(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none font-bold text-purple-900"
                >
                  <option value={100}>100 Points (Standard Mutual Obligation)</option>
                  <option value={80}>80 Points (Adjusted Work Capacity)</option>
                  <option value={60}>60 Points (Part-Time / Barrier Reduced)</option>
                  <option value={40}>40 Points (Special Circumstance Credit)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs">
                Save & Add Candidate
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: ADJUST PBAS OBLIGATIONS */}
      {editingCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUpdateObligations} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 font-sans">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-full">
                  Compliance Adjustment
                </span>
                <h3 className="font-extrabold text-base text-[#24083b] mt-0.5">
                  Adjust Obligations: {editingCandidate.name}
                </h3>
              </div>
              <button type="button" onClick={() => setEditingCandidate(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly PBAS Target Schedule:</label>
                <select
                  value={editingCandidate.pbasTarget}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, pbasTarget: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none font-bold text-purple-900"
                >
                  <option value={100}>100 Points / Month (Standard Target)</option>
                  <option value={80}>80 Points / Month (Partial Capacity Credit)</option>
                  <option value={60}>60 Points / Month (Study / Training Reduced)</option>
                  <option value={40}>40 Points / Month (Medical Exemption Credit)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Compliance Status Flag:</label>
                <select
                  value={editingCandidate.status}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, status: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none font-bold"
                >
                  <option value="On Track">On Track (Compliant)</option>
                  <option value="Action Needed">Action Needed (Under-Target)</option>
                  <option value="Exempt">Exempt (Temporary Medical Credit)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setEditingCandidate(null)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#24083b] text-white font-bold text-xs rounded-xl shadow-xs">
                Update Schedule & Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: AUDIT REPORT */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl border border-slate-200 font-sans">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase">
                  Candidate STAR Audit
                </span>
                <h3 className="font-extrabold text-lg text-[#24083b] mt-1">
                  {selectedReport.jobRole} Practice Report
                </h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 font-bold text-lg">✕</button>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-purple-900">Rubric Rating: <strong className="text-emerald-700">{selectedReport.rubricScore}</strong></span>
              <div className="space-y-1">
                {selectedReport.feedbackNotes?.map((note: string, idx: number) => (
                  <div key={idx} className="p-2 bg-white rounded border border-purple-100">{note}</div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  handleApprove(selectedReport.id, 25, 'c1');
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                Approve & Credit +25 Points
              </button>
              <button onClick={() => setSelectedReport(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CaseManager;