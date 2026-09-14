import React, { useState } from 'react';

export default function SalesRepFeedbackModal({ isOpen, onClose, repEmail }) {
  const [category, setCategory] = useState('Issue');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFeedback = {
      id: Date.now(),
      repEmail: repEmail || 'sales@straightuptraining.com',
      category,
      message,
      timestamp: new Date().toLocaleString(),
      status: 'Open'
    };

    const existing = JSON.parse(localStorage.getItem('portal_rep_feedback') || '[]');
    localStorage.setItem('portal_rep_feedback', JSON.stringify([newFeedback, ...existing]));

    setMessage('');
    onClose();
    alert('Feedback submitted directly to System Admin!');
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Log Issue, Suggestion, or Feedback</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Feedback Type</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="Issue">Bug / Technical Issue</option>
              <option value="Suggestion">Feature Suggestion</option>
              <option value="General Feedback">Demo / Client Feedback</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Details</label>
            <textarea 
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the issue or feedback..."
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-medium">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
}
