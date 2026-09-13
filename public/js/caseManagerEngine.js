// public/js/caseManagerEngine.js
// Case Manager Command Center Engine — Refined UX, PBAS Auditing & Candidate Dossier Tools

window.CASE_MANAGER = {
  // Caseload State
  candidates: [
    {
      id: "cand-101",
      name: "Demonstration Candidate",
      email: "demo.candidate@workready.org.au",
      phone: "0400 000 000",
      status: "Active",
      pbasPoints: 85,
      pbasStatus: "On Track",
      cycleStart: "13-Sep-2026",
      cycleEnd: "13-Oct-2026",
      modulesCompleted: 3,
      interviewsCompleted: 2,
      evidenceSubmitted: 1,
      pendingAction: true,
      pendingActionType: "evidence_verification", // "evidence_verification", "milestone_interview", "milestone_job", "readiness_task"
      lastActive: "Today at 2:15 PM"
    },
    {
      id: "cand-102",
      name: "Sarah Jenkins",
      email: "s.jenkins@example.com",
      phone: "0412 345 678",
      status: "Active",
      pbasPoints: 100,
      pbasStatus: "On Track",
      cycleStart: "01-Sep-2026",
      cycleEnd: "30-Sep-2026",
      modulesCompleted: 8,
      interviewsCompleted: 3,
      evidenceSubmitted: 4,
      pendingAction: true,
      pendingActionType: "milestone_interview",
      lastActive: "Yesterday at 4:30 PM"
    },
    {
      id: "cand-103",
      name: "Marcus Vance",
      email: "m.vance@example.com",
      phone: "0422 987 654",
      status: "Placed",
      pbasPoints: 100,
      pbasStatus: "On Track",
      cycleStart: "15-Aug-2026",
      cycleEnd: "15-Sep-2026",
      modulesCompleted: 8,
      interviewsCompleted: 4,
      evidenceSubmitted: 6,
      pendingAction: false,
      pendingActionType: null,
      lastActive: "11-Sep-2026"
    },
    {
      id: "cand-104",
      name: "Liam O'Connor",
      email: "l.oconnor@example.com",
      phone: "0433 111 222",
      status: "Active",
      pbasPoints: 20,
      pbasStatus: "At Risk",
      cycleStart: "01-Sep-2026",
      cycleEnd: "30-Sep-2026",
      modulesCompleted: 1,
      interviewsCompleted: 0,
      evidenceSubmitted: 0,
      pendingAction: true,
      pendingActionType: "readiness_task",
      lastActive: "6 Days Ago"
    },
    {
      id: "cand-105",
      name: "Emma Watson",
      email: "e.watson@example.com",
      phone: "0455 888 999",
      status: "Active",
      pbasPoints: 35,
      pbasStatus: "At Risk",
      cycleStart: "05-Sep-2026",
      cycleEnd: "05-Oct-2026",
      modulesCompleted: 2,
      interviewsCompleted: 0,
      evidenceSubmitted: 0,
      pendingAction: false,
      pendingActionType: null,
      lastActive: "4 Days Ago"
    }
  ],

  // Filter Roster by Clickable Dashboard Cards & Milestone Buttons
  filterRoster: function(metricType) {
    const title = document.getElementById('cm-roster-title');
    const tbody = document.getElementById('cm-roster-table-body');
    if (!tbody) return;

    let filtered = [...this.candidates];
    if (metricType === 'pbas_ontrack') {
      filtered = this.candidates.filter(c => c.pbasStatus === 'On Track');
      if (title) title.innerText = "PBAS Compliant Candidates (On Track)";
    } else if (metricType === 'pbas_atrisk') {
      filtered = this.candidates.filter(c => c.pbasStatus === 'At Risk');
      if (title) title.innerText = "🚨 PBAS At-Risk Candidates (Requires Action)";
    } else if (metricType === 'review_needed') {
      filtered = this.candidates.filter(c => c.pendingAction === true);
      if (title) title.innerText = "⚠️ Candidates Requiring Case Manager Review & Sign-Off";
    } else if (metricType === 'milestone_interviews') {
      filtered = this.candidates.filter(c => c.pendingActionType === 'milestone_interview' || c.interviewsCompleted > 0);
      if (title) title.innerText = "🎯 Candidate Interview Milestones & Follow-Ups";
    } else if (metricType === 'milestone_jobs') {
      filtered = this.candidates.filter(c => c.status === 'Placed' || c.pendingActionType === 'milestone_job');
      if (title) title.innerText = "🎉 Candidate Job Placement Milestones & Follow-Ups";
    } else if (metricType === 'messages_feed') {
      filtered = this.candidates.filter(c => c.pendingActionType === 'readiness_task' || c.pendingActionType === 'evidence_verification');
      if (title) title.innerText = "💬 Direct Candidate Messages & Task Submissions";
    } else if (metricType === 'completed_lms') {
      filtered = this.candidates.filter(c => c.modulesCompleted === 8);
      if (title) title.innerText = "Candidates with 100% Modules Completed";
    } else {
      if (title) title.innerText = "Entire Caseload Roster";
    }

    this.renderRosterTable(filtered);
  },

  renderRosterTable: function(list) {
    const tbody = document.getElementById('cm-roster-table-body');
    if (!tbody) return;

    tbody.innerHTML = list.map(c => `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="p-3 font-bold text-[#1D2B53] min-w-[200px]">
          ${c.name}
          <span class="block text-[11px] font-normal text-slate-500">${c.email} | ${c.phone}</span>
          <span class="block text-[10px] font-mono text-purple-700">Cycle: ${c.cycleStart} to ${c.cycleEnd}</span>
        </td>
        <td class="p-3 min-w-[120px]">
          <span class="px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-full whitespace-nowrap ${c.status === 'Placed' ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-800'}">
            ${c.status === 'Placed' ? '🎉 Placed' : 'Active'}
          </span>
        </td>
        <td class="p-3 min-w-[170px]">
          <span class="px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-full whitespace-nowrap ${c.pbasStatus === 'On Track' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'}">
            ${c.pbasStatus === 'On Track' ? '✓ ' + c.pbasPoints + ' Pts (On Track)' : '🚨 ' + c.pbasPoints + ' Pts (At Risk)'}
          </span>
        </td>
        <td class="p-3 min-w-[150px]">
          ${c.pendingAction 
            ? `<button onclick="window.CASE_MANAGER.openReviewModal('${c.name}')" title="Click to view and complete required sign-off" class="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-400 text-[11px] font-extrabold rounded-full animate-bounce shadow-sm flex items-center gap-1 cursor-pointer whitespace-nowrap">
                ⚠️ Review Needed
               </button>` 
            : `<span class="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full whitespace-nowrap">✓ Up to Date</span>`}
        </td>
        <td class="p-3 font-semibold text-slate-700 whitespace-nowrap">${c.modulesCompleted}/8 Mods</td>
        <td class="p-3 text-slate-500 text-[11px] whitespace-nowrap">${c.lastActive}</td>
        <td class="p-3">
          <div class="flex flex-wrap gap-1.5 min-w-[320px]">
            ${c.pendingAction 
              ? `<button onclick="window.CASE_MANAGER.openReviewModal('${c.name}')" class="px-2 py-1 bg-[#FFB74D] text-slate-950 text-[11px] font-extrabold rounded hover:bg-amber-400 transition shadow-sm">🔍 Review & Sign Off</button>`
              : ''}
            <button onclick="window.CASE_MANAGER.downloadCandidateResume('${c.name}')" class="px-2 py-1 bg-[#1D2B53] text-white text-[11px] font-bold rounded hover:bg-slate-800 transition">📄 Resume</button>
            <button onclick="window.CASE_MANAGER.downloadCandidateInterviewReport('${c.name}')" class="px-2 py-1 bg-[#9C27B0] text-white text-[11px] font-bold rounded hover:bg-purple-800 transition">🎙️ STAR PDF</button>
            <button onclick="window.CASE_MANAGER.generateTimestampedPBASReport('${c.name}')" class="px-2 py-1 bg-[#4CAF50] text-white text-[11px] font-bold rounded hover:bg-emerald-600 transition">📊 PBAS Dossier</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // Case Manager Action Handlers & Directed Sign-Offs
  openReviewModal: function(candidateName) {
    const cand = this.candidates.find(c => c.name === candidateName);
    let actionDetailText = "Unverified Job Search Log & Monthly Readiness Assessment.";
    
    if (cand && cand.pendingActionType) {
      if (cand.pendingActionType === 'evidence_verification') {
        actionDetailText = "Job Application Log submitted for Bunnings Warehouse (Ref #BN-8821). Needs verification sign-off.";
      } else if (cand.pendingActionType === 'milestone_interview') {
        actionDetailText = "Candidate reported securing an interview with Coles Supermarkets! Requires follow-up confirmation.";
      } else if (cand.pendingActionType === 'milestone_job') {
        actionDetailText = "Candidate reported obtaining employment with ABC Logistics! Requires placement confirmation.";
      } else if (cand.pendingActionType === 'readiness_task') {
        actionDetailText = "Monthly Candidate Job Readiness Assessment completed and pending review.";
      }
    }

    const confirmReview = confirm(`ACTION REQUIRED FOR: ${candidateName.toUpperCase()}\n--------------------------------------------------\nTask Details: ${actionDetailText}\n\nClick OK to complete review, sign off evidence, and mark this candidate file 'Up to Date'.`);
    
    if (confirmReview) {
      if (cand) {
        cand.pendingAction = false;
        cand.pendingActionType = null;
        cand.evidenceSubmitted = Math.max(0, cand.evidenceSubmitted + 1);
        if (cand.pbasPoints < 100) cand.pbasPoints += 10;
        if (cand.pbasPoints >= 50) cand.pbasStatus = "On Track";
      }
      this.filterRoster('all');
      alert(`Action Sign-Off Complete! ${candidateName}'s file is now marked 'Up to Date' and their PBAS score refreshed.`);
    }
  },

  downloadCandidateResume: function(candidateName) {
    alert(`Downloading Master Resume & Cover Letter Document for ${candidateName} (.doc format)...`);
    if (window.downloadResumeWord) window.downloadResumeWord();
  },

  downloadCandidateInterviewReport: function(candidateName) {
    alert(`Downloading STAR Mock Interview Evaluation Report for ${candidateName} (PDF format)...`);
    if (window.downloadInterviewPDF) window.downloadInterviewPDF();
  },

  generateTimestampedPBASReport: function(candidateName) {
    const cand = this.candidates.find(c => c.name === candidateName) || this.candidates[0];
    const now = new Date();
    const timestampStr = now.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) + " at " + now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) + " AEST";

    const csvContent = "data:text/csv;charset=utf-8," 
      + `WORKFORCE AUSTRALIA OFFICIAL PBAS COMPLIANCE DOSSIER\n`
      + `Candidate Name,${cand.name}\n`
      + `Email,${cand.email}\n`
      + `Phone,${cand.phone}\n`
      + `Reporting Cycle,${cand.cycleStart} to ${cand.cycleEnd}\n`
      + `Audit Timestamp,${timestampStr}\n`
      + `Verified PBAS Points,${cand.pbasPoints} / 100 Pts\n`
      + `Compliance Risk Status,${cand.pbasStatus.toUpperCase()}\n`
      + `LMS Modules Completed,${cand.modulesCompleted} / 8\n`
      + `Mock Interviews Attended,${cand.interviewsCompleted}\n`
      + `Job Search Logs Verified,${cand.evidenceSubmitted}\n`
      + `Audit Hash,#PBAS-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PBAS_Dossier_${cand.name.replace(/\s+/g, '_')}_${now.toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadCaseloadReport: function() {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Candidate ID,Name,Email,Phone,Status,Reporting Cycle Start,Reporting Cycle End,PBAS Points,PBAS Risk Status,Review Needed,Modules Completed,Interviews Completed,Evidence Items,Last Active\n"
      + this.candidates.map(c => `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.status}","${c.cycleStart}","${c.cycleEnd}",${c.pbasPoints},"${c.pbasStatus}",${c.pendingAction},${c.modulesCompleted},${c.interviewsCompleted},${c.evidenceSubmitted},"${c.lastActive}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Caseload_Full_Compliance_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  openInviteModal: function() {
    const modal = document.getElementById('cm-invite-modal');
    if (modal) {
      const startInput = document.getElementById('inv-cycle-start');
      const endInput = document.getElementById('inv-cycle-end');
      const today = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(today.getDate() + 30);

      if (startInput) startInput.value = today.toISOString().slice(0, 10);
      if (endInput) endInput.value = thirtyDays.toISOString().slice(0, 10);

      modal.classList.remove('hidden');
    }
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
    const cycleStart = document.getElementById('inv-cycle-start').value;
    const cycleEnd = document.getElementById('inv-cycle-end').value;

    const newCandidate = {
      id: `cand-${100 + this.candidates.length + 1}`,
      name: name,
      email: email,
      phone: phone || "N/A",
      status: "Active",
      pbasPoints: 0,
      pbasStatus: "At Risk",
      cycleStart: cycleStart,
      cycleEnd: cycleEnd,
      modulesCompleted: 0,
      interviewsCompleted: 0,
      evidenceSubmitted: 0,
      pendingAction: false,
      pendingActionType: null,
      lastActive: "Invited Just Now"
    };

    this.candidates.unshift(newCandidate);
    this.filterRoster('all');
    this.closeInviteModal();

    alert(`Candidate ${name} successfully onboarded!\nAssigned Reporting Cycle: ${cycleStart} to ${cycleEnd}\nPortal access link transmitted to ${email}.`);
  }
};