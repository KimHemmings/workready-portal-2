// public/js/systemAdminEngine.js
// System Admin Master Console with TtW & Inclusive Provider Provisioning

window.SYSTEM_ADMIN = {
  providers: [
    {
      id: "PROV-101",
      name: "Straight Up Training Shell",
      contactName: "Sarah Jenkins",
      email: "s.jenkins@straightuptraining.com.au",
      planTier: "TtW Youth Specialist Provider",
      serviceStream: "Transition to Work (TtW)",
      candidateSeatsTotal: 50,
      candidateSeatsUsed: 24,
      cmSeatsTotal: 5,
      cmSeatsUsed: 3,
      subscriptionStatus: "Active",
      renewalDate: "2026-10-01",
      lastBilled: "2025-10-01"
    },
    {
      id: "PROV-102",
      name: "Apex Inclusive Employment",
      contactName: "Mark Robinson",
      email: "m.robinson@apexemployment.org.au",
      planTier: "Inclusive Disability Employment",
      serviceStream: "Disability / DES Inclusive",
      candidateSeatsTotal: 100,
      candidateSeatsUsed: 88,
      cmSeatsTotal: 10,
      cmSeatsUsed: 9,
      subscriptionStatus: "Active",
      renewalDate: "2026-12-15",
      lastBilled: "2025-12-15"
    },
    {
      id: "PROV-103",
      name: "Workforce Direct QLD",
      contactName: "Emma Vance",
      email: "e.vance@workforcedirect.com.au",
      planTier: "General Workforce Australia",
      serviceStream: "Workforce Australia",
      candidateSeatsTotal: 25,
      candidateSeatsUsed: 25,
      cmSeatsTotal: 3,
      cmSeatsUsed: 3,
      subscriptionStatus: "Overdue",
      renewalDate: "2026-08-31",
      lastBilled: "2025-08-31"
    }
  ],

  auditLogs: [
    {
      id: "LOG-9901",
      timestamp: "13-Sep-2026 14:15:02",
      actor: "Sarah Jenkins (Case Manager)",
      role: "Case Manager",
      action: "EVIDENCE_VERIFICATION_SIGNOFF",
      target: "Demonstration Candidate (Bunnings Log)",
      ipAddress: "203.0.113.42",
      status: "SUCCESS",
      hash: "#HASH-88A92"
    }
  ],

  initConsole: function() {
    this.renderCapacityMetrics();
    this.renderProviderTable(this.providers);
    this.renderAuditLogsTable(this.auditLogs);
  },

  renderCapacityMetrics: function() {
    let totalCandSeatsAllocated = 0;
    let totalCandSeatsCapacity = 0;
    let totalCMSeatsAllocated = 0;
    let totalCMSeatsCapacity = 0;
    let dueSoonCount = 0;
    let overdueCount = 0;

    const today = new Date("2026-09-13");

    this.providers.forEach(p => {
      totalCandSeatsAllocated += p.candidateSeatsUsed;
      totalCandSeatsCapacity += p.candidateSeatsTotal;
      totalCMSeatsAllocated += p.cmSeatsUsed;
      totalCMSeatsCapacity += p.cmSeatsTotal;

      const renewal = new Date(p.renewalDate);
      const diffDays = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));

      if (p.subscriptionStatus === 'Overdue' || diffDays < 0) {
        overdueCount++;
      } else if (diffDays <= 30) {
        dueSoonCount++;
      }
    });

    const candPct = Math.round((totalCandSeatsAllocated / totalCandSeatsCapacity) * 100) || 0;
    const cmPct = Math.round((totalCMSeatsAllocated / totalCMSeatsCapacity) * 100) || 0;

    const totalProvEl = document.getElementById('admin-prov-count');
    const candSeatsEl = document.getElementById('admin-cand-capacity-text');
    const candBarEl = document.getElementById('admin-cand-capacity-bar');
    const cmSeatsEl = document.getElementById('admin-cm-capacity-text');
    const cmBarEl = document.getElementById('admin-cm-capacity-bar');
    const renewalsEl = document.getElementById('admin-renewals-text');

    if (totalProvEl) totalProvEl.innerText = this.providers.length;
    if (candSeatsEl) candSeatsEl.innerText = `${totalCandSeatsAllocated} / ${totalCandSeatsCapacity} (${candPct}%)`;
    if (candBarEl) candBarEl.style.width = `${candPct}%`;
    if (cmSeatsEl) cmSeatsEl.innerText = `${totalCMSeatsAllocated} / ${totalCMSeatsCapacity} (${cmPct}%)`;
    if (cmBarEl) cmBarEl.style.width = `${cmPct}%`;
    if (renewalsEl) renewalsEl.innerText = `${dueSoonCount} Due Soon • ${overdueCount} Overdue`;
  },

  renderProviderTable: function(list) {
    const tbody = document.getElementById('admin-provider-table-body');
    if (!tbody) return;

    const today = new Date("2026-09-13");

    tbody.innerHTML = list.map(p => {
      const renewal = new Date(p.renewalDate);
      const diffDays = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
      
      let badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
      let badgeText = `Active (Due in ${diffDays}d)`;

      if (p.subscriptionStatus === 'Overdue' || diffDays < 0) {
        badgeClass = "bg-rose-100 text-rose-800 border-rose-300 animate-pulse";
        badgeText = `⚠️ Overdue (${p.renewalDate})`;
      } else if (diffDays <= 30) {
        badgeClass = "bg-amber-100 text-amber-900 border-amber-300 font-bold";
        badgeText = `⚠️ Renewing Soon (${p.renewalDate})`;
      }

      const candCapPct = Math.round((p.candidateSeatsUsed / p.candidateSeatsTotal) * 100);

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
          <td class="p-3 font-bold text-[#1D2B53]">
            ${p.name}
            <span class="block text-[11px] font-normal text-slate-500">Contact: ${p.contactName} (${p.email})</span>
            <span class="block text-[10px] font-mono text-purple-700">Stream: ${p.serviceStream || 'Transition to Work (TtW)'}</span>
          </td>
          <td class="p-3 min-w-[140px]">
            <span class="px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-full border ${badgeClass}">
              ${badgeText}
            </span>
          </td>
          <td class="p-3 min-w-[160px]">
            <div class="font-bold text-slate-800">${p.candidateSeatsUsed} / ${p.candidateSeatsTotal} Seats (${candCapPct}%)</div>
            <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
              <div class="bg-[#1D2B53] h-full" style="width: ${candCapPct}%"></div>
            </div>
          </td>
          <td class="p-3 font-bold text-slate-700">
            ${p.cmSeatsUsed} / ${p.cmSeatsTotal} Staff Licenses
          </td>
          <td class="p-3">
            <div class="flex flex-wrap gap-1.5">
              <button onclick="window.SYSTEM_ADMIN.editProviderAccess('${p.id}')" class="px-2.5 py-1 bg-[#1D2B53] text-white text-[11px] font-bold rounded hover:bg-slate-800 transition">
                ⚙️ TtW Setup
              </button>
              <button onclick="window.SYSTEM_ADMIN.renewSubscription('${p.id}')" class="px-2.5 py-1 bg-[#4CAF50] text-white text-[11px] font-bold rounded hover:bg-emerald-600 transition">
                🔄 Renew Tier
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openProviderModal: function() {
    const modal = document.getElementById('admin-provider-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeProviderModal: function() {
    const modal = document.getElementById('admin-provider-modal');
    if (modal) modal.classList.add('hidden');
  },

  handleCreateProvider: function(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameEl = document.getElementById('prov-name');
    const contactEl = document.getElementById('prov-contact-name');
    const emailEl = document.getElementById('prov-email');
    const tierEl = document.getElementById('prov-tier');
    const streamEl = document.getElementById('prov-stream');
    const candSeatsEl = document.getElementById('prov-cand-seats');
    const cmSeatsEl = document.getElementById('prov-cm-seats');

    const name = nameEl ? nameEl.value : "New Provider";
    const contactName = contactEl ? contactEl.value : "Admin Contact";
    const email = emailEl ? emailEl.value : "admin@provider.com.au";
    const tier = tierEl ? tierEl.value : "Enterprise Provider";
    const stream = streamEl ? streamEl.value : "Transition to Work (TtW)";
    const candSeats = candSeatsEl ? parseInt(candSeatsEl.value) || 50 : 50;
    const cmSeats = cmSeatsEl ? parseInt(cmSeatsEl.value) || 5 : 5;

    const newProvider = {
      id: `PROV-${100 + this.providers.length + 1}`,
      name: name,
      contactName: contactName,
      email: email,
      planTier: tier,
      serviceStream: stream,
      candidateSeatsTotal: candSeats,
      candidateSeatsUsed: 0,
      cmSeatsTotal: cmSeats,
      cmSeatsUsed: 1,
      subscriptionStatus: "Active",
      renewalDate: "2027-09-13",
      lastBilled: "2026-09-13"
    };

    this.providers.unshift(newProvider);

    if (window.PROVIDER_CONTEXT && window.PROVIDER_CONTEXT.manifests) {
      const streamCode = stream.includes("TtW") ? "ttw" : stream.includes("DES") ? "des" : "workforce_australia";
      window.PROVIDER_CONTEXT.manifests[newProvider.id] = {
        id: newProvider.id,
        name: name,
        stream: streamCode,
        streamLabel: stream,
        brandNavy: "#1D2B53",
        brandGreen: "#4CAF50",
        enabledModules: ["mod-1", "mod-2", "mod-3", "mod-4", "mod-5"],
        allowedActivities: [
          { value: "paid_work", label: "Paid Work Shifts (+5 Pts / 5 Hrs)" },
          { value: "interview", label: "Attended Job Interview (+25 Pts)" }
        ],
        complianceFooter: `${stream} Licensee Shell`
      };

      const selectorEl = document.getElementById('admin-provider-selector');
      if (selectorEl) {
        const opt = document.createElement('option');
        opt.value = newProvider.id;
        opt.innerText = `${name} (${stream})`;
        selectorEl.appendChild(opt);
      }
    }

    if (this.logSecurityEvent) {
      this.logSecurityEvent("System Admin", "System Admin", "TTW_PROVIDER_PROVISIONING", `Created ${stream} Provider ${name}`);
    }

    this.initConsole();
    this.closeProviderModal();

    alert(`Provider Organization '${name}' (${stream}) successfully onboarded and configured!\nAccount Credentials & Access Setup sent to ${email}.`);
  },

  editProviderAccess: function(provId) {
    const p = this.providers.find(prov => prov.id === provId);
    if (!p) return;

    const newCandCap = prompt(`CONFIGURE ACCESS: ${p.name}\n\nEnter new Candidate Seat Capacity:`, p.candidateSeatsTotal);
    if (newCandCap !== null) {
      p.candidateSeatsTotal = parseInt(newCandCap) || p.candidateSeatsTotal;
      this.logSecurityEvent("System Admin", "System Admin", "ACCESS_CAPACITY_UPDATE", `Updated Candidate Capacity for ${p.name} to ${p.candidateSeatsTotal}`);
      this.initConsole();
      alert(`Candidate seat capacity for ${p.name} updated to ${p.candidateSeatsTotal}.`);
    }
  },

  renewSubscription: function(provId) {
    const p = this.providers.find(prov => prov.id === provId);
    if (!p) return;

    const confirmRenew = confirm(`RENEW SUBSCRIPTION: ${p.name}\n\nExtend subscription billing cycle for 12 months?`);
    if (confirmRenew) {
      p.subscriptionStatus = "Active";
      p.renewalDate = "2027-09-13";
      this.logSecurityEvent("System Admin", "System Admin", "SUBSCRIPTION_RENEWAL", `Extended Subscription for ${p.name} to 2027-09-13`);
      this.initConsole();
      alert(`Subscription for ${p.name} extended to 13-Sep-2027. Status reset to Active.`);
    }
  },

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

  filterLogs: function(filterType) {
    const title = document.getElementById('admin-logs-title');
    let filtered = [...this.auditLogs];

    if (filterType === 'security_overrides') {
      filtered = this.auditLogs.filter(l => l.action.includes('VERIFICATION') || l.action.includes('OVERRIDE'));
      if (title) title.innerText = "Audit Trail: Security & Evidence Sign-Offs";
    } else if (filterType === 'seat_provisioning') {
      filtered = this.auditLogs.filter(l => l.action.includes('SEAT') || l.action.includes('PROVISIONING'));
      if (title) title.innerText = "Audit Trail: License & Seat Provisioning";
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

  exportAuditLogsCSV: function() {
    const now = new Date();
    const csvContent = "data:text/csv;charset=utf-8," 
      + `WORKREADY PORTAL V2 — MASTER SECURITY AUDIT LOG EXPORT\n`
      + `Export Date,13-Sep-2026\n`
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