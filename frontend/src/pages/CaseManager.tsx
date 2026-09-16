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
  Upload,
  Award,
  Send,
  FileSpreadsheet,
  Briefcase,
  BookOpen,
  BarChart3,
  FileText,
  Calendar,
  FolderLock,
  Plus,
  File,
  ChevronRight,
  AlertTriangle
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
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'queue' | 'profile' | 'appointments' | 'documents' | 'communication' | 'exports'>('queue');
  const [profileSection, setProfileSection] = useState<'star' | 'job_search' | 'pillars' | 'lms'>('star');

  // Candidate Roster State
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: 'c1', name: 'Alex Participant', waId: 'WA-882194', pbasTarget: 100, verifiedPoints: 35, status: 'On Track' },
    { id: 'c2', name: 'Jordan Smith', waId: 'WA-904112', pbasTarget: 80, verifiedPoints: 60, status: 'On Track' },
    { id: 'c3', name: 'Sam Taylor', waId: 'WA-712399', pbasTarget: 100, verifiedPoints: 15, status: 'Action Needed' }
  ]);

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('c1');
  const activeCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  // Appointment State
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'apt-1', candidateId: 'c1', candidateName: 'Alex Participant', type: 'Monthly PBAS Progress Audit', date: '2026-09-22', time: '10:00 AM', location: 'Provider Office (In-Person)', status: 'Scheduled' },
    { id: 'apt-2', candidateId: 'c1', candidateName: 'Alex Participant', type: 'STAR Interview Coaching Session', date: '2026-09-29', time: '02:30 PM', location: 'Phone Check-in', status: 'Scheduled' },
    { id: 'apt-3', candidateId: 'c2', candidateName: 'Jordan Smith', type: 'Job Placement Agreement Sign-off', date: '2026-09-24', time: '11:15 AM', location: 'Provider Office (In-Person)', status: 'Scheduled' }
  ]);
  const [showAptModal, setShowAptModal] = useState(false);
  const [aptType, setAptType] = useState('Monthly PBAS Progress Audit');
  const [aptDate, setAptDate] = useState('2026-09-25');
  const [aptTime, setAptTime] = useState('10:00 AM');
  const [aptLocation, setAptLocation] = useState('Provider Office (In-Person)');

  // Document Locker State
  const [documents, setDocuments] = useState<DocumentFile[]>([
    { id: 'doc-1', candidateId: 'c1', candidateName: 'Alex Participant', name: 'Alex_Participant_Resume_2026.pdf', category: 'Resume', uploadedBy: 'Alex Participant', date: '12/09/2026', size: '1.2 MB' },
    { id: 'doc-2', candidateId: 'c1', candidateName: 'Alex Participant', name: 'Warehouse_Logistics_CoverLetter.pdf', category: 'Cover Letter', uploadedBy: 'Alex Participant', date: '14/09/2026', size: '450 KB' },
    { id: 'doc-3', candidateId: 'c1', candidateName: 'Alex Participant', name: 'Job_Search_Plan_Casey_Signed.pdf', category: 'Provider Upload', uploadedBy: 'Casey (Case Manager)', date: '10/09/2026', size: '890 KB' },
    { id: 'doc-4', candidateId: 'c2', candidateName: 'Jordan Smith', name: 'Jordan_Smith_Resume.pdf', category: 'Resume', uploadedBy: 'Jordan Smith', date: '08/09/2026', size: '980 KB' }
  ]);

  // Support Inbox State
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    {
      id: 'msg-1',
      candidateId: 'c1',
      candidateName: 'Alex Participant',
      topic: 'STAR Practice Feedback',
      message: 'Hi Casey, I completed my interview practice for the Warehouse role. Can you review my Action section and let me know if it covers safety protocols sufficiently?',
      date: '15/09/2026',
      status: 'Unread'
    },
    {
      id: 'msg-2',
      candidateId: 'c3',
      candidateName: 'Sam Taylor',
      topic: 'Schedule Target Adjustment',
      message: 'I have medical appointments next week. Can we adjust my monthly PBAS obligation target down to 60 points for this cycle?',
      date: '12/09/2026',
      status: 'Unread'
    }
  ]);
  const [coachingInput, setCoachingInput] = useState<string>('');
  const [selectedMsgId, setSelectedMsgId] = useState<string>('msg-1');

  // Verification Queue State
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filterType, setFilterType] = useState<string>('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Form Inputs for Adding Candidate
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateWaId, setNewCandidateWaId] = useState('');
  const [newCandidateTarget, setNewCandidateTarget] = useState(100);

  // Load Submissions from localStorage & Initialise Queue
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

  // Handlers
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

  const handleAddAppointment = (e: React.FormEvent) => {
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

    setAppointments([...appointments, newApt]);
    setShowAptModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: DocumentFile = {
      id: `doc-${Date.now()}`,
      candidateId: activeCandidate.id,
      candidateName: activeCandidate.name,
      name: file.name,
      category: 'Provider Upload',
      uploadedBy: 'Casey (Case Manager)',
      date: new Date().toLocaleDateString('en-AU'),
      size: `${(file.size / 1024).toFixed(1)} KB`
    };

    setDocuments([...documents, newDoc]);
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

  // Filtered Lists
  const candidateActivities = activities.filter((a) => a.candidateId === activeCandidate.id);
  const pendingList = candidateActivities.filter((a) => a.status === 'Pending Verification');
  const pendingPointsTotal = pendingList.reduce((sum, a) => sum + a.points, 0);

  const filteredActivities = candidateActivities.filter((act) => {
    if (filterType === 'All') return true;
    if (filterType === 'Pending') return act.status === 'Pending Verification';
    if (filterType === 'Verified') return act.status === 'Verified';
    return act.type === filterType;
  });

  const candidateDocs = documents.filter((d) => d.candidateId === activeCandidate.id);
  const candidateApts = appointments.filter((a) => a.candidateId === activeCandidate.id);
  const activeMsg = supportMessages.find((m) => m.id === selectedMsgId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* Top Banner Header */}
      <header className="bg-gradient-to-r from-[#1e1b4b] via-[#24083b] to-[#1e1b4b] text-white shadow-md border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white">
                  Case Manager Verification & Management Hub
                </span>
                <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Casey Profile
                </span>
              </div>
              <p className="text-xs text-purple-200">Straight Up Training • Workforce Australia PBAS Sign-off & Audit System</p>
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
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Submissions
            </button>
          </div>
        </div>
      </header>

      {/* Candidate Roster Selector Bar */}
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

      {/* Active Candidate Header Bar */}
      <section className="bg-white border-b border-slate-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                Workforce Australia ID: <span className="font-mono text-slate-700">{activeCandidate.waId}</span> • Target: <span className="font-bold text-purple-900">{activeCandidate.pbasTarget} Pts/Mo</span>
              </p>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'queue' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign-Off Queue
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'profile' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Candidate Profile
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'appointments' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Appointments
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'documents' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderLock className="w-3.5 h-3.5" /> Document Locker
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'communication' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Support Inbox
            </button>
            <button
              onClick={() => setActiveTab('exports')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'exports' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> DEWR Exports
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
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
                  <p className="text-xs font-bold text-slate-500 uppercase">Verified Points Credit</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">+{activeCandidate.verifiedPoints} Pts</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Monthly Compliance</p>
                  <p className="text-2xl font-black text-purple-900 mt-1">
                    {Math.min(Math.round(((activeCandidate.verifiedPoints + pendingPointsTotal) / activeCandidate.pbasTarget) * 100), 100)}%
                  </p>
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
                    <Search className="w-5 h-5 text-purple-700" /> Activity Verification Queue: {activeCandidate.name}
                  </h2>
                  <p className="text-xs text-slate-500">Audit candidate practice runs and credit PBAS points to official record.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {['All', 'Pending', 'Verified', 'Interview', 'Job Search'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                        filterType === type
                          ? 'bg-[#24083b] text-white border-[#24083b]'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Ref ID</th>
                      <th className="p-3">Points</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Audit & Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredActivities.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-400 font-medium">
                          No submissions found for {activeCandidate.name}.
                        </td>
                      </tr>
                    ) : (
                      filteredActivities.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50/80 transition-all">
                          <td className="p-3 font-semibold text-slate-500">{act.date}</td>
                          <td className="p-3 font-bold text-slate-800">{act.candidateName}</td>
                          <td className="p-3 font-bold text-purple-900">{act.type}</td>
                          <td className="p-3 text-slate-700">{act.title}</td>
                          <td className="p-3 font-mono text-slate-500 bg-slate-100/70 px-2 py-0.5 rounded text-[11px] w-max">
                            {act.reference}
                          </td>
                          <td className="p-3 font-extrabold text-emerald-600">+{act.points} Pts</td>
                          <td className="p-3">
                            {act.status === 'Verified' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                              </span>
                            ) : act.status === 'Rejected' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                                <XCircle className="w-3.5 h-3.5" /> Re-submission Needed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" /> Pending Casey Sign-off
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            {act.reportData && (
                              <button
                                onClick={() => setSelectedReport(act.reportData)}
                                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                              >
                                <Eye className="w-3.5 h-3.5" /> Audit Report
                              </button>
                            )}
                            {act.status === 'Pending Verification' && (
                              <>
                                <button
                                  onClick={() => handleApprove(act.id, act.points, act.candidateId)}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve (+{act.points})
                                </button>
                                <button
                                  onClick={() => handleReject(act.id)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg text-[11px] font-bold transition-all"
                                >
                                  Reject
                                </button>
                              </>
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

        {/* TAB 2: CANDIDATE PROFILE DATA */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
              <button
                onClick={() => setProfileSection('star')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all whitespace-nowrap ${
                  profileSection === 'star'
                    ? 'bg-[#24083b] text-white border-[#24083b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Award className="w-4 h-4" /> STAR Practice Runs
              </button>

              <button
                onClick={() => setProfileSection('job_search')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all whitespace-nowrap ${
                  profileSection === 'job_search'
                    ? 'bg-[#24083b] text-white border-[#24083b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Job Search Log
              </button>

              <button
                onClick={() => setProfileSection('pillars')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all whitespace-nowrap ${
                  profileSection === 'pillars'
                    ? 'bg-[#24083b] text-white border-[#24083b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> 5-Pillar Readiness
              </button>

              <button
                onClick={() => setProfileSection('lms')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all whitespace-nowrap ${
                  profileSection === 'lms'
                    ? 'bg-[#24083b] text-white border-[#24083b]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" /> LMS Modules & Certs
              </button>
            </div>

            {/* STAR PRACTICE LOGS */}
            {profileSection === 'star' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-[#24083b]">STAR Interview Submissions</h3>
                    <p className="text-xs text-slate-500">Recorded sessions and qualitative rubric evaluations for {activeCandidate.name}.</p>
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
                          className="px-3 py-1.5 bg-purple-900 text-white rounded-lg text-xs font-bold hover:bg-purple-950 transition-all flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect STAR Evaluation
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JOB SEARCH LOG */}
            {profileSection === 'job_search' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="font-extrabold text-base text-[#24083b]">Job Application History</h3>
                <p className="text-xs text-slate-500">Verified job applications logged by {activeCandidate.name} for PBAS compliance.</p>

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

            {/* 5-PILLAR READINESS */}
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

            {/* LMS MODULES */}
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
                    <button className="px-3 py-1.5 bg-purple-900 text-white rounded-lg text-xs font-bold hover:bg-purple-950 transition-all flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Inspect PDF Certificate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPOINTMENT SCHEDULER */}
        {activeTab === 'appointments' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#24083b] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-700" /> Mutual Obligation Appointment Scheduler
                </h3>
                <p className="text-xs text-slate-500">Schedule, adjust, or track compliance check-ins for {activeCandidate.name}.</p>
              </div>

              <button
                onClick={() => setShowAptModal(true)}
                className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" /> Schedule New Appointment
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {candidateApts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8 font-medium">No upcoming appointments scheduled for {activeCandidate.name}.</p>
              ) : (
                candidateApts.map((apt) => (
                  <div key={apt.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 text-[10px] font-bold rounded-full uppercase">
                          {apt.type}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{apt.location}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800">
                        Date: {apt.date} at {apt.time}
                      </h4>
                      <p className="text-[11px] text-slate-500">Assigned Candidate: <strong>{apt.candidateName}</strong></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {apt.status}
                      </span>
                      <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition-all">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENT LOCKER */}
        {activeTab === 'documents' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#24083b] flex items-center gap-2">
                  <FolderLock className="w-5 h-5 text-purple-700" /> Candidate Document Locker: {activeCandidate.name}
                </h3>
                <p className="text-xs text-slate-500">Download resumes and cover letters or upload provider job plans.</p>
              </div>

              <label className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-all">
                <Upload className="w-4 h-4" /> Upload Document
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {candidateDocs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center col-span-2 py-8 font-medium">No documents stored in locker for {activeCandidate.name}.</p>
              ) : (
                candidateDocs.map((doc) => (
                  <div key={doc.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-100 text-purple-800 rounded-xl">
                        <File className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{doc.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {doc.category} • {doc.size} • Uploaded by {doc.uploadedBy}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Downloading ${doc.name}...`)}
                      className="p-2 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200 rounded-lg transition-all"
                      title="Download File"
                    >
                      <Download className="w-4 h-4 text-purple-800" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SUPPORT INBOX & COACHING */}
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

        {/* TAB 6: DEWR EXPORTS */}
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
                <label className="block font-bold text-slate-700 mb-1">Monthly PBAS Points Target Schedule:</label>
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

      {/* MODAL 3: SCHEDULE APPOINTMENT */}
      {showAptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddAppointment} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 font-sans">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-base text-[#24083b]">Schedule Mutual Obligation Appointment</h3>
              <button type="button" onClick={() => setShowAptModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Appointment Type:</label>
                <select value={aptType} onChange={(e) => setAptType(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none font-bold text-purple-900">
                  <option value="Monthly PBAS Progress Audit">Monthly PBAS Progress Audit</option>
                  <option value="STAR Interview Coaching Session">STAR Interview Coaching Session</option>
                  <option value="Job Application & Resume Audit">Job Application & Resume Audit</option>
                  <option value="Job Placement Sign-off">Job Placement Sign-off</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date:</label>
                <input type="date" value={aptDate} onChange={(e) => setAptDate(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Time:</label>
                <input type="text" value={aptTime} onChange={(e) => setAptTime(e.target.value)} placeholder="e.g. 10:00 AM" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / Channel:</label>
                <select value={aptLocation} onChange={(e) => setAptLocation(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none">
                  <option value="Provider Office (In-Person)">Provider Office (In-Person)</option>
                  <option value="Phone Check-in">Phone Check-in</option>
                  <option value="Virtual Video Audit">Virtual Video Audit</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAptModal(false)} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl shadow-xs">
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: AUDIT STAR REPORT */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto font-sans">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase">
                    Audit Inspection
                  </span>
                  <span className="text-xs text-slate-400">{selectedReport.timestamp}</span>
                </div>
                <h3 className="font-extrabold text-lg text-[#24083b] mt-1">
                  STAR Interview Evaluation • {selectedReport.jobRole}
                </h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 font-bold text-lg px-2">✕</button>
            </div>

            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                <span>Rubric Rating: <strong className="text-emerald-700 text-sm ml-1">{selectedReport.rubricScore}</strong></span>
                <span className="text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 text-[10px]">
                  Participant: {activeCandidate.name}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                {selectedReport.feedbackNotes?.map((note: string, idx: number) => (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-purple-100 shadow-2xs">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">STAR Structure Response Analysis:</h4>
              
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-purple-900">Primary Question:</span>
                  <p className="text-slate-700 mt-0.5 font-medium">"{selectedReport.question}"</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Situation:</span>
                    <p className="text-slate-600">{selectedReport.situation}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Task:</span>
                    <p className="text-slate-600">{selectedReport.task}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Action:</span>
                    <p className="text-slate-600">{selectedReport.action}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Result:</span>
                    <p className="text-slate-600">{selectedReport.result}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  handleApprove(selectedReport.id, 25, activeCandidate.id);
                  setSelectedReport(null);
                }}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Approve Session & Credit +25 Pts
              </button>

              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CaseManager;