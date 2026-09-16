import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';

export default function ParticipantHome() {
  const {
    candidates,
    verificationItems,
    addCandidate,
  } = usePortal();

  // Find logged-in candidate Alex (defaults to candidates[0])
  const candidate = candidates.find((c) => c.email === 'alex@workready.com') || candidates[0];

  // Action / Form states
  const [claimNotes, setClaimNotes] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<'placement' | 'interview' | 'blocker' | null>(null);

  // Derived state
  const pct = candidate ? Math.min(100, Math.round((candidate.pbasVerified / candidate.pbasTarget) * 100)) : 0;
  const myPendingItems = verificationItems.filter((i) => i.candidateId === candidate?.id && i.status === 'Pending');

  const handleClaimSubmit = () => {
    // Keep UI workflow reactive while submitting claim
    setClaimNotes('');
    setSelectedMilestone(null);
  };

  if (!candidate) return null;

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans pb-16">
      {/* Straight Up Training Dark Purple Top Banner Header */}
      <header className="bg-[#1e0c2e] text-white py-3.5 px-6 md:px-10 flex items-center justify-between shadow-md border-b border-[#3d185e]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#2e1347] border border-purple-400/30 p-1 flex items-center justify-center shadow-inner">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-sm">
              <img
                src="/logo.png"
                alt="Straight Up Training Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = `<span class="text-[10px] font-black text-purple-900">SUT</span>`;
                  }
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-white">Straight Up Training</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40 tracking-wide uppercase">
                Candidate Portal
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-0.5">
              Personal Progress, PBAS Activities & 5-Pillars Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block bg-purple-900/60 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full border border-purple-400/30">
            {candidate.name.toUpperCase()} (CANDIDATE)
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

        {/* Phase 3 Action Banner */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Quick Milestone Claims & Assistance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Log key achievements directly to Casey's Case Manager verification feed.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setSelectedMilestone('placement')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>🏆 Claim Placement (+50 Pts)</span>
              </button>
              <button
                onClick={() => setSelectedMilestone('interview')}
                className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>💼 Attended Interview (+25 Pts)</span>
              </button>
              <button
                onClick={() => setSelectedMilestone('blocker')}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>⚠️ Support Blocker Alert</span>
              </button>
            </div>
          </div>

          {/* PBAS Progress Summary */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/70">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-slate-700">Monthly PBAS Points Target ({candidate.pbasTarget} Pts)</span>
              <span className="text-emerald-700 font-bold">{candidate.pbasVerified} Pts Verified ({candidate.pbasPending} Pts Pending Review)</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5 Pillars Cycle Lock Section */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">5-Pillars Employability Scorecard</h3>
              <p className="text-xs text-slate-500 mt-0.5">Your live self-assessment metrics synced with your Case Manager.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
              Cycle Active: {candidate.startDate} – {candidate.finishDate}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {Object.entries(candidate.fivePillars).map(([pillar, score]) => (
              <div key={pillar} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider capitalize">
                  {pillar.replace(/([A-Z])/g, ' $1')}
                </p>
                <p className="text-2xl font-black text-purple-900 mt-1">{score}/100</p>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-purple-600" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Claims Awaiting Casey's Review */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Pending Submissions ({myPendingItems.length})</h3>
          {myPendingItems.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl">
              No pending claims currently awaiting review. Use the quick buttons above to submit milestone proof!
            </div>
          ) : (
            <div className="space-y-3">
              {myPendingItems.map((item) => (
                <div key={item.id} className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">{item.activityType}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: {item.refId} • Uploaded {item.dateSubmitted}</p>
                  </div>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
                    +{item.points} Pts Awaiting Approval
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Claim Submission Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 capitalize">
                Submit {selectedMilestone} Claim
              </h3>
              <button onClick={() => setSelectedMilestone(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div>
              <label className="text-xs text-slate-600 font-semibold block mb-1">Add Note / Context for Casey</label>
              <textarea
                rows={3}
                value={claimNotes}
                onChange={(e) => setClaimNotes(e.target.value)}
                placeholder="Describe details, employer name, or specific assistance required..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleClaimSubmit}
                className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-xl"
              >
                Submit Claim to Casey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}