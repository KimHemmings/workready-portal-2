import React, { useState } from 'react';
import { 
  ShieldAlert, Building2, Users, Cpu, Server, Key, Sliders, LogOut, 
  PlusCircle, Download, CheckCircle2, AlertTriangle, RefreshCw, X, Search, Sparkles
} from 'lucide-react';

interface PartnerTenant {
  id: string;
  name: string;
  code: string;
  plan: 'Enterprise' | 'Partner Growth' | 'Standard';
  activeCandidates: number;
  maxSeats: number;
  status: 'Active' | 'Suspended' | 'Provisioning';
  joinedDate: string;
}

export function SystemAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'tenants' | 'flags' | 'security'>('telemetry');
  
  // Multi-Tenant Partner State
  const [tenants, setTenants] = useState<PartnerTenant[]>([
    { id: '1', name: 'Straight Up Training', code: 'SUT-AU', plan: 'Enterprise', activeCandidates: 150, maxSeats: 500, status: 'Active', joinedDate: '2025-11-12' },
    { id: '2', name: 'Apex Workforce Australia', code: 'APX-WA', plan: 'Partner Growth', activeCandidates: 85, maxSeats: 250, status: 'Active', joinedDate: '2026-02-04' },
    { id: '3', name: 'National Employment Network', code: 'NEN-VIC', plan: 'Standard', activeCandidates: 40, maxSeats: 100, status: 'Provisioning', joinedDate: '2026-08-19' }
  ]);

  // Global Feature Flags
  const [featureFlags, setFeatureFlags] = useState({
    aiStarCoaching: true,
    dewrAutoCsvExport: true,
    realtimeDrawerChat: true,
    coverageModeReassignment: true,
    betaAnalyticsEngine: false
  });

  // Modal State
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantCode, setNewTenantCode] = useState('');
  const [newTenantPlan, setNewTenantPlan] = useState<'Enterprise' | 'Partner Growth' | 'Standard'>('Enterprise');
  const [newTenantSeats, setNewTenantSeats] = useState<number>(250);

  const handleSignOut = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  const toggleFeatureFlag = (key: keyof typeof featureFlags) => {
    setFeatureFlags(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim() || !newTenantCode.trim()) return;

    const newTenant: PartnerTenant = {
      id: Date.now().toString(),
      name: newTenantName.trim(),
      code: newTenantCode.trim().toUpperCase(),
      plan: newTenantPlan,
      activeCandidates: 0,
      maxSeats: newTenantSeats,
      status: 'Active',
      joinedDate: new Date().toISOString().slice(0, 10)
    };

    setTenants(prev => [...prev, newTenant]);
    setNewTenantName('');
    setNewTenantCode('');
    setShowAddTenantModal(false);
  };

  // Metrics
  const totalTenants = tenants.length;
  const totalGlobalCandidates = tenants.reduce((acc, t) => acc + t.activeCandidates, 0);
  const totalSeatsAllocated = tenants.reduce((acc, t) => acc + t.maxSeats, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* SYSTEM ADMIN HEADER */}
      <header className="bg-slate-950 px-6 py-4 border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-purple-600 rounded-xl p-2 flex items-center justify-center shadow-lg shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white">WorkReady Core Engine</h1>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Root Admin (Tier-0)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Global Platform Governance • Tenant Management • System Infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddTenantModal(true)}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Provision Partner Tenant</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* NAV & TAB CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Root Console Overview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-tenant architecture & feature entitlement matrix
            </p>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold space-x-1">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'telemetry'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Telemetry & Health</span>
            </button>

            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'tenants'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>Tenants ({tenants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('flags')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                activeTab === 'flags'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Feature Flags</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SYSTEM TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Tenants</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white">{totalTenants}</span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold text-xs rounded-full border border-purple-500/30">
                    Providers
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Multi-tenant instances online</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Global Candidates</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-emerald-400">{totalGlobalCandidates}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ {totalSeatsAllocated} Quota</span>
                </div>
                <p className="text-[11px] text-slate-400">Active seat usage across all providers</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">System API Uptime</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-emerald-400">99.98%</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-full border border-emerald-500/30">
                    Operational
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Vercel Edge & Database Cluster</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Audit Log Storage</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-purple-400">1.4 GB</span>
                  <span className="text-xs text-slate-500 font-semibold">90-Day Retention</span>
                </div>
                <p className="text-[11px] text-slate-400">Automated DEWR compliance archiving</p>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Server className="w-5 h-5 text-purple-400" />
                <span>Global System Microservices Health</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Authentication Service</span>
                    <span className="text-emerald-400 font-bold">● Healthy (24ms)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[99%]" />
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>AI STAR Coaching Pipeline</span>
                    <span className="text-emerald-400 font-bold">● Operational</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[98%]" />
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>DEWR Audit Exporter</span>
                    <span className="text-emerald-400 font-bold">● Ready</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[100%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TENANT MANAGEMENT */}
        {activeTab === 'tenants' && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white">Partner Tenant Provisioning Directory</h3>
                <p className="text-xs text-slate-400">Manage licensed provider instances, quotas, and subscription tiers.</p>
              </div>
              <button
                onClick={() => setShowAddTenantModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Provision New Tenant</span>
              </button>
            </div>

            <div className="space-y-3">
              {tenants.map((t) => (
                <div key={t.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-950 border border-purple-800 text-purple-300 rounded-xl font-extrabold flex items-center justify-center text-sm">
                      {t.code.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-sm flex items-center space-x-2">
                        <span>{t.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">[{t.code}]</span>
                      </div>
                      <div className="text-slate-400 mt-0.5">Plan: {t.plan} • Onboarded: {t.joinedDate}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-white font-extrabold">{t.activeCandidates} / {t.maxSeats} Seats Used</div>
                      <div className="w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-purple-500 h-full"
                          style={{ width: `${Math.min(100, (t.activeCandidates / t.maxSeats) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      t.status === 'Active' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FEATURE FLAGS */}
        {activeTab === 'flags' && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Global Feature Entitlement Controls</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Toggle global platform modules across all licensed tenant instances.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">AI STAR Mock Interview Practice Engine</div>
                  <div className="text-slate-400">Allows candidates to submit STAR reports for auto +25 Pts</div>
                </div>
                <button
                  onClick={() => toggleFeatureFlag('aiStarCoaching')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    featureFlags.aiStarCoaching 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {featureFlags.aiStarCoaching ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Automated DEWR CSV Export</div>
                  <div className="text-slate-400">Enables Business Managers to generate audit compliance files</div>
                </div>
                <button
                  onClick={() => toggleFeatureFlag('dewrAutoCsvExport')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    featureFlags.dewrAutoCsvExport 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-500/40'
                  }`}
                >
                  {featureFlags.dewrAutoCsvExport ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Case Manager Coverage Mode Toggle</div>
                  <div className="text-slate-400">Enables away status reassignment during staff leave</div>
                </div>
                <button
                  onClick={() => toggleFeatureFlag('coverageModeReassignment')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    featureFlags.coverageModeReassignment 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-500/40'
                  }`}
                >
                  {featureFlags.coverageModeReassignment ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Beta Predictive Analytics Engine</div>
                  <div className="text-slate-400">Experimental AI placement probability model</div>
                </div>
                <button
                  onClick={() => toggleFeatureFlag('betaAnalyticsEngine')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    featureFlags.betaAnalyticsEngine 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {featureFlags.betaAnalyticsEngine ? 'Enabled' : 'Disabled (Beta)'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PROVISION TENANT MODAL */}
      {showAddTenantModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Provision New Partner Tenant</h3>
              <button onClick={() => setShowAddTenantModal(false)} className="text-slate-400 hover:text-white font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Provider Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Employment Solutions"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-purple-500 font-medium text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Tenant Organization Code</label>
                <input
                  type="text"
                  placeholder="e.g. APX-VIC"
                  value={newTenantCode}
                  onChange={(e) => setNewTenantCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-purple-500 font-bold text-purple-300 uppercase"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">License Tier</label>
                <select
                  value={newTenantPlan}
                  onChange={(e: any) => setNewTenantPlan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none font-bold text-white"
                >
                  <option value="Enterprise">Enterprise Tier</option>
                  <option value="Partner Growth">Partner Growth Tier</option>
                  <option value="Standard">Standard Tier</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Allocated Candidate Quota Seats</label>
                <input
                  type="number"
                  step="50"
                  value={newTenantSeats}
                  onChange={(e) => setNewTenantSeats(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none font-bold text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md"
                >
                  Provision & Activate Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SystemAdminDashboard;