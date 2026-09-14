import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LogItem {
  id: string;
  created_at: string;
  feedback_text?: string;
  query_text?: string;
  user_email?: string;
  category?: string;
  status: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sysadmin');
  const [inboxTab, setInboxTab] = useState<'sales' | 'business'>('sales');
  const [wcagHighContrast, setWcagHighContrast] = useState(false);
  
  const [salesFeedback, setSalesFeedback] = useState<LogItem[]>([]);
  const [businessQueries, setBusinessQueries] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllLogs();
  }, []);

  const fetchAllLogs = async () => {
    setLoading(true);
    try {
      const { data: salesData } = await supabase
        .from('sales_rep_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (salesData) setSalesFeedback(salesData);

      const { data: bizData } = await supabase
        .from('business_manager_queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (bizData) {
        setBusinessQueries(bizData);
      } else {
        setBusinessQueries([
          {
            id: 'bm-1',
            created_at: new Date().toISOString(),
            query_text: 'Requesting capacity expansion for Sydney Metro employer leads.',
            user_email: 'bizmanager@apm.com.au',
            category: 'Capacity Request',
            status: 'Pending'
          }
        ]);
      }
    } catch (err) {
      console.warn('Supabase fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const markActioned = async (id: string, table: 'sales_rep_feedback' | 'business_manager_queries') => {
    try {
      await supabase.from(table).update({ status: 'Actioned' }).eq('id', id);

      if (table === 'sales_rep_feedback') {
        setSalesFeedback(prev => prev.map(item => item.id === id ? { ...item, status: 'Actioned' } : item));
      } else {
        setBusinessQueries(prev => prev.map(item => item.id === id ? { ...item, status: 'Actioned' } : item));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const exportAuditLogCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Timestamp,Event,User,IP\n2026-09-15 08:00:00,PROVISION_PROVIDER,Admin,192.168.1.1\n2026-09-15 08:15:00,RESET_SANDBOX,Primary Sales Lead,192.168.1.5";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "security_audit_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bgColor = wcagHighContrast ? '#000' : '#f4f6f9';
  const headerBg = wcagHighContrast ? '#0f172a' : '#1e293b';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ backgroundColor: headerBg, color: '#fff', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="Workready Logo" style={{ height: '42px', width: 'auto', backgroundColor: '#fff', padding: '2px', borderRadius: '6px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Work Ready Portal</h1>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Straight Up Training</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => setWcagHighContrast(!wcagHighContrast)}
            style={{ backgroundColor: wcagHighContrast ? '#f59e0b' : '#fbbf24', color: '#000', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            WCAG Contrast
          </button>
          <button 
            onClick={() => navigate('/')} 
            style={{ backgroundColor: '#be123c', color: '#fff', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 2rem', display: 'flex', gap: '2rem' }}>
        {['Candidate Workspace', 'Case Manager Roster', 'Business Workspace', 'System Admin Console'].map((tab) => {
          const isSysAdmin = tab === 'System Admin Console';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(isSysAdmin ? 'sysadmin' : 'other')}
              style={{
                padding: '0.85rem 0.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: isSysAdmin ? 700 : 500,
                color: isSysAdmin ? '#0f172a' : '#64748b',
                borderBottom: isSysAdmin ? '3px solid #16a34a' : '3px solid transparent',
                fontSize: '0.9rem'
              }}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: '#fff', border: '2px solid #ef4444', borderRadius: '12px', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#881337', fontWeight: 700 }}>System Admin Master Command Console</h2>
              <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Provision Employment Providers, monitor seat capacity, track billing renewals, and inspect system audit logs.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={exportAuditLogCSV}
                style={{ backgroundColor: '#1e293b', color: '#fff', border: 'none', padding: '0.55rem 1rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Export Security Audit Log (.CSV)
              </button>
              <button style={{ backgroundColor: '#9f1239', color: '#fff', border: 'none', padding: '0.55rem 1rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                + Invite & Provision Provider
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>ACTIVE PROVIDER ORGS</span>
              <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.8rem', color: '#0f172a' }}>3</h3>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Employment Service Providers Enrolled</span>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>CANDIDATE CAPACITY UTILIZATION</span>
              <h3 style={{ margin: '0.4rem 0 0.5rem', fontSize: '1.3rem', color: '#0f172a' }}>137 / 175 (78%)</h3>
              <div style={{ backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#0f172a', width: '78%', height: '100%' }}></div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>CASE MANAGER STAFF LICENSES</span>
              <h3 style={{ margin: '0.4rem 0 0.5rem', fontSize: '1.3rem', color: '#9333ea' }}>15 / 18 (83%)</h3>
              <div style={{ backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#a855f7', width: '83%', height: '100%' }}></div>
              </div>
            </div>

            <div style={{ backgroundColor: '#fffbebf', padding: '1.25rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
              <span style={{ color: '#854d0e', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>SUBSCRIPTION RENEWAL ALERTS</span>
              <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.1rem', color: '#a16207', fontWeight: 700 }}>1 Due Soon • 1 Overdue</h3>
              <span style={{ fontSize: '0.75rem', color: '#ca8a04' }}>Billing Expirations Tracked</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', border: '2px solid #0284c7', borderRadius: '12px', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0369a1', fontWeight: 700 }}>Sales Representative Credentials & Demo Sandboxes</h3>
              <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Provision dedicated sales licenses, assign demo stream sandboxes, and view lead capture logs.</p>
            </div>
            <button style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.55rem 1rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
              + Assign New Sales Rep
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Sales Rep Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Assigned Work Email</th>
                <th style={{ padding: '0.75rem 1rem' }}>Default Stream Sandbox</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>Primary Sales Lead</td>
                <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>sales@straightuptraining.com</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                    TtW Youth Specialist
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Active
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <button style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                    Reset Sandbox
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: '#fff', border: '2px solid #16a34a', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#15803d', fontWeight: 700 }}>Support Inbox: Sales Demo Logs & Business Manager Queries</h3>
              <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Inspect incoming rep suggestions and Business Manager help requests in real time.</p>
            </div>
            <button onClick={fetchAllLogs} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.45rem 0.85rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
              Refresh Logs
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setInboxTab('sales')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                backgroundColor: inboxTab === 'sales' ? '#16a34a' : '#e2e8f0',
                color: inboxTab === 'sales' ? '#fff' : '#475569'
              }}
            >
              Sales Rep Feedback ({salesFeedback.length})
            </button>
            <button
              onClick={() => setInboxTab('business')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                backgroundColor: inboxTab === 'business' ? '#2563eb' : '#e2e8f0',
                color: inboxTab === 'business' ? '#fff' : '#475569'
              }}
            >
              Business Manager Queries ({businessQueries.length})
            </button>
          </div>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading support logs...</p>
          ) : inboxTab === 'sales' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Submitted</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Feedback Details</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {salesFeedback.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '1rem', fontStyle: 'italic', color: '#94a3b8' }}>No sales rep submissions.</td></tr>
                ) : (
                  salesFeedback.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>{new Date(item.created_at).toLocaleString()}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#1e293b' }}>{item.feedback_text}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ backgroundColor: item.status === 'Actioned' ? '#dcfce7' : '#fef3c7', color: item.status === 'Actioned' ? '#15803d' : '#b45309', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {item.status !== 'Actioned' ? (
                          <button onClick={() => markActioned(item.id, 'sales_rep_feedback')} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                            Mark Actioned
                          </button>
                        ) : (
                          <span style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>Actioned</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Manager Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Query / Request Details</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {businessQueries.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '1rem', fontStyle: 'italic', color: '#94a3b8' }}>No business manager queries logged.</td></tr>
                ) : (
                  businessQueries.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>{new Date(item.created_at).toLocaleString()}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#0f172a', fontWeight: 600 }}>{item.user_email || 'bizmanager@workready.com'}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {item.category || 'General Help'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#1e293b' }}>{item.query_text}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ backgroundColor: item.status === 'Actioned' ? '#dcfce7' : '#fef3c7', color: item.status === 'Actioned' ? '#15803d' : '#b45309', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {item.status !== 'Actioned' ? (
                          <button onClick={() => markActioned(item.id, 'business_manager_queries')} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                            Resolve Query
                          </button>
                        ) : (
                          <span style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}
