import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface FeedbackItem {
  id: string;
  created_at: string;
  feedback_text: string;
  status: string;
  user_email?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales_rep_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setFeedbackList(data);
      }
    } catch (err) {
      console.warn('Supabase fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const markActioned = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales_rep_feedback')
        .update({ status: 'Actioned' })
        .eq('id', id);

      if (!error) {
        setFeedbackList(prev => prev.map(item => item.id === id ? { ...item, status: 'Actioned' } : item));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ backgroundColor: '#0f172a', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="Workready Logo" style={{ height: '40px', objectFit: 'contain' }} />
          <h1 style={{ margin: 0, fontSize: '1.3rem' }}>Workready Portal <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>| System Admin Inbox</span></h1>
        </div>
        <button onClick={() => navigate('/')} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
          ?? Sign Out
        </button>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 1.5rem', color: '#0f172a' }}>?? Sales Representative Suggestions & Issues</h2>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading feedback entries...</p>
          ) : feedbackList.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No feedback submissions recorded.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.75rem' }}>Submitted</th>
                  <th style={{ padding: '0.75rem' }}>Feedback Details</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.85rem' }}>{new Date(item.created_at).toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', color: '#1e293b' }}>{item.feedback_text}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ backgroundColor: item.status === 'Actioned' ? '#dcfce7' : '#fef3c7', color: item.status === 'Actioned' ? '#15803d' : '#b45309', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {item.status !== 'Actioned' && (
                        <button onClick={() => markActioned(item.id)} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          Mark Actioned
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
