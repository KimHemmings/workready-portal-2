import React, { useState } from 'react';
import { Volume2, VolumeX, Download, Award, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export interface CertifiedLmsModuleProps {
  candidateName?: string;
  moduleTitle?: string;
}

export const CertifiedLmsModule: React.FC<CertifiedLmsModuleProps> = ({
  candidateName = "Alex Johnson",
  moduleTitle = "Warehouse WHS & Operational Safety",
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'certificate'>('certificate');
  const [isAudioReading, setIsAudioReading] = useState(false);
  const [answers, setAnswers] = useState<number[]>(Array(8).fill(1));

  const detailedModules = [
    { title: "1. 360° Site Hazard & Risk Assessments", body: "Before operating in any active warehouse or industrial environment, conduct a mandatory 360-degree visual risk assessment. Inspect floor surfaces for hydraulic fluid leaks, unstacked timber pallets, and overhead obstruction hazards." },
    { title: "2. Personal Protective Equipment (PPE) Compliance", body: "Steel-cap boots (AS/NZS 2210.3 certified), high-visibility reflective vests (Class D/N), and protective eye gear must be worn before crossing active red-line facility entry points." },
    { title: "3. Forklift & Heavy Machinery Exclusion Zones", body: "Maintain a strict 3-meter safety buffer zone around active materials handling machinery. Never step behind reversing machinery without establishing direct eye contact with the licensed operator." },
    { title: "4. Ergonomic Manual Handling & Spinal Posture", body: "When manually lifting loads over 15kg, keep feet shoulder-width apart, bend at the knees, keep the parcel close to your chest, and pivot with your feet rather than twisting your torso." },
    { title: "5. Chemical Spill Containment & Emergency Protocols", body: "Immediately cordon off fluid spills using yellow high-vis safety cones. Apply chemical absorbent granules from the nearest spill kit and notify the WHS supervisor within 15 minutes." },
    { title: "6. Pedestrian Walkway Markings & Line Adherence", body: "Walk exclusively within designated yellow painted pedestrian lines inside distribution facilities. Do not take shortcuts across active forklift staging lanes under any circumstances." },
    { title: "7. Emergency Power Cut-off & Conveyor Safety", body: "Locate red emergency stop pull-cords and buttons positioned along automated conveyor belts. Never attempt to clear jammed parcels while the conveyor power loop is energized." },
    { title: "8. High-Risk Work License (HRW) Operating Rules", body: "Never operate high-reach stackers, order pickers, or counter-balance forklifts without an active, verified High-Risk Work license registered in the company compliance database." },
    { title: "9. Pallet Racking Structural Integrity Checks", body: "Inspect upright racking columns daily for collision dents or missing safety locking pins. Never exceed maximum rated beam load capacities listed on safe working load plates." },
    { title: "10. PASS Fire Extinguisher Operational Steps", body: "In the event of a minor Class A or B fire, remember PASS: Pull the pin, Aim low at the base of the fire, Squeeze the operating handle, and Sweep slowly from side to side." },
    { title: "11. Incident & Near-Miss Documentation", body: "Document every workplace near-miss or hazard within 2 hours of occurrence using official WHS hazard log sheets to prevent future team injuries." },
    { title: "12. Designated First Aid Officers & Medical Stations", body: "Identify the primary First Aid officer assigned to your shift and verify the exact location of automated external defibrillators (AED) and emergency eyewash stations." },
    { title: "13. Safe Stacking Ratios & Pallet Stability", body: "Ensure palletized stock is interlocking, shrink-wrapped with a minimum of 3 bottom wraps, and does not exceed maximum height-to-base stability ratios." },
    { title: "14. Facility Housekeeping & Debris Control", body: "Keep main access aisles clean and clear of plastic wrap offcuts, broken timber pallets, and strapping tape that present immediate trip hazards." },
    { title: "15. Shift Fatigue Management & Hydration", body: "Take scheduled rest breaks to maintain operational focus. In hot climate facilities, consume a minimum of 250ml of water every 20 minutes during physical activity." }
  ];

  const handleToggleAudio = () => {
    if (isAudioReading) {
      window.speechSynthesis.cancel();
      setIsAudioReading(false);
    } else {
      const fullText = detailedModules.map(m => `${m.title}. ${m.body}`).join(' ');
      const msg = new SpeechSynthesisUtterance(fullText);
      msg.lang = 'en-AU';
      msg.onend = () => setIsAudioReading(false);
      window.speechSynthesis.speak(msg);
      setIsAudioReading(true);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#24083b]">Certified Training Module: {moduleTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Straight Up Training Accredited • Participant: {candidateName}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'certificate' ? 'content' : 'certificate')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all"
          >
            {activeTab === 'certificate' ? '← Back to Course Content' : 'View Certificate Preview 🏆'}
          </button>
        </div>
      </div>

      {/* PROFILE-ALIGNED HIGH-IMPACT LANDSCAPE CERTIFICATE */}
      {activeTab === 'certificate' && (
        <div className="space-y-6">
          <div className="p-2 bg-slate-100 rounded-3xl border border-slate-200 shadow-xl">
            <div className="w-full bg-white text-slate-900 rounded-[20px] border-2 border-slate-200 relative overflow-hidden shadow-2xl font-sans aspect-[1.414/1] flex flex-col justify-between">
              
              {/* Profile Theme Top Header Banner */}
              <div className="bg-gradient-to-r from-[#24083b] via-[#320b52] to-[#24083b] text-white p-6 sm:p-8 flex justify-between items-center border-b-4 border-emerald-500 relative">
                
                {/* Logo & Brand Title */}
                <div className="flex items-center gap-4">
                  <img
                    src="/logo.png"
                    alt="Straight Up Training"
                    className="h-10 sm:h-12 w-auto object-contain bg-white/10 p-1.5 rounded-xl border border-white/20"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                        Straight Up Training
                      </h1>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        WorkReady Partner
                      </span>
                    </div>
                    <p className="text-xs text-purple-200">Official Vocational Competency Certificate</p>
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="text-right hidden sm:block">
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Completion
                  </span>
                  <p className="text-[10px] text-purple-200 font-mono mt-1">ID: SUT-2026-WHS-9982</p>
                </div>
              </div>

              {/* Certificate Core Content */}
              <div className="p-8 sm:p-12 text-center my-auto space-y-5">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#24083b] text-xs font-bold uppercase tracking-widest">
                  <Award className="w-4 h-4 text-purple-700" /> Certificate of Operational Competency
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">This Certificate Is Awarded To</p>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#24083b] font-heading tracking-tight underline underline-offset-8 decoration-emerald-500 py-1">
                    {candidateName}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                  For successfully demonstrating operational competency and passing the vocational knowledge assessment for <strong>{moduleTitle}</strong>.
                </p>

              </div>

              {/* Profile Style Footer Bar */}
              <div className="bg-slate-50 border-t border-slate-200 p-6 grid grid-cols-2 gap-4 items-center text-xs">
                
                {/* Left: Verification Seal */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-[#24083b] rounded-xl border border-purple-200">
                    <ShieldCheck className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <span className="block font-bold text-[#24083b] text-xs">Accredited Industry Standard</span>
                    <span className="text-[10px] text-slate-500 font-semibold">Workforce Australia Verified Evidence</span>
                  </div>
                </div>

                {/* Right: Signature */}
                <div className="text-right">
                  <span className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider">Authorized Assessor</span>
                  <strong className="text-[#24083b] text-base italic font-serif block">Casey Smith</strong>
                  <span className="text-[10px] text-slate-500 font-bold">Straight Up Training Representative</span>
                </div>

              </div>

            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-300" /> Export Profile-Branded Certificate (PDF)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CertifiedLmsModule;
