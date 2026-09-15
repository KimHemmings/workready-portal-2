import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { beginSession, homePathFor, User } from '../lib/session';
import { Shield, User as UserIcon, Award, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Primary Accounts with updated emails and credentials
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

  const handleQuickLogin = (roleKey: 'candidate' | 'casemanager' | 'businessmanager') => {
    const selectedUser = mockUsers[roleKey];
    beginSession(selectedUser);
    navigate(homePathFor(selectedUser.role));
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
      // Fallback for custom entries
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
        <p className="text-xs text-slate-500">Access your mutual obligation dashboard, training modules, & AI coach.</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          
          {/* Manual Form Login */}
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
                placeholder="password"
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Sign In to Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">Or Instant Demo Access</span></div>
          </div>

          {/* Instant Quick Login Shortcuts */}
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('candidate')}
              className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 text-[#16a34a] border border-emerald-200 rounded-xl text-left font-bold text-xs flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <div>
                  <div>Candidate / Learner</div>
                  <div className="text-[10px] font-normal text-emerald-800">alex@workready.com</div>
                </div>
              </div>
              <span>/participant →</span>
            </button>

            <button
              onClick={() => handleQuickLogin('casemanager')}
              className="w-full p-3 bg-purple-50 hover:bg-purple-100 text-[#24083b] border border-purple-200 rounded-xl text-left font-bold text-xs flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <div>
                  <div>Case Manager</div>
                  <div className="text-[10px] font-normal text-purple-800">casey@workready.com</div>
                </div>
              </div>
              <span>/coach →</span>
            </button>

            <button
              onClick={() => handleQuickLogin('businessmanager')}
              className="w-full p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-left font-bold text-xs flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <div>
                  <div>Business Manager / Admin</div>
                  <div className="text-[10px] font-normal text-slate-600">bessy@workready.com</div>
                </div>
              </div>
              <span>/owner →</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
