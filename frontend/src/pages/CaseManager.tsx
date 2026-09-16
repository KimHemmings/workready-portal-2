import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  TrendingUp, 
  RefreshCw,
  Eye,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ActivityLog {
  id: string;
  type: 'Job Search' | 'Interview' | 'Job Placement' | 'LMS Module' | 'Confidence Review';
  title: string;
  reference: string;
  points: number;
  status: 'Pending Verification' | 'Verified' | 'Rejected';
  date: string;
  candidateName?: string;
  reportData?: any;
}

export const CaseManager: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [candidatePoints, setCandidatePoints] = useState<number>(35);
  const targetPoints = 100;

  // Load submissions from localStorage and initialize default verification queue
  const loadSubmissions = () => {
    try {
      const storedHistory = localStorage.getItem('workready_star_history');
      let starActivities: ActivityLog[] = [];

      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        starActivities = parsed.map((item: any) => ({
          id: item.id,
          type: 'Interview',
          title: `STAR Practice: ${item.jobRole} (${item.rubricScore || 'Completed'})`,
          reference: `STAR-${item.id.slice(-6).toUpperCase()}`,
          points: 25,
          status: 'Pending Verification',
          date: item.date || new Date().toLocaleDateString('en-AU'),
          candidateName: 'Alex Participant',
          reportData: item
        }));
      }

      const defaultQueue: ActivityLog[] = [
        {
          id: 'act-2',
          type: 'Job Search',
          title: 'Warehouse Assistant — Logistics Co',
          reference: 'JOB-98231',
          points: 5,
          status: 'Pending Verification',
          date: '14/09/2026',
          candidateName: 'Alex Participant'
        },
        {
          id: 'act-rev-1',
          type: 'Confidence Review',
          title: '5-Pillar Assessment (Resume / Applications)',
          reference: 'REV-9-2026',
          points: 10,
          status: 'Pending Verification',
          date: '15/09/2026',
          candidateName: 'Alex Participant'
        },
        {
          id: 'act-1',
          type: 'LMS Module',
          title: 'WHS Fundamentals & Safe Work',
          reference: 'MOD-WHS-01',
          points: 10,
          status: 'Verified',
          date: '10/09/2026',
          candidateName: 'Alex Participant'
        }
      ];

      // Merge stored STAR items avoiding duplicate IDs
      const combined = [...starActivities];
      defaultQueue.forEach((item) => {
        if (!combined.some((act) => act.id === item.id)) {
          combined.push(item);
        }
      });

      setActivities(combined);
    } catch (err) {
      console.error('Error loading Case Manager queue', err);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleApprove = (id: string, points: number) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, status: 'Verified' } : act))
    );
    setCandidatePoints((prev) => Math.min(prev + points, targetPoints));
  };

  const handleReject = (id: string) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, status: 'Rejected' } : act))
    );
  };

  const pendingList = activities.filter((a) => a.status === 'Pending Verification');
  const pendingPointsTotal = pendingList.reduce((sum, a) => sum + a.points, 0);

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'All') return true;
    if (filterType === 'Pending') return act.status === 'Pending Verification';
    if (filterType === 'Verified') return act.status === 'Verified';
    return act.type === filterType;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* Top Header Banner */}
      <header className="bg-gradient-to-r from-[#1e1b4b] via-[#24083b] to-[#1e1b4b] text-white shadow-md border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight font-heading text-white">
                  Case Manager Verification Hub
                </span>
                <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Casey (Provider Admin)
                </span>
              </div>
              <p className="text-xs text-purple-200">Straight Up Training • Workforce Australia PBAS Sign-off System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadSubmissions}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Header Candidate Overview */}
      <section className="bg-white border-b border-slate-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm border border-purple-200">
              AP
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#24083b]">
                Active Candidate: Alex Participant
              </h1>
              <p className="text-xs text-slate-500">
                Workforce Australia ID: <span className="font-mono text-slate-700">WA-882194</span> • Assigned Provider: Straight Up Training
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
              {candidatePoints} / {targetPoints} Verified Points
            </div>
            {pendingPointsTotal > 0 && (
              <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> {pendingPointsTotal} Points Awaiting Verification
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{pendingList.length} Items</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Requires audit sign-off</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Points Credit</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">+{candidatePoints} Pts</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Committed to DEWR system</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Progress</p>
              <p className="text-2xl font-black text-purple-900 mt-1">
                {Math.min(Math.round(((candidatePoints + pendingPointsTotal) / targetPoints) * 100), 100)}%
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Verified + Pending Projection</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-800 rounded-xl border border-purple-100">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Verification Queue Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-base text-[#24083b] flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-700" /> Participant Activity Sign-Off Queue
              </h2>
              <p className="text-xs text-slate-500">Audit candidate submissions and credit PBAS points to Alex's official record.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Pending', 'Verified', 'Interview', 'Job Search'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                    filterType === type
                      ? 'bg-[#24083b] text-white border-[#24083b]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Submitted</th>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Activity Type</th>
                  <th className="p-3">Title / Details</th>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">PBAS Points</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Audit & Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="p-3 font-semibold text-slate-500">{act.date}</td>
                    <td className="p-3 font-bold text-slate-800">{act.candidateName || 'Alex Participant'}</td>
                    <td className="p-3 font-bold text-purple-900">{act.type}</td>
                    <td className="p-3 text-slate-700">{act.title}</td>
                    <td className="p-3 font-mono text-slate-500 bg-slate-100/70 px-2 py-1 rounded text-[11px] w-max">
                      {act.reference}
                    </td>
                    <td className="p-3 font-extrabold text-emerald-600">+{act.points} Pts</td>
                    <td className="p-3">
                      {act.status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : act.status === 'Rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" /> Re-submission Needed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Pending Casey Sign-off
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      {act.reportData && (
                        <button
                          onClick={() => setSelectedReport(act.reportData)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Audit Report
                        </button>
                      )}

                      {act.status === 'Pending Verification' && (
                        <>
                          <button
                            onClick={() => handleApprove(act.id, act.points)}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shadow-xs transition-all"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve (+{act.points})
                          </button>
                          <button
                            onClick={() => handleReject(act.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg text-[11px] font-bold transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* AUDIT MODAL FOR CASEY */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto font-sans">
            <div className="border-b border-slate-100 pb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase">
                    Audit Inspection
                  </span>
                  <span className="text-xs text-slate-400">{selectedReport.timestamp}</span>
                </div>
                <h3 className="font-extrabold text-lg text-[#24083b] mt-1">
                  STAR Interview Evaluation • {selectedReport.jobRole}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                <span>Rubric Rating: <strong className="text-emerald-700 text-sm ml-1">{selectedReport.rubricScore}</strong></span>
                <span className="text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 text-[10px]">
                  Participant: Alex
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                {selectedReport.feedbackNotes?.map((note: string, idx: number) => (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-purple-100 shadow-2xs">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">STAR Structure Response Analysis:</h4>
              
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-purple-900">Primary Question:</span>
                  <p className="text-slate-700 mt-0.5 font-medium">"{selectedReport.question}"</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Situation:</span>
                    <p className="text-slate-600">{selectedReport.situation}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Task:</span>
                    <p className="text-slate-600">{selectedReport.task}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Action:</span>
                    <p className="text-slate-600">{selectedReport.action}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Result:</span>
                    <p className="text-slate-600">{selectedReport.result}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  handleApprove(selectedReport.id, 25);
                  setSelectedReport(null);
                }}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Approve Session & Credit +25 Pts
              </button>

              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CaseManager;