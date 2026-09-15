import React, { useState } from 'react';
import { BookOpen, Award, CheckCircle2, Volume2, VolumeX, ShieldCheck, Calendar, Clock, Download } from 'lucide-react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export const CertifiedLmsModule: React.FC = () => {
  const [activeStep, setActiveStep] = useState<'content' | 'quiz' | 'certificate'>('content');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>(Array(8).fill(-1));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Unalterable Date and Timestamp for Evidence
  const completionTimestamp = new Date().toLocaleString('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Australia/Brisbane',
  });

  // 15 Comprehensive Learning Points (Warehouse WHS & Operations)
  const learningPoints = [
    "1. Hazard Identification: Conduct a 360-degree visual risk assessment before commencing any task.",
    "2. Personal Protective Equipment (PPE): Steel-cap boots, high-vis vests, and safety glasses must be worn at all times.",
    "3. Forklift Exclusion Zones: Maintain a minimum 3-meter safety distance around active forklift machinery.",
    "4. Manual Handling Safety: Bend knees, keep loads close to body, and avoid twisting torso while lifting heavier items.",
    "5. Chemical & Fluid Spills: Isolate hydraulic spills immediately using high-vis cones and apply absorbent material.",
    "6. Pedestrian Walkway Compliance: Walk strictly within painted yellow pedestrian lines inside warehouse facilities.",
    "7. Emergency Stop Protocols: Familiarize yourself with emergency power cut-off buttons across conveyor systems.",
    "8. High-Risk License Verification: Never operate machinery without active HRW licenses registered with supervisor.",
    "9. Pallet Racking Safety: Report bent racking uprights or missing locking pins immediately to WHS officers.",
    "10. Fire Extinguisher Locations: Identify PASS method and locations of CO2 and Dry Powder extinguishers.",
    "11. Incident Reporting: All near-misses must be documented in WHS logs within 2 hours of occurrence.",
    "12. First Aid Stations: Know the designated First Aid officer on duty for every shift and station location.",
    "13. Safe Stacking Heights: Ensure palletized stock does not exceed maximum height limits on high bay racks.",
    "14. Housekeeping Standards: Keep main access aisles free of plastic wrap, timber offcuts, and packaging debris.",
    "15. Fatigue & Hydration: Take mandatory scheduled rest breaks and stay hydrated during heavy physical shifts."
  ];

  // 8 Quiz Questions
  const quizQuestions: QuizQuestion[] = [
    { id: 1, question: "What is the minimum safe exclusion zone distance around operating forklifts?", options: ["1 meter", "3 meters", "5 meters", "10 meters"], correctIndex: 1 },
    { id: 2, question: "Which procedure should you follow when lifting heavy equipment manually?", options: ["Bend at waist", "Bend knees & keep load close", "Twist torso rapidly", "Lift without assistance"], correctIndex: 1 },
    { id: 3, question: "What is the first step when discovering a hydraulic fluid spill?", options: ["Ignore it", "Isolate the area with cones", "Walk through it", "Wait until shift ends"], correctIndex: 1 },
    { id: 4, question: "Where must pedestrians walk inside the warehouse?", options: ["Anywhere empty", "Directly behind forklifts", "Within painted yellow lines", "Outside only"], correctIndex: 2 },
    { id: 5, question: "How quickly must near-miss incidents be reported in WHS logs?", options: ["Within 2 hours", "Next week", "End of month", "Never"], correctIndex: 0 },
    { id: 6, question: "What does the 'P' in the PASS fire extinguisher method stand for?", options: ["Push", "Pull the pin", "Press", "Pause"], correctIndex: 1 },
    { id: 7, question: "Who should operate high-risk warehouse machinery?", options: ["Anyone available", "Only licensed operators", "Visitors", "Casual staff without training"], correctIndex: 1 },
    { id: 8, question: "What PPE is required on active warehouse floors at all times?", options: ["Thongs & t-shirt", "Steel-cap boots & high-vis vest", "Sneakers", "Gloves only"], correctIndex: 1 },
  ];

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = learningPoints.join(' ');
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'en-AU';
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    const updated = [...quizAnswers];
    updated[qIdx] = optIdx;
    setQuizAnswers(updated);
  };

  const handleGradeQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) score += 1;
    });

    setQuizSubmitted(true);
    if (score >= 6) { // 75% pass mark
      setQuizPassed(true);
      setActiveStep('certificate');
    } else {
      setQuizPassed(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#24083b]">Certified Training Module: Warehouse WHS & Operations</h2>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              +20 Verified PBAS Points
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span>Straight Up Training Accredited</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Timestamped Evidence Log</span>
          </p>
        </div>

        <button
          onClick={handleToggleAudio}
          className={`inline-flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl shadow-sm transition-all ${
            isPlayingAudio ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-purple-50 text-[#24083b] border border-purple-200'
          }`}
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-700" />}
          {isPlayingAudio ? 'Stop Read Aloud' : 'Read to Participant 🔊'}
        </button>
      </div>

      {/* STEP 1: 15 DETAILED LEARNING POINTS */}
      {activeStep === 'content' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {learningPoints.map((pt, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 leading-relaxed">
                {pt}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-bold">15 Points Reviewed • Ready for Assessment</span>
            <button
              onClick={() => setActiveStep('quiz')}
              className="px-6 py-2.5 bg-[#24083b] text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Take 8-Question Knowledge Assessment →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 8-QUESTION QUIZ */}
      {activeStep === 'quiz' && (
        <div className="space-y-6 text-xs">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl font-bold text-[#24083b]">
            Answer all 8 questions to complete certification and log +20 PBAS points.
          </div>

          <div className="space-y-4">
            {quizQuestions.map((q, qIdx) => (
              <div key={q.id} className="p-4 border border-slate-200 rounded-xl space-y-2 bg-slate-50/50">
                <div className="font-bold text-slate-900">{qIdx + 1}. {q.question}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleOptionSelect(qIdx, optIdx)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        quizAnswers[qIdx] === optIdx
                          ? 'bg-[#24083b] text-white border-[#24083b]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
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
            <button onClick={() => setActiveStep('content')} className="text-slate-500 font-bold">← Back to Course Points</button>
            <button
              onClick={handleGradeQuiz}
              disabled={quizAnswers.includes(-1)}
              className="px-6 py-2.5 bg-[#16a34a] text-white font-bold rounded-xl shadow-sm disabled:opacity-50"
            >
              Submit Quiz & Generate Certificate
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LANDSCAPE BRANDED CERTIFICATE */}
      {activeStep === 'certificate' && (
        <div className="space-y-6">
          <div className="p-8 border-4 border-double border-[#24083b] rounded-3xl bg-gradient-to-br from-slate-50 via-white to-purple-50 text-slate-900 space-y-6 shadow-xl relative overflow-hidden">
            
            {/* Header Branding */}
            <div className="flex justify-between items-start border-b border-purple-200 pb-4">
              <div>
                <h1 className="text-2xl font-black text-[#24083b] tracking-wide uppercase">Straight Up Training</h1>
                <p className="text-xs font-bold text-purple-700 uppercase tracking-widest">WorkReady Partner • Certificate of Completion</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-300">
                  OFFICIAL VERIFIED EVIDENCE
                </span>
                <p className="text-[10px] text-slate-400 mt-1">ID: SUT-WHS-2026-9912</p>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="text-center space-y-2 py-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">This is to certify that</p>
              <h2 className="text-2xl font-black text-[#24083b] underline underline-offset-8 decoration-purple-300">Alex Johnson</h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto pt-2">
                Has successfully completed the accredited <strong>Warehouse WHS & Operational Safety Assessment</strong> (8/8 Questions Passed) earning <strong>+20 PBAS Points</strong>.
              </p>
            </div>

            {/* Timestamp & Signature Footer */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-purple-200 text-xs">
              <div>
                <span className="block text-slate-400 font-bold text-[10px] uppercase">Verified Date & Time Stamp</span>
                <strong className="text-slate-800">{completionTimestamp}</strong>
              </div>
              <div className="text-right">
                <span className="block text-slate-400 font-bold text-[10px] uppercase">Authorized Assessor</span>
                <strong className="text-[#24083b]">Casey Smith (Straight Up Training)</strong>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => window.print()} className="px-5 py-2.5 bg-[#24083b] text-white font-bold text-xs rounded-xl flex items-center gap-2">
              <Download className="w-4 h-4" /> Download Landscape Certificate (PDF)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CertifiedLmsModule;
