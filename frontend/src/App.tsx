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

  const isProspectMode = new URLSearchParams(window.location.search).get('mode') === 'prospect';

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

  // Direct prospect magic link entry defaults to sales demo view
  if (isProspectMode && (!userRole || userRole !== 'sales')) {
    setUserRole('sales');
  }

  if (!userRole && !isProspectMode) {
    return <Login onLoginSuccess={changeRole} />;
  }

  return (
    <PortalProvider>
      <div className="min-h-screen bg-slate-50 relative">
        {/* JUMP VIEW RETURN BAR */}
        {userRole && userRole !== 'system_admin' && userRole !== 'admin' && !isProspectMode && (
          <div className="bg-purple-950 text-white px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-amber-400 z-50 sticky top-0 shadow-md">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Testing Live View: <strong className="text-amber-300 uppercase">{userRole}</strong></span>
            </div>
            <button
              onClick={() => changeRole('system_admin')}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-[11px] rounded-lg transition-all shadow-sm cursor-pointer"
            >
              ← Return to System Admin Console
            </button>
          </div>
        )}

        {/* MAIN ROUTE RENDERING */}
        {userRole === 'candidate' && <ParticipantHome />}
        {(userRole === 'coach' || userRole === 'casey') && <CoachDashboard />}
        {userRole === 'owner' && <OwnerDashboard />}
        {userRole === 'sales' && <SalesDemoDashboard />}
        {(userRole === 'admin' || userRole === 'system_admin') && <SystemAdminDashboard />}
      </div>
    </PortalProvider>
  );
}

export default App;