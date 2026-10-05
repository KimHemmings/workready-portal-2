import React, { useState, useEffect } from 'react';
import ParticipantHome from './pages/ParticipantHome';
import CoachDashboard from './pages/CoachDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import { SalesDemoDashboard } from './pages/SalesDemoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SystemAdminDashboard from './pages/SystemAdminDashboard';
import Login from './pages/Login';
import { PortalProvider } from './context/PortalContext';

export type UserRole = 'candidate' | 'coach' | 'casey' | 'owner' | 'sales' | 'admin' | 'system_admin' | null;

export function App() {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('role') as UserRole) || null;
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const currentRole = (params.get('role') as UserRole) || null;
      setUserRole(currentRole);
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const changeRole = (role: UserRole) => {
    const url = new URL(window.location.href);
    if (role) {
      url.searchParams.set('role', role);
    } else {
      url.searchParams.delete('role');
    }
    window.history.pushState({}, '', url.toString());
    setUserRole(role);
  };

  if (!userRole) {
    return <Login onLoginSuccess={changeRole} />;
  }

  return (
    <PortalProvider>
      <div className="min-h-screen bg-slate-50 relative pb-16">
        {/* DEMO PROFILE SWITCHER TOOLBAR */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2 rounded-full shadow-2xl border border-slate-700 flex items-center space-x-2 text-xs font-bold backdrop-blur-md">
          <span className="text-slate-400 mr-1">Switch View:</span>
          
          <button
            onClick={() => changeRole('sales')}
            className={`px-3 py-1 rounded-full transition-all ${
              userRole === 'sales' ? 'bg-purple-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Sales Demo View
          </button>

          <button
            onClick={() => changeRole('owner')}
            className={`px-3 py-1 rounded-full transition-all ${
              userRole === 'owner' ? 'bg-amber-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Business Manager
          </button>

          <button
            onClick={() => changeRole('coach')}
            className={`px-3 py-1 rounded-full transition-all ${
              userRole === 'coach' || userRole === 'casey' ? 'bg-purple-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Coach Portal
          </button>

          <button
            onClick={() => changeRole('candidate')}
            className={`px-3 py-1 rounded-full transition-all ${
              userRole === 'candidate' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Candidate Portal
          </button>

          <button
            onClick={() => changeRole(null)}
            className="px-2 py-1 text-slate-400 hover:text-red-400 transition-colors ml-2"
            title="Sign Out to Login Screen"
          >
            ✕ Exit
          </button>
        </div>

        {/* MAIN ROUTE RENDERING */}
        {userRole === 'candidate' && <ParticipantHome />}
        {(userRole === 'coach' || userRole === 'casey') && <CoachDashboard />}
        {userRole === 'owner' && <OwnerDashboard />}
        {userRole === 'sales' && <SalesDemoDashboard />}
        {userRole === 'admin' && <AdminDashboard />}
        {userRole === 'system_admin' && <SystemAdminDashboard />}
      </div>
    </PortalProvider>
  );
}

export default App;