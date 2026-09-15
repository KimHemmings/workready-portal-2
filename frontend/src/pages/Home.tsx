import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classroomBg from '../assets/classroom.png';

type PublicRole = 'case_manager' | 'candidate' | 'business_manager';

export default function Home() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<PublicRole>('case_manager');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Modal States
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const [isMfaOpen, setIsMfaOpen] = useState(false);
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [pendingTargetRoute, setPendingTargetRoute] = useState('');

  const [activePolicyModal, setActivePolicyModal] = useState<'terms' | 'privacy' | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');

    const lowerEmail = email.trim().toLowerCase();

    // 1. DIRECT BYPASS FOR SALES / ADMIN / DEMO (Executes BEFORE 2FA check)
    if (
      lowerEmail.includes('sales') || 
      lowerEmail.includes('demo') || 
      lowerEmail.includes('training') || 
      lowerEmail === 'sales@workready.com' || 
      lowerEmail === 'sales@straightuptraining.com'
    ) {
      navigate('/sales-demo');
      return;
    }

    if (
      lowerEmail.includes('admin') || 
      lowerEmail === 'admin@workready.com' || 
      lowerEmail === 'admin@straightuptraining.com'
    ) {
      navigate('/admin');
      return;
    }

    // 2. Standard Public Role Routing
    let target = '/';
    if (selectedRole === 'case_manager') target = '/case-manager/profile';
    if (selectedRole === 'candidate') target = '/candidate/workspace';
    if (selectedRole === 'business_manager') target = '/business/workspace';

    if (selectedRole === 'case_manager' || selectedRole === 'business_manager') {
      setPendingTargetRoute(target);
      setIsMfaOpen(true);
    } else {
      navigate(target);
    }
  };

  const handleSsoLogin = () => {
    let target = '/case-manager/profile';
    if (selectedRole === 'candidate') target = '/candidate/workspace';
    if (selectedRole === 'business_manager') target = '/business/workspace';
    navigate(target);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetMessage(`Password reset link sent to ${resetEmail}`);
    setTimeout(() => {
      setIsForgotOpen(false);
      setResetEmail('');
      setResetMessage('');
    }, 1800);
  };

  const handleMfaInput = (val: string, index: number) => {
    if (val.length > 1) return;
    const updated = [...mfaCode];
    updated[index] = val;
    setMfaCode(updated);

    if (updated.every(digit => digit !== '') && index === 5) {
      setTimeout(() => {
        setIsMfaOpen(false);
        navigate(pendingTargetRoute || '/');
      }, 300);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      backgroundColor: '#0f172a',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      overflowX: 'hidden'
    }}>
      {/* Background Classroom Image & Dark Navy Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.82) 42%, rgba(15, 23, 42, 0.35) 100%), url(${classroomBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        zIndex: 1
      }} />

      {/* Left-Aligned Login Panel */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 3rem',
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Header Branding - 110px LOGO & HIGH IMPACT TITLE */}
          <div style={{ backgroundColor: '#1e293b', padding: '2.5rem 1.75rem 2rem', textAlign: 'center', color: '#fff', borderBottom: '4px solid #16a34a' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <img 
                src="/logo.png" 
                alt="Straight Up Training Logo" 
                style={{ height: '110px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Workready <span style={{ color: '#16a34a' }}>Portal</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.35rem 0 0', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
              Straight Up Training
            </p>
          </div>

          {/* Welcoming Blurb */}
          <div style={{ padding: '1.25rem 1.75rem 0.5rem', textAlign: 'center', color: '#475569', fontSize: '0.875rem', lineHeight: '1.5' }}>
            Welcome to the Workready Portal! Empowering employment pathways through tailored training, real opportunity, and dedicated support. Please sign in to access your workspace.
          </div>

          {/* Form Container */}
          <form onSubmit={handleLogin} style={{ padding: '1.25rem 1.75rem 2rem' }}>
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
                  padding: '0.6rem 0.2rem',
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
                  padding: '0.6rem 0.2rem',
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
                  padding: '0.6rem 0.2rem',
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
                placeholder="sales@straightuptraining.com"
                required
                style={{ width: '100%', padding: '0.75rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password"
                  required
                  style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
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
                padding: '0.9rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                marginBottom: '0.85rem'
              }}
            >
              Sign In to {selectedRole === 'case_manager' ? 'Case Manager Portal' : selectedRole === 'candidate' ? 'Candidate Workspace' : 'Business Portal'}
            </button>

            {/* Microsoft / Provider SSO Option */}
            <button
              type="button"
              onClick={handleSsoLogin}
              style={{
                width: '100%',
                backgroundColor: '#f8fafc',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '0.65rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>❖</span> Sign in with Microsoft / Organization SSO
            </button>

            {/* Footer Links & Interactive Legal Modals */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.6' }}>
              <button
                type="button"
                onClick={() => setActivePolicyModal('terms')}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
              >
                Terms & Conditions
              </button>
              <span style={{ margin: '0 0.4rem' }}>•</span>
              <button
                type="button"
                onClick={() => setActivePolicyModal('privacy')}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
              >
                Privacy Policy
              </button>
              <div style={{ marginTop: '0.4rem', color: '#94a3b8' }}>
                © {new Date().getFullYear()} Straight Up Training. All rights reserved.
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* TERMS & PRIVACY POLICY MODALS */}
      {activePolicyModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '550px', width: '100%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
            {activePolicyModal === 'terms' ? (
              <div>
                <h3 style={{ margin: '0 0 1rem', color: '#0f172a' }}>📜 Terms & Conditions</h3>
                <div style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.6' }}>
                  <p>Welcome to the Workready Portal, managed by Straight Up Training. By accessing or using this system, you agree to comply with the following operational terms:</p>
                  <ul>
                    <li><strong>Authorized Access Only:</strong> Portals and workspaces are strictly restricted to registered Case Managers, Candidates, and Partner Organization Representatives.</li>
                    <li><strong>Data Integrity & Confidentiality:</strong> Users must handle participant and performance data in accordance with Australian Privacy Principles (APPs).</li>
                    <li><strong>Security Compliance:</strong> Shared or unverified credential usage is prohibited. Multi-factor authentication must be maintained for staff roles.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ margin: '0 0 1rem', color: '#0f172a' }}>🔒 Privacy Policy</h3>
                <div style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.6' }}>
                  <p>Straight Up Training is committed to protecting your personal information and privacy within the Workready Portal:</p>
                  <ul>
                    <li><strong>Information Collection:</strong> We collect relevant contact, training progress, and employment outcome data essential for program delivery and compliance tracking.</li>
                    <li><strong>Use of Data:</strong> Data is solely utilized to facilitate employment outcomes, audit logging, and authorized provider communication.</li>
                    <li><strong>Data Protection:</strong> All records are encrypted in transit and at rest in compliance with Commonwealth employment provider standards.</li>
                  </ul>
                </div>
              </div>
            )}
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setActivePolicyModal(null)}
                style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {isForgotOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.75rem', maxWidth: '380px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>🔑 Reset Account Password</h3>
            <p style={{ margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>Enter your email address and we'll send you a password reset authorization link.</p>
            
            {resetMessage && (
              <div style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                {resetMessage}
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit}>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@workready.com.au"
                required
                style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '1.25rem', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsForgotOpen(false)} style={{ backgroundColor: '#f1f5f9', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Send Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MFA 2-FACTOR VERIFICATION MODAL */}
      {isMfaOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔐</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>Two-Factor Verification</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4' }}>
              For staff security, enter the 6-digit verification code sent to your registered authenticator or email.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {mfaCode.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleMfaInput(e.target.value, idx)}
                  style={{
                    width: '42px',
                    height: '48px',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '2px solid #cbd5e1',
                    outline: 'none',
                    backgroundColor: '#f8fafc'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsMfaOpen(false)}
                style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.55rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMfaOpen(false);
                  navigate(pendingTargetRoute || '/');
                }}
                style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.55rem 1.2rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Verify & Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Trigger Vercel deploy: 2026-09-15 11:02:59
