import React, { useState } from 'react';
import type { UserRole } from '../App';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (role: UserRole) => void;
}

// Authorized user accounts mapping (Email -> { Password, Role })
const AUTHORIZED_USERS: Record<string, { password: string; role: UserRole }> = {
  'alex@workready.com': { password: 'password', role: 'candidate' },
  'casey@workready.com': { password: 'password', role: 'coach' },
  'bessy@workready.com': { password: 'password', role: 'owner' },
  'training@straightuptraining.com': { password: 'Welcome01', role: 'sales' },
  'admin@straightuptraining.com': { password: 'WorkReadyAdmin2026!', role: 'admin' },
};

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigateToRole = (role: UserRole) => {
    const url = new URL(window.location.href);
    url.searchParams.set('role', role || 'candidate');
    window.history.pushState({}, '', url.toString());
    onLoginSuccess(role);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const userAccount = AUTHORIZED_USERS[cleanEmail];

    // Check if email exists and password matches
    if (userAccount && userAccount.password === password) {
      navigateToRole(userAccount.role);
    } else {
      setErrorMsg('Invalid email address or password. Please try again.');
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

        {/* Secure Form Body */}
        <form onSubmit={handleFormSubmit} className="p-8 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                placeholder="Enter your registered email"
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#24083b] hover:bg-[#320b52] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            Sign In to Dashboard <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;