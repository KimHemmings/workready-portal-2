// public/js/helpEngine.js
// Universal Role-Scoped Help & Escalation Engine

window.HELP_ENGINE = {
  tickets: JSON.parse(localStorage.getItem('workready_help_tickets') || '[]'),

  openHelpModal: function(role) {
    const modal = document.getElementById('universal-help-modal');
    const title = document.getElementById('help-modal-title');
    const desc = document.getElementById('help-modal-desc');
    const targetLabel = document.getElementById('help-target-label');
    const roleInput = document.getElementById('help-sender-role');

    if (!modal) {
      alert("Help modal element missing from DOM.");
      return;
    }

    if (roleInput) roleInput.value = role;

    if (role === 'jobseeker') {
      if (title) title.innerText = "💬 Need Help? Contact Your Case Manager";
      if (desc) desc.innerText = "Have questions about your PBAS target, job search logging, or LMS modules? Send a direct message to your assigned Case Manager.";
      if (targetLabel) targetLabel.innerText = "Assigned Recipient: Case Manager (Sarah Jenkins)";
    } else if (role === 'case_manager') {
      if (title) title.innerText = "⚙️ Case Manager Technical Support";
      if (desc) desc.innerText = "Need assistance with candidate file unlocking, PBAS overrides, or account issues? Submit a support ticket directly to the System Admin.";
      if (targetLabel) targetLabel.innerText = "Assigned Recipient: System Administrator";
    } else if (role === 'business_manager') {
      if (title) title.innerText = "🏢 Executive Support & License Escalation";
      if (desc) desc.innerText = "Request additional candidate seats, staff license upgrades, or custom compliance exports from System Administration.";
      if (targetLabel) targetLabel.innerText = "Assigned Recipient: System Administrator / Platform Support";
    }

    modal.classList.remove('hidden');
  },

  closeHelpModal: function() {
    const modal = document.getElementById('universal-help-modal');
    if (modal) modal.classList.add('hidden');
  },

  submitHelpTicket: function(e) {
    e.preventDefault();
    const roleEl = document.getElementById('help-sender-role');
    const topicEl = document.getElementById('help-topic-select');
    const messageEl = document.getElementById('help-message-text');

    const role = roleEl ? roleEl.value : 'jobseeker';
    const topic = topicEl ? topicEl.value : 'General Query';
    const message = messageEl ? messageEl.value : '';

    const now = new Date();
    const timestampStr = now.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' }) + " " + now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

    const newTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      role: role,
      topic: topic,
      message: message,
      timestamp: timestampStr,
      status: "Open"
    };

    this.tickets.unshift(newTicket);
    localStorage.setItem('workready_help_tickets', JSON.stringify(this.tickets));

    if (role === 'jobseeker') {
      const feed = document.getElementById('cm-messages-feed');
      if (feed) {
        const card = document.createElement('div');
        card.className = "p-3 bg-amber-50 border border-amber-300 rounded text-xs space-y-1 mt-2";
        card.innerHTML = `
          <div class="flex justify-between font-bold text-[#1D2B53]">
            <span>🚨 CANDIDATE HELP REQUEST [${topic}]</span>
            <span class="text-slate-400 font-normal">${timestampStr}</span>
          </div>
          <p class="text-slate-700"><strong>From:</strong> Demonstration Candidate</p>
          <p class="text-slate-600 italic">"${message}"</p>
        `;
        feed.prepend(card);
      }
      if (window.CASE_MANAGER) {
        const cand = window.CASE_MANAGER.candidates.find(c => c.id === 'cand-101');
        if (cand) {
          cand.pendingAction = true;
          cand.pendingActionType = 'readiness_task';
          window.CASE_MANAGER.filterRoster('all');
        }
      }
      alert("Help request transmitted to your Case Manager! They have been notified on their command center.");
    } else {
      const adminLog = document.getElementById('admin-tickets-log');
      if (adminLog) {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 transition border-b text-xs";
        row.innerHTML = `
          <td class="p-2.5 font-bold font-mono text-[#1D2B53]">${newTicket.id}</td>
          <td class="p-2.5 font-semibold text-slate-800">${role === 'case_manager' ? 'Case Manager' : 'Business Manager'}</td>
          <td class="p-2.5">${topic}</td>
          <td class="p-2.5 text-slate-600 truncate max-w-xs">${message}</td>
          <td class="p-2.5 text-slate-400">${timestampStr}</td>
          <td class="p-2.5"><span class="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">Open</span></td>
        `;
        adminLog.prepend(row);
      }
      alert(`Support ticket #${newTicket.id} submitted to System Admin console!`);
    }

    this.closeHelpModal();
    if (messageEl) messageEl.value = '';
  }
};