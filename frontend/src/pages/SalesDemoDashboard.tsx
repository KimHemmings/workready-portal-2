import React, { useState, useEffect } from 'react';
import SalesRepFeedbackModal from '../components/SalesRepFeedbackModal';
import { supabase } from '../lib/supabase';

interface PerformanceLog {
  id: string;
  stream: string;
  action: string;
  timestamp: string;
  dateObj: string;
  status?: string;
}

interface StreamData {
  title: string;
  caseload: number;
  outcomesThisMonth: number;
  complianceRate: string;
  recentActivity: string[];
}

const mockStreams: Record<string, StreamData> = {
  wfa: {
    title: 'Workforce Australia',
    caseload: 142,
    outcomesThisMonth: 18,
    complianceRate: '96%',
    recentActivity: [
      'Placed Participant #4092 in Retail Role',
      'Completed Mutual Obligation Audit',
      'Logged 5 new employer leads in Sydney Metro'
    ]
  },
  ttw: {
    title: 'Transition to Work (Youth)',
    caseload: 88,
    outcomesThisMonth: 12,
    complianceRate: '92%',
    recentActivity: [
      'Enrolled 3 Youth Participants in Hospitality Cert II',
      'Connected Participant #1102 to Local Apprenticeship',
      'Added 4 vocational lead contacts'
    ]
  },
  des: {
    title: 'DES Flexible',
    caseload: 64,
    outcomesThisMonth: 9,
    complianceRate: '98%',
    recentActivity: [
      'Approved Workplace Accommodation Grant',
      'Completed 26-Week Outcome Claim',
      'Added 2 inclusive employer leads'
    ]
  }
};

export default function SalesDemoDashboard() {
  const [activeTab, setActiveTab] = useState<'wfa' | 'ttw' | 'des' | 'performance'>('wfa');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [leadCounts, setLeadCounts] = useState<Record<string, number>>({ wfa: 34, ttw: 21, des: 15 });
  const [logs, setLogs] = useState<PerformanceLog[]>([]);
  const [adminActionedItems, setAdminActionedItems] = useState<any[]>([]);

  useEffect(() => {
    const storedLogs = localStorage.getItem('workready_sales_logs');
    if (storedLogs) {
      const parsedLogs: PerformanceLog[] = JSON.parse(storedLogs);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const validLogs = parsedLogs.filter(log => new Date(log.dateObj) >= sixMonthsAgo);
      setLogs(validLogs);
      localStorage.setItem('workready_sales_logs', JSON.stringify(validLogs));
    }
    fetchAdminActionedFeedback();
  }, []);

  const fetchAdminActionedFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_rep_feedback')
        .select('*')
        .eq('status', 'Actioned');
      if (!error && data) {
        setAdminActionedItems(data);
      }
    } catch (err) {
      console.warn('Could not fetch admin actioned feedback:', err);
    }
  };

  const handleAddLead = (streamKey: string) => {
    setLeadCounts(prev => ({ ...prev, [streamKey]: prev[streamKey] + 1 }));

    const streamTitle = mockStreams[streamKey]?.title || streamKey;
    const newLog: PerformanceLog = {
      id: Date.now().toString(),
      stream: streamTitle,
      action: `Added 1 new lead to ${streamTitle}`,
      timestamp: new Date().toLocaleString(),
      dateObj: new Date().toISOString(),
      status: 'Completed'
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('workready_sales_logs', JSON.stringify(updatedLogs));
  };

  const handleClearLeads = (streamKey: string) => {
    setLeadCounts(prev => ({ ...prev, [streamKey]: 0 }));
  };

  const currentStream = activeTab !== 'performance' ? mockStreams[activeTab] : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ backgroundColor: '#1e293b', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="Workready Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Workready Portal <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>| Sales Demo</span></h1>
        </div>
        <button 
          onClick={() => setIsFeedbackOpen(true)}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ?? Log Issue / Suggestion
        </button>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setActiveTab('wfa')} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, backgroundColor: activeTab === 'wfa' ? '#2563eb' : '#e2e8f0', color: activeTab === 'wfa' ? '#fff' : '#475569' }}>Workforce Australia</button>
          <button onClick={() => setActiveTab('ttw')} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, backgroundColor: activeTab === 'ttw' ? '#2563eb' : '#e2e8f0', color: activeTab === 'ttw' ? '#fff' : '#475569' }}>TtW Youth</button>
          <button onClick={() => setActiveTab('des')} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, backgroundColor: activeTab === 'des' ? '#2563eb' : '#e2e8f0', color: activeTab === 'des' ? '#fff' : '#475569' }}>DES Flexible</button>

          <button 
            onClick={() => { setActiveTab('performance'); fetchAdminActionedFeedback(); }} 
            style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, marginLeft: 'auto', backgroundColor: activeTab === 'performance' ? '#0f172a' : '#cbd5e1', color: activeTab === 'performance' ? '#fff' : '#334155' }}
          >
            ?? Performance Log ({logs.length + adminActionedItems.length})
          </button>
        </div>

        {activeTab !== 'performance' && currentStream && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Active Caseload</span>
                <h2 style={{ margin: '0.5rem 0 0', fontSize: '1.8rem' }}>{currentStream.caseload}</h2>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Outcomes This Month</span>
                <h2 style={{ margin: '0.5rem 0 0', fontSize: '1.8rem', color: '#16a34a' }}>{currentStream.outcomesThisMonth}</h2>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #2563eb' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Leads Added</span>
                <h2 style={{ margin: '0.5rem 0 1rem', fontSize: '1.8rem', color: '#2563eb' }}>{leadCounts[activeTab]}</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleAddLead(activeTab)} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>+ Add Lead</button>
                  <button onClick={() => handleClearLeads(activeTab)} style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Clear</button>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Compliance Rate</span>
                <h2 style={{ margin: '0.5rem 0 0', fontSize: '1.8rem' }}>{currentStream.complianceRate}</h2>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 1rem' }}>Recent Provider Activity ({currentStream.title})</h3>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#334155', lineHeight: '1.8' }}>
                {currentStream.recentActivity.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>?? Sales Rep Performance & Admin Actions Log</h2>
                <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>Tracks lead activity and feedback items actioned by System Admins. Auto-purges local records after 6 months.</p>
              </div>
              <button 
                onClick={() => { setLogs([]); localStorage.removeItem('workready_sales_logs'); }}
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Clear Local History
              </button>
            </div>

            {logs.length === 0 && adminActionedItems.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No logged events or admin actions yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.75rem' }}>Date/Time</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Description</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminActionedItems.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#f0fdf4' }}>
                      <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>{new Date(item.created_at).toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: '#15803d' }}>Admin Action</td>
                      <td style={{ padding: '0.75rem', color: '#166534' }}>{item.feedback_text}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Actioned by Admin
                        </span>
                      </td>
                    </tr>
                  ))}

                  {logs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>{log.timestamp}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: '#0f172a' }}>{log.stream}</td>
                      <td style={{ padding: '0.75rem', color: '#1e293b' }}>{log.action}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      <SalesRepFeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </div>
  );
}
