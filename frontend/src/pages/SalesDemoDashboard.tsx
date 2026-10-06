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
  TrendingUp,
  Clock,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Building2,
  ChevronRight,
  LogOut,
  Maximize2,
  X,
  FileSpreadsheet,
  Zap,
  ShieldCheck,
  RotateCcw,
  Briefcase,
  Lightbulb,
  XCircle
} from 'lucide-react';

export type MarketSegment = 'workforce_au' | 'des' | 'parentsnext_ttw' | 'rto_tafe';

export const MARKET_PRESETS: Record<MarketSegment, {
  name: string;
  badge: string;
  framework: string;
  avgOutcomeFee: number;
  adminHoursSavedPerStaff: number;
  pitchHook: string;
  repHook?: string;
  objectionHandling: string;
  objectionTip?: string;
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
    complianceLabel: 'PBAS Points Target Compliance',
    pitchHook: "Reclaiming 6.5 hrs/week per Case Manager converts directly into 13 additional 1-on-1 coaching sessions per staff member. Automating PBAS sign-offs transforms staff from paperwork clerks into high-impact employment coaches.",
    repHook: "Eliminate manual PBAS evidence collection and keep participants 100% compliant with automated sign-offs.",
    objectionHandling: "Focus on how 1-click evidence approvals eliminate manual PBAS chasing and safeguard against DEWR audit demerits and payment clawbacks.",
    objectionTip: "WFA outcome fees average $2,800–$3,500. Focus on how 1-click approvals free up Case Managers to focus on job placement."
  },
  des: {
    name: 'Inclusive Employment Australia (IEA / DES)',
    badge: 'IEA / Ongoing Support',
    framework: 'DSS / Ongoing Support',
    avgOutcomeFee: 2800,
    adminHoursSavedPerStaff: 5.5,
    trainingTimeReducedPct: 70,
    feeLabel: 'Avg. Ongoing Support Outcome Fee',
    complianceLabel: 'Ongoing Support & Retention Rate',
    pitchHook: "Frees Case Managers to focus on high-touch participant retention and workplace support rather than tracking contact documentation. Prevents participant drop-offs.",
    repHook: "Automate ongoing support tracking and timestamped participant contact proof.",
    objectionHandling: "Emphasize how timestamped contact logs and flexible obligation tracking create bulletproof compliance proof for DSS audits.",
    objectionTip: "DES outcomes rely on retention. Show how automated check-ins prevent participant drop-offs."
  },
  parentsnext_ttw: {
    name: 'Transition to Work (TtW) / ParentsNext',
    badge: 'Youth & Early Intervention',
    framework: 'Youth & Early Intervention',
    avgOutcomeFee: 2400,
    adminHoursSavedPerStaff: 5.0,
    trainingTimeReducedPct: 80,
    feeLabel: 'Avg. Education / Outcome Fee',
    complianceLabel: 'Participation & Education Rate',
    pitchHook: "Accelerates youth engagement through instant AI STAR interview practice runs and rapid digital evidence validation, keeping participants active and compliant.",
    repHook: "Engage youth candidates on mobile while automating activity sign-offs.",
    objectionHandling: "Demonstrate how guided workflows allow new youth coaches to onboard in days without deep policy training.",
    objectionTip: "TtW targets youth engagement. Highlight the AI STAR interview feature for candidate readiness."
  },
  rto_tafe: {
    name: 'RTOs, TAFEs & Higher Education',
    badge: 'Vocational & Higher Ed',
    framework: 'ASQA & Graduate Outcome Standards',
    avgOutcomeFee: 1800,
    adminHoursSavedPerStaff: 0,
    trainingTimeReducedPct: 85,
    feeLabel: 'Est. Value per Placed Graduate',
    complianceLabel: 'ASQA Graduate Placement Proof',
    pitchHook: "Proves that vocational training directly translates into real-world job readiness and employment pathways. Timestamped STAR reports and digital resume lockers give RTOs bulletproof ASQA evidence while driving higher graduate placement rates and student enrollment appeal.",
    repHook: "Centralize graduate resumes, STAR interview practice logs, and verified employment pathway evidence for ASQA compliance.",
    objectionHandling: "Highlight that this platform does not replace vocational training—it provides the missing job-readiness & outcome tracking layer to prove student employment pathways to ASQA auditors and funding bodies.",
    objectionTip: "RTOs care about graduate outcomes and ASQA compliance. Position this as an outcome booster that drives course completion and student enrollment appeal."
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
  const [currentPlacementRate, setCurrentPlacementRate] = useState<number>(35);
  const [customOutcomeFee, setCustomOutcomeFee] = useState<number>(activePreset.avgOutcomeFee);
  const [hourlyStaffCost, setHourlyStaffCost] = useState<number>(45);

  // Viewports & Tabs
  const [activeDemoTab, setActiveDemoTab] = useState<'calculator' | 'presentation'>('calculator');
  const [showDemoDrawer, setShowDemoDrawer] = useState<boolean>(false);
  const [showCalculationDrawer, setShowCalculationDrawer] = useState<boolean>(false);
  const [activeFullDemoRole, setActiveFullDemoRole] = useState<'participant' | 'coach' | 'owner' | null>(null);

  // Sync Market Changes
  const handleMarketChange = (market: MarketSegment) => {
    setSelectedMarket(market);
    setCustomOutcomeFee(MARKET_PRESETS[market].avgOutcomeFee);

    if (market === 'workforce_au') setActiveContract('Workforce Australia');
    else if (market === 'des') setActiveContract('Inclusive Employment Australia (IEA)' as any);
    else if (market === 'parentsnext_ttw') setActiveContract('TtW');
    else if (market === 'rto_tafe') setActiveContract('RTO');
  };

  // Formulas
  const projectedPlacementRate = Math.min(85, currentPlacementRate + 25);
  const additionalPlacements = Math.round((caseloadSize * (projectedPlacementRate - currentPlacementRate)) / 100);
  const hoursSavedPerStaff = activePreset.adminHoursSavedPerStaff;
  const totalWeeklyHoursSaved = Math.round(hoursSavedPerStaff * avgStaffCount);
  const totalAnnualHoursSaved = totalWeeklyHoursSaved * 52;
  const annualCapacityValueReclaimed = Math.round(totalAnnualHoursSaved * hourlyStaffCost);
  const extraCoachingSessionsPerWeek = Math.round(totalWeeklyHoursSaved * 2);

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
                  Executive Evaluation Portal
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                WorkReady Platform Demonstration & Operational Capacity Suite
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
                  alert('↺ Demo state reset!');
                }}
                className="px-3.5 py-1.5 bg-purple-800/80 hover:bg-purple-700 border border-purple-400/40 text-white text-xs font-extrabold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                <span>↺ Reset State</span>
              </button>
            )}

            {!urlParams.isProspect && (
              <button
                onClick={() => setShowDemoDrawer(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 border border-amber-400/40 text-purple-950 text-xs font-extrabold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Sales Script Guide</span>
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Close View</span>
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

        {/* 3. GLOBAL TARGET MARKET & FRAMEWORK SELECTOR WITH INSTRUCTIONS */}
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

        {/* 4. EXECUTIVE TAB NAVIGATION WITH INSTRUCTIONS */}
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
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>📊 Financial & Capacity Model</span>
              </button>

              <button
                onClick={() => setActiveDemoTab('presentation')}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 ${
                  activeDemoTab === 'presentation'
                    ? 'bg-purple-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Presentation className="w-4 h-4 text-amber-400" />
                <span>🌱 Strategic Vision & Operational Pillars</span>
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

              <div className="lg:col-span-2 bg-gradient-to-br from-purple-950 via-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-xl border border-purple-800/50 flex flex-col justify-between space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-purple-800/50 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      Projected Capacity ROI • {activePreset.framework}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white mt-2">Commercial Impact Summary</h3>
                    <p className="text-xs text-purple-200/80">Estimated capacity gains and cost savings enabled by Straight Up Training integration.</p>
                  </div>

                  <button
                    onClick={() => setShowCalculationDrawer(true)}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center space-x-1.5 shrink-0"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
                    <span>🔍 How is this calculated?</span>
                  </button>
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

                {!urlParams.isProspect && (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-bold text-amber-300">Sales Pitch Hook ({activePreset.badge}):</span>
                      </div>
                      <span className="text-[10px] text-purple-300 font-mono">Est. {activePreset.adminHoursSavedPerStaff} hrs/wk saved/staff</span>
                    </div>
                    <p className="text-xs text-purple-100 italic">"{activePreset.repHook}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STRATEGIC VISION & OPERATIONAL PILLARS */}
        {activeDemoTab === 'presentation' && (
          <div className="space-y-6">
            
            {/* 1. HUMANIZED STRATEGIC HEADER */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-900 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full">
                OPERATIONAL ARCHITECTURE
              </span>
              <h3 className="text-xl font-extrabold text-purple-950">Empowering Candidates & Unburdening Coaching Staff</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                How Straight Up Training turns compliance friction into human momentum—giving candidates confidence, freeing case managers to coach, and protecting executive contract funding.
              </p>
            </div>

            {/* 2. THE 3 HUMAN-FIRST OPERATIONAL PILLARS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* PILLAR 1: CANDIDATE CONFIDENCE & DIGITAL INCLUSION */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md inline-block">
                    ✨ CANDIDATE EXPERIENCE
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
                  <span>📱 Experience Candidate Portal</span>
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
                    Automates compliance behind the scenes with 90-day timestamped evidence lockers and 1-click auditor exports—eliminating clawback risks without overburdening staff.
                  </p>
                </div>
                <button
                  onClick={() => setActiveFullDemoRole('owner')}
                  className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>🛡 Experience Leadership Overview</span>
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
                  <span className="font-extrabold text-purple-900 block">🔐 Role-Based Access Controls</span>
                  <p className="text-[11px] text-slate-600">Strict organizational permissions safeguard candidate privacy and maintain compliance continuity.</p>
                </div>
              </div>
            </div>

            {/* 4. HUMAN-FRIENDLY COMPARISON MATRIX */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-900 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full">
                  OPERATIONAL COMPARISON
                </span>
                <h3 className="text-lg font-extrabold text-[#24083b] mt-1">The Difference in Everyday Practice</h3>
                <p className="text-xs text-slate-500">See how moving from manual record-keeping to Straight Up Training transforms the daily experience for candidates, coaches, and leadership.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                      <th className="p-3.5 rounded-tl-xl w-1/3">Daily Operational Task</th>
                      <th className="p-3.5 text-slate-500 bg-slate-100/80 w-1/3">Traditional Manual Spreadsheets & Paper Paperwork</th>
                      <th className="p-3.5 text-purple-950 bg-purple-50/80 rounded-tr-xl w-1/3">Straight Up Training Human Engine</th>
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
                          <span>15–20 minutes of repetitive paperwork per candidate</span>
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

      {/* FULL-SCREEN INTERACTIVE SANDBOX MODAL */}
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
            {activeFullDemoRole === 'owner' && <OwnerDashboard />}
          </div>
        </div>
      )}

      {/* DEMO GUIDE DRAWER */}
      {showDemoDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white max-w-md w-full h-full p-6 flex flex-col justify-between shadow-2xl space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Internal Sales Presentation Guide</h3>
                  <p className="text-xs text-purple-900 font-semibold">{activePreset.name} Script</p>
                </div>
                <button onClick={() => setShowDemoDrawer(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                  ×
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                  <span className="font-bold text-purple-950">1. Opening Hook ({activePreset.badge})</span>
                  <p className="text-slate-700">"{activePreset.repHook}"</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-950">2. Address Candidate Tech Fear</span>
                  <p className="text-slate-700">
                    "Launch Candidate Portal to show how simple voice inputs and AI STAR interview practice build candidate confidence without tech anxiety."
                  </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-amber-950">3. Showcase Coach Time Recovery</span>
                  <p className="text-slate-700">
                    "Show 1-click verification queue and Coverage Mode in Coach Dashboard. Est. {activePreset.adminHoursSavedPerStaff} hours saved weekly per coach."
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

      {/* CALCULATION DRAWER */}
      {showCalculationDrawer && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                  <span>Calculation Logic & Audit Sheet</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Transparent financial formulas and operational assumptions.</p>
              </div>
              <button
                onClick={() => setShowCalculationDrawer(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-extrabold text-purple-950 uppercase text-[10px] tracking-wider">1. Staff Admin Hours Saved Formula</h4>
                <p className="font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                  Weekly Hours Saved = {avgStaffCount} Staff × {activePreset.adminHoursSavedPerStaff} hrs/wk = <strong>{totalWeeklyHoursSaved} hrs/wk</strong>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-extrabold text-purple-950 uppercase text-[10px] tracking-wider">2. Capacity Value Reclaimed Formula</h4>
                <p className="font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                  Annual Capacity Value = {totalWeeklyHoursSaved} hrs/wk × 52 weeks × ${hourlyStaffCost}/hr = <strong>+${annualCapacityValueReclaimed.toLocaleString()}/yr</strong>
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCalculationDrawer(false)}
                className="px-4 py-2 bg-purple-950 text-white font-bold text-xs rounded-xl hover:bg-purple-900 transition-all"
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