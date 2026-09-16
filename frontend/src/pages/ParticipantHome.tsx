import { CertifiedLmsModule } from '../components/CertifiedLmsModule';
import AppointmentsWidget from '../components/AppointmentsWidget';
import PointProjectionWheel from '../components/PointProjectionWheel';
import DocumentLocker from '../components/DocumentLocker';
import React, { useState, useEffect } from 'react';
import LmsModuleHub from '../components/LmsModuleHub';
import ResumeBuilder from '../components/ResumeBuilder';
import StarInterviewSimulator from '../components/StarInterviewSimulator';
import { 
  Briefcase, 
  Award, 
  LifeBuoy, 
  Trophy, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Clock, 
  Smile, 
  Send,
  FileText,
  UserCheck
} from 'lucide-react';

interface ActivityLog {
  id: string;
  type: 'Job Search' | 'Interview' | 'Job Placement' | 'LMS Module' | 'Confidence Review';
  title: string;
  reference: string;
  points: number;
  status: 'Pending Verification' | 'Verified';
  date: string;
  reportData?: any; // Stores full STAR interview report details
}

export const ParticipantHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [verifiedPoints, setVerifiedPoints] = useState<number>(35);
  const targetPoints = 100;

  // Monthly 5-Pillar Employability Review Banner State
  const [showConfidenceBanner, setShowConfidenceBanner] = useState<boolean>(true);
  const [pillarScores, setPillarScores] = useState<Record<string, number>>({
    'Job Search & Applications': 3,
    'Interview Readiness': 3,
    'Technical & Core Skills': 3,
    'Logistics & Transport': 3,
    'Mindset & Workplace Fit': 3,
  });
  const [primaryBlocker, setPrimaryBlocker] = useState<string>('Resume / Applications');
  const [reviewNote, setReviewNote] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Active Report Modal State
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Verification Activity Log State
  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: 'act-1',
      type: 'LMS Module',
      title: 'WHS Fundamentals & Safe Work',
      reference: 'MOD-WHS-01',
      points: 10,
      status: 'Verified',
      date: '10/09/2026',
    },
    {
      id: 'act-2',
      type: 'Job Search',
      title: 'Warehouse Assistant — Logistics Co',
      reference: 'JOB-98231',
      points: 5,
      status: 'Pending Verification',
      date: '14/09/2026',
    },
  ]);

  // Sync STAR Interview Practice sessions directly into the Activity Verification Log
  useEffect(() => {
    const syncStarActivityLog = (e?: any) => {
      try {
        let recordToSync = e?.detail;

        if (!recordToSync) {
          const storedHistory = localStorage.getItem('workready_star_history');
          if (!storedHistory) return;
          const parsedRecords = JSON.parse(storedHistory);
          if (parsedRecords.length === 0) return;
          recordToSync = parsedRecords[0];
        }

        setActivities((prev) => {
          const exists = prev.some((act) => act.id === recordToSync.id);
          if (exists) return prev;

          const newStarActivity: ActivityLog = {
            id: recordToSync.id,
            type: 'Interview',
            title: `STAR Practice: ${recordToSync.jobRole} (${recordToSync.rubricScore || 'Completed Session'})`,
            reference: `STAR-${recordToSync.id.slice(-6).toUpperCase()}`,
            points: 25,
            status: 'Pending Verification',
            date: recordToSync.date || new Date().toLocaleDateString('en-AU'),
            reportData: recordToSync
          };

          return [newStarActivity, ...prev];
        });
      } catch (err) {
        console.error('Error syncing STAR history to main log', err);
      }
    };

    syncStarActivityLog();

    window.addEventListener('starHistoryUpdated', syncStarActivityLog);
    return () => window.removeEventListener('starHistoryUpdated', syncStarActivityLog);
  }, []);

  // Modal States
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
  const [showJobSearchModal, setShowJobSearchModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Form Input States
  const [jsEmployer, setJsEmployer] = useState('');
  const [jsRole, setJsRole] = useState('');
  const [jsRef, setJsRef] = useState('');

  const [jobEmployer, setJobEmployer] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobRef, setJobRef] = useState('');

  const [intEmployer, setIntEmployer] = useState('');
  const [intRole, setIntRole] = useState('');
  const [intRef, setIntRef] = useState('');

  const handleModuleCompleted = (moduleId: string, points: number) => {
    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'LMS Module',
      title: `Completed Module #${moduleId}`,
      reference: `AUTO-${moduleId}`,
      points,
      status: 'Verified',
      date: new Date().toLocaleDateString('en-AU'),
    };
    setActivities((prev) => [newAct, ...prev]);
    setVerifiedPoints((prev) => Math.min(prev + points, targetPoints));
  };

  const handleConfidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scoresSummary = Object.entries(pillarScores)
      .map(([key, val]) => `${key.split(' ')[0]}: ${val}/5`)
      .join(', ');

    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Confidence Review',
      title: `5-Pillar Assessment (${primaryBlocker}) — [${scoresSummary}]`,
      reference: `REV-${new Date().getMonth() + 1}-2026`,
      points: 10,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
    };
    setActivities((prev) => [newAct, ...prev]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowConfidenceBanner(false);
    }, 4500);
  };

  const handleSubmitJobSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Job Search',
      title: `${jsRole} — ${jsEmployer}`,
      reference: jsRef || 'Ref Pending',
      points: 5,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowJobSearchModal(false);
    setJsEmployer(''); setJsRole(''); setJsRef('');
    alert("✨ Job search logged! Status: Pending Verification. Casey (Case Manager) will verify your points soon.");
  };

  const handleReportJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Job Placement',
      title: `${jobRole} — ${jobEmployer}`,
      reference: jobRef || 'Placement Ref',
      points: 50,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowJobModal(false);
    setJobEmployer(''); setJobRole(''); setJobRef('');
    alert("🎉 Job placement reported! Status: Pending Verification by Casey.");
  };

  const handleReportInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Interview',
      title: `${intRole} — ${intEmployer}`,
      reference: intRef || 'Interview Ref',
      points: 25,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowInterviewModal(false);
    setIntEmployer(''); setIntRole(''); setIntRef('');
    alert("💼 Interview reported! Status: Pending Verification by Casey.");
  };

  const handleRequestHelp = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHelpModal(false);
    alert("💬 High-priority support request sent directly to Casey.");
  };

  const pbasPercentage = Math.min(Math.round((verifiedPoints / targetPoints) * 100), 100);
  const pendingPoints = activities
    .filter((a) => a.status === 'Pending Verification')
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-[#24083b] via-[#320b52] to-[#24083b] text-white shadow-md border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo and Brand Title */}
            <div className="flex items-center gap-3 shrink-0">
              <img
                src="/logo.png"
                alt="Straight Up Training Logo"
                className="h-10 w-auto object-contain bg-white/10 p-1.5 rounded-xl border border-white/20"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-white font-heading">
                    Straight Up Training
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    WorkReady Partner
                  </span>
                </div>
                <p className="text-xs text-purple-200">Candidate Portal • Powered by Workforce Australia PBAS</p>
              </div>
            </div>

            {/* Top Action Buttons: Job & Interview Reporting */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowJobModal(true)}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                🎉 I Got the Job! (+50 Pts)
              </button>
              <button
                onClick={() => setShowInterviewModal(true)}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                📅 I Got an Interview! (+25 Pts)
              </button>
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('role');
                  window.history.pushState({}, '', url.pathname);
                  window.dispatchEvent(new Event('popstate'));
                }}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Inviting Sub-Header */}
      <section className="bg-white border-b border-slate-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-[#24083b] tracking-tight">
              Your Career Journey Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Welcome back, Alex! Explore training, build your job kit, and track your progress.
            </p>
          </div>

          <button
            onClick={() => setShowHelpModal(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-all"
          >
            <LifeBuoy className="w-4 h-4 text-amber-600" /> Need Support? Message Casey 💬
          </button>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* MONTHLY 5-PILLAR EMPLOYABILITY REVIEW BANNER */}
        {showConfidenceBanner && (
          <section className="bg-gradient-to-r from-purple-900 via-[#24083b] to-purple-950 text-white rounded-2xl p-6 shadow-lg border border-purple-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {!reviewSubmitted ? (
              <form onSubmit={handleConfidenceSubmit} className="space-y-4 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                      <Smile className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Employability Self-Assessment</h2>
                      <p className="text-xs text-purple-200">Rate your confidence across key pillars (1 = Low, 5 = High) so Casey can tailor your support.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-purple-800/80 text-purple-200 px-3 py-1 rounded-full border border-purple-700">
                    Earns +10 PBAS Points
                  </span>
                </div>

                {/* 5-Pillar Rating Grid */}
                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-bold text-purple-200">1. Rate your 5 Key Employability Pillars:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.keys(pillarScores).map((pillar) => (
                      <div key={pillar} className="bg-purple-950/70 p-3 rounded-xl border border-purple-700/60 flex flex-col justify-between space-y-2">
                        <span className="text-[11px] font-bold text-purple-200 leading-tight h-7 flex items-center">
                          {pillar}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setPillarScores((prev) => ({ ...prev, [pillar]: score }))}
                              className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${
                                pillarScores[pillar] === score
                                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-400/40 font-black shadow-md'
                                  : 'bg-purple-900/40 text-purple-200 border-purple-700/50 hover:bg-purple-800'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Primary Blocker */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-purple-200">2. Current Primary Challenge:</label>
                    <select
                      value={primaryBlocker}
                      onChange={(e) => setPrimaryBlocker(e.target.value)}
                      className="w-full p-2.5 bg-purple-950/80 border border-purple-700 text-purple-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="Resume / Applications">Resume & ATS Applications</option>
                      <option value="Interview Anxiety">Interview Anxiety / Practice</option>
                      <option value="Transport / Location">Transport & Location</option>
                      <option value="Mental Health / Motivation">Mental Health & Motivation</option>
                      <option value="Childcare / Scheduling">Childcare / Family Schedule</option>
                      <option value="No Major Blockers">No Major Blockers (On Track!)</option>
                    </select>
                  </div>

                  {/* Quick Note for Case Manager */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-purple-200">3. Quick Note for Casey (Optional):</label>
                    <input
                      type="text"
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="e.g. Need help updating my forklift experience..."
                      className="w-full p-2.5 bg-purple-950/80 border border-purple-700 text-purple-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" /> Submit Assessment to Casey (+10 Pts)
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-2 animate-fadeIn relative z-10">
                <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 mb-1">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-white">Employability Assessment Submitted! 🎉</h3>
                <p className="text-xs text-purple-200 max-w-lg mx-auto">
                  Thank you, Alex! Your score breakdown across all 5 pillars and note regarding <strong>"{primaryBlocker}"</strong> have been sent to Casey for review.
                </p>
              </div>
            )}
          </section>
        )}

        {/* 3 Main Action Navigation Cards */}
        <section aria-label="Main Navigation" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab(1)}
            className={`p-5 rounded-2xl text-left border transition-all shadow-sm hover:shadow-md ${
              activeTab === 1
                ? 'bg-gradient-to-br from-white to-purple-50/40 border-[#24083b] ring-2 ring-[#24083b]/20'
                : 'bg-white border-slate-200 hover:border-purple-200 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-2.5 rounded-xl ${activeTab === 1 ? 'bg-[#24083b] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                LMS Modules
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">Core Skills & Orientation</div>
            <div className="text-xs text-slate-500 mt-1">Interactive modules, WHS safety, & practical skill building.</div>
          </button>

          <button
            onClick={() => setActiveTab(2)}
            className={`p-5 rounded-2xl text-left border transition-all shadow-sm hover:shadow-md ${
              activeTab === 2
                ? 'bg-gradient-to-br from-white to-purple-50/40 border-[#24083b] ring-2 ring-[#24083b]/20'
                : 'bg-white border-slate-200 hover:border-purple-200 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-2.5 rounded-xl ${activeTab === 2 ? 'bg-[#24083b] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Award className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                AI Coach Included
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">Job Readiness Toolkit</div>
            <div className="text-xs text-slate-500 mt-1">AI STAR Interview Simulator & ATS Resume / Cover Letter Builder.</div>
          </button>

          <button
            onClick={() => setActiveTab(3)}
            className={`p-5 rounded-2xl text-left border transition-all shadow-sm hover:shadow-md ${
              activeTab === 3
                ? 'bg-gradient-to-br from-white to-emerald-50/40 border-[#16a34a] ring-2 ring-[#16a34a]/20'
                : 'bg-white border-slate-200 hover:border-emerald-200 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-2.5 rounded-xl ${activeTab === 3 ? 'bg-[#16a34a] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Trophy className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                Verification Hub
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">Placement & PBAS Progress</div>
            <div className="text-xs font-semibold text-[#16a34a] mt-1">
              {verifiedPoints} Verified Pts {pendingPoints > 0 && <span className="text-amber-600">({pendingPoints} Pending)</span>}
            </div>
          </button>
        </section>

        {/* Dynamic Tab Body Views */}
        <div className="mt-4">
          {activeTab === 1 && (
            <div className="space-y-4">
              <LmsModuleHub onModuleCompleted={handleModuleCompleted} />
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-8">
              <StarInterviewSimulator />
              <div className="border-t border-slate-200 pt-8">
                <ResumeBuilder maxAttempts={3} />
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-6">
              <AppointmentsWidget />
              <PointProjectionWheel verifiedPoints={verifiedPoints} pendingPoints={pendingPoints} targetPoints={targetPoints} />
              <DocumentLocker />
              
              {/* Compliance & Verification Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#24083b]">Workforce Australia Mutual Obligation Summary</h2>
                    <p className="text-xs text-slate-500">Points commit to your official total once verified by Casey (Case Manager).</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-[#16a34a] border border-emerald-200 font-bold text-xs rounded-full">
                      {verifiedPoints} Verified Points
                    </span>
                    {pendingPoints > 0 && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {pendingPoints} Pending Approval
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Target Goal: {targetPoints} PBAS Points</span>
                    <span>{pbasPercentage}% Achieved</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-[#16a34a] to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pbasPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Job Search & Verification Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#24083b] flex items-center gap-2">
                      <Search className="w-5 h-5 text-[#16a34a]" /> Activity Verification Log
                    </h3>
                    <p className="text-xs text-slate-500">Track submitted job searches, interviews, and placements awaiting Case Manager sign-off.</p>
                  </div>
                  <button
                    onClick={() => setShowJobSearchModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    + Log New Job Search
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-3">Date</th>
                        <th className="p-3">Activity Type</th>
                        <th className="p-3">Title / Employer</th>
                        <th className="p-3">Verification ID</th>
                        <th className="p-3">Points</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Report</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activities.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50/80 transition-all">
                          <td className="p-3 font-semibold text-slate-500">{act.date}</td>
                          <td className="p-3 font-bold text-slate-800">{act.type}</td>
                          <td className="p-3 text-slate-700">{act.title}</td>
                          <td className="p-3 font-mono text-slate-500 bg-slate-100/60 px-2 py-1 rounded w-max text-[11px]">{act.reference}</td>
                          <td className="p-3 font-bold text-emerald-600">+{act.points} Pts</td>
                          <td className="p-3">
                            {act.status === 'Verified' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" /> Submitted (Pending)
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {act.reportData ? (
                              <button
                                onClick={() => setSelectedReport(act.reportData)}
                                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                              >
                                <FileText className="w-3.5 h-3.5" /> View Report
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* MODAL: STAR MOCK INTERVIEW SESSION REPORT */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase">
                    Official Session Log
                  </span>
                  <span className="text-xs text-slate-400">{selectedReport.timestamp}</span>
                </div>
                <h3 className="font-extrabold text-lg text-[#24083b] mt-1">
                  STAR Interview Evaluation • {selectedReport.jobRole}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                <span>Rubric Rating: <strong className="text-emerald-700 text-sm">{selectedReport.rubricScore || 'Proficient STAR Execution'}</strong></span>
                <span className="text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Pending Case Manager Approval (+25 Pts)
                </span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pt-1">
                {selectedReport.feedbackNotes?.map((note: string, idx: number) => (
                  <li key={idx}>{note}</li>
                )) || <li>Completed 8 scenario questions across key industry competencies.</li>}
              </ul>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">STAR Scenario Response Breakdown:</h4>
              
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-purple-900">Primary Scenario:</span>
                  <p className="text-slate-700 mt-0.5 font-medium">"{selectedReport.question}"</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Situation & Context:</span>
                    <p className="text-slate-600">{selectedReport.situation}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Task Responsibility:</span>
                    <p className="text-slate-600">{selectedReport.task}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Personal Action Taken:</span>
                    <p className="text-slate-600">{selectedReport.action}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Measurable Outcome / Result:</span>
                    <p className="text-slate-600">{selectedReport.result}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <UserCheck className="w-4 h-4 text-purple-700" /> Prepared for Casey (Case Manager) Review
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2 bg-[#24083b] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#320b52] transition-all"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: JOB SEARCH REPORTING */}
      {showJobSearchModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmitJobSearch} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Log Job Search Effort 🔎</h3>
              <button type="button" onClick={() => setShowJobSearchModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <p className="text-xs text-slate-500">Provide proof details (Job ID, reference, or portal link). Points convert after Casey verifies.</p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Employer / Business Name *</label>
                <input required type="text" value={jsEmployer} onChange={(e) => setJsEmployer(e.target.value)} placeholder="e.g. Coles Supermarkets" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title Applied For *</label>
                <input required type="text" value={jsRole} onChange={(e) => setJsRole(e.target.value)} placeholder="e.g. Nightfill Team Member" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification Job ID / Advert Reference *</label>
                <input required type="text" value={jsRef} onChange={(e) => setJsRef(e.target.value)} placeholder="e.g. SEEK-882194 or Receipt #10293" className="w-full p-2.5 border rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowJobSearchModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-[#24083b] text-white font-bold rounded-xl shadow-sm">Submit Effort (+5 Pts Pending)</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: GOT A JOB */}
      {showJobModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleReportJob} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Report New Employment 🎉</h3>
              <button type="button" onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Employer Name *</label>
                <input required type="text" value={jobEmployer} onChange={(e) => setJobEmployer(e.target.value)} placeholder="e.g. Apex Logistics" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Position Title *</label>
                <input required type="text" value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="e.g. Forklift Driver" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification / Contract Ref *</label>
                <input required type="text" value={jobRef} onChange={(e) => setJobRef(e.target.value)} placeholder="e.g. Contract ID #4920" className="w-full p-2.5 border rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowJobModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-[#16a34a] text-white font-bold rounded-xl shadow-sm">Submit Placement (+50 Pts Pending)</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: GOT AN INTERVIEW */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleReportInterview} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Report Upcoming Interview 💼</h3>
              <button type="button" onClick={() => setShowInterviewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Employer Name *</label>
                <input required type="text" value={intEmployer} onChange={(e) => setIntEmployer(e.target.value)} placeholder="e.g. Star Hospitality" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Position Title *</label>
                <input required type="text" value={intRole} onChange={(e) => setIntRole(e.target.value)} placeholder="e.g. Barista / All-Rounder" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Invite Ref / Confirmation *</label>
                <input required type="text" value={intRef} onChange={(e) => setIntRef(e.target.value)} placeholder="e.g. Email Invite Ref #8821" className="w-full p-2.5 border rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowInterviewModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-purple-600 text-white font-bold rounded-xl shadow-sm">Submit Interview (+25 Pts Pending)</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: REQUEST HELP */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRequestHelp} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Request Support from Casey 💬</h3>
              <button type="button" onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <textarea required rows={4} placeholder="Let Casey know what assistance or resources you need..." className="w-full p-2.5 border rounded-xl" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowHelpModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-amber-600 text-white font-bold rounded-xl shadow-sm">Send Priority Alert</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ParticipantHome;