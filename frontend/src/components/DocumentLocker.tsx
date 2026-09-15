import React, { useState } from 'react';
import { FileText, ShieldCheck, Clock, Trash2, Eye, Plus } from 'lucide-react';

export interface CandidateDocument {
  id: string;
  category: string;
  fileName: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Verification' | 'Expired';
  fileSize: string;
}

export const DocumentLocker: React.FC = () => {
  const [documents, setDocuments] = useState<CandidateDocument[]>([
    {
      id: 'doc-1',
      category: 'White Card (WHS)',
      fileName: 'Construction_WhiteCard_AlexJ.pdf',
      uploadDate: '12/08/2026',
      status: 'Verified',
      fileSize: '1.2 MB',
    },
    {
      id: 'doc-2',
      category: 'National Police Check',
      fileName: 'Police_Check_2026_Pending.pdf',
      uploadDate: '10/09/2026',
      status: 'Pending Verification',
      fileSize: '840 KB',
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('First Aid Certificate');
  const [fileInputName, setFileInputName] = useState('');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputName) return;

    const newDoc: CandidateDocument = {
      id: `doc-${Date.now()}`,
      category: selectedCategory,
      fileName: fileInputName,
      uploadDate: new Date().toLocaleDateString('en-AU'),
      status: 'Pending Verification',
      fileSize: '1.5 MB',
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setShowUploadModal(false);
    setFileInputName('');
    alert(`🔐 Document uploaded securely! Casey (Case Manager) has been notified to verify your ${selectedCategory}.`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this document from your locker?')) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#24083b]">Secure Candidate Document Locker</h2>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              AES-256 Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Store right-to-work IDs, White Cards, and licenses so Casey can attach them to job applications on your behalf.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Upload Credential
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 border border-slate-200 hover:border-purple-300 rounded-xl bg-slate-50/50 flex flex-col justify-between gap-3 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="p-2.5 bg-purple-100 text-[#24083b] rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              
              {doc.status === 'Verified' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
              {doc.status === 'Pending Verification' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" /> Pending Review
                </span>
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-[#24083b] truncate">{doc.category}</div>
              <div className="text-[11px] text-slate-600 truncate mt-0.5">{doc.fileName}</div>
              <div className="text-[10px] text-slate-400 mt-1">Uploaded: {doc.uploadDate} • {doc.fileSize}</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
              <button
                onClick={() => alert(`Simulating viewing secure document: ${doc.fileName}`)}
                className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 text-[11px]"
              >
                <Eye className="w-3.5 h-3.5" /> View File
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-red-500 hover:text-red-700 font-bold text-[11px] flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUploadSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-base text-[#24083b]">Upload Encrypted Document 🔐</h3>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Type *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="White Card (WHS)">White Card (WHS Safety)</option>
                  <option value="First Aid Certificate">First Aid Certificate</option>
                  <option value="National Police Check">National Police Check</option>
                  <option value="Driver's License">Driver's License / Proof of ID</option>
                  <option value="Forklift / High Risk License">Forklift / High Risk License</option>
                  <option value="Right to Work VEVO Check">Right to Work VEVO Check</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select File / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First_Aid_Certificate_2026.pdf"
                  value={fileInputName}
                  onChange={(e) => setFileInputName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-[#24083b] text-white font-bold rounded-xl shadow-sm">
                Save to Vault
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DocumentLocker;
