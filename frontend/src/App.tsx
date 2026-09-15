import React, { useState } from 'react';
import ParticipantHome from './pages/ParticipantHome';
import CoachDashboard from './pages/CoachDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import SalesDemoDashboard from './pages/SalesDemoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

export type UserRole = 'candidate' | 'coach' | 'owner' | 'sales' | 'admin' | null;

export function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleSignOut = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Universal Global Header with Role Switcher & Sign Out */}
      <div className="bg-slate-950 text-white px-4 py-2 border-b border-purple-900/50 flex flex-wrap items-center justify-between text-xs sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-400">ACTIVE DASHBOARD:</span>
          <span className="font-mono bg-purple-900/80 px-2 py-0.5 rounded text-purple-200 uppercase font-bold border border-purple-700">
            {userRole}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setUserRole('candidate')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${userRole === 'candidate' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Candidate
          </button>
          <button
            onClick={() => setUserRole('coach')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${userRole === 'coach' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Case Manager
          </button>
          <button
            onClick={() => setUserRole('owner')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${userRole === 'owner' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Business Manager
          </button>
          <button
            onClick={() => setUserRole('sales')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${userRole === 'sales' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Sales & Training
          </button>
          <button
            onClick={() => setUserRole('admin')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${userRole === 'admin' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            System Admin
          </button>
          
          <button
            onClick={handleSignOut}
            className="ml-2 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 rounded-lg font-bold transition-all"
          >
            Exit / Sign Out
          </button>
        </div>
      </div>

      {/* Dynamic View Router */}
      {userRole === 'candidate' && <ParticipantHome />}
      {userRole === 'coach' && <CoachDashboard />}
      {userRole === 'owner' && <OwnerDashboard />}
      {userRole === 'sales' && <SalesDemoDashboard />}
      {userRole === 'admin' && <AdminDashboard />}
    </div>
  );
}

export default App;