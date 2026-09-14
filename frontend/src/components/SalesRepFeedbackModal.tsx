import React, { useState } from 'react';

interface SalesRepFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  repEmail?: string;
}

export default function SalesRepFeedbackModal({
  isOpen,
  onClose,
  repEmail = 'training@straightuptraining.com'
}: SalesRepFeedbackModalProps) {
  const [category, setCategory] = useState('Technical Issue');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const existingLogs = JSON.parse(localStorage.getItem('portal_rep_feedback') || '[]');
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      repEmail,
      category,
      message,
      status: 'Open'
    };

    localStorage.setItem('portal_rep_feedback', JSON.stringify([newEntry, ...existingLogs]));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Log Sales Rep Feedback / Issue</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
            ?
          </button>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg text-center font-medium">
            ? Feedback logged successfully! Shared with System Admins.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Technical Issue">Technical Issue</option>
                <option value="Demo Data Request">Demo Data Request</option>
                <option value="Client Suggestion">Client Suggestion</option>
                <option value="General Feedback">General Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                Message / Details
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the issue, bug, or client request..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                Submit to System Admin
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
