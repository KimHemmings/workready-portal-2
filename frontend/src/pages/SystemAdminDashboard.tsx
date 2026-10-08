import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Building2, Users, Cpu, Server, Key, Sliders, LogOut, 
  PlusCircle, Download, CheckCircle2, AlertTriangle, RefreshCw, X, Search, Sparkles,
  Link as LinkIcon, Copy, Check, ExternalLink, Zap, RotateCcw, Mail, Send, Layers,
  UserCheck, ArrowRightLeft
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export type ContractMarket = 'workforce_au' | 'des' | 'parentsnext_ttw' | 'rto_tafe';

export interface PartnerTenant {
  id: string;
  name: string;
  code: string;
  framework: ContractMarket;
  plan: 'Enterprise' | 'Partner Growth' | 'Standard';
  activeCandidates: number;
  maxSeats: number;
  status: 'Active' | 'Suspended' | 'Provisioning' | 'Prospect Evaluating';
  joinedDate: string;
  contractEndDate: string;
  autoRenewal: boolean;
  contactEmail: string;
  contactName: string;
}

export interface DispatchLead {
  id: string;
  date: string;
  type: 'Pilot Request' | 'Lead' | 'Support Ticket';
  from: string;
  providerName: string;
  details: string;
  status: 'Unread' | 'In Review' | 'Actioned';
}

export function SystemAdminDashboard() {
  const { resetSandboxState } = usePortal();
  const [activeTab, setActiveTab] = useState<'pls_dispatch' | 'tenants' | 'telemetry' | 'flags'>('pls_dispatch');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hideActionedLeads, setHideActionedLeads] = useState<boolean>(true);

  // Multi-Tenant Partner State (Persisted in LocalStorage)
  const [tenants, setTenants] = useState<PartnerTenant[]>(() => {
    const saved = localStorage.getItem('sut_admin_tenants');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Straight Up Training (Main Hub)', code: 'SUT-AU', framework: 'workforce_au', plan: 'Enterprise', activeCandidates: 150, maxSeats: 500, status: 'Active', joinedDate: '2025-11-12', contractEndDate: '2026-11-12', autoRenewal: true, contactEmail: 'bessy@workready.com', contactName: 'Bessy Founder' },
      { id: '2', name: 'Apex Regional Employment', code: 'APX-WA', framework: 'workforce_au', plan: 'Partner Growth', activeCandidates: 85, maxSeats: 250, status: 'Active', joinedDate: '2026-02-04', contractEndDate: '2026-11-20', autoRenewal: true, contactEmail: 'admin@apexregional.com.au', contactName: 'Sarah Jenkins (COO)' },
      { id: '3', name: 'Queensland Vocational Institute', code: 'QVI-RTO', framework: 'rto_tafe', plan: 'Enterprise', activeCandidates: 40, maxSeats: 200, status: 'Prospect Evaluating', joinedDate: '2026-08-19', contractEndDate: '2027-08-19', autoRenewal: false, contactEmail: 'dross@qvi.edu.au', contactName: 'David Ross (Director)' }
    ];
  });

  // Sales Dispatch Feed
  const [dispatches, setDispatches] = useState<DispatchLead[]>([
    { id: 'disp_1', date: '2026-09-15', type: 'Pilot Request', from: 's.jenkins@apexregional.com.au', providerName: 'Apex Regional Employment', details: 'Executive requested 14-day evaluation pilot for 30 Case Manager seats under WFA contract.', status: 'Unread' },
    { id: 'disp_2', date: '2026-09-14', type: 'Lead', from: 'dross@qvi.edu.au', providerName: 'Queensland Vocational Institute', details: 'RTO Director opened evaluation portal via magic link. Viewed ASQA audit evidence vault.', status: 'In Review' }
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
  const [newTenantFramework, setNewTenantFramework] = useState<ContractMarket>('workforce_au');
  const [newTenantPlan, setNewTenantPlan] = useState<'Enterprise' | 'Partner Growth' | 'Standard'>('Enterprise');
  const [newTenantSeats, setNewTenantSeats] = useState<number>(250);
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactName, setNewContactName] = useState('');

  useEffect(() => {
    localStorage.setItem('sut_admin_tenants', JSON.stringify(tenants));
  }, [tenants]);

  const handleSignOut = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  // Direct Role Switcher Helper
  const handleSwitchRole = (role: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('role', role);
    url.searchParams.delete('mode');
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new Event('popstate'));
  };

  const toggleFeatureFlag = (key: keyof typeof featureFlags) => {
    setFeatureFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getMagicLink = (tenant: PartnerTenant) => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      mode: 'prospect',
      market: tenant.framework,
      provider: tenant.name
    });
    return `${baseUrl}/?${params.toString()}`;
  };

  const handleCopyLink = (tenant: PartnerTenant) => {
    const link = getMagicLink(tenant);
    navigator.clipboard.writeText(link);
    setCopiedId(tenant.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim() || !newTenantCode.trim()) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // Default 1 year contract

    const newTenant: PartnerTenant = {
      id: Date.now().toString(),
      name: newTenantName.trim(),
      code: newTenantCode.trim().toUpperCase(),
      framework: newTenantFramework,
      plan: newTenantPlan,
      activeCandidates: 0,
      maxSeats: newTenantSeats,
      status: 'Prospect Evaluating',
      joinedDate: startDate.toISOString().slice(0, 10),
      contractEndDate: endDate.toISOString().slice(0, 10),
      autoRenewal: true,
      contactEmail: newContactEmail.trim() || 'executive@provider.com.au',
      contactName: newContactName.trim() || 'Executive Leadership'
    };

    setTenants(prev => [newTenant, ...prev]);
    setNewTenantName('');
    setNewTenantCode('');
    setNewContactEmail('');
    setNewContactName('');
    setShowAddTenantModal(false);
  };

  // Expiry Calculation Helper
  const getDaysUntilRenewal = (endDateStr: string) => {
    if (!endDateStr) return 365;
    const endDate = new Date(endDateStr);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Metrics
  const totalTenants = tenants.length;
  const totalGlobalCandidates = tenants.reduce((acc, t) => acc + t.activeCandidates, 0);
  const totalSeatsAllocated = tenants.reduce((acc, t) => acc + t.maxSeats, 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-16">
      {/* CLEAN HIGH-CONTRAST HEADER */}
      <header className="bg-gradient-to-r from-[#1e1b4b] via-[#24083b] to-[#1e1b4b] px-8 py-5 border-b border-purple-900/60 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* LARGE LOGO & HIGH-CONTRAST HEADER TITLE */}
          <div className="flex items-center space-x-4">
            <div className="h-14 flex items-center justify-center shrink-0">
              <img 
                src="/logo.png" 
                alt="Straight Up Training Logo" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('logo.png')) {
                    target.src = '/White_Background_PNG.png';
                  } else {
                    target.onerror = null;
                    target.parentElement!.innerHTML = '<span class="font-black text-amber-400 text-2xl">SUT</span>';
                  }
                }}
              />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tight text-white">Straight Up Training</h1>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">Ops & Dispatch Control</p>
            </div>
          </div>

          {/* QUICK ROLE SWITCHER BAR */}
          <div className="flex items-center space-x-1.5 bg-purple-950/60 p-1.5 rounded-xl border border-purple-800/80 text-xs font-bold shrink-0 flex-wrap gap-y-1">
            <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider px-2 flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3"/> Jump View:
            </span>
            <button
              onClick={() => handleSwitchRole('sales')}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold rounded-lg transition-all cursor-pointer shadow-sm"
            >
              ðŸ’¼ Sales Portal
            </button>
            <button
              onClick={() => handleSwitchRole('candidate')}
              className="px-2.5 py-1 bg-purple-900/80 hover:bg-purple-800 text-white rounded-lg transition-all cursor-pointer"
            >
              ðŸ“± Candidate
            </button>
            <button
              onClick={() => handleSwitchRole('coach')}
              className="px-2.5 py-1 bg-purple-900/80 hover:bg-purple-800 text-white rounded-lg transition-all cursor-pointer"
            >
              âš¡ Coach
            </button>
            <button
              onClick={() => handleSwitchRole('owner')}
              className="px-2.5 py-1 bg-purple-900/80 hover:bg-purple-800 text-white rounded-lg transition-all cursor-pointer"
            >
              ðŸ›¡ Executive
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                resetSandboxState();
                alert('â†º Global Sandbox State Reset!');
              }}
              className="px-3 py-1.5 bg-purple-800/80 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300"/>
              <span>Reset Sandbox</span>
            </button>

            <button
              onClick={() => setShowAddTenantModal(true)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold text-xs rounded-xl transition-all flex items-center space-x-1 shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4"/>
              <span>+ Provision Provider</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5"/>
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* NAV & TAB CONTROLS - HIGH CONTRAST LIGHT THEME */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-purple-950">Root System Portal Controls</h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">Manage outbound campaigns, provider seats, and multi-tenant feature flags.</p>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold gap-1 flex-wrap">
            <button
              onClick={() => setActiveTab('pls_dispatch')}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'pls_dispatch' ? 'bg-purple-950 text-white shadow-md font-black' : 'bg-transparent text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Zap className={`w-4 h-4 ${activeTab === 'pls_dispatch' ? 'text-amber-300' : 'text-purple-900'}`} />
              <span>Magic Links & PLS Dispatch</span>
            </button>

            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'tenants' ? 'bg-purple-950 text-white shadow-md font-black' : 'bg-transparent text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building2 className={`w-4 h-4 ${activeTab === 'tenants' ? 'text-amber-300' : 'text-purple-900'}`} />
              <span>Registered Providers ({tenants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'telemetry' ? 'bg-purple-950 text-white shadow-md font-black' : 'bg-transparent text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Cpu className={`w-4 h-4 ${activeTab === 'telemetry' ? 'text-amber-300' : 'text-purple-900'}`} />
              <span>Telemetry & Health</span>
            </button>

            <button
              onClick={() => setActiveTab('flags')}
              className={`px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'flags' ? 'bg-purple-950 text-white shadow-md font-black' : 'bg-transparent text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sliders className={`w-4 h-4 ${activeTab === 'flags' ? 'text-amber-300' : 'text-purple-900'}`} />
              <span>Feature Flags</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PLS DISPATCH & MAGIC LINK ENGINE */}
        {activeTab === 'pls_dispatch' && (
          <div className="space-y-6">
            
            {/* INCOMING PILOT REQUESTS FEED */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-purple-700"/>
                  <h3 className="text-base font-black text-purple-950">Sales Team & Prospect Dispatch Feed</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setHideActionedLeads(prev => !prev)}
                    className="text-xs font-bold text-slate-600 hover:text-purple-950 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    {hideActionedLeads ? 'ðŸ‘ï¸ Show Actioned/Archived' : 'ðŸ™ˆ Hide Actioned/Archived'}
                  </button>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    Live Lead Queue
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-black border-b border-slate-200">
                      <th className="p-3">Date</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">From Contact</th>
                      <th className="p-3">Details / Content</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dispatches
  .filter(d => !hideActionedLeads || d.status !== 'Actioned')
  .map(d => (
                      <tr key={d.id} className="hover:bg-slate-50 transition-all">
                        <td className="p-3 text-slate-600 font-mono font-bold">{d.date}</td>
                        <td className="p-3 font-extrabold">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            d.type === 'Pilot Request' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-purple-100 text-purple-900 border border-purple-300'
                          }`}>
                            {d.type}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          <div>{d.providerName}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{d.from}</div>
                        </td>
                        <td className="p-3 text-slate-700 max-w-md font-medium">{d.details}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setDispatches(prev => prev.map(item => {
                                if (item.id === d.id) {
                                  const nextStatus: Record<DispatchLead['status'], DispatchLead['status']> = {
                                    'Unread': 'In Review',
                                    'In Review': 'Actioned',
                                    'Actioned': 'Unread'
                                  };
                                  return { ...item, status: nextStatus[item.status] };
                                }
                                return item;
                              }));
                            }}
                            className={`px-2.5 py-1 rounded-full font-black text-[10px] border cursor-pointer transition-all ${
                              d.status === 'Unread' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                              d.status === 'In Review' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                              'bg-slate-200 text-slate-600 border-slate-300'
                            }`}
                          >
                            {d.status} {d.status === 'Actioned' ? '(Archived)' : ''}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MAGIC LINK DIRECTORY */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-purple-950">Target Provider Magic Link Directory</h3>
                  <p className="text-xs text-slate-600 font-medium">Generate, test, and copy 1-click tailored links for C-suite executive evaluation portals.</p>
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search provider..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tenants
                  .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(tenant => {
                    const magicLink = getMagicLink(tenant);
                    const isCopied = copiedId === tenant.id;

                    return (
                      <div key={tenant.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between shadow-sm">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-purple-950 text-base">{tenant.name}</span>
                            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 border border-purple-200 rounded-md text-[10px] font-black uppercase">
                              {tenant.framework.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-bold">Contact: {tenant.contactName} <span className="text-slate-500 font-normal">({tenant.contactEmail})</span></p>
                          <div className="p-2 bg-white border border-slate-200 rounded-lg text-[10px] text-purple-950 font-mono font-bold truncate mt-2">
                            {magicLink}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => handleCopyLink(tenant)}
                            className={`flex-1 py-2 rounded-lg font-black text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-sm ${
                              isCopied ? 'bg-emerald-600 text-white' : 'bg-amber-400 hover:bg-amber-300 text-purple-950'
                            }`}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5"/> : <Copy className="w-3.5 h-3.5"/>}
                            <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Magic Link'}</span>
                          </button>

                          <a
                            href={magicLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 bg-white hover:bg-slate-100 text-purple-950 border border-slate-200 font-bold text-xs rounded-lg transition-all flex items-center space-x-1 shadow-sm"
                          >
                            <span>Test</span>
                            <ExternalLink className="w-3.5 h-3.5"/>
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        )}
        {/* TAB 2: TENANT MANAGEMENT & CONTRACT RENEWALS */}
        {activeTab === 'tenants' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-purple-950">Registered Provider Accounts & Licences</h3>
                <p className="text-xs text-slate-600 font-medium">Manage provider organizations, seat quotas, and automated contract renewals.</p>
              </div>
              <button
                onClick={() => setShowAddTenantModal(true)}
                className="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-amber-300"/>
                <span>+ Onboard New Provider</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-black border-b border-slate-200">
                    <th className="p-3.5 rounded-tl-xl">Provider Name</th>
                    <th className="p-3.5">Contact & Tier</th>
                    <th className="p-3.5">Allocated Quota</th>
                    <th className="p-3.5">Contract Renewal</th>
                    <th className="p-3.5 text-right rounded-tr-xl">Auto-Renew & Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenants.map((t) => {
                    const daysLeft = getDaysUntilRenewal(t.contractEndDate);
                    const isRenewalDue = daysLeft <= 60 && daysLeft >= 0;
                    const isExpired = daysLeft < 0;

                    return (
                      <tr key={t.id} className="hover:bg-slate-50 transition-all">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4 text-purple-700 shrink-0"/>
                            <div>
                              <span className="font-black text-purple-950 text-xs">{t.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono block">[{t.code}] â€¢ Joined: {t.joinedDate}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-700 font-medium text-xs">
                          <div>{t.contactName} ({t.contactEmail})</div>
                          <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 inline-block mt-0.5">{t.plan}</span>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-700 text-xs">
                          {t.activeCandidates} / {t.maxSeats} Seats Used
                        </td>
                        <td className="p-3.5 text-xs font-bold">
                          <div className="text-slate-900">Ends: {t.contractEndDate}</div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border inline-block mt-0.5 ${
                            isExpired ? 'bg-rose-100 text-rose-800 border-rose-300' :
                            isRenewalDue ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {isExpired ? 'ðŸš¨ Expired' : isRenewalDue ? `âš ï¸ ${daysLeft} Days to Renewal` : `ðŸŸ¢ ${daysLeft} Days Left`}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-y-1">
                          <div>
                            <button
                              onClick={() => {
                                setTenants(prev => prev.map(item => item.id === t.id ? { ...item, autoRenewal: !item.autoRenewal } : item));
                              }}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border cursor-pointer transition-all ${
                                t.autoRenewal ? 'bg-purple-100 text-purple-900 border-purple-300' : 'bg-slate-100 text-slate-600 border-slate-300'
                              }`}
                            >
                              Auto-Renew: {t.autoRenewal ? 'ON ðŸ”„' : 'OFF â¸'}
                            </button>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border inline-block ${
                            t.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* TAB 3: SYSTEM TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Providers</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white">{totalTenants}</span>
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold text-xs rounded-full border border-purple-500/30">
                    Registered
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Multi-tenant instances online</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Active Licences</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-emerald-400">{totalGlobalCandidates}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ {totalSeatsAllocated} Seats</span>
                </div>
                <p className="text-[11px] text-slate-400">Active seat usage across providers</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Platform Status</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-emerald-400">100%</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-full border border-emerald-500/30">
                    Operational
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Vercel Edge Cluster</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Audit Log Retention</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-purple-400">90 Days</span>
                  <span className="text-xs text-slate-500 font-semibold">Immutable</span>
                </div>
                <p className="text-[11px] text-slate-400">DEWR/ASQA compliance lockers</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FEATURE FLAGS - CLEAN HIGH CONTRAST */}
        {activeTab === 'flags' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-black text-purple-950 flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-purple-700"/>
                <span>Global Feature Entitlement Controls</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Toggle global platform modules across all licensed tenant instances.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-black text-purple-950 text-sm">AI STAR Mock Interview Practice Engine</div>
                  <div className="text-slate-600 font-medium">Allows candidates to submit STAR reports for auto +25 Pts</div>
                </div>
                <button
                  onClick={() => toggleFeatureFlag('aiStarCoaching')}
                  className={`px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer shadow-sm ${
                    featureFlags.aiStarCoaching ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {featureFlags.aiStarCoaching ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-black text-purple-950 text-sm">Automated DEWR CSV Export</div>
                  <div className="text-slate-600 font-medium">Enables Business Managers to generate audit compliance files</div>
                </div>
                <button
                  onClick={() => toggleFeatureFlag('dewrAutoCsvExport')}
                  className={`px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer shadow-sm ${
                    featureFlags.dewrAutoCsvExport ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {featureFlags.dewrAutoCsvExport ? 'Enabled' : 'Disabled'}
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
              <h3 className="font-extrabold text-white text-base">Provision New Partner Provider</h3>
              <button onClick={() => setShowAddTenantModal(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Provider Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Regional Employment"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-medium text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Tenant Organization Code</label>
                <input
                  type="text"
                  placeholder="e.g. APX-WA"
                  value={newTenantCode}
                  onChange={(e) => setNewTenantCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-purple-300 uppercase"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Funding Contract Segment</label>
                <select
                  value={newTenantFramework}
                  onChange={(e: any) => setNewTenantFramework(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white"
                >
                  <option value="workforce_au">Workforce Australia (WFA)</option>
                  <option value="des">Inclusive Employment Australia (DES)</option>
                  <option value="parentsnext_ttw">Transition to Work (TtW)</option>
                  <option value="rto_tafe">RTOs, TAFEs & Higher Education</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Allocated Seat Quota</label>
                  <input
                    type="number"
                    step="25"
                    value={newTenantSeats}
                    onChange={(e) => setNewTenantSeats(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-bold text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Contact Email</label>
                <input
                  type="email"
                  placeholder="s.jenkins@apex.com.au"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Provision & Generate Magic Link
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