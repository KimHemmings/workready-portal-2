import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import type { CandidateProfile, VerificationItem } from '../lib/types';
import { 
  BarChart3, Users, Award, ShieldCheck, Download, Filter, LogOut, 
  Sparkles, CheckCircle2, AlertCircle, ChevronRight, TrendingUp, UserPlus, X, UserCheck, PlusCircle
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  caseloadCount: number;
  status: 'Active' | 'Away';
}

export default function OwnerDashboard() {
  const { candidates, verificationItems } = usePortal();

  const [currentOwnerName] = useState('Morgan Taylor');
  const [activeTab, setActiveTab] = useState<'kpi' | 'staff' | 'pillars' | 'dewr'>('kpi');
  
  // Staff State Management
  const [staffList, setStaffList] = useState<StaffMember[]>([
    { id: '1', name: 'Casey Smith', email: 'casey@workready.com', role: 'Senior Case Manager', caseloadCount: 4, status: 'Active' },
    { id: '2', name: 'Jordan Vance', email: 'jordan@workready.com', role: 'Case Manager', caseloadCount: 3, status: 'Away' },
    { id: '3', name: 'Taylor Reed', email: 'taylor@workready.com', role: 'Case Manager', caseloadCount: 2, status: 'Active' }
  ]);

  // Modal Visibility States
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);

  // Form Inputs
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Case Manager');

  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateEmail, setNewCandidateEmail] = useState('');
  const [assignedStaffId, setAssignedStaffId] = useState('1');

  const handleSignOut = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;

    const newMember: StaffMember = {
      id: Date.now().toString(),
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      role: newStaffRole,
      caseloadCount: 0,
      status: 'Active'
    };

    setStaffList(prev => [...prev, newMember]);
    setNewStaffName('');
    setNewStaffEmail('');
    setShowAddStaffModal(false);
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName.trim() || !newCandidateEmail.trim()) return;

    // Increment caseload count for selected staff member
    setStaffList(prev => prev.map(staff => 
      staff.id === assignedStaffId 
        ? { ...staff, caseloadCount: staff.caseloadCount + 1 } 
        : staff
    ));

    setNewCandidateName('');
    setNewCandidateEmail('');
    setShowAddCandidateModal(false);
  };

  // Executive KPI Calculations
  const totalCandidates = candidates.length;
  const compliantCandidates = candidates.filter((c: CandidateProfile) => c.status === 'Compliant' || c.status === 'On Track').length;
  const overallComplianceRate = totalCandidates > 0 ? Math.round((compliantCandidates / totalCandidates) * 100) : 100;

  const totalVerifiedPoints = candidates.reduce((acc: number, c: CandidateProfile) => acc + (c.pbasVerified || 0), 0);
  const totalTargetPoints = candidates.reduce((acc: number, c: CandidateProfile) => acc + (c.pbasTarget || 100), 0);

  const verifiedPlacements = verificationItems.filter((v: VerificationItem) => v.activityType === 'Job Placement' && v.status === 'Approved').length;
  const verifiedInterviews = verificationItems.filter((v: VerificationItem) => v.activityType === 'Interview' && v.status === 'Approved').length;

  // Aggregate 5 Pillars Diagnostic Averages
  const aggregatePillars = candidates.reduce(
    (acc, c: CandidateProfile) => {
      if (!c.fivePillars) return acc;
      return {
        jobSearch: acc.jobSearch + c.fivePillars.jobSearch,
        interview: acc.interview + c.fivePillars.interviewReadiness,
        skills: acc.skills + c.fivePillars.technicalSkills,
        logistics: acc.logistics + c.fivePillars.logistics,
        mindset: acc.mindset + c.fivePillars.mindset,
      };
    },
    { jobSearch: 0, interview: 0, skills: 0, logistics: 0, mindset: 0 }
  );

  const avgPillars = totalCandidates > 0 ? {
    jobSearch: Math.round(aggregatePillars.jobSearch / totalCandidates),
    interview: Math.round(aggregatePillars.interview / totalCandidates),
    skills: Math.round(aggregatePillars.skills / totalCandidates),
    logistics: Math.round(aggregatePillars.logistics / totalCandidates),
    mindset: Math.round(aggregatePillars.mindset / totalCandidates),
  } : { jobSearch: 85, interview: 78, skills: 90, logistics: 92, mindset: 88 };

  const handleExportDEWRReport = () => {
    const headers = ['Candidate Name', 'Email', 'Status', 'PBAS Verified Points', 'PBAS Target', 'Compliance %'];
    const rows = candidates.map((c: CandidateProfile) => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.status}"`,
      c.pbasVerified,
      c.pbasTarget,
      `${Math.round((c.pbasVerified / c.pbasTarget) * 100)}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DEWR_Compliance_Audit_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  WorkReady Partner
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Business Manager Hub • Operational Governance & Staff Management
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-3.5 py-1.5 bg-purple-600/80 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Case Manager</span>
            </button>

            <button
              onClick={() => setShowAddCandidateModal(true)}
              className="px-3.5 py-1.5 bg-purple-600/80 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Candidate</span>
            </button>

            <button
              onClick={handleExportDEWRReport}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 border border-emerald-400/30 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-extrabold text-purple-950">
              Executive Overview — {currentOwnerName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Program Outcomes, Staff Capacity, & Candidate Provisioning
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold space-x-1">
            <button
              onClick={() => setActiveTab('kpi')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'kpi'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Command Center</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'staff'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Staff & Caseloads ({staffList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'pillars'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Macro 5-Pillars</span>
            </button>

            <button
              onClick={() => setActiveTab('dewr')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'dewr'
                  ? 'bg-purple-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>DEWR Audit</span>
            </button>
          </div>
        </div>

        {/* TAB 1: COMMAND CENTER */}
        {activeTab === 'kpi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Active Caseload</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-slate-900">{totalCandidates}</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-xs rounded-full">Participants</span>
                </div>
                <p className="text-[11px] text-slate-500">Managed by {staffList.length} Case Managers</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">PBAS Monthly Compliance</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-emerald-600">{overallComplianceRate}%</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">On Track</span>
                </div>
                <p className="text-[11px] text-slate-500">{compliantCandidates} of {totalCandidates} Candidates meeting target</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Verified Job Placements</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-purple-950">{verifiedPlacements}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">+50 Pts Each</span>
                </div>
                <p className="text-[11px] text-slate-500">Verified employment claims</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Verified Points</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-slate-900">{totalVerifiedPoints}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ {totalTargetPoints} Target</span>
                </div>
                <p className="text-[11px] text-slate-500">Provider-wide aggregate points</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-purple-950 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Program Outcome Revenue & Placement Metrics</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="font-bold text-xs text-emerald-950 uppercase">Verified Placements & Milestones</div>
                  <div className="text-2xl font-extrabold text-emerald-900">{verifiedPlacements} Active Placements</div>
                  <p className="text-xs text-emerald-800">
                    Full sign-off completed by Case Management staff. Ready for claim verification.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                  <div className="font-bold text-xs text-purple-950 uppercase">Verified Interview Milestones</div>
                  <div className="text-2xl font-extrabold text-purple-950">{verifiedInterviews} Completed Interviews</div>
                  <p className="text-xs text-purple-900">
                    Pre-interview preparation and outcome verification recorded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STAFF & CASELOAD MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Staff & Caseload Provisioning</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage Case Manager assignments and active capacity.</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-3.5 py-1.5 bg-purple-950 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-purple-300" />
                  <span>+ Add New Case Manager</span>
                </button>
                <button
                  onClick={() => setShowAddCandidateModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
                  <span>+ Provision Candidate</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {staffList.map((staff) => (
                <div key={staff.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-950 text-white rounded-xl font-extrabold flex items-center justify-center text-sm">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{staff.name}</div>
                      <div className="text-slate-500">{staff.role} • {staff.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold">
                      Caseload: {staff.caseloadCount} Candidates
                    </span>
                    <span className={`px-2.5 py-1 rounded-full font-bold ${
                      staff.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      Status: {staff.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MACRO 5-PILLARS */}
        {activeTab === 'pillars' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Macro Program Diagnostic Averages across 5 Pillars</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center font-bold">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
                <span className="text-xs text-purple-900 uppercase">Job Search</span>
                <div className="text-2xl text-purple-950">{avgPillars.jobSearch}%</div>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <span className="text-xs text-emerald-900 uppercase">Interview</span>
                <div className="text-2xl text-emerald-950">{avgPillars.interview}%</div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                <span className="text-xs text-blue-900 uppercase">Skills</span>
                <div className="text-2xl text-blue-950">{avgPillars.skills}%</div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-xs text-amber-900 uppercase">Logistics</span>
                <div className="text-2xl text-amber-950">{avgPillars.logistics}%</div>
              </div>
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                <span className="text-xs text-rose-900 uppercase">Mindset</span>
                <div className="text-2xl text-rose-950">{avgPillars.mindset}%</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEWR AUDIT */}
        {activeTab === 'dewr' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>DEWR PBAS Audit & Compliance Reporting</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate audit-ready evidence files and candidate compliance logs.
                </p>
              </div>
              <button
                onClick={handleExportDEWRReport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Master Audit CSV</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD CASE MANAGER */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Add New Case Manager</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Reed"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="jordan@workready.com"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role Title</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                >
                  <option value="Case Manager">Case Manager</option>
                  <option value="Senior Case Manager">Senior Case Manager</option>
                  <option value="Employment Specialist">Employment Specialist</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white font-bold rounded-xl shadow-sm"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROVISION CANDIDATE */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Provision New Candidate</h3>
              <button onClick={() => setShowAddCandidateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sam Miller"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate Email</label>
                <input
                  type="email"
                  placeholder="sam@candidate.com"
                  value={newCandidateEmail}
                  onChange={(e) => setNewCandidateEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-purple-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assign to Case Manager</label>
                <select
                  value={assignedStaffId}
                  onChange={(e) => setAssignedStaffId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-800"
                >
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCandidateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Provision & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}