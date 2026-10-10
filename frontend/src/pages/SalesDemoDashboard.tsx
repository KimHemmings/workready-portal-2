import React, { useState } from 'react';
import { useDemoParams } from '../useDemoParams';
import { ProspectTourModal } from '../components/ProspectTourModal';
import { usePortal } from '../context/PortalContext';
import ParticipantHome from './ParticipantHome';
import CoachDashboard from './CoachDashboard';
import OwnerDashboard from './OwnerDashboard';
import {
  Calculator,
  Presentation,
  LogOut,
  Maximize2,
  X,
  FileSpreadsheet,
  Zap,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers
} from 'lucide-react';

export type MarketSegment = 'workforce_au' | 'des' | 'parentsnext_ttw' | 'rto_tafe';

export const MARKET_PRESETS: Record<MarketSegment, {
  name: string;
  badge: string;
  framework: string;
  avgOutcomeFee: number;
  adminHoursSavedPerStaff: number;
  trainingTimeReducedPct: number;
  feeLabel?: string;
  complianceLabel?: string;
}> = {
  workforce_au: {
    name: 'Workforce Australia (WFA)',
    badge: 'DEWR Framework',
    framework: 'DEWR Framework',
    avgOutcomeFee: 3200,
    adminHoursSavedPerStaff: 6.5,
    trainingTimeReducedPct: 75,
    feeLabel: 'Avg. 12/26-Week Outcome Fee',
    complianceLabel: 'PBAS Points Target Compliance'
  },
  des: {
    name: 'Inclusive Employment Australia (IEA / DES)',
    badge: 'IEA / Ongoing Support',
    framework: 'DSS / Ongoing Support',
    avgOutcomeFee: 2800,
    adminHoursSavedPerStaff: 5.5,
    trainingTimeReducedPct: 70,
    feeLabel: 'Avg. Ongoing Support Outcome Fee',
    complianceLabel: 'Ongoing Support & Retention Rate'
  },
  parentsnext_ttw: {
    name: 'Transition to Work (TtW) / ParentsNext',
    badge: 'Youth & Early Intervention',
    framework: 'Youth & Early Intervention',
    avgOutcomeFee: 2400,
    adminHoursSavedPerStaff: 5.0,
    trainingTimeReducedPct: 80,
    feeLabel: 'Avg. Education / Outcome Fee',
    complianceLabel: 'Participation & Education Rate'
  },
  rto_tafe: {
    name: 'RTOs, TAFEs & Higher Education',
    badge: 'Vocational & Higher Ed',
    framework: 'ASQA & Graduate Outcome Standards',
    avgOutcomeFee: 1800,
    adminHoursSavedPerStaff: 0,
    trainingTimeReducedPct: 85,
    feeLabel: 'Est. Value per Placed Graduate',
    complianceLabel: 'ASQA Graduate Placement Proof'
  }
};

export function SalesDemoDashboard() {
  const { setActiveContract, resetSandboxState } = usePortal();

  // URL Parameter Engine & Prospect State
  const urlParams = useDemoParams();
  const [showProspectTour, setShowProspectTour] = useState<boolean>(urlParams.isProspect);

  // Selected Market State
  const [selectedMarket, setSelectedMarket] = useState<MarketSegment>(urlParams.market || 'workforce_au');
  const activePreset = MARKET_PRESETS[selectedMarket];

  // Calculator Inputs
  const [caseloadSize, setCaseloadSize] = useState<number>(150);
  const [avgStaffCount, setAvgStaffCount] = useState<number>(5);
  const [hourlyStaffCost, setHourlyStaffCost] = useState<number>(45);

  // Viewports & Tabs
  const [activeDemoTab, setActiveDemoTab] = useState<'calculator' | 'presentation'>('calculator');
  const [showCalculationDrawer, setShowCalculationDrawer] = useState<boolean>(false);
  const [activeFullDemoRole, setActiveFullDemoRole] = useState<'participant' | 'coach' | 'owner' | null>(null);

  // Sync Market Changes
  const handleMarketChange = (market: MarketSegment) => {
    setSelectedMarket(market);
    if (market === 'workforce_au') setActiveContract('Workforce Australia');
    else if (market === 'des') setActiveContract('Inclusive Employment Australia (IEA)' as any);
    else if (market === 'parentsnext_ttw') setActiveContract('TtW');
    else if (market === 'rto_tafe') setActiveContract('RTO');
  };

  // Formulas
  const hoursSavedPerStaff = activePreset.adminHoursSavedPerStaff;
  const totalWeeklyHoursSaved = Math.round(hoursSavedPerStaff * avgStaffCount);
  const totalAnnualHoursSaved = totalWeeklyHoursSaved * 52;
  const annualCapacityValueReclaimed = Math.round(totalAnnualHoursSaved * hourlyStaffCost);

  const handleSignOut = () => {
    resetSandboxState();
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* HUMANIZED HEADER BAR */}
      <header className="bg-linear-to-r from-[#1e1b4b] via-[#24083b] to-[#1e1b4b] text-white px-6 py-4 border-b border-purple-900/50 shadow-md">
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
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Executive Portal
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Empowering Job Seekers & Unburdening Case Management Teams
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-wrap">
            {!urlParams.isProspect && (
              <button
                onClick={() => {
                  resetSandboxState();
                  localStorage.removeItem('star_practice_completed_count');
                  localStorage.removeItem('participant_points');
                  window.dispatchEvent(new Event('storage'));
                  alert('â†º Demo state reset!');
                }}
                className="px-3.5 py-1.5 bg-purple-800/80 hover:bg-purple-700 border border-purple-400/40 text-white text-xs font-extrabold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                <span>↺ Reset State</span>
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">

        {/* 1. PROSPECT PERSONALIZED WELCOME BANNER */}
        {urlParams.isProspect && (
          <div className="bg-purple-900 text-white p-4 rounded-2xl border border-purple-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-full">
                Custom Executive Portal
              </span>
              <h2 className="text-base font-extrabold text-white">
                Prepared for {urlParams.providerName} Leadership
              </h2>
            </div>

            <button
              onClick={() => setShowProspectTour(true)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
            >
              ✨ Re-open Guided Walkthrough
            </button>
          </div>
        )}

        {/* 2. PROSPECT TOUR MODAL */}
        <ProspectTourModal
          providerName={urlParams.providerName}
          marketName={activePreset.name}
          isOpen={showProspectTour}
          onClose={() => setShowProspectTour(false)}
          onSelectTab={(tab) => setActiveDemoTab(tab)}
        />

        {/* 3. GLOBAL TARGET MARKET & FRAMEWORK SELECTOR */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900">
                SELECT YOUR OPERATIONAL FRAMEWORK
              </span>
              <h3 className="text-sm font-extrabold text-purple-950">Contract & Funding Alignment</h3>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xl">
              Choose your organization's primary funding contract below to align terminology, commercial metrics, and audit safeguards across both tabs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
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

        {/* 4. EXECUTIVE TAB NAVIGATION */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md">
                EVALUATION NAVIGATION
              </span>
              <h3 className="text-base font-extrabold text-purple-950 mt-1">Partnership Impact & Evaluation Hub</h3>
              <p className="text-xs text-slate-500 font-medium">
                Switch tabs below to explore quantified financial capacity gains or review our human-first operational strategy.
              </p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold space-x-1 shrink-0">
              <button
                onClick={() => setActiveDemoTab('calculator')}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 ${
                  activeDemoTab === 'calculator'
                    ? 'bg-purple-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Financial Model</span>
              </button>

              <button
                onClick={() => setActiveDemoTab('presentation')}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 ${
                  activeDemoTab === 'presentation'
                    ? 'bg-purple-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Presentation className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Operational Strategy</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: FINANCIAL & CAPACITY MODEL */}
        {activeDemoTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-purple-600" />
                  <span>Provider Operational Inputs</span>
                </h4>
                <p className="text-xs text-slate-500">Adjust parameters to model your organization's capacity gains.</p>

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
                      <span>Avg. Loaded Staff Hourly Cost</span>
                      <span className="text-purple-950 font-black">${hourlyStaffCost}/hr</span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="85" 
                      step="5"
                      value={hourlyStaffCost}
                      onChange={(e) => setHourlyStaffCost(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1 text-[11px] text-purple-950 mt-2">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-purple-900 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-purple-600" /> Guided Workflow Impact
                    </span>
                    <p className="text-purple-800 font-medium">
                      Reduces staff onboarding time by <strong>{activePreset.trainingTimeReducedPct}%</strong> through 1-click guided workflow guardrails.
                    </p>
                  </div>
                </div>
              </div>

              {/* COMMERCIAL IMPACT CARD WITH NO VERTICAL VOID */}
              <div className="lg:col-span-2 bg-linear-to-br from-purple-950 via-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-xl border border-purple-800/50 space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-purple-800/50 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      Projected Capacity ROI â€¢ {activePreset.framework}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white mt-2">Commercial Impact Summary</h3>
                    <p className="text-xs text-purple-200/80">Estimated capacity gains and cost savings enabled by Straight Up Training integration.</p>
                  </div>

                  <button
                    onClick={() => setShowCalculationDrawer(true)}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
                    <span>🔍 How is this calculated?</span>
                  </button>
                </div>

                {/* EXECUTIVE STRATEGIC IMPACT BAR */}
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center space-x-3 text-xs">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                  <p className="text-purple-100 font-medium leading-relaxed">
                    {selectedMarket === 'rto_tafe'
                      ? "Empowers students with 24/7 AI interview simulations and digital resume lockers, proving clear graduate employment pathways for ASQA compliance."
                      : "Automates routine participant evidence collection and sign-offs, converting administrative overhead into direct 1-on-1 coaching time."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedMarket === 'rto_tafe' ? (
                    <>
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                        <span className="text-xs text-purple-200 font-bold block">Graduate Job-Readiness</span>
                        <div className="text-2xl font-black text-amber-300 mt-1">85% Ready</div>
                        <p className="text-[10px] text-purple-300">
                          AI STAR interview practice & digital resume lockers
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                        <span className="text-xs text-purple-200 font-bold block">ASQA Audit Evidence Proof</span>
                        <div className="text-2xl font-black text-emerald-400 mt-1">100% Verified</div>
                        <p className="text-[10px] text-purple-300">
                          Timestamped graduate outcome & pathway logs
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                        <span className="text-xs text-purple-200 font-bold block">Enrollment & Appeal Gain</span>
                        <div className="text-2xl font-black text-purple-300 mt-1">+25% Outcomes</div>
                        <p className="text-[10px] text-purple-300">
                          Proves course training leads directly to employment
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                        <span className="text-xs text-purple-200 font-bold block">Staff Admin Hours Saved</span>
                        <div className="text-2xl font-black text-amber-300 mt-1">{totalWeeklyHoursSaved} hrs/wk</div>
                        <p className="text-[10px] text-purple-300">
                          Directly reduces sign-off paperwork ({activePreset.adminHoursSavedPerStaff} hrs/staff)
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                        <span className="text-xs text-purple-200 font-bold block">Capacity Value Reclaimed</span>
                        <div className="text-2xl font-black text-emerald-400 mt-1">
                          +${annualCapacityValueReclaimed.toLocaleString()}
                        </div>
                        <p className="text-[10px] text-purple-300">
                          Annual payroll equivalent @ ${hourlyStaffCost}/hr
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                        <span className="text-xs text-purple-200 font-bold block">Staff Onboarding Speed</span>
                        <div className="text-2xl font-black text-purple-300 mt-1">
                          {activePreset.trainingTimeReducedPct}% Faster
                        </div>
                        <p className="text-[10px] text-purple-300">
                          Cuts staff onboarding from weeks to days
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STRATEGIC VISION & OPERATIONAL PILLARS */}
        {activeDemoTab === 'presentation' && (
          <div className="space-y-6">
            
            {/* 1. STRATEGIC HEADER */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-900 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full">
                OPERATIONAL ARCHITECTURE
              </span>
              <h3 className="text-xl font-extrabold text-purple-950">Empowering Candidates & Unburdening Coaching Staff</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                How Straight Up Training turns compliance friction into human momentumâ€”giving candidates confidence, freeing case managers to coach, and protecting executive contract funding.
              </p>
            </div>

            {/* SOFT COMPARISON: ZERO RIP-AND-REPLACE BANNER */}
            <div className="bg-linear-to-r from-purple-50 via-indigo-50/50 to-purple-50 border border-purple-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-950 text-amber-300 rounded-xl shrink-0 mt-0.5">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-purple-950">Non-Disruptive System Layering</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Zero Rip-and-Replace
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Engineered to complementâ€”not replaceâ€”your core database (ReadyTech, JobReady, ESSWeb, or RTO Student Management Systems). Operates as a lightweight, high-touch engagement engine that feeds verified evidence logs directly into your existing reporting workflow.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. THE 3 HUMAN-FIRST OPERATIONAL PILLARS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* PILLAR 1: CANDIDATE CONFIDENCE & DIGITAL INCLUSION */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md inline-block">
                    âœ¨ CANDIDATE EXPERIENCE
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm">Candidate Confidence & Digital Inclusion</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Built for real people of all digital skill levels. Smartphone-first voice inputs, bite-sized daily actions, and a 24/7 judgment-free AI Interview Studio help participants overcome tech anxiety and build genuine workplace readiness.
                  </p>
                </div>
                <button
                  onClick={() => setActiveFullDemoRole('participant')}
                  className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>📱 Experience Portal</span>
                </button>
              </div>

              {/* PILLAR 2: COACH CAPACITY & FREEDOM */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md inline-block">
                    🌱 STAFF EMPOWERMENT
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm">Coach Capacity & Operational Freedom</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Reclaims over 6 hours every week per case manager by automating evidence tracking and sign-offs, returning valuable time back to 1-on-1 participant mentoring.
                  </p>
                </div>
                <button
                  onClick={() => setActiveFullDemoRole('coach')}
                  className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>⚡ Experience Coach Dashboard</span>
                </button>
              </div>

              {/* PILLAR 3: CONTRACT INTEGRITY & GOVERNANCE */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-md inline-block">
                    🛡️ GOVERNANCE & RISK
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm">Contract Integrity & Audit Safeguards</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automates compliance behind the scenes with 90-day timestamped evidence lockers and 1-click auditor exportsâ€”eliminating clawback risks without overburdening staff.
                  </p>
                </div>
                <button
                  onClick={() => setActiveFullDemoRole('owner')}
                  className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>🛡️ Experience Leadership Overview</span>
                </button>
              </div>
            </div>

            {/* 3. DATA SECURITY & SOVEREIGN VAULT CARD */}
            <div className="p-5 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-purple-950">Enterprise Data Sovereignty & Compliance Guarantee</h4>
                    <p className="text-xs text-slate-500">Engineered to meet Australian Privacy Principles and DEWR, DSS & ASQA audit standards.</p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full w-max">
                  🔒 100% Onshore Australian Sovereignty
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <span className="font-extrabold text-purple-950 block">🇦🇺 Onshore Data Hosting</span>
                  <p className="text-[11px] text-slate-600">Candidate PII remains strictly within Australian data centers under Privacy Act requirements.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <span className="font-extrabold text-emerald-900 block">📜 Immutable Evidence Vault</span>
                  <p className="text-[11px] text-slate-600">Every upload and sign-off is permanently archived for instant 1-click auditor CSV export.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                  <span className="font-extrabold text-purple-900 block">🔑 Role-Based Access Controls</span>
                  <p className="text-[11px] text-slate-600">Strict organizational permissions safeguard candidate privacy and maintain compliance continuity.</p>
                </div>
              </div>
            </div>

            {/* 4. SOFT COMPARISON MATRIX */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-900 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  OPERATIONAL COMPARISON
                </span>
                <h3 className="text-lg font-extrabold text-[#24083b] mt-1">The Difference in Everyday Practice</h3>
                <p className="text-xs text-slate-500">See how layering Straight Up Training onto your core database transforms the daily experience for candidates, coaches, and leadership.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                      <th className="p-3.5 rounded-tl-xl w-1/3">Daily Operational Task</th>
                      <th className="p-3.5 text-slate-500 bg-slate-100/80 w-1/3">Traditional Record-Keeping Databases (SMS / Core Systems)</th>
                      <th className="p-3.5 text-purple-950 bg-purple-50/80 rounded-tr-xl w-1/3">Straight Up Training Capacity Recovery Engine</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-all">
                      <td className="p-3.5 font-bold text-slate-800">Candidate Activity & Evidence Logging</td>
                      <td className="p-3.5 text-slate-500 bg-slate-50/50">
                        <div className="flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Manual paper forms, back-and-forth email chasing, lost receipts</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-purple-950 bg-purple-50/30">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Voice-assisted mobile app with 1-click photo uploads</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-all">
                      <td className="p-3.5 font-bold text-slate-800">Weekly Progress Sign-Offs</td>
                      <td className="p-3.5 text-slate-500 bg-slate-50/50">
                        <div className="flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>15â€“20 minutes of repetitive paperwork per candidate</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-purple-950 bg-purple-50/30">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Under 2 minutes via automated smart verification queues</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-all">
                      <td className="p-3.5 font-bold text-slate-800">Staff Leave & Coverage Gaps</td>
                      <td className="p-3.5 text-slate-500 bg-slate-50/50">
                        <div className="flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Participant progress stalls completely when staff go on leave</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-purple-950 bg-purple-50/30">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>1-click Coverage Mode reassigns caseloads with zero gaps</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-all">
                      <td className="p-3.5 font-bold text-slate-800">Government Compliance Audit Preparation</td>
                      <td className="p-3.5 text-slate-500 bg-slate-50/50">
                        <div className="flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>Stressful manual file audits and risk of revenue clawbacks</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-purple-950 bg-purple-50/30">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Instant auditor-ready CSV exports and 90-day timestamped lockers</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* FULL-SCREEN INTERACTIVE SANDBOX MODAL - LAUNCHES AUDIT TAB DIRECTLY FOR GOVERNANCE */}
      {activeFullDemoRole && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col overflow-hidden animate-fadeIn">
          <div className="bg-purple-950 text-white px-6 py-2.5 flex items-center justify-between border-b border-purple-800 shadow-lg shrink-0">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-0.5 bg-emerald-500 text-purple-950 font-extrabold text-[10px] rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Maximize2 className="w-3 h-3" />
                <span>Live Interactive Experience</span>
              </span>
              <span className="text-xs font-bold text-purple-200">
                {activeFullDemoRole === 'participant' && 'Viewing Candidate Portal (Alex Participant)'}
                {activeFullDemoRole === 'coach' && 'Viewing Case Manager Dashboard (Casey Smith)'}
                {activeFullDemoRole === 'owner' && 'Viewing Executive Overview (Morgan Taylor)'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveFullDemoRole(null)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center space-x-1 shadow-sm cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>← Exit Live Sandbox</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50">
            {activeFullDemoRole === 'participant' && <ParticipantHome />}
            {activeFullDemoRole === 'coach' && <CoachDashboard />}
            {/* UPDATED: Passes defaultTab="audit" to load Activity Logs & CRM Export directly */}
            {activeFullDemoRole === 'owner' && <OwnerDashboard defaultTab="audit" />}
          </div>
        </div>
      )}

      {/* CALCULATION DRAWER */}
      {showCalculationDrawer && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                  <span>Calculation Logic & Operational Assumptions</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Transparent model formulas for {activePreset.name}.</p>
              </div>
              <button
                onClick={() => setShowCalculationDrawer(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                âœ•
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedMarket === 'rto_tafe' ? (
                <>
                  <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 space-y-1.5">
                    <h4 className="font-extrabold text-purple-950 uppercase text-[10px] tracking-wider">1. Graduate Outcome & Placement Rate Impact</h4>
                    <p className="font-mono text-purple-950 bg-white p-2 rounded-lg border border-purple-200">
                      Target Job Readiness Rate = <strong>85% Employer Ready</strong>
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Combining AI STAR interview simulations and digital resume lockers accelerates graduate job placements, directly boosting vocational course completion and student enrollment appeal.
                    </p>
                  </div>

                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                    <h4 className="font-extrabold text-emerald-950 uppercase text-[10px] tracking-wider">2. ASQA Compliance Evidence Vault</h4>
                    <p className="font-mono text-emerald-950 bg-white p-2 rounded-lg border border-emerald-200">
                      ASQA Standard 1.2 Verification = <strong>100% Timestamped Audit Proof</strong>
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      Automates student employment pathway tracking with immutable evidence lockers and 1-click auditor export files.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <h4 className="font-extrabold text-purple-950 uppercase text-[10px] tracking-wider">1. Staff Admin Hours Saved Formula</h4>
                    <p className="font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                      Weekly Hours Saved = {avgStaffCount} Staff Ã— {activePreset.adminHoursSavedPerStaff} hrs/wk = <strong>{totalWeeklyHoursSaved} hrs/wk</strong>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Calculated by replacing manual paper-chasing and phone calls with automated candidate evidence uploads.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <h4 className="font-extrabold text-purple-950 uppercase text-[10px] tracking-wider">2. Capacity Value Reclaimed Formula</h4>
                    <p className="font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                      Annual Capacity Value = {totalWeeklyHoursSaved} hrs/wk Ã— 52 weeks Ã— ${hourlyStaffCost}/hr = <strong>+${annualCapacityValueReclaimed.toLocaleString()}/yr</strong>
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Represents the payroll value of case manager time reallocated from paperwork to 1-on-1 participant coaching.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCalculationDrawer(false)}
                className="px-4 py-2 bg-purple-950 text-white font-bold text-xs rounded-xl hover:bg-purple-900 transition-all cursor-pointer"
              >
                Close Calculation Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesDemoDashboard;