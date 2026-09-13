// public/js/caseManagerEngine.js
// Case Manager Caseload Management & Compliance Override Engine

window.CASE_MANAGER = {
  candidates: [
    {
      id: "cand_demo_01",
      name: "Demonstration Candidate",
      email: "candidate@workready.org.au",
      cycleDates: "01-Sep-2026 to 30-Sep-2026",
      status: "Active",
      statusClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      pbasPoints: 100,
      pbasTarget: 100,
      pbasHours: 15,
      pbasHoursTarget: 15,
      pbasStatus: "On Track",
      pbasBadgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      actionStatus: "Up to Date",
      actionClass: "bg-slate-100 text-slate-700",
      lmsCompleted: 8,
      lmsTotal: 8,
      lastActive: "Today 14:15",
      hasMilestoneInterview: false,
      hasMilestoneJob: false
    },
    {
      id: "cand_102",
      name: "Michael Taylor",
      email: "m.taylor@example.com",
      cycleDates: "05-Sep-2026 to 04-Oct-2026",
      status: "Review Needed",
      statusClass: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
      pbasPoints: 45,
      pbasTarget: 100,
      pbasHours: 6,
      pbasHoursTarget: 15,
      pbasStatus: "At Risk",
      pbasBadgeClass: "bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-bold",
      actionStatus: "Pending Assessment",
      actionClass: "bg-amber-100 text-amber-900 font-bold",
      lmsCompleted: 3,
      lmsTotal: 8,
      lastActive: "Yesterday",
      hasMilestoneInterview: true,
      hasMilestoneJob: false
    },
    {
      id: "cand_103",
      name: "Jessica Watson",
      email: "j.watson@example.com",
      cycleDates: "10-Sep-2026 to 09-Oct-2026",
      status: "Active",
      statusClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      pbasPoints: 100,
      pbasTarget: 100,
      pbasHours: 20,
      pbasHoursTarget: 15,
      pbasStatus: "On Track",
      pbasBadgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      actionStatus: "Placed (Bunnings)",
      actionClass: "bg-purple-100 text-purple-900 font-bold",
      lmsCompleted: 8,
      lmsTotal: 8,
      lastActive: "12-Sep-2026",
      hasMilestoneInterview: true,
      hasMilestoneJob: true
    }
  ],

  filterRoster: function(filterType) {
    const title = document.getElementById('cm-roster-title');
    let list = [...this.candidates];

    if (filterType === 'pbas_ontrack') {
      list = this.candidates.filter(c => c.pbasStatus === 'On Track');
      if (title) title.innerText = "Caseload Roster — PBAS On Track Candidates";
    } else if (filterType === 'pbas_atrisk') {
      list = this.candidates.filter(c => c.pbasStatus === 'At Risk');
      if (title) title.innerText = "🚨 Caseload Roster — PBAS At Risk (Requires Intervention)";
    } else if (filterType === 'review_needed') {
      list = this.candidates.filter(c => c.status === 'Review Needed');
      if (title) title.innerText = "⚠️ Caseload Roster — Pending Review / Monthly Tasks";
    } else if (filterType === 'milestone_interviews') {
      list = this.candidates.filter(c => c.hasMilestoneInterview);
      if (title) title.innerText = "🎯 Candidate Milestones — Recent Job Interviews";
    } else if (filterType === 'milestone_jobs') {
      list = this.candidates.filter(c => c.hasMilestoneJob);
      if (title) title.innerText = "🎉 Candidate Milestones — Successful Job Placements";
    } else {
      if (title) title.innerText = "Entire Caseload Roster";
    }

    this.renderRosterTable(list);
  },

  renderRosterTable: function(list) {
    const tbody = document.getElementById('cm-roster-table-body');
    if (!tbody) return;

    // Check active provider stream code
    let streamCode = 'workforce_australia';
    if (window.PROVIDER_CONTEXT && window.PROVIDER_CONTEXT.manifests) {
      const activeProv = window.PROVIDER_CONTEXT.manifests[window.PROVIDER_CONTEXT.activeProviderId];
      if (activeProv) streamCode = activeProv.stream;
    }

    tbody.innerHTML = list.map(c => {
      // Evaluate target dynamically considering stream and CM overrides
      let effectiveTarget = { pointsTarget: c.pbasTarget, hoursTarget: c.pbasHoursTarget, isAdjusted: false };
      if (window.COMPLIANCE_ENGINE && window.COMPLIANCE_ENGINE.getCandidateTarget) {
        effectiveTarget = window.COMPLIANCE_ENGINE.getCandidateTarget(c.id, streamCode);
      }

      const lmsPct = Math.round((c.lmsCompleted / c.lmsTotal) * 100);

      return `
        <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
          <td class="p-3 font-bold text-[#1D2B53]">
            ${c.name}
            <span class="block text-[11px] font-normal text-slate-500">${c.email}</span>
            <span class="block text-[10px] font-mono text-purple-700">Cycle: ${c.cycleDates}</span>
          </td>
          <td class="p-3">
            <span class="px-2.5 py-1 text-[10px] uppercase rounded-full border ${c.statusClass}">
              ${c.status}
            </span>
          </td>
          <td class="p-3 min-w-[170px]">
            <div class="font-bold text-slate-800">
              ${c.pbasPoints} / ${effectiveTarget.pointsTarget} Pts 
              <span class="text-[10px] text-slate-500 font-normal">(${c.pbasHours}/${effectiveTarget.hoursTarget} Hrs)</span>
            </div>
            ${effectiveTarget.isAdjusted ? `<span class="text-[10px] font-bold text-purple-700 block">✓ CM Credit Applied</span>` : ''}
            <span class="inline-block mt-1 px-2 py-0.5 text-[10px] rounded border ${c.pbasBadgeClass}">
              ${c.pbasStatus}
            </span>
          </td>
          <td class="p-3">
            <span class="px-2.5 py-1 text-[10px] rounded-full border ${c.actionClass}">
              ${c.actionStatus}
            </span>
          </td>
          <td class="p-3">
            <div class="font-bold text-slate-700">${c.lmsCompleted} / ${c.lmsTotal} (${lmsPct}%)</div>
            <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1 max-w-[100px]">
              <div class="bg-[#4CAF50] h-full" style="width: ${lmsPct}%"></div>
            </div>
          </td>
          <td class="p-3 text-slate-500 font-mono text-[11px]">${c.lastActive}</td>
          <td class="p-3">
            <div class="flex flex-wrap gap-1.5">
              <button onclick="window.COMPLIANCE_ENGINE.openAdjustmentModal('${c.id}', '${c.name}')" class="px-2.5 py-1 bg-[#1D2B53] text-white text-[11px] font-bold rounded hover:bg-slate-800 transition shadow">
                ⚙️ Override Target
              </button>
              <button onclick="window.CASE_MANAGER.exportCandidateDossier('${c.id}')" class="px-2.5 py-1 bg-[#4CAF50] text-white text-[11px] font-bold rounded hover:bg-emerald-600 transition shadow">
                📄 Export Dossier
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openInviteModal: function() {
    const modal = document.getElementById('cm-invite-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeInviteModal: function() {
    const modal = document.getElementById('cm-invite-modal');
    if (modal) modal.classList.add('hidden');
  },

  handleSendInvite: function(e) {
    if (e && e.preventDefault) e.preventDefault();

    const name = document.getElementById('inv-fullname').value;
    const email = document.getElementById('inv-email').value;
    const startDate = document.getElementById('inv-cycle-start').value;
    const endDate = document.getElementById('inv-cycle-end').value;

    const newCandidate = {
      id: `cand_${Date.now()}`,
      name: name,
      email: email,
      cycleDates: `${startDate} to ${endDate}`,
      status: "Active",
      statusClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      pbasPoints: 0,
      pbasTarget: 100,
      pbasHours: 0,
      pbasHoursTarget: 15,
      pbasStatus: "At Risk",
      pbasBadgeClass: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
      actionStatus: "Newly Onboarded",
      actionClass: "bg-blue-100 text-blue-800 font-bold",
      lmsCompleted: 0,
      lmsTotal: 8,
      lastActive: "Invited Today",
      hasMilestoneInterview: false,
      hasMilestoneJob: false
    };

    this.candidates.unshift(newCandidate);

    if (window.SYSTEM_ADMIN && window.SYSTEM_ADMIN.logSecurityEvent) {
      window.SYSTEM_ADMIN.logSecurityEvent("Case Manager", "Case Manager", "CANDIDATE_ONBOARDED", `Invited ${name} (${email})`);
    }

    this.filterRoster('all');
    this.closeInviteModal();
    alert(`Candidate '${name}' successfully onboarded and assigned 30-day reporting cycle (${startDate} to ${endDate}). Portal invitation link sent to ${email}.`);
  },

  exportCandidateDossier: function(candId) {
    const c = this.candidates.find(cand => cand.id === candId) || this.candidates[0];
    alert(`Generating official DEWR PBAS Compliance Dossier for ${c.name}...\n\nIncludes verified job search logs, interviewSTAR reports, LMS certificates, and Case Manager sign-off hashes.`);
  },

  downloadCaseloadReport: function() {
    const csvContent = "data:text/csv;charset=utf-8," 
      + `WORKREADY PORTAL V2 — CASELOAD COMPLIANCE REPORT EXPORT\n`
      + `Export Date,13-Sep-2026\n`
      + `Candidate Name,Email,Cycle Dates,Status,PBAS Points,PBAS Hours,PBAS Status,LMS Modules\n`
      + this.candidates.map(c => `"${c.name}","${c.email}","${c.cycleDates}","${c.status}","${c.pbasPoints}","${c.pbasHours}","${c.pbasStatus}","${c.lmsCompleted}/8"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Caseload_Compliance_Report_13Sep2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};