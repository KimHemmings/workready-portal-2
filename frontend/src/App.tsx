import React, { useState, useEffect } from 'react';
import ParticipantHome from './pages/ParticipantHome';
import CoachDashboard from './pages/CoachDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import { SalesDemoDashboard } from './pages/SalesDemoDashboard';
import SystemAdminDashboard from './pages/SystemAdminDashboard';
import Login from './pages/Login';
import { PortalProvider } from './context/PortalContext';

export type UserRole = 'candidate' | 'coach' | 'casey' | 'owner' | 'sales' | 'admin' | 'system_admin' | null;

export function App() {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('role') as UserRole) || null;
  });

  const [isImpersonating, setIsImpersonating] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('impersonate') === 'true' || localStorage.getItem('workready_is_impersonating') === 'true';
  });

  const isProspectMode = new URLSearchParams(window.location.search).get('mode') === 'prospect';

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const currentRole = (params.get('role') as UserRole) || null;
      const impersonating = params.get('impersonate') === 'true' || localStorage.getItem('workready_is_impersonating') === 'true';
      setUserRole(currentRole);
      setIsImpersonating(impersonating);
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Standard Login Handler (Regular Authentication)
  const handleLoginSuccess = (role: UserRole) => {
    localStorage.removeItem('workready_is_impersonating');
    setIsImpersonating(false);

    const url = new URL(window.location.href);
    if (role) {
      url.searchParams.set('role', role);
      url.searchParams.delete('impersonate');
    } else {
      url.searchParams.delete('role');
      url.searchParams.delete('impersonate');
    }
    window.history.pushState({}, '', url.toString());
    setUserRole(role);
  };

  // Admin Switch Handler (Jump View Mode)
  const changeRoleFromAdmin = (role: UserRole) => {
    const url = new URL(window.location.href);
    if (role === 'system_admin' || role === 'admin' || !role) {
      localStorage.removeItem('workready_is_impersonating');
      setIsImpersonating(false);
      url.searchParams.set('role', 'system_admin');
      url.searchParams.delete('impersonate');
    } else {
      localStorage.setItem('workready_is_impersonating', 'true');
      setIsImpersonating(true);
      url.searchParams.set('role', role);
      url.searchParams.set('impersonate', 'true');
    }
    window.history.pushState({}, '', url.toString());
    setUserRole(role);
  };

  // Direct prospect magic link entry defaults to sales demo view
  if (isProspectMode && (!userRole || userRole !== 'sales')) {
    setUserRole('sales');
  }

  if (!userRole && !isProspectMode) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <PortalProvider>
      <div className="min-h-screen bg-slate-50 relative">
        {/* JUMP VIEW RETURN BAR (ONLY SHOWN DURING ADMIN IMPERSONATION) */}
        {userRole && isImpersonating && userRole !== 'system_admin' && userRole !== 'admin' && !isProspectMode && (
          <div className="bg-purple-950 text-white px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-amber-400 z-50 sticky top-0 shadow-md">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Testing Live View: <strong className="text-amber-300 uppercase">{userRole}</strong></span>
            </div>
            <button
              onClick={() => changeRoleFromAdmin('system_admin')}
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