import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import { ParticipantHome } from './pages/ParticipantHome';
import CoachParticipant from './pages/CoachParticipant';
import Home from './pages/Home';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import LegalPage from './pages/LegalPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Protected App Shell Layout */}
        <Route element={<AppShell />}>
          <Route path="/participant" element={<ParticipantHome />} />
          <Route path="/coach" element={<CoachParticipant />} />
          <Route path="/owner" element={<ParticipantHome />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
