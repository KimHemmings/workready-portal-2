// public/js/complianceAdjustmentEngine.js
// Case Manager Target Override & Program Rule Adjustment Engine

window.COMPLIANCE_ENGINE = {
  // Candidate Specific Target Overrides
  overrides: JSON.parse(localStorage.getItem('workready_target_overrides') || '{}'),

  // Get effective target for candidate considering provider stream and CM overrides
  getCandidateTarget: function(candidateId, providerStream) {
    // Default DEWR standard baseline
    let target = {
      pointsTarget: 100,
      hoursTarget: 15,
      jobSearchTarget: 4,
      isAdjusted: false,
      adjustmentReason: "Standard DEWR Target"
    };

    // Stream-level contract baseline defaults
    if (providerStream === 'ttw') {
      target.pointsTarget = 80;
      target.hoursTarget = 25; // Focus on full-time/part-time study & placement hours
      target.jobSearchTarget = 2;
      target.adjustmentReason = "TtW Youth Stream Contract Baseline";
    } else if (providerStream === 'des') {
      target.pointsTarget = 50;
      target.hoursTarget = 8;  // Focus on partial work capacity / supported hours
      target.jobSearchTarget = 0; // Flexible health & accommodation focus
      target.adjustmentReason = "DES / Inclusive Stream Baseline";
    }

    // Apply Case Manager Specific Override if active
    if (this.overrides[candidateId]) {
      const ov = this.overrides[candidateId];
      target.pointsTarget = ov.pointsTarget;
      target.hoursTarget = ov.hoursTarget;
      target.jobSearchTarget = ov.jobSearchTarget;
      target.isAdjusted = true;
      target.adjustmentReason = `CM Adjustment: ${ov.reason}`;
    }

    return target;
  },

  openAdjustmentModal: function(candidateId, candidateName) {
    const activeStream = (window.PROVIDER_CONTEXT && window.PROVIDER_CONTEXT.manifests[window.PROVIDER_CONTEXT.activeProviderId]) 
      ? window.PROVIDER_CONTEXT.manifests[window.PROVIDER_CONTEXT.activeProviderId].stream 
      : 'workforce_australia';

    const currentTarget = this.getCandidateTarget(candidateId, activeStream);

    document.getElementById('cm-adj-cand-id').value = candidateId;
    document.getElementById('cm-adj-cand-name').innerText = candidateName;
    document.getElementById('cm-adj-points').value = currentTarget.pointsTarget;
    document.getElementById('cm-adj-hours').value = currentTarget.hoursTarget;
    document.getElementById('cm-adj-jobs').value = currentTarget.jobSearchTarget;
    document.getElementById('cm-adj-reason').value = currentTarget.isAdjusted ? currentTarget.adjustmentReason.replace("CM Adjustment: ", "") : "";

    document.getElementById('cm-target-adjust-modal').classList.remove('hidden');
  },

  closeAdjustmentModal: function() {
    document.getElementById('cm-target-adjust-modal').classList.add('hidden');
  },

  saveAdjustment: function(e) {
    e.preventDefault();
    const candId = document.getElementById('cm-adj-cand-id').value;
    const points = parseInt(document.getElementById('cm-adj-points').value) || 0;
    const hours = parseFloat(document.getElementById('cm-adj-hours').value) || 0;
    const jobs = parseInt(document.getElementById('cm-adj-jobs').value) || 0;
    const reason = document.getElementById('cm-adj-reason').value;

    this.overrides[candId] = {
      pointsTarget: points,
      hoursTarget: hours,
      jobSearchTarget: jobs,
      reason: reason,
      updatedBy: "Sarah Jenkins (Case Manager)",
      timestamp: new Date().toLocaleDateString('en-AU')
    };

    localStorage.setItem('workready_target_overrides', JSON.stringify(this.overrides));

    if (window.SYSTEM_ADMIN && window.SYSTEM_ADMIN.logSecurityEvent) {
      window.SYSTEM_ADMIN.logSecurityEvent("Case Manager", "Case Manager", "TARGET_CREDIT_ADJUSTMENT", `Adjusted targets for ${candId}: ${points} pts, ${hours} hrs (${reason})`);
    }

    if (window.PBAS_ENGINE) window.PBAS_ENGINE.updateCandidateUI();
    if (window.CASE_MANAGER) window.CASE_MANAGER.filterRoster('all');

    this.closeAdjustmentModal();
    alert(`Personal Circumstances Credit applied for candidate!\n\nNew Targets: ${points} PBAS Points | ${hours} Hours | ${jobs} Job Searches\nReason: ${reason}`);
  }
};