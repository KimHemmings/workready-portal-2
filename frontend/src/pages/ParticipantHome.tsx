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
  UserCheck,
  PartyPopper,
  Sparkles,
  Zap,
  Star
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
  const [activeTab, setActiveTab] = useState<number>(1);
  const [verifiedPoints, setVerifiedPoints] = useState<number>(35);
  const targetPoints = 100;

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
      
      {/* HEADER BANNER */}
      <header className="bg-gradient-to-r from-[#1c0630] via-[#2a0945] to-[#1c0630] text-white shadow-xl border-b border-purple-900/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* SQUARE BOX LOGO BRANDING CONTAINER */}
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
                    WorkReady Partner
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-purple-200 mt-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  Candidate Career & Skills Portal
                </p>
              </div>
            </div>

            {/* HIGH-ENERGY CELEBRATION ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* I Got an Interview! Button */}
              <button
                onClick={() => setShowInterviewModal(true)}
                className="group relative flex-1 md:flex-none px-5 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2.5 border-2 border-amber-300 overflow-hidden"
              >
                <div className="p-1.5 bg-slate-950/10 rounded-xl group-hover:rotate-12 transition-transform">
                  <Briefcase className="w-4 h-4 text-slate-950" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-slate-950 font-black tracking-wide text-xs sm:text-sm">I Got an Interview!</span>
                  <span className="text-[10px] text-slate-900 font-extrabold uppercase opacity-90">+25 PBAS Points</span>
                </div>
              </button>

              {/* I Got the Job! Button */}
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
                  <span className="text-[10px] text-emerald-100 font-extrabold uppercase">+50 PBAS Points</span>
                </div>
              </button>

              {/* Sign Out Button */}
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

        {/* 3 MAIN ACTION NAVIGATION CARDS */}
        <section aria-label="Main Navigation" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* CARD 1: LMS MODULES */}
          <button
            onClick={() => setActiveTab(1)}
            className={`group relative p-5 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md ${
              activeTab === 1
                ? 'bg-gradient-to-br from-purple-50/90 via-white to-purple-100/50 border-2 border-[#24083b] ring-2 ring-[#24083b]/20 ring-offset-2'
                : 'bg-white border-2 border-slate-200 hover:border-purple-300 hover:-translate-y-0.5 text-slate-600'
            }`}
          >
            {/* Top Bar: Icon + Active Badge */}
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

            {/* Content */}
            <div>
              <div className="text-base font-black text-slate-900 group-hover:text-[#24083b] transition-colors">
                Core Skills & Learning Hub
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                Interactive learning, WHS workplace safety, and downloadable certificates designed to build your job skills step-by-step.
              </p>
            </div>
          </button>

          {/* CARD 2: JOB READINESS TOOLKIT */}
          <button
            onClick={() => setActiveTab(2)}
            className={`group relative p-5 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md ${
              activeTab === 2
                ? 'bg-gradient-to-br from-indigo-50/90 via-white to-indigo-100/50 border-2 border-indigo-700 ring-2 ring-indigo-700/20 ring-offset-2'
                : 'bg-white border-2 border-slate-200 hover:border-indigo-300 hover:-translate-y-0.5 text-slate-600'
            }`}
          >
            {/* Top Bar: Icon + Active Badge */}
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

            {/* Content */}
            <div>
              <div className="text-base font-black text-slate-900 group-hover:text-indigo-800 transition-colors">
                Job Readiness Toolkit
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                Practice interview questions with your personal AI simulator and create professional, employer-ready resumes in minutes.
              </p>
            </div>
          </button>

          {/* CARD 3: PLACEMENT & PBAS PROGRESS */}
          <button
            onClick={() => setActiveTab(3)}
            className={`group relative p-5 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md ${
              activeTab === 3
                ? 'bg-gradient-to-br from-emerald-50/90 via-white to-emerald-100/50 border-2 border-[#16a34a] ring-2 ring-[#16a34a]/20 ring-offset-2'
                : 'bg-white border-2 border-slate-200 hover:border-emerald-300 hover:-translate-y-0.5 text-slate-600'
            }`}
          >
            {/* Top Bar: Icon + Active Badge */}
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
                  {verifiedPoints} Pts Earned
                </span>
              )}
            </div>

            {/* Content */}
            <div>
              <div className="text-base font-black text-slate-900 group-hover:text-[#16a34a] transition-colors">
                Verification & PBAS Hub
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
                Track your verified mutual obligation points, log job application efforts, access your document locker, and view upcoming appointments.
              </p>
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

      {/* MODALS */}
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