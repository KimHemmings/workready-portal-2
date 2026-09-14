import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type PublicRole = 'case_manager' | 'candidate' | 'business_manager';

export default function Home() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<PublicRole>('case_manager');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [secretCounter, setSecretCounter] = useState(0);

  // Hidden backdoor trigger: double-clicking logo 3 times unlocks Demo/Admin links
  const handleLogoClick = () => {
    const newCount = secretCounter + 1;
    setSecretCounter(newCount);
    if (newCount >= 3) {
      const target = window.prompt("Secret Navigation Unlocked:\nType 'admin' for System Admin or 'demo' for Sales Demo:");
      if (target?.toLowerCase() === 'admin') navigate('/admin');
      if (target?.toLowerCase() === 'demo') navigate('/sales-demo');
      setSecretCounter(0);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');

    // Hidden credential checks
    if (email === 'admin@workready.com' || email === 'admin@straightuptraining.com') {
      navigate('/admin');
      return;
    }
    if (email === 'sales@workready.com' || email === 'demo@workready.com') {
      navigate('/sales-demo');
      return;
    }

    // Role-based secure routing
    switch (selectedRole) {
      case 'case_manager':
        navigate('/case-manager/profile');
        break;
      case 'candidate':
        navigate('/candidate/workspace');
        break;
      case 'business_manager':
        navigate('/business/workspace');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.88)), url('/background.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        {/* Header Branding */}
        <div style={{ backgroundColor: '#1e293b', padding: '2rem 1.5rem', textAlign: 'center', color: '#fff' }}>
          <img 
            src="/logo.png" 
            alt="Straight Up Training Logo" 
            onClick={handleLogoClick}
            style={{ height: '55px', cursor: 'pointer', marginBottom: '0.75rem', objectFit: 'contain' }}
            title="Straight Up Training"
          />
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>Workready Portal</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.2rem 0 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Straight Up Training
          </p>
        </div>

        {/* Welcoming Blurb */}
        <div style={{ padding: '1.25rem 1.75rem 0.5rem', textAlign: 'center', color: '#475569', fontSize: '0.875rem', lineHeight: '1.5' }}>
          Welcome to the Workready Portal! Empowering employment pathways through tailored training, real opportunity, and dedicated support. Please sign in to access your workspace.
        </div>

        {/* Form Container */}
        <form onSubmit={handleLogin} style={{ padding: '1.5rem 1.75rem 2rem' }}>
          {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {/* Role Selection Tabs */}
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Select Workspace Role
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginBottom: '1.25rem', backgroundColor: '#f1f5f9', padding: '0.3rem', borderRadius: '10px' }}>
            <button
              type="button"
              onClick={() => setSelectedRole('case_manager')}
              style={{
                padding: '0.55rem 0.2rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRole === 'case_manager' ? '#16a34a' : 'transparent',
                color: selectedRole === 'case_manager' ? '#fff' : '#475569',
                transition: 'all 0.2s ease'
              }}
            >
              Case Manager
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('candidate')}
              style={{
                padding: '0.55rem 0.2rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRole === 'candidate' ? '#16a34a' : 'transparent',
                color: selectedRole === 'candidate' ? '#fff' : '#475569',
                transition: 'all 0.2s ease'
              }}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('business_manager')}
              style={{
                padding: '0.55rem 0.2rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRole === 'business_manager' ? '#16a34a' : 'transparent',
                color: selectedRole === 'business_manager' ? '#fff' : '#475569',
                transition: 'all 0.2s ease'
              }}
            >
              Business Mgr
            </button>
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', fontWeight: 600, marginBottom: '0.4rem' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@workready.com.au"
              required
              style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          {/* Password Input with Eye Toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', fontWeight: 600, marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                required
                style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#64748b' }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#16a34a',
              color: '#fff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
              transition: 'background-color 0.2s ease'
            }}
          >
            Sign In to {selectedRole === 'case_manager' ? 'Case Manager Portal' : selectedRole === 'candidate' ? 'Candidate Workspace' : 'Business Portal'}
          </button>

          {/* Footer Links & Copyright */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.6' }}>
            <a href="#terms" style={{ color: '#64748b', textDecoration: 'none', margin: '0 0.4rem' }}>Terms & Conditions</a>
            •
            <a href="#privacy" style={{ color: '#64748b', textDecoration: 'none', margin: '0 0.4rem' }}>Privacy Policy</a>
            <div style={{ marginTop: '0.4rem', color: '#cbd5e1' }}>
              © {new Date().getFullYear()} Straight Up Training. All rights reserved.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
