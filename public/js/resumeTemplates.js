// public/js/resumeTemplates.js
// Resume & Cover Letter Template Builders and Exporters

window.addJobEntry = function() {
  const container = document.getElementById('job-entries-container');
  if (!container) return;
  const currentEntries = container.querySelectorAll('.job-entry').length;
  if (currentEntries >= 5) return alert("Maximum limit of 5 work history positions reached.");

  const newIndex = currentEntries + 1;
  const jobRow = document.createElement('div');
  jobRow.className = "job-entry p-3 bg-white border border-slate-200 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-2 relative mt-2";
  jobRow.innerHTML = `
    <div class="md:col-span-3 flex justify-between items-center border-b pb-1">
      <span class="text-xs font-bold text-[#1D2B53]">Position #${newIndex}</span>
      <button type="button" onclick="this.closest('.job-entry').remove()" class="text-xs text-red-600 font-semibold hover:underline">Remove</button>
    </div>
    <input type="text" class="job-title p-2 border rounded text-xs" placeholder="Job Title (e.g. Retail Assistant)">
    <input type="text" class="job-employer p-2 border rounded text-xs" placeholder="Employer (e.g. ABC Stores)">
    <input type="text" class="job-dates p-2 border rounded text-xs" placeholder="Dates (e.g. 2022 - 2024)">
    <textarea class="job-duties md:col-span-3 p-2 border rounded text-xs mt-1" rows="2" placeholder="Key Duties & Achievements"></textarea>
  `;
  container.appendChild(jobRow);
};

window.handleGenerateResume = function(e) {
  e.preventDefault();
  if (window.resumeAttemptsUsed >= window.MAX_ATTEMPTS) return alert("Monthly limit reached.");
  window.resumeAttemptsUsed++;
  if (window.updateQuotaUI) window.updateQuotaUI();

  const name = document.getElementById('res-fullname').value;
  const contact = document.getElementById('res-contact').value;
  const phone = document.getElementById('res-phone').value;
  const title = document.getElementById('resume-target-title').value;
  const licenses = document.getElementById('res-licenses').value;
  const skillsRaw = document.getElementById('resume-skills').value;
  const edu = document.getElementById('res-education').value;
  const references = document.getElementById('res-references').value;
  const gaps = document.getElementById('res-gaps').value;

  const jobRows = document.querySelectorAll('.job-entry');
  let historyHTML = '';
  jobRows.forEach((row) => {
    const jTitle = row.querySelector('.job-title')?.value || '';
    const jEmp = row.querySelector('.job-employer')?.value || '';
    const jDates = row.querySelector('.job-dates')?.value || '';
    const jDuties = row.querySelector('.job-duties')?.value || '';

    if (jTitle || jEmp) {
      historyHTML += `
        <div class="border-l-2 border-[#1D2B53] pl-3 py-1 mb-2">
          <div class="flex justify-between font-bold text-slate-800 text-xs">
            <span>${jTitle} — ${jEmp}</span>
            <span class="text-slate-500 font-normal">${jDates}</span>
          </div>
          <p class="text-slate-600 text-xs mt-1">${jDuties}</p>
        </div>
      `;
    }
  });

  // Populate Document 1: Resume Template
  document.getElementById('tpl-name').innerText = name.toUpperCase();
  document.getElementById('tpl-contact').innerText = `✉️ ${contact}`;
  document.getElementById('tpl-phone').innerText = `📞 ${phone}`;
  document.getElementById('tpl-target').innerText = `TARGET ROLE: ${title.toUpperCase()}`;
  document.getElementById('tpl-summary').innerText = `Dedicated and reliable professional seeking a position as a ${title}. Demonstrates strong workplace communication, WHS awareness, and practical problem-solving capabilities.`;
  document.getElementById('tpl-licenses').innerText = licenses || "White Card, First Aid, Valid Driver License";
  document.getElementById('tpl-skills-list').innerHTML = skillsRaw.split(',').map(s => `<li>${s.trim()}</li>`).join('');
  document.getElementById('tpl-education').innerText = edu || "Year 12 Senior Certificate / Relevant Qualifications";
  document.getElementById('tpl-history-content').innerHTML = historyHTML || '<p class="text-xs text-slate-400 italic">No work history logged.</p>';
  document.getElementById('tpl-references').innerText = references || "Professional references available upon request.";

  // Populate Document 2: Separate Cover Letter Template
  document.getElementById('tpl-cl-name').innerText = name.toUpperCase();
  document.getElementById('tpl-cl-contact').innerText = `${contact} | ${phone}`;
  document.getElementById('tpl-cover-letter-body').innerHTML = `
    <p><strong>To:</strong> The Hiring Manager / Recruitment Team</p>
    <p><strong>RE: Application for ${title} Position</strong></p>
    
    <p>Dear Hiring Manager,</p>
    
    <p>I am writing to formally express my strong interest in applying for the ${title} position. With my practical background in ${skillsRaw}, and holding qualifications in ${licenses}, I bring strong reliability, a commitment to Work Health & Safety (WHS), and a dedicated work ethic to your team.</p>
    
    <p>Throughout my practical employment history, I have developed strong team communication, punctuality, and operational efficiency. I pride myself on maintaining high standards, following supervisor instructions accurately, and adapting quickly to new workplace procedures.</p>
    
    ${gaps ? `<p>During my recent career transition period (${gaps}), I maintained an active focus on personal upskilling, community involvement, and expanding my practical work readiness capabilities.</p>` : ''}
    
    <p>I welcome the opportunity to discuss how my practical skills and tickets align with your team's current goals. Thank you for your time and consideration.</p>
    
    <p>Sincerely,</p>
    <p><strong>${name}</strong><br>${phone} | ${contact}</p>
  `;

  document.getElementById('resume-output-box').classList.remove('hidden');
};

window.downloadResumeWord = function() {
  const content = document.getElementById('resume-document-template').innerHTML;
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent("<html><body>" + content + "</body></html>");
  const fileDownload = document.createElement("a");
  fileDownload.href = source;
  fileDownload.download = 'Resume.doc';
  fileDownload.click();
};

window.downloadCoverLetterWord = function() {
  const content = document.getElementById('cover-letter-document-template').innerHTML;
  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent("<html><body>" + content + "</body></html>");
  const fileDownload = document.createElement("a");
  fileDownload.href = source;
  fileDownload.download = 'Tailored_Cover_Letter.doc';
  fileDownload.click();
};