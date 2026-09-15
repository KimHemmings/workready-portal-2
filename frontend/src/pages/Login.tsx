import React, { useState } from 'react';
import type { UserRole } from '../App';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'case@workready.com') {
      onLoginSuccess('coach');
    } else if (cleanEmail === 'bessy@workready.com') {
      onLoginSuccess('owner');
    } else if (cleanEmail === 'training@straightuptraining.com') {
      onLoginSuccess('sales');
    } else if (cleanEmail === 'admin@straightuptraining.com') {
      onLoginSuccess('admin');
    } else {
      // Default fallback for candidate logins
      onLoginSuccess('candidate');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#24083b] via-[#320b52] to-[#1a052c] flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-800/30">
        
        {/* Brand Header */}
        <div className="bg-purple-950 p-8 text-center text-white border-b border-purple-800/50 relative">
          <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight font-heading">Straight Up Training</h1>
          <p className="text-xs text-purple-200 mt-1">WorkReady Partner Portal Access</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. case@workready.com"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#24083b] hover:bg-[#320b52] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            Sign In to Dashboard <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </form>

        {/* Quick Role Shortcuts */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <KeyRound className="w-3.5 h-3.5 text-purple-700" /> Quick Demo Testing Shortcuts:
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => onLoginSuccess('candidate')}
              className="p-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 font-bold rounded-xl text-left transition-all"
            >
              👤 Candidate View
            </button>
            <button
              onClick={() => onLoginSuccess('coach')}
              className="p-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-800 font-bold rounded-xl text-left transition-all"
            >
              📋 Case Manager (Casey)
            </button>
            <button
              onClick={() => onLoginSuccess('owner')}
              className="p-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-800 font-bold rounded-xl text-left transition-all"
            >
              🏢 Business Manager (Bessy)
            </button>
            <button
              onClick={() => onLoginSuccess('sales')}
              className="p-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-800 font-bold rounded-xl text-left transition-all"
            >
              💼 Sales & Training View
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;