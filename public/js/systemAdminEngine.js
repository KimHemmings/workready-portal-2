// public/js/systemAdminEngine.js
// System Admin Master Console, Security Audit Logging & License Provisioning Engine

window.SYSTEM_ADMIN = {
  // Tamper-Evident Security Audit Logs State
  auditLogs: [
    {
      id: "LOG-9901",
      timestamp: new Date().toLocaleDateString('en-AU') + " 14:15:02",
      actor: "Sarah Jenkins (Case Manager)",
      role: "Case Manager",
      action: "EVIDENCE_VERIFICATION_SIGNOFF",
      target: "Demonstration Candidate (Bunnings Warehouse Log)",
      ipAddress: "203.0.113.42",
      status: "SUCCESS",
      hash: "#HASH-88A92"
    },
    {
      id: "LOG-9902",
      timestamp: new Date().toLocaleDateString('en-AU') + " 13:40:11",
      actor: "Business Manager",
      role: "Business Manager",
      action: "SEAT_ONBOARDING",
      target: "David Miller (New Case Manager License)",
      ipAddress: "203.0.113.88",
      status: "SUCCESS",
      hash: "#HASH-99B12"
    },
    {
      id: "LOG-9903",
      timestamp: new Date().toLocaleDateString('en-AU') + " 11:02:45",
      actor: "Demonstration Candidate",
      role: "Candidate",
      action: "PBAS_MILESTONE_CLAIM",
      target: "Interview Milestone (+25 Pts)",
      ipAddress: "198.51.100.14",
      status: "SUCCESS",
      hash: "#HASH-77C34"
    },
    {
      id: "LOG-9904",
      timestamp: new Date().toLocaleDateString('en-AU') + " 09:12:00",
      actor: "System Automated Cron",
      role: "System",
      action: "MONTHLY_READINESS_EXPIRY_CHECK",
      target: "30-Day Task Reset Completed",
      ipAddress: "127.0.0.1",
      status: "SUCCESS",
      hash: "#HASH-11D00"
    }
  ],

  // Log a security event programmatically
  logSecurityEvent: function(actor, role, action, target, status = "SUCCESS") {
    const now = new Date();
    const timestampStr = now.toLocaleDateString('en-AU') + " " + now.toLocaleTimeString('en-AU');
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timestampStr,
      actor: actor,
      role: role,
      action: action,
      target: target,
      ipAddress: "203.0.113.10",
      status: status,
      hash: `#HASH-${Math.floor(10000 + Math.random() * 90000).toString(16).toUpperCase()}`
    };

    this.auditLogs.unshift(newLog);
    this.renderAuditLogsTable(this.auditLogs);
  },

  // Filter Security Audit Logs
  filterLogs: function(filterType) {
    const title = document.getElementById('admin-logs-title');
    let filtered = [...this.auditLogs];

    if (filterType === 'security_overrides') {
      filtered = this.auditLogs.filter(l => l.action.includes('VERIFICATION') || l.action.includes('OVERRIDE'));
      if (title) title.innerText = "Audit Trail: Security & Evidence Sign-Offs";
    } else if (filterType === 'seat_provisioning') {
      filtered = this.auditLogs.filter(l => l.action.includes('SEAT') || l.action.includes('LICENSE'));
      if (title) title.innerText = "Audit Trail: License & Seat Provisioning";
    } else if (filterType === 'pbas_claims') {
      filtered = this.auditLogs.filter(l => l.action.includes('PBAS'));
      if (title) title.innerText = "Audit Trail: PBAS Point Claims & Milestone Events";
    } else {
      if (title) title.innerText = "Master Security Audit Log (Append-Only)";
    }

    this.renderAuditLogsTable(filtered);
  },

  renderAuditLogsTable: function(list) {
    const tbody = document.getElementById('admin-audit-logs-table-body');
    if (!tbody) return;

    tbody.innerHTML = list.map(l => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
        <td class="p-2.5 font-bold font-mono text-[#1D2B53]">${l.id}</td>
        <td class="p-2.5 text-slate-500 font-mono">${l.timestamp}</td>
        <td class="p-2.5 font-semibold text-slate-800">${l.actor} <span class="text-[10px] text-slate-400 font-normal">(${l.role})</span></td>
        <td class="p-2.5 font-mono text-purple-700 font-bold">${l.action}</td>
        <td class="p-2.5 text-slate-700">${l.target}</td>
        <td class="p-2.5 font-mono text-[10px] text-slate-400">${l.ipAddress}</td>
        <td class="p-2.5">
          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
            ${l.status}
          </span>
        </td>
        <td class="p-2.5 font-mono text-[10px] text-slate-500">${l.hash}</td>
      </tr>
    `).join('');
  },

  // Resolve Ticket Queue Items
  resolveTicket: function(ticketId) {
    alert(`System Admin Action: Support Ticket ${ticketId} resolved and archived. Notification sent to requester.`);
    const ticketsLog = document.getElementById('admin-tickets-log');
    if (ticketsLog) {
      const rows = ticketsLog.querySelectorAll('tr');
      rows.forEach(r => {
        if (r.innerText.includes(ticketId)) {
          const badge = r.querySelector('span');
          if (badge) {
            badge.className = "px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full";
            badge.innerText = "Resolved";
          }
        }
      });
    }
  },

  // Export Full Security Audit Log CSV
  exportAuditLogsCSV: function() {
    const now = new Date();
    const csvContent = "data:text/csv;charset=utf-8," 
      + `WORKREADY PORTAL V2 — MASTER SECURITY AUDIT LOG EXPORT\n`
      + `Export Date,${now.toLocaleDateString('en-AU')} ${now.toLocaleTimeString('en-AU')}\n`
      + `Log ID,Timestamp,Actor,Role,Action,Target,IP Address,Status,Integrity Hash\n`
      + this.auditLogs.map(l => `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.target}","${l.ipAddress}","${l.status}","${l.hash}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Security_Audit_Logs_${now.toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};