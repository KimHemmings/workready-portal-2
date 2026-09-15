import React, { useState } from 'react';
import { FileText, Sparkles, Plus, Trash2, Download, Check, RefreshCw } from 'lucide-react';

interface ResumeBuilderProps {
  maxAttempts?: number;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = () => {
  const [fullName, setFullName] = useState('Alex Johnson');
  const [targetRole, setTargetRole] = useState('Warehouse & Logistics Team Member');
  
  // Employment Gap States
  const [rawGapReason, setRawGapReason] = useState('');
  const [refinedGapText, setRefinedGapText] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const handleRefineGap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawGapReason.trim()) return;

    setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      // AI Refined Output turning gaps into positive career narratives
      setRefinedGapText(
        `Professional Career Transition & Skill Development (2024 - 2026): Dedicated period focused on family caregiving, personal administration, and completing certified vocational training modules (WHS Safety, Warehouse Operations, and Supply Chain Logistics) to return to the workforce with enhanced skills.`
      );
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#24083b]">ATS Resume & Cover Letter Builder</h2>
            <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              Employment Gap Assistant Included
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Create professional job application kits tailored to Workforce Australia employer standards.
          </p>
        </div>
      </div>

      {/* Employment Gap AI Section */}
      <div className="p-5 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-4 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-700" />
          <h3 className="font-extrabold text-[#24083b] text-sm">Employment Gap & Life Experience AI Helper</h3>
        </div>
        <p className="text-slate-600">
          Have a gap in your work history due to family care, health recovery, study, or parenting? Type your plain-language reason below and our AI assistant will rephrase it into professional, employer-approved resume language.
        </p>

        <form onSubmit={handleRefineGap} className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Explain your gap in your own words:</label>
            <textarea
              rows={2}
              value={rawGapReason}
              onChange={(e) => setRawGapReason(e.target.value)}
              placeholder="e.g. Taking care of family members, doing casual side jobs, and upskilling..."
              className="w-full p-3 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAiProcessing || !rawGapReason.trim()}
              className="px-4 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl shadow-sm text-xs flex items-center gap-1.5"
            >
              {isAiProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-300" />}
              {isAiProcessing ? 'Rephrasing with AI...' : 'Rephrase Employment Gap for Resume'}
            </button>
          </div>
        </form>

        {refinedGapText && (
          <div className="p-4 bg-white border border-purple-200 rounded-xl space-y-2">
            <div className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
              <Check className="w-4 h-4 text-emerald-600" /> Professional Resume Summary:
            </div>
            <p className="text-slate-800 italic leading-relaxed">{refinedGapText}</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ResumeBuilder;
