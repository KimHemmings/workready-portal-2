import React, { useState } from 'react';
import { 
  ShieldCheck, Server, Key, AlertCircle, Plus, Users, 
  Building2, Activity, CheckCircle2, MessageSquare, ArrowUpRight, Clock 
} from 'lucide-react';

interface ProviderAccount {
  id: string;
  name: string;
  contactEmail: string;
  licenceTier: string;
  allocatedSeats: number;
  totalSeats: number;
  status: 'Active' | 'Pending Renewal' | 'Suspended';
}

interface SalesDispatch {
  id: string;
  type: 'Lead' | 'Suggestion' | 'Issue';
  from: string;
  content: string;
  date: string;
  status: 'Unread' | 'In Review' | 'Resolved';
}

export const AdminDashboard: React.FC = () => {
  // Provider Accounts State
  const [providers, setProviders] = useState<ProviderAccount[]>([
    {
      id: 'prov-1',
      name: 'Straight Up Training (Main Hub)',
      contactEmail: 'bessy@workready.com',
      licenceTier: 'Enterprise Provider',
      allocatedSeats: 38,
      totalSeats: 50,
      status: 'Active',
    },
    {
      id: 'prov-2',
      name: 'Apex Regional Employment',
      contactEmail: 'admin@apexregional.com.au',
      licenceTier: 'Standard Provider',
      allocatedSeats: 18,
      totalSeats: 25,
      status: 'Active',
    },
  ]);

  // Sales Feed State
  const [dispatches, setDispatches] = useState<SalesDispatch[]>([
    {
      id: 'disp-1',
      type: 'Lead',
      from: 'training@straightuptraining.com',
      content: 'New regional provider lead: Metro West Employment Services requested 30 licence seats.',
      date: '15/09/2026',
      status: 'Unread',
    },
    {
      id: 'disp-2',
      type: 'Issue',
      from: 'training@straightuptraining.com',
      content: 'Requesting layout adjustment for Candidate STAR Interview simulator button alignment.',
      date: '14/09/2026',
      status: 'In Review',
    },
  ]);

  // Modal State
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provSeats, setProvSeats] = useState(20);

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    const newProv: ProviderAccount = {
      id: `prov-${Date.now()}`,
      name: provName,
      contactEmail: provEmail,
      licenceTier: 'Standard Provider',
      allocatedSeats: 0,
      totalSeats: Number(provSeats),
      status: 'Active',
    };
    setProviders([...providers, newProv]);
    setShowAddProviderModal(false);
    setProvName(''); setProvEmail('');
    alert(`🎉 Provider "${provName}" successfully onboarded with ${provSeats} licence seats!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-rose-950 via-[#24083b] to-[#1a052c] text-white shadow-md border-b border-rose-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white font-heading">
                  System Admin Portal
                </span>
                <span className="bg-rose-900/80 text-rose-200 border border-rose-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Root System Access
                </span>
              </div>
              <p className="text-xs text-rose-200">Platform Health, Provider Licences, & Sales Dispatch Monitoring</p>
            </div>
          </div>

          <button
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* System Health Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Providers</p>
              <h3 className="text-2xl font-black text-[#24083b] mt-1">{providers.length} Registered</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-900 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Licences</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">75 Seats</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Key className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sales Dispatches</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{dispatches.length} Incoming</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Status</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">100% Operational</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Server className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* SECTION 1: SALES & TRAINING DISPATCH FEED */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#24083b] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" /> Sales Team Dispatch Feed
              </h2>
              <p className="text-xs text-slate-500">Leads, feature suggestions, and issues submitted directly by Sales.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Date</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">From</th>
                  <th className="p-3">Details / Content</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dispatches.map((disp) => (
                  <tr key={disp.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="p-3 font-semibold text-slate-500">{disp.date}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        disp.type === 'Lead' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        disp.type === 'Issue' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {disp.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{disp.from}</td>
                    <td className="p-3 text-slate-900 font-medium">{disp.content}</td>
                    <td className="p-3 font-bold text-amber-700">{disp.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: PROVIDER LICENCE MANAGEMENT */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#24083b] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-700" /> Registered Provider Accounts & Licences
              </h2>
              <p className="text-xs text-slate-500">Manage provider organizations, active seats, and operational status.</p>
            </div>
            
            <button
              onClick={() => setShowAddProviderModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Onboard New Provider
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Provider Name</th>
                  <th className="p-3">Contact Email</th>
                  <th className="p-3">Licence Tier</th>
                  <th className="p-3">Allocated Quota</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map((prov) => (
                  <tr key={prov.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="p-3 font-bold text-slate-900">{prov.name}</td>
                    <td className="p-3 text-slate-600">{prov.contactEmail}</td>
                    <td className="p-3 font-semibold text-purple-900">{prov.licenceTier}</td>
                    <td className="p-3 font-bold text-emerald-600">{prov.allocatedSeats} / {prov.totalSeats} Seats Used</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {prov.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* MODAL: ONBOARD NEW PROVIDER */}
      {showAddProviderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddProvider} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Onboard New Provider Account 🏢</h3>
              <button type="button" onClick={() => setShowAddProviderModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Provider Business Name *</label>
                <input required type="text" value={provName} onChange={(e) => setProvName(e.target.value)} placeholder="e.g. Apex Regional Services" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Business Manager Email *</label>
                <input required type="email" value={provEmail} onChange={(e) => setProvEmail(e.target.value)} placeholder="e.g. bessy@provider.com" className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Licence Seat Quota</label>
                <input type="number" value={provSeats} onChange={(e) => setProvSeats(Number(e.target.value))} className="w-full p-2.5 border rounded-xl" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddProviderModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-[#24083b] text-white font-bold rounded-xl shadow-sm">Create Provider Account</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;