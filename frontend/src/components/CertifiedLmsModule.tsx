import React, { useState } from 'react';
import type { ModuleData } from '../data/modulesData';
import { 
  Volume2, 
  VolumeX, 
  Download, 
  Award, 
  Sparkles, 
  BookOpen,
  HelpCircle,
  Video,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Building2,
  Ribbon
} from 'lucide-react';

export interface CertifiedLmsModuleProps {
  candidateName?: string;
  providerName?: string;
  providerLogoUrl?: string;
  moduleTitle?: string;
  moduleData?: ModuleData | any;
  activeModule?: ModuleData | any;
  module?: ModuleData | any;
  onComplete?: (points: number) => void;
}

export const CertifiedLmsModule: React.FC<CertifiedLmsModuleProps> = ({
  candidateName = "Alex Johnson",
  providerName = "Employment Partner",
  providerLogoUrl,
  moduleTitle,
  moduleData: rawModuleData,
  activeModule,
  module: propModule,
  onComplete,
}) => {
  const mod: any = rawModuleData || activeModule || propModule || {};
  const displayTitle = mod?.title || moduleTitle || "Job Readiness Skill Module";
  const pointsToEarn = mod?.pbasPoints || 5;

  const isAlreadyCompleted = (() => {
    try {
      const stored = localStorage.getItem('workready_completed_timestamps');
      if (stored) {
        const timestamps: Record<string, number> = JSON.parse(stored);
        return Boolean(timestamps[mod?.id]);
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  })();

  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'certificate'>(
    isAlreadyCompleted ? 'certificate' : 'content'
  );
  const [isAudioReading, setIsAudioReading] = useState(false);
  const [selectedScenarioOpt, setSelectedScenarioOpt] = useState<string | null>(null);

  // Quiz State
  const quizQuestions: any[] = mod?.quiz || [];
  const [userAnswers, setUserAnswers] = useState<number[]>(Array(quizQuestions.length).fill(-1));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(isAlreadyCompleted);

  const handleSelectAnswer = (qIdx: number, oIdx: number) => {
    const updated = [...userAnswers];
    updated[qIdx] = oIdx;
    setUserAnswers(updated);
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizSubmitted(true);
    
    const correctCount = userAnswers.reduce((acc, ans, idx) => {
      const targetCorrect = quizQuestions[idx]?.correctAnswerIndex ?? quizQuestions[idx]?.correctAnswer ?? 0;
      return ans === targetCorrect ? acc + 1 : acc;
    }, 0);

    const passThreshold = Math.max(1, Math.ceil(quizQuestions.length * 0.7));
    const isPass = correctCount >= passThreshold;
    setQuizPassed(isPass);

    if (isPass) {
      setActiveTab('certificate');
      if (onComplete) {
        onComplete(pointsToEarn);
      }
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const formattedTime = new Date().toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      
      {/* STRICT LANDSCAPE SINGLE-PAGE PRINT ENGINE */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          html, body {
            height: 100vh !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 2% !important;
            top: 2% !important;
            width: 96% !important;
            height: 96vh !important;
            margin: 0 !important;
            padding: 3rem !important;
            box-sizing: border-box !important;
            border: 8px solid #24083b !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-[#24083b] via-[#320b52] to-[#1c0630] text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md">
              Module #{mod?.moduleNumber || '1'} • {mod?.category || 'Core Skill'}
            </span>
            <span className="text-[10px] font-black text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md">
              +{pointsToEarn} Verified PBAS Pts
            </span>
          </div>
          <h2 className="text-xl font-black mt-2 font-heading tracking-tight">{displayTitle}</h2>
          <p className="text-xs text-purple-200 mt-1">Candidate: {candidateName}</p>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-xl border border-white/15 shrink-0">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'content' ? 'bg-amber-300 text-slate-950 shadow' : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 1. Knowledge Base
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'quiz' ? 'bg-amber-300 text-slate-950 shadow' : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> 2. Assessment Quiz
          </button>

          <button
            onClick={() => {
              if (quizPassed || isAlreadyCompleted || activeTab === 'certificate') {
                setActiveTab('certificate');
              } else {
                alert("Please complete and pass the Knowledge Assessment quiz first to unlock your Certificate!");
              }
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'certificate' ? 'bg-emerald-400 text-slate-950 shadow' : 'text-purple-200 hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" /> 3. Official Certificate
          </button>
        </div>
      </div>

      {/* TAB 1: KNOWLEDGE BASE */}
      {activeTab === 'content' && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-700" /> Module Knowledge & Training Content
            </h3>
            <button
              onClick={() => setIsAudioReading(!isAudioReading)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-xl border border-purple-200 transition-all"
            >
              {isAudioReading ? <VolumeX className="w-4 h-4 text-purple-700" /> : <Volume2 className="w-4 h-4 text-purple-700" />}
              {isAudioReading ? 'Stop Audio' : 'AI Voice Reader'}
            </button>
          </div>

          {mod?.videoScript && (
            <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-purple-900">
                <Video className="w-4 h-4 text-purple-700" /> Module Intro & Overview:
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{mod.videoScript}</p>
            </div>
          )}

          {mod?.lesson1Title && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="p-1.5 bg-[#24083b] text-white rounded-lg text-xs font-black">1</span>
                {mod.lesson1Title}
              </h4>
              <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                {Array.isArray(mod.lesson1Content) ? (
                  mod.lesson1Content.map((p: string, i: number) => <p key={i}>{p}</p>)
                ) : (
                  <p>{mod.lesson1Content}</p>
                )}
              </div>
            </div>
          )}

          {mod?.graphicCard1 && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" /> {mod.graphicCard1.title}
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                {mod.graphicCard1.bullets?.map((bullet: string, i: number) => (
                  <li key={i} className={`p-2.5 rounded-xl border ${
                    bullet.includes('❌') 
                      ? 'bg-rose-50/80 text-rose-900 border-rose-200' 
                      : 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
                  }`}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mod?.branchingScenario && (
            <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-900">
                <ShieldAlert className="w-4 h-4 text-indigo-700" /> Practical Scenario Decision Challenge:
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {mod.branchingScenario.situation}
              </p>

              <div className="space-y-2 pt-1">
                {mod.branchingScenario.options?.map((opt: any) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedScenarioOpt(opt.id)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-semibold border transition-all ${
                      selectedScenarioOpt === opt.id
                        ? 'bg-[#24083b] text-white border-[#24083b]'
                        : 'bg-white text-slate-800 border-indigo-100 hover:border-indigo-300'
                    }`}
                  >
                    {opt.choice}
                  </button>
                ))}
              </div>

              {selectedScenarioOpt && (
                <div className="p-3.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-slate-800 space-y-1">
                  {mod.branchingScenario.options?.find((o: any) => o.id === selectedScenarioOpt)?.isCorrect ? (
                    <p className="text-emerald-700">
                      {mod.branchingScenario.options?.find((o: any) => o.id === selectedScenarioOpt)?.feedback}
                    </p>
                  ) : (
                    <p className="text-rose-700">
                      {mod.branchingScenario.options?.find((o: any) => o.id === selectedScenarioOpt)?.feedback}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {mod?.lesson2Title && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="p-1.5 bg-[#24083b] text-white rounded-lg text-xs font-black">2</span>
                {mod.lesson2Title}
              </h4>
              <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                {Array.isArray(mod.lesson2Content) ? (
                  mod.lesson2Content.map((p: string, i: number) => <p key={i}>{p}</p>)
                ) : (
                  <p>{mod.lesson2Content}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('quiz')}
              className="px-6 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              Take Assessment Quiz →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: ASSESSMENT QUIZ */}
      {activeTab === 'quiz' && (
        <form onSubmit={handleSubmitQuiz} className="p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" /> Module Knowledge Assessment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Answer the questions below to verify your understanding and unlock your PBAS points.</p>
          </div>

          <div className="space-y-5">
            {quizQuestions.map((q, qIdx) => (
              <div key={q.id || qIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-extrabold text-slate-900">
                  Question {qIdx + 1}: {q.question}
                </label>
                <div className="space-y-2">
                  {q.options?.map((opt: string, oIdx: number) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(qIdx, oIdx)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-semibold border transition-all ${
                        userAnswers[qIdx] === oIdx
                          ? 'bg-[#24083b] text-white border-[#24083b] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              Submit Quiz & Earn +{pointsToEarn} Points
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: HIGH-IMPACT CELEBRATION DIPLOMA CERTIFICATE */}
      {activeTab === 'certificate' && (
        <div className="p-6 space-y-6">
          <div 
            id="printable-certificate"
            className="bg-white p-10 sm:p-14 rounded-3xl border-[12px] border-[#24083b] shadow-2xl text-center relative overflow-hidden flex flex-col justify-between min-h-[600px]"
          >
            {/* Metallic Gold Double Outer Pinstriping */}
            <div className="absolute inset-2 border-2 border-amber-400/80 rounded-2xl pointer-events-none" />
            <div className="absolute inset-3 border border-amber-300/40 rounded-xl pointer-events-none" />

            {/* Top & Bottom Gold Accent Bar */}
            <div className="h-3 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 w-full absolute top-0 left-0" />
            <div className="h-3 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 w-full absolute bottom-0 left-0" />

            {/* Background Crest Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Trophy className="w-[600px] h-[600px] text-[#24083b]" />
            </div>

            {/* DUAL BRANDING HEADER WITH LARGE LOGOS */}
            <div className="flex justify-between items-center border-b-2 border-amber-400/30 pb-6 relative z-10">
              
              {/* Left Logo: Straight Up Training */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-lg border-2 border-amber-300 flex items-center justify-center shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Straight Up Training" 
                    className="max-h-full max-w-full object-contain" 
                    onError={(e) => (e.currentTarget.style.display = 'none')} 
                  />
                </div>
                <div className="text-left">
                  <span className="block font-black text-2xl text-[#24083b] uppercase tracking-wider font-heading">
                    Straight Up Training
                  </span>
                </div>
              </div>

              {/* Center Partnership Ribbon */}
              <div className="flex flex-col items-center justify-center px-4">
                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 border-2 border-amber-300 px-4 py-1.5 rounded-full shadow-sm">
                  <Ribbon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black uppercase tracking-widest">In Partnership With</span>
                </div>
              </div>

              {/* Right Logo: Partner Provider / RTO */}
              <div className="flex items-center gap-4 text-right">
                <div className="text-right">
                  <span className="block font-black text-xl text-slate-900 uppercase tracking-tight font-heading">
                    {providerName}
                  </span>
                </div>
                {providerLogoUrl ? (
                  <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-lg border-2 border-amber-300 flex items-center justify-center shrink-0">
                    <img src={providerLogoUrl} alt={providerName} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-amber-300 flex items-center justify-center text-slate-400 shrink-0 shadow-lg">
                    <Building2 className="w-10 h-10 text-slate-400" />
                  </div>
                )}
              </div>

            </div>

            {/* CELEBRATION HERO SECTION */}
            <div className="space-y-4 py-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#24083b] text-amber-300 font-black text-xs uppercase tracking-widest rounded-full shadow-xl">
                <Trophy className="w-5 h-5 text-amber-400" /> Official Certificate of Achievement
              </div>

              <p className="text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                This official training record proudly certifies that
              </p>
              
              <h3 className="text-5xl sm:text-6xl font-black text-[#24083b] font-heading border-b-4 border-amber-400 inline-block px-14 pb-2">
                {candidateName}
              </h3>
              
              <p className="text-xs text-slate-600 mt-2 font-bold max-w-xl mx-auto">
                has successfully completed all learning content, branching scenarios, and practical assessments for:
              </p>
              
              <h4 className="text-2xl sm:text-3xl font-black text-slate-900 max-w-3xl mx-auto font-heading uppercase tracking-tight pt-1">
                {displayTitle}
              </h4>
            </div>

            {/* COMPLIANCE AUDIT PANEL */}
            <div className="bg-slate-50/90 p-5 rounded-2xl border-2 border-amber-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs font-bold relative z-10 max-w-3xl mx-auto w-full shadow-inner">
              
              <div>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Document Ref</span>
                <span className="text-slate-900 font-mono font-black text-xs">SUT-{mod?.id || 'M01'}-2026</span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Completion Date & Time</span>
                <span className="text-slate-900 font-black text-xs">{formattedDate} • {formattedTime}</span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase">PBAS Activity Credit</span>
                <span className="text-emerald-700 font-black text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> +{pointsToEarn} PBAS Points
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Verification Status</span>
                <span className="text-purple-900 font-extrabold bg-purple-100 px-2.5 py-0.5 rounded border border-purple-200 inline-block mt-0.5">
                  Verified Record
                </span>
              </div>

            </div>

            {/* ACTION BUTTON (Hidden during printing) */}
            <div className="pt-6 flex justify-center gap-3 no-print border-t border-slate-100 relative z-10">
              <button
                onClick={() => window.print()}
                className="px-8 py-3.5 bg-[#24083b] hover:bg-[#320b52] text-white font-black text-sm rounded-2xl shadow-xl transition-all inline-flex items-center gap-2.5"
              >
                <Download className="w-5 h-5 text-amber-300" /> Download / Print Official Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CertifiedLmsModule;