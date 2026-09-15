import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Send, CheckCircle2, Briefcase, Mic, Pause, Lightbulb, Trophy } from 'lucide-react';

export interface InterviewQuestion {
  id: string;
  roleCategory: 'Warehouse & Logistics' | 'Retail & Hospitality' | 'Administration & Support' | 'Construction & Trades';
  category: string;
  question: string;
  coachingTip: string;
}

const QUESTION_BANK: InterviewQuestion[] = [
  // Warehouse
  { id: 'w1', roleCategory: 'Warehouse & Logistics', category: 'WHS & Safety', question: 'Tell me about a time you noticed a safety hazard on the warehouse floor. What did you do?', coachingTip: 'Mention immediate hazard isolation, wearing correct PPE, and notifying your supervisor.' },
  { id: 'w2', roleCategory: 'Warehouse & Logistics', category: 'Dispatch Pressure', question: 'How do you ensure picking accuracy when working against urgent dispatch deadlines?', coachingTip: 'Highlight double-checking SKU barcodes and staying calm under pressure.' },
  
  // Retail
  { id: 'r1', roleCategory: 'Retail & Hospitality', category: 'Customer Service', question: 'How would you handle an upset customer who wants a refund for an item without a receipt?', coachingTip: 'Focus on active listening, staying polite, and following store policy with empathy.' },
  { id: 'r2', roleCategory: 'Retail & Hospitality', category: 'Rush Hours', question: 'Describe how you manage long customer queues during peak trading hours.', coachingTip: 'Mention quick team communication and keeping your workspace organized.' },

  // Admin
  { id: 'a1', roleCategory: 'Administration & Support', category: 'Prioritization', question: 'How do you handle multiple urgent tasks like answering phones while completing data entry?', coachingTip: 'Explain how you prioritize urgent customer calls while keeping accurate records.' },
  { id: 'a2', roleCategory: 'Administration & Support', category: 'Software Adaptation', question: 'Describe a time you had to learn a new computer system or software quickly.', coachingTip: 'Highlight taking notes during orientation and asking clarifying questions.' },

  // Construction
  { id: 't1', roleCategory: 'Construction & Trades', category: 'Site Safety', question: 'What steps do you take if you notice a teammate operating power tools unsafely?', coachingTip: 'Emphasize site safety rules, respectful peer reminders, and reporting hazards.' },
  { id: 't2', roleCategory: 'Construction & Trades', category: 'Equipment Issues', question: 'How do you handle equipment or tool breakdowns in the middle of a site project?', coachingTip: 'Mention tagging out faulty equipment immediately and switching to alternative tasks.' },
];

export const StarInterviewSimulator: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'Warehouse & Logistics' | 'Retail & Hospitality' | 'Administration & Support' | 'Construction & Trades'>('Warehouse & Logistics');
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Single unified response state (Type or Voice)
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Encouraging Feedback States (No numerical scoring during the interview)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTip, setCurrentTip] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  useEffect(() => {
    initSession(selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    return () => stopAndResetMic();
  }, []);

  const initSession = (role: typeof selectedRole) => {
    const roleQuestions = QUESTION_BANK.filter((q) => q.roleCategory === role);
    const shuffled = [...roleQuestions].sort(() => Math.random() - 0.5).slice(0, 8);
    setSessionQuestions(shuffled);
    setCurrentIndex(0);
    setCompletedCount(0);
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
      alert("Voice input isn't supported in this browser. You can type your response below!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-AU';

    recognition.onresult = (e: any) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setCandidateAnswer((prev) => `${prev} ${transcript}`.trim());
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

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stopAndResetMic();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const nextCount = completedCount + 1;
      setCompletedCount(nextCount);

      const q = sessionQuestions[currentIndex];
      setCurrentTip(`Great effort! Tip for your next answer: ${q.coachingTip}`);

      if (nextCount >= sessionQuestions.length || currentIndex >= sessionQuestions.length - 1) {
        setIsSessionFinished(true);
      }
    }, 800);
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
              Confidence & Skill Builder
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Practice answering real employer questions by typing or speaking. 8 random questions per session.
          </p>
        </div>

        {/* Role Selector */}
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
          {/* Question Banner */}
          <div className="p-5 bg-gradient-to-r from-purple-900 to-[#24083b] text-white rounded-2xl space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-purple-200">
              <span className="uppercase tracking-wider">Question {currentIndex + 1} of {sessionQuestions.length || 8} • {selectedRole}</span>
              <span className="bg-purple-800/80 px-2.5 py-0.5 rounded-full text-[10px]">+25 PBAS Points on Completion</span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
              "{currentQ?.question}"
            </h3>
          </div>

          {/* Unified Response Form (Type or Speak) */}
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
                  {isListening ? 'Recording... (Click to Pause)' : 'Click to Speak Answer 🎙️'}
                </button>
              </div>

              <textarea
                required
                rows={5}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Type or dictate your answer here..."
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-purple-200 text-xs text-slate-800"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="text-slate-500 hover:text-slate-700 font-bold text-xs"
              >
                Skip Question →
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !candidateAnswer.trim()}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Saving...' : <><Send className="w-4 h-4" /> Submit Response & Get Coaching Tip</>}
              </button>
            </div>
          </form>

          {/* Coaching Tip Card */}
          {currentTip && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 animate-fadeIn">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div>{currentTip}</div>
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-1.5 bg-[#16a34a] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs"
                >
                  Next Question →
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* End of Session Encouragement Card */
        <div className="py-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <div className="inline-flex p-3 bg-emerald-500 text-white rounded-full">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-[#24083b]">Interview Practice Completed! 🎉</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Great work completing all 8 interview practice questions for <strong>{selectedRole}</strong>. You've earned <strong>+25 PBAS Points</strong>!
          </p>
          <button
            onClick={() => initSession(selectedRole)}
            className="px-6 py-2.5 bg-[#24083b] text-white font-bold text-xs rounded-xl shadow-sm"
          >
            Start Another 8-Question Session
          </button>
        </div>
      )}

    </div>
  );
};

export default StarInterviewSimulator;
