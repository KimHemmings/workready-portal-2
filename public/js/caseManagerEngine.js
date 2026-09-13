// public/js/caseManagerEngine.js
// Case Manager Roster, Verification, Reporting & Onboarding Engine

window.CASE_MANAGER = {
  // Roster Data State
  candidates: [
    {
      id: "cand-101",
      name: "Demonstration Candidate",
      email: "demo.candidate@workready.org.au",
      phone: "0400 000 000",
      status: "Active",
      modulesCompleted: 3,
      interviewsCompleted: 2,
      evidenceSubmitted: 1,
      lastActive: "Today at 2:15 PM"
    },
    {
      id: "cand-102",
      name: "Sarah Jenkins",
      email: "s.jenkins@example.com",
      phone: "0412 345 678",
      status: "Active",
      modulesCompleted: 8,
      interviewsCompleted: 3,
      evidenceSubmitted: 4,
      lastActive: "Yesterday at 4:30 PM"
    },
    {
      id: "cand-103",
      name: "Marcus Vance",
      email: "m.vance@example.com",
      phone: "0422 987 654",
      status: "Placed",
      modulesCompleted: 8,
      interviewsCompleted: 4,
      evidenceSubmitted: 6,
      lastActive: "11-Sep-2026"
    }
  ],

  // Filter candidates by Metric Card Click
  filterRoster: function(metricType) {
    const title = document.getElementById('cm-roster-title');
    const tbody = document.getElementById('cm-roster-table-body');
    if (!tbody) return;

    let filtered = [...this.candidates];
    if (metricType === 'active') {
      filtered = this.candidates.filter(c => c.status === 'Active');
      if (title) title.innerText = "Active Caseload Candidates";
    } else if (metricType === 'completed_lms') {
      filtered = this.candidates.filter(c => c.modulesCompleted === 8);
      if (title) title.innerText = "Candidates with All 8 Modules Completed";
    } else if (metricType === 'evidence_pending') {
      filtered = this.candidates.filter(c => c.evidenceSubmitted > 0);
      if (title) title.innerText = "Candidates with Submitted Job Evidence";
    } else if (metricType === 'placed') {
      filtered = this.candidates.filter(c => c.status === 'Placed');
      if (title) title.innerText = "Successfully Placed Candidates";
    } else {
      if (title) title.innerText = "Entire Caseload Roster";
    }

    this.renderRosterTable(filtered);
  },

  renderRosterTable: function(list) {
    const tbody = document.getElementById('cm-roster-table-body');
    if (!tbody) return;

    tbody.innerHTML = list.map(c => `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3 font-bold text-[#1D2B53]">
          ${c.name}
          <span class="block text-[11px] font-normal text-slate-500">${c.email} | ${c.phone}</span>
        </td>
        <td class="p-3">
          <span class="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${c.status === 'Placed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">
            ${c.status}
          </span>
        </td>
        <td class="p-3 font-semibold text-slate-700">${c.modulesCompleted} / 8 Modules</td>
        <td class="p-3 font-semibold text-slate-700">${c.interviewsCompleted} Sessions</td>
        <td class="p-3 font-semibold text-slate-700">${c.evidenceSubmitted} Items</td>
        <td class="p-3 text-slate-500">${c.lastActive}</td>
        <td class="p-3 flex gap-2">
          <button onclick="window.CASE_MANAGER.viewCandidateDossier('${c.id}')" class="px-2.5 py-1 bg-[#1D2B53] text-white text-xs font-bold rounded hover:bg-slate-800 transition">
            👁️ Dossier
          </button>
          <button onclick="window.CASE_MANAGER.quickExportCertificate('${c.name}')" class="px-2.5 py-1 bg-[#4CAF50] text-white text-xs font-bold rounded hover:bg-emerald-600 transition">
            📜 Certs
          </button>
        </td>
      </tr>
    `).join('');
  },

  viewCandidateDossier: function(candId) {
    const candidate = this.candidates.find(c => c.id === candId) || this.candidates[0];
    alert(`Candidate Full Dossier — ${candidate.name}\n\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\nStatus: ${candidate.status}\nLMS Modules Completed: ${candidate.modulesCompleted}/8\nInterview Sessions: ${candidate.interviewsCompleted}\nJob Evidence Logged: ${candidate.evidenceSubmitted} item(s)\n\nAudit Status: Compliant & Verified`);
  },

  quickExportCertificate: function(candidateName) {
    if (window.showCertificate) {
      window.showCertificate("Workplace Rights & Safety (Audit Copy)", 100);
      const nameEl = document.querySelector('#certificate-pdf-element p.text-3xl');
      if (nameEl) nameEl.innerText = candidateName;
    } else {
      alert(`Generating Master Compliance Certificate PDF for ${candidateName}...`);
    }
  },

  downloadCaseloadReport: function() {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Candidate ID,Name,Email,Phone,Status,Modules Completed,Interviews Completed,Evidence Items,Last Active\n"
      + this.candidates.map(c => `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.status}",${c.modulesCompleted},${c.interviewsCompleted},${c.evidenceSubmitted},"${c.lastActive}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Caseload_Compliance_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    e.preventDefault();
    const name = document.getElementById('inv-fullname').value;
    const email = document.getElementById('inv-email').value;
    const phone = document.getElementById('inv-phone').value;

    const newCandidate = {
      id: `cand-${100 + this.candidates.length + 1}`,
      name: name,
      email: email,
      phone: phone || "N/A",
      status: "Active",
      modulesCompleted: 0,
      interviewsCompleted: 0,
      evidenceSubmitted: 0,
      lastActive: "Invited Just Now"
    };

    this.candidates.unshift(newCandidate);
    this.filterRoster('all');
    this.closeInviteModal();

    alert(`Invitation portal link and onboarding credentials successfully transmitted to ${name} (${email})!`);
  }
};