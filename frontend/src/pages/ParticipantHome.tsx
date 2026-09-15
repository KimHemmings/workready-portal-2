import React, { useState } from 'react';
import LmsModuleHub from '../components/LmsModuleHub';
import { ResumeBuilder } from '../components/ResumeBuilder';
import { Briefcase, Award, LifeBuoy, Trophy, BookOpen } from 'lucide-react';

export const ParticipantHome: React.FC = () => {
  const [activeMilestone, setActiveMilestone] = useState<number>(1);
  const [pbasPoints, setPbasPoints] = useState<number>(35);
  const targetPoints = 100;

  // Banner Modal States
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const handleModuleCompleted = (moduleId: string, points: number) => {
    setPbasPoints((prev) => Math.min(prev + points, targetPoints));
  };

  const handleReportJob = (e: React.FormEvent) => {
    e.preventDefault();
    setPbasPoints((prev) => Math.min(prev + 50, targetPoints));
    setShowJobModal(false);
    alert("🎉 Job reported! +50 PBAS Points awarded.");
  };

  const handleReportInterview = (e: React.FormEvent) => {
    e.preventDefault();
    setPbasPoints((prev) => Math.min(prev + 25, targetPoints));
    setShowInterviewModal(false);
    alert("💼 Interview reported! +25 PBAS Points awarded.");
  };

  const handleRequestHelp = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHelpModal(false);
    alert("💬 High-priority support request sent to your Case Manager roster.");
  };

  const pbasPercentage = Math.min(Math.round((pbasPoints / targetPoints) * 100), 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Top Header Banner */}
      <header className="bg-[#24083b] text-white shadow-lg border-b border-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  Candidate Workspace
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1">
                Mutual Obligation Hub
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Complete modules, track compliance targets, and access AI career tools.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowJobModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#16a34a] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
              >
                <Briefcase className="w-4 h-4" /> Got a Job! 🎉 (+50 Pts)
              </button>
              <button
                onClick={() => setShowInterviewModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
              >
                <Award className="w-4 h-4" /> Got an Interview! 💼 (+25 Pts)
              </button>
              <button
                onClick={() => setShowHelpModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
              >
                <LifeBuoy className="w-4 h-4" /> Request Help 💬
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* 3-Milestone Navigation Cards */}
        <section aria-label="Milestone Navigation" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveMilestone(1)}
            className={`p-4 rounded-xl text-left border transition-all shadow-sm ${
              activeMilestone === 1
                ? 'bg-white border-[#24083b] ring-2 ring-[#24083b]/20 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                activeMilestone === 1 ? 'bg-[#24083b] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                Milestone 1
              </span>
              <BookOpen className={`w-4 h-4 ${activeMilestone === 1 ? 'text-[#24083b]' : 'text-slate-400'}`} />
            </div>
            <div className="text-sm font-bold text-slate-900 mt-2">Core Skills & Orientation</div>
            <div className="text-xs text-slate-500 mt-0.5">Non-Vocational LMS & Study Hub</div>
          </button>

          <button
            onClick={() => setActiveMilestone(2)}
            className={`p-4 rounded-xl text-left border transition-all shadow-sm ${
              activeMilestone === 2
                ? 'bg-white border-[#24083b] ring-2 ring-[#24083b]/20 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                activeMilestone === 2 ? 'bg-[#24083b] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                Milestone 2
              </span>
              <Award className={`w-4 h-4 ${activeMilestone === 2 ? 'text-[#24083b]' : 'text-slate-400'}`} />
            </div>
            <div className="text-sm font-bold text-slate-900 mt-2">Job Readiness & AI Tools</div>
            <div className="text-xs text-slate-500 mt-0.5">Resume & Cover Letter Builder</div>
          </button>

          <button
            onClick={() => setActiveMilestone(3)}
            className={`p-4 rounded-xl text-left border transition-all shadow-sm ${
              activeMilestone === 3
                ? 'bg-white border-[#24083b] ring-2 ring-[#24083b]/20 shadow-md'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                activeMilestone === 3 ? 'bg-[#24083b] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                Milestone 3
              </span>
              <Trophy className={`w-4 h-4 ${activeMilestone === 3 ? 'text-[#16a34a]' : 'text-slate-400'}`} />
            </div>
            <div className="text-sm font-bold text-slate-900 mt-2">Placement & PBAS Progress</div>
            <div className="text-xs font-semibold text-[#16a34a] mt-0.5">
              {pbasPoints} / {targetPoints} PBAS Points Logged
            </div>
          </button>
        </section>

        {/* Dynamic Milestone Content */}
        <div className="mt-4">
          {activeMilestone === 1 && (
            <div className="space-y-4">
              <LmsModuleHub onModuleCompleted={handleModuleCompleted} />
            </div>
          )}

          {activeMilestone === 2 && (
            <div className="space-y-4">
              <ResumeBuilder />
            </div>
          )}

          {activeMilestone === 3 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-[#24083b]">Active Monthly Compliance Target</h2>
                  <p className="text-xs text-slate-500">Workforce Australia PBAS Points Progress Tracker</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-[#16a34a] border border-emerald-200 font-bold text-xs rounded-full">
                  {pbasPercentage}% Target Achieved
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Progress: {pbasPoints} Points</span>
                  <span>Monthly Requirement: {targetPoints} Points</span>
                </div>
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="bg-[#16a34a] h-full rounded-full transition-all duration-500"
                    style={{ width: `${pbasPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Action Modals */}
      {showJobModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleReportJob} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Report New Employment 🎉</h3>
              <button type="button" onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <input required type="text" placeholder="Employer Name" className="w-full p-2.5 border rounded-lg text-xs" />
              <input required type="text" placeholder="Role Title" className="w-full p-2.5 border rounded-lg text-xs" />
              <input required type="date" className="w-full p-2.5 border rounded-lg text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowJobModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-[#16a34a] text-white font-bold rounded-lg shadow-sm">Submit (+50 Pts)</button>
            </div>
          </form>
        </div>
      )}

      {showInterviewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleReportInterview} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Report Upcoming Interview 💼</h3>
              <button type="button" onClick={() => setShowInterviewModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <input required type="text" placeholder="Employer Name" className="w-full p-2.5 border rounded-lg text-xs" />
              <input required type="text" placeholder="Position Title" className="w-full p-2.5 border rounded-lg text-xs" />
              <input required type="datetime-local" className="w-full p-2.5 border rounded-lg text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowInterviewModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-purple-600 text-white font-bold rounded-lg shadow-sm">Submit (+25 Pts)</button>
            </div>
          </form>
        </div>
      )}

      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRequestHelp} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Request Priority Coach Support 💬</h3>
              <button type="button" onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <textarea required rows={4} placeholder="Describe the assistance you need..." className="w-full p-2.5 border rounded-lg text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowHelpModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-amber-600 text-white font-bold rounded-lg shadow-sm">Send Priority Alert</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
