import React, { useState, useEffect, useRef } from 'react';
import { Send, Briefcase, Mic, Pause, Trophy, RefreshCw, Clock } from 'lucide-react';

export interface InterviewQuestion {
  id: string;
  roleCategory: 'Warehouse & Logistics' | 'Retail & Hospitality' | 'Administration & Support' | 'Construction & Trades';
  question: string;
  coachingTip: string;
}

const QUESTION_BANK: InterviewQuestion[] = [
  // Warehouse & Logistics (15 Questions)
  { id: 'w1', roleCategory: 'Warehouse & Logistics', question: 'Describe a time you noticed a safety hazard on the warehouse floor. What action did you take?', coachingTip: 'Mention immediate hazard isolation, PPE usage, and notifying your WHS supervisor.' },
  { id: 'w2', roleCategory: 'Warehouse & Logistics', question: 'How do you ensure 100% order picking accuracy under tight dispatch deadlines?', coachingTip: 'Highlight double-checking SKU barcodes and staying calm under pressure.' },
  { id: 'w3', roleCategory: 'Warehouse & Logistics', question: 'Describe a situation where a piece of warehouse equipment broke down during your shift.', coachingTip: 'Focus on tagging out faulty machinery immediately and taking on alternative tasks.' },
  { id: 'w4', roleCategory: 'Warehouse & Logistics', question: 'How do you handle working safely in high-traffic forklift aisles?', coachingTip: 'Mention staying inside yellow pedestrian walkways and eye contact with operators.' },
  { id: 'w5', roleCategory: 'Warehouse & Logistics', question: 'Tell me about a time you had to resolve a discrepancy in physical inventory stock counts.', coachingTip: 'Highlight systematic re-checks, logging discrepancies, and notifying warehouse managers.' },
  { id: 'w6', roleCategory: 'Warehouse & Logistics', question: 'How do you maintain high energy and focus during physical shift work?', coachingTip: 'Discuss hydration, safe manual handling posture, and planned rest breaks.' },
  { id: 'w7', roleCategory: 'Warehouse & Logistics', question: 'Describe a time you assisted a new team member with warehouse safety orientation.', coachingTip: 'Emphasize patience, demonstrating proper lifting, and peer support.' },
  { id: 'w8', roleCategory: 'Warehouse & Logistics', question: 'Why are you interested in joining our logistics team as a Storeperson?', coachingTip: 'Align your reliability, WHS focus, and career growth goals with the company.' },
  { id: 'w9', roleCategory: 'Warehouse & Logistics', question: 'How do you safely handle fragile or high-value freight items during pallet loading?', coachingTip: 'Discuss shrink-wrapping standards, weight distribution, and fragile tags.' },
  { id: 'w10', roleCategory: 'Warehouse & Logistics', question: 'Describe how you manage unexpected shift overtime to hit dispatch targets.', coachingTip: 'Emphasize positive attitude, stamina, and team coordination.' },
  { id: 'w11', roleCategory: 'Warehouse & Logistics', question: 'What steps do you take when receiving stock that appears damaged on arrival?', coachingTip: 'Highlight driver sign-offs, photo evidence logging, and supervisor notification.' },
  { id: 'w12', roleCategory: 'Warehouse & Logistics', question: 'How do you prioritize order fulfillment when multiple urgent shipments arrive at once?', coachingTip: 'Mention pick list prioritization and clear communication with dispatch leads.' },
  { id: 'w13', roleCategory: 'Warehouse & Logistics', question: 'Tell me about a time you suggested an improvement to warehouse layout or workflow.', coachingTip: 'Share a practical initiative that improved safety or saved shift time.' },
  { id: 'w14', roleCategory: 'Warehouse & Logistics', question: 'How do you ensure proper battery maintenance and charging protocols for electric pallet jacks?', coachingTip: 'Mention PPE battery charging station protocols and pre-start safety checks.' },
  { id: 'w15', roleCategory: 'Warehouse & Logistics', question: 'Describe how you handle fatigue during late night or early morning shifts.', coachingTip: 'Focus on rest preparation, hydration, and maintaining high alertness.' },

  // Retail & Hospitality (15 Questions)
  { id: 'r1', roleCategory: 'Retail & Hospitality', question: 'How would you handle an angry customer seeking a refund without a receipt?', coachingTip: 'Focus on polite de-escalation, active listening, and adhering to store policy.' },
  { id: 'r2', roleCategory: 'Retail & Hospitality', question: 'Describe a shift where your store was understaffed during peak trading hours.', coachingTip: 'Highlight teamwork, rapid customer queue clearing, and staying composed.' },
  { id: 'r3', roleCategory: 'Retail & Hospitality', question: 'How do you ensure cash drawer accuracy and POS balance at the end of a shift?', coachingTip: 'Mention systematic counting, double-checking receipts, and security protocols.' },
  { id: 'r4', roleCategory: 'Retail & Hospitality', question: 'Tell me about a time you went above and beyond to make a customer experience memorable.', coachingTip: 'Share a concrete example of personal initiative and positive customer feedback.' },
  { id: 'r5', roleCategory: 'Retail & Hospitality', question: 'How do you handle dietary requirements or food safety standards in hospitality?', coachingTip: 'Mention strict allergen awareness, cross-contamination checks, and hygiene.' },
  { id: 'r6', roleCategory: 'Retail & Hospitality', question: 'Describe a situation where you had a disagreement with a co-worker on shift.', coachingTip: 'Emphasize constructive communication, keeping focus on customer service, and resolving it.' },
  { id: 'r7', roleCategory: 'Retail & Hospitality', question: 'How do you keep up product knowledge when new merchandise arrives?', coachingTip: 'Mention reviewing product tags, asking team leads, and testing product features.' },
  { id: 'r8', roleCategory: 'Retail & Hospitality', question: 'What makes you a great candidate for our customer support team?', coachingTip: 'Highlight your punctuality, positive communication style, and customer focus.' },
  { id: 'r9', roleCategory: 'Retail & Hospitality', question: 'How do you handle upselling products without sounding pushy to customers?', coachingTip: 'Focus on recommending genuinely relevant products based on customer needs.' },
  { id: 'r10', roleCategory: 'Retail & Hospitality', question: 'Describe how you maintain stock presentation and store cleanliness during quiet periods.', coachingTip: 'Highlight merchandising initiative and keeping sales floors presentable.' },
  { id: 'r11', roleCategory: 'Retail & Hospitality', question: 'Tell me about a time you managed a long queue single-handedly at POS.', coachingTip: 'Mention calm speed, greeting waiting customers, and accurate transaction processing.' },
  { id: 'r12', roleCategory: 'Retail & Hospitality', question: 'How do you respond when a customer asks a technical question you don\'t know the answer to?', coachingTip: 'Highlight honesty, finding a senior colleague, and learning for next time.' },
  { id: 'r13', roleCategory: 'Retail & Hospitality', question: 'Describe how you ensure food safety and temperature logging standards are met.', coachingTip: 'Discuss HACCP guidelines, temperature probes, and sanitization routines.' },
  { id: 'r14', roleCategory: 'Retail & Hospitality', question: 'How do you manage stress when multiple tables or customers require attention at once?', coachingTip: 'Emphasize triage, prioritization, and communicating wait times politely.' },
  { id: 'r15', roleCategory: 'Retail & Hospitality', question: 'Tell me about a time you received positive feedback directly from a manager or customer.', coachingTip: 'Share a proud moment highlighting your work ethic and service standards.' },

  // Administration & Support (15 Questions)
  { id: 'a1', roleCategory: 'Administration & Support', question: 'How do you prioritize urgent incoming phone calls while completing detailed data entry?', coachingTip: 'Explain your task prioritization and maintaining accurate records.' },
  { id: 'a2', roleCategory: 'Administration & Support', question: 'Describe a time you had to learn a new CRM software system quickly.', coachingTip: 'Highlight taking notes during training, practicing, and asking clarifying questions.' },
  { id: 'a3', roleCategory: 'Administration & Support', question: 'How do you ensure confidential client data stays secure in an open office setting?', coachingTip: 'Mention locking computer screens, filing sensitive paper files, and privacy laws.' },
  { id: 'a4', roleCategory: 'Administration & Support', question: 'Tell me about a time you caught a formatting or data error before sending a report.', coachingTip: 'Highlight proofreading attention to detail and taking pride in quality work.' },
  { id: 'a5', roleCategory: 'Administration & Support', question: 'How do you handle difficult or demanding clients over the phone?', coachingTip: 'Focus on professional tone, active listening, and finding swift solutions.' },
  { id: 'a6', roleCategory: 'Administration & Support', question: 'Describe a project where you organized digital documents or filing systems for your team.', coachingTip: 'Discuss clear naming conventions, folder structures, and saving team time.' },
  { id: 'a7', roleCategory: 'Administration & Support', question: 'How do you handle tight afternoon deadlines when unexpected tasks arise?', coachingTip: 'Mention communicating transparently with supervisors and triaging tasks.' },
  { id: 'a8', roleCategory: 'Administration & Support', question: 'Why do you want to build a career in administration with our company?', coachingTip: 'Align your organizational strengths, communication skills, and reliability.' },
  { id: 'a9', roleCategory: 'Administration & Support', question: 'How do you manage calendar scheduling when conflict dates arise between executive team members?', coachingTip: 'Discuss proactive communication, checking priorities, and swift rescheduling.' },
  { id: 'a10', roleCategory: 'Administration & Support', question: 'Describe how you draft professional correspondence to external corporate clients.', coachingTip: 'Highlight professional formatting, clear tone, and thorough proofreading.' },
  { id: 'a11', roleCategory: 'Administration & Support', question: 'Tell me about a time you managed office supply inventory and budget tracking.', coachingTip: 'Mention order tracking, cost efficiency, and maintaining stock levels.' },
  { id: 'a12', roleCategory: 'Administration & Support', question: 'How do you handle incoming mail, parcel deliveries, and distribution efficiently?', coachingTip: 'Discuss systematic logging, prompt delivery to recipients, and security.' },
  { id: 'a13', roleCategory: 'Administration & Support', question: 'Describe how you maintain focus during long periods of repetitive data entry.', coachingTip: 'Mention micro-breaks, double-check routines, and maintaining accuracy.' },
  { id: 'a14', roleCategory: 'Administration & Support', question: 'How do you prepare meeting agendas and record actionable minutes for management?', coachingTip: 'Highlight active listening, structured template formatting, and timely distribution.' },
  { id: 'a15', roleCategory: 'Administration & Support', question: 'Tell me about a time you coordinated travel or event arrangements for staff.', coachingTip: 'Discuss itinerary planning, budget awareness, and clear communication.' },

  // Construction & Trades (15 Questions)
  { id: 't1', roleCategory: 'Construction & Trades', question: 'What steps do you take if you notice a teammate operating power tools unsafely on site?', coachingTip: 'Emphasize site safety rules, respectful peer reminders, and stop-work authority.' },
  { id: 't2', roleCategory: 'Construction & Trades', question: 'How do you handle tool or machinery breakdowns in the middle of a site job?', coachingTip: 'Mention tagging out faulty equipment immediately and switching to alternative site tasks.' },
  { id: 't3', roleCategory: 'Construction & Trades', question: 'Describe a time you worked outdoors in extreme heat or difficult weather conditions.', coachingTip: 'Focus on hydration, regular shade breaks, and monitoring team health.' },
  { id: 't4', roleCategory: 'Construction & Trades', question: 'How do you ensure you arrive fit for work and fully prepared for early site starts?', coachingTip: 'Highlight discipline, routine preparation of PPE gear, and punctuality.' },
  { id: 't5', roleCategory: 'Construction & Trades', question: 'Tell me about a situation where site plans or specifications changed mid-job.', coachingTip: 'Discuss active listening during pre-start toolbox talks and following revised drawings.' },
  { id: 't6', roleCategory: 'Construction & Trades', question: 'How do you maintain clear communication with sub-contractors on active build sites?', coachingTip: 'Mention high-vis presence, clear hand/radio signals, and mutual respect.' },
  { id: 't7', roleCategory: 'Construction & Trades', question: 'Describe a time you assisted with site cleanup and hazardous material disposal.', coachingTip: 'Highlight environmental compliance, chemical safety, and keeping site access clear.' },
  { id: 't8', roleCategory: 'Construction & Trades', question: 'Why are you pursuing a career in construction and site trades?', coachingTip: 'Connect your hands-on work ethic, trade ambitions, and dedication to safety.' },
  { id: 't9', roleCategory: 'Construction & Trades', question: 'How do you ensure proper inspection of scaffolding or ladders prior to working at height?', coachingTip: 'Discuss harness inspections, tag checks, and firm base placement.' },
  { id: 't10', roleCategory: 'Construction & Trades', question: 'Describe a time you participated in a morning JSEA (Job Safety & Environmental Analysis) talk.', coachingTip: 'Highlight contributing risk identification and agreeing on control measures.' },
  { id: 't11', roleCategory: 'Construction & Trades', question: 'How do you store and secure heavy power tools at the end of a site workday?', coachingTip: 'Mention tool lockups, battery charging safety, and inventory checks.' },
  { id: 't12', roleCategory: 'Construction & Trades', question: 'Tell me about a time you had to work alongside heavy machinery like excavators or cranes.', coachingTip: 'Emphasize spotter communication, exclusion zones, and high-vis visibility.' },
  { id: 't13', roleCategory: 'Construction & Trades', question: 'How do you handle manual lifting of heavy construction materials safely?', coachingTip: 'Discuss team lifting techniques, mechanical aids, and proper spinal posture.' },
  { id: 't14', roleCategory: 'Construction & Trades', question: 'Describe how you deal with noisy or high-dust site environments safely.', coachingTip: 'Mention hearing protection standards, dust masks/respirators, and ventilation.' },
  { id: 't15', roleCategory: 'Construction & Trades', question: 'Tell me about a time you took pride in completing a high-quality trade task on site.', coachingTip: 'Share a concrete project outcome highlighting craftsmanship and safety adherence.' },
];

export const StarInterviewSimulator: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'Warehouse & Logistics' | 'Retail & Hospitality' | 'Administration & Support' | 'Construction & Trades'>('Warehouse & Logistics');
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Response & Speech States
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Response History & Evaluation States
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentTip, setCurrentTip] = useState<string | null>(null);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [evalReport, setEvalReport] = useState<{ scoreText: string; feedback: string[]; timestamp: string } | null>(null);

  useEffect(() => {
    initSession(selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    return () => stopAndResetMic();
  }, []);

  const shuffleAndPick8 = (array: InterviewQuestion[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 8);
  };

  const initSession = (role: typeof selectedRole) => {
    const questions = QUESTION_BANK.filter((q) => q.roleCategory === role);
    const randomized8 = shuffleAndPick8(questions);
    setSessionQuestions(randomized8);
    setCurrentIndex(0);
    setUserAnswers([]);
    setIsSessionFinished(false);
    setEvalReport(null);
    resetResponse();
  };

  const stopAndResetMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (err) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleMic = () => {
    if (isListening) {
      stopAndResetMic();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice dictation is not supported in this browser. Please type your response directly!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-AU';

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setCandidateAnswer((prev) => `${prev} ${transcript}`.trim());
      stopAndResetMic();
    };

    recognition.onerror = () => stopAndResetMic();
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const resetResponse = () => {
    stopAndResetMic();
    setCandidateAnswer('');
    setCurrentTip(null);
  };

  const evaluateAndSaveSession = (answers: string[]) => {
    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('en-AU')} at ${now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`;

    const totalWords = answers.join(' ').split(/\s+/).filter(Boolean).length;
    const combinedText = answers.join(' ').toLowerCase();

    // Key Competency Analysis
    const coreKeywords = ['safety', 'whs', 'team', 'customer', 'supervisor', 'check', 'ppe', 'communication', 'resolve', 'action'];
    const matchedTerms = coreKeywords.filter((term) => combinedText.includes(term));

    // Rubric Determination
    let rubricScore = 'Proficient STAR Execution';
    if (totalWords > 90 && matchedTerms.length >= 4) {
      rubricScore = 'High Competency & Professional Structure';
    } else if (totalWords < 35 || matchedTerms.length < 2) {
      rubricScore = 'Developing STAR Structure';
    }

    // Structured Detailed Feedback Payload (Positives + Growth Areas + Actionable Coaching)
    const feedbackNotes = [
      `🌟 Positive Highlights: Excellent initiative completing all 8 behavioral scenarios for ${selectedRole}. Showed strong self-awareness and active problem-solving tone across answers.`,
      `🎯 Industry Alignment: Incorporated ${matchedTerms.length > 0 ? matchedTerms.slice(0, 4).join(', ') : 'core workplace'} terminology effectively. Total effort volume: ${totalWords} words.`,
      `💡 Key Focus Area for Growth: ${
        totalWords < 50
          ? 'Expand on the "Result" step in STAR—quantify the positive outcome or supervisor feedback where possible.'
          : 'Ensure WHS compliance and immediate hazard escalation steps are explicitly stated in every operational answer.'
      }`,
      `🚀 Actionable Coaching Point: Re-read the scenario coaching tips for ${selectedRole} to refine concise 60-second verbal delivery for employer panels.`
    ];

    setEvalReport({
      scoreText: rubricScore,
      feedback: feedbackNotes,
      timestamp: formattedTimestamp
    });

    const firstQuestion = sessionQuestions[0]?.question || "8-Question Behavioral Assessment";
    const newRecord = {
      id: `star-${Date.now()}`,
      question: firstQuestion,
      jobRole: selectedRole,
      rubricScore,
      feedbackNotes,
      timestamp: formattedTimestamp,
      situation: answers[0] || "Identified workplace scenario and key parameters.",
      task: answers[1] || answers[2] || "Organized task priorities and safety standards.",
      action: answers[3] || answers[4] || "Executed steps using active team communication.",
      result: answers[answers.length - 1] || "Task completed safely with positive outcome.",
      date: now.toLocaleDateString('en-AU')
    };

    try {
      const existingRaw = localStorage.getItem('workready_star_history');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [newRecord, ...existing];
      localStorage.setItem('workready_star_history', JSON.stringify(updated));
      
      // Dispatch payload directly for instant same-tab React state update
      window.dispatchEvent(new CustomEvent('starHistoryUpdated', { detail: newRecord }));
    } catch (err) {
      console.error("Failed to save STAR practice record", err);
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stopAndResetMic();

    const updatedAnswers = [...userAnswers, candidateAnswer];
    setUserAnswers(updatedAnswers);

    const q = sessionQuestions[currentIndex];
    setCurrentTip(`Coaching Tip: ${q.coachingTip}`);

    if (updatedAnswers.length >= 8 || currentIndex >= sessionQuestions.length - 1) {
      setIsSessionFinished(true);
      evaluateAndSaveSession(updatedAnswers);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetResponse();
    }
  };

  const currentQ = sessionQuestions[currentIndex] || QUESTION_BANK[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans my-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#24083b]">Interview Practice Studio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Practice answering employer questions by typing or speaking. Complete all 8 scenarios to submit your report.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Briefcase className="w-4 h-4 text-purple-700" /> Target Industry:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#24083b] outline-none"
          >
            <option value="Warehouse & Logistics">Warehouse & Logistics</option>
            <option value="Retail & Hospitality">Retail & Hospitality</option>
            <option value="Administration & Support">Administration & Support</option>
            <option value="Construction & Trades">Construction & Trades</option>
          </select>
        </div>
      </div>

      {!isSessionFinished ? (
        <>
          {/* Active Question Banner */}
          <div className="p-5 bg-gradient-to-r from-purple-900 to-[#24083b] text-white rounded-2xl space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-purple-200">
              <span className="uppercase tracking-wider">Question {currentIndex + 1} of 8 • {selectedRole}</span>
              <span className="bg-purple-800/80 px-2.5 py-0.5 rounded-full text-[10px]">+25 PBAS Points Upon Case Manager Verification</span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
              "{currentQ?.question}"
            </h3>
          </div>

          {/* Unified Text / Speak Input */}
          <form onSubmit={handleAnswerSubmit} className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800">Your Response (Type or Speak):</label>
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-bold transition-all ${
                    isListening
                      ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                      : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  {isListening ? <Pause className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-purple-700" />}
                  {isListening ? 'Recording Single Utterance...' : 'Dictate Voice Response 🎙️'}
                </button>
              </div>

              <textarea
                required
                rows={4}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Type or speak your answer here..."
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none text-xs text-slate-800"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button type="button" onClick={handleNextQuestion} className="text-slate-500 font-bold text-xs">
                Skip Question →
              </button>

              <button
                type="submit"
                disabled={!candidateAnswer.trim()}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#24083b] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Save Response & View Coaching Tip
              </button>
            </div>
          </form>

          {currentTip && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-xs text-amber-900 animate-fadeIn">
              <div>{currentTip}</div>
              <button
                onClick={handleNextQuestion}
                className="px-4 py-1.5 bg-[#16a34a] text-white font-bold rounded-xl text-xs"
              >
                Proceed to Question {currentIndex + 2} →
              </button>
            </div>
          )}
        </>
      ) : (
        /* Completion & Verification Report State */
        <div className="space-y-6 text-xs">
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-black text-[#24083b]">8-Scenario Practice Session Complete! 🎉</h3>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-full text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Pending Case Manager Verification (+25 Pts)
              </span>
            </div>

            <p className="text-slate-600">
              Your practice session for <strong>{selectedRole}</strong> has been saved and submitted directly to the <strong>Activity Verification Log</strong> (Tab 3) for Casey to review!
            </p>

            {evalReport && (
              <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-2 mt-2">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span>Rubric Rating: <strong className="text-emerald-700">{evalReport.scoreText}</strong></span>
                  <span className="text-[11px] text-slate-500">{evalReport.timestamp}</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {evalReport.feedback.map((note, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => initSession(selectedRole)}
              className="px-6 py-2.5 bg-[#24083b] text-white font-bold rounded-xl shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Start New Practice Session
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StarInterviewSimulator;