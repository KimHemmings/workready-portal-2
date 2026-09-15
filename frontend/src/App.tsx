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

  if (!userRole) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div>
      {/* Role-based Dashboard Router */}
      {userRole === 'candidate' && <ParticipantHome />}
      {userRole === 'coach' && <CoachDashboard />}
      {userRole === 'owner' && <OwnerDashboard />}
      {userRole === 'sales' && <SalesDemoDashboard />}
      {userRole === 'admin' && <AdminDashboard />}
    </div>
  );
}

export default App;