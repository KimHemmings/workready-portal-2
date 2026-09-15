import React, { useState } from 'react';
import { 
  Users, CheckCircle2, Clock, AlertCircle, FileText, Download, 
  Plus, Search, Eye, Send, ShieldCheck, Award, ArrowUpRight, ChevronRight, X 
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  startDate: string;
  targetPoints: number;
  verifiedPoints: number;
  pendingPoints: number;
  lastCheckIn: string;
  primaryBlocker: string;
  pillarScores: Record<string, number>;
  status: 'Compliant' | 'At Risk' | 'On Track';
}

interface PendingActivity {
  id: string;
  candidateName: string;
  type: 'Job Search' | 'Interview' | 'Job Placement' | 'LMS Module';
  title: string;
  reference: string;
  points: number;
  date: string;
  evidenceFile?: string;
}

export const CoachDashboard: React.FC = () => {
  // Roster State
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 'cand-1',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      phone: '0412 345 678',
      startDate: '01/08/2026',
      targetPoints: 100,
      verifiedPoints: 35,
      pendingPoints: 15,
      lastCheckIn: '14/09/2026',
      primaryBlocker: 'Resume / Applications',
      pillarScores: {
        'Job Search': 3,
        'Interviewing': 4,
        'Technical Skills': 2,
        'Logistics': 3,
        'Mindset': 4,
      },
      status: 'On Track',
    },
    {
      id: 'cand-2',
      name: 'Sarah Smith',
      email: 'sarah.s@example.com',
      phone: '0498 765 432',
      startDate: '15/07/2026',
      targetPoints: 100,
      verifiedPoints: 85,
      pendingPoints: 20,
      lastCheckIn: '12/09/2026',
      primaryBlocker: 'No Major Blockers',
      pillarScores: {
        'Job Search': 5,
        'Interviewing': 4,
        'Technical Skills': 4,
        'Logistics': 5,
        'Mindset': 5,
      },
      status: 'Compliant',
    },
  ]);

  // Pending Verification Queue State
  const [pendingQueue, setPendingQueue] = useState<PendingActivity[]>([
    {
      id: 'act-101',
      candidateName: 'Alex Johnson',
      type: 'Job Search',
      title: 'Warehouse Assistant — Logistics Co',
      reference: 'JOB-98231',
      points: 5,
      date: '14/09/2026',
      evidenceFile: 'SEEK_Application_Receipt_98231.pdf',
    },
    {
      id: 'act-102',
      candidateName: 'Alex Johnson',
      type: 'Interview',
      title: 'Barista / All-Rounder — Star Hospitality',
      reference: 'INT-8821',
      points: 25,
      date: '15/09/2026',
      evidenceFile: 'Interview_Invite_Email_StarHosp.pdf',
    },
  ]);

  // UI Modals & Drawers
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [viewEvidenceFile, setViewEvidenceFile] = useState<string | null>(null);

  // Form Inputs for New Candidate
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTarget, setNewTarget] = useState(100);

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      startDate: newStartDate,
      targetPoints: Number(newTarget),
      verifiedPoints: 0,
      pendingPoints: 0,
      lastCheckIn: 'Not Started',
      primaryBlocker: 'Onboarding',
      pillarScores: { 'Job Search': 3, 'Interviewing': 3, 'Technical Skills': 3, 'Logistics': 3, 'Mindset': 3 },
      status: 'On Track',
    };
    setCandidates([newCand, ...candidates]);
    setShowAddModal(false);
    setNewName(''); setNewEmail(''); setNewPhone('');
    alert(`✅ Candidate ${newName} added to your roster with target goal of ${newTarget} PBAS points.`);
  };

  const handleApproveActivity = (id: string, points: number, candidateName: string) => {
    setPendingQueue((prev) => prev.filter((item) => item.id !== id));
    setCandidates((prev) =>
      prev.map((c) =>
        c.name === candidateName
          ? { ...c, verifiedPoints: c.verifiedPoints + points, pendingPoints: Math.max(0, c.pendingPoints - points) }
          : c
      )
    );
    alert(`🎉 Approved! +${points} points added to ${candidateName}'s verified PBAS total.`);
  };

  const handleGenerateMonthlyAudit = () => {
    alert("📄 Generating PBAS Monthly Compliance Audit Report...\n\nAll candidate evidence, signed activities, and 5-Pillar check-in scores packaged for Workforce Australia audit export.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-[#24083b] via-[#320b52] to-[#24083b] text-white shadow-md border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white font-heading">
                  Case Manager Portal
                </span>
                <span className="bg-purple-800/80 text-purple-200 border border-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Casey (Provider View)
                </span>
              </div>
              <p className="text-xs text-purple-200">Workforce Australia Caseload & PBAS Evidence Verification Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateMonthlyAudit}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export PBAS Audit Report
            </button>
            <button
              onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Caseload</p>
              <h3 className="text-2xl font-black text-[#24083b] mt-1">{candidates.length} Participants</h3>
            </div>
            <div className="p-3 bg-purple-50 text-[#24083b] rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingQueue.length} Items</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">PBAS Compliance Rate</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">92%</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">High Risk / Blocked</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">0 Participants</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* SECTION 1: PENDING VERIFICATION QUEUE */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#24083b] flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" /> Activity Verification Feed
              </h2>
              <p className="text-xs text-slate-500">Review candidate uploads, inspect proof evidence, and approve PBAS points.</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
              {pendingQueue.length} Actions Awaiting Review
            </span>
          </div>

          {pendingQueue.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Activity Type</th>
                    <th className="p-3">Title / Employer</th>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Points</th>
                    <th className="p-3">Evidence Proof</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="p-3 font-bold text-slate-900">{item.candidateName}</td>
                      <td className="p-3 font-semibold text-purple-700">{item.type}</td>
                      <td className="p-3 text-slate-700">{item.title}</td>
                      <td className="p-3 font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">{item.reference}</td>
                      <td className="p-3 font-bold text-emerald-600">+{item.points} Pts</td>
                      <td className="p-3">
                        {item.evidenceFile ? (
                          <button
                            onClick={() => setViewEvidenceFile(item.evidenceFile!)}
                            className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold underline text-[11px]"
                          >
                            <FileText className="w-3.5 h-3.5" /> View File
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">No File Uploaded</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleApproveActivity(item.id, item.points, item.candidateName)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-lg shadow-sm transition-all"
                        >
                          Approve (+{item.points} Pts)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              ✨ All pending activities have been verified! Roster is up to date.
            </div>
          )}
        </section>

        {/* SECTION 2: CANDIDATE ROSTER MANAGEMENT */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#24083b] flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-700" /> Participant Roster & 5-Pillar Scores
              </h2>
              <p className="text-xs text-slate-500">Manage candidates, adjust target points, and inspect self-assessment data.</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add New Candidate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((cand) => (
              <div key={cand.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#24083b]">{cand.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cand.status === 'Compliant' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {cand.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{cand.email} • {cand.phone}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCandidate(cand)}
                    className="p-1.5 bg-purple-100 text-purple-900 rounded-lg hover:bg-purple-200 transition-all text-xs font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Full Audit
                  </button>
                </div>

                {/* PBAS Points Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">PBAS Points Target ({cand.targetPoints} Pts)</span>
                    <span className="text-emerald-600">{cand.verifiedPoints} Verified ({cand.pendingPoints} Pending)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((cand.verifiedPoints / cand.targetPoints) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* 5-Pillar Score Summary Badge Row */}
                <div className="pt-1 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                  <span className="font-semibold text-slate-600">Primary Challenge: <strong className="text-purple-900">{cand.primaryBlocker}</strong></span>
                  <span className="text-slate-400">Checked in: {cand.lastCheckIn}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* MODAL 1: ADD CANDIDATE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddCandidate} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Add New Candidate to Roster 👤</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input required type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Michael Jordan" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="e.g. michael@example.com" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="0400 000 000" className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} className="w-full p-2.5 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly PBAS Target Points</label>
                <input type="number" value={newTarget} onChange={(e) => setNewTarget(Number(e.target.value))} className="w-full p-2.5 border rounded-xl" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-[#24083b] text-white font-bold rounded-xl shadow-sm">Save Candidate</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: FULL CANDIDATE AUDIT & EVIDENCE INSPECTOR */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-[#24083b]">{selectedCandidate.name} — PBAS Evidence Locker</h3>
                <p className="text-xs text-slate-500">Full audit breakdown & 5-Pillar Self Assessment</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900">5-Pillar Ratings (Self-Assessed):</span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {Object.entries(selectedCandidate.pillarScores).map(([key, score]) => (
                    <div key={key} className="flex justify-between bg-white px-2.5 py-1 rounded border border-purple-200/60">
                      <span className="text-slate-600">{key}:</span>
                      <strong className="text-purple-900">{score}/5</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700">Uploaded Evidence Documents:</span>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5"><FileText className="w-4 h-4 text-purple-700" /> SEEK_Application_Receipt_98231.pdf</span>
                    <button onClick={() => alert("Simulating download of verified proof file...")} className="px-2.5 py-1 bg-purple-100 text-purple-900 rounded font-bold hover:bg-purple-200">Download</button>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5"><FileText className="w-4 h-4 text-emerald-700" /> WHS_Module_Completion_Certificate.pdf</span>
                    <button onClick={() => alert("Simulating download of verified proof file...")} className="px-2.5 py-1 bg-purple-100 text-purple-900 rounded font-bold hover:bg-purple-200">Download</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setSelectedCandidate(null)} className="px-4 py-2 text-xs bg-[#24083b] text-white font-bold rounded-xl">Close Audit Window</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EVIDENCE FILE PREVIEW */}
      {viewEvidenceFile && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200 text-center">
            <div className="p-4 bg-purple-50 text-purple-900 rounded-2xl border border-purple-200 inline-flex">
              <FileText className="w-12 h-12" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#24083b]">Evidence File Verification</h3>
              <p className="text-xs text-slate-500 mt-1">{viewEvidenceFile}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-left text-xs text-slate-600 font-mono">
              [Document Preview Stream: Verified SEEK Confirmation Receipt #98231 for Warehouse Role]
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button onClick={() => setViewEvidenceFile(null)} className="px-5 py-2 text-xs bg-[#24083b] text-white font-bold rounded-xl">Close Preview</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CoachDashboard;