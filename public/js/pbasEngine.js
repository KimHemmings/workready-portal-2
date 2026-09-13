// public/js/pbasEngine.js
// DEWR PBAS Compliance Engine — Verifiable Text-Based Activity Engine

window.PBAS_ENGINE = {
  targetPoints: 100,
  targetHours: 15,

  getManualActivities: function() {
    return JSON.parse(localStorage.getItem('workready_pbas_activities') || '[]');
  },

  addActivity: function(type, desc, value) {
    const logs = this.getManualActivities();
    logs.push({
      type: type,
      desc: desc,
      value: value,
      date: new Date().toLocaleDateString('en-AU'),
      verified: false
    });
    localStorage.setItem('workready_pbas_activities', JSON.stringify(logs));
    this.updateCandidateUI();
  },

  calculateProgress: function() {
    const completedMods = JSON.parse(localStorage.getItem('workready_completed_modules') || '[]');
    const loggedJobs = document.querySelectorAll('#evidence-log-table tr').length;
    const manualLogs = this.getManualActivities();

    // 1. Points from LMS Modules & Logged Job Searches
    let pointsFromJobs = loggedJobs * 5; 
    let pointsFromLms = Math.min(5, completedMods.length * 5); 

    // 2. Points from Milestones & Shift Hours
    let pointsFromPaidWork = 0;
    let pointsFromInterviews = 0;
    let pointsFromOther = 0;
    let totalWorkHours = 0;

    manualLogs.forEach(log => {
      if (log.type === 'paid_work') {
        const hours = parseFloat(log.value) || 0;
        totalWorkHours += hours;
        pointsFromPaidWork += Math.ceil(hours / 5) * 5; 
      } else if (log.type === 'interview') {
        pointsFromInterviews += (parseInt(log.value) || 1) * 25; 
      } else if (log.type === 'job_offer') {
        pointsFromOther += 50; 
      } else if (log.type === 'license') {
        pointsFromOther += 20; 
      } else if (log.type === 'voluntary') {
        const vHours = parseFloat(log.value) || 0;
        totalWorkHours += vHours;
        pointsFromOther += Math.min(10, Math.ceil(vHours / 5) * 5); 
      }
    });

    const totalPoints = Math.min(100, pointsFromJobs + pointsFromLms + pointsFromPaidWork + pointsFromInterviews + pointsFromOther);
    const calculatedHours = Math.min(15, totalWorkHours + (completedMods.length * 1.5) + (loggedJobs * 0.5));

    return {
      points: totalPoints,
      hours: Math.round(calculatedHours),
      pointsPercentage: Math.round((totalPoints / this.targetPoints) * 100),
      hoursPercentage: Math.round((Math.min(15, calculatedHours) / this.targetHours) * 100)
    };
  },

  updateCandidateUI: function() {
    const stats = this.calculateProgress();

    const ptsText = document.getElementById('pbas-points-text');
    const ptsBar = document.getElementById('pbas-points-bar');
    const hrsText = document.getElementById('pbas-hours-text');
    const hrsBar = document.getElementById('pbas-hours-bar');
    const statusBadge = document.getElementById('pbas-status-badge');

    if (ptsText) ptsText.innerText = `${stats.points} / ${this.targetPoints} Points`;
    if (ptsBar) ptsBar.style.width = `${stats.pointsPercentage}%`;
    if (hrsText) hrsText.innerText = `${stats.hours} / ${this.targetHours} Hours`;
    if (hrsBar) hrsBar.style.width = `${stats.hoursPercentage}%`;

    if (statusBadge) {
      if (stats.points >= this.targetPoints) {
        statusBadge.className = "px-3 py-1 bg-[#4CAF50] text-white text-xs font-bold rounded-full shadow-sm";
        statusBadge.innerText = "✓ PBAS Target Met (100 Pts)";
      } else if (stats.points >= 50) {
        statusBadge.className = "px-3 py-1 bg-[#FFB74D] text-slate-950 text-xs font-bold rounded-full";
        statusBadge.innerText = "⚠️ On Track (In Progress)";
      } else {
        statusBadge.className = "px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full animate-pulse";
        statusBadge.innerText = "🚨 PBAS Target At Risk";
      }
    }
  },

  openLogActivityModal: function() {
    const modal = document.getElementById('pbas-log-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeLogActivityModal: function() {
    const modal = document.getElementById('pbas-log-modal');
    if (modal) modal.classList.add('hidden');
  },

  handleLogActivitySubmit: function(e) {
    e.preventDefault();
    const type = document.getElementById('pbas-act-type').value;
    const desc = document.getElementById('pbas-act-desc').value;
    const val = document.getElementById('pbas-act-val').value;

    this.addActivity(type, desc, val);
    this.closeLogActivityModal();
    alert("Activity & shift hours logged! Details submitted for Case Manager verification.");
  }
};