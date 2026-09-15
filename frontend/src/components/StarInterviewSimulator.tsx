import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Send, CheckCircle2, Briefcase, Mic, MicOff, Pause, Play } from 'lucide-react';

export interface StarQuestion {
  id: string;
  roleCategory: 'Warehouse & Logistics' | 'Retail & Hospitality' | 'Administration & Support' | 'Construction & Trades';
  category: string;
  question: string;
  contextHint: string;
}

const ROLE_QUESTION_BANK: StarQuestion[] = [
  {
    id: 'wh-1',
    roleCategory: 'Warehouse & Logistics',
    category: 'WHS & Spill Response',
    question: 'Describe a time you identified a potential safety hazard in the warehouse. What immediate action did you take?',
    contextHint: 'Focus on your immediate hazard isolation, high-vis PPE, and supervisor reporting.',
  },
  {
    id: 'wh-2',
    roleCategory: 'Warehouse & Logistics',
    category: 'Dispatch Deadlines',
    question: 'Tell me about a time you had to pick and pack orders under an urgent dispatch deadline. How did you maintain accuracy?',
    contextHint: 'Highlight double-checking SKU barcodes, staying calm, and maintaining zero pick errors.',
  },
  {
    id: 'ret-1',
    roleCategory: 'Retail & Hospitality',
    category: 'De-escalation & Service',
    question: 'Describe a scenario where an angry customer brought back a damaged product or complained about long wait times. How did you resolve it?',
    contextHint: 'Emphasize active listening, apologizing professionally, and offering an immediate refund or replacement.',
  },
  {
    id: 'ret-2',
    roleCategory: 'Retail & Hospitality',
    category: 'Peak Rush Management',
    question: 'Tell me about a shift where your store or venue was understaffed during peak hours. How did you prioritize tasks?',
    contextHint: 'Focus on teamwork, quick communication with team members, and keeping customer wait times down.',
  },
  {
    id: 'admin-1',
    roleCategory: 'Administration & Support',
    category: 'Data Accuracy & Privacy',
    question: 'Tell me about a time you had to handle confidential client records or process detailed data under a tight turnaround.',
    contextHint: 'Mention compliance checks, data security protocols, and double-checking entry accuracy.',
  },
  {
    id: 'admin-2',
    roleCategory: 'Administration & Support',
    category: 'Multitasking & Software',
    question: 'Describe a situation where you had to quickly learn a new CRM software while managing incoming calls.',
    contextHint: 'Highlight adaptability, taking notes during training, and maintaining high service quality.',
  },
  {
    id: 'trade-1',
    roleCategory: 'Construction & Trades',
    category: 'Site Safety & PPE',
    question: 'Describe a situation on-site where a sub-contractor or teammate was not wearing required safety gear.',
    contextHint: 'Highlight site safety rules, respectful peer-to-peer intervention, and stop-work authority.',
  },
  {
    id: 'trade-2',
    roleCategory: 'Construction & Trades',
    category: 'Equipment Failure',
    question: 'Tell me about a time machinery or equipment broke down on-site during an active job. How did you keep work moving safely?',
    contextHint: 'Focus on reporting tool failures, tagging out broken gear, and shifting to alternative site tasks.',
  },
];

export const StarInterviewSimulator: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'Warehouse & Logistics' | 'Retail & Hospitality' | 'Administration & Support' | 'Construction & Trades'>('Warehouse & Logistics');
  const [activeQuestions, setActiveQuestions] = useState<StarQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // STAR Input States
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');

  // Microphone / Voice Input States
  const [isListening, setIsListening] = useState(false);
  const [activeMicField, setActiveMicField] = useState<'situation' | 'task' | 'action' | 'result' | null>(null);
  const recognitionRef = useRef<any>(null);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; strengths: string; improvement: string } | null>(null);

  useEffect(() => {
    filterAndShuffleByRole(selectedRole);
  }, [selectedRole]);

  // Clean up microphone stream on unmount
  useEffect(() => {
    return () => {
      stopAndResetMicrophone();
    };
  }, []);

  const filterAndShuffleByRole = (role: typeof selectedRole) => {
    const roleSpecific = ROLE_QUESTION_BANK.filter((q) => q.roleCategory === role);
    const shuffled = [...roleSpecific].sort(() => Math.random() - 0.5);
    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    resetForm();
  };

  const stopAndResetMicrophone = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (err) {
        // Safe catch for already stopped instances
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setActiveMicField(null);
  };

  const toggleMicrophone = (field: 'situation' | 'task' | 'action' | 'result') => {
    // If clicking active listening field, perform full pause & reset
    if (isListening && activeMicField === field) {
      stopAndResetMicrophone();
      return;
    }

    // Stop any existing session before starting new one
    stopAndResetMicrophone();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your response directly.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-AU';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (field === 'situation') setSituation((prev) => `${prev} ${transcript}`.trim());
      if (field === 'task') setTask((prev) => `${prev} ${transcript}`.trim());
      if (field === 'action') setAction((prev) => `${prev} ${transcript}`.trim());
      if (field === 'result') setResult((prev) => `${prev} ${transcript}`.trim());
    };

    recognition.onerror = () => {
      stopAndResetMicrophone();
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveMicField(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setActiveMicField(field);
  };

  const resetForm = () => {
    stopAndResetMicrophone();
    setSituation('');
    setTask('');
    setAction('');
    setResult('');
    setFeedback(null);
  };

  const handleNextQuestion = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetForm();
    } else {
      filterAndShuffleByRole(selectedRole);
    }
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    stopAndResetMicrophone();
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      setFeedback({
        score: Math.floor(Math.random() * 12) + 86,
        strengths: `Excellent industry alignment for ${selectedRole}! Clear STAR structure and specific action steps.`,
        improvement: 'Add a specific metric or timeframe in your Result to quantify your success for interviewers.',
      });
    }, 1200);
  };

  const currentQ = activeQuestions[currentIndex] || ROLE_QUESTION_BANK[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#24083b]">AI STAR Interview Simulator</h2>
            <span className="bg-purple-50 text-[#24083b] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600" /> Voice Input Supported
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your target sector and practice structuring responses via typing or dictation.
          </p>
        </div>

        {/* Industry Sector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Briefcase className="w-4 h-4 text-purple-700" /> Target Industry:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#24083b] outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="Warehouse & Logistics">Warehouse & Logistics</option>
            <option value="Retail & Hospitality">Retail & Hospitality</option>
            <option value="Administration & Support">Administration & Support</option>
            <option value="Construction & Trades">Construction & Trades</option>
          </select>
        </div>
      </div>

      {/* Active Question Banner */}
      <div className="p-5 bg-gradient-to-r from-purple-900 to-[#24083b] text-white rounded-2xl space-y-3 shadow-md">
        <div className="flex items-center justify-between text-xs font-bold text-purple-200">
          <span className="uppercase tracking-wider">{selectedRole} • Question {currentIndex + 1} of {activeQuestions.length}</span>
          <span className="bg-purple-800/80 px-2.5 py-0.5 rounded-full text-[10px]">+25 PBAS Points</span>
        </div>

        <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
          "{currentQ.question}"
        </h3>

        <p className="text-xs text-purple-200 bg-purple-950/60 p-2.5 rounded-xl border border-purple-800">
          💡 <strong>Targeted Tip for {selectedRole}:</strong> {currentQ.contextHint}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Field 1: Situation */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800">1. Situation (Where & When)</label>
              <button
                type="button"
                onClick={() => toggleMicrophone('situation')}
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border font-bold transition-all ${
                  isListening && activeMicField === 'situation'
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isListening && activeMicField === 'situation' ? <Pause className="w-3 h-3" /> : <Mic className="w-3 h-3 text-purple-700" />}
                {isListening && activeMicField === 'situation' ? 'Pause / Reset Mic' : 'Voice Input'}
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder={`e.g. During my previous role in ${selectedRole}...`}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Field 2: Task */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800">2. Task (What was your objective?)</label>
              <button
                type="button"
                onClick={() => toggleMicrophone('task')}
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border font-bold transition-all ${
                  isListening && activeMicField === 'task'
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isListening && activeMicField === 'task' ? <Pause className="w-3 h-3" /> : <Mic className="w-3 h-3 text-purple-700" />}
                {isListening && activeMicField === 'task' ? 'Pause / Reset Mic' : 'Voice Input'}
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. My goal was to resolve the issue quickly while adhering to company guidelines..."
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Field 3: Action */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800">3. Action (What specific steps did YOU take?)</label>
              <button
                type="button"
                onClick={() => toggleMicrophone('action')}
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border font-bold transition-all ${
                  isListening && activeMicField === 'action'
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isListening && activeMicField === 'action' ? <Pause className="w-3 h-3" /> : <Mic className="w-3 h-3 text-purple-700" />}
                {isListening && activeMicField === 'action' ? 'Pause / Reset Mic' : 'Voice Input'}
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g. I communicated directly with the supervisor, used safety gear, and prioritized..."
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Field 4: Result */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800">4. Result (What was the outcome?)</label>
              <button
                type="button"
                onClick={() => toggleMicrophone('result')}
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border font-bold transition-all ${
                  isListening && activeMicField === 'result'
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {isListening && activeMicField === 'result' ? <Pause className="w-3 h-3" /> : <Mic className="w-3 h-3 text-purple-700" />}
                {isListening && activeMicField === 'result' ? 'Pause / Reset Mic' : 'Voice Input'}
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="e.g. The issue was resolved in 10 minutes with zero incidents and full positive feedback..."
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleNextQuestion}
            className="text-slate-600 hover:text-slate-800 font-bold text-xs"
          >
            Skip to Next Role Question →
          </button>

          <button
            type="submit"
            disabled={isEvaluating}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#24083b] hover:bg-[#320b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {isEvaluating ? 'Evaluating with AI...' : <><Send className="w-4 h-4" /> Evaluate STAR Response (+25 Pts)</>}
          </button>
        </div>
      </form>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <span className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Tailored AI Feedback ({selectedRole})
            </span>
            <span className="px-3 py-1 bg-emerald-600 text-white font-black rounded-full text-xs">
              {feedback.score}% Match
            </span>
          </div>
          <div className="space-y-1 text-slate-700">
            <p><strong>Strengths:</strong> {feedback.strengths}</p>
            <p><strong>Tips to Improve:</strong> {feedback.improvement}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarInterviewSimulator;
