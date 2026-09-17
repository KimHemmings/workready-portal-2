import React from 'react';
import { ShieldAlert, Server, Activity, Database, Key } from 'lucide-react';

export default function SystemAdminDashboard() {
  const handleSignOut = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('role');
    window.history.pushState({}, '', url.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-red-600/20 border border-red-500/30 rounded-xl flex items-center justify-center text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">System Admin Control Center</h1>
            <p className="text-xs text-slate-400">Infrastructure Monitoring & Security Audit Log</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">System Uptime</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">99.98%</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">API Latency</span>
              <Server className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">42 ms</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Active DB Connections</span>
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">128 / 500</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Security Audits Passed</span>
              <Key className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">100% compliant</p>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-200 mb-4">System Event Log</h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/40 flex justify-between items-center">
              <span className="font-mono text-emerald-400">[INFO] Security audit scan completed</span>
              <span className="text-slate-400">Just now</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/40 flex justify-between items-center">
              <span className="font-mono text-blue-400">[AUTH] Role-based isolation check passed</span>
              <span className="text-slate-400">2 mins ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
