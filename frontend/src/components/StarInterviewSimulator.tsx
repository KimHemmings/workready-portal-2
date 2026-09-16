import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, CheckCircle2, Briefcase, Mic, Pause, Trophy, FileText, RefreshCw } from 'lucide-react';

export interface InterviewQuestion {
  id: string;
  roleCategory: 'Warehouse & Logistics' | 'Retail & Hospitality' | 'Administration & Support' | 'Construction & Trades';
  question: string;
  coachingTip: string;
}

const QUESTION_BANK: InterviewQuestion[] = [
  // Warehouse & Logistics (8 Questions)
  { id: 'w1', roleCategory: 'Warehouse & Logistics', question: 'Describe a time you noticed a safety hazard on the warehouse floor. What action did you take?', coachingTip: 'Mention immediate hazard isolation, PPE usage, and notifying your WHS supervisor.' },
  { id: 'w2', roleCategory: 'Warehouse & Logistics', question: 'How do you ensure 100% order picking accuracy under tight dispatch deadlines?', coachingTip: 'Highlight double-checking SKU barcodes and staying calm under pressure.' },
  { id: 'w3', roleCategory: 'Warehouse & Logistics', question: 'Describe a situation where a piece of warehouse equipment broke down during your shift.', coachingTip: 'Focus on tagging out faulty machinery immediately and taking on alternative tasks.' },
  { id: 'w4', roleCategory: 'Warehouse & Logistics', question: 'How do you handle working safely in high-traffic forklift aisles?', coachingTip: 'Mention staying inside yellow pedestrian walkways and eye contact with operators.' },
  { id: 'w5', roleCategory: 'Warehouse & Logistics', question: 'Tell me about a time you had to resolve a discrepancy in physical inventory stock counts.', coachingTip: 'Highlight systematic re-checks, logging discrepancies, and notifying warehouse managers.' },
  { id: 'w6', roleCategory: 'Warehouse & Logistics', question: 'How do you maintain high energy and focus during physical shift work?', coachingTip: 'Discuss hydration, safe manual handling posture, and planned rest breaks.' },
  { id: 'w7', roleCategory: 'Warehouse & Logistics', question: 'Describe a time you assisted a new team member with warehouse safety orientation.', coachingTip: 'Emphasize patience, demonstrating proper lifting, and peer support.' },
  { id: 'w8', roleCategory: 'Warehouse & Logistics', question: 'Why are you interested in joining our logistics team as a Storeperson?', coachingTip: 'Align your reliability, WHS focus, and career growth goals with the company.' },

  // Retail & Hospitality (8 Questions)
  { id: 'r1', roleCategory: 'Retail & Hospitality', question: 'How would you handle an angry customer seeking a refund without a receipt?', coachingTip: 'Focus on polite de-escalation, active listening, and adhering to store policy.' },
  { id: 'r2', roleCategory: 'Retail & Hospitality', question: 'Describe a shift where your store was understaffed during peak trading hours.', coachingTip: 'Highlight teamwork, rapid customer queue clearing, and staying composed.' },
  { id: 'r3', roleCategory: 'Retail & Hospitality', question: 'How do you ensure cash drawer accuracy and POS balance at the end of a shift?', coachingTip: 'Mention systematic counting, double-checking receipts, and security protocols.' },
  { id: 'r4', roleCategory: 'Retail & Hospitality', question: 'Tell me about a time you went above and beyond to make a customer experience memorable.', coachingTip: 'Share a concrete example of personal initiative and positive customer feedback.' },
  { id: 'r5', roleCategory: 'Retail & Hospitality', question: 'How do you handle dietary requirements or food safety standards in hospitality?', coachingTip: 'Mention strict allergen awareness, cross-contamination checks, and hygiene.' },
  { id: 'r6', roleCategory: 'Retail & Hospitality', question: 'Describe a situation where you had a disagreement with a co-worker on shift.', coachingTip: 'Emphasize constructive communication, keeping focus on customer service, and resolving it.' },
  { id: 'r7', roleCategory: 'Retail & Hospitality', question: 'How do you keep up product knowledge when new merchandise arrives?', coachingTip: 'Mention reviewing product tags, asking team leads, and testing product features.' },
  { id: 'r8', roleCategory: 'Retail & Hospitality', question: 'What makes you a great candidate for our customer support team?', coachingTip: 'Highlight your punctuality, positive communication style, and customer focus.' },

  // Administration & Support (8 Questions)
  { id: 'a1', roleCategory: 'Administration & Support', question: 'How do you prioritize urgent incoming phone calls while completing detailed data entry?', coachingTip: 'Explain your task prioritization and maintaining accurate records.' },
  { id: 'a2', roleCategory: 'Administration & Support', question: 'Describe a time you had to learn a new CRM software system quickly.', coachingTip: 'Highlight taking notes during training, practicing, and asking clarifying questions.' },
  { id: 'a3', roleCategory: 'Administration & Support', question: 'How do you ensure confidential client data stays secure in an open office setting?', coachingTip: 'Mention locking computer screens, filing sensitive paper files, and privacy laws.' },
  { id: 'a4', roleCategory: 'Administration & Support', question: 'Tell me about a time you caught a formatting or data error before sending a report.', coachingTip: 'Highlight proofreading attention to detail and taking pride in quality work.' },
  { id: 'a5', roleCategory: 'Administration & Support', question: 'How do you handle difficult or demanding clients over the phone?', coachingTip: 'Focus on professional tone, active listening, and finding swift solutions.' },
  { id: 'a6', roleCategory: 'Administration & Support', question: 'Describe a project where you organized digital documents or filing systems for your team.', coachingTip: 'Discuss clear naming conventions, folder structures, and saving team time.' },
  { id: 'a7', roleCategory: 'Administration & Support', question: 'How do you handle tight afternoon deadlines when unexpected tasks arise?', coachingTip: 'Mention communicating transparently with supervisors and triaging tasks.' },
  { id: 'a8', roleCategory: 'Administration & Support', question: 'Why do you want to build a career in administration with our company?', coachingTip: 'Align your organizational strengths, communication skills, and reliability.' },

  // Construction & Trades (8 Questions)
  { id: 't1', roleCategory: 'Construction & Trades', question: 'What steps do you take if you notice a teammate operating power tools unsafely on site?', coachingTip: 'Emphasize site safety rules, respectful peer reminders, and stop-work authority.' },
  { id: 't2', roleCategory: 'Construction & Trades', question: 'How do you handle tool or machinery breakdowns in the middle of a site job?', coachingTip: 'Mention tagging out faulty equipment immediately and switching to alternative site tasks.' },
  { id: 't3', roleCategory: 'Construction & Trades', question: 'Describe a time you worked outdoors in extreme heat or difficult weather conditions.', coachingTip: 'Focus on hydration, regular shade breaks, and monitoring team health.' },
  { id: 't4', roleCategory: 'Construction & Trades', question: 'How do you ensure you arrive fit for work and fully prepared for early site starts?', coachingTip: 'Highlight discipline, routine preparation of PPE gear, and punctuality.' },
  { id: 't5', roleCategory: 'Construction & Trades', question: 'Tell me about a situation where site plans or specifications changed mid-job.', coachingTip: 'Discuss active listening during pre-start toolbox talks and following revised drawings.' },
  { id: 't6', roleCategory: 'Construction & Trades', question: 'How do you maintain clear communication with sub-contractors on active build sites?', coachingTip: 'Mention high-vis presence, clear hand/radio signals, and mutual respect.' },
  { id: 't7', roleCategory: 'Construction & Trades', question: 'Describe a time you assisted with site cleanup and hazardous material disposal.', coachingTip: 'Highlight environmental compliance, chemical safety, and keeping site access clear.' },
  { id: 't8', roleCategory: 'Construction & Trades', question: 'Why are you pursuing a career in construction and site trades?', coachingTip: 'Connect your hands-on work ethic, trade ambitions, and dedication to safety.' },
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
  const [calculatedScore, setCalculatedScore] = useState<number>(88);
  const [generatedFeedback, setGeneratedFeedback] = useState<string[]>([]);

  useEffect(() => {
    initSession(selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    return () => stopAndResetMic();
  }, []);

  // Fisher-Yates shuffle algorithm for questions
  const shuffleQuestions = (array: InterviewQuestion[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initSession = (role: typeof selectedRole) => {
    const questions = QUESTION_BANK.filter((q) => q.roleCategory === role);
    const randomizedQuestions = shuffleQuestions(questions);
    setSessionQuestions(randomizedQuestions);
    setCurrentIndex(0);
    setUserAnswers([]);
    setIsSessionFinished(false);
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

  // Dynamic evaluation & positive sentiment score generator
  const evaluateAndSaveSession = (answers: string[]) => {
    let baseScore = 78;
    const totalWords = answers.join(' ').split(/\s+/).length;
    
    if (totalWords > 80) baseScore += 8;
    else if (totalWords > 40) baseScore += 5;

    const keyTerms = ['safety', 'whs', 'team', 'customer', 'supervisor', 'check', 'ppe', 'communication', 'resolve', 'action'];
    let termMatches = 0;
    const combinedText = answers.join(' ').toLowerCase();
    keyTerms.forEach((term) => {
      if (combinedText.includes(term)) termMatches++;
    });

    const finalScore = Math.min(98, Math.max(76, baseScore + Math.min(12, termMatches * 2)));
    setCalculatedScore(finalScore);

    const feedbackNotes = [
      `Demonstrated high workplace awareness with solid structure across all 8 responses.`,
      `Communication tone remained positive, encouraging, and professional for ${selectedRole} opportunities.`,
      `Effective focus on safe procedures, problem resolution, and practical step-by-step actions.`
    ];
    setGeneratedFeedback(feedbackNotes);

    const firstQuestion = sessionQuestions[0]?.question || "8-Question Behavioral Assessment";
    const newRecord = {
      id: `star-${Date.now()}`,
      question: firstQuestion,
      jobRole: selectedRole,
      situation: answers[0] || "Identified workplace scenario and key parameters.",
      task: answers[1] || answers[2] || "Organized task priorities and safety standards.",
      action: answers[3] || answers[4] || "Executed steps using active team communication.",
      result: answers[answers.length - 1] || "Task completed safely with positive outcome.",
      score: finalScore,
      date: new Date().toLocaleDateString('en-AU')
    };

    try {
      const existingRaw = localStorage.getItem('workready_star_history');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [newRecord, ...existing];
      localStorage.setItem('workready_star_history', JSON.stringify(updated));
      window.dispatchEvent(new Event('starHistoryUpdated'));
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
    setCurrentTip(`Encouraging Tip: ${q.coachingTip}`);

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
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#24083b]">Interview Practice Studio</h2>
            <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
              Shuffled 8-Question Suite
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Practice answering employer questions by typing or speaking. Questions shuffle on each reset.
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
              <span className="bg-purple-800/80 px-2.5 py-0.5 rounded-full text-[10px]">+25 PBAS Points on Completion</span>
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
        /* Dynamic Interview Evaluation Report */
        <div className="space-y-6 text-xs">
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <Trophy className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-black text-[#24083b]">8-Question Interview Studio Complete! 🎉</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              You've successfully completed all 8 questions for <strong>{selectedRole}</strong> and earned <strong>+25 PBAS Points</strong>!
            </p>
            <div className="inline-block px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-full text-xs">
              Overall Match Score: {calculatedScore}% • Saved to Saved History Below
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h4 className="font-bold text-[#24083b] flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-purple-700" /> Summary Evaluation Report:
            </h4>
            <ul className="space-y-2 text-slate-700 list-disc list-inside">
              {generatedFeedback.map((note, idx) => (
                <li key={idx}><strong>Key Strength:</strong> {note}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => initSession(selectedRole)}
              className="px-6 py-2.5 bg-[#24083b] text-white font-bold rounded-xl shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Start New Shuffled 8-Question Session
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StarInterviewSimulator;