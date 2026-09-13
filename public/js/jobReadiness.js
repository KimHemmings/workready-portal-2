// public/js/jobReadiness.js
// Monthly Job Readiness Indicator Engine & Case Manager Feed Transmitter

window.JOB_READINESS = {
  checkMonthlyStatus: function() {
    const lastSubmitted = localStorage.getItem('workready_readiness_timestamp');
    const isSubmittedThisMonth = localStorage.getItem('workready_readiness_completed') === 'true';
    const tag = document.getElementById('baseline-status-tag');
    const btn = document.getElementById('baseline-submit-btn');

    if (!lastSubmitted || this.isExpired(lastSubmitted)) {
      // Monthly task is pending / due for re-assessment
      localStorage.setItem('workready_readiness_completed', 'false');
      if (tag) {
        tag.innerText = "Monthly Re-Assessment Due";
        tag.className = "px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full animate-pulse";
      }
      if (btn) {
        btn.innerText = "⚠️ Complete Monthly Job Readiness Assessment";
        btn.disabled = false;
        btn.className = "w-full py-2.5 bg-[#9C27B0] text-white font-bold rounded-lg hover:bg-purple-800 transition shadow-md";
      }
    } else if (isSubmittedThisMonth) {
      // Re-load saved stars and lock until next month
      this.loadSavedStars();
      if (tag) {
        tag.innerText = "Submitted for This Month";
        tag.className = "px-3 py-1 bg-[#4CAF50]/20 text-[#4CAF50] text-xs font-bold rounded-full";
      }
      if (btn) {
        btn.innerText = "✓ Monthly Task Completed (Transmitted to Case Manager)";
        btn.disabled = true;
        btn.className = "w-full py-2.5 bg-slate-300 text-slate-600 font-bold rounded-lg cursor-not-allowed";
      }
    }
  },

  isExpired: function(timestampStr) {
    const lastDate = new Date(timestampStr);
    const now = new Date();
    // 30 days expiry threshold
    const diffDays = (now - lastDate) / (1000 * 60 * 60 * 24);
    return diffDays >= 30;
  },

  loadSavedStars: function() {
    const saved = JSON.parse(localStorage.getItem('workready_readiness_scores') || '{}');
    if (saved.interview) {
      document.getElementById('baseline-interview-stars').innerText = "⭐".repeat(saved.interview) + "☆".repeat(5 - saved.interview);
    }
    if (saved.resume) {
      document.getElementById('baseline-resume-stars').innerText = "⭐".repeat(saved.resume) + "☆".repeat(5 - saved.resume);
    }
    if (saved.safety) {
      document.getElementById('baseline-safety-stars').innerText = "⭐".repeat(saved.safety) + "☆".repeat(5 - saved.safety);
    }
  },

  submitAssessment: function(e) {
    e.preventDefault();
    const intStars = parseInt(document.getElementById('sel-base-interview').value);
    const resStars = parseInt(document.getElementById('sel-base-resume').value);
    const safeStars = parseInt(document.getElementById('sel-base-safety').value);

    // Save locally
    const now = new Date();
    localStorage.setItem('workready_readiness_timestamp', now.toISOString());
    localStorage.setItem('workready_readiness_completed', 'true');
    localStorage.setItem('workready_readiness_scores', JSON.stringify({
      interview: intStars,
      resume: resStars,
      safety: safeStars
    }));

    // Update UI elements
    this.loadSavedStars();
    this.checkMonthlyStatus();
    this.closeModal();

    // Transmit assessment report to Case Manager Feed
    this.transmitToCaseManager(intStars, resStars, safeStars, now);
    alert("Monthly Job Readiness Indicator submitted! A copy of your self-assessment has been transmitted to your Case Manager.");
  },

  transmitToCaseManager: function(intStars, resStars, safeStars, dateObj) {
    const feed = document.getElementById('cm-messages-feed');
    if (feed) {
      const dateStr = dateObj.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) + " " + dateObj.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
      const card = document.createElement('div');
      card.className = "p-3 bg-purple-50 border border-purple-200 rounded text-xs space-y-2 mt-2";
      card.innerHTML = `
        <div class="flex justify-between font-bold text-[#1D2B53]">
          <span>📊 MONTHLY JOB READINESS ASSESSMENT</span>
          <span class="text-slate-400 font-normal">${dateStr}</span>
        </div>
        <p class="text-slate-700"><strong>Candidate:</strong> Demonstration Candidate</p>
        <div class="grid grid-cols-3 gap-1 p-2 bg-white rounded border border-purple-100 text-[11px]">
          <div><strong>Interview:</strong> ${intStars}/5 ⭐</div>
          <div><strong>Resume:</strong> ${resStars}/5 ⭐</div>
          <div><strong>Safety:</strong> ${safeStars}/5 ⭐</div>
        </div>
      `;
      feed.prepend(card);
    }
  },

  openModal: function() {
    const isSubmitted = localStorage.getItem('workready_readiness_completed') === 'true';
    if (isSubmitted && !this.isExpired(localStorage.getItem('workready_readiness_timestamp'))) {
      alert("Your Monthly Job Readiness Indicator for this 30-day period is already locked and submitted.");
      return;
    }
    document.getElementById('baseline-modal').classList.remove('hidden');
  },

  closeModal: function() {
    document.getElementById('baseline-modal').classList.add('hidden');
  }
};