import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modulesData } from '../data/modulesData';
import CertifiedLmsModule from '../components/CertifiedLmsModule';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Lightbulb, 
  ShieldAlert, 
  Video 
} from 'lucide-react';

export const ModuleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find module by id or moduleNumber
  const module = modulesData.find(
    (m: any) => m.id === id || m.moduleNumber === Number(id)
  );

  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'certificate'>('content');
  const [selectedScenarioOpt, setSelectedScenarioOpt] = useState<string | null>(null);

  if (!module) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Module Not Found</h2>
        <button
          onClick={() => navigate('/learning')}
          className="px-4 py-2 bg-[#24083b] text-white font-bold text-xs rounded-xl"
        >
          Return to Learning Hub
        </button>
      </div>
    );
  }

  // Quiz State
  const quizQuestions: any[] = module.quiz || [];
  const [userAnswers, setUserAnswers] = useState<number[]>(Array(quizQuestions.length).fill(-1));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  const handleSelectAnswer = (qIdx: number, oIdx: number) => {
    const updated = [...userAnswers];
    updated[qIdx] = oIdx;
    setUserAnswers(updated);
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizSubmitted(true);

    const correctCount = userAnswers.reduce((acc: number, ans: number, idx: number) => {
      const targetCorrect = quizQuestions[idx]?.correctAnswerIndex ?? quizQuestions[idx]?.correctAnswer ?? 0;
      return ans === targetCorrect ? acc + 1 : acc;
    }, 0);

    const passThreshold = Math.max(1, Math.ceil(quizQuestions.length * 0.7));
    const isPass = correctCount >= passThreshold;
    setQuizPassed(isPass);

    if (isPass) {
      setActiveTab('certificate');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <CertifiedLmsModule
        candidateName="Alex Johnson"
        moduleData={module}
        onComplete={() => {}}
      />
    </div>
  );
};

export default ModuleDetail;