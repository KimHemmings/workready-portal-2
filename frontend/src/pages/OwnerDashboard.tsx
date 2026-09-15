import React, { useState } from 'react';
import { 
  Building2, Users, ShieldAlert, Award, FileSpreadsheet, Download, 
  PieChart, RefreshCw, UserCheck, ArrowRightLeft, ShieldCheck, CheckCircle2 
} from 'lucide-react';

interface CaseManagerQuota {
  id: string;
  name: string;
  email: string;
  activeCandidates: number;
  maxLicenceCapacity: number;
  complianceRate: number;
}

interface ProviderLicence {
  providerName: string;
  licenceTier: string;
  totalLicences: number;
  allocatedLicences: number;
  expiryDate: string;
  status: 'Active' | 'Near Capacity' | 'Expired';
}

export const OwnerDashboard: React.FC = () => {
  const [licenceInfo] = useState<ProviderLicence>({
    providerName: 'Straight Up Training — Provider Hub',
    licenceTier: 'Enterprise Workforce Australia',
    totalLicences: 50,
    allocatedLicences: 38,
    expiryDate: '31/12/2026',
    status: 'Active',
  });

  const [caseManagers, setCaseManagers] = useState<CaseManagerQuota[]>([
    {
      id: 'cm-1',
      name: 'Casey Miller (Case Manager)',
      email: 'case@workready.com',
      activeCandidates: 24,
      maxLicenceCapacity: 30,
      complianceRate: 94,
    },
    {
      id: 'cm-2',
      name: 'Jordan Lee (Senior Advisor)',
      email: 'jordan.l@workready.com',
      activeCandidates: 14,
      maxLicenceCapacity: 20,
      complianceRate: 88,
    },
  ]);

  const [showReallocateModal, setShowReallocateModal] = useState<boolean>(false);
  const [selectedCM, setSelectedCM] = useState<CaseManagerQuota | null>(null);
  const [newCapacity, setNewCapacity] = useState<number>(30);

  const handleUpdateCapacity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCM) return;

    setCaseManagers((prev) =>
      prev.map((cm) => (cm.id === selectedCM.id ? { ...cm, maxLicenceCapacity: Number(newCapacity) } : cm))
    );
    setShowReallocateModal(false);
    alert(`✅ Updated ${selectedCM.name}'s maximum licence capacity to ${newCapacity} candidate slots.`);
  };

  const handleExportComplianceReport = () => {
    alert("📊 Exporting Provider Compliance & Licence Usage Summary for Workforce Australia audit...");
  };

  const usedPercentage = Math.round((licenceInfo.allocatedLicences / licenceInfo.totalLicences) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <header className="bg-gradient-to-r from-[#24083b] via-[#320b52] to-[#24083b] text-white shadow-md border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white font-heading">
                  Business Manager Executive Hub
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Bessy (Business View)
                </span>
              </div>
              <p className="text-xs text-purple-200">Licence Allocation, Provider Compliance & Caseload Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportComplianceReport}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export Executive Audit
            </button>
            <button
              onClick={() => { localStorage.clear(); window.location.href = "/"; }}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <section className="bg-gradient-to-r from-purple-950 via-[#24083b] to-purple-900 text-white rounded-2xl p-6 shadow-lg border border-purple-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/80 pb-3">
            <div>
              <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">{licenceInfo.providerName}</h2>
              <p className="text-lg font-black text-white">{licenceInfo.licenceTier}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                Status: {licenceInfo.status}
              </span>
              <span className="text-xs font-mono text-purple-200 bg-purple-900/60 px-3 py-1 rounded-full border border-purple-700">
                Renewal: {licenceInfo.expiryDate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1">
              <span className="text-xs text-purple-200 font-semibold">Licence Seats Utilized</span>
              <p className="text-2xl font-black text-white">{licenceInfo.allocatedLicences} / {licenceInfo.totalLicences} <span className="text-xs font-normal text-purple-300">Slots Used</span></p>
              <div className="w-full bg-purple-950 h-3 rounded-full overflow-hidden border border-purple-800 mt-2">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${usedPercentage}%` }} />
              </div>
            </div>

            <div className="space-y-1 border-l border-purple-800/60 pl-0 md:pl-6">
              <span className="text-xs text-purple-200 font-semibold">Available Unallocated Seats</span>
              <p className="text-2xl font-black text-emerald-400">{licenceInfo.totalLicences - licenceInfo.allocatedLicences} Seats Ready</p>
              <p className="text-xs text-purple-300">Ready to assign to new candidate intakes.</p>
            </div>

            <div className="space-y-1 border-l border-purple-800/60 pl-0 md:pl-6">
              <span className="text-xs text-purple-200 font-semibold">Average Provider Compliance</span>
              <p className="text-2xl font-black text-purple-200">91.5%</p>
              <p className="text-xs text-purple-300">Across all active case manager rosters.</p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#24083b] flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-700" /> Staff Licence & Caseload Allocations
              </h2>
              <p className="text-xs text-slate-500">Allocate candidate seats across Case Managers to stay within licensed limits.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3">Case Manager</th>
                  <th className="p-3">Assigned Candidates</th>
                  <th className="p-3">Max Quota</th>
                  <th className="p-3">Capacity Bar</th>
                  <th className="p-3">Compliance Rate</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {caseManagers.map((cm) => {
                  const cmPct = Math.round((cm.activeCandidates / cm.maxLicenceCapacity) * 100);
                  return (
                    <tr key={cm.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{cm.name}</span>
                        <span className="text-slate-500 text-[11px]">{cm.email}</span>
                      </td>
                      <td className="p-3 font-bold text-purple-900">{cm.activeCandidates} Active</td>
                      <td className="p-3 font-semibold text-slate-700">{cm.maxLicenceCapacity} Max Slots</td>
                      <td className="p-3 w-48">
                        <div className="space-y-1">
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border">
                            <div className={`h-full rounded-full ${cmPct > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${cmPct}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold">{cmPct}% Capacity Used</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> {cm.complianceRate}%
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => { setSelectedCM(cm); setNewCapacity(cm.maxLicenceCapacity); setShowReallocateModal(true); }}
                          className="px-3 py-1.5 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl shadow-sm transition-all"
                        >
                          Adjust Quota
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showReallocateModal && selectedCM && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUpdateCapacity} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Reallocate Capacity ⚙️</h3>
              <button type="button" onClick={() => setShowReallocateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">Adjust maximum candidate seats for <strong>{selectedCM.name}</strong>.</p>
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Seat Limit *</label>
                <input
                  type="number"
                  required
                  min={selectedCM.activeCandidates}
                  max={licenceInfo.totalLicences}
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowReallocateModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs bg-[#24083b] text-white font-bold rounded-xl shadow-sm">Save Quota</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;