import React from 'react';
import { Award, CheckCircle2, Printer, X } from 'lucide-react';

export interface CertificateData {
  id: string;
  candidateName?: string;
  courseTitle?: string;
  completionDate?: string;
  score?: number;
  verificationCode?: string;
  issuerName?: string;
  // Property aliases to support existing candidate module & certificate objects
  title?: string;
  recipient_name?: string;
  issue_date?: string;
  issued_at?: string;
  verification_code?: string;
}

export interface CertificateModalProps {
  certificate: CertificateData | null;
  onClose: () => void;
  open?: boolean;
  logo?: string;
}

/** Utility helper exported specifically for Certificates.tsx */
export function formatIssued(dateString?: string): string {
  if (!dateString) return new Date().toLocaleDateString('en-AU');
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('en-AU');
}

export default function CertificateModal({ certificate, onClose, open, logo }: CertificateModalProps) {
  // If open is explicitly passed as false, or if certificate is null, do not render
  if (open === false || !certificate) return null;

  // Resolve property aliases safely for flexible data compatibility
  const displayName = certificate.candidateName || certificate.recipient_name || 'Alex Mercer';
  const displayTitle = certificate.courseTitle || certificate.title || 'WorkReady Employability Module';
  const displayDate = formatIssued(certificate.completionDate || certificate.issue_date || certificate.issued_at);
  const displayCode = certificate.verificationCode || certificate.verification_code || `WR-${certificate.id.slice(0, 8).toUpperCase()}`;
  const displayScore = certificate.score ?? 85;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Container - Styled for Landscape A4 Preview */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden relative my-auto">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Official Achievement Certificate</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF (Landscape)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Landscape Certificate Canvas */}
        <div className="p-8 md:p-12 print:p-8 bg-slate-50 min-h-[500px] flex items-center justify-center">
          <div className="w-full aspect-[1.414/1] bg-white border-[12px] border-double border-purple-900 p-8 md:p-10 relative flex flex-col justify-between shadow-lg print:shadow-none print:border-purple-900">
            
            {/* Corner Decorative Accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-500" />

            {/* Certificate Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-purple-900">
                {logo ? (
                  <img src={logo} alt="Logo" className="h-8 object-contain" />
                ) : (
                  <Award className="h-8 w-8 text-amber-500" />
                )}
                <span className="font-black text-xl tracking-wider uppercase font-serif">Straight Up Training</span>
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold">WorkReady Employability Pathways</p>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight pt-2">
                Certificate of Completion
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-purple-900 to-emerald-400 mx-auto rounded-full" />
            </div>

            {/* Candidate & Course Body */}
            <div className="text-center my-6 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">This is to proudly certify that</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-950 underline decoration-amber-400/60 decoration-2 underline-offset-8">
                {displayName}
              </h2>
              <p className="text-xs text-slate-600 max-w-xl mx-auto pt-2">
                has successfully completed all required curriculum modules and assessment criteria for
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {displayTitle}
              </h3>
              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 inline-block px-3 py-1 rounded-full">
                Score Achieved: {displayScore}% • Verified PBAS Competency
              </p>
            </div>

            {/* Footer & Signatures */}
            <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
              <div>
                <p className="font-mono text-[10px] text-slate-400">Date Issued: {displayDate}</p>
                <p className="font-mono text-[10px] text-slate-400">Verification ID: {displayCode}</p>
              </div>

              {/* Official Stamp Badge */}
              <div className="w-16 h-16 rounded-full border-2 border-amber-500/80 bg-amber-50/40 flex flex-col items-center justify-center text-center p-1">
                <CheckCircle2 className="h-5 w-5 text-amber-600 mb-0.5" />
                <span className="text-[8px] font-bold text-amber-900 uppercase leading-none">Verified</span>
              </div>

              <div className="text-right">
                <div className="font-serif italic text-base text-purple-900 font-bold border-b border-slate-300 pb-1 px-4">
                  {certificate.issuerName || 'Casey (Case Manager)'}
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Authorized Provider</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}