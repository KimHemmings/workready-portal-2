import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Building2, 
  Calculator, 
  Presentation, 
  Maximize2 
} from 'lucide-react';

interface ProspectTourModalProps {
  providerName: string;
  marketName: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: 'calculator' | 'presentation') => void;
}

export const ProspectTourModal: React.FC<ProspectTourModalProps> = ({
  providerName,
  marketName,
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-5 relative">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg transition-all"
          title="Dismiss Tour & Explore Directly"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP HEADER */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-900 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" /> Executive Interactive Tour â€¢ Step {currentStep} of 3
          </span>
          <h3 className="text-xl font-extrabold text-purple-950 mt-1">
            {currentStep === 1 && `Welcome, ${providerName} Executive Team`}
            {currentStep === 2 && 'Step 1: Quantify Staff Capacity & Financial ROI'}
            {currentStep === 3 && 'Step 2: Experience Live Operational Dashboards'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Customized for your {marketName} contract requirements.
          </p>
        </div>

        {/* STEP CONTENT */}
        <div className="text-xs text-slate-600 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {currentStep === 1 && (
            <div className="space-y-2">
              <p className="font-semibold text-slate-800">
                This guided portal allows you to evaluate the WorkReady platform independently at your own pace.
              </p>
              <ul className="space-y-1.5 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Calculated Payroll Savings:</strong> Adjust sliders for your caseload size to project staff capacity gains.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Human-Centered Transformation:</strong> Review side-by-side comparisons of traditional friction vs. automated workflows.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1-Click Live Sandbox:</strong> Test full interactive profiles for candidates, case managers, and directors.</span>
                </li>
              </ul>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-950 font-bold">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Provider Financial ROI Calculator</span>
              </div>
              <p>
                Use the interactive controls to set your <strong>Caseload Size</strong>, <strong>Active Staff Count</strong>, and <strong>Loaded Hourly Costs</strong>.
              </p>
              <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200">
                ðŸ’¡ Reclaiming ~6.5 hours/week per Case Manager converts directly into 13+ additional 1-on-1 participant coaching sessions weekly.
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-950 font-bold">
                <Maximize2 className="w-4 h-4 text-amber-500" />
                <span>Test Drive Real Operational Profiles</span>
              </div>
              <p>
                Click any of the role buttons on the main screen to test drive operational workflows live:
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 font-bold text-[11px]">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-center text-emerald-900">ðŸ“± Candidate</div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-center text-purple-900">âš¡ Case Manager</div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-center text-amber-900">ðŸ›¡ï¸ Director</div>
              </div>
            </div>
          )}
        </div>

        {/* STEP FOOTER CONTROLS */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep === s ? 'w-5 bg-purple-950' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Back
              </button>
            )}

            {currentStep < 3 ? (
              <button
                onClick={() => {
                  if (currentStep === 1) onSelectTab('calculator');
                  setCurrentStep((prev) => prev + 1);
                }}
                className="px-4 py-1.5 bg-purple-950 hover:bg-purple-900 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 shadow-md cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onSelectTab('presentation');
                  onClose();
                }}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-purple-950 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 shadow-md cursor-pointer"
              >
                <span>Start Executive Tour</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProspectTourModal;