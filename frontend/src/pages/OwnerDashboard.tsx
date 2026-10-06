import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  Users,
  Briefcase,
  Clock,
  Award,
  Building2,
  FileSpreadsheet,
  Plus,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Palette,
  Download,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

// Site Locations Configuration Data
const SITE_LOCATIONS = [
  { id: 'ALL', name: 'All Sites (Provider Aggregate)', candidateQuota: 200, staffQuota: 5 },
  { id: 'brisbane_north', name: 'Brisbane North Hub', candidateQuota: 100, staffQuota: 3 },
  { id: 'gold_coast', name: 'Gold Coast Hub', candidateQuota: 50, staffQuota: 1 },
  { id: 'sydney_cbd', name: 'Sydney CBD Hub', candidateQuota: 50, staffQuota: 1 },
];

export function OwnerDashboard() {
  const { candidates, verificationItems, activeContract, resetSandboxState, addCandidate } = usePortal();

  // Active Site Location State
  const [selectedSite, setSelectedSite] = useState<string>('ALL');

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'command' | 'roster' | 'slas' | 'branding' | 'audit'>('command');

  // License & Capacity Management State
  const [candidateQuota, setCandidateQuota] = useState<number>(200);
  const [staffQuota, setStaffQuota] = useState<number>(5);

  // SLA Management State (Business Days)
  const [placementSlaDays, setPlacementSlaDays] = useState<number>(2);
  const [interviewSlaDays, setInterviewSlaDays] = useState<number>(2);
  const [evidenceSlaDays, setEvidenceSlaDays] = useState<number>(4);

  // Dual Branding State
  const [providerName, setProviderName] = useState<string>('Straight Up Training Partner');
  const [primaryBrandColor, setPrimaryBrandColor] = useState<string>('#4f46e5');

  // Provision Modal Form State
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState<boolean>(false);
  const [newCandidateName, setNewCandidateName] = useState<string>('');
  const [assignedCm, setAssignedCm] = useState<string>('Casey Smith');

  // Send Prompt Modal State
const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
const [promptTargetCm, setPromptTargetCm] = useState<string>('Casey Smith');
const [promptCandidateName, setPromptCandidateName] = useState<string>('Alex Mercer');

// Activity Log Filter & Nudge Tracking State
  const [auditStatusFilter, setAuditStatusFilter] = useState<'ALL' | 'Pending' | 'Nudged' | 'Verified'>('ALL');
  const [auditCmFilter, setAuditCmFilter] = useState<string>('ALL');
  const [nudgedItems, setNudgedItems] = useState<Record<string, string>>({}); // Tracks nudged item IDs -> timestamp

// Manage Caseload Modal State
  const [selectedCmForManage, setSelectedCmForManage] = useState<string | null>(null);
  const [targetReassignCm, setTargetReassignCm] = useState<string>('Jordan Smith');

  // Dynamically retrieve quotas based on selected site
  const activeSiteConfig = SITE_LOCATIONS.find(s => s.id === selectedSite) || SITE_LOCATIONS[0];

  // Derived Metrics & Site Filtering
  const siteCandidates = candidates ? candidates.filter(c => 
    selectedSite === 'ALL' || (c as any).siteId === selectedSite
  ) : [];

  const activeCandidateCount = siteCandidates.length;
  const activeStaffCount = 3; // Static active staff roster count for demo

  // Quotas adjusted by selected site
  const currentCandidateQuota = activeSiteConfig.candidateQuota;
  const currentStaffQuota = activeSiteConfig.staffQuota;

  const candidateQuotaPercent = Math.round((activeCandidateCount / currentCandidateQuota) * 100);
  const staffQuotaPercent = Math.round((activeStaffCount / currentStaffQuota) * 100);

  // Verification Pipeline Metrics (Strictly verified items)
  const verifiedPlacements = verificationItems
    ? verificationItems.filter(v => v.type === 'Job Placement' && v.status === 'Verified').length
    : 1;

  const verifiedInterviews = verificationItems
    ? verificationItems.filter(v => v.type === 'Interview Claim' && v.status === 'Verified').length
    : 3;

  const pendingCount = verificationItems ? verificationItems.filter(v => v.status === 'Pending').length : 0;
  
  // Operational Conversion Rate
  const conversionRate = verifiedInterviews > 0 
    ? Math.round((verifiedPlacements / verifiedInterviews) * 100) 
    : 33;

  const handleSignOut = () => {
    resetSandboxState();
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleExportAuditCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Candidate Name,Ref ID,Item Type,Status,Submitted Date\n"
      + (verificationItems || []).map(i => `"${i.candidateName}","${i.id}","${i.type}","${i.status}","${i.submittedDate}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Activity_Log_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* 1. EXECUTIVE DUAL-BRANDED HEADER */}
      <header className="bg-gradient-to-r from-[#1e1b4b] via-[#24083b] to-[#1e1b4b] text-white px-6 py-5 border-b border-purple-900/50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-2xl p-1.5 flex items-center justify-center shadow-md overflow-hidden shrink-0">
              <img
                src="/logo.png"
                alt="Provider Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  if (target.parentElement) {
                    target.parentElement.innerHTML = '<span class="font-black text-purple-950 text-lg">SU</span>';
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-2xl tracking-tight text-white">{providerName}</h1>
                <span className="bg-amber-400 text-purple-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  {activeContract || 'Workforce Australia'}
                </span>
              </div>

              {/* SITE LOCATION SELECTOR */}
              <div className="flex items-center space-x-1.5 my-1">
                <Building2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-2.5 py-0.5 rounded-lg border border-white/20 focus:outline-none cursor-pointer transition-all"
                >
                  {SITE_LOCATIONS.map((site) => (
                    <option key={site.id} value={site.id} className="text-slate-900 font-bold">
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-purple-200/80 font-medium">
                Business Manager Hub • Operational Oversight, SLAs & Verification Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-wrap">
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-3.5 py-2 bg-purple-800/80 hover:bg-purple-700 border border-purple-400/40 text-white text-xs font-extrabold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-purple-300" />
              <span>+ Provision Case Manager</span>
            </button>

            <button
              onClick={() => setShowAddCandidateModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-200" />
              <span>+ Add Candidate</span>
            </button>

            <button
              onClick={handleExportAuditCSV}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Export Activity CSV</span>
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 bg-white/10 hover:bg-rose-500/30 border border-white/20 text-white rounded-xl transition-all ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-purple-200" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* 2. CAPACITY & SLA GAUGES (INTERACTIVE DRILL-DOWN) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div 
            onClick={() => setShowAddCandidateModal(true)}
            className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl space-y-2 cursor-pointer transition-all group"
            title="Click to provision candidate"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 flex items-center space-x-1.5 group-hover:text-purple-900">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Candidate Capacity</span>
              </span>
              <span className="font-extrabold text-purple-950">
                {activeCandidateCount} / {currentCandidateQuota}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all rounded-full ${
                  candidateQuotaPercent > 90 ? 'bg-amber-500' : 'bg-purple-600'
                }`}
                style={{ width: `${Math.min(100, candidateQuotaPercent)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium group-hover:text-slate-600">
              {currentCandidateQuota - activeCandidateCount} Seats Available ({candidateQuotaPercent}% used) • <span className="underline font-bold">Manage</span>
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('roster')}
            className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl space-y-2 cursor-pointer transition-all group"
            title="Click to view Staff Roster"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600 flex items-center space-x-1.5 group-hover:text-purple-900">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Case Manager Seats</span>
              </span>
              <span className="font-extrabold text-slate-900">
                {activeStaffCount} / {currentStaffQuota}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all rounded-full"
                style={{ width: `${Math.min(100, staffQuotaPercent)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium group-hover:text-slate-600">
              {currentStaffQuota - activeStaffCount} Staff Licenses Available ({staffQuotaPercent}% used) • <span className="underline font-bold">View Roster</span>
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('roster')}
            className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl space-y-1 cursor-pointer transition-all group"
            title="Click to inspect CM performance"
          >
            <span className="text-xs font-bold text-slate-600 flex items-center space-x-1.5 group-hover:text-purple-900">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>CM Response Velocity</span>
            </span>
            <div className="text-lg font-black text-purple-950">1.1 Business Days</div>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Exceeding {placementSlaDays}-Day Target • <span className="underline">View CM Speeds</span></span>
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('audit')}
            className="p-3.5 bg-slate-50 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-300 rounded-xl space-y-1 cursor-pointer transition-all group"
            title="Click to view pending items"
          >
            <span className="text-xs font-bold text-slate-600 flex items-center space-x-1.5 group-hover:text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Pending Action Backlog</span>
            </span>
            <div className="text-lg font-black text-rose-600">{pendingCount} Items Awaiting Review</div>
            <p className="text-[10px] text-slate-500 font-medium group-hover:text-rose-700">
              Action required by assigned Case Manager • <span className="underline font-bold">Inspect Backlog</span>
            </p>
          </div>
        </div>

        {/* 3. NAVIGATION TAB CONTROLS */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('command')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'command'
                ? 'bg-purple-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Command Center & Outcomes</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'roster'
                ? 'bg-purple-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Staff Roster & SLA Speed</span>
          </button>

          <button
            onClick={() => setActiveTab('slas')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'slas'
                ? 'bg-purple-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>SLA Target Rules Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'branding'
                ? 'bg-purple-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Palette className="w-4 h-4 text-indigo-400" />
            <span>Dual Branding Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'audit'
                ? 'bg-purple-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>Activity Logs & CRM Export</span>
          </button>
        </div>

        {/* TAB 1: COMMAND CENTER */}
        {activeTab === 'command' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gradient-to-br from-purple-950 via-slate-900 to-purple-950 text-white p-6 rounded-2xl shadow-xl border border-purple-800/50 space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    Site Verification Analytics
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-2">Verified Engagement Pipeline</h3>
                  <p className="text-xs text-purple-200/80">
                    Real-time count of Case Manager verified candidate milestones on site file.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                    <span className="text-xs text-purple-200 font-bold block">Verified Placements</span>
                    <div className="text-2xl font-black text-emerald-400 mt-1">
                      {verifiedPlacements} Confirmed
                    </div>
                    <span className="text-[10px] text-purple-300">Start Date & Hours Verified</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                    <span className="text-xs text-purple-200 font-bold block">Verified Interviews</span>
                    <div className="text-2xl font-black text-amber-300 mt-1">
                      {verifiedInterviews} Attended
                    </div>
                    <span className="text-[10px] text-purple-300">Employer Attendance Verified</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                    <span className="text-xs text-purple-200 font-bold block">Interview Conversion</span>
                    <div className="text-2xl font-black text-white mt-1">{conversionRate}%</div>
                    <span className="text-[10px] text-emerald-400">Interview to Job Placement</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">System Integration Readiness</h4>
                      <p className="text-[11px] text-purple-200">
                        All verified placements and interview logs are prepared for 1-click CRM/ESSWeb export.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleExportAuditCSV}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg transition-all flex items-center space-x-1"
                  >
                    <span>Download Log</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span>License Quota Settings</span>
                </h4>
                <p className="text-xs text-slate-500">Adjust max site participant & staff seat caps.</p>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Candidate Quota Limit</span>
                      <span className="text-purple-950 font-black">{candidateQuota} Seats</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="25"
                      value={candidateQuota}
                      onChange={(e) => setCandidateQuota(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Case Manager Seats</span>
                      <span className="text-purple-950 font-black">{staffQuota} Staff</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={staffQuota}
                      onChange={(e) => setStaffQuota(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-purple-900 space-y-1">
                    <span className="font-extrabold block">License Quota Info:</span>
                    <p className="text-purple-800">
                      To request contract seat expansions beyond {candidateQuota} candidates, contact your Straight Up Training Growth Manager.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF ROSTER */}
        {activeTab === 'roster' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-purple-950">Active Case Manager Roster</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Track CM staff licenses, caseload sizes, and average action SLA speed.
                </p>
              </div>

              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 bg-purple-950 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-purple-900 transition-all flex items-center space-x-1.5 w-max"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>+ Provision New Case Manager</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                    <th className="p-3.5 rounded-tl-xl">Case Manager Name</th>
                    <th className="p-3.5">Assigned Caseload</th>
                    <th className="p-3.5">Verified Placements</th>
                    <th className="p-3.5">Avg SLA Response</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-all">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-900 font-black flex items-center justify-center text-xs">
                        CS
                      </div>
                      <span>Casey Smith (Primary)</span>
                    </td>
                    <td className="p-3.5 font-bold text-purple-950">3 Participants</td>
                    <td className="p-3.5 font-extrabold text-emerald-600">1 Placed</td>
                    <td className="p-3.5 font-bold text-slate-700">1.1 Business Days</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active On-Duty
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button 
  onClick={() => setSelectedCmForManage('Casey Smith')} 
  className="px-3 py-1 bg-slate-100 hover:bg-purple-900 hover:text-white text-slate-700 font-bold text-[11px] rounded-lg transition-all"
>
  Manage Caseload
</button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-all">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-900 font-black flex items-center justify-center text-xs">
                        JS
                      </div>
                      <span>Jordan Smith (Coverage)</span>
                    </td>
                    <td className="p-3.5 font-bold text-purple-950">1 Participant</td>
                    <td className="p-3.5 font-extrabold text-slate-500">0 Placed</td>
                    <td className="p-3.5 font-bold text-slate-700">1.8 Business Days</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                        Coverage Mode Active
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button 
  onClick={() => setSelectedCmForManage('Jordan Smith')} 
  className="px-3 py-1 bg-slate-100 hover:bg-purple-900 hover:text-white text-slate-700 font-bold text-[11px] rounded-lg transition-all"
>
  Manage Caseload
</button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-all">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-black flex items-center justify-center text-xs">
                        ST
                      </div>
                      <span>Sam Taylor</span>
                    </td>
                    <td className="p-3.5 font-bold text-purple-950">1 Participant</td>
                    <td className="p-3.5 font-extrabold text-slate-500">0 Placed</td>
                    <td className="p-3.5 font-bold text-slate-700">0.9 Business Days</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active On-Duty
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button 
  onClick={() => setSelectedCmForManage('Jordan Smith')} 
  className="px-3 py-1 bg-slate-100 hover:bg-purple-900 hover:text-white text-slate-700 font-bold text-[11px] rounded-lg transition-all"
>
  Manage Caseload
</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SLA TARGET RULES */}
        {activeTab === 'slas' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-purple-950">Operational SLA Policy Rules</h3>
              <p className="text-xs text-slate-500 font-medium">
                Set max business day action windows for Case Manager verification response.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2 text-purple-950 font-extrabold text-sm">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Job Placement Verification</span>
                </div>
                <p className="text-xs text-slate-500">
                  Target window for actioning candidate "I Got a Job!" reports.
                </p>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>SLA Target Window</span>
                    <span className="text-emerald-700 font-black">{placementSlaDays} Business Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={placementSlaDays}
                    onChange={(e) => setPlacementSlaDays(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2 text-purple-950 font-extrabold text-sm">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Interview Verification</span>
                </div>
                <p className="text-xs text-slate-500">
                  Target window for confirming interview attendance & outcome.
                </p>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>SLA Target Window</span>
                    <span className="text-amber-700 font-black">{interviewSlaDays} Business Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={interviewSlaDays}
                    onChange={(e) => setInterviewSlaDays(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2 text-purple-950 font-extrabold text-sm">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  <span>PBAS Activity Proof</span>
                </div>
                <p className="text-xs text-slate-500">
                  Target window for signing off general activity logs and study proof.
                </p>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>SLA Target Window</span>
                    <span className="text-indigo-700 font-black">{evidenceSlaDays} Business Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={evidenceSlaDays}
                    onChange={(e) => setEvidenceSlaDays(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BRANDING */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-purple-950">Dual Branding Configuration</h3>
              <p className="text-xs text-slate-500 font-medium">
                Customize site branding to match your provider organization identity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Provider Display Name</label>
                  <input
                    type="text"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary Brand Accent Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={primaryBrandColor}
                      onChange={(e) => setPrimaryBrandColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                    />
                    <span className="font-mono font-bold text-slate-700">{primaryBrandColor}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-950 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                  Header Preview
                </span>
                <div className="flex items-center space-x-3 p-3 rounded-xl border border-white/10 bg-white/5">
                  <div className="w-8 h-8 rounded-lg bg-white p-1 shrink-0">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm">{providerName}</h5>
                    <span className="text-[10px] text-purple-200">WorkReady Partner Workspace</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOG & CRM EXPORT */}
{activeTab === 'audit' && (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-extrabold text-purple-950">Activity Logs & Core CRM Export</h3>
        <p className="text-xs text-slate-500 font-medium">
          Auditor-ready verified records formatted for 1-click import into core CRM or ESSWeb.
        </p>
      </div>

      <button
        onClick={handleExportAuditCSV}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
      >
        <Download className="w-4 h-4 text-emerald-100" />
        <span>Export Official CSV Log</span>
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
            <th className="p-3.5 rounded-tl-xl">Candidate Name</th>
            <th className="p-3.5">Assigned CM</th>
            <th className="p-3.5">Evidence / Claim Title</th>
            <th className="p-3.5">Type</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5">Submitted Date</th>
            <th className="p-3.5 text-right rounded-tr-xl">Governance Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(verificationItems || []).map((item) => {
            const assignedCm = (item as any).assignedCm || 'Casey Smith';
            const isNudged = !!nudgedItems[item.candidateName];

            return (
              <tr key={item.id} className="hover:bg-slate-50 transition-all">
                <td className="p-3.5 font-bold text-slate-900">{item.candidateName}</td>
                <td className="p-3.5 font-bold text-purple-900">{assignedCm}</td>
                <td className="p-3.5 text-slate-700">{item.title}</td>
                <td className="p-3.5 font-bold text-slate-800">{item.type}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isNudged
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {item.status === 'Pending' && isNudged ? 'Nudge Sent' : item.status}
                  </span>
                </td>
                <td className="p-3.5 text-slate-500 font-mono">{item.submittedDate}</td>
                <td className="p-3.5 text-right">
                  {item.status === 'Pending' ? (
                    isNudged ? (
                      <span className="px-2.5 py-1 bg-amber-100 border border-amber-300 text-amber-900 font-black text-[11px] rounded-lg inline-block">
                        Nudged ({nudgedItems[item.candidateName]})
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setPromptTargetCm(assignedCm);
                          setPromptCandidateName(item.candidateName);
                          setShowPromptModal(true);
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-purple-950 font-extrabold text-[11px] rounded-lg transition-all shadow-sm flex items-center space-x-1 ml-auto"
                      >
                        <span>Nudge {assignedCm.split(' ')[0]}</span>
                      </button>
                    )
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-bold">Verified by {assignedCm.split(' ')[0]}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}
      </main>

      {/* MODAL: PROVISION CASE MANAGER */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-900 text-base">Provision New Case Manager</h4>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input type="text" placeholder="e.g. Sarah Jenkins" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Staff Email</label>
                <input type="email" placeholder="sarah.j@provider.org.au" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Initial License Allocation</label>
                <input type="number" defaultValue={50} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium" />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button onClick={() => setShowAddStaffModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Case Manager provisioned and license seat allocated!');
                  setShowAddStaffModal(false);
                }}
                className="flex-1 py-2.5 bg-purple-950 hover:bg-purple-900 text-white font-extrabold rounded-xl text-xs"
              >
                Provision Seat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PROVISION CANDIDATE */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-900 text-base">Provision New Candidate</h4>
              <button onClick={() => setShowAddCandidateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  placeholder="e.g. Taylor Reed"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Case Manager</label>
                <select
                  value={assignedCm}
                  onChange={(e) => setAssignedCm(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="Casey Smith">Casey Smith</option>
                  <option value="Jordan Smith">Jordan Smith</option>
                  <option value="Sam Taylor">Sam Taylor</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowAddCandidateModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (addCandidate) {
                    addCandidate({
                      name: newCandidateName.trim() || 'Taylor Reed',
                      pbasVerified: 0,
                      pbasTarget: 100,
                      status: 'On Track',
                      assignedCm: assignedCm
                    });
                  }
                  setNewCandidateName('');
                  setShowAddCandidateModal(false);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs"
              >
                Assign & Provision
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: MANAGE CASELOAD & COVERAGE */}
      {selectedCmForManage && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Manage Caseload & Coverage</h4>
                <p className="text-xs text-purple-900 font-bold">{selectedCmForManage}</p>
              </div>
              <button onClick={() => setSelectedCmForManage(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* ACTION 1: REASSIGN CASELOAD */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="font-extrabold text-slate-800 block">Bulk Reassign Participants</label>
                <p className="text-slate-500 text-[11px]">Shift participants to another active Case Manager on site.</p>
                <div className="flex space-x-2">
                  <select
                    value={targetReassignCm}
                    onChange={(e) => setTargetReassignCm(e.target.value)}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
                  >
                    {['Casey Smith', 'Jordan Smith', 'Sam Taylor']
                      .filter(name => name !== selectedCmForManage)
                      .map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      alert(`Caseload successfully transferred from ${selectedCmForManage} to ${targetReassignCm}!`);
                      setSelectedCmForManage(null);
                    }}
                    className="px-3 py-2 bg-purple-950 hover:bg-purple-900 text-white font-extrabold rounded-lg text-xs"
                  >
                    Transfer
                  </button>
                </div>
              </div>

              {/* ACTION 2: TOGGLE LEAVE / COVERAGE MODE */}
              <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-purple-950 block">Leave / Coverage Mode</span>
                  <p className="text-[11px] text-purple-800">Route incoming candidate alerts to team coverage.</p>
                </div>
                <button
                  onClick={() => {
                    alert(`Coverage mode toggled for ${selectedCmForManage}.`);
                    setSelectedCmForManage(null);
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-purple-950 font-extrabold rounded-lg text-xs"
                >
                  Toggle Mode
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedCmForManage(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
       {/* MODAL: PROMPT / NUDGE CASE MANAGER */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">Send Urgent SLA Nudge</h4>
                <p className="text-xs text-purple-950 font-bold">Recipient: {promptTargetCm}</p>
              </div>
              <button onClick={() => setShowPromptModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-extrabold text-amber-900 block">Pending Evidence Action Required:</span>
                <p className="text-amber-800 text-[11px]">
                  Candidate <strong className="font-bold">{promptCandidateName}</strong> has an unverified item exceeding SLA response target.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notification Message</label>
                <textarea
                  rows={3}
                  defaultValue={`Hi ${promptTargetCm.split(' ')[0]}, please review and action the pending verification evidence for ${promptCandidateName} as soon as possible to keep site SLAs compliant.`}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-purple-600 text-xs"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowPromptModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
  onClick={() => {
    // 1. Record the nudge timestamp for this candidate/item
    setNudgedItems(prev => ({
      ...prev,
      [promptCandidateName]: 'Just Now'
    }));
    // 2. Alert and close
    alert(`SLA Nudge notification sent to ${promptTargetCm}!`);
    setShowPromptModal(false);
  }}
  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-purple-950 font-extrabold rounded-xl text-xs"
>
  Send Prompt Notification
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;