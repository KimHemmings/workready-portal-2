import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import type { VerificationItem } from '../lib/types';

export default function CoachDashboard() {
  const {
    candidates,
    verificationItems,
    approveVerification,
    declineVerification,
    addCandidate,
    updateCandidateRequirements,
  } = usePortal();

  // Dynamic Coach Name (Ready to be populated via Auth/Session)
  const [currentCoachName] = useState('Casey Smith');

  // Active View Tab: 'pending' | 'roster' | 'compliance' | 'risk'
  const [activeTab, setActiveTab] = useState<'pending' | 'roster' | 'compliance' | 'risk'>('pending');

  // Modal / Drawer States
  const [selectedEvidence, setSelectedEvidence] = useState<VerificationItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);

  // Form states for Add Candidate
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTarget, setNewTarget] = useState(100);
  const [newStartDate, setNewStartDate] = useState('01/09/2026');
  const [newFinishDate, setNewFinishDate] = useState('30/09/2026');
  const [newChallenge, setNewChallenge] = useState('Resume / Applications');

  // Form states for Adjust Requirements
  const [editTarget, setEditTarget] = useState(100);
  const [editStart, setEditStart] = useState('');
  const [editFinish, setEditFinish] = useState('');

  // Derived Stat Counters
  const pendingItems = verificationItems.filter((i) => i.status === 'Pending');
  const pendingCount = pendingItems.length;
  const activeCaseload = candidates.length;
  const highRiskCandidates = candidates.filter((c) => c.status === 'High Risk' || c.status === 'Blocked');
  
  const totalCompliance = candidates.reduce((acc, c) => {
    const rate = Math.min(100, Math.round((c.pbasVerified / c.pbasTarget) * 100));
    return acc + rate;
  }, 0);
  const avgComplianceRate = activeCaseload > 0 ? Math.round(totalCompliance / activeCaseload) : 0;

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    addCandidate({
      name: newName,
      email: newEmail,
      phone: newPhone || '0400 000 000',
      status: 'On Track',
      pbasTarget: newTarget,
      startDate: newStartDate,
      finishDate: newFinishDate,
      primaryChallenge: newChallenge,
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (candId: string) => {
    const cand = candidates.find((c) => c.id === candId);
    if (!cand) return;
    setEditingCandidateId(candId);
    setEditTarget(cand.pbasTarget);
    setEditStart(cand.startDate);
    setEditFinish(cand.finishDate);
  };

  const handleSaveRequirements = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCandidateId) {
      updateCandidateRequirements(editingCandidateId, editTarget, editStart, editFinish);
      setEditingCandidateId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans pb-16">
      {/* Dynamic Multi-Use Header Matching Candidate Style */}
      <header className="bg-[#1e0c2e] text-white py-3.5 px-6 md:px-10 flex items-center justify-between shadow-md border-b border-[#3d185e]">
        <div className="flex items-center gap-4">
          {/* Rounded-Square Logo Frame */}
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-[#3d185e] flex items-center justify-center p-1.5 shadow-sm">
            <img
              src="/logo.png"
              alt="Straight Up Training Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerHTML = `<span class="text-xs font-black text-emerald-400">SUT</span>`;
                }
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-white">Straight Up Training</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40 tracking-wide uppercase">
                WORKREADY PARTNER
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-0.5">
              Case Manager Portal • Activity & Evidence Verification Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dynamic Case Manager Pill */}
          <span className="hidden sm:inline-block bg-purple-900/60 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full border border-purple-400/30">
            {currentCoachName.toUpperCase()} (PROVIDER VIEW)
          </span>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full border border-white/20 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Interactive Dashboard Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Tile 1: Pending Approvals */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`text-left p-5 rounded-2xl border transition-all shadow-sm ${
              activeTab === 'pending'
                ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200/80 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
              <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                🕒
              </span>
            </div>
            <p className="text-3xl font-black text-amber-600 mt-2">{pendingCount} Items</p>
            <p className="text-xs text-slate-500 mt-1">Click to view evidence & approve points</p>
          </button>

          {/* Tile 2: Active Caseload */}
          <button
            onClick={() => setActiveTab('roster')}
            className={`text-left p-5 rounded-2xl border transition-all shadow-sm ${
              activeTab === 'roster'
                ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/20'
                : 'bg-white border-slate-200/80 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Caseload</p>
              <span className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-bold">
                👥
              </span>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{activeCaseload} Participants</p>
            <p className="text-xs text-slate-500 mt-1">Click to manage roster & 5-pillars</p>
          </button>

          {/* Tile 3: Compliance Rate */}
          <button
            onClick={() => setActiveTab('compliance')}
            className={`text-left p-5 rounded-2xl border transition-all shadow-sm ${
              activeTab === 'compliance'
                ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200/80 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PBAS Compliance Rate</p>
              <span className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
                ✓
              </span>
            </div>
            <p className="text-3xl font-black text-emerald-600 mt-2">{avgComplianceRate}%</p>
            <p className="text-xs text-slate-500 mt-1">Click to view target progress</p>
          </button>

          {/* Tile 4: High Risk / Blocked */}
          <button
            onClick={() => setActiveTab('risk')}
            className={`text-left p-5 rounded-2xl border transition-all shadow-sm ${
              activeTab === 'risk'
                ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/20'
                : 'bg-white border-slate-200/80 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">High Risk / Blocked</p>
              <span className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold">
                ⚠️
              </span>
            </div>
            <p className="text-3xl font-black text-rose-600 mt-2">{highRiskCandidates.length} Participants</p>
            <p className="text-xs text-slate-500 mt-1">Click to inspect support blockers</p>
          </button>
        </div>

        {/* Dynamic Detail Container */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm min-h-[400px]">
          
          {/* TAB 1: PENDING APPROVALS FEED */}
          {activeTab === 'pending' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Activity Verification Feed</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Review candidate submissions and verify PBAS points.</p>
                </div>
                <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full">
                  {pendingCount} Pending Review
                </span>
              </div>

              {pendingCount === 0 ? (
                <div className="py-16 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <p className="text-sm font-medium">All pending verification items have been processed! 🎉</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/60">
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Activity Type</th>
                        <th className="py-3 px-4">Title / Employer</th>
                        <th className="py-3 px-4">Ref ID</th>
                        <th className="py-3 px-4">Points</th>
                        <th className="py-3 px-4">Evidence</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {pendingItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-semibold text-slate-900">{item.candidateName}</td>
                          <td className="py-4 px-4">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                              {item.activityType}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-700">{item.title}</td>
                          <td className="py-4 px-4 font-mono text-xs text-slate-500">{item.refId}</td>
                          <td className="py-4 px-4 font-bold text-emerald-600">+{item.points} Pts</td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => setSelectedEvidence(item)}
                              className="text-xs font-semibold text-purple-700 hover:underline inline-flex items-center gap-1"
                            >
                              📄 View File
                            </button>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => approveVerification(item.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm"
                            >
                              Approve (+{item.points} Pts)
                            </button>
                            <button
                              onClick={() => declineVerification(item.id, 'Insufficient proof uploaded')}
                              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg"
                            >
                              Decline
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2 & 3: PARTICIPANT ROSTER & COMPLIANCE */}
          {(activeTab === 'roster' || activeTab === 'compliance') && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {activeTab === 'roster' ? 'Participant Roster & Requirements' : 'PBAS Compliance Tracking'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage targets, cycle dates, and primary challenges.</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-[#1e0c2e] hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  + Add New Candidate
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {candidates.map((candidate) => {
                  const pct = Math.min(100, Math.round((candidate.pbasVerified / candidate.pbasTarget) * 100));
                  return (
                    <div key={candidate.id} className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-5 hover:border-purple-300 transition-all">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{candidate.name}</h3>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300">
                              {candidate.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{candidate.email} • {candidate.phone}</p>
                        </div>
                        <button
                          onClick={() => handleOpenEdit(candidate.id)}
                          className="px-3 py-1 bg-white text-purple-900 text-xs font-bold rounded-lg border border-slate-200 shadow-sm"
                        >
                          Adjust Target / Dates
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                          <span className="text-slate-600">PBAS Target ({candidate.pbasTarget} Pts)</span>
                          <span className="text-emerald-700 font-bold">{candidate.pbasVerified} Verified ({candidate.pbasPending} Pending)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                        <div>Primary Challenge: <span className="text-purple-900 font-bold">{candidate.primaryChallenge}</span></div>
                        <div>Cycle: <span className="font-mono text-slate-700">{candidate.startDate} – {candidate.finishDate}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: HIGH RISK / BLOCKED */}
          {activeTab === 'risk' && (
            <div>
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">High Risk & Support Attention Feed</h2>
                <p className="text-xs text-slate-500 mt-0.5">Participants requiring immediate case manager intervention.</p>
              </div>

              {highRiskCandidates.length === 0 ? (
                <div className="py-16 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <p className="text-sm font-medium">Great news! No high risk or blocked participants currently. 🎉</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highRiskCandidates.map((c) => (
                    <div key={c.id} className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900">{c.name}</h4>
                        <p className="text-xs text-rose-700 font-semibold mt-0.5">Challenge: {c.primaryChallenge}</p>
                      </div>
                      <button className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm">
                        Contact Participant
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </section>
      </main>

      {/* Modals */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Inspect Uploaded Evidence</h3>
              <button onClick={() => setSelectedEvidence(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="py-4 space-y-3 text-sm">
              <div>
                <span className="text-slate-400 text-xs block">Candidate</span>
                <p className="font-semibold text-slate-900">{selectedEvidence.candidateName}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs block">Activity Title</span>
                <p className="font-medium text-purple-900">{selectedEvidence.title}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-slate-400 text-xs block">Ref ID</span>
                  <p className="font-mono text-slate-600">{selectedEvidence.refId}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">PBAS Value</span>
                  <p className="font-bold text-emerald-600">+{selectedEvidence.points} Points</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{selectedEvidence.evidenceFileName || 'Verified_Evidence_Proof.pdf'}</p>
                  <p className="text-[10px] text-slate-400">Uploaded on {selectedEvidence.dateSubmitted}</p>
                </div>
                <a
                  href={`data:text/plain;charset=utf-8,WorkReady%20Evidence%20Proof%20-%20${selectedEvidence.refId}`}
                  download={selectedEvidence.evidenceFileName || `Evidence_${selectedEvidence.refId}.pdf`}
                  className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Download
                </a>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  declineVerification(selectedEvidence.id, 'Declined after evidence inspection');
                  setSelectedEvidence(null);
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl"
              >
                Decline Item
              </button>
              <button
                onClick={() => {
                  approveVerification(selectedEvidence.id);
                  setSelectedEvidence(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
              >
                Approve (+{selectedEvidence.points} Pts)
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCandidate} className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Candidate & Set Requirements</h3>
              <button onClick={() => setIsAddModalOpen(false)} type="button" className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">Full Name</label>
              <input
                required
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">Email Address</label>
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="jordan.m@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Target PBAS Points</label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0412 000 000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Cycle Start Date</label>
                <input
                  type="text"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Cycle Finish Date</label>
                <input
                  type="text"
                  value={newFinishDate}
                  onChange={(e) => setNewFinishDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-xl"
              >
                Add Candidate
              </button>
            </div>
          </form>
        </div>
      )}

      {editingCandidateId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveRequirements} className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Adjust PBAS Target & Cycle Dates</h3>
              <button onClick={() => setEditingCandidateId(null)} type="button" className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">Target PBAS Points</label>
              <input
                type="number"
                value={editTarget}
                onChange={(e) => setEditTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Cycle Start Date</label>
                <input
                  type="text"
                  value={editStart}
                  onChange={(e) => setEditStart(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Cycle Finish Date</label>
                <input
                  type="text"
                  value={editFinish}
                  onChange={(e) => setEditFinish(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingCandidateId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}