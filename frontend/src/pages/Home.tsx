import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <img src="/logo.png" alt="Workready Logo" style={{ height: '60px', marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Workready Portal</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Employment Services & Sales Demo Management</p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => navigate('/sales-demo')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
          Enter Sales Demo
        </button>
        <button onClick={() => navigate('/admin')} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
          Admin Dashboard
        </button>
      </div>
    </div>
  );
}
