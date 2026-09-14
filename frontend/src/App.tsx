import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SalesDemoDashboard from './pages/SalesDemoDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sales-demo" element={<SalesDemoDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
