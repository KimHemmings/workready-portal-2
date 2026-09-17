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
      <div className="min-h-screen bg-slate-50">
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
