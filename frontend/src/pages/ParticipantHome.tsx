import { CertifiedLmsModule } from '../components/CertifiedLmsModule';
import AppointmentsWidget from '../components/AppointmentsWidget';
import PointProjectionWheel from '../components/PointProjectionWheel';
import DocumentLocker from '../components/DocumentLocker';
import React, { useState, useEffect } from 'react';
import LmsModuleHub from '../components/LmsModuleHub';
import ResumeBuilder from '../components/ResumeBuilder';
import StarInterviewSimulator from '../components/StarInterviewSimulator';
import { usePortal } from '../context/PortalContext';
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
  UserCheck,
  PartyPopper,
  Sparkles,
  Zap,
  Star,
  Download
} from 'lucide-react';

interface ActivityLog {
  id: string;
  type: 'Job Search' | 'Interview' | 'Job Placement' | 'LMS Module' | 'Confidence Review';
  title: string;
  reference: string;
  points: number;
  status: 'Pending Verification' | 'Verified';
  date: string;
  reportData?: any;
}

export const ParticipantHome: React.FC = () => {
  const { candidates } = usePortal();
  const activeCandidate = candidates[0];

  const programType = activeCandidate?.programType || 'workforce_australia';
  const isRtoGraduate = programType === 'rto_graduate';
  const isTtW = programType === 'ttw';

  const [activeTab, setActiveTab] = useState<number>(1);
  const [verifiedPoints, setVerifiedPoints] = useState<number>(activeCandidate?.pbasVerified ?? 35);
  const targetPoints = activeCandidate?.pbasTarget ?? 100;

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

  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: 'act-1',
      type: 'LMS Module',
      title: 'WHS Fundamentals & Safe Work',
      reference: 'MOD-WHS-01',
      points: isRtoGraduate ? 0 : 10,
      status: 'Verified',
      date: '10/09/2026',
    },
    {
      id: 'act-2',
      type: 'Job Search',
      title: 'Warehouse Assistant — Logistics Co',
      reference: 'JOB-98231',
      points: isRtoGraduate ? 0 : 5,
      status: 'Pending Verification',
      date: '14/09/2026',
    },
  ]);

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

          const pointsAwarded = recordToSync.points || 0;

          const newStarActivity: ActivityLog = {
            id: recordToSync.id,
            type: 'Interview',
            title: `STAR Practice: ${recordToSync.jobRole} (${recordToSync.rubricScore || 'Completed Session'})`,
            reference: `STAR-${recordToSync.id.slice(-6).toUpperCase()}`,
            points: isRtoGraduate ? 0 : pointsAwarded,
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
  }, [isRtoGraduate]);

  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
  const [showJobSearchModal, setShowJobSearchModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

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
      points: isRtoGraduate ? 0 : points,
      status: 'Verified',
      date: new Date().toLocaleDateString('en-AU'),
    };
    setActivities((prev) => [newAct, ...prev]);
    if (!isRtoGraduate) {
      setVerifiedPoints((prev) => Math.min(prev + points, targetPoints));
    }
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
      points: isRtoGraduate ? 0 : 10,
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
      points: isRtoGraduate ? 0 : 5,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowJobSearchModal(false);
    setJsEmployer(''); setJsRole(''); setJsRef('');
    alert(isRtoGraduate 
      ? "✨ Job search logged in your portfolio!" 
      : "✨ Job search logged! Status: Pending Verification by your Case Manager.");
  };

  const handleReportJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Job Placement',
      title: `${jobRole} — ${jobEmployer}`,
      reference: jobRef || 'Placement Ref',
      points: isRtoGraduate ? 0 : 50,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowJobModal(false);
    setJobEmployer(''); setJobRole(''); setJobRef('');
    alert("🎉 Job placement reported! Congratulations!");
  };

  const handleReportInterview = (e: React.FormEvent) => {
    e.preventDefault();
    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Interview',
      title: `${intRole} — ${intEmployer}`,
      reference: intRef || 'Interview Ref',
      points: isRtoGraduate ? 0 : 25,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowInterviewModal(false);
    setIntEmployer(''); setIntRole(''); setIntRef('');
    alert("💼 Interview reported! Good luck!");
  };

  const handleRequestHelp = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHelpModal(false);
    alert("💬 High-priority support request sent.");
  };

  const pbasPercentage = Math.min(Math.round((verifiedPoints / (targetPoints || 1)) * 100), 100);
  const pendingPoints = activities
    .filter((a) => a.status === 'Pending Verification')
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* HEADER BANNER */}
      <header className="bg-gradient-to-r from-[#1c0630] via-[#2a0945] to-[#1c0630] text-white shadow-xl border-b border-purple-900/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* BRANDING CONTAINER */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-0.5 border-2 border-purple-200/80 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Straight Up Training Logo"
                  className="w-full h-full object-contain scale-115"
                  onError={(e) => { 
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = (e.target as HTMLElement).nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <Award className="w-10 h-10 text-[#24083b] hidden" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl sm:text-3xl tracking-tight text-white font-heading leading-none drop-shadow-sm">
                    Straight Up Training
                  </span>
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    {isRtoGraduate ? "Graduate Portal" : isTtW ? "TtW Partner" : "WorkReady Partner"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-purple-200 mt-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  {isRtoGraduate ? "Graduate Career & Employability Hub" : "Candidate Career & Skills Portal"}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowInterviewModal(true)}
                className="group relative flex-1 md:flex-none px-5 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2.5 border-2 border-amber-300 overflow-hidden"
              >
                <div className="p-1.5 bg-slate-950/10 rounded-xl group-hover:rotate-12 transition-transform">
                  <Briefcase className="w-4 h-4 text-slate-950" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-slate-950 font-black tracking-wide text-xs sm:text-sm">I Got an Interview!</span>
                  <span className="text-[10px] text-slate-900 font-extrabold uppercase opacity-90">
                    {isRtoGraduate ? "Log Opportunity" : isTtW ? "+20m Activity" : "+25 PBAS Points"}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setShowJobModal(true)}
                className="group relative flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2.5 border-2 border-emerald-300/80 overflow-hidden"
              >
                <div className="p-1.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <PartyPopper className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-white font-black tracking-wide text-xs sm:text-sm flex items-center gap-1">
                    I Got the Job! <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  </span>
                  <span className="text-[10px] text-emerald-100 font-extrabold uppercase">
                    {isRtoGraduate ? "Career Milestone" : isTtW ? "Verified Outcome" : "+50 PBAS Points"}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('role');
                  window.history.pushState({}, '', url.pathname);
                  window.dispatchEvent(new Event('popstate'));
                }}
                className="px-3.5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-2xl transition-all"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Sub-Header */}
      <section className="bg-white border-b border-slate-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-[#24083b] tracking-tight">
              {isRtoGraduate ? "Graduate Career & Employment Dashboard" : "Your Career Journey Dashboard"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Welcome back, {activeCandidate?.name || "Alex"}! Explore training, build your job kit, and track your progress.
            </p>
          </div>

          <button
            onClick={() => setShowHelpModal(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-all"
          >
            <LifeBuoy className="w-4 h-4 text-amber-600" /> Need Support? Send Message 💬
          </button>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* EMPLOYABILITY REVIEW BANNER */}
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
                      <p className="text-xs text-purple-200">Rate your confidence across key pillars (1 = Low, 5 = High) to tailor your ongoing support.</p>
                    </div>
                  </div>
                  {!isRtoGraduate && (
                    <span className="text-[11px] font-bold bg-purple-800/80 text-purple-200 px-3 py-1 rounded-full border border-purple-700">
                      Earns +10 Points
                    </span>
                  )}
                </div>

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

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-purple-200">3. Quick Note (Optional):</label>
                    <input
                      type="text"
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="e.g. Want advice on tailoring my resume for entry-level roles..."
                      className="w-full p-2.5 bg-purple-950/80 border border-purple-700 text-purple-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" /> Submit Assessment
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-2 animate-fadeIn relative z-10">
                <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 mb-1">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-white">Assessment Submitted! 🎉</h3>
                <p className="text-xs text-purple-200 max-w-lg mx-auto">
                  Thank you! Your breakdown across all 5 pillars and note regarding <strong>"{primaryBlocker}"</strong> have been recorded.
                </p>
              </div>
            )}
          </section>
        )}

        {/* 3 MAIN ACTION NAVIGATION CARDS */}
        <section aria-label="Main Navigation" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab(1)}
            className={`group relative p-5 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md ${
              activeTab === 1
                ? 'bg-gradient-to-br from-purple-50/90 via-white to-purple-100/50 border-2 border-[#24083b] ring-2 ring-[#24083b]/20 ring-offset-2'
                : 'bg-white border-2 border-slate-200 hover:border-purple-300 hover:-translate-y-0.5 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-3 rounded-xl transition-colors ${
                activeTab === 1 
                  ? 'bg-[#24083b] text-amber-300 shadow-md shadow-purple-900/20' 
                  : 'bg-purple-100 text-[#24083b] group-hover:bg-[#24083b] group-hover:text-white'
              }`}>
                <BookOpen className="w-6 h-6" />
              </span>

              {activeTab === 1 ? (
                <span className="text-[11px] font-black text-[#24083b] bg-amber-300 px-2.5 py-1 rounded-full border border-amber-400 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#24083b]" /> Active Section
                </span>
              ) : (
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  24 Modules Available
                </span>
              )}
            </div>

            <div>
              <div className="text-base font-black text-slate-900 group-hover:text-[#24083b] transition-colors">
                {isRtoGraduate ? "Graduate Skills & Learning Hub" : "Core Skills & Learning Hub"}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                Interactive learning, WHS workplace safety, and downloadable certificates designed to build your job skills step-by-step.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab(2)}
            className={`group relative p-5 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md ${
              activeTab === 2
                ? 'bg-gradient-to-br from-indigo-50/90 via-white to-indigo-100/50 border-2 border-indigo-700 ring-2 ring-indigo-700/20 ring-offset-2'
                : 'bg-white border-2 border-slate-200 hover:border-indigo-300 hover:-translate-y-0.5 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-3 rounded-xl transition-colors ${
                activeTab === 2 
                  ? 'bg-indigo-700 text-amber-300 shadow-md shadow-indigo-900/20' 
                  : 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-700 group-hover:text-white'
              }`}>
                <Award className="w-6 h-6" />
              </span>

              {activeTab === 2 ? (
                <span className="text-[11px] font-black text-indigo-950 bg-amber-300 px-2.5 py-1 rounded-full border border-amber-400 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-950" /> Active Section
                </span>
              ) : (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Smart AI Coach
                </span>
              )}
            </div>

            <div>
              <div className="text-base font-black text-slate-900 group-hover:text-indigo-800 transition-colors">
                Job Readiness Toolkit
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                Practice interview questions with your personal AI simulator and create professional, employer-ready resumes in minutes.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab(3)}
            className={`group relative p-5 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md ${
              activeTab === 3
                ? 'bg-gradient-to-br from-emerald-50/90 via-white to-emerald-100/50 border-2 border-[#16a34a] ring-2 ring-[#16a34a]/20 ring-offset-2'
                : 'bg-white border-2 border-slate-200 hover:border-emerald-300 hover:-translate-y-0.5 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-3 rounded-xl transition-colors ${
                activeTab === 3 
                  ? 'bg-[#16a34a] text-white shadow-md shadow-emerald-900/20' 
                  : 'bg-emerald-100 text-[#16a34a] group-hover:bg-[#16a34a] group-hover:text-white'
              }`}>
                <Trophy className="w-6 h-6" />
              </span>

              {activeTab === 3 ? (
                <span className="text-[11px] font-black text-slate-950 bg-amber-300 px-2.5 py-1 rounded-full border border-amber-400 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-slate-950" /> Active Section
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {isRtoGraduate ? "Career Portfolio" : `${verifiedPoints} Pts Earned`}
                </span>
              )}
            </div>

            <div>
              <div className="text-base font-black text-slate-900 group-hover:text-[#16a34a] transition-colors">
                {isRtoGraduate ? "Career Portfolio & Activity Log" : "Verification & Progress Hub"}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                {isRtoGraduate
                  ? "Track your job application history, store key career documents, and view upcoming appointments."
                  : "Track your verified mutual obligation points, log job application efforts, access document locker, and view appointments."}
              </p>
            </div>
          </button>
        </section>

        {/* Dynamic Tab Body Views */}
        <div className="mt-4">
          {activeTab === 1 && (
            <div className="space-y-4">
              <LmsModuleHub onModuleCompleted={handleModuleCompleted} candidateId={activeCandidate?.id} />
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
              
              {!isRtoGraduate && (
                <PointProjectionWheel verifiedPoints={verifiedPoints} pendingPoints={pendingPoints} targetPoints={targetPoints} />
              )}

              <DocumentLocker />
              
              {!isRtoGraduate && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                  <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-[#24083b]">
                        {isTtW ? "Transition to Work Activity Summary" : "Workforce Australia Mutual Obligation Summary"}
                      </h2>
                      <p className="text-xs text-slate-500">Points commit to your official total once verified.</p>
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
              )}

              {/* Activity Verification Log Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#24083b] flex items-center gap-2">
                      <Search className="w-5 h-5 text-[#16a34a]" /> Activity Verification Log
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isRtoGraduate 
                        ? "Track submitted job applications, interviews, and placement milestones." 
                        : "Track submitted job searches, interviews, and placements awaiting sign-off."}
                    </p>
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
                        {!isRtoGraduate && <th className="p-3">Points</th>}
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
                          {!isRtoGraduate && (
                            <td className="p-3 font-bold">
                              {act.points > 0 ? (
                                <span className="text-emerald-600">+{act.points} Pts</span>
                              ) : (
                                <span className="text-slate-400">0 Pts</span>
                              )}
                            </td>
                          )}
                          <td className="p-3">
                            {act.status === 'Verified' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" /> Submitted
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

      {/* MODAL VIEW REPORT */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Official Verification Log
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{selectedReport.timestamp || selectedReport.date}</span>
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

            {/* Rubric Rating & Point Status */}
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-purple-900">
                <span>Rubric Rating: <strong className="text-emerald-700 text-sm">{selectedReport.rubricScore || 'Proficient STAR Execution'}</strong></span>
                {!isRtoGraduate && (
                  selectedReport.points && selectedReport.points > 0 ? (
                    <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 font-black text-[11px]">
                      +25 PBAS Points Submitted (Pending CM Sign-off)
                    </span>
                  ) : (
                    <span className="text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 font-bold text-[11px]">
                      Session {selectedReport.sessionNumber || 1}/3 Logged (0 Pts)
                    </span>
                  )
                )}
              </div>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pt-1 font-medium">
                {selectedReport.feedbackNotes?.map((note: string, idx: number) => (
                  <li key={idx}>{note}</li>
                )) || <li>Completed scenario questions across key industry competencies.</li>}
              </ul>
            </div>

            {/* STAR Scenario Breakdown */}
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
                    <p className="text-slate-600 font-medium">
                      {selectedReport.situation || selectedReport.summaryReport?.detailedBreakdown?.[0]?.answer || "Context provided in response."}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Task Responsibility:</span>
                    <p className="text-slate-600 font-medium">
                      {selectedReport.task || selectedReport.summaryReport?.detailedBreakdown?.[1]?.answer || "Role responsibility detailed."}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Personal Action Taken:</span>
                    <p className="text-slate-600 font-medium">
                      {selectedReport.action || selectedReport.summaryReport?.detailedBreakdown?.[2]?.answer || "Proactive actions taken."}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Measurable Outcome / Result:</span>
                    <p className="text-slate-600 font-medium">
                      {selectedReport.result || selectedReport.summaryReport?.detailedBreakdown?.[3]?.answer || "Positive outcome achieved."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <UserCheck className="w-4 h-4 text-purple-700" /> Prepared for Case Manager Verification
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (!printWindow) {
                      alert("Please allow pop-ups to generate your PDF Evidence Report.");
                      return;
                    }

                    const situationText = selectedReport.situation || selectedReport.summaryReport?.detailedBreakdown?.[0]?.answer || "Candidate described workplace context and environment.";
                    const taskText = selectedReport.task || selectedReport.summaryReport?.detailedBreakdown?.[1]?.answer || "Candidate outlined role responsibilities and safety standards.";
                    const actionText = selectedReport.action || selectedReport.summaryReport?.detailedBreakdown?.[2]?.answer || "Candidate executed proactive steps using team communication.";
                    const resultText = selectedReport.result || selectedReport.summaryReport?.detailedBreakdown?.[3]?.answer || "Candidate achieved positive outcome with zero WHS incidents.";

                    const candidateName = activeCandidate?.name || 'Alex Mercer';
                    const timeStamp = selectedReport.timestamp || selectedReport.date || new Date().toLocaleString('en-AU');
                    const jobRole = selectedReport.jobRole || 'Administration & Support';
                    const rubricScore = selectedReport.rubricScore || selectedReport.summaryReport?.scoreText || 'Confident Communicator • High Professional Alignment';
                    const pointsText = selectedReport.points > 0 ? '+25 PBAS Points Submitted' : `Session ${selectedReport.sessionNumber || 1}/3 Completed (0 Pts)`;

                    const feedbackList = selectedReport.feedbackNotes || selectedReport.summaryReport?.keyTakeaways || [
                      "Completed 8 scenario questions across key industry competencies.",
                      "Used clear first-person ('I') statements to demonstrate personal accountability.",
                      "Maintained strong alignment with Australian workplace WHS safety standards."
                    ];

                    const logoUrl = window.location.origin + '/logo.png';

                    const htmlContent = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>STAR Interview Practice Evidence - ${jobRole}</title>
                        <style>
                          @page {
                            size: A4;
                            margin: 12mm 15mm 12mm 15mm;
                          }
                          body { 
                            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif; 
                            color: #0f172a; 
                            background: #ffffff;
                            margin: 0; 
                            padding: 0;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                          }
                          .header-container { 
                            display: flex; 
                            justify-content: space-between; 
                            align-items: center; 
                            border-bottom: 3px solid #24083b; 
                            padding-bottom: 16px; 
                            margin-bottom: 20px; 
                          }
                          .logo-box {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                          }
                          .logo-img {
                            width: 52px;
                            height: 52px;
                            object-fit: contain;
                            border-radius: 8px;
                            border: 1.5px solid #24083b;
                            padding: 2px;
                            background: #ffffff;
                          }
                          .brand-title { 
                            font-size: 20px; 
                            font-weight: 900; 
                            color: #24083b; 
                            letter-spacing: -0.5px;
                            line-height: 1;
                          }
                          .brand-sub { 
                            font-size: 11px; 
                            font-weight: 800; 
                            color: #16a34a; 
                            text-transform: uppercase; 
                            letter-spacing: 0.8px;
                            margin-top: 4px;
                          }
                          .badge-pbas { 
                            background: #dcfce7; 
                            color: #15803d; 
                            border: 1px solid #86efac;
                            padding: 6px 14px; 
                            border-radius: 20px; 
                            font-weight: 900; 
                            font-size: 11px; 
                            display: inline-block;
                          }
                          .meta-card { 
                            background: #f8fafc; 
                            padding: 14px 18px; 
                            border-radius: 12px; 
                            border: 1px solid #e2e8f0; 
                            margin-bottom: 22px; 
                          }
                          .meta-grid {
                            display: grid; 
                            grid-template-columns: repeat(2, 1fr); 
                            gap: 12px 20px;
                            font-size: 12px;
                          }
                          .meta-label { 
                            font-weight: 800; 
                            color: #64748b; 
                            text-transform: uppercase; 
                            font-size: 9.5px; 
                            letter-spacing: 0.5px;
                          }
                          .meta-value { 
                            font-weight: 800; 
                            color: #0f172a; 
                            margin-top: 2px;
                            font-size: 12px;
                          }
                          .section-heading { 
                            font-size: 12px; 
                            font-weight: 900; 
                            color: #24083b; 
                            text-transform: uppercase; 
                            letter-spacing: 0.6px;
                            border-bottom: 2px solid #cbd5e1; 
                            padding-bottom: 4px; 
                            margin-top: 20px; 
                            margin-bottom: 10px; 
                          }
                          .box-strength { 
                            background: #f0fdf4; 
                            border-left: 4px solid #16a34a; 
                            padding: 12px 15px; 
                            border-radius: 0 10px 10px 0; 
                            margin-bottom: 14px; 
                            font-size: 11.5px; 
                            line-height: 1.55; 
                          }
                          .box-support { 
                            background: #fffbeb; 
                            border-left: 4px solid #f59e0b; 
                            padding: 12px 15px; 
                            border-radius: 0 10px 10px 0; 
                            margin-bottom: 14px; 
                            font-size: 11.5px; 
                            line-height: 1.55; 
                          }
                          .box-title {
                            font-weight: 800;
                            margin-bottom: 4px;
                            display: block;
                          }
                          .star-grid {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 10px;
                            margin-top: 8px;
                          }
                          .star-card {
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            padding: 10px 12px;
                            border-radius: 8px;
                            font-size: 11px;
                            line-height: 1.45;
                          }
                          .star-card-title {
                            font-weight: 800;
                            color: #16a34a;
                            display: block;
                            margin-bottom: 3px;
                            font-size: 10.5px;
                            text-transform: uppercase;
                          }
                          .footer-note { 
                            margin-top: 30px; 
                            border-top: 1px solid #e2e8f0; 
                            padding-top: 12px; 
                            font-size: 9.5px; 
                            text-align: center; 
                            color: #64748b; 
                            font-weight: 600;
                          }
                        </style>
                      </head>
                      <body>
                        <div class="header-container">
                          <div class="logo-box">
                            <img src="${logoUrl}" class="logo-img" alt="Logo" onerror="this.style.display='none'" />
                            <div>
                              <div class="brand-title">STRAIGHT UP TRAINING</div>
                              <div class="brand-sub">WorkReady Career & Employability Hub</div>
                            </div>
                          </div>
                          <div>
                            <span class="badge-pbas">${pointsText}</span>
                          </div>
                        </div>

                        <div class="meta-card">
                          <div class="meta-grid">
                            <div>
                              <div class="meta-label">Candidate Name</div>
                              <div class="meta-value">${candidateName}</div>
                            </div>
                            <div>
                              <div class="meta-label">Date & Time Stamp</div>
                              <div class="meta-value">${timeStamp}</div>
                            </div>
                            <div>
                              <div class="meta-label">Target Industry</div>
                              <div class="meta-value">${jobRole}</div>
                            </div>
                            <div>
                              <div class="meta-label">Performance Rubric Rating</div>
                              <div class="meta-value" style="color: #15803d;">${rubricScore}</div>
                            </div>
                          </div>
                        </div>

                        <div class="section-heading">1. Identified Strengths (What Candidate Did Well)</div>
                        <div class="box-strength">
                          <span class="box-title" style="color: #14532d;">Key Demonstrated Strengths:</span>
                          <ul style="margin: 0; padding-left: 18px;">
                            ${feedbackList.map((f: string) => `<li style="margin-bottom: 3px;">${f}</li>`).join('')}
                          </ul>
                        </div>

                        <div class="section-heading">2. Targeted Support & Growth Plan (With Reasoning)</div>
                        <div class="box-support">
                          <span class="box-title" style="color: #78350f;">Actionable Support Plan for Consultant Review:</span>
                          <ul style="margin: 0; padding-left: 18px;">
                            <li style="margin-bottom: 3px;"><strong>Quantifiable Outcome Data:</strong> Work with consultant to explicitly add measurable numbers/results (e.g. zero WHS hazards, shift time saved) to the 'Result' step.</li>
                            <li style="margin-bottom: 3px;"><strong>Spontaneous Speech Practice:</strong> Utilize voice dictation in future studio sessions to build natural 60-second verbal responses for live employer panels.</li>
                          </ul>
                        </div>

                        <div class="section-heading">3. STAR Scenario Response Breakdown</div>
                        <div style="background: #ffffff; border: 1px solid #cbd5e1; padding: 12px; border-radius: 10px; margin-top: 8px;">
                          <div style="font-weight: 800; font-size: 11.5px; color: #24083b;">
                            Scenario: "${selectedReport.question || 'Behavioral Interview Practice Scenario'}"
                          </div>

                          <div class="star-grid">
                            <div class="star-card">
                              <span class="star-card-title">Situation & Context</span>
                              ${situationText}
                            </div>
                            <div class="star-card">
                              <span class="star-card-title">Task Responsibility</span>
                              ${taskText}
                            </div>
                            <div class="star-card">
                              <span class="star-card-title">Personal Action Taken</span>
                              ${actionText}
                            </div>
                            <div class="star-card">
                              <span class="star-card-title">Measurable Result</span>
                              ${resultText}
                            </div>
                          </div>
                        </div>

                        <div class="footer-note">
                          Official Verification Record • Straight Up Training WorkReady Portal • Time Stamp: ${timeStamp}
                        </div>

                        <script>
                          window.onload = function() {
                            setTimeout(function() {
                              window.print();
                            }, 300);
                          };
                        </script>
                      </body>
                      </html>
                    `;

                    printWindow.document.write(htmlContent);
                    printWindow.document.close();
                  }}
                  className="px-4 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-400" /> Download PDF Evidence
                </button>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* JOB SEARCH MODAL */}
      {showJobSearchModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmitJobSearch} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Log Job Search Effort 🔎</h3>
              <button type="button" onClick={() => setShowJobSearchModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <p className="text-xs text-slate-500">Provide proof details (Job ID, reference, or portal link).</p>
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
              <button type="submit" className="px-4 py-2 text-xs bg-[#24083b] text-white font-bold rounded-xl shadow-sm">
                {isRtoGraduate ? "Save to Log" : "Submit Effort (+5 Pts Pending)"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* JOB PLACEMENT MODAL */}
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
              <button type="submit" className="px-4 py-2 text-xs bg-[#16a34a] text-white font-bold rounded-xl shadow-sm">
                {isRtoGraduate ? "Submit Placement" : "Submit Placement (+50 Pts Pending)"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INTERVIEW MODAL */}
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
              <button type="submit" className="px-4 py-2 text-xs bg-purple-600 text-white font-bold rounded-xl shadow-sm">
                {isRtoGraduate ? "Submit Interview" : "Submit Interview (+25 Pts Pending)"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUPPORT HELP MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRequestHelp} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Request Support 💬</h3>
              <button type="button" onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <textarea required rows={4} placeholder="Let us know what assistance or resources you need..." className="w-full p-2.5 border rounded-xl" />
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