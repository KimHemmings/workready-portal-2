import React, { useState } from 'react';
import { CertifiedLmsModule } from '../components/CertifiedLmsModule';
import { StarInterviewSimulator } from '../components/StarInterviewSimulator';
import { ResumeBuilder } from '../components/ResumeBuilder';
import { AppointmentsWidget } from '../components/AppointmentsWidget';
import { 
  BookOpen, Mic, FileText, Calendar, CheckCircle2, Award, 
  UserCheck, ShieldCheck, Upload, Briefcase, ChevronRight, Sparkles 
} from 'lucide-react';

export const ParticipantHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lms' | 'interview' | 'resume' | 'appointments'>('overview');
  const [candidateName] = useState('Alex Johnson');
  const [pbasPoints] = useState(65);
  const [targetPoints] = useState(100);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-12">
      
      {/* Top Header Banner */}
      <header className="bg-gradient-to-r from-[#24083b] via-[#320b52] to-[#24083b] text-white shadow-md border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo & Brand Title */}
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

            {/* Header Quick Action Buttons */}
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

      {/* Main Tab Bar */}
      <div className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 py-2 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'overview' ? 'bg-[#24083b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Candidate Profile & PBAS Wheel
            </button>

            <button
              onClick={() => setActiveTab('lms')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'lms' ? 'bg-[#24083b] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" /> LMS Training & Certificate
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* OVERVIEW TAB: Full Candidate Dashboard Layout */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: PBAS Progress Wheel & Status */}
            <div className="space-y-6">
              
              {/* PBAS Progress Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-4">
                <h3 className="font-bold text-[#24083b] text-sm flex items-center justify-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" /> Monthly PBAS Point Target
                </h3>

                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500 stroke-current"
                      strokeWidth="3.8"
                      strokeDasharray={`${pbasPoints}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-[#24083b]">{pbasPoints}</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">/ {targetPoints} Pts</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                  On Track • 35 Points Remaining This Month
                </div>
              </div>

              {/* Case Manager Contact Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 text-[#24083b] rounded-xl border border-purple-200 font-bold text-xs">
                    CS
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Casey Smith</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">Assigned Case Manager</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#24083b] font-bold text-xs rounded-xl border border-slate-200"
                >
                  Schedule Appointment
                </button>
              </div>

            </div>

            {/* Right Column (2 Spans): Active Modules & Document Locker */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Quick Jump Modules */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-[#24083b] text-sm">Active Training & Employability Tools</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  <div 
                    onClick={() => setActiveTab('lms')}
                    className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 bg-slate-50/50 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex justify-between items-center font-bold text-[#24083b]">
                      <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-emerald-600" /> Warehouse WHS Module</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-[11px]">15 Points reviewed. Take 8-question quiz & earn certificate.</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('resume')}
                    className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 bg-slate-50/50 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex justify-between items-center font-bold text-[#24083b]">
                      <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-purple-700" /> ATS Resume & Gap AI</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-[11px]">Up to 6 work positions, Gap AI Helper & Cover Letter Generator.</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('interview')}
                    className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 bg-slate-50/50 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex justify-between items-center font-bold text-[#24083b]">
                      <span className="flex items-center gap-1.5"><Mic className="w-4 h-4 text-purple-700" /> 8-Question Interview Practice</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-[11px]">Practice STAR responses with voice dictation & feedback.</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('appointments')}
                    className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 bg-slate-50/50 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex justify-between items-center font-bold text-[#24083b]">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-purple-700" /> Upcoming Check-Ins</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-[11px]">Virtual, Phone, and In-Person schedule management.</p>
                  </div>

                </div>
              </div>

              {/* Document Locker */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-[#24083b] text-sm flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-purple-700" /> Document Locker & Certificates
                  </h3>
                  <button onClick={() => alert("📄 Upload new evidence document")} className="px-3 py-1 bg-[#24083b] text-white font-bold rounded-lg text-[11px]">
                    Upload Document
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-800">Warehouse WHS Certificate (Landscape)</div>
                      <div className="text-[10px] text-slate-400">Verified by Straight Up Training</div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('lms')} className="text-purple-700 font-bold hover:underline">
                    View
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB WORKSPACES */}
        {activeTab === 'lms' && <CertifiedLmsModule candidateName={candidateName} moduleTitle="Warehouse WHS & Operational Safety" />}
        {activeTab === 'interview' && <StarInterviewSimulator />}
        {activeTab === 'resume' && <ResumeBuilder maxAttempts={3} />}
        {activeTab === 'appointments' && <AppointmentsWidget />}

      </main>

    </div>
  );
};

export default ParticipantHome;
