import React, { useState } from 'react';
import { CertifiedLmsModule } from '../components/CertifiedLmsModule';
import { StarInterviewSimulator } from '../components/StarInterviewSimulator';
import { ResumeBuilder } from '../components/ResumeBuilder';
import { AppointmentsWidget } from '../components/AppointmentsWidget';
import { BookOpen, Mic, FileText, Calendar, CheckCircle2, Award, UserCheck, ShieldCheck } from 'lucide-react';

export const ParticipantHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lms' | 'interview' | 'resume' | 'appointments'>('lms');

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      
      {/* Profile Header Banner */}
      <header className="bg-gradient-to-r from-[#24083b] via-[#320b52] to-[#24083b] text-white shadow-md border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo and Brand Title */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Straight Up Training Logo"
                className="h-10 w-auto object-contain bg-white/10 p-1.5 rounded-xl border border-white/20"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-white font-heading">
                    Straight Up Training
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    WorkReady Partner
                  </span>
                </div>
                <p className="text-xs text-purple-200">Candidate Portal • Powered by Workforce Australia PBAS</p>
              </div>
            </div>

            {/* Quick Reporting Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => alert("🎉 Congratulations! Details submitted to Casey for +50 PBAS points verification.")}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-sm transition-all"
              >
                🎉 I Got the Job! (+50 Pts)
              </button>
              <button
                onClick={() => alert("📅 Interview details logged for Casey's review (+25 Pts).")}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                📅 I Got an Interview! (+25 Pts)
              </button>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 py-2 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('lms')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'lms' ? 'bg-[#24083b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" /> LMS Module & Certificate
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'interview' ? 'bg-[#24083b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-4 h-4 text-purple-300" /> Interview Practice Studio
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'resume' ? 'bg-[#24083b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-purple-300" /> ATS Resume Studio
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'appointments' ? 'bg-[#24083b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-purple-300" /> Appointments & Schedule
            </button>
          </nav>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'lms' && <CertifiedLmsModule candidateName="Alex Johnson" moduleTitle="Warehouse WHS & Operational Safety" />}
        {activeTab === 'interview' && <StarInterviewSimulator />}
        {activeTab === 'resume' && <ResumeBuilder maxAttempts={3} />}
        {activeTab === 'appointments' && <AppointmentsWidget />}
      </main>

    </div>
  );
};

export default ParticipantHome;
