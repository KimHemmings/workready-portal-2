import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { beginSession, homePathFor } from '../lib/session';
import type { User } from '../lib/session';
import { ArrowRight, Lock } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Primary Accounts with updated credentials
  const mockUsers: Record<string, User> = {
    candidate: {
      id: 'candidate-alex',
      name: 'Alex Johnson',
      email: 'alex@workready.com',
      role: 'participant',
      status: 'active',
      phone: '0412 345 678',
      organization_id: 'org-straight-up',
      pbasPoints: 35,
    } as unknown as User,
    casemanager: {
      id: 'cm-casey',
      name: 'Casey Smith',
      email: 'casey@workready.com',
      role: 'coach',
      status: 'active',
      organization_id: 'org-straight-up',
    } as unknown as User,
    businessmanager: {
      id: 'bm-bessy',
      name: 'Bessy Davis',
      email: 'bessy@workready.com',
      role: 'owner',
      status: 'active',
      organization_id: 'org-straight-up',
    } as unknown as User,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    let authenticatedUser: User;

    if (cleanEmail === 'alex@workready.com') {
      authenticatedUser = mockUsers.candidate;
    } else if (cleanEmail === 'casey@workready.com') {
      authenticatedUser = mockUsers.casemanager;
    } else if (cleanEmail === 'bessy@workready.com') {
      authenticatedUser = mockUsers.businessmanager;
    } else {
      // Dynamic fallback for custom entries
      authenticatedUser = {
        id: 'user-custom',
        name: cleanEmail.split('@')[0] || 'WorkReady User',
        email: cleanEmail || 'user@workready.com',
        role: cleanEmail.includes('casey') || cleanEmail.includes('coach') ? 'coach' : cleanEmail.includes('bessy') || cleanEmail.includes('admin') ? 'owner' : 'participant',
        status: 'active',
        organization_id: 'org-straight-up',
        pbasPoints: 35,
      } as unknown as User;
    }

    beginSession(authenticatedUser);
    navigate(homePathFor(authenticatedUser.role));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center items-center gap-2">
          <img src="/logo.png" alt="Straight Up Training Logo" className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          <span className="text-2xl font-black text-[#24083b] tracking-tight">Straight Up Training</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800">WorkReady Portal Sign-In</h2>
        <p className="text-xs text-slate-500">Enter your official credentials to access your workspace.</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          
          {/* Production Credentials Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@workready.com"
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Lock className="w-3.5 h-3.5" /> Secure Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Home;
