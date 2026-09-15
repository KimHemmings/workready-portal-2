import React, { useState } from 'react';
import { Award, Copy, Check, Calendar, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export interface StarPracticeRecord {
  id: string;
  question: string;
  jobRole: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  score: number;
  date: string;
}

export const StarInterviewHistory: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>('star-1');

  const [records, setRecords] = useState<StarPracticeRecord[]>([
    {
      id: 'star-1',
      question: 'Describe a time you handled a difficult safety hazard under pressure.',
      jobRole: 'Warehouse Operations Assistant',
      situation: 'During a night shift, a damaged pallet spilled hydraulic fluid across the primary forklift aisle.',
      task: 'I needed to immediately clear the hazard and prevent colleagues from slipping while keeping dispatch on schedule.',
      action: 'I cordoned off the area with high-vis cones, notified the supervisor, and applied absorbent spill kit material using correct PPE.',
      result: 'The hazard was safely resolved in 15 minutes with zero injuries and full safety compliance log entry.',
      score: 92,
      date: '14/09/2026',
    },
  ]);

  const handleCopy = (id: string, record: StarPracticeRecord) => {
    const text = `STAR INTERVIEW RESPONSE (${record.jobRole})\nQuestion: ${record.question}\n\nSituation: ${record.situation}\nTask: ${record.task}\nAction: ${record.action}\nResult: ${record.result}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this saved STAR practice response?')) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#24083b]">Saved STAR Interview Practice History</h2>
            <span className="bg-purple-50 text-[#24083b] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              {records.length} Practice Responses Saved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your AI coach practice sessions to prepare before stepping into real interviews.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {records.map((rec) => {
          const isExpanded = expandedId === rec.id;
          return (
            <div key={rec.id} className="border border-slate-200 rounded-xl bg-slate-50/50 overflow-hidden text-xs transition-all">
              <div
                onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                className="p-4 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-[#24083b] rounded-lg font-bold">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{rec.question}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Target: {rec.jobRole}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {rec.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 text-[11px]">
                    {rec.score}% Match
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-3 bg-slate-50 border-t border-slate-100 text-slate-700">
                  <div>
                    <strong className="text-purple-900 block font-bold mb-0.5">Situation:</strong>
                    <p>{rec.situation}</p>
                  </div>
                  <div>
                    <strong className="text-purple-900 block font-bold mb-0.5">Task:</strong>
                    <p>{rec.task}</p>
                  </div>
                  <div>
                    <strong className="text-purple-900 block font-bold mb-0.5">Action:</strong>
                    <p>{rec.action}</p>
                  </div>
                  <div>
                    <strong className="text-purple-900 block font-bold mb-0.5">Result:</strong>
                    <p>{rec.result}</p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => handleCopy(rec.id, rec)}
                      className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 text-[11px]"
                    >
                      {copiedId === rec.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === rec.id ? 'Copied to Clipboard!' : 'Copy Answer'}
                    </button>
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StarInterviewHistory;
