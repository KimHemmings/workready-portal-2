import React, { useEffect } from 'react';
import { ShieldCheck, Printer, Download, CheckCircle2, XCircle, RotateCcw, X, FileText, Award, Building2, Briefcase } from 'lucide-react';

interface EvidenceInspectorProps {
  selectedReport: any;
  activeCandidate: any;
  onClose: () => void;
  onApprove: (id: string, points: number, candidateId: string) => void;
  onReject: (id: string) => void;
  onUndo: (id: string, points: number, candidateId: string) => void;
}

export const EvidenceInspectorModal: React.FC<EvidenceInspectorProps> = ({
  selectedReport,
  activeCandidate,
  onClose,
  onApprove,
  onReject,
  onUndo
}) => {
  if (!selectedReport) return null;

  // ESC Key Dismissal Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const todayStr = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const retentionExpiry = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Explicit Type Classification
  const rawType = (selectedReport.type || '').toLowerCase();
  const rawTitle = (selectedReport.title || '').toLowerCase();

  const isLms = rawType.includes('lms') || rawType.includes('micro') || rawTitle.includes('whs') || rawTitle.includes('module');
  const isJobSearch = rawType.includes('job search') || rawType.includes('placement') || rawTitle.includes('retail co') || rawTitle.includes('specialist');
  const isInterview = rawType.includes('interview') || rawTitle.includes('star') || rawTitle.includes('warehouse role');

  const absoluteLogoUrl = `${window.location.origin}/logo.png`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadFormattedCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let certContentHtml = '';

    if (isLms) {
      certContentHtml = `
        <div class="cert-badge">OFFICIAL CERTIFICATE OF ACHIEVEMENT</div>
        <p style="font-size: 11px; color: #64748b; margin-top: 10px; font-weight: 700;">THIS OFFICIAL TRAINING RECORD PROUDLY CERTIFIES THAT</p>
        <div class="student-name">${activeCandidate?.name || 'Participant'}</div>
        <p style="font-size: 10px; color: #64748b;">has successfully completed all learning content, branching scenarios, and practical assessments for:</p>
        <div class="course-title">${selectedReport.title || 'LMS Micro-credential Module'}</div>
        <div class="meta-grid">
          <div><div class="label">Document Ref</div><div class="value">${selectedReport.reference || selectedReport.refId || 'SUT-M01-2026'}</div></div>
          <div><div class="label">Completion Date</div><div class="value">${selectedReport.date || selectedReport.submitted || todayStr}</div></div>
          <div><div class="label">PBAS Credit</div><div class="value" style="color: #16a34a;">+${selectedReport.points || 10} Points</div></div>
          <div><div class="label">Audit Status</div><div class="value" style="color: #16a34a;">Verified Record</div></div>
        </div>
      `;
    } else if (isJobSearch) {
      certContentHtml = `
        <div class="cert-badge" style="background: #047857;">OFFICIAL JOB SEARCH VERIFICATION RECORD</div>
        <p style="font-size: 11px; color: #64748b; margin-top: 10px; font-weight: 700;">DEWR COMPLIANCE EVIDENCE AUDIT SLIP FOR</p>
        <div class="student-name">${activeCandidate?.name || 'Participant'}</div>
        <p style="font-size: 11px; color: #1e1b4b; font-weight: 800; margin-top: 5px;">APPLICATION TITLE: ${selectedReport.title || 'Job Search Claim'}</p>
        <div class="meta-grid" style="background: #f0fdf4; border-color: #bbf7d0;">
          <div><div class="label">Employer</div><div class="value">${selectedReport.employer || 'Retail Co / Business Partner'}</div></div>
          <div><div class="label">Submission Date</div><div class="value">${selectedReport.date || selectedReport.submitted || todayStr}</div></div>
          <div><div class="label">Points Credit</div><div class="value" style="color: #16a34a;">+${selectedReport.points || 5} Points</div></div>
          <div><div class="label">Verification Method</div><div class="value">Direct Confirmation</div></div>
        </div>
      `;
    } else {
      certContentHtml = `
        <div class="cert-badge" style="background: #7e22ce;">OFFICIAL AI BEHAVIORAL INTERVIEW EVALUATION REPORT</div>
        <p style="font-size: 11px; color: #64748b; margin-top: 10px; font-weight: 700;">BEHAVIORAL INTERVIEW MOCK PRACTICE EVALUATION RECORD FOR</p>
        <div class="student-name">${activeCandidate?.name || 'Participant'}</div>
        <div class="course-title">${selectedReport.title || 'STAR Interview Practice Session'}</div>
        <div class="meta-grid" style="background: #faf5ff; border-color: #e9d5ff;">
          <div><div class="label">Document Ref</div><div class="value">${selectedReport.reference || selectedReport.refId || 'STAR-981204'}</div></div>
          <div><div class="label">Completion Date</div><div class="value">${selectedReport.date || selectedReport.submitted || todayStr}</div></div>
          <div><div class="label">PBAS Credit</div><div class="value" style="color: #16a34a;">+${selectedReport.points || 25} Points</div></div>
          <div><div class="label">AI Rubric Score</div><div class="value" style="color: #7e22ce;">88% Passed</div></div>
        </div>
      `;
    }

    const certHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DEWR Audit Evidence - ${activeCandidate?.name || 'Participant'}</title>
        <style>
          @page { size: landscape; margin: 0; }
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1e1b4b; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .cert-border { border: 10px solid #24083b; outline: 3px solid #eab308; padding: 30px 40px; border-radius: 16px; background: #ffffff; text-align: center; box-sizing: border-box; width: 100%; max-width: 1050px; margin: 0 auto; }
          .header-logos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .logo-box { width: 120px; height: 70px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 6px; display: flex; align-items: center; justify-content: center; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .logo-img { width: 100%; height: 100%; object-fit: contain; }
          .cert-badge { color: #ffffff; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; display: inline-block; background: #24083b; }
          .student-name { font-size: 32px; font-weight: 900; color: #1e1b4b; margin: 15px 0 10px 0; border-bottom: 3px solid #eab308; display: inline-block; padding-bottom: 4px; }
          .course-title { font-size: 18px; font-weight: 900; color: #24083b; margin: 15px 0; text-transform: uppercase; }
          .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; border: 1px solid #fef08a; padding: 12px 18px; border-radius: 12px; margin-top: 20px; text-align: left; }
          .label { font-size: 9px; text-transform: uppercase; color: #854d0e; font-weight: 800; }
          .value { font-size: 12px; font-weight: 800; color: #1e1b4b; margin-top: 2px; }
          .footer { margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; text-align: left; }
        </style>
      </head>
      <body>
        <div class="cert-border">
          <div class="header-logos">
            <div class="logo-box">
              <img src="${absoluteLogoUrl}" alt="Straight Up Training Logo" class="logo-img" onerror="this.onerror=null; this.parentElement.innerHTML='<strong style=&quot;color:#24083b; font-size:18px;&quot;>SU TRAINING</strong>';" />
            </div>
            <span style="font-size: 16px; font-weight: 900; color: #24083b; letter-spacing: 0.5px;">STRAIGHT UP TRAINING</span>
            <div class="logo-box">
              <strong style="color:#24083b; font-size:12px; text-align:center;">EMPLOYMENT<br/>PARTNER</strong>
            </div>
          </div>

          ${certContentHtml}

          <div class="footer">
            <div>
              <strong>Case Manager Sign-Off:</strong> Casey Smith (Provider Representative)<br/>
              <strong>Verification Timestamp:</strong> ${todayStr} 08:37 PM AEST<br/>
              <strong>Data Retention Expiry:</strong> ${retentionExpiry} (3-Year Auto-Purge Schedule)
            </div>
            <div style="text-align: right; font-family: monospace;">
              DIGITAL SEAL: SIG-2026-DEWR-VERIFIED<br/>
              COMPLIANCE CERTIFIED RECORD
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(certHtml);
    printWindow.document.close();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto font-sans text-xs">
        
        {/* MODAL HEADER */}
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 text-[10px] font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-700" /> DEWR Official Audit Evidence Inspector
            </span>
            <h3 className="font-extrabold text-lg text-[#24083b] mt-1">
              {selectedReport.title || 'Submitted Evidence Artifact'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-purple-800" /> Print PDF (Landscape)
            </button>
            <button
              onClick={handleDownloadFormattedCertificate}
              className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-purple-200" /> Download Styled Certificate
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 font-bold">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BRANCH 1: LMS MODULE GOLD LANDSCAPE CERTIFICATE VIEW */}
        {isLms && (
          <div className="p-8 bg-white border-4 border-[#24083b] ring-4 ring-amber-400 rounded-2xl text-center space-y-4 shadow-md relative max-w-3xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="w-28 h-16 bg-white rounded-xl p-1 border border-amber-200 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                <img src={absoluteLogoUrl} alt="Logo" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div className="text-center">
                <h4 className="font-black text-base tracking-tight text-[#24083b]">STRAIGHT UP TRAINING</h4>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[9px] font-bold">
                  IN PARTNERSHIP WITH EMPLOYMENT PARTNERS
                </span>
              </div>
              <div className="w-28 h-16 bg-purple-50 rounded-xl p-1 border border-purple-200 flex items-center justify-center text-purple-900 font-extrabold text-xs text-center shrink-0">
                EMPLOYMENT PARTNER
              </div>
            </div>

            <div className="inline-block px-3.5 py-1 bg-purple-950 text-white font-black text-[11px] rounded-full uppercase tracking-wider shadow-xs">
              ðŸ† Official Certificate of Achievement
            </div>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              This Official Training Record Proudly Certifies That
            </p>

            <h2 className="text-2xl font-black text-[#24083b] border-b-2 border-amber-400 pb-1 inline-block px-6">
              {activeCandidate?.name || 'Alex Mercer'}
            </h2>

            <p className="text-[11px] text-slate-500 font-medium max-w-md mx-auto">
              has successfully completed all learning content, branching scenarios, and practical assessments for:
            </p>

            <h3 className="text-base font-black text-[#24083b] uppercase max-w-lg mx-auto leading-snug">
              {selectedReport.title || 'Understanding Employer Expectations & Workplace Culture'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-left text-xs font-semibold mt-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-amber-800 block">Document Ref</span>
                <span className="font-mono text-purple-950 font-bold">{selectedReport.reference || selectedReport.refId || 'SUT-M01-2026'}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-amber-800 block">Completion Date</span>
                <span className="text-slate-800 font-bold">{selectedReport.date || selectedReport.submitted || todayStr}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-amber-800 block">PBAS Credit</span>
                <span className="text-emerald-700 font-extrabold">+{selectedReport.points || 10} Pts</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-amber-800 block">Verification</span>
                <span className="text-emerald-700 font-bold">Verified Record</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Audited by Case Manager: <strong>Casey Smith</strong></span>
              <span className="font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Retention Expiry: {retentionExpiry} (3-Year Auto-Purge Schedule)
              </span>
            </div>
          </div>
        )}

        {/* BRANCH 2: JOB SEARCH & PLACEMENT EVIDENCE CARD */}
        {isJobSearch && !isLms && (
          <div className="p-6 bg-emerald-50/40 border border-emerald-200 rounded-2xl space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 font-semibold bg-white p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Participant Name:</span>
                <span className="text-slate-900 font-bold">{activeCandidate?.name || 'Alex Mercer'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Workforce Australia ID:</span>
                <span className="font-mono text-purple-900">{activeCandidate?.waId || 'WA-882190'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Points Credit:</span>
                <span className="text-emerald-600 font-extrabold">+{selectedReport.points || 5} PBAS Pts</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Status:</span>
                <span className={`font-bold ${selectedReport.status === 'Verified' ? 'text-emerald-600' : selectedReport.status === 'Rejected' ? 'text-rose-600' : 'text-amber-600'}`}>
                  {selectedReport.status || 'Pending Verification'}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-700" /> Job Application & Search Evidence Details:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Employer / Business</span>
                  <span className="text-slate-900 font-extrabold text-sm">{selectedReport.employer || 'Retail Co'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Position Applied For</span>
                  <span className="text-slate-900 font-extrabold text-sm">{selectedReport.title || 'Customer Service Specialist'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Application Date</span>
                  <span className="text-slate-800 font-bold">{selectedReport.date || selectedReport.submitted || todayStr}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Evidence Type</span>
                  <span className="text-purple-950 font-bold">Direct Employer Contact / Application Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BRANCH 3: STAR INTERVIEW BEHAVIORAL EVALUATION REPORT CARD */}
        {isInterview && !isLms && !isJobSearch && (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700 font-semibold bg-white p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Participant Name:</span>
                <span className="text-slate-900 font-bold">{activeCandidate?.name || 'Alex Mercer'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Workforce Australia ID:</span>
                <span className="font-mono text-purple-900">{activeCandidate?.waId || 'WA-882190'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Points Credit:</span>
                <span className="text-emerald-600 font-extrabold">+{selectedReport.points || 25} PBAS Pts</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Status:</span>
                <span className={`font-bold ${selectedReport.status === 'Verified' ? 'text-emerald-600' : selectedReport.status === 'Rejected' ? 'text-rose-600' : 'text-amber-600'}`}>
                  {selectedReport.status || 'Pending Verification'}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-purple-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-700" /> AI Behavioral Interview Evaluation Report (Score: 88%)
                </span>
                <span className="px-2.5 py-0.5 bg-purple-100 text-purple-900 font-bold text-[10px] rounded-full">
                  Practice Run 1 of 3 in Cycle
                </span>
              </div>
              
              <div className="space-y-3 bg-purple-50/60 p-4 rounded-xl border border-purple-200 text-slate-800">
                <div className="pb-2 border-b border-purple-200/60">
                  <strong className="text-purple-950 font-bold text-xs">Interview Behavioral Question:</strong>
                  <p className="text-slate-800 mt-1 italic font-medium text-xs bg-white p-2.5 rounded-lg border border-purple-100">
                    "{selectedReport.reportData?.question || selectedReport.question || 'Describe a situation where you had to prioritize WHS safety during busy operational hours.'}"
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-purple-100 space-y-1">
                    <strong className="text-emerald-700 block text-[10px] uppercase font-bold">Situation</strong>
                    <p className="text-slate-700 font-medium">{selectedReport.reportData?.situation || selectedReport.situation || 'Busy loading dock during peak delivery hours.'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-purple-100 space-y-1">
                    <strong className="text-emerald-700 block text-[10px] uppercase font-bold">Task</strong>
                    <p className="text-slate-700 font-medium">{selectedReport.reportData?.task || selectedReport.task || 'Ensure pallets were stacked safely without blocking exit corridors.'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-purple-100 space-y-1">
                    <strong className="text-emerald-700 block text-[10px] uppercase font-bold">Action</strong>
                    <p className="text-slate-700 font-medium">{selectedReport.reportData?.action || selectedReport.action || 'Re-routed forklift traffic and instituted clear floor markers.'}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-purple-100 space-y-1">
                    <strong className="text-emerald-700 block text-[10px] uppercase font-bold">Result</strong>
                    <p className="text-slate-700 font-medium">{selectedReport.reportData?.result || selectedReport.result || 'Zero incidents and 100% safety compliance during audit.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3-WAY DECISION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {selectedReport.status === 'Pending Verification' || selectedReport.status === 'Pending' ? (
              <>
                <button
                  onClick={() => {
                    onApprove(selectedReport.id, selectedReport.points || 25, activeCandidate?.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve (+{selectedReport.points || 25} Pts)
                </button>
                <button
                  onClick={() => {
                    onReject(selectedReport.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4" /> Reject Claim
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onUndo(selectedReport.id, selectedReport.points || 25, activeCandidate?.id);
                  onClose();
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-purple-950 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Undo Sign-Off & Re-open Queue
              </button>
            )}
          </div>

          <button onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all">
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};