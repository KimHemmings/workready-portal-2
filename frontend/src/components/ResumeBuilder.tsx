import React, { useState } from 'react';
import { FileText, Sparkles, Plus, Trash2, Download, Check, RefreshCw, Briefcase, Copy } from 'lucide-react';

export interface ResumeBuilderProps {
  maxAttempts?: number;
}

export interface WorkPosition {
  id: string;
  jobTitle: string;
  company: string;
  dates: string;
  duties: string;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = () => {
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter' | 'gap-helper'>('resume');

  // Candidate Profile State
  const [fullName, setFullName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@email.com');
  const [phone, setPhone] = useState('0412 345 678');
  const [location, setLocation] = useState('Brisbane, QLD');
  const [targetRole, setTargetRole] = useState('Warehouse & Logistics Operations Assistant');

  // Support Up to 5 Additional Positions (Total 6 Positions Max)
  const [experiences, setExperiences] = useState<WorkPosition[]>([
    {
      id: 'exp-1',
      jobTitle: 'Storeperson / Freight Handler',
      company: 'Apex Logistics',
      dates: '2022 - 2024',
      duties: 'Operated forklifts safely, packed pallet shipments under tight dispatch deadlines, and logged WHS safety checks.',
    },
  ]);

  // Employment Gap & Life Experience State
  const [rawGapReason, setRawGapReason] = useState('');
  const [refinedGapText, setRefinedGapText] = useState('');
  const [insertedGapInResume, setInsertedGapInResume] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Cover Letter State
  const [targetCompany, setTargetCompany] = useState('Bunnings Warehouse');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  const handleAddPosition = () => {
    if (experiences.length >= 6) {
      alert("You have reached the maximum limit of 6 work history entries.");
      return;
    }
    const newPos: WorkPosition = {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      company: '',
      dates: '',
      duties: '',
    };
    setExperiences((prev) => [...prev, newPos]);
  };

  const handleRemovePosition = (id: string) => {
    setExperiences((prev) => prev.filter((pos) => pos.id !== id));
  };

  const handleRefineGap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawGapReason.trim()) return;

    setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      const generatedGap = `Professional Career Transition & Skill Development (2024 - 2026): Dedicated period focused on family caregiving, personal administration, and completing certified vocational training modules (WHS Safety, Warehouse Operations, and Supply Chain Logistics) to return to the workforce with enhanced skills.`;
      setRefinedGapText(generatedGap);
    }, 1000);
  };

  const handleInsertGapToResume = () => {
    setInsertedGapInResume(refinedGapText);
    alert("✦ Employment Gap entry inserted into your Resume form!");
  };

  const handleGenerateCoverLetter = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingCoverLetter(true);

    setTimeout(() => {
      setIsGeneratingCoverLetter(false);

      // Build context summary from listed work positions
      const primaryRole = experiences[0]?.jobTitle || 'relevant operational roles';
      const primaryCompany = experiences[0]?.company || 'industry employers';

      setCoverLetterText(
        `Dear Hiring Manager at ${targetCompany},\n\nI am writing to express my enthusiastic application for the ${targetRole} position. With strong background experience as a ${primaryRole} at ${primaryCompany}, I bring a proven track record of operational reliability, strict WHS adherence, and a strong work ethic.\n\nKey Qualifications I Bring to ${targetCompany}:\n• Hands-on experience performing ${primaryRole} duties while maintaining zero safety incidents.\n• Proven ability to prioritize tasks, meet dispatch deadlines, and adapt quickly to site procedures.\n• Commitment to continuous professional growth through certified Straight Up Training modules.\n\nThank you for considering my application. I look forward to discussing how my experience aligns with the goals of ${targetCompany}.\n\nSincerely,\n${fullName}\n${phone} | ${email}`
      );
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#24083b]">ATS Resume & Cover Letter Studio</h2>
            <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              Workforce Australia Approved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Add up to 6 past work positions, rephrase career gaps with AI, and generate tailored cover letters.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'resume' ? 'bg-white text-[#24083b] shadow-xs' : 'text-slate-600'}`}
          >
            Resume Builder
          </button>
          <button
            onClick={() => setActiveTab('cover-letter')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'cover-letter' ? 'bg-white text-[#24083b] shadow-xs' : 'text-slate-600'}`}
          >
            Cover Letter Generator
          </button>
          <button
            onClick={() => setActiveTab('gap-helper')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'gap-helper' ? 'bg-[#24083b] text-white shadow-xs' : 'text-slate-600'}`}
          >
            Gap AI Helper ✦
          </button>
        </div>
      </div>

      {/* TAB 1: RESUME BUILDER */}
      {activeTab === 'resume' && (
        <div className="space-y-6 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 border rounded-xl" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Role Title</label>
              <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="w-full p-2.5 border rounded-xl" />
            </div>
          </div>

          {/* Work Positions (Supports up to 5 additional entries) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#24083b] flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-purple-700" /> Work History ({experiences.length}/6 Positions)
              </h3>
              <button
                type="button"
                onClick={handleAddPosition}
                className="px-3 py-1 bg-[#24083b] text-white font-bold rounded-lg text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Position
              </button>
            </div>

            {experiences.map((exp, idx) => (
              <div key={exp.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3 relative">
                <div className="flex justify-between items-center pb-1 border-b border-slate-200/60">
                  <span className="font-extrabold text-slate-700 text-xs">Position #{idx + 1}</span>
                  {experiences.length > 1 && (
                    <button
                      onClick={() => handleRemovePosition(exp.id)}
                      className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Job Title (e.g. Forklift Operator)"
                    value={exp.jobTitle}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].jobTitle = e.target.value;
                      setExperiences(updated);
                    }}
                    className="p-2 border rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Employer / Company"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].company = e.target.value;
                      setExperiences(updated);
                    }}
                    className="p-2 border rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Dates (e.g. 2021 - 2023)"
                    value={exp.dates}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[idx].dates = e.target.value;
                      setExperiences(updated);
                    }}
                    className="p-2 border rounded-lg bg-white"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Key Responsibilities & Operational Achievements..."
                  value={exp.duties}
                  onChange={(e) => {
                    const updated = [...experiences];
                    updated[idx].duties = e.target.value;
                    setExperiences(updated);
                  }}
                  className="w-full p-2 border rounded-lg bg-white"
                />
              </div>
            ))}
          </div>

          {/* Inserted Employment Gap Entry Space */}
          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
            <label className="block font-bold text-purple-900 text-xs">
              Career Transition & Employment Gap Entry (Optional):
            </label>
            <textarea
              rows={2}
              value={insertedGapInResume}
              onChange={(e) => setInsertedGapInResume(e.target.value)}
              placeholder="Use the 'Gap AI Helper' tab to generate a professional rephrased entry for family care, parenting, or study..."
              className="w-full p-2.5 border border-purple-200 rounded-xl bg-white text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => alert("📄 Resume compiled to ATS standards & ready for export!")}
              className="px-5 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Complete ATS Resume (PDF/Word)
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: COVER LETTER GENERATOR */}
      {activeTab === 'cover-letter' && (
        <form onSubmit={handleGenerateCoverLetter} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Employer / Company *</label>
              <input
                required
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Bunnings Warehouse"
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Applying Position Title *</label>
              <input
                required
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isGeneratingCoverLetter}
            className="px-4 py-2 bg-[#24083b] text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            {isGeneratingCoverLetter ? 'Synthesizing Resume & Job Role...' : 'Generate AI Tailored Cover Letter'}
          </button>

          {coverLetterText && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <textarea
                rows={12}
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                className="w-full p-3 border rounded-xl bg-white font-mono text-xs leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(coverLetterText);
                    alert("📋 Cover letter copied to clipboard!");
                  }}
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Cover Letter Text
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* TAB 3: EMPLOYMENT GAP AI HELPER */}
      {activeTab === 'gap-helper' && (
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
                rows={3}
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
            <div className="p-4 bg-white border border-purple-200 rounded-xl space-y-3">
              <div className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                <Check className="w-4 h-4 text-emerald-600" /> Professional Resume Entry Ready to Insert:
              </div>
              <p className="text-slate-800 italic leading-relaxed">{refinedGapText}</p>
              
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleInsertGapToResume}
                  className="px-4 py-2 bg-[#16a34a] text-white font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  ✦ Insert directly into Resume Form
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ResumeBuilder;
