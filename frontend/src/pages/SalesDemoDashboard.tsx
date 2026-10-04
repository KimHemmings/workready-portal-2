import React, { useState } from 'react';
import ParticipantHome from './ParticipantHome';
import CaseManager from './CaseManager';
import OwnerDashboard from './OwnerDashboard';
import { usePortal } from '../context/PortalContext';
import { 
  Sparkles, Calculator, Presentation, ShieldCheck, 
  Users, LogOut, Briefcase, X, Maximize2, Lightbulb,
  ChevronRight, CheckCircle2, XCircle, RotateCcw
} from 'lucide-react';

type MarketSegment = 'workforce_au' | 'des' | 'parentsnext_ttw' | 'rto_tafe';

interface MarketConfig {
  name: string;
  badge: string;
  avgOutcomeFee: number;
  adminHoursSavedPerStaff: number;
  metricLabel: string;
  feeLabel: string;
  complianceLabel: string;
  repHook: string;
  objectionTip: string;
}

const MARKET_PRESETS: Record<MarketSegment, MarketConfig> = {
  workforce_au: {
    name: 'Workforce Australia (WFA)',
    badge: 'DEWR Framework',
    avgOutcomeFee: 3200,
    adminHoursSavedPerStaff: 6.5,
    metricLabel: 'Monthly PBAS Points Automated',
    feeLabel: 'Avg. 12/26-Week Outcome Fee',
    complianceLabel: 'PBAS Points Target Compliance',
    repHook: 'Eliminate manual PBAS evidence collection and keep participants 100% compliant with automated sign-offs.',
    objectionTip: 'WFA outcome fees average $2,800–$3,500. Focus on how 1-click approvals free up Case Managers to focus on job placement.',
  },
  des: {
    name: 'Inclusive Employment Australia (IEA)',
    badge: 'IEA / Ongoing Support',
    avgOutcomeFee: 4500,
    adminHoursSavedPerStaff: 8.0,
    metricLabel: 'Participant Benchmark Hours Logged',
    feeLabel: 'Avg. Sustained Outcome Fee',
    complianceLabel: 'Ongoing Support Retention Rate',
    repHook: 'IEA providers lose up to 18% of outcome claims due to incomplete hours tracking. Our mobile log solves that instantly.',
    objectionTip: 'IEA outcome claims average $4,000–$6,000. Highlight how easy it is for participants to submit flexible work hours logs from their phones.',
  },
  parentsnext_ttw: {
    name: 'Transition to Work / ParentsNext',
    badge: 'Youth & Early Intervention',
    avgOutcomeFee: 2400,
    adminHoursSavedPerStaff: 5.5,
    metricLabel: 'Milestone & Activity Submissions',
    feeLabel: 'Avg. Progress Milestone Value',
    complianceLabel: 'Participation Engagement Rate',
    repHook: 'Boost youth participant engagement through gamified STAR practice runs and interactive LMS modules.',
    objectionTip: 'Focus on engagement metrics and confidence building (the 5-Pillar assessment) rather than strict DEWR audits.',
  },
  rto_tafe: {
    name: 'RTOs, TAFEs & Higher Education',
    badge: 'Vocational & Higher Ed',
    avgOutcomeFee: 1800,
    adminHoursSavedPerStaff: 5.0,
    metricLabel: 'Student Placement Portfolios',
    feeLabel: 'Per-Student Completion Retention',
    complianceLabel: 'Module Completion & Placement Rate',
    repHook: 'Streamline mandatory work-integrated learning (WIL) placements and student portfolio tracking for audit compliance.',
    objectionTip: 'Education providers care about course completion and graduate outcomes. Emphasize employer matching and interview prep.',
  },
};

export function SalesDemoDashboard() {
  const { setActiveContract, resetSandboxState } = usePortal();

  const [selectedMarket, setSelectedMarket] = useState<MarketSegment>('workforce_au');
  const activePreset = MARKET_PRESETS[selectedMarket];

  // Calculator State
  const [caseloadSize, setCaseloadSize] = useState<number>(150);
  const [avgStaffCount, setAvgStaffCount] = useState<number>(5);
  const [currentPlacementRate, setCurrentPlacementRate] = useState<number>(35);
  const [customOutcomeFee, setCustomOutcomeFee] = useState<number>(activePreset.avgOutcomeFee);

  const [activeDemoTab, setActiveDemoTab] = useState<'calculator' | 'presentation'>('calculator');
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [showDemoDrawer, setShowDemoDrawer] = useState<boolean>(false);
  
  // State for rendering full, live interactive profile pages inside full-screen demo viewports
  const [activeFullDemoRole, setActiveFullDemoRole] = useState<'participant' | 'coach' | 'owner' | null>(null);

  // Sync custom fee default & global contract framework whenever market selection changes
  const handleMarketChange = (market: MarketSegment) => {
    setSelectedMarket(market);
    setCustomOutcomeFee(MARKET_PRESETS[market].avgOutcomeFee);

    // Update global contract framework in PortalContext
    if (market === 'workforce_au') setActiveContract('Workforce Australia');
    else if (market === 'des') setActiveContract('Inclusive Employment Australia (IEA)' as any);
    else if (market === 'parentsnext_ttw') setActiveContract('TtW');
    else if (market === 'rto_tafe') setActiveContract('RTO');
  };
  // Dynamic Calculations
  const projectedPlacementRate = Math.min(85, currentPlacementRate + 25);
  const additionalPlacements = Math.round((caseloadSize * (projectedPlacementRate - currentPlacementRate)) / 100);
  const estimatedRevenueGain = additionalPlacements * customOutcomeFee;
  const totalWeeklyHoursSaved = Math.round(activePreset.adminHoursSavedPerStaff * avgStaffCount);

  const handleSignOut = () => {
    resetSandboxState();
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  const pitchSlides = [
    {
      step: '01',
      title: 'The Challenge',
      subtitle: 'Paperwork Friction & Compliance Drift',
      badge: 'Current Industry Pain',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      description: 'Case Managers spend up to 35% of their week chasing participant activity proof, logging manual points, and filling out paper forms instead of placing candidates.',
      keyTakeaway: 'Result: High staff burnout, delayed outcome claims, and DEWR/DES audit compliance risks.'
    },
    {
      step: '02',
      title: 'The Unified Bridge',
      subtitle: '3-Way Profile State Synchronization',
      badge: 'Core Platform Engine',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Straight Up Training links Candidate self-submissions, Case Manager sign-off queues, and Business Manager outcome metrics into a single real-time global state.',
      keyTakeaway: 'Result: Zero manual data re-entry. Submissions flow seamlessly from mobile to auditor CSV.'
    },
    {
      step: '03',
      title: 'Participant Empowerment',
      subtitle: 'Mobile Evidence & AI Practice Locker',
      badge: 'Candidate Experience',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Candidates complete AI STAR mock interviews and upload job applications directly from their phones, automatically queuing compliance credits for sign-off.',
      keyTakeaway: 'Result: 100% mutual obligation compliance with minimal staff chasing.'
    },
    {
      step: '04',
      title: 'Case Manager Velocity',
      subtitle: '1-Click Approvals & Leave Coverage Mode',
      badge: 'Operational Efficiency',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      description: 'Case Managers audit evidence in under 2 minutes. When staff go on leave, Coverage Mode reassigns caseloads with zero lost participant evidence.',
      keyTakeaway: 'Result: Saves 6.5+ hours weekly per Case Manager.'
    },
    {
      step: '05',
      title: 'Audit & Governance',
      subtitle: 'Auditor-Ready CSV Exports & 90-Day Logs',
      badge: 'Executive & DEWR Compliance',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Executive dashboards give Business Managers macro 5-Pillar diagnostics and instant 1-click CSV export for Department and internal compliance audits.',
      keyTakeaway: 'Result: 100% audit protection and accelerated 12/26-week milestone claims.'
    }
  ];

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
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Partner Sales & Growth Hub
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                WorkReady Platform Demo & Commercial Impact Suite
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-wrap">
            {/* RESET DEMO STATE BUTTON (EXCLUSIVELY FOR SALES PAGE) */}
            <button
              onClick={() => {
                resetSandboxState();
                alert('↺ Demo state reset! Baseline points and mock interview runs restored for new presentation.');
              }}
              className="px-3.5 py-1.5 bg-purple-800/80 hover:bg-purple-700 border border-purple-400/40 text-white text-xs font-extrabold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
              title="Reset sandbox state back to pristine defaults for a new provider demonstration"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>↺ Reset Demo State</span>
            </button>

            <button
              onClick={() => setShowDemoDrawer(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 border border-amber-400/40 text-purple-950 text-xs font-extrabold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Launch Demo Guide</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Demo</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* INTERACTIVE PERSONA LAUNCHER */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 text-white p-5 rounded-2xl shadow-lg border border-purple-800/50 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-full">
                Interactive Profile Sandbox
              </span>
              <h2 className="text-lg font-extrabold text-white mt-1">Launch Full Interactive Live Dashboards</h2>
              <p className="text-xs text-purple-200/80">Launch full-screen operational profiles to test real workflows live in presentation mode.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFullDemoRole('participant')}
                className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-extrabold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Launch Candidate Portal</span>
              </button>

              <button
                onClick={() => setActiveFullDemoRole('coach')}
                className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 font-extrabold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Briefcase className="w-4 h-4 text-purple-300" />
                <span>Launch Case Manager Dashboard</span>
              </button>

              <button
                onClick={() => setActiveFullDemoRole('owner')}
                className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-extrabold text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Launch Business Manager Overview</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-lg font-extrabold text-purple-950">Provider Partnership & Growth Toolkit</h3>
            <p className="text-xs text-slate-500 font-medium">Commercial projections, executive pitch slides, and competitive analysis.</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold space-x-1">
            <button
              onClick={() => setActiveDemoTab('calculator')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeDemoTab === 'calculator'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Provider ROI Calculator</span>
            </button>

            <button
              onClick={() => setActiveDemoTab('presentation')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeDemoTab === 'presentation'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>Executive Pitch & Comparison</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PROVIDER ROI CALCULATOR */}
        {activeDemoTab === 'calculator' && (
          <div className="space-y-6">
            {/* MARKET PRESET SELECTOR */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Target Market & Contract Framework:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(MARKET_PRESETS) as MarketSegment[]).map((key) => {
                  const preset = MARKET_PRESETS[key];
                  const isSelected = selectedMarket === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleMarketChange(key)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-purple-950 text-white border-purple-900 shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-extrabold text-xs block">{preset.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 w-max ${
                        isSelected ? 'bg-amber-400 text-purple-950' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {preset.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-purple-600" />
                  <span>Provider Operational Inputs</span>
                </h4>
                <p className="text-xs text-slate-500">Adjust parameters for {activePreset.name}.</p>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Total Active Caseload Size</span>
                      <span className="text-purple-950">{caseloadSize} Participants</span>
                    </div>
                    <input 
                      type="range" 
                      min="25" 
                      max="1000" 
                      step="25"
                      value={caseloadSize}
                      onChange={(e) => setCaseloadSize(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Active Case Management Staff</span>
                      <span className="text-purple-950">{avgStaffCount} Staff</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      step="1"
                      value={avgStaffCount}
                      onChange={(e) => setAvgStaffCount(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Current Milestone / Outcome Rate</span>
                      <span className="text-purple-950">{currentPlacementRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="60" 
                      step="5"
                      value={currentPlacementRate}
                      onChange={(e) => setCurrentPlacementRate(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>{activePreset.feeLabel}</span>
                      <span className="text-emerald-700 font-extrabold">${customOutcomeFee.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1000" 
                      max="8000" 
                      step="100"
                      value={customOutcomeFee}
                      onChange={(e) => setCustomOutcomeFee(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-gradient-to-br from-purple-950 via-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-xl border border-purple-800/50 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    Projected Provider Financial ROI • {activePreset.name}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-2">Commercial Impact Summary</h3>
                  <p className="text-xs text-purple-200/80">Estimated annual gains enabled by Straight Up Training integration.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-xs text-purple-200 font-bold">Estimated Revenue Unlocked</span>
                    <div className="text-2xl font-extrabold text-emerald-400">+${estimatedRevenueGain.toLocaleString()}</div>
                    <p className="text-[10px] text-purple-300">Based on +{additionalPlacements} additional outcomes</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-xs text-purple-200 font-bold">Staff Admin Hours Saved</span>
                    <div className="text-2xl font-extrabold text-amber-300">{totalWeeklyHoursSaved} hrs/wk</div>
                    <p className="text-[10px] text-purple-300">Directly reduces sign-off paperwork</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                    <span className="text-xs text-purple-200 font-bold">{activePreset.complianceLabel}</span>
                    <div className="text-2xl font-extrabold text-white">{projectedPlacementRate}%</div>
                    <p className="text-[10px] text-purple-300">Up from baseline {currentPlacementRate}%</p>
                  </div>
                </div>

                {/* SALES REP CHEAT SHEET BOX */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-amber-300" />
                      <span className="text-xs font-bold text-amber-300">Sales Pitch Hook ({activePreset.badge}):</span>
                    </div>
                    <span className="text-[10px] text-purple-300 font-mono">Est. {activePreset.adminHoursSavedPerStaff} hrs/wk saved/staff</span>
                  </div>
                  <p className="text-xs text-purple-100 italic">"{activePreset.repHook}"</p>
                  <p className="text-[11px] text-purple-200/80 pt-1">
                    <strong>Objection Handling:</strong> {activePreset.objectionTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXECUTIVE PITCH & COMPETITIVE COMPARISON */}
        {activeDemoTab === 'presentation' && (
          <div className="space-y-6">
            {/* SECTION 1: INTERACTIVE PITCH SLIDES */}
            <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-xl border border-purple-800/50 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-800/50 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                    Executive Presentation Deck
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">Live Presentation Slide Mode</h3>
                  <p className="text-xs text-purple-200/80">Click through slides during live client calls to present the platform value proposition.</p>
                </div>

                {/* Slide Navigation Buttons */}
                <div className="flex items-center gap-1">
                  {pitchSlides.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-8 h-8 rounded-xl font-extrabold text-xs transition-all border ${
                        activeSlide === idx
                          ? 'bg-amber-400 text-purple-950 border-amber-300 shadow-md scale-105'
                          : 'bg-white/10 text-purple-200 border-white/10 hover:bg-white/20'
                      }`}
                    >
                      {s.step}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVE SLIDE DISPLAY CARD */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full border w-max ${pitchSlides[activeSlide].badgeColor}`}>
                    {pitchSlides[activeSlide].badge}
                  </span>
                  <span className="text-xs font-mono text-purple-300">Slide {activeSlide + 1} of 5</span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white">{pitchSlides[activeSlide].title}</h2>
                  <h4 className="text-sm font-bold text-amber-300">{pitchSlides[activeSlide].subtitle}</h4>
                </div>

                <p className="text-xs text-purple-100/90 leading-relaxed font-medium max-w-3xl">
                  {pitchSlides[activeSlide].description}
                </p>

                <div className="p-3.5 bg-purple-900/60 border border-purple-500/30 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{pitchSlides[activeSlide].keyTakeaway}</span>
                </div>
              </div>

              {/* SLIDE NAVIGATION CONTROL BAR */}
              <div className="flex items-center justify-between pt-2 text-xs font-bold">
                <button
                  disabled={activeSlide === 0}
                  onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl transition-all"
                >
                  ← Previous Slide
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-purple-300">Next Step:</span>
                  <button
                    onClick={() => {
                      if (activeSlide < pitchSlides.length - 1) {
                        setActiveSlide(prev => prev + 1);
                      } else {
                        setActiveFullDemoRole('participant'); // Launch sandbox on final slide!
                      }
                    }}
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-purple-950 rounded-xl shadow-md transition-all flex items-center gap-1 font-extrabold"
                  >
                    {activeSlide < pitchSlides.length - 1 ? (
                      <>Next Slide <ChevronRight className="w-4 h-4" /></>
                    ) : (
                      <>Launch Live Sandbox <Maximize2 className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 2: COMPETITIVE COMPARISON MATRIX */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-900 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  Competitive Differentiation
                </span>
                <h3 className="text-lg font-extrabold text-[#24083b] mt-1">Why Providers Switch to Straight Up Training</h3>
                <p className="text-xs text-slate-500">Compare traditional manual workflows against our automated multi-profile hub.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                      <th className="p-3.5 rounded-tl-xl">Operational Feature / Capability</th>
                      <th className="p-3.5 text-slate-500 bg-slate-100/80">Traditional Spreadsheets & Legacy LMS</th>
                      <th className="p-3.5 text-purple-950 bg-purple-50/80 rounded-tr-xl">Straight Up Training Growth Hub</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-all">
                      <td className="p-3.5 font-bold text-slate-800">Participant Evidence Logging</td>
                      <td className="p-3.5 text-slate-500 bg-slate-50/50 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> Manual paper, emails, and back-and-forth chasing
                      </td>
                      <td className="p-3.5 font-bold text-purple-950 bg-purple-50/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Mobile candidate portal with 1-click upload
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-all">
                      <td className="p-3.5 font-bold text-slate-800">PBAS & Hours Sign-Off Time</td>
                      <td className="p-3.5 text-slate-500 bg-slate-50/50 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> 15–20 minutes per candidate weekly
                      </td>
                      <td className="p-3.5 font-bold text-purple-950 bg-purple-50/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Under 2 minutes via automated verification queue
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-all">
                      <td className="p-3.5 font-bold text-slate-800">Staff Leave Coverage Gap</td>
                      <td className="p-3.5 text-slate-500 bg-slate-50/50 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> Caseload stalls when Case Manager goes on leave
                      </td>
                      <td className="p-3.5 font-bold text-purple-950 bg-purple-50/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Coverage Mode reassigns caseload with zero gaps
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-all">
                      <td className="p-3.5 font-bold text-slate-800">DEWR & Internal Audit Readiness</td>
                      <td className="p-3.5 text-slate-500 bg-slate-50/50 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> High risk of missing evidence during compliance audits
                      </td>
                      <td className="p-3.5 font-bold text-purple-950 bg-purple-50/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Instant auditor-ready CSV exports & 90-day locker
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FULL-SCREEN OPERATIONAL DEMO OVERLAY MODAL */}
      {activeFullDemoRole && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col overflow-hidden animate-fadeIn">
          {/* TOP DEMO CONTROL BAR */}
          <div className="bg-purple-950 text-white px-6 py-2.5 flex items-center justify-between border-b border-purple-800 shadow-lg shrink-0">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-0.5 bg-emerald-500 text-purple-950 font-extrabold text-[10px] rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Maximize2 className="w-3 h-3" />
                <span>Live Interactive Sandbox</span>
              </span>
              <span className="text-xs font-bold text-purple-200">
                {activeFullDemoRole === 'participant' && 'Viewing: Candidate Portal (Alex Participant)'}
                {activeFullDemoRole === 'coach' && 'Viewing: Case Manager Dashboard (Casey Smith)'}
                {activeFullDemoRole === 'owner' && 'Viewing: Business Manager Overview (Morgan Taylor)'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveFullDemoRole(null)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center space-x-1 shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>Return to Sales Hub</span>
              </button>
            </div>
          </div>

          {/* OPERATIONAL COMPONENT VIEWPORT */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
            {activeFullDemoRole === 'participant' && <ParticipantHome />}
            {activeFullDemoRole === 'coach' && <CaseManager />}
            {activeFullDemoRole === 'owner' && <OwnerDashboard />}
          </div>
        </div>
      )}

      {/* DEMO PRESENTATION DRAWER */}
      {showDemoDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white max-w-md w-full h-full p-6 flex flex-col justify-between shadow-2xl space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Provider Presentation Guide</h3>
                  <p className="text-xs text-purple-900 font-semibold">{activePreset.name} Demo Script</p>
                </div>
                <button onClick={() => setShowDemoDrawer(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ×
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                  <span className="font-bold text-purple-950">1. Opening Hook ({activePreset.badge})</span>
                  <p className="text-slate-700">"{activePreset.repHook}"</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-950">2. Highlight Candidate Mirror</span>
                  <p className="text-slate-700">
                    "Launch the Candidate Portal to show how participants log evidence and practice STAR behavioral interviews on mobile."
                  </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-amber-950">3. Address Case Manager Workload</span>
                  <p className="text-slate-700">
                    "Showcase 1-click approvals and Coverage Mode in the Case Manager Dashboard. Est. {activePreset.adminHoursSavedPerStaff} hours saved weekly per staff member."
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDemoDrawer(false)}
              className="w-full py-2 bg-purple-950 text-white font-bold rounded-xl text-xs"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesDemoDashboard;