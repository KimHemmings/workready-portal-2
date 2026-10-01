import React, { useState, useEffect } from 'react';
import { Award, Copy, Check, Calendar, Trash2, ChevronDown, ChevronUp, Sparkles, Download, Clock, FileText } from 'lucide-react';

export interface StarPracticeRecord {
  id: string;
  question: string;
  jobRole: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  rubricScore?: string;
  sessionNumber?: number;
  points?: number;
  summaryReport?: any;
  timestamp?: string;
  date: string;
}

const DEFAULT_RECORDS: StarPracticeRecord[] = [
  {
    id: 'star-1',
    question: 'STAR Practice: Warehouse & Logistics (Confident Communicator)',
    jobRole: 'Warehouse & Logistics',
    situation: 'During a night shift, a damaged pallet spilled hydraulic fluid across the primary forklift aisle.',
    task: 'I needed to immediately clear the hazard and prevent colleagues from slipping while keeping dispatch on schedule.',
    action: 'I cordoned off the area with high-vis cones, notified the supervisor, and applied absorbent spill kit material using correct PPE.',
    result: 'The hazard was safely resolved in 15 minutes with zero injuries and full safety compliance log entry.',
    rubricScore: 'Confident Communicator • High Professional Alignment',
    sessionNumber: 3,
    points: 25,
    timestamp: '14/09/2026 at 10:15 am',
    date: '14/09/2026',
  },
];

export const StarInterviewHistory: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>('star-1');
  const [records, setRecords] = useState<StarPracticeRecord[]>([]);

  const loadRecords = () => {
    try {
      const stored = localStorage.getItem('workready_star_history');
      if (stored) {
        setRecords(JSON.parse(stored));
      } else {
        setRecords(DEFAULT_RECORDS);
        localStorage.setItem('workready_star_history', JSON.stringify(DEFAULT_RECORDS));
      }
    } catch (err) {
      setRecords(DEFAULT_RECORDS);
    }
  };

  useEffect(() => {
    loadRecords();

    const handleUpdate = () => loadRecords();
    window.addEventListener('starHistoryUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('starHistoryUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleCopy = (id: string, record: StarPracticeRecord) => {
    const text = `STAR INTERVIEW PRACTICE RECORD (${record.jobRole})
Date: ${record.timestamp || record.date}
Rating: ${record.rubricScore || 'Completed'}
Session: ${record.sessionNumber || 1} of 3

Situation: ${record.situation}
Task: ${record.task}
Action: ${record.action}
Result: ${record.result}`;

    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadReport = (record: StarPracticeRecord) => {
    const reportText = `
====================================================================
           WORKREADY PORTAL • OFFICIAL DEWR PRACTICE REPORT
====================================================================
Date Generated: ${record.timestamp || record.date}
Verification ID: ${record.id.toUpperCase()}
Target Industry: ${record.jobRole}
Rubric Evaluation: ${record.rubricScore || 'STAR Assessment Complete'}
Session Number: ${record.sessionNumber || 1} of 3
PBAS Point Status: ${record.points && record.points > 0 ? '+25 PBAS Points Submitted (Pending CM Verification)' : 'Session Saved (0 Pts — Milestone Earned on Session 3)'}

--------------------------------------------------------------------
STAR RESPONSE SUMMARY:
--------------------------------------------------------------------
Situation: ${record.situation}
Task: ${record.task}
Action: ${record.action}
Result: ${record.result}

====================================================================
Official Verification Record saved in Participant Activity Log.
====================================================================
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `STAR_Report_${record.jobRole.replace(/\s+/g, '_')}_${record.date.replace(/\//g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this saved STAR practice response from your local log?')) {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      localStorage.setItem('workready_star_history', JSON.stringify(updated));
    }
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#24083b]">Saved STAR Practice History</h2>
            <span className="bg-purple-100 text-[#24083b] text-xs font-extrabold px-3 py-0.5 rounded-full border border-purple-200">
              {records.length} Sessions Logged
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Review your past mock interview evaluations and download evidence reports for your Case Manager.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            No saved practice sessions found. Complete a simulator session above to build your history!
          </div>
        ) : (
          records.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const hasPoints = rec.points && rec.points > 0;

            return (
              <div key={rec.id} className="border-2 border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden text-xs transition-all">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                  className="p-4 bg-white hover:bg-slate-50 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-100 text-[#24083b] rounded-xl font-black shrink-0">
                      <Sparkles className="w-5 h-5 text-purple-800" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm">{rec.question}</div>
                      <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-bold text-purple-900">Target: {rec.jobRole}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {rec.timestamp || rec.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {hasPoints ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-black rounded-full border border-emerald-300 text-xs flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-emerald-700" /> +25 Pts (Session 3/3)
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-purple-100 text-purple-900 font-extrabold rounded-full border border-purple-200 text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-700" /> Session {rec.sessionNumber || 1}/3 Saved (0 Pts)
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 space-y-4 bg-slate-50 border-t border-slate-100 text-slate-800">
                    {rec.rubricScore && (
                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 font-bold text-purple-950 flex items-center justify-between">
                        <span>Evaluation Rating: <strong>{rec.rubricScore}</strong></span>
                        <span className="text-[11px] text-purple-700 font-extrabold">{rec.timestamp || rec.date}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <strong className="text-purple-900 block font-black mb-1">S • Situation:</strong>
                        <p className="text-slate-700 font-medium">{rec.situation}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <strong className="text-blue-900 block font-black mb-1">T • Task:</strong>
                        <p className="text-slate-700 font-medium">{rec.task}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <strong className="text-amber-900 block font-black mb-1">A • Action Taken:</strong>
                        <p className="text-slate-700 font-medium">{rec.action}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <strong className="text-emerald-900 block font-black mb-1">R • Measurable Result:</strong>
                        <p className="text-slate-700 font-medium">{rec.result}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => handleDownloadReport(rec)}
                        className="px-3.5 py-1.5 bg-[#24083b] hover:bg-[#320b52] text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" /> Download PDF Evidence
                      </button>
                      <button
                        onClick={() => handleCopy(rec.id, rec)}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5"
                      >
                        {copiedId === rec.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                        {copiedId === rec.id ? 'Copied!' : 'Copy Summary'}
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-xl text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StarInterviewHistory;