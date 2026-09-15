import React, { useState } from 'react';
import { Volume2, VolumeX, Download, Clock, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export const CertifiedLmsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'certificate'>('content');
  const [isAudioReading, setIsAudioReading] = useState(false);
  const [answers, setAnswers] = useState<number[]>(Array(8).fill(-1));
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const candidateName = "Alex Johnson";
  const issueTimestamp = new Date().toLocaleString('en-AU', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Australia/Brisbane',
  });

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

  const quizQuestions = [
    { q: "What is the minimum safe exclusion zone around active operating forklifts?", opts: ["1 Meter", "3 Meters", "5 Meters", "10 Meters"], correct: 1 },
    { q: "Which PPE specification is required for warehouse footwear in Australia?", opts: ["Soft Sneakers", "AS/NZS 2210.3 Steel-Cap Boots", "Thongs", "Rubber Rainboots"], correct: 1 },
    { q: "What is the first step upon discovering a hydraulic spill?", opts: ["Ignore it", "Isolate with safety cones & apply spill kit", "Walk over it", "Clean at shift end"], correct: 1 },
    { q: "Where are pedestrians permitted to walk inside active logistics hubs?", opts: ["Any open floor area", "Within painted yellow lines", "Behind reversing machinery", "In dispatch bays"], correct: 1 },
    { q: "Within what timeframe must near-miss incidents be logged in WHS registers?", opts: ["Within 2 Hours", "By end of week", "End of month", "Never"], correct: 0 },
    { q: "What does the 'A' in the PASS fire extinguisher method stand for?", opts: ["Action", "Aim low at base", "Activate", "Alert"], correct: 1 },
    { q: "Who is permitted to operate high-reach stacker machinery?", opts: ["Any worker", "Licensed HRW cardholders only", "Visitors", "Casual staff without cards"], correct: 1 },
    { q: "How often should hydration be consumed during heavy physical warehouse shifts?", opts: ["Once a day", "250ml every 20 mins", "Only at lunch", "When shift finishes"], correct: 1 }
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

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });

    if (score >= 6) {
      setActiveTab('certificate');
    } else {
      alert(`You scored ${score}/8. Please review the 15 operational points and re-test!`);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#24083b]">Certified Training Module: Warehouse WHS & Operational Safety</h2>
          <p className="text-xs text-slate-500 mt-0.5">Straight Up Training Accredited • 20-Minute In-Depth Study Course</p>
        </div>

        <button
          onClick={handleToggleAudio}
          className={`px-4 py-2 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 ${
            isAudioReading ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-purple-50 text-[#24083b] border border-purple-200'
          }`}
        >
          {isAudioReading ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-700" />}
          {isAudioReading ? 'Stop Audio Reader' : 'Listen to Course Content (Audio Reader) 🔊'}
        </button>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {detailedModules.map((m, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h3 className="font-bold text-[#24083b]">{m.title}</h3>
                <p className="text-slate-600 leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500">15 Operational Points Reviewed (~20 mins content)</span>
            <button
              onClick={() => setActiveTab('quiz')}
              className="px-6 py-2.5 bg-[#24083b] text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Take 8-Question Knowledge Quiz →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="space-y-6 text-xs">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl font-bold text-[#24083b]">
            Answer all 8 questions correctly to complete accreditation and unlock your branded certificate.
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                <div className="font-bold text-slate-900">{qIdx + 1}. {q.q}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.opts.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => {
                        const updated = [...answers];
                        updated[qIdx] = optIdx;
                        setAnswers(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-left font-semibold ${
                        answers[qIdx] === optIdx ? 'bg-[#24083b] text-white border-[#24083b]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button onClick={() => setActiveTab('content')} className="text-slate-500 font-bold">← Back to Course Content</button>
            <button
              onClick={handleGradeQuiz}
              disabled={answers.includes(-1)}
              className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-50"
            >
              Grade Quiz & Generate Certificate
            </button>
          </div>
        </div>
      )}

      {activeTab === 'certificate' && (
        <div className="space-y-6">
          {/* LANDSCAPE HIGH-IMPACT BRANDED CERTIFICATE */}
          <div className="p-10 border-8 border-double border-[#24083b] rounded-3xl bg-gradient-to-br from-amber-50/40 via-white to-purple-50/50 text-slate-900 space-y-6 shadow-2xl relative w-full aspect-[1.414/1] flex flex-col justify-between">
            
            <div className="flex justify-between items-start border-b-2 border-[#24083b] pb-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Straight Up Training" className="h-12 w-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                <div>
                  <h1 className="text-2xl font-black text-[#24083b] tracking-wider uppercase">Straight Up Training</h1>
                  <p className="text-xs font-extrabold text-purple-800 uppercase tracking-widest">WorkReady Accredited Partner</p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3.5 py-1 rounded-full border border-emerald-300">
                  OFFICIAL VERIFIED CERTIFICATE
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: SUT-WHS-2026-8819</p>
              </div>
            </div>

            <div className="text-center space-y-3 py-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">This Accredited Certificate Is Proudly Presented To</p>
              <h2 className="text-3xl font-black text-[#24083b] underline underline-offset-8 decoration-amber-400">{candidateName}</h2>
              <p className="text-xs text-slate-700 max-w-xl mx-auto pt-2 leading-relaxed">
                For successfully completing 20 minutes of accredited study and passing the 8-Question Knowledge Assessment in <strong>Warehouse WHS & Operational Safety</strong> earning <strong>+20 PBAS Points</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-[#24083b] text-xs">
              <div>
                <span className="block text-slate-400 font-bold text-[10px] uppercase">Verified Date & Time Stamp</span>
                <strong className="text-slate-900 font-mono text-xs">{issueTimestamp}</strong>
              </div>
              <div className="text-right">
                <span className="block text-slate-400 font-bold text-[10px] uppercase">Authorized Assessor Signature</span>
                <strong className="text-[#24083b] text-sm italic block">Casey Smith</strong>
                <span className="text-[10px] text-slate-500 font-bold">Straight Up Training Representative</span>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => window.print()} className="px-6 py-2.5 bg-[#24083b] text-white font-bold text-xs rounded-xl flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Landscape Certificate (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertifiedLmsModule;
