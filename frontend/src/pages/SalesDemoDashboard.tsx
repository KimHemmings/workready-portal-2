import React, { useState } from 'react';
import { PlayCircle, Send, AlertTriangle, Lightbulb, MonitorPlay } from 'lucide-react';

interface WorkLog {
  id: string;
  activity: string;
  clientName: string;
  date: string;
  status: 'Completed' | 'Follow-up Required';
}

export const SalesDemoDashboard: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [workLogs] = useState<WorkLog[]>([
    {
      id: 'log-1',
      activity: 'Platform Walkthrough — PBAS Scoring',
      clientName: 'Apex Regional Provider',
      date: '15/09/2026',
      status: 'Completed',
    },
    {
      id: 'log-2',
      activity: 'Case Manager Evidence Locker Demo',
      clientName: 'Metro Employment Services',
      date: '14/09/2026',
      status: 'Follow-up Required',
    },
  ]);

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleSendAdminMessage = (type: string) => {
    alert(`🚀 ${type} dispatch sent directly to System Admin (admin@straightuptraining.com)!`);
    setShowLeadModal(false); setShowSuggestionModal(false); setShowIssueModal(false);
    setTextInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <header className="bg-gradient-to-r from-[#24083b] via-[#320b52] to-[#24083b] text-white shadow-md border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white font-heading">
                  Sales & Training Portal
                </span>
                <span className="bg-purple-800/80 text-purple-200 border border-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Sales Hub (training@straightuptraining.com)
                </span>
              </div>
              <p className="text-xs text-purple-200">Interactive Demos, Provider Onboarding & Admin Escalations</p>
            </div>
          </div>

          <button
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('role');
              window.history.pushState({}, '', url.pathname);
              window.dispatchEvent(new Event('popstate'));
            }}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Admin Dispatch Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={() => setShowLeadModal(true)} className="p-4 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left transition-all">
              <span className="font-bold text-sm text-emerald-900 flex items-center gap-1.5"><Send className="w-4 h-4 text-emerald-600" /> Dispatch New Provider Lead</span>
              <span className="text-xs text-emerald-700 block mt-1">Send hot lead details straight to System Admin.</span>
            </button>

            <button onClick={() => setShowSuggestionModal(true)} className="p-4 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-xl text-left transition-all">
              <span className="font-bold text-sm text-purple-900 flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-purple-600" /> Suggest Feature</span>
              <span className="text-xs text-purple-700 block mt-1">Request layout/feature tweaks for upcoming demos.</span>
            </button>

            <button onClick={() => setShowIssueModal(true)} className="p-4 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-xl text-left transition-all">
              <span className="font-bold text-sm text-rose-900 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-rose-600" /> Report Demo Issue</span>
              <span className="text-xs text-rose-700 block mt-1">Trigger tech support alert to System Admin.</span>
            </button>
          </div>
        </section>

        <section className="bg-gradient-to-r from-purple-950 via-[#24083b] to-purple-900 text-white rounded-2xl p-6 shadow-lg border border-purple-800 space-y-4">
          <div className="flex justify-between items-center border-b border-purple-800/80 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-emerald-400" /> Live Interactive Demo Sandbox
              </h2>
              <p className="text-xs text-purple-200">Launch safe, isolated demo modes without affecting live candidate profiles.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-purple-900/40 p-4 rounded-xl border border-purple-700 space-y-2">
              <h3 className="font-bold text-sm text-white">Candidate Dashboard Demo</h3>
              <button onClick={() => setActiveDemo('Candidate Demo Active')} className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-lg transition-all">
                Launch Candidate Demo
              </button>
            </div>
            <div className="bg-purple-900/40 p-4 rounded-xl border border-purple-700 space-y-2">
              <h3 className="font-bold text-sm text-white">Case Manager Demo</h3>
              <button onClick={() => setActiveDemo('Case Manager Demo Active')} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg transition-all">
                Launch Case Manager Demo
              </button>
            </div>
            <div className="bg-purple-900/40 p-4 rounded-xl border border-purple-700 space-y-2">
              <h3 className="font-bold text-sm text-white">Executive Demo</h3>
              <button onClick={() => setActiveDemo('Executive Demo Active')} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg transition-all">
                Launch Executive Demo
              </button>
            </div>
          </div>

          {activeDemo && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center text-xs font-bold text-emerald-300">
              ✨ {activeDemo} — Demo sandbox ready for presentation.
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#24083b] border-b border-slate-100 pb-3">Sales Activity Log</h2>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-3">Date</th>
                <th className="p-3">Activity</th>
                <th className="p-3">Client</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="p-3 text-slate-500">{log.date}</td>
                  <td className="p-3 font-bold text-slate-900">{log.activity}</td>
                  <td className="p-3 text-purple-900">{log.clientName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${log.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {(showLeadModal || showSuggestionModal || showIssueModal) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-[#24083b]">Direct Admin Communication</h3>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter details here..."
              className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowLeadModal(false); setShowSuggestionModal(false); setShowIssueModal(false); }} className="px-4 py-2 text-xs font-semibold text-slate-600">Cancel</button>
              <button onClick={() => handleSendAdminMessage(showLeadModal ? 'Lead' : showSuggestionModal ? 'Suggestion' : 'Issue')} className="px-4 py-2 text-xs bg-[#24083b] text-white font-bold rounded-xl">Send Alert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDemoDashboard;