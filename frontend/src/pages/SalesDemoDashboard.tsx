import React, { useState } from 'react';
import SalesRepFeedbackModal from '../components/SalesRepFeedbackModal';

interface StreamData {
  title: string;
  caseload: number;
  outcomesThisMonth: number;
  leadsAdded: number;
  complianceRate: string;
  recentActivity: string[];
}

const mockStreams: Record<string, StreamData> = {
  wfa: {
    title: 'Workforce Australia',
    caseload: 142,
    outcomesThisMonth: 18,
    leadsAdded: 34,
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
    leadsAdded: 21,
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
    leadsAdded: 15,
    complianceRate: '98%',
    recentActivity: [
      'Approved Workplace Accommodation Grant',
      'Completed 26-Week Outcome Claim',
      'Added 2 inclusive employer leads'
    ]
  }
};

export default function SalesDemoDashboard() {
  const [activeStream, setActiveStream] = useState<string>('wfa');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  const data = mockStreams[activeStream];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Workready Branded Header */}
      <header style={{ backgroundColor: '#1e293b', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#2563eb', padding: '0.5rem 0.75rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.2rem' }}>WR</div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600 }}>Workready Portal <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 400 }}>| Sales Demo</span></h1>
        </div>
        <button 
          onClick={() => setIsFeedbackOpen(true)}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ?? Log Issue / Suggestion
        </button>
      </header>

      {/* Main Container */}
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Stream Selector Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {Object.keys(mockStreams).map((key) => (
            <button
              key={key}
              onClick={() => setActiveStream(key)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                backgroundColor: activeStream === key ? '#2563eb' : '#e2e8f0',
                color: activeStream === key ? '#fff' : '#475569',
                transition: 'all 0.2s ease'
              }}
            >
              {mockStreams[key].title}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Active Caseload</span>
            <h2 style={{ margin: '0.5rem 0 0', fontSize: '1.8rem', color: '#0f172a' }}>{data.caseload}</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Outcomes This Month</span>
            <h2 style={{ margin: '0.5rem 0 0', fontSize: '1.8rem', color: '#16a34a' }}>{data.outcomesThisMonth}</h2>
          </div>
          {/* NEW LEADS ADDED METRIC */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #2563eb' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Leads Added</span>
            <h2 style={{ margin: '0.5rem 0 0', fontSize: '1.8rem', color: '#2563eb' }}>{data.leadsAdded}</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Compliance Rate</span>
            <h2 style={{ margin: '0.5rem 0 0', fontSize: '1.8rem', color: '#0f172a' }}>{data.complianceRate}</h2>
          </div>
        </div>

        {/* Recent Stream Activity */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#0f172a' }}>Recent Provider Activity ({data.title})</h3>
          <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#334155', lineHeight: '1.8' }}>
            {data.recentActivity.map((act, idx) => (
              <li key={idx}>{act}</li>
            ))}
          </ul>
        </div>
      </main>

      {/* Rep Feedback Modal Component */}
      <SalesRepFeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </div>
  );
}
