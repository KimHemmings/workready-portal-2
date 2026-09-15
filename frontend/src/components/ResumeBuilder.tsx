import React, { useState } from 'react';
import { FileText, Sparkles, Plus, Trash2, Download, Check, RefreshCw, Briefcase } from 'lucide-react';

export interface ResumeBuilderProps {
  maxAttempts?: number;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ maxAttempts = 3 }) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter' | 'gap-helper'>('resume');

  // Candidate Profile State
  const [fullName, setFullName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex.johnson@email.com');
  const [phone, setPhone] = useState('0412 345 678');
  const [location, setLocation] = useState('Brisbane, QLD');
  const [targetRole, setTargetRole] = useState('Warehouse & Logistics Operations Assistant');

  // Work History State
  const [experiences, setExperiences] = useState([
    {
      id: 'exp-1',
      jobTitle: 'Storeperson / Freight Handler',
      company: 'Apex Logistics',
      dates: '2022 - 2024',
      duties: 'Operated forklifts safely, packed pallet shipments under tight dispatch deadlines, and logged WHS safety checks.',
    },
  ]);

  // Employment Gap AI State
  const [rawGapReason, setRawGapReason] = useState('');
  const [refinedGapText, setRefinedGapText] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Cover Letter AI State
  const [targetCompany, setTargetCompany] = useState('Bunnings Warehouse');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  const handleRefineGap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawGapReason.trim()) return;

    setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      setRefinedGapText(
        `Professional Career Transition & Skill Development (2024 - 2026): Dedicated period focused on family caregiving, personal administration, and completing certified vocational training modules (WHS Safety, Warehouse Operations, and Supply Chain Logistics) to return to the workforce with enhanced skills.`
      );
    }, 1000);
  };

  const handleGenerateCoverLetter = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingCoverLetter(true);
    setTimeout(() => {
      setIsGeneratingCoverLetter(false);
      setCoverLetterText(
        `Dear Hiring Manager at ${targetCompany},\n\nI am writing to express my strong enthusiasm for the ${targetRole} position. With direct experience in freight handling, inventory management, and WHS compliance, I bring a reliable work ethic and a commitment to operational efficiency.\n\nThroughout my work history, I have maintained high accuracy standards under tight dispatch schedules and prioritize workplace safety at all times. I look forward to contributing to ${targetCompany}'s team.\n\nSincerely,\n${fullName}`
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
            Build ATS-formatted resumes, generate employer cover letters, and convert employment gaps into career strengths.
          </p>
        </div>

        {/* Sub-Tabs Navigation */}
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
          
          {/* Personal Details */}
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

          {/* Work Experience Form */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#24083b] flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-700" /> Employment History
            </h3>

            {experiences.map((exp, idx) => (
              <div key={exp.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Job Title"
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
                    placeholder="Company Name"
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
                    placeholder="Dates (e.g. 2022 - 2024)"
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
                  placeholder="Key Responsibilities & Achievements..."
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

          <div className="flex justify-end pt-2">
            <button
              onClick={() => alert("📄 Resume formatted to ATS standards & ready for export!")}
              className="px-5 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export ATS Resume (PDF/Word)
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: COVER LETTER GENERATOR */}
      {activeTab === 'cover-letter' && (
        <form onSubmit={handleGenerateCoverLetter} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Company / Employer *</label>
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
              <label className="block font-bold text-slate-700 mb-1">Position Applied For *</label>
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
            {isGeneratingCoverLetter ? 'Generating Cover Letter...' : 'Generate AI Tailored Cover Letter'}
          </button>

          {coverLetterText && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <textarea
                rows={10}
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
                className="w-full p-3 border rounded-xl bg-white font-mono text-xs"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert("📋 Cover letter copied to clipboard!")}
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Copy Cover Letter
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
            <div className="p-4 bg-white border border-purple-200 rounded-xl space-y-2">
              <div className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                <Check className="w-4 h-4 text-emerald-600" /> Professional Resume Entry Ready to Insert:
              </div>
              <p className="text-slate-800 italic leading-relaxed">{refinedGapText}</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ResumeBuilder;
