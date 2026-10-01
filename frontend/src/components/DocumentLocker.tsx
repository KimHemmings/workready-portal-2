import React, { useState } from 'react';
import { Lock, FileText, Upload, Trash2, Eye, CheckCircle2, AlertCircle, ShieldCheck, X } from 'lucide-react';

interface CredentialDoc {
  id: string;
  name: string;
  fileName: string;
  uploadedDate: string;
  size: string;
  status: 'Verified' | 'Pending Review';
  category: string;
}

export const DocumentLocker: React.FC = () => {
  const [allowAutoAttach, setAllowAutoAttach] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docCategory, setCategory] = useState('White Card (WHS)');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [documents, setDocuments] = useState<CredentialDoc[]>([
    {
      id: 'doc-1',
      name: 'White Card (WHS Construction)',
      fileName: 'Construction_WhiteCard_AlexJ.pdf',
      uploadedDate: '12/08/2026',
      size: '1.2 MB',
      status: 'Verified',
      category: 'Safety Ticket'
    },
    {
      id: 'doc-2',
      name: 'National Police Check',
      fileName: 'Police_Check_2026_Pending.pdf',
      uploadedDate: '10/09/2026',
      size: '840 KB',
      status: 'Pending Review',
      category: 'Background Check'
    }
  ]);

  const removeDoc = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please select a file to upload.');

    const newDoc: CredentialDoc = {
      id: `doc-${Date.now()}`,
      name: docCategory,
      fileName: selectedFile.name,
      uploadedDate: new Date().toLocaleDateString('en-AU'),
      size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
      status: 'Pending Review',
      category: 'Uploaded Credential'
    };

    setDocuments([...documents, newDoc]);
    setShowUploadModal(false);
    setSelectedFile(null);
    alert('✨ Credential uploaded to secure locker for Case Manager review!');
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-[#24083b] flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" /> Secure Candidate Document Locker
            </h3>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> AES-256 Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Store right-to-work IDs, White Cards, and licenses so Casey can attach them to job applications.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 bg-[#24083b] hover:bg-[#320b52] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Upload className="w-4 h-4 text-amber-300" /> Upload Credential
        </button>
      </div>

      <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={allowAutoAttach}
            onChange={(e) => setAllowAutoAttach(e.target.checked)}
            className="w-4 h-4 rounded text-purple-700"
          />
          Allow Casey (Case Manager) to auto-attach verified credentials to employer job applications
        </label>
        <span className="text-[10.5px] font-black text-purple-900 bg-white px-2 py-0.5 rounded border border-purple-200">
          {allowAutoAttach ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-xs">{doc.name}</h4>
                  <span className="text-[10.5px] text-slate-500 font-medium block">{doc.fileName} • {doc.size}</span>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {doc.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="text-[10.5px] text-slate-400 font-medium">Uploaded {doc.uploadedDate}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Opening preview for ${doc.fileName}...`)}
                  className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 text-[11px]"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  type="button"
                  onClick={() => removeDoc(doc.id)}
                  className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Upload Credential Document</h3>
              <button type="button" onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Credential Type *</label>
                <select
                  value={docCategory}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold text-slate-900 bg-white"
                >
                  <option value="White Card (WHS)">White Card (WHS Construction)</option>
                  <option value="Forklift License (LF)">Forklift License (LF Ticket)</option>
                  <option value="First Aid & CPR Certificate">First Aid & CPR Certificate</option>
                  <option value="Driver License (C Class)">Driver License (Class C)</option>
                  <option value="National Police Check">National Police Check</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Select PDF / Image File *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full p-2 border rounded-xl font-medium bg-slate-50"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-slate-700">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-[#24083b] text-white font-black rounded-xl shadow-md">Upload Credential</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DocumentLocker;