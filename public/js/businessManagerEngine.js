// public/js/businessManagerEngine.js
// Business Manager Executive Overview & Seat Management Engine

window.BUSINESS_MANAGER = {
  // Account & Subscription State
  subscription: {
    planName: "Enterprise Provider Tier",
    status: "Active / Paid Up",
    renewalDate: "01-Jan-2027",
    candidateSeatsTotal: 50,
    candidateSeatsUsed: 24,
    caseManagerSeatsTotal: 5,
    caseManagerSeatsUsed: 3
  },

  // Case Managers Staff Roster
  staff: [
    { id: "cm-01", name: "Sarah Jenkins", email: "s.jenkins@workready.org.au", caseload: 10, activeStatus: "Active" },
    { id: "cm-02", name: "David Ross", email: "d.ross@workready.org.au", caseload: 8, activeStatus: "Active" },
    { id: "cm-03", name: "Elena Rostova", email: "e.rostova@workready.org.au", caseload: 6, activeStatus: "Active" }
  ],

  updateSubscriptionUI: function() {
    const subStatus = document.getElementById('bm-sub-status');
    const candSeatsText = document.getElementById('bm-cand-seats-text');
    const candSeatsBar = document.getElementById('bm-cand-seats-bar');
    const cmSeatsText = document.getElementById('bm-cm-seats-text');
    const cmSeatsBar = document.getElementById('bm-cm-seats-bar');

    if (subStatus) subStatus.innerText = `${this.subscription.status} • Renews ${this.subscription.renewalDate}`;
    
    if (candSeatsText) {
      candSeatsText.innerText = `${this.subscription.candidateSeatsUsed} / ${this.subscription.candidateSeatsTotal} Seats Allocated`;
    }
    if (candSeatsBar) {
      const pct = (this.subscription.candidateSeatsUsed / this.subscription.candidateSeatsTotal) * 100;
      candSeatsBar.style.width = `${pct}%`;
    }

    if (cmSeatsText) {
      cmSeatsText.innerText = `${this.subscription.caseManagerSeatsUsed} / ${this.subscription.caseManagerSeatsTotal} Staff Licenses Active`;
    }
    if (cmSeatsBar) {
      const pctCM = (this.subscription.caseManagerSeatsUsed / this.subscription.caseManagerSeatsTotal) * 100;
      cmSeatsBar.style.width = `${pctCM}%`;
    }
  },

  renderStaffRoster: function() {
    const tbody = document.getElementById('bm-staff-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.staff.map(s => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
        <td class="p-3 font-bold text-[#1D2B53]">
          ${s.name}
          <span class="block text-[11px] font-normal text-slate-500">${s.email}</span>
        </td>
        <td class="p-3 font-semibold text-slate-700">${s.caseload} Candidates Assigned</td>
        <td class="p-3">
          <span class="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            ${s.activeStatus}
          </span>
        </td>
        <td class="p-3">
          <button onclick="switchTab('casemanager')" class="px-3 py-1 bg-[#1D2B53] text-white text-xs font-bold rounded hover:bg-slate-800 transition shadow-sm">
            👁️ Inspect Workspace
          </button>
        </td>
      </tr>
    `).join('');
  },

  openOnboardModal: function() {
    const modal = document.getElementById('bm-onboard-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeOnboardModal: function() {
    const modal = document.getElementById('bm-onboard-modal');
    if (modal) modal.classList.add('hidden');
  },

  handleOnboardSubmit: function(e) {
    e.preventDefault();
    const role = document.getElementById('bm-onboard-role').value;
    const name = document.getElementById('bm-onboard-name').value;
    const email = document.getElementById('bm-onboard-email').value;

    if (role === 'case_manager') {
      if (this.subscription.caseManagerSeatsUsed >= this.subscription.caseManagerSeatsTotal) {
        alert("Case Manager seat allocation reached! Please upgrade your subscription to add more staff licenses.");
        return;
      }
      this.subscription.caseManagerSeatsUsed++;
      this.staff.push({
        id: `cm-0${this.staff.length + 1}`,
        name: name,
        email: email,
        caseload: 0,
        activeStatus: "Active"
      });
      this.renderStaffRoster();
      alert(`Case Manager ${name} added! License assigned and setup invitation sent to ${email}.`);
    } else {
      if (this.subscription.candidateSeatsUsed >= this.subscription.candidateSeatsTotal) {
        alert("Candidate seat quota reached! Upgrade your subscription tier to onboard additional candidates.");
        return;
      }
      this.subscription.candidateSeatsUsed++;
      if (window.CASE_MANAGER) {
        window.CASE_MANAGER.candidates.unshift({
          id: `cand-${100 + window.CASE_MANAGER.candidates.length + 1}`,
          name: name,
          email: email,
          phone: "0400 000 000",
          status: "Active",
          pbasPoints: 0,
          pbasStatus: "At Risk",
          cycleStart: new Date().toISOString().slice(0, 10),
          cycleEnd: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 10),
          modulesCompleted: 0,
          interviewsCompleted: 0,
          evidenceSubmitted: 0,
          pendingAction: false,
          pendingActionType: null,
          lastActive: "Invited Just Now"
        });
      }
      alert(`Candidate ${name} onboarded! Allocated seat 1 of 50. Portal access link transmitted to ${email}.`);
    }

    this.updateSubscriptionUI();
    this.closeOnboardModal();
  }
};