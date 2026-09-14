import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SalesDemoDashboard from './pages/SalesDemoDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES - Bypass Auth Guards */}
        <Route path="/sales-demo" element={<SalesDemoDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback route to Sales Demo dashboard */}
        <Route path="*" element={<Navigate to="/sales-demo" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
