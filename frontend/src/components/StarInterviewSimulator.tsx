import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_BANKS } from '../data/interviewQuestions';
import { Mic, MicOff, Volume2, Award, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

interface StarInterviewSimulatorProps {
  onAwardPoints?: (points: number) => void;
}

export const StarInterviewSimulator: React.FC<StarInterviewSimulatorProps> = ({ onAwardPoints }) => {
  const [selectedSector, setSelectedSector] = useState<string>('retail');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ score: number; starCheck: { s: boolean; t: boolean; a: boolean; r: boolean }; notes: string } | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition API
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-AU';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setUserTranscript((prev) => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const currentQuestions = QUESTION_BANKS[selectedSector] || QUESTION_BANKS.retail;
  const activeQuestion = currentQuestions[questionIndex] || currentQuestions[0];

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type your response manually.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Microphone start exception:", e);
      }
    }
  };

  const readQuestionTTS = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeQuestion);
      const voices = window.speechSynthesis.getVoices();
      const auVoice = voices.find((v) => v.lang === 'en-AU') || voices[0];
      if (auVoice) utterance.voice = auVoice;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const evaluateResponse = () => {
    if (!userTranscript.trim()) {
      alert("Please record or type an answer before requesting STAR evaluation.");
      return;
    }

    const text = userTranscript.toLowerCase();
    
    // Rule-based heuristic check for STAR components
    const hasSituation = text.includes('when') || text.includes('time') || text.includes('during') || text.includes('role');
    const hasTask = text.includes('needed') || text.includes('had to') || text.includes('goal') || text.includes('responsible');
    const hasAction = text.includes('i ') || text.includes('did') || text.includes('handled') || text.includes('organized');
    const hasResult = text.includes('result') || text.includes('improved') || text.includes('helped') || text.includes('successfully');

    let score = 50;
    if (hasSituation) score += 10;
    if (hasTask) score += 10;
    if (hasAction) score += 15;
    if (hasResult) score += 15;

    setFeedback({
      score,
      starCheck: { s: hasSituation, t: hasTask, a: hasAction, r: hasResult },
      notes: score >= 80 
        ? "Excellent structured response! You clearly established the Situation, Task, Action, and Result."
        : "Good attempt! Try to explicitly state the outcome or result of your actions to achieve higher STAR marks."
    });

    if (onAwardPoints) {
      onAwardPoints(25);
    }
  };

  const handleNextQuestion = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setFeedback(null);
    setUserTranscript('');
    setQuestionIndex((prev) => (prev + 1) % currentQuestions.length);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">AI STAR Interview Coach</h2>
            <span className="bg-[#24083b]/10 text-[#24083b] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#24083b]/20">
              Interactive Voice Coach
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Practice sector-specific interview questions using the STAR framework (+25 PBAS Points per session).
          </p>
        </div>

        {/* Sector Selection Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700">Sector:</label>
          <select
            value={selectedSector}
            onChange={(e) => {
              setSelectedSector(e.target.value);
              setQuestionIndex(0);
              setUserTranscript('');
              setFeedback(null);
            }}
            className="p-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-bold text-[#24083b] focus:bg-white outline-none"
          >
            <option value="retail">Retail & Customer Service</option>
            <option value="hospitality">Hospitality & Food Service</option>
            <option value="warehouse">Warehouse & Logistics</option>
            <option value="cleaning">Commercial Cleaning</option>
            <option value="construction">General Construction</option>
            <option value="admin">Administration & Support</option>
          </select>
        </div>
      </div>

      {/* Active Interview Question Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#24083b] px-2.5 py-1 rounded-md border border-purple-100">
              Question {questionIndex + 1} of {currentQuestions.length}
            </span>
            <h3 id="active-question-text" className="text-lg font-bold text-slate-900 mt-3 leading-snug">
              "{activeQuestion}"
            </h3>
          </div>
          <button
            onClick={readQuestionTTS}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Read question aloud (en-AU)"
          >
            <Volume2 className="w-4 h-4 text-[#16a34a]" /> Listen
          </button>
        </div>

        {/* Transcript Recording & Input Panel */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
              Your Response Transcript:
              {isListening && (
                <span className="text-xs text-red-600 font-bold animate-pulse flex items-center gap-1">
                  🔴 Recording... Speak naturally
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-all flex items-center gap-2 ${
                isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-[#24083b] hover:bg-[#320b52]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#16a34a]" />}
              {isListening ? 'Stop Recording' : 'Start Microphone'}
            </button>
          </div>

          <textarea
            rows={5}
            value={userTranscript}
            onChange={(e) => setUserTranscript(e.target.value)}
            placeholder="Click 'Start Microphone' to speak your answer, or type your response here manually using the STAR method..."
            className="w-full p-3.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#24083b]/20 outline-none leading-relaxed"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={evaluateResponse}
            className="px-5 py-2.5 bg-[#16a34a] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Award className="w-4 h-4" /> Evaluate Response (STAR Score)
          </button>

          <button
            onClick={handleNextQuestion}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            Next Question <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* STAR Feedback & Scoring Box */}
      {feedback && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-[#24083b] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#16a34a]" /> STAR Evaluation Results
            </h3>
            <span className="text-sm font-extrabold px-3 py-1 bg-emerald-50 text-[#16a34a] border border-emerald-200 rounded-full">
              Score: {feedback.score} / 100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className={`p-3 rounded-xl border ${feedback.starCheck.s ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <div className="text-xs font-black">S</div>
              <div className="text-[10px] font-bold">Situation</div>
            </div>
            <div className={`p-3 rounded-xl border ${feedback.starCheck.t ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <div className="text-xs font-black">T</div>
              <div className="text-[10px] font-bold">Task</div>
            </div>
            <div className={`p-3 rounded-xl border ${feedback.starCheck.a ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <div className="text-xs font-black">A</div>
              <div className="text-[10px] font-bold">Action</div>
            </div>
            <div className={`p-3 rounded-xl border ${feedback.starCheck.r ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              <div className="text-xs font-black">R</div>
              <div className="text-[10px] font-bold">Result</div>
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <strong>Coach Feedback:</strong> {feedback.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default StarInterviewSimulator;
