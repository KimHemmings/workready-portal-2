import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SalesDemoDashboard from './pages/SalesDemoDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/sales-demo" element={<SalesDemoDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/sales-demo" replace />} />
    </Routes>
  );
}
