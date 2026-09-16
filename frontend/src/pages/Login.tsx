import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, X, FileText, Shield, Users, LockKeyhole, KeyRound, CheckCircle2 } from 'lucide-react';
import heroBgImg from '../assets/classroom.png';

interface LoginProps {
  onLoginSuccess?: (role: any) => void;
}

const AUTHORIZED_USERS: Record<string, { pass: string; role: string }> = {
  'alex@workready.com': { pass: 'password', role: 'candidate' },
  'casey@workready.com': { pass: 'password', role: 'coach' },
  'bessy@workready.com': { pass: 'password', role: 'owner' },
  'training@straightuptraining.com': { pass: 'Welcome01', role: 'sales' },
  'admin@straightuptraining.com': { pass: 'WorkReadyAdmin2026!', role: 'admin' },
};

const LOGO_PATHS = [
  '/White_Background_PNG.png',
  '/logo.png',
  '/assets/logo.png',
];

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoIndex, setLogoIndex] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'reset' | null>(null);

  // Self-Service Reset State
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = AUTHORIZED_USERS[cleanEmail];

    if (user && user.pass === cleanPassword) {
      if (onLoginSuccess) {
        onLoginSuccess(user.role);
      }

      const url = new URL(window.location.href);
      url.searchParams.set('role', user.role);
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new Event('popstate'));
    } else {
      setError('Invalid email or password. Please check your credentials and try again.');
    }
  };

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    const cleanResetEmail = resetEmail.trim().toLowerCase();
    if (!cleanResetEmail) {
      setResetError('Please enter a valid email address.');
      return;
    }

    setResetStep(2);
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please re-enter.');
      return;
    }

    const cleanResetEmail = resetEmail.trim().toLowerCase();

    if (AUTHORIZED_USERS[cleanResetEmail]) {
      AUTHORIZED_USERS[cleanResetEmail].pass = newPassword;
    }

    setResetSuccess(true);
    setTimeout(() => {
      setEmail(cleanResetEmail);
      setPassword(newPassword);
      setModalType(null);
      setResetStep(1);
      setResetSuccess(false);
      setResetEmail('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1800);
  };

  const handleLogoError = () => {
    if (logoIndex < LOGO_PATHS.length - 1) {
      setLogoIndex((prev) => prev + 1);
    } else {
      setLogoFailed(true);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between items-center relative overflow-hidden selection:bg-orange-500 selection:text-white">
      
      {/* 1. Classroom Background Photo */}
      <img
        src={heroBgImg}
        alt="Straight Up Training Classroom Background"
        className="absolute inset-0 w-full h-full object-cover object-top filter brightness-95 contrast-105"
      />

      {/* 2. Lightened Purple Overlay (0.50 Opacity) */}
      <div 
        className="absolute inset-0 backdrop-blur-[1px]"
        style={{ backgroundColor: 'rgba(38, 21, 56, 0.50)' }}
      />

      {/* 3. Soft Ambient Color Glows */}
      <div 
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-40"
        style={{ backgroundColor: '#4a156b' }}
      />

      {/* Top Spacer: Leaves upper screen completely open for classroom wall signage */}
      <div className="w-full flex-1" />

      {/* 4. Taller Bottom Banner Container (~48% Screen Height) */}
      <div className="w-full z-10 relative">
        
        {/* Brand Multi-Color Gradient Top Border Line */}
        <div 
          className="w-full h-[3px] absolute top-0 left-0 right-0 z-20 shadow-sm"
          style={{
            background: 'linear-gradient(to right, #10b981, #a855f7, #1e1b4b, #ffffff, #f97316)'
          }}
        />

        <main 
          className="w-full min-h-[48vh] backdrop-blur-xl border-t border-white/10 shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between"
          style={{ backgroundColor: 'rgba(20, 7, 32, 0.95)' }}
        >
          {/* Upper Banner Section: Logo, Blurb & Form Bar */}
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-8 my-auto py-2">
            
            {/* Left Branding Block */}
            <div className="w-full lg:w-5/12 flex flex-col sm:flex-row items-start sm:items-center lg:items-start gap-5 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
              <div className="shrink-0">
                {!logoFailed ? (
                  <div className="bg-white p-3 rounded-2xl shadow-md border border-white/20">
                    <img
                      src={LOGO_PATHS[logoIndex]}
                      alt="Straight Up Training Logo"
                      className="h-14 w-auto max-w-[170px] object-contain block"
                      onError={handleLogoError}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-white px-3.5 py-2.5 rounded-2xl shadow-md">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-orange-400 to-purple-500 flex items-center justify-center font-bold text-base text-white">
                      SU
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight text-slate-900 leading-none uppercase">
                        Straight Up
                      </span>
                      <span className="text-[8px] uppercase font-bold tracking-widest text-slate-600 mt-0.5">
                        Training
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  Empowering Skills &amp; Growth Across Australia
                </h2>
                <p className="text-xs sm:text-sm text-purple-200 mt-1.5 leading-relaxed">
                  Connecting individuals, coaches, and organization leaders with real-time workforce development and skills tracking.
                </p>
                
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-purple-100">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    <Users className="w-3.5 h-3.5" />
                    <span>Participant &amp; Coach Portal</span>
                  </span>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <LockKeyhole className="w-3.5 h-3.5" />
                    <span>Enterprise Data Security</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Horizontal Sign-In Inputs */}
            <div className="w-full lg:w-7/12">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center space-x-2 text-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3.5">
                
                {/* Email Field */}
                <div className="flex-1 min-w-[210px]">
                  <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@workready.com"
                      required
                      autoComplete="email"
                      className="w-full bg-black/40 border border-white/20 focus:border-orange-400 focus:bg-black/60 focus:ring-2 focus:ring-orange-400/20 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-purple-300/60 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex-1 min-w-[190px]">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setModalType('reset');
                        setResetStep(1);
                        setResetError(null);
                        setResetSuccess(false);
                      }}
                      className="text-[11px] text-orange-400 hover:text-orange-300 hover:underline transition-colors font-medium"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full bg-black/40 border border-white/20 focus:border-orange-400 focus:bg-black/60 focus:ring-2 focus:ring-orange-400/20 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-purple-300/60 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Access Button */}
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 text-sm shrink-0 h-[44px]"
                >
                  <span>Access Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Integrated Inner Footer Section */}
          <div className="max-w-7xl mx-auto w-full pt-4 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300/90 gap-2">
            <div>
              © {new Date().getFullYear()} Straight Up Training. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <button 
                type="button" 
                onClick={() => setModalType('privacy')}
                className="hover:text-emerald-400 underline underline-offset-4 transition-colors font-medium"
              >
                Privacy Policy
              </button>
              <span className="text-purple-400/40">•</span>
              <button 
                type="button" 
                onClick={() => setModalType('terms')}
                className="hover:text-emerald-400 underline underline-offset-4 transition-colors font-medium"
              >
                Terms &amp; Conditions
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Australian Compliance & Self-Service Password Reset Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#1e0c2e] border border-white/15 rounded-3xl w-full max-w-lg flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {modalType === 'privacy' && <Shield className="w-5 h-5 text-emerald-400" />}
                {modalType === 'terms' && <FileText className="w-5 h-5 text-emerald-400" />}
                {modalType === 'reset' && <KeyRound className="w-5 h-5 text-orange-400" />}
                <h3 className="font-bold text-lg text-white">
                  {modalType === 'privacy' && 'Privacy Policy (Australia)'}
                  {modalType === 'terms' && 'Terms & Conditions'}
                  {modalType === 'reset' && 'Self-Service Password Reset'}
                </h3>
              </div>
              <button 
                onClick={() => setModalType(null)}
                className="p-1.5 text-purple-300 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-purple-100 leading-relaxed">
              {modalType === 'privacy' && (
                <>
                  <p className="font-semibold text-white">Last updated: January 2026</p>
                  <p>
                    Straight Up Training (&quot;Straight Up Training&quot;) is committed to protecting your personal information in accordance with the Australian Privacy Principles (APPs) contained in the <em>Privacy Act 1988 (Cth)</em>.
                  </p>
                  <h4 className="font-semibold text-white pt-2">1. Collection of Information</h4>
                  <p>
                    We collect personal and professional information necessary to deliver workforce readiness, candidate tracking, and case management services across Australia.
                  </p>
                  <h4 className="font-semibold text-white pt-2">2. Data Security</h4>
                  <p>
                    All data is encrypted in transit and at rest using industry-standard protocols compliant with Australian cyber security standards.
                  </p>
                </>
              )}

              {modalType === 'terms' && (
                <>
                  <p className="font-semibold text-white">Last updated: January 2026</p>
                  <p>
                    By accessing or using the portal across Australia, you agree to comply with and be bound by these Terms and Conditions provided by Straight Up Training.
                  </p>
                  <h4 className="font-semibold text-white pt-2">1. Authorized Access Only</h4>
                  <p>
                    Access to this portal is restricted solely to authorized candidates, case managers, business owners, sales staff, and system administrators.
                  </p>
                </>
              )}

              {/* Self-Service Reset Form */}
              {modalType === 'reset' && (
                <div>
                  {resetSuccess ? (
                    <div className="py-4 text-center space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                      <h4 className="text-base font-bold text-white">Password Updated!</h4>
                      <p className="text-xs text-purple-200">
                        Your password has been successfully reset. Logging you in now...
                      </p>
                    </div>
                  ) : (
                    <>
                      {resetError && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center space-x-2 text-red-200 text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{resetError}</span>
                        </div>
                      )}

                      {resetStep === 1 ? (
                        <form onSubmit={handleResetRequest} className="space-y-4">
                          <p className="text-xs text-purple-200 leading-relaxed">
                            Enter your registered account email address. If an authorized account exists, you will be able to update your credentials immediately.
                          </p>
                          <div>
                            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1.5">
                              Registered Email
                            </label>
                            <input
                              type="email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              placeholder="name@workready.com"
                              required
                              className="w-full bg-black/40 border border-white/20 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-purple-300/60 outline-none transition-all"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-all text-sm"
                          >
                            Verify Identity &amp; Continue
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                          <p className="text-xs text-purple-200 leading-relaxed">
                            Set a new secure password for <strong>{resetEmail}</strong>:
                          </p>
                          <div>
                            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Minimum 8 characters"
                              required
                              className="w-full bg-black/40 border border-white/20 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 rounded-xl py-2 px-3.5 text-sm text-white placeholder-purple-300/60 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Re-enter new password"
                              required
                              className="w-full bg-black/40 border border-white/20 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 rounded-xl py-2 px-3.5 text-sm text-white placeholder-purple-300/60 outline-none transition-all"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-all text-sm"
                          >
                            Save New Password &amp; Sign In
                          </button>
                        </form>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;