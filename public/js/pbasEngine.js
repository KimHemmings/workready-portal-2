// public/js/pbasEngine.js
// Dynamic Stream & Case Manager Target Adjustment PBAS Engine

window.PBAS_ENGINE = {
  getDynamicTarget: function() {
    // 1. Get active provider stream code
    let streamCode = 'workforce_australia';
    if (window.PROVIDER_CONTEXT && window.PROVIDER_CONTEXT.manifests) {
      const activeProv = window.PROVIDER_CONTEXT.manifests[window.PROVIDER_CONTEXT.activeProviderId];
      if (activeProv) streamCode = activeProv.stream;
    }

    // 2. Check if Case Manager applied an override for the current candidate
    if (window.COMPLIANCE_ENGINE && window.COMPLIANCE_ENGINE.getCandidateTarget) {
      return window.COMPLIANCE_ENGINE.getCandidateTarget("cand_demo_01", streamCode);
    }

    // 3. Fallback defaults by stream
    if (streamCode === 'ttw') return { pointsTarget: 80, hoursTarget: 25, isAdjusted: false, adjustmentReason: "TtW Youth Stream Baseline" };
    if (streamCode === 'des') return { pointsTarget: 50, hoursTarget: 8, isAdjusted: false, adjustmentReason: "DES Inclusive Stream Baseline" };
    return { pointsTarget: 100, hoursTarget: 15, isAdjusted: false, adjustmentReason: "Standard DEWR Target" };
  },

  updateCandidateUI: function() {
    const target = this.getDynamicTarget();
    
    // Get logged activities
    const logs = JSON.parse(localStorage.getItem('workready_pbas_logs') || '[]');
    let earnedPoints = 0;
    let earnedHours = 0;

    logs.forEach(l => {
      earnedPoints += (l.points || 0);
      earnedHours += (l.hours || 0);
    });

    // Check completed LMS modules (+10 pts each)
    const completedMods = JSON.parse(localStorage.getItem('workready_completed_modules') || '[]');
    earnedPoints += (completedMods.length * 10);
    earnedHours += (completedMods.length * 2);

    const ptsPct = Math.min(100, Math.round((earnedPoints / target.pointsTarget) * 100)) || 0;
    const hrsPct = Math.min(100, Math.round((earnedHours / target.hoursTarget) * 100)) || 0;

    // Update PBAS UI elements
    const ptsText = document.getElementById('pbas-points-text');
    const ptsBar = document.getElementById('pbas-points-bar');
    const hrsText = document.getElementById('pbas-hours-text');
    const hrsBar = document.getElementById('pbas-hours-bar');
    const badge = document.getElementById('pbas-status-badge');

    if (ptsText) ptsText.innerText = `${earnedPoints} / ${target.pointsTarget} Points ${target.isAdjusted ? '(CM Credit Applied)' : ''}`;
    if (ptsBar) ptsBar.style.width = `${ptsPct}%`;
    if (hrsText) hrsText.innerText = `${earnedHours} / ${target.hoursTarget} Hours`;
    if (hrsBar) hrsBar.style.width = `${hrsPct}%`;

    if (badge) {
      if (earnedPoints >= target.pointsTarget) {
        badge.className = "px-3 py-1 bg-[#4CAF50] text-white text-xs font-bold rounded-full shadow-sm";
        badge.innerText = "✓ PBAS Target Met";
      } else {
        badge.className = "px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm animate-pulse";
        badge.innerText = `⚠️ ${target.pointsTarget - earnedPoints} Pts Needed`;
      }
    }
  },

  openLogActivityModal: function() {
    document.getElementById('pbas-log-modal').classList.remove('hidden');
  },

  closeLogActivityModal: function() {
    document.getElementById('pbas-log-modal').classList.add('hidden');
  },

  handleLogActivitySubmit: function(e) {
    e.preventDefault();
    const type = document.getElementById('pbas-act-type').value;
    const desc = document.getElementById('pbas-act-desc').value;
    const val = parseFloat(document.getElementById('pbas-act-val').value) || 0;

    let pts = 5;
    let hrs = val;

    if (type === 'interview') pts = 25;
    if (type === 'ttw_education') pts = 25;
    if (type === 'ttw_work_experience') pts = 20;
    if (type === 'license') pts = 20;
    if (type === 'paid_work') pts = Math.floor(val / 5) * 5 || 5;

    const logs = JSON.parse(localStorage.getItem('workready_pbas_logs') || '[]');
    logs.push({ type, desc, hours: hrs, points: pts, date: new Date().toLocaleDateString('en-AU') });
    localStorage.setItem('workready_pbas_logs', JSON.stringify(logs));

    this.updateCandidateUI();
    this.closeLogActivityModal();
    alert(`Logged ${desc}! Earned +${pts} PBAS Points and ${hrs} Activity Hours.`);
  }
};