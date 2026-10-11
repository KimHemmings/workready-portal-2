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
  PlusCircle,
  Sparkles,
  Zap,
  Download,
  X,
  Flame,
  Target,
  Heart,
  HelpCircle,
  Check,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Lock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface ActivityLog {
  id: string;
  type: 'Job Search' | 'Interview' | 'Job Placement' | 'LMS Module' | 'Employability Assessment' | 'Resume Tailoring';
  title: string;
  reference: string;
  points: number | string;
  hours: number;
  status: 'Pending Verification' | 'Verified';
  date: string;
  certType?: string;
  reportData?: any;
}

export const ParticipantHome: React.FC = () => {
 const { candidates, activeContract, addOutcomeClaim, supportMessages } = usePortal();
  const activeCandidate = candidates[0];

  // Contract Framework Alignment Helpers
  const isWfa = activeContract === 'Workforce Australia';
  const isTtW = activeContract === 'TtW';
  const isDes = (activeContract as string) === 'Inclusive Employment Australia (IEA)' || activeContract === 'DES';
const isIea = isDes;
  const isRto = activeContract === 'RTO';

  // Dynamic Provider / Co-Branding Title
  const licenseeName = (activeCandidate as any)?.licenseePartnerName || 
  (isRto ? 'Graduate Pathways Network' : isTtW ? 'Youth Transition Partner' : isIea ? 'Inclusive Employment Partner' : 'Workforce Australia Provider');
  const [activeTab, setActiveTab] = useState<number>(3);
  const [verifiedPoints, setVerifiedPoints] = useState<number>(activeCandidate?.pbasVerified ?? 45);
  const targetPoints = activeCandidate?.pbasTarget ?? 100;

  // Fear-Free Goal & Motivation Wizard State
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [myWhyMotivation, setMyWhyMotivation] = useState<string>('Creating a stable routine and financial security for my family');
  const [customWhyInput, setCustomWhyInput] = useState<string>('');
  const [actionPathway, setActionPathway] = useState<string>('balanced');
  const [primaryGoal, setPrimaryGoal] = useState<string>('Apply for 6–8 warehouse or logistics roles and complete 1 skill module');
  
  // Support Needed Selection
  const [supportTag, setSupportTag] = useState<string>('');
  const [supportNote, setSupportNote] = useState<string>('');

  // 5-Day PBAS Expiry Alert Modal State
  const [showPbasExpiryModal, setShowPbasExpiryModal] = useState<boolean>(() => {
    const daysRemaining = 4; // Mock 4 days left in active monthly cycle
    const pointsShort = 100 - 45; // Target 100, current 45
    return daysRemaining <= 5 && pointsShort > 0;
  });

  const [pillarScores, setPillarScores] = useState<Record<string, number>>({
    'Job Applications': 3,
    'Interview Readiness': 3,
    'Technical & Core Skills': 3,
    'Transport & Location': 4,
    'Workplace Mindset': 4,
  });

  const [selectedReport, setSelectedReport] = useState<any | null>(null);

 const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: 'act-1',
      type: 'LMS Module',
      title: 'WHS Fundamentals & Safe Work Practices',
      reference: 'MOD-WHS-01',
      points: 10,
      hours: 2.0,
      status: 'Verified',
      date: '10/09/2026',
      reportData: {
        candidateName: activeCandidate?.name || 'Alex Mercer',
        jobRole: 'WHS Fundamentals & Safe Work Practices',
        type: 'LMS Module',
        timestamp: '10/09/2026 at 02:15 PM',
        rubricScore: '100% Competency Passed',
        feedbackNotes: [
          'Passed standard WHS hazard identification assessment.',
          'Demonstrated knowledge of PPE requirements.',
          'Understands workplace safety reporting guidelines.'
        ]
      }
    },
    {
      id: 'act-2',
      type: 'Job Search',
      title: 'Warehouse Assistant — Logistics Co',
      reference: 'JOB-98231',
      points: 0,
      hours: 1.0,
      status: 'Pending Verification',
      date: '14/09/2026',
      reportData: {
        candidateName: activeCandidate?.name || 'Alex Mercer',
        jobRole: 'Warehouse Assistant',
        employer: 'Logistics Co',
        method: 'Seek Online Application',
        dateApplied: '14/09/2026',
        contact: 'Receipt #JOB-98231'
      }
    }
  ]);

  useEffect(() => {
    const syncStarActivityLog = (e?: any) => {
      try {
        // 1. Sync General Activity Logs (ResumeBuilder submissions)
        const storedLogs = localStorage.getItem('workready_activity_logs');
        let mappedLogs: ActivityLog[] = [];
        if (storedLogs) {
          const parsed: any[] = JSON.parse(storedLogs);
          mappedLogs = parsed.map((item) => ({
            id: item.id || `log-${Math.random()}`,
            type: item.type || 'Job Search',
            title: item.title || 'Activity Submission',
            reference: item.verificationId || `SUT-${Math.floor(10000 + Math.random() * 90000)}`,
            points: item.points || 'Pending CM Verification',
            hours: parseFloat(item.hours) || 1.0,
            status: item.status === 'Verified' ? 'Verified' : 'Pending Verification',
            date: item.date || new Date().toLocaleDateString('en-AU'),
            certType: item.certType,
            reportData: item
          }));
        }

        // 2. Sync STAR Simulator History
        let recordToSync = e?.detail;
        if (!recordToSync) {
          const storedHistory = localStorage.getItem('workready_star_history');
          if (storedHistory) {
            const parsedRecords = JSON.parse(storedHistory);
            if (parsedRecords.length > 0) {
              recordToSync = parsedRecords[0];
            }
          }
        }

        setActivities((prev) => {
          let updated = [...prev];

          // Merge stored activity logs
          mappedLogs.forEach((log) => {
            if (!updated.some((act) => act.id === log.id)) {
              updated.unshift(log);
            }
          });

          // Merge STAR record if present
          if (recordToSync && !updated.some((act) => act.id === recordToSync.id)) {
            const pointsAwarded = recordToSync.points || 25;
            const newStarActivity: ActivityLog = {
              id: recordToSync.id,
              type: recordToSync.type || (recordToSync.question?.includes('Resume') ? 'Resume Tailoring' : 'Interview'),
              title: recordToSync.question || recordToSync.title || `STAR Practice: ${recordToSync.jobRole}`,
              reference: `EVID-${recordToSync.id.slice(-6).toUpperCase()}`,
              points: pointsAwarded,
              hours: 2.5,
              status: recordToSync.status?.includes('Pending') ? 'Pending Verification' : 'Verified',
              date: recordToSync.date || new Date().toLocaleDateString('en-AU'),
              reportData: recordToSync
            };
            updated.unshift(newStarActivity);
          }

          return updated;
        });
      } catch (err) {
        console.error('Error syncing history to main activity log', err);
      }
    };

    syncStarActivityLog();

    window.addEventListener('storage', syncStarActivityLog);
    window.addEventListener('starHistoryUpdated', syncStarActivityLog);
    return () => {
      window.removeEventListener('storage', syncStarActivityLog);
      window.removeEventListener('starHistoryUpdated', syncStarActivityLog);
    };
  }, []);
  
const [showOtherActivityModal, setShowOtherActivityModal] = useState<boolean>(false);
  const [otherActivityType, setOtherActivityType] = useState<string>('Paid Work / Training');
  const [otherActivityTitle, setOtherActivityTitle] = useState<string>('');
  const [otherActivityHours, setOtherActivityHours] = useState<string>('');
  const [otherActivityNotes, setOtherActivityNotes] = useState<string>('');
  const [otherActivityBarrier, setOtherActivityBarrier] = useState<string>('');
  

  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
  const [showJobSearchModal, setShowJobSearchModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const [jsEmployer, setJsEmployer] = useState('');
  const [jsRole, setJsRole] = useState('');
  const [jsRef, setJsRef] = useState('');

  // Outcome Milestone & Payslip Upload State
  const [showPayslipModal, setShowPayslipModal] = useState<boolean>(false);
  const [payslipMilestone, setPayslipMilestone] = useState<'4-Week' | '12-Week' | '26-Week'>('4-Week');
  const [payslipHours, setPayslipHours] = useState<string>('');

  // PBAS Deadline Popup State & Countdown
  const [showPbasDeadlineModal, setShowPbasDeadlineModal] = useState<boolean>(true);
  const daysLeftForPbas = (() => {
    const today = new Date();
    let deadline = new Date(today.getFullYear(), today.getMonth(), 28);
    if (today.getDate() > 28) deadline = new Date(today.getFullYear(), today.getMonth() + 1, 28);
    return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  })();
  const isPbasDeadlineUrgent = daysLeftForPbas <= 5;

  const [jobEmployer, setJobEmployer] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobRef, setJobRef] = useState('');
  const [jobStartDate, setJobStartDate] = useState('');

  const [intEmployer, setIntEmployer] = useState('');
  const [intRole, setIntRole] = useState('');
  const [intRef, setIntRef] = useState('');
  const [intDateTime, setIntDateTime] = useState('');

  const handleModuleCompleted = (moduleId: string, points: number) => {
    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'LMS Module',
      title: `Completed Module #${moduleId}`,
      reference: `AUTO-${moduleId}`,
      points: points,
      hours: 2.0,
      status: 'Verified',
      date: new Date().toLocaleDateString('en-AU'),
      reportData: {
        candidateName: activeCandidate?.name || 'Alex Mercer',
        jobRole: `Accredited Module #${moduleId}`,
        type: 'LMS Module',
        timestamp: new Date().toLocaleString('en-AU'),
        rubricScore: '100% Competency Passed'
      }
    };
    setActivities((prev) => [newAct, ...prev]);
    if (isWfa) {
      setVerifiedPoints((prev) => Math.min(prev + points, targetPoints));
    }
  };

  const handleAssessmentGoalSubmit = () => {
    const finalWhy = customWhyInput.trim() || myWhyMotivation;
    const scoresSummary = Object.entries(pillarScores)
      .map(([key, val]) => `${key.split(' ')[0]}: ${val}/5`)
      .join(', ');

    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Employability Assessment',
      title: `Goal & Motivation Studio — [${finalWhy}]`,
      reference: `GOAL-${new Date().getMonth() + 1}-2026`,
      points: 10,
      hours: 1.0,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
      reportData: {
        candidateName: activeCandidate?.name || 'Alex Mercer',
        jobRole: 'Employability Self-Assessment & Personal Roadmap',
        timestamp: new Date().toLocaleString('en-AU'),
        rubricScore: 'Personal Goal Agreement Completed',
        feedbackNotes: [
          `Personal "Why" Motivation: "${finalWhy}"`,
          `Monthly Target Goal: "${primaryGoal}"`,
          `Direct Case Manager Support Request: ${supportTag ? `${supportTag} — ${supportNote || 'No additional note'}` : 'None requested this period'}`,
          `5-Pillar Confidence Rating: ${scoresSummary}`
        ]
      }
    };

    setActivities((prev) => [newAct, ...prev]);
    setMyWhyMotivation(finalWhy);
    setReviewSubmitted(true);
  };

  const handleSubmitJobSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Job Search',
      title: `${jsRole} — ${jsEmployer}`,
      reference: jsRef || 'Ref Pending',
      points: 5,
      hours: 1.0,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
      reportData: {
        candidateName: activeCandidate?.name || 'Alex Mercer',
        jobRole: jsRole,
        employer: jsEmployer,
        method: 'Online Application / Direct Contact',
        dateApplied: new Date().toLocaleDateString('en-AU'),
        contact: jsRef || 'Direct Receipt'
      }
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowJobSearchModal(false);
    setJsEmployer(''); setJsRole(''); setJsRef('');
    alert("✨ Job search effort logged in your activity trail!");
  };

  const handleReportJob = (e: React.FormEvent) => {
  e.preventDefault();
  addOutcomeClaim({
    candidateId: activeCandidate?.id || 'c1',
    candidateName: activeCandidate?.name || 'Alex Mercer',
    type: 'Job Placement',
    employer: jobEmployer,
    role: jobRole,
    hourlyRate: '28.50',
    points: 50,
  });

    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Job Placement',
      title: `${jobRole} — ${jobEmployer}`,
      reference: jobRef || 'Placement Ref',
      points: 50,
      hours: 38.0, // Full-Time / Part-Time Placement
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
      reportData: {
        candidateName: activeCandidate?.name || 'Alex Mercer',
        jobRole,
        employer: jobEmployer,
        method: 'Confirmed Placement',
        dateApplied: new Date().toLocaleDateString('en-AU'),
        contact: jobRef
      }
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowJobModal(false);
    setJobEmployer(''); setJobRole(''); setJobRef('');
    alert("🎉 Job placement reported! Congratulations!");
  };

  const handleReportInterview = (e: React.FormEvent) => {
  e.preventDefault();
  addOutcomeClaim({
    candidateId: activeCandidate?.id || 'c1',
    candidateName: activeCandidate?.name || 'Alex Mercer',
    type: 'Interview',
    employer: intEmployer,
    role: intRole,
    points: 25,
  });

    const newAct: ActivityLog = {
      id: Date.now().toString(),
      type: 'Interview',
      title: `Real Employer Interview: ${intRole} — ${intEmployer}`,
      reference: intRef || 'Interview Ref',
      points: 25,
      hours: 2.5,
      status: 'Pending Verification',
      date: new Date().toLocaleDateString('en-AU'),
      reportData: {
        candidateName: activeCandidate?.name || 'Alex Mercer',
        jobRole: intRole,
        employer: intEmployer,
        method: 'Scheduled Employer Interview',
        dateApplied: new Date().toLocaleDateString('en-AU'),
        contact: intRef
      }
    };
    setActivities((prev) => [newAct, ...prev]);
    setShowInterviewModal(false);
    setIntEmployer(''); setIntRole(''); setIntRef('');
    alert("💼 Real employer interview reported and submitted for Case Manager verification!");
  };

  const handleRequestHelp = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHelpModal(false);
    alert("💬 High-priority support request sent to your Case Manager.");
  };

  const pendingPoints = activities
  .filter((a) => a.status === 'Pending Verification')
  .reduce((sum, a) => sum + (typeof a.points === 'number' ? a.points : 0), 0);

  const totalLoggedHours = activities.reduce((sum, a) => sum + (a.hours || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 pb-16 font-sans">
      
     {/* HEADER BANNER */}
      <header className="bg-linear-to-r from-[#1c0630] via-[#2a0945] to-[#1c0630] text-white shadow-xl border-b border-purple-900/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* BRANDING */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1 border-2 border-purple-200/80 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl tracking-tight text-white font-heading leading-none">Straight Up Training</span>
                  <span className="bg-emerald-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    {licenseeName}
                  </span>
                </div>
                <p className="text-xs font-bold text-purple-200 mt-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  {isRto 
                    ? "Graduate Career & Employability Hub" 
                    : isTtW 
                    ? "Youth Activation & Readiness Hub" 
                    : isIea 
                    ? "Inclusive Employment Australia Hub" 
                    : "Candidate Career & Skills Portal"}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {!isRto && (
  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
    <button
      type="button"
      onClick={() => setShowInterviewModal(true)}
      className="flex-1 md:flex-none px-5 py-2.5 bg-linear-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 border-2 border-amber-300"
    >
      <Briefcase className="w-4 h-4" />
      <span>I Got an Interview!</span>
    </button>

    <button
      type="button"
      onClick={() => setShowJobModal(true)}
      className="flex-1 md:flex-none px-5 py-2.5 bg-linear-to-r from-emerald-500 to-cyan-600 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 border-2 border-emerald-300/80"
    >
      <PartyPopper className="w-4 h-4 text-amber-300" />
      <span>I Got the Job!</span>
    </button>
  </div>
)}
              <button
                type="button"
                onClick={() => {
                  // Clean up Job Readiness storage only when explicitly signing out
                  localStorage.removeItem('workready_star_history');
                  localStorage.removeItem('workready_resume_draft');
                  window.dispatchEvent(new Event('starHistoryUpdated'));

                  const url = new URL(window.location.href);
                  url.searchParams.delete('role');
                  window.history.pushState({}, '', url.pathname);
                  window.dispatchEvent(new Event('popstate'));
                }}
                className="px-3.5 py-2 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-2xl hover:bg-white/20 transition-all"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* SUB-HEADER */}
      <section className="bg-white border-b border-slate-200 shadow-sm py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-extrabold text-[#24083b] tracking-tight">
              {isRto ? "Graduate Career & Employment Dashboard" : isTtW ? "Youth Transition & Milestone Journey" : isDes ? "Capacity & Employment Support Hub" : "Your Career Journey Dashboard"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Welcome back, {activeCandidate?.name || "Alex"}! Explore training, build your job kit, and track your progress.
            </p>
          </div>

          <button
            onClick={() => setShowHelpModal(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-all"
          >
            <LifeBuoy className="w-4 h-4 text-amber-600" /> Need Support? Send Message 💬
          </button>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* GUIDED FEAR-FREE GOAL & MOTIVATION STUDIO */}
        <section className="bg-linear-to-r from-purple-950 via-[#24083b] to-purple-900 text-white rounded-2xl p-6 shadow-xl border border-purple-800 relative overflow-hidden">
          {!reviewSubmitted ? (
            <div className="space-y-5 relative z-10 text-xs">
              
              {/* Step Navigation Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-black shadow-md shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">My Personal Goal & Motivation Studio</h2>
                    <p className="text-xs text-purple-200 font-medium mt-0.5">
                      There are no wrong answers here. Reflect on what motivates you, set your monthly pace, and let us know if you need assistance.
                    </p>
                  </div>
                </div>

                {reviewSubmitted && (
                  <span className="text-[11px] font-black bg-amber-300 text-slate-950 px-3 py-1 rounded-full shadow-sm shrink-0">
                    Submitted for CM Point Sign-off
                  </span>
                )}
              </div>

              {/* Wizard Step Stepper Badges */}
              <div className="flex items-center gap-2">
                {[
                  { num: 1, label: '1. What Motivates Me' },
                  { num: 2, label: '2. My Monthly Action Focus' },
                  { num: 3, label: '3. Confidence & Support Request' }
                ].map((s) => (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => setWizardStep(s.num)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-all ${
                      wizardStep === s.num
                        ? 'bg-amber-300 text-slate-950 shadow-md'
                        : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/80'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* STEP 1: MOTIVATION SEEDS */}
              {wizardStep === 1 && (
                <div className="space-y-3 bg-purple-900/40 p-4 rounded-xl border border-purple-700/50">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-amber-300" /> What is your main personal reason for wanting to find the right job?
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      'Creating a stable routine and financial security for my family',
                      'Building independence and getting my driver license or vehicle',
                      'Learning practical, hands-on skills in a supportive team environment',
                      'Re-entering the workforce and rebuilding my self-confidence'
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setMyWhyMotivation(option);
                          setCustomWhyInput('');
                        }}
                        className={`p-3 rounded-xl border text-left font-medium transition-all ${
                          myWhyMotivation === option && !customWhyInput
                            ? 'bg-white text-slate-950 border-amber-300 font-bold shadow-md'
                            : 'bg-purple-950/80 text-purple-100 border-purple-700/60 hover:bg-purple-900'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-purple-200 mb-1">Or write your own personal motivation:</label>
                    <input
                      type="text"
                      value={customWhyInput}
                      onChange={(e) => setCustomWhyInput(e.target.value)}
                      placeholder="e.g. Saving for a house deposit and growing my career in logistics..."
                      className="w-full p-2.5 bg-purple-950/90 border border-purple-700 text-purple-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-5 py-2 bg-amber-300 text-slate-950 font-black rounded-xl hover:bg-amber-400 transition-all"
                    >
                      Next: Choose Action Focus →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: MONTHLY ACTION PATHWAY */}
              {wizardStep === 2 && (
                <div className="space-y-3 bg-purple-900/40 p-4 rounded-xl border border-purple-700/50">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Target className="w-4 h-4" /> How would you prefer to structure your efforts this month?
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'balanced', title: 'Balanced Pathway', desc: 'Apply for 6–8 roles + 1 skill module + 1 interview practice' },
                      { id: 'jobsearch', title: 'Active Job Seeker', desc: 'Focus heavily on tailoring resumes & submitting job applications' },
                      { id: 'skillfirst', title: 'Skill & Confidence Builder', desc: 'Focus first on short LMS safety modules & interview prep' }
                    ].map((path) => (
                      <button
                        key={path.id}
                        type="button"
                        onClick={() => {
                          setActionPathway(path.id);
                          setPrimaryGoal(path.desc);
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          actionPathway === path.id
                            ? 'bg-white text-slate-950 border-amber-300 shadow-md font-bold'
                            : 'bg-purple-950/80 text-purple-100 border-purple-700/60 hover:bg-purple-900'
                        }`}
                      >
                        <span className="block font-black text-xs mb-1">{path.title}</span>
                        <span className="text-[11px] font-normal leading-relaxed opacity-90">{path.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2 bg-purple-900 text-purple-200 font-bold rounded-xl"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-5 py-2 bg-amber-300 text-slate-950 font-black rounded-xl hover:bg-amber-400"
                    >
                      Next: Confidence & Support Request →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: 5-PILLAR CONFIDENCE & DIRECT CASE MANAGER MESSAGE */}
              {wizardStep === 3 && (
                <div className="space-y-4 bg-purple-900/40 p-4 rounded-xl border border-purple-700/50">
                  <div>
                    <label className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                      <Smile className="w-4 h-4" /> 1. Rate your current confidence across key pillars (1 = Would like support, 5 = Confident):
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                      {Object.keys(pillarScores).map((pillar) => (
                        <div key={pillar} className="bg-purple-950/80 p-2.5 rounded-xl border border-purple-700/60 flex flex-col justify-between space-y-2">
                          <span className="text-[11px] font-bold text-purple-200 leading-tight">
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

                  {/* DIRECT CASE MANAGER SUPPORT REQUEST */}
                  <div className="pt-2 border-t border-purple-800/80 space-y-3">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" /> 2. Do you need direct assistance or funding support from Casey (Case Manager)?
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {[
                        '👔 Interview Clothes / Work Attire',
                        '🚗 Driver License Lessons & Fuel',
                        '🛠️ Work Boots & PPE Safety Gear',
                        '🚌 Public Transport Card',
                        '📄 White Card / License Course Fee'
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSupportTag(supportTag === tag ? '' : tag)}
                          className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] border transition-all ${
                            supportTag === tag
                              ? 'bg-amber-300 text-slate-950 border-amber-400 shadow-md'
                              : 'bg-purple-950/80 text-purple-200 border-purple-700/60 hover:bg-purple-900'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={supportNote}
                        onChange={(e) => setSupportNote(e.target.value)}
                        placeholder="Optional note to your Case Manager (e.g. Have an upcoming interview next Tuesday and need steel-cap boots)..."
                        className="w-full p-2.5 bg-purple-950/90 border border-purple-700 text-purple-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-4 py-2 bg-purple-900 text-purple-200 font-bold rounded-xl"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleAssessmentGoalSubmit}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Save Plan & Log Activity
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* COLLAPSED PERSISTENT MOTIVATION & MOMENTUM BANNER */
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 relative z-10 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-300 text-slate-950 font-black rounded-full flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-slate-950" /> My Personal "Why" Anchor
                  </span>
                  <span className="px-3 py-1 bg-purple-800 text-purple-100 font-bold rounded-full flex items-center gap-1 border border-purple-700">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 🔥 3-Day Momentum Streak
                  </span>
                </div>
                <p className="text-sm font-black text-white italic">"{myWhyMotivation}"</p>
                <p className="text-xs text-purple-200 font-medium">Monthly Focus: <strong className="text-amber-300">{primaryGoal}</strong></p>
                {supportTag && (
                  <p className="text-[11px] text-amber-200 font-bold flex items-center gap-1 pt-0.5">
                    <MessageSquare className="w-3 h-3 text-amber-300" /> Case Manager Support Requested: <u>{supportTag}</u>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setReviewSubmitted(false);
                  setWizardStep(1);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all shrink-0"
              >
                Update Goal Plan
              </button>
            </div>
          )}
        </section>

        {/* 3 MAIN ACTION NAVIGATION CARDS */}
        <section aria-label="Main Navigation" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab(1)}
            className={`group relative p-5 rounded-2xl text-left transition-all duration-200 shadow-sm ${
              activeTab === 1
                ? 'bg-white border-2 border-[#24083b] ring-2 ring-[#24083b]/20 shadow-md'
                : 'bg-white border border-slate-200 hover:border-purple-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-3 rounded-xl transition-colors ${
                activeTab === 1 ? 'bg-[#24083b] text-amber-300' : 'bg-purple-100 text-[#24083b]'
              }`}>
                <BookOpen className="w-6 h-6" />
              </span>
              {activeTab === 1 && (
                <span className="text-[11px] font-black text-[#24083b] bg-amber-300 px-2.5 py-0.5 rounded-full">
                  Active Section
                </span>
              )}
            </div>

            <div className="text-base font-black text-slate-900">
              {isRto ? "Graduate Skills & Learning Hub" : "Core Skills & Learning Hub"}
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
              Interactive learning, WHS workplace safety, and downloadable certificates designed to build your job skills step-by-step.
            </p>
          </button>

          <button
            onClick={() => setActiveTab(2)}
            className={`group relative p-5 rounded-2xl text-left transition-all duration-200 shadow-sm ${
              activeTab === 2
                ? 'bg-white border-2 border-indigo-700 ring-2 ring-indigo-700/20 shadow-md'
                : 'bg-white border border-slate-200 hover:border-indigo-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-3 rounded-xl transition-colors ${
                activeTab === 2 ? 'bg-indigo-700 text-amber-300' : 'bg-indigo-100 text-indigo-700'
              }`}>
                <Award className="w-6 h-6" />
              </span>
              {activeTab === 2 && (
                <span className="text-[11px] font-black text-indigo-950 bg-amber-300 px-2.5 py-0.5 rounded-full">
                  Active Section
                </span>
              )}
            </div>

            <div className="text-base font-black text-slate-900">
              Job Readiness & AI Coaching Studio
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
              Practice interview questions with your personal AI simulator and create professional, employer-ready resumes in minutes.
            </p>
          </button>

          <button
            onClick={() => setActiveTab(3)}
            className={`group relative p-5 rounded-2xl text-left transition-all duration-200 shadow-sm ${
              activeTab === 3
                ? 'bg-white border-2 border-[#16a34a] ring-2 ring-[#16a34a]/20 shadow-md'
                : 'bg-white border border-slate-200 hover:border-emerald-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`p-3 rounded-xl transition-colors ${
                activeTab === 3 ? 'bg-[#16a34a] text-white' : 'bg-emerald-100 text-[#16a34a]'
              }`}>
                <Trophy className="w-6 h-6" />
              </span>
              {activeTab === 3 && (
                <span className="text-[11px] font-black text-slate-950 bg-amber-300 px-2.5 py-0.5 rounded-full">
                  Active Section
                </span>
              )}
            </div>

            <div className="text-base font-black text-slate-900">
              {isRto ? "Career Portfolio & Activity Log" : isTtW ? "Youth Engagement & Milestone Hub" : isDes ? "Capacity & Benchmark Log" : "My Progress & Verification Hub"}
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
              Track your verified activities, logged hours, job application efforts, document locker, and appointments.
            </p>
          </button>
        </section>

        {/* TAB CONTENT AREA */}
        <div className="mt-6 space-y-6">
          {activeTab === 1 && (
            <LmsModuleHub onModuleCompleted={handleModuleCompleted} candidateId={activeCandidate?.id} />
          )}

         {activeTab === 2 && (
            <div className="space-y-8" key={`job-readiness-${activeCandidate?.id || 'default'}-${activeContract}`}>
              <ResumeBuilder key={`resume-${activeCandidate?.id}`} maxAttempts={3} />
              <div className="border-t border-slate-200 pt-8">
                <StarInterviewSimulator key={`star-${activeCandidate?.id}`} />
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-6">
              {/* 💼 DEWR EMPLOYMENT RETENTION & PAYSLIP TRACKER */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm my-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-[#24083b]">Employment Outcome & Retention Milestones</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Submit verified payslip evidence for 4-week, 12-week, and 26-week employment milestones.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowPayslipModal(true)}
            className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Upload Milestone Payslip</span>
          </button>
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900">4-Week Outcome</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active Focus</span>
            </div>
            <p className="text-[11px] text-slate-500">Requires verified payslips totaling minimum obligation hours.</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 opacity-75">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900">12-Week Outcome</span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Upcoming</span>
            </div>
            <p className="text-[11px] text-slate-500">Continuous employment verification & outcome sign-off.</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 opacity-75">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-900">26-Week Outcome</span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Upcoming</span>
            </div>
            <p className="text-[11px] text-slate-500">Full employment sustainability milestone claim.</p>
          </div>
        </div>
      </div>
              
              {/* SECTION 1: APPOINTMENTS CONTAINER */}
              <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-purple-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[#24083b] text-white rounded-xl">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <div>
                      <h2 className="text-sm font-black uppercase text-[#24083b] tracking-wider">
                        Support & Appointment Hub
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">Virtual, phone, and in-person check-ins with direct calendar sync.</p>
                    </div>
                  </div>
                </div>
                <AppointmentsWidget />
              </div>

              {/* SECTION 2: FRAMEWORK-SPECIFIC ENGAGEMENT / PBAS GAUGES */}
              <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[#16a34a] text-white rounded-xl">
                      <Trophy className="w-4 h-4" />
                    </span>
                    <div>
                      <h2 className="text-sm font-black uppercase text-[#16a34a] tracking-wider">
                        {isWfa && "My Monthly PBAS Momentum & Goals"}
                        {isTtW && "Weekly Youth Engagement Hours Target (25 Hrs/Wk)"}
                        {isDes && "Benchmark Capacity Tracker (15 Hours/Wk)"}
                        {isRto && "Voluntary Career & Portfolio Log"}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        {isWfa
                          ? "Top-arch progress gauge tracking monthly targets and continuous habit streaks."
                          : isRto
                          ? "Voluntary course upgrade with zero compliance or mutual obligation tracking."
                          : "Logs weekly activity hours across LMS training, resume tailoring, and interview practice."}
                      </p>
                    </div>
                  </div>
                </div>

                {isWfa ? (
                  <PointProjectionWheel verifiedPoints={verifiedPoints} pendingPoints={pendingPoints} targetPoints={targetPoints} />
                ) : isRto ? (
                  <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
                        RTO License Upgrade — Voluntary Mode
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Graduation Portfolio: <span className="text-emerald-600 font-extrabold">{totalLoggedHours.toFixed(1)} Hours Logged</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Self-paced vocational training. No points, compliance audits, or mutual obligation tracking required.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
                        {isTtW ? 'TtW 25-Hour Engagement Rule' : 'IEA Benchmark Capacity Log'}
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        Total Activity Hours Logged: <span className="text-emerald-600 font-extrabold">{totalLoggedHours.toFixed(1)} Hours</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isTtW ? 'Target: 25.0 Engagement Hours / Week' : 'Target: 15.0 Benchmark Hours / Week'}
                      </p>
                    </div>

                    <div className="w-full md:w-64 bg-slate-100 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Weekly Target Progress</span>
                        <span className="text-emerald-700 font-black">{Math.min(100, Math.round((totalLoggedHours / (isTtW ? 25 : 15)) * 100))}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (totalLoggedHours / (isTtW ? 25 : 15)) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: CREDENTIAL LOCKER CONTAINER */}
              <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-300/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-slate-800 text-white rounded-xl">
                      <Lock className="w-4 h-4 text-emerald-400" />
                    </span>
                    <div>
                      <h2 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                        Career Documents & Credentials
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">Store safety tickets, White Cards, and police checks for direct employer application matching.</p>
                    </div>
                  </div>
                </div>
                <DocumentLocker />
              </div>

              {/* SECTION 4: ACTIVITY LOG & AUDIT CERTIFICATES CONTAINER */}
              <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-purple-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[#24083b] text-white rounded-xl">
                      <FileText className="w-4 h-4 text-amber-300" />
                    </span>
                    <div>
                      <h2 className="text-sm font-black uppercase text-[#24083b] tracking-wider">
                        My Activity & Achievement Trail
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">Log applications and view earned vocational certificates or audit cover sheets.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-base text-[#24083b] flex items-center gap-2">
                        <Search className="w-5 h-5 text-[#16a34a]" /> Activity Verification Log
                      </h3>
                      <p className="text-xs text-slate-500">
                        Track submitted job applications, interviews, and learning milestones awaiting Case Manager sign-off.
                      </p>
                    </div>
                    {!isRto && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowJobSearchModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  + Log Job Search Effort
                </button>

                <button
  type="button"
  onClick={() => setShowOtherActivityModal(true)}
  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
>
  + Log Other Activity (Paid Work / Study)
</button>
              </div>
            )}
                  </div>
                  

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-3">Date</th>
                          <th className="p-3">Activity Type</th>
                          <th className="p-3">Title / Employer</th>
                          <th className="p-3">Verification ID</th>
                          <th className="p-3">Logged Hours</th>
                          {isWfa && <th className="p-3">PBAS Points</th>}
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Activity Record / Certificate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activities.map((act) => (
                          <tr key={act.id} className="hover:bg-slate-50 transition-all">
                            <td className="p-3 font-semibold text-slate-500">{act.date}</td>
                            <td className="p-3 font-bold text-slate-800">{act.type}</td>
                            <td className="p-3 text-slate-700">{act.title}</td>
                            <td className="p-3 font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded w-max text-[11px]">{act.reference}</td>
                            <td className="p-3 font-bold text-purple-950">{act.hours ? `${act.hours} hrs` : '1.0 hr'}</td>
                            {isWfa && (
                              <td className="p-3 font-bold whitespace-nowrap">
                                {act.status === 'Verified' ? (
                                  <span className="text-emerald-600 text-xs font-extrabold">+{act.points} Pts</span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                                    ⏳ Pending CM Verification
                                  </span>
                                )}
                              </td>
                            )}
                            <td className="p-3 whitespace-nowrap">
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
                              {act.certType === 'coversheet' || act.reportData?.certType === 'coversheet' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const logItem = act.reportData || act;
                                    const printWindow = window.open('', '_blank');
                                    if (!printWindow) return alert('Please allow pop-ups to open the official cover sheet.');

                                    const candidateName = logItem.fullName || logItem.candidateName || activeCandidate?.name || 'Alex Mercer';
                                    const roleTitle = logItem.targetRole || logItem.jobRole || 'Warehouse & Logistics Operations Assistant';
                                    const contractFramework = logItem.activeContract || activeContract || 'Workforce Australia';
                                    const verId = logItem.verificationId || `SUT-AUD-${Date.now()}`;
                                    const timestamp = logItem.timestamp || `${new Date().toLocaleDateString('en-AU')} at ${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`;

                                    const actionText = logItem.actionType === 'reviewed'
                                      ? '✓ Monthly Review & Accuracy Confirmation (No Document Edits Required)'
                                      : logItem.actionType === 'updated'
                                      ? '🚀 Active Version Revision / Updated Document Submission'
                                      : '🆕 New Initial Job Application Package Created';

                                    const scopeText = logItem.docScope === 'resume'
                                      ? 'Resume Document Only'
                                      : logItem.docScope === 'cover'
                                      ? 'Cover Letter Document Only'
                                      : 'Full Job Application Package (Resume & Cover Letter)';

                                    const htmlContent = `
                                      <!DOCTYPE html>
                                      <html>
                                        <head>
                                          <title>DEWR Audit Evidence Coversheet - ${candidateName}</title>
                                          <style>
                                            @page { size: A4; margin: 12mm 15mm; }
                                            @media print {
                                              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                                              .no-print { display: none !important; }
                                            }
                                            body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 0; padding: 24px; background: #ffffff; line-height: 1.5; }
                                            .header-branding { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #581c87; padding-bottom: 16px; margin-bottom: 20px; }
                                            .brand-logo { font-size: 20px; font-weight: 900; color: #3b0764; letter-spacing: -0.5px; }
                                            .brand-sub { font-size: 10px; font-weight: 800; color: #7e22ce; text-transform: uppercase; letter-spacing: 1px; }
                                            .licensee-box { text-align: right; background: #f8fafc; padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
                                            .licensee-title { font-size: 11px; font-weight: 800; color: #1e293b; text-transform: uppercase; }
                                            .licensee-sub { font-size: 10px; color: #64748b; font-weight: 600; }
                                            .doc-title { font-size: 15px; font-weight: 900; color: #3b0764; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.5px; border-left: 4px solid #a855f7; padding-left: 10px; }
                                            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #faf5ff; padding: 16px; border-radius: 12px; border: 1px solid #e9d5ff; margin-bottom: 20px; }
                                            .field-label { font-size: 10px; font-weight: 800; color: #6b21a8; text-transform: uppercase; letter-spacing: 0.5px; }
                                            .field-value { font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 2px; }
                                            .section-block { margin-bottom: 20px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; }
                                            .section-head { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #3b0764; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; margin-bottom: 10px; }
                                            .audit-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 12px; }
                                            .audit-row:last-child { border-bottom: none; }
                                            .audit-key { font-weight: 600; color: #475569; }
                                            .audit-val { font-weight: 800; color: #0f172a; text-align: right; }
                                            .badge-pending { background: #fef3c7; color: #92400e; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 800; }
                                            .stamp-box { margin-top: 24px; border: 2px dashed #166534; background: #f0fdf4; padding: 14px; text-align: center; border-radius: 10px; color: #166534; }
                                            .stamp-title { font-size: 12px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }
                                            .stamp-sub { font-size: 10px; font-weight: 600; margin-top: 4px; color: #15803d; }
                                            .footer-note { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center; font-size: 9px; color: #94a3b8; font-weight: 600; }
                                          </style>
                                        </head>
                                        <body>
                                          <div class="header-branding">
                                            <div>
                                              <div class="brand-logo">STRAIGHT UP TRAINING</div>
                                              <div class="brand-sub">WorkReady Job-Readiness & Compliance Engine</div>
                                            </div>
                                            <div class="licensee-box">
                                              <div class="licensee-title">${licenseeName}</div>
                                              <div class="licensee-sub">Licensed Delivery Partner Verification</div>
                                            </div>
                                          </div>

                                          <div class="doc-title">Official Job-Readiness Verification Coversheet</div>

                                          <div class="meta-grid">
                                            <div>
                                              <div class="field-label">Candidate Name</div>
                                              <div class="field-value">${candidateName}</div>
                                            </div>
                                            <div>
                                              <div class="field-label">Verification Audit ID</div>
                                              <div class="field-value">${verId}</div>
                                            </div>
                                            <div>
                                              <div class="field-label">Target Role / Industry</div>
                                              <div class="field-value">${roleTitle}</div>
                                            </div>
                                            <div>
                                              <div class="field-label">Date & Time Stamped</div>
                                              <div class="field-value">${timestamp}</div>
                                            </div>
                                          </div>

                                          <div class="section-block">
                                            <div class="section-head">Audit Action & Document Scope Breakdown</div>
                                            <div class="audit-row">
                                              <span class="audit-key">Verification Action:</span>
                                              <span class="audit-val">${actionText}</span>
                                            </div>
                                            <div class="audit-row">
                                              <span class="audit-key">Document Scope Included:</span>
                                              <span class="audit-val">${scopeText}</span>
                                            </div>
                                            <div class="audit-row">
                                              <span class="audit-key">Funding / Operational Stream:</span>
                                              <span class="audit-val">${contractFramework}</span>
                                            </div>
                                            <div class="audit-row">
                                              <span class="audit-key">PBAS / Compliance Point Status:</span>
                                              <span class="audit-val"><span class="badge-pending">Pending CM Review & Point Allocation</span></span>
                                            </div>
                                          </div>

                                          <div class="stamp-box">
                                            <div class="stamp-title">OFFICIALLY LOGGED FOR CASE MANAGER VERIFICATION</div>
                                            <div class="stamp-sub">Audit Evidence Record ID: ${verId} • Stamped ${timestamp}</div>
                                          </div>

                                          <div class="footer-note">
                                            Straight Up Training Compliance System • DEWR & DSS Guidelines Compliant • Generated for Case Manager Verification and Audit File Log
                                          </div>

                                          <script>
                                            window.onload = function() {
                                              setTimeout(function() {
                                                window.print();
                                              }, 300);
                                            };
                                            window.onafterprint = function() {
                                              window.close();
                                            };
                                            setTimeout(function() {
                                              window.close();
                                            }, 10000);
                                          </script>
                                        </body>
                                      </html>
                                    `;

                                    printWindow.document.write(htmlContent);
                                    printWindow.document.close();
                                  }}
                                  className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                                >
                                  📄 View Coversheet
                                </button>
                              ) : act.reportData ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedReport(act.reportData)}
                                  className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5 text-purple-700" /> {act.type === 'Job Search' ? 'View Receipt' : 'View Certificate'}
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

            </div>
          )}
        </div>
      </main>

      {/* DUAL-BRANDED AUDIT & EVIDENCE REPORT MODAL */}
      {selectedReport && (() => {
        const candidateName = selectedReport.candidateName || selectedReport.fullName || activeCandidate?.name || 'Alex Mercer';
        const activityTitle = selectedReport.jobRole || selectedReport.title || 'Skills & Activity Verification';
        const timestamp = selectedReport.timestamp || selectedReport.date || 'Recorded Session';
        const employerName = selectedReport.employer || selectedReport.company;
        return (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              
              {/* Co-Branded Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="bg-[#24083b] text-white px-3 py-1.5 rounded-lg font-black text-xs tracking-wide shadow-sm flex items-center gap-1.5">
                    <span>STRAIGHT UP TRAINING</span>
                  </div>

                  <span className="text-slate-400 font-bold text-[10px] tracking-wider">PARTNERED WITH</span>

                  <div className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-black text-xs tracking-wide shadow-sm">
                    {licenseeName.toUpperCase()}
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setSelectedReport(null)} 
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Candidate Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider">Candidate / Student</span>
                    <span className="font-black text-slate-900 text-sm">{candidateName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider">Timestamp</span>
                    <span className="font-semibold text-slate-800">{timestamp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider">Target Role / Module</span>
                    <span className="font-bold text-purple-900">{activityTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider">Audit Status</span>
                    <span className="font-black text-emerald-600">✓ Straight Up Training Verified</span>
                  </div>
                </div>

                {/* Job Search Record */}
                {employerName && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <div className="font-black text-slate-900 text-xs">Job Search Contact Record:</div>
                    <div>Employer: <strong>{employerName}</strong></div>
                    <div>Submission Method: <strong>{selectedReport.method || 'Online Portal / Direct Contact'}</strong></div>
                    <div>Verification Notes: <strong>{selectedReport.contact || 'System Timestamp Confirmed'}</strong></div>
                  </div>
                )}

                {/* STAR Scenario Record */}
                {selectedReport.question && (
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">STAR Practice Scenario:</h4>
                    <p className="font-medium text-slate-700 italic">"{selectedReport.question}"</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white border rounded-lg">
                        <strong className="text-emerald-700 block text-[10.5px]">Situation:</strong>
                        <span className="text-slate-600">{selectedReport.situation || selectedReport.summaryReport?.detailedBreakdown?.[0]?.answer || 'Context detailed in response.'}</span>
                      </div>
                      <div className="p-2.5 bg-white border rounded-lg">
                        <strong className="text-emerald-700 block text-[10.5px]">Task:</strong>
                        <span className="text-slate-600">{selectedReport.task || selectedReport.summaryReport?.detailedBreakdown?.[1]?.answer || 'Role responsibility detailed.'}</span>
                      </div>
                      <div className="p-2.5 bg-white border rounded-lg">
                        <strong className="text-emerald-700 block text-[10.5px]">Action:</strong>
                        <span className="text-slate-600">{selectedReport.action || selectedReport.summaryReport?.detailedBreakdown?.[2]?.answer || 'Proactive steps executed.'}</span>
                      </div>
                      <div className="p-2.5 bg-white border rounded-lg">
                        <strong className="text-emerald-700 block text-[10.5px]">Result:</strong>
                        <span className="text-slate-600">{selectedReport.result || selectedReport.summaryReport?.detailedBreakdown?.[3]?.answer || 'Positive outcome achieved.'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedReport.feedbackNotes || selectedReport.summaryReport?.keyTakeaways) && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <div className="font-black text-emerald-800 text-xs">Verified Competencies & Strength Notes:</div>
                    <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                      {(selectedReport.feedbackNotes || selectedReport.summaryReport?.keyTakeaways).map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Modal PDF Export */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const printWin = window.open('', '_blank');
                    if (!printWin) return alert('Please allow pop-ups to print the PDF certificate.');

                    const pointsClaim = selectedReport.points ? `+${selectedReport.points} PBAS Points Submitted` : 'Verified Audit Record';
                    const situationText = selectedReport.situation || selectedReport.summaryReport?.detailedBreakdown?.[0]?.answer || "Candidate outlined workplace context.";
                    const taskText = selectedReport.task || selectedReport.summaryReport?.detailedBreakdown?.[1]?.answer || "Candidate detailed role duties.";
                    const actionText = selectedReport.action || selectedReport.summaryReport?.detailedBreakdown?.[2]?.answer || "Candidate executed proactive steps.";
                    const resultText = selectedReport.result || selectedReport.summaryReport?.detailedBreakdown?.[3]?.answer || "Candidate delivered quality outcome.";

                    const html = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>Audit Certificate - ${activityTitle}</title>
                        <style>
                          @page { size: A4; margin: 15mm; }
                          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 20px; font-size: 11pt; line-height: 1.5; }
                          .header-box { border-bottom: 3px solid #24083b; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
                          .logo-badge { background: #24083b; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-weight: 900; font-size: 14pt; display: inline-block; }
                          .partner-badge { background: #047857; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 11pt; display: inline-block; margin-left: 8px; }
                          .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 18px; }
                          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 11pt; }
                          .title { font-weight: 900; color: #24083b; margin-top: 18px; border-bottom: 2px solid #cbd5e1; padding-bottom: 4px; font-size: 12pt; text-transform: uppercase; }
                          .star-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 10px 14px; border-radius: 0 8px 8px 0; margin-top: 8px; font-size: 10.5pt; }
                        </style>
                      </head>
                      <body>
                        <div class="header-box">
                          <div>
                            <span class="logo-badge">STRAIGHT UP TRAINING</span>
                            <span class="partner-badge">PARTNERED WITH ${licenseeName.toUpperCase()}</span>
                          </div>
                          <div>
                            <span style="background:#dcfce7; color:#15803d; padding:6px 14px; border-radius:20px; font-weight:900; font-size:11pt; border:1px solid #86efac;">
                              ${pointsClaim}
                            </span>
                          </div>
                        </div>

                        <div class="card">
                          <div class="grid">
                            <div><strong>Candidate Name:</strong> ${candidateName}</div>
                            <div><strong>Timestamp:</strong> ${timestamp}</div>
                            <div><strong>Target Role / Activity:</strong> ${activityTitle}</div>
                            <div><strong>Audit Status:</strong> Straight Up Training Verified</div>
                          </div>
                        </div>

                        <div class="title">1. Official Verification Cover Sheet</div>
                        <p style="margin-top:8px;">${selectedReport.question ? `STAR Practice Scenario: "${selectedReport.question}"` : employerName ? `Job Search Application Logged for: ${employerName} (${selectedReport.method || 'Online Portal'})` : `Completed Vocational Module: ${activityTitle}`}</p>

                        ${selectedReport.question ? `
                          <div class="title">2. STAR Response Breakdown</div>
                          <div class="star-box"><strong>Situation:</strong> ${situationText}</div>
                          <div class="star-box"><strong>Task:</strong> ${taskText}</div>
                          <div class="star-box"><strong>Action:</strong> ${actionText}</div>
                          <div class="star-box"><strong>Result:</strong> ${resultText}</div>
                        ` : ''}

                        <div style="margin-top:40px; border-top:1px solid #cbd5e1; padding-top:12px; font-size:9pt; text-align:center; color:#64748b; font-weight:bold;">
                          Official Verification Record • Straight Up Training WorkReady Portal • Code: SUT-AUDIT-${selectedReport.id || Math.floor(100000 + Math.random() * 900000)}
                        </div>

                        <script>
  window.onload = function() {
    setTimeout(function() {
      window.print();
    }, 300);
  };
  window.onafterprint = function() {
    window.close();
  };
  setTimeout(function() {
    window.close();
  }, 10000);
</script>
                      </body>
                      </html>
                    `;

                    printWin.document.write(html);
                    printWin.document.close();
                  }}
                  className="px-4 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-emerald-400" /> Download PDF Evidence Report
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        );
      })()}

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
                Submit Effort
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
              <button type="button" onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">✕</button>
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
                <label className="block font-bold text-slate-700 mb-1">Job Start Date *</label>
                <input required type="date" value={jobStartDate} onChange={(e) => setJobStartDate(e.target.value)} className="w-full p-2.5 border rounded-xl font-bold text-slate-800" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification / Contract Ref *</label>
                <input required type="text" value={jobRef} onChange={(e) => setJobRef(e.target.value)} placeholder="e.g. Contract ID #4920" className="w-full p-2.5 border rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowJobModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-[#16a34a] text-white font-bold rounded-xl shadow-sm cursor-pointer">
                Submit Placement
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
              <h3 className="font-bold text-base text-[#24083b]">Report Upcoming Employer Interview 💼</h3>
              <button type="button" onClick={() => setShowInterviewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">✕</button>
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
                <label className="block font-bold text-slate-700 mb-1">Interview Date & Time *</label>
                <input required type="datetime-local" value={intDateTime} onChange={(e) => setIntDateTime(e.target.value)} className="w-full p-2.5 border rounded-xl font-bold text-slate-800" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Invite Ref / Confirmation *</label>
                <input required type="text" value={intRef} onChange={(e) => setIntRef(e.target.value)} placeholder="e.g. Email Invite Ref #8821" className="w-full p-2.5 border rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowInterviewModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-purple-600 text-white font-bold rounded-xl shadow-sm cursor-pointer">
                Submit Interview
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

      {/* LOG EXTERNAL ACTIVITY MODAL */}
      {showOtherActivityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-[#24083b] flex items-center gap-2">
                  <span>Log External Activity</span> 📋
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Submit details of external work, training, or study. Your Case Manager will review and assign PBAS points/hours.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowOtherActivityModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newAct: ActivityLog = {
                id: Date.now().toString(),
                type: 'Job Search',
                title: `${otherActivityType}: ${otherActivityTitle}`,
                reference: `EXT-${Date.now().toString().slice(-5)}`,
                points: 0,
                hours: parseFloat(otherActivityHours) || 1.0,
                status: 'Pending Verification',
                date: new Date().toLocaleDateString('en-AU'),
                reportData: {
                  candidateName: activeCandidate?.name || 'Alex Mercer',
                  jobRole: otherActivityTitle,
                  type: otherActivityType,
                  timestamp: new Date().toLocaleString('en-AU'),
                  feedbackNotes: [otherActivityNotes || 'External activity logged for CM review']
                }
              };
              setActivities((prev) => [newAct, ...prev]);
              setShowOtherActivityModal(false);
              setOtherActivityTitle('');
              setOtherActivityHours('');
              setOtherActivityNotes('');
              alert('Activity submitted! Your Case Manager will review and assign compliance points.');
            }} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Activity Category *</label>
                <select 
                  value={otherActivityType}
                  onChange={(e) => setOtherActivityType(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Paid Work / Employment">Paid Work / Employment</option>
                  <option value="External Course / Training">External Course / Training</option>
                  <option value="Volunteering / Community Service">Volunteering / Community Service</option>
                  <option value="Medical / Support Appointment">Medical / Support Appointment</option>
                  <option value="Other Self-Directed Activity">Other Self-Directed Activity</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Activity / Provider Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Local Community Center First Aid Course / Casual Shift"
                  value={otherActivityTitle}
                  onChange={(e) => setOtherActivityTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>
{/* DEWR BARRIER ALIGNMENT FIELD */}
<div>
  <label className="block font-bold text-slate-700 mb-1">
    Addressed Barrier (DEWR Compliance Evidence) *
  </label>
  <select
    required
    value={otherActivityBarrier}
    onChange={(e) => setOtherActivityBarrier(e.target.value)}
    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
  >
    <option value="">-- Select Barrier Addressed --</option>
    <option value="Resume">Resume / Application Skill Gap</option>
    <option value="Interview">Interview & Communication Anxiety</option>
    <option value="Digital">Digital Literacy & Online Systems</option>
    <option value="WHS">WHS & Safety Credential Requirement</option>
    <option value="Career">Career Direction & Transport Access</option>
  </select>
  <p className="text-[10px] text-slate-500 mt-1">
    Tagging this activity proves targeted barrier resolution for DEWR compliance.
  </p>
</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Completed Hours *</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 4"
                    value={otherActivityHours}
                    onChange={(e) => setOtherActivityHours(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PBAS Points Status</label>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold text-center">
                    ⏳ Case Manager Assessed
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Verification Notes / Reference</label>
                <textarea 
                  rows={3}
                  placeholder="Provide reference contact details, receipt number, or proof link..."
                  value={otherActivityNotes}
                  onChange={(e) => setOtherActivityNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtherActivityModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{/* ⚠️ 5-DAY PBAS DEADLINE BLOCKING POPUP MODAL */}
      {showPbasDeadlineModal && isPbasDeadlineUrgent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border-2 border-amber-400 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-900 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    DEWR Compliance Alert
                  </span>
                  <h3 className="text-lg font-black text-purple-950 mt-1">
                    PBAS Reporting Points Due Soon!
                  </h3>
                </div>
              </div>
            </div>

            {/* Countdown Badge Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700">Days Remaining in Reporting Period</p>
                <p className="text-xs text-slate-500 font-medium">Monthly Points Target Deadline</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-600 font-mono">
                  {daysLeftForPbas} {daysLeftForPbas === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>

            {/* Explanation & Action Notice */}
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Your monthly Points Based Activation System (PBAS) evidence must be submitted for Case Manager review before your cut-off date to maintain full mutual obligation compliance under Workforce Australia guidelines.
            </p>

            {/* Acknowledgment Action Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowPbasDeadlineModal(false)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
              >
                <span>I Understand & Review My PBAS Target</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 📄 PAYSLIP & MILESTONE EVIDENCE UPLOAD MODAL */}
      {showPayslipModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-[#24083b]">Upload Outcome Payslip Proof 📄</h3>
                <p className="text-[11px] text-slate-500">Encrypted transmission to Case Manager Document Locker</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowPayslipModal(false)} 
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`✅ Payslip for ${payslipMilestone} Milestone submitted successfully!\n\nYour Case Manager will verify hours worked (${payslipHours || 'Standard Shift'}) for DEWR outcome compliance.`);
                setShowPayslipModal(false);
                setPayslipHours('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Outcome Milestone *</label>
                <select
                  value={payslipMilestone}
                  onChange={(e) => setPayslipMilestone(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl font-bold text-slate-800 bg-slate-50 outline-none focus:border-purple-600"
                >
                  <option value="4-Week">4-Week Employment Outcome</option>
                  <option value="12-Week">12-Week Employment Outcome</option>
                  <option value="26-Week">26-Week Sustainable Outcome</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Hours Logged on Payslip *</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 38"
                  value={payslipHours}
                  onChange={(e) => setPayslipHours(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attach PDF / Photo of Payslip *</label>
                <input
                  required
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full p-2 border rounded-xl text-xs bg-slate-50 text-slate-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayslipModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-purple-950 hover:bg-purple-900 text-white font-extrabold rounded-xl shadow-sm cursor-pointer"
                >
                  Submit Payslip for Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{/* MANDATORY 5-DAY PBAS CYCLE EXPIRY POP-UP */}
      {showPbasExpiryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-rose-500">
            <div className="flex items-center space-x-3 text-rose-600 mb-4">
              <div className="p-3 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Mandatory PBAS Cycle Alert</h3>
                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Action Required — 4 Days Remaining</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Your monthly Workforce Australia obligation cycle ends in <strong className="text-slate-900">4 days</strong>. You are currently <strong className="text-rose-600">55 points short</strong> of your 100-point target.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 space-y-2">
              <span className="text-xs font-bold text-slate-700 block uppercase">Quick Ways to Earn Points Today:</span>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Complete 1 LMS Core Module (+10 PBAS Points)</li>
                <li>Run 1 STAR Practice Interview (+25 PBAS Points)</li>
                <li>Log Verified Job Search Effort (+5 Points per application)</li>
              </ul>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowPbasExpiryModal(false)}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                I Understand — Take Me to Activities
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantHome;