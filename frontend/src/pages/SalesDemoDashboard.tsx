import React, { useState } from 'react';
import SalesRepFeedbackModal from '../components/SalesRepFeedbackModal';

export default function SalesDemoDashboard() {
  const [selectedProvider, setSelectedProvider] = useState('Workforce Australia');
  const [activeProfileView, setActiveProfileView] = useState('Case Manager');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const providerStreams = [
    { id: 'Workforce Australia', label: 'Workforce Australia (100 Pts)', badgeColor: 'bg-blue-600' },
    { id: 'TtW Youth', label: 'TtW Youth (80 Pts)', badgeColor: 'bg-indigo-600' },
    { id: 'DES Flexible', label: 'DES Flexible (50 Pts)', badgeColor: 'bg-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Top Banner & Control Bar */}
      <div className="mb-6 bg-slate-900 text-white rounded-xl p-5 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Sales Presentation Environment</span>
          <h1 className="text-2xl font-black text-white">Interactive Provider Sandbox</h1>
          <p className="text-xs text-slate-300">Select a provider contract stream and demo profile to showcase to clients.</p>
        </div>
        
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs rounded-lg shadow-lg transition-all flex items-center gap-2"
        >
          <span>?? Log Issue / Suggestion</span>
        </button>
      </div>

      {/* Provider Type Selector Tabs */}
      <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Select Active Provider Stream:
        </label>
        <div className="flex flex-wrap gap-3">
          {providerStreams.map((stream) => (
            <button
              key={stream.id}
              onClick={() => setSelectedProvider(stream.id)}
              className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 ${
                selectedProvider === stream.id
                  ? `${stream.badgeColor} text-white shadow-md ring-2 ring-offset-1 ring-blue-400`
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{stream.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Profile Views Navigation */}
      <div className="mb-6 flex gap-2 border-b border-slate-200 pb-2">
        {['Case Manager', 'Candidate Workspace', 'Employer / Business'].map((profile) => (
          <button
            key={profile}
            onClick={() => setActiveProfileView(profile)}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-all ${
              activeProfileView === profile
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {profile} View
          </button>
        ))}
      </div>

      {/* Dynamic Demo View Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[400px]">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{activeProfileView} Presentation View</h2>
            <p className="text-xs text-slate-500">
              Isolated presentation sandbox configured for <strong className="text-slate-800">{selectedProvider}</strong>.
            </p>
          </div>
          <span className="text-xs font-mono bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
            Read-Only Demo Mode
          </span>
        </div>

        {/* Demo Screen Preview Placeholder */}
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50">
          <p className="text-sm font-semibold text-slate-600 mb-1">
            Displaying mock data for <span className="text-blue-600 font-bold">{activeProfileView}</span> ({selectedProvider})
          </p>
          <p className="text-xs text-slate-400">
            Live candidate roster and production database are isolated from this view.
          </p>
        </div>
      </div>

      {/* Feedback Modal */}
      <SalesRepFeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
}
