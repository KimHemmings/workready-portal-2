import React, { useState } from 'react';
import { Download, FileText, Plus, Trash2, Award, Briefcase, FileCode } from 'lucide-react';

export interface JobEntry {
  id: string;
  title: string;
  employer: string;
  dates: string;
  duties: string;
}

export interface ResumeData {
  fullName: string;
  contact: string;
  phone: string;
  targetTitle: string;
  licenses: string;
  skillsRaw: string;
  education: string;
  references: string;
  gaps: string;
  jobEntries: JobEntry[];
}

interface ResumeBuilderProps {
  attemptsUsed?: number;
  maxAttempts?: number;
  onQuotaUpdate?: () => void;
}

export function ResumeBuilder({
  attemptsUsed = 0,
  maxAttempts = 3,
  onQuotaUpdate,
}: ResumeBuilderProps) {
  const [formData, setFormData] = useState<ResumeData>({
    fullName: '',
    contact: '',
    phone: '',
    targetTitle: '',
    licenses: '',
    skillsRaw: '',
    education: '',
    references: '',
    gaps: '',
    jobEntries: [],
  });

  const [attempts, setAttempts] = useState<number>(attemptsUsed);
  const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null);

  const addJobEntry = () => {
    if (formData.jobEntries.length >= 5) {
      alert("Maximum limit of 5 work history positions reached.");
      return;
    }
    const newEntry: JobEntry = {
      id: Date.now().toString(),
      title: '',
      employer: '',
      dates: '',
      duties: '',
    };
    setFormData((prev) => ({
      ...prev,
      jobEntries: [...prev.jobEntries, newEntry],
    }));
  };

  const removeJobEntry = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      jobEntries: prev.jobEntries.filter((item) => item.id !== id),
    }));
  };

  const updateJobEntry = (id: string, field: keyof JobEntry, value: string) => {
    setFormData((prev) => ({
      ...prev,
      jobEntries: prev.jobEntries.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= maxAttempts) {
      alert("Monthly limit reached (Maximum 3 generations per month).");
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (onQuotaUpdate) onQuotaUpdate();
    setGeneratedResume({ ...formData });
  };

  const downloadWord = (elementId: string, fileName: string) => {
    const content = document.getElementById(elementId)?.innerHTML;
    if (!content) return;
    const source =
      'data:application/vnd.ms-word;charset=utf-8,' +
      encodeURIComponent('<html><body>' + content + '</body></html>');
    const fileDownload = document.createElement('a');
    fileDownload.href = source;
    fileDownload.download = `${fileName}.doc`;
    fileDownload.click();
  };

  const printPdf = (elementId: string, title: string) => {
    const content = document.getElementById(elementId)?.innerHTML;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; }
            h1 { color: #24083b; font-size: 24px; margin-bottom: 4px; text-transform: uppercase; }
            h2 { font-size: 14px; color: #334155; margin-top: 0; }
            h3 { font-size: 14px; color: #24083b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 20px; text-transform: uppercase; }
            p, li { font-size: 12px; color: #334155; }
            ul { padding-left: 20px; }
            .job-item { border-left: 2px solid #24083b; padding-left: 10px; margin-bottom: 12px; }
            .job-header { display: flex; justify-content: space-between; font-weight: bold; }
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">Resume & Cover Letter Engine</h2>
            <span className="bg-[#24083b]/10 text-[#24083b] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#24083b]/20">
              Targeted Generator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build ATS-aligned resumes and tailored cover letters with independent Word & PDF exports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
            Monthly Allowance: <span className="text-[#16a34a] font-extrabold">{attempts} / {maxAttempts} Used</span>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerateResume} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-[#24083b] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#16a34a]" /> Candidate Details & Target Role
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none transition-all"
              placeholder="e.g. Alex Johnson"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="contact"
              required
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none transition-all"
              placeholder="e.g. alex.johnson@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none transition-all"
              placeholder="e.g. 0412 345 678"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Title *</label>
            <input
              type="text"
              name="targetTitle"
              required
              value={formData.targetTitle}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none transition-all"
              placeholder="e.g. Warehouse & Logistics Assistant"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Licenses & Tickets</label>
            <input
              type="text"
              name="licenses"
              value={formData.licenses}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none transition-all"
              placeholder="e.g. White Card, First Aid, Driver License"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Core Skills (Comma-separated) *
          </label>
          <input
            type="text"
            name="skillsRaw"
            required
            value={formData.skillsRaw}
            onChange={handleInputChange}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none transition-all"
            placeholder="e.g. WHS Compliance, Inventory Control, Customer Service, Teamwork"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Education & Qualifications</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none transition-all"
              placeholder="e.g. Year 12 Senior Certificate / Relevant Tickets"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Career Transition / Gap Context (Optional)</label>
            <input
              type="text"
              name="gaps"
              value={formData.gaps}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none transition-all"
              placeholder="e.g. 2024 - Active Skill Building & Personal Development"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">References</label>
          <input
            type="text"
            name="references"
            value={formData.references}
            onChange={handleInputChange}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none transition-all"
            placeholder="Default: Professional references available upon request"
          />
        </div>

        {/* Dynamic Employment History */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#16a34a]" /> Employment History (Up to 5 positions)
            </h3>
            <button
              type="button"
              onClick={addJobEntry}
              className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#16a34a]" /> Add Position
            </button>
          </div>

          <div className="space-y-3">
            {formData.jobEntries.map((entry, idx) => (
              <div
                key={entry.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3"
              >
                <div className="md:col-span-3 flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-[#24083b]">Position #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeJobEntry(entry.id)}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Job Title (e.g. Retail Assistant)"
                  value={entry.title}
                  onChange={(e) => updateJobEntry(entry.id, 'title', e.target.value)}
                  className="p-2 border border-slate-200 rounded-lg text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Employer (e.g. ABC Stores)"
                  value={entry.employer}
                  onChange={(e) => updateJobEntry(entry.id, 'employer', e.target.value)}
                  className="p-2 border border-slate-200 rounded-lg text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Dates (e.g. 2022 - 2024)"
                  value={entry.dates}
                  onChange={(e) => updateJobEntry(entry.id, 'dates', e.target.value)}
                  className="p-2 border border-slate-200 rounded-lg text-xs bg-white"
                />
                <textarea
                  rows={2}
                  placeholder="Key Duties & Achievements..."
                  value={entry.duties}
                  onChange={(e) => updateJobEntry(entry.id, 'duties', e.target.value)}
                  className="md:col-span-3 p-2 border border-slate-200 rounded-lg text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4 text-[#16a34a]" /> Generate Tailored Resume & Cover Letter ({attempts}/{maxAttempts} Used)
        </button>
      </form>

      {/* Generated Documents Container */}
      {generatedResume && (
        <div className="space-y-8 pt-4">
          
          {/* SECTION 1: SEPARATE RESUME DOWNLOADS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#24083b]">1. Tailored Resume Document</h3>
                <p className="text-xs text-slate-500">Export your formatted resume in Word (.doc) or PDF format.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => downloadWord('resume-document-template', `${generatedResume.fullName}_Resume`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg border border-slate-200 transition-all"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-600" /> Download Word (.doc)
                </button>
                <button
                  onClick={() => printPdf('resume-document-template', `${generatedResume.fullName} - Resume`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download / Print PDF
                </button>
              </div>
            </div>

            {/* Resume Document Preview Box */}
            <div
              id="resume-document-template"
              className="p-8 bg-white border border-slate-200 rounded-xl text-xs space-y-4 shadow-inner"
            >
              <div className="border-b-2 border-[#24083b] pb-3">
                <h1 className="text-2xl font-black text-[#24083b]">
                  {generatedResume.fullName.toUpperCase()}
                </h1>
                <div className="flex space-x-4 text-slate-600 font-semibold mt-1">
                  <span>✉️ {generatedResume.contact}</span>
                  <span>📞 {generatedResume.phone}</span>
                </div>
              </div>

              <div>
                <h2 className="font-bold text-slate-900 text-xs tracking-wider">
                  TARGET ROLE: {generatedResume.targetTitle.toUpperCase()}
                </h2>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  Dedicated and reliable professional seeking a position as a{' '}
                  {generatedResume.targetTitle}. Demonstrates strong workplace communication, WHS
                  awareness, and practical problem-solving capabilities.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#24083b] border-b border-slate-200 pb-1 uppercase tracking-wider">
                  LICENSES & CERTIFICATIONS
                </h3>
                <p className="text-slate-700 mt-1 font-medium">
                  {generatedResume.licenses || 'White Card, First Aid, Valid Driver License'}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#24083b] border-b border-slate-200 pb-1 uppercase tracking-wider">
                  KEY SKILLS
                </h3>
                <ul className="list-disc list-inside text-slate-700 mt-1 space-y-1">
                  {generatedResume.skillsRaw.split(',').map((skill, i) => (
                    <li key={i} className="font-medium">{skill.trim()}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#24083b] border-b border-slate-200 pb-1 uppercase tracking-wider">
                  EMPLOYMENT HISTORY
                </h3>
                <div className="mt-2 space-y-3">
                  {generatedResume.jobEntries.length > 0 ? (
                    generatedResume.jobEntries.map((j) => (
                      <div key={j.id} className="job-item border-l-2 border-[#24083b] pl-3 py-1">
                        <div className="job-header flex justify-between font-bold text-slate-800 text-xs">
                          <span>
                            {j.title} — {j.employer}
                          </span>
                          <span className="text-slate-500 font-normal">{j.dates}</span>
                        </div>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{j.duties}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No work history logged.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#24083b] border-b border-slate-200 pb-1 uppercase tracking-wider">
                  EDUCATION
                </h3>
                <p className="text-slate-700 mt-1 font-medium">
                  {generatedResume.education ||
                    'Year 12 Senior Certificate / Relevant Qualifications'}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#24083b] border-b border-slate-200 pb-1 uppercase tracking-wider">
                  REFERENCES
                </h3>
                <p className="text-slate-700 mt-1 font-medium">
                  {generatedResume.references || 'Professional references available upon request.'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: SEPARATE COVER LETTER DOWNLOADS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#24083b]">2. Tailored Cover Letter</h3>
                <p className="text-xs text-slate-500">Export your separate cover letter in Word (.doc) or PDF format.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => downloadWord('cover-letter-document-template', `${generatedResume.fullName}_Cover_Letter`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg border border-slate-200 transition-all"
                >
                  <FileCode className="w-3.5 h-3.5 text-blue-600" /> Download Word (.doc)
                </button>
                <button
                  onClick={() => printPdf('cover-letter-document-template', `${generatedResume.fullName} - Cover Letter`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download / Print PDF
                </button>
              </div>
            </div>

            {/* Cover Letter Document Preview Box */}
            <div
              id="cover-letter-document-template"
              className="p-8 bg-white border border-slate-200 rounded-xl text-xs space-y-4 shadow-inner"
            >
              <div className="border-b-2 border-[#24083b] pb-3">
                <h1 className="text-2xl font-black text-[#24083b]">
                  {generatedResume.fullName.toUpperCase()}
                </h1>
                <p className="text-slate-600 font-semibold mt-1">
                  {generatedResume.contact} | {generatedResume.phone}
                </p>
              </div>

              <div className="space-y-3 text-slate-700 leading-relaxed">
                <p>
                  <strong>To:</strong> The Hiring Manager / Recruitment Team
                </p>
                <p>
                  <strong>RE: Application for {generatedResume.targetTitle} Position</strong>
                </p>
                <p>Dear Hiring Manager,</p>
                <p>
                  I am writing to formally express my strong interest in applying for the{' '}
                  {generatedResume.targetTitle} position. With my practical background in{' '}
                  {generatedResume.skillsRaw}, and holding qualifications in{' '}
                  {generatedResume.licenses}, I bring strong reliability, a commitment to Work Health &
                  Safety (WHS), and a dedicated work ethic to your team.
                </p>
                <p>
                  Throughout my practical employment history, I have developed strong team
                  communication, punctuality, and operational efficiency. I pride myself on maintaining
                  high standards, following supervisor instructions accurately, and adapting quickly to
                  new workplace procedures.
                </p>
                {generatedResume.gaps && (
                  <p>
                    During my recent career transition period ({generatedResume.gaps}), I maintained an
                    active focus on personal upskilling, community involvement, and expanding my practical
                    work readiness capabilities.
                  </p>
                )}
                <p>
                  I welcome the opportunity to discuss how my practical skills and tickets align with your
                  team's current goals. Thank you for your time and consideration.
                </p>
                <p>Sincerely,</p>
                <p>
                  <strong>{generatedResume.fullName}</strong>
                  <br />
                  {generatedResume.phone} | {generatedResume.contact}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default ResumeBuilder;
