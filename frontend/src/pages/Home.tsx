import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'sales' | 'admin'>('sales');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    // Role-based routing after authentication check
    setError('');
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/sales-demo');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '12px', width: '380px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', color: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="Workready Logo" style={{ height: '50px', marginBottom: '1rem', objectFit: 'contain' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Workready Portal</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>Secure Portal Access</p>
        </div>

        {error && <div style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          {/* Role Selection */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', backgroundColor: '#0f172a', padding: '0.25rem', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => setRole('sales')}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', backgroundColor: role === 'sales' ? '#2563eb' : 'transparent', color: role === 'sales' ? '#fff' : '#94a3b8' }}
            >
              Sales Demo
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', backgroundColor: role === 'admin' ? '#2563eb' : 'transparent', color: role === 'admin' ? '#fff' : '#94a3b8' }}
            >
              System Admin
            </button>
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@workready.com.au"
              required
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          {/* Password Input with Eye Toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{ width: '100%', padding: '0.65rem 2.5rem 0.65rem 0.75rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#94a3b8' }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '???' : '??'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Sign In to {role === 'admin' ? 'Admin Portal' : 'Sales Demo'}
          </button>
        </form>
      </div>
    </div>
  );
}
