import React, { useState, useEffect } from 'react';
import { modulesData } from '../data/modulesData';
import type { ModuleData } from '../data/modulesData';
import CertifiedLmsModule from './CertifiedLmsModule';
import { usePortal } from '../context/PortalContext';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  Briefcase, 
  Target, 
  Zap,
  ArrowRight,
  Filter,
  Trophy,
  Lock,
  RefreshCw
} from 'lucide-react';

interface LmsModuleHubProps {
  onModuleCompleted?: (moduleId: string, points: number) => void;
  candidateId?: string;
}

// PBAS MONTHLY LMS RULES
const MONTHLY_LMS_POINTS_CAP = 30; // Max PBAS points allowed from LMS per month
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000; // 90 Days in milliseconds

// CATEGORY STYLING MAP (Aligned 1:1 with the 5 Master LMS Filter Categories)
const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; badgeBg: string; icon: any }> = {
  'Workplace Expectations': { 
    bg: 'from-purple-500/10 to-indigo-500/5', 
    text: 'text-purple-700', 
    border: 'hover:border-purple-300', 
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200', 
    icon: BookOpen 
  },
  'Resumes & Applications': { 
    bg: 'from-blue-500/10 to-cyan-500/5', 
    text: 'text-blue-700', 
    border: 'hover:border-blue-300', 
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: Target 
  },
  'Interviews & Selection': { 
    bg: 'from-indigo-500/10 to-purple-500/5', 
    text: 'text-indigo-700', 
    border: 'hover:border-indigo-300', 
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
    icon: Trophy 
  },
  'Job Searching': { 
    bg: 'from-amber-500/10 to-orange-500/5', 
    text: 'text-amber-700', 
    border: 'hover:border-amber-300', 
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200', 
    icon: Zap 
  },
  'Financial Literacy': { 
    bg: 'from-emerald-500/10 to-teal-500/5', 
    text: 'text-emerald-700', 
    border: 'hover:border-emerald-300', 
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
    icon: Award 
  },
  'Default': { 
    bg: 'from-[#24083b]/5 to-purple-500/5', 
    text: 'text-[#24083b]', 
    border: 'hover:border-purple-300', 
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200', 
    icon: BookOpen 
  }
};

// FIXED 5 MASTER LMS FILTER CATEGORIES
const CATEGORIES = [
  'All',
  'Workplace Expectations',
  'Resumes & Applications',
  'Interviews & Selection',
  'Job Searching',
  'Financial Literacy'
];

export const LmsModuleHub: React.FC<LmsModuleHubProps> = ({ onModuleCompleted, candidateId = 'CAN-101' }) => {
  const { candidates, activeContract } = usePortal();
  const isWfa = activeContract === 'Workforce Australia';
  const activeCandidate = candidates.find((c) => c.id === candidateId) || candidates[0];

  const programType = activeCandidate?.programType || 'workforce_australia';
  const isRtoGraduate = programType === 'rto_graduate';
  const isTtW = programType === 'ttw';

  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // 1. LOAD COMPLETION STATES & EXPIRE MODULES OLDER THAN 90 DAYS (IF COMPLIANCE ENFORCED)
  useEffect(() => {
    const loadCompletedModules = () => {
      try {
        const stored = localStorage.getItem('workready_completed_timestamps');
        if (!stored) return;

        const timestamps: Record<string, number> = JSON.parse(stored);
        const now = Date.now();

        // RTO graduates don't expire completion history; compliance programs expire after 90 days
        const validCompletedIds = Object.keys(timestamps).filter((id) => {
          if (isRtoGraduate) return true;
          return now - timestamps[id] < NINETY_DAYS_MS;
        });

        setCompletedModuleIds(validCompletedIds);
      } catch (err) {
        console.error('Error loading module history:', err);
      }
    };

    loadCompletedModules();
    window.addEventListener('moduleCompleted', loadCompletedModules);
    return () => window.removeEventListener('moduleCompleted', loadCompletedModules);
  }, [isRtoGraduate]);

  // Points & Cap Calculation (Bypassed for RTO Graduates)
  const totalEarnedPoints = modulesData
    .filter((m) => completedModuleIds.includes(m.id))
    .reduce((sum, m) => sum + (m.pbasPoints || 0), 0);

  const monthlyCappedPoints = Math.min(totalEarnedPoints, MONTHLY_LMS_POINTS_CAP);
  const isMonthlyCapReached = isRtoGraduate ? false : monthlyCappedPoints >= MONTHLY_LMS_POINTS_CAP;

  // Total Hours Logged for TtW
  const totalMinutesLogged = modulesData
    .filter((m) => completedModuleIds.includes(m.id))
    .reduce((sum, m) => sum + (m.estimatedMins || 20), 0);

  // 2. SAVE COMPLETION TIMESTAMP ON FINISH
  const handleComplete = (moduleId: string, points: number) => {
    try {
      const stored = localStorage.getItem('workready_completed_timestamps') || '{}';
      const timestamps: Record<string, number> = JSON.parse(stored);

      timestamps[moduleId] = Date.now();
      localStorage.setItem('workready_completed_timestamps', JSON.stringify(timestamps));

      const updatedIds = Object.keys(timestamps).filter(
        (id) => isRtoGraduate || Date.now() - timestamps[id] < NINETY_DAYS_MS
      );
      setCompletedModuleIds(updatedIds);

      const remainingCap = Math.max(0, MONTHLY_LMS_POINTS_CAP - totalEarnedPoints);
      const awardedPoints = isRtoGraduate ? 0 : Math.min(points, remainingCap);

      if (onModuleCompleted) {
        onModuleCompleted(moduleId, awardedPoints);
      }
    } catch (err) {
      console.error('Error saving module completion timestamp:', err);
    }
  };

  const handleModuleClick = (mod: ModuleData, isCompleted: boolean) => {
    // Prevent opening new modules if monthly cap is reached for compliance candidates
    if (!isCompleted && isMonthlyCapReached) {
      alert("🔒 Monthly LMS points cap reached (30/30 Pts). New modules and certificates are locked until your next reporting period. You can still review your completed modules!");
      return;
    }
    setSelectedModule(mod);
  };

  const totalModules = modulesData.length;
  const completedCount = completedModuleIds.length;
  const progressPercent = Math.min(Math.round((completedCount / (totalModules || 1)) * 100), 100);

  const filteredModules = selectedCategory === 'All' 
    ? modulesData 
    : modulesData.filter((m) => m.category === selectedCategory);

  if (selectedModule) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedModule(null)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all"
        >
          ← Back to All Modules
        </button>
        <CertifiedLmsModule 
          candidateName={activeCandidate?.name || "Alex Johnson"}
          moduleData={selectedModule}
          onComplete={(points: number) => handleComplete(selectedModule.id, points)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* REAL-TIME PROGRESS TRACKER BANNER */}
      <div className="bg-linear-to-r from-[#24083b] via-[#320b52] to-[#1c0630] text-white rounded-2xl p-6 shadow-xl border border-purple-900/60 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-400 text-slate-950 rounded-xl font-black shadow-md">
                <Trophy className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black tracking-tight text-white font-heading">
                {isRtoGraduate && "Graduate Employability & Career Hub"}
                {isTtW && "Transition to Work (TtW) Activity Hub"}
                {!isRtoGraduate && !isTtW && "LMS Course Completion Tracker"}
              </h2>
            </div>
            <p className="text-xs text-purple-200 mt-1.5 max-w-xl leading-relaxed">
              {isRtoGraduate && "Self-paced career preparation tools, resume builders, and interview modules tailored for course graduates to transition into work."}
              {isTtW && "Complete interactive modules to log verified activity hours toward your monthly program milestones."}
              {!isRtoGraduate && !isTtW && "Complete interactive modules to earn verified PBAS points. Modules automatically reset every 90 days for quarterly refresher credit."}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl border border-white/15 backdrop-blur-md">
            <div className="text-center px-3 border-r border-white/20">
              <span className="block text-xl font-black text-amber-300">{completedCount} / {totalModules}</span>
              <span className="text-[10px] font-bold uppercase text-purple-200 tracking-wider">Modules Done</span>
            </div>
            
            <div className="text-center px-3">
              {isRtoGraduate ? (
                <>
                  <span className="block text-xl font-black text-emerald-300">Self-Paced</span>
                  <span className="text-[10px] font-bold uppercase text-purple-200 tracking-wider">No Requirements</span>
                </>
              ) : isTtW ? (
                <>
                  <span className="block text-xl font-black text-emerald-300">{Math.round(totalMinutesLogged / 60 * 10) / 10} hrs</span>
                  <span className="text-[10px] font-bold uppercase text-purple-200 tracking-wider">Logged Hours</span>
                </>
              ) : isWfa ? (
  <>
    <span className="block text-xl font-black text-emerald-300">{completedCount} / {totalModules}</span>
    <span className="text-[10px] font-bold uppercase text-purple-200 tracking-wider">Modules Done</span>
  </>
) : (
  <>
    <span className="block text-xl font-black text-emerald-300">{Math.round((totalMinutesLogged / 60) * 10) / 10} hrs</span>
    <span className="text-[10px] font-bold uppercase text-purple-200 tracking-wider">Logged Hours</span>
  </>
)}
            </div>
          </div>
        </div>

        {/* Lockout Notification Banner (Compliance Only) */}
        {!isRtoGraduate && isMonthlyCapReached && (
          <div className="mt-4 p-3.5 bg-amber-500/20 border border-amber-400/50 rounded-xl text-amber-100 text-xs font-bold flex items-center gap-2.5 relative z-10 shadow-inner">
            <Lock className="w-5 h-5 text-amber-300 shrink-0" />
            <span>
              <strong>Monthly LMS Point Limit Reached (30/30 Pts)!</strong> New modules and certificate generation are locked until your next monthly cycle. You can review your completed modules below anytime.
            </span>
          </div>
        )}

        <div className="mt-5 space-y-2 relative z-10">
          <div className="flex justify-between text-xs font-extrabold text-purple-200">
            <span className="flex items-center gap-1.5">
              Overall Course Progress 
              {!isRtoGraduate && (
                <span className="text-[10px] text-purple-300 font-normal flex items-center gap-0.5">
                  (<RefreshCw className="w-3 h-3 text-emerald-400" /> 90-Day Cycle Active)
                </span>
              )}
            </span>
            <span className="text-amber-300">{progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-slate-950/50 h-3.5 rounded-full overflow-hidden p-0.5 border border-purple-700/50">
            <div
              className="bg-linear-to-r from-emerald-400 via-teal-400 to-amber-300 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-[#24083b] text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MODULE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((mod) => {
          const isCompleted = completedModuleIds.includes(mod.id);
          const isLocked = !isCompleted && isMonthlyCapReached;
          const style = CATEGORY_STYLES[mod.category] || CATEGORY_STYLES['Default'];

          return (
            <div
              key={mod.id}
              onClick={() => handleModuleClick(mod, isCompleted)}
              className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 shadow-sm flex flex-col justify-between overflow-hidden ${
                isCompleted 
                  ? 'border-emerald-300 ring-1 ring-emerald-400/30 bg-emerald-50/20 cursor-pointer hover:shadow-lg' 
                  : isLocked
                  ? 'border-slate-200 bg-slate-100/80 opacity-75 cursor-not-allowed'
                  : `border-slate-200 ${style.border} hover:-translate-y-1 hover:shadow-xl cursor-pointer`
              }`}
            >
              {/* Header Accent */}
              <div className={`h-2.5 w-full bg-linear-to-r ${
                isCompleted ? 'from-emerald-500 to-teal-400' : isLocked ? 'from-slate-300 to-slate-400' : style.bg
              }`} />

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      Module #{mod.moduleNumber}
                    </span>

                    {isCompleted ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModule(mod);
                      }}
                      className="inline-flex items-center gap-1.5 font-extrabold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-300 transition-all text-xs shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-700" /> Re-take / Review
                    </button>
                  ) : isLocked ? (
                    <span className="inline-flex items-center gap-1 font-extrabold text-slate-400">
                      Locked <Lock className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-extrabold text-[#24083b] group-hover:translate-x-1 transition-transform">
                      Start <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                  </div>

                  <h3 className={`font-extrabold text-base transition-colors leading-snug ${
                    isLocked ? 'text-slate-600' : 'text-slate-900 group-hover:text-[#24083b]'
                  }`}>
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {mod.videoScript || mod.lesson1Content[0]}
                  </p>
                </div>

                {/* Footer Metadata & Lock/Review States */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-3 text-slate-500">
                  </div>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700">
                      Review <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  ) : isLocked ? (
                    <span className="inline-flex items-center gap-1 font-extrabold text-slate-400">
                      Locked <Lock className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-extrabold text-[#24083b] group-hover:translate-x-1 transition-transform">
                      Start <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default LmsModuleHub;