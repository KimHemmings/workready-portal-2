import React, { useState } from 'react';
import ParticipantHome from './ParticipantHome';
import CoachDashboard from './CoachDashboard';
import OwnerDashboard from './OwnerDashboard';
import { 
  Sparkles, Calculator, Presentation, ShieldCheck, 
  Users, Award, LogOut, Briefcase, X, Maximize2
} from 'lucide-react';

export function SalesDemoDashboard() {
  const [caseloadSize, setCaseloadSize] = useState<number>(150);
  const [avgStaffCount, setAvgStaffCount] = useState<number>(5);
  const [currentPlacementRate, setCurrentPlacementRate] = useState<number>(35);

  const [activeDemoTab, setActiveDemoTab] = useState<'calculator' | 'showcase'>('calculator');
  const [showDemoDrawer, setShowDemoDrawer] = useState<boolean>(false);
  
  // State for rendering full, live interactive profile pages inside full-screen demo viewports
  const [activeFullDemoRole, setActiveFullDemoRole] = useState<'participant' | 'coach' | 'owner' | null>(null);

  const projectedPlacementRate = Math.min(85, currentPlacementRate + 25);
  const additionalPlacements = Math.round((caseloadSize * (projectedPlacementRate - currentPlacementRate)) / 100);
  const estimatedRevenueGain = additionalPlacements * 3200;
  const hoursSavedPerStaff = 6.5;
  const totalWeeklyHoursSaved = Math.round(hoursSavedPerStaff * avgStaffCount);

  const handleSignOut = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

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

          <div className="flex items-center space-x-3">
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
            <p className="text-xs text-slate-500">Commercial projections, feature highlights, and presentation assets.</p>
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
              onClick={() => setActiveDemoTab('showcase')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeDemoTab === 'showcase'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Platform Feature Matrix</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PROVIDER ROI CALCULATOR */}
        {activeDemoTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                <span>Provider Operational Inputs</span>
              </h4>
              <p className="text-xs text-slate-500">Adjust parameters to reflect your target provider's caseload.</p>

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
                    <span>Current Outcome Milestone Rate</span>
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
              </div>
            </div>

            <div className="lg:col-span-2 bg-gradient-to-br from-purple-950 via-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-xl border border-purple-800/50 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  Projected Provider Financial ROI
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-2">Commercial Impact Summary</h3>
                <p className="text-xs text-purple-200/80">Estimated annual gains enabled by Straight Up Training integration.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-purple-200 font-bold">Estimated Revenue Unlocked</span>
                  <div className="text-2xl font-extrabold text-emerald-400">+${estimatedRevenueGain.toLocaleString()}</div>
                  <p className="text-[10px] text-purple-300">Based on +{additionalPlacements} additional placements</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-purple-200 font-bold">Staff Admin Hours Saved</span>
                  <div className="text-2xl font-extrabold text-amber-300">{totalWeeklyHoursSaved} hrs/wk</div>
                  <p className="text-[10px] text-purple-300">Directly reduces sign-off paperwork</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-purple-200 font-bold">Target Compliance Rate</span>
                  <div className="text-2xl font-extrabold text-white">{projectedPlacementRate}%</div>
                  <p className="text-[10px] text-purple-300">Up from baseline {currentPlacementRate}%</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-purple-200/90 flex items-center justify-between">
                <span>Want to customize this proposal for a specific Workforce Australia provider?</span>
                <button
                  onClick={() => setShowDemoDrawer(true)}
                  className="px-3 py-1.5 bg-emerald-500 text-purple-950 font-extrabold rounded-lg text-xs hover:bg-emerald-400"
                >
                  View Presentation Script
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLATFORM FEATURE MATRIX */}
        {activeDemoTab === 'showcase' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-900 rounded-xl flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">5 Pillars Diagnostic Mirror</h4>
              <p className="text-xs text-slate-600">
                Gives providers instant visibility across 5 key readiness pillars (Job Search, Interview, Skills, Logistics, Mindset).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-900 rounded-xl flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">AI STAR Practice Locker</h4>
              <p className="text-xs text-slate-600">
                Automated behavioral interview practice session reporting that auto-calculates +25 PBAS points upon submission.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Coverage Mode & 90-Day Audit</h4>
              <p className="text-xs text-slate-600">
                Staff away toggles ensure zero gap during team leave, backed by audit-ready 90-day retention logs.
              </p>
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
            {activeFullDemoRole === 'coach' && <CoachDashboard />}
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
                  <p className="text-xs text-purple-900 font-semibold">Sales Demo Script & Key Talking Points</p>
                </div>
                <button onClick={() => setShowDemoDrawer(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                  ×
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                  <span className="font-bold text-purple-950">1. Opening Hook (60 Seconds)</span>
                  <p className="text-slate-700">
                    "Straight Up Training simplifies PBAS compliance and candidate engagement, transforming manual paperwork into verified outcome revenue."
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-950">2. Highlight Candidate Mirror</span>
                  <p className="text-slate-700">
                    "Show the candidate view first—demonstrate how participants log interview proof and complete AI STAR mock practice for immediate PBAS points."
                  </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-amber-950">3. Address Case Manager Workload</span>
                  <p className="text-slate-700">
                    "Showcase the Case Manager Roster & Coverage Mode. Explain how staff can approve evidence with 1 click and manage coverage during leave."
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