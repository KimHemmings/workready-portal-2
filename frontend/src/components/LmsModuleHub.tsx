import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Award,
  Calendar,
  Sparkles,
  Volume2,
  GitBranch,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import CertificateModal, { type CertificateData } from "@/components/CertificateModal";
import { modulesData, type QuizQuestion } from "../data/modulesData";

export interface LMSModule {
  id: string;
  title: string;
  category: string;
  estimatedMins: number;
  pbasPoints: number;
  videoScript: string;
  lesson1Title: string;
  lesson1Content: string[];
  graphicCard1?: {
    title: string;
    bullets: string[];
  };
  branchingScenario?: {
    id: string;
    situation: string;
    options: Array<{
      id: string;
      choice: string;
      isCorrect: boolean;
      feedback: string;
    }>;
  };
  lesson2Title: string;
  lesson2Content: string[];
  practicalReflection: string;
  actionStepTitle: string;
  actionStepPrompt: string;
}

export const MODULES_LIST = modulesData;

// Build quiz lookup map keyed by module ID
const QUIZ_DATA: Record<string, Array<{ q: string; options: string[]; correct: number; explanation?: string }>> = modulesData.reduce((acc, m) => {
  const normalizedKey = m.id.toLowerCase();
  const quizItems = m.quiz.map((item: QuizQuestion) => ({
    q: item.question,
    options: item.options,
    correct: item.correctAnswerIndex,
    explanation: item.explanation,
  }));

  acc[normalizedKey] = quizItems;
  acc[m.id] = quizItems;
  if (normalizedKey === "m01") {
    acc["mod-1"] = quizItems;
  }
  return acc;
}, {} as Record<string, Array<{ q: string; options: string[]; correct: number; explanation?: string }>>);

interface ModuleCompletionMeta {
  lastCompletedTimestamp: number;
}

interface Props {
  onModuleCompleted?: (moduleId: string, pbasPoints: number) => void;
}

export default function LmsModuleHub({ onModuleCompleted }: Props) {
  const [completionRecords, setCompletionRecords] = useState<Record<string, ModuleCompletionMeta>>({});
  const [activeModule, setActiveModule] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScorePercent, setQuizScorePercent] = useState<number | null>(null);
  const [scenarioAnswer, setScenarioAnswer] = useState<string | null>(null);
  
  // Certificate Modal State
  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("workready_pbas_module_meta");
      if (stored) {
        setCompletionRecords(JSON.parse(stored));
      } else {
        const defaultMeta = {
          "M01": { lastCompletedTimestamp: Date.now() - 10 * 24 * 60 * 60 * 1000 }
        };
        setCompletionRecords(defaultMeta);
        localStorage.setItem("workready_pbas_module_meta", JSON.stringify(defaultMeta));
      }
    } catch (err) {
      console.error("Error reading module completion meta", err);
    }
  }, []);

  const getQuarterlyStatus = (moduleId: string) => {
    const meta = completionRecords[moduleId] || completionRecords[moduleId.toLowerCase()];
    if (!meta) return { isCompleted: false, daysRemaining: 0, canClaimPoints: true };

    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
    const elapsedMs = Date.now() - meta.lastCompletedTimestamp;

    if (elapsedMs >= ninetyDaysMs) {
      return { isCompleted: true, daysRemaining: 0, canClaimPoints: true };
    } else {
      const remainingMs = ninetyDaysMs - elapsedMs;
      const daysRemaining = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      return { isCompleted: true, daysRemaining, canClaimPoints: false };
    }
  };

  const handleOpenModule = (module: any) => {
    setActiveModule(module);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizScorePercent(null);
    setScenarioAnswer(null);
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextStep = () => {
    if (!activeModule) return;
    const questions = QUIZ_DATA[activeModule.id] || [];

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) {
          correctCount++;
        }
      });

      const calculatedScore = Math.round((correctCount / questions.length) * 100);
      setQuizScorePercent(calculatedScore);

      if (calculatedScore >= 80) {
        const status = getQuarterlyStatus(activeModule.id);
        const now = Date.now();

        const updatedMeta = {
          ...completionRecords,
          [activeModule.id]: { lastCompletedTimestamp: now }
        };
        setCompletionRecords(updatedMeta);
        localStorage.setItem("workready_pbas_module_meta", JSON.stringify(updatedMeta));

        if (status.canClaimPoints && onModuleCompleted) {
          onModuleCompleted(activeModule.id, activeModule.pbasPoints || 15);
        }
      }
    }
  };

  const handleOpenLandscapeCertificate = (moduleTitle: string) => {
    setActiveCertificate({
      id: `CERT-${Date.now()}`,
      candidateName: "Alex Mercer",
      courseTitle: moduleTitle,
      completionDate: new Date().toLocaleDateString("en-AU"),
      score: quizScorePercent ?? 100,
      verificationCode: `WR-MOD-${Math.floor(100000 + Math.random() * 900000)}`,
      issuerName: "Straight Up Training"
    });
  };

  const completedCount = Object.keys(completionRecords).length;

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-heading">LMS Non-Vocational Modules</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              3-Month PBAS Cycle Rules
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Interactive modules with scenarios, policy breakdowns, and competency checks.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 w-fit">
          {completedCount} of {MODULES_LIST.length} Units Completed
        </div>
      </div>

      {/* MODULE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES_LIST.map((mod) => {
          const { isCompleted, daysRemaining, canClaimPoints } = getQuarterlyStatus(mod.id);
          
          return (
            <div
              key={mod.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ background: "linear-gradient(90deg,#24083b,#7C3AED,#16a34a)" }}
              />

              <div>
                <div className="flex items-center justify-between mb-3 pt-1">
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                    {mod.category}
                  </span>
                  {isCompleted ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-purple-600" /> {mod.estimatedMins} mins
                    </span>
                  )}
                </div>
                
                <h3 className="font-bold text-slate-900 text-base leading-snug font-heading">{mod.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{mod.videoScript}</p>
              </div>

              <div className="mt-5 space-y-2 pt-2 border-t border-slate-100">
                {isCompleted && !canClaimPoints && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 text-[11px] text-purple-900 flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>Next PBAS Claim in <strong>{daysRemaining} Days</strong></span>
                  </div>
                )}

                {isCompleted && canClaimPoints && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-900 flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={3} />
                    <span>Quarterly Claim Available (+{mod.pbasPoints || 15} Pts)</span>
                  </div>
                )}

                <button
                  onClick={() => handleOpenModule(mod)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                    isCompleted
                      ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                      : "bg-[#24083b] text-white hover:bg-[#320b52]"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  {isCompleted ? "Review Lesson Content" : `Start Module (+${mod.pbasPoints || 15} Pts)`}
                </button>

                {/* RESTORED LANDSCAPE CERTIFICATE BUTTON */}
                {isCompleted && (
                  <button
                    onClick={() => handleOpenLandscapeCertificate(mod.title)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Award className="w-4 h-4 text-purple-700" /> View & Print Certificate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RICH VISUAL MODULE MODAL */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-8 border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 font-mono">
                  {activeModule.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 font-heading">{activeModule.title}</h3>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl p-2 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {quizScorePercent === null ? (
              <div className="space-y-8">
                
                {/* Audio Overview Banner */}
                {activeModule.videoScript && (
                  <div className="bg-gradient-to-r from-purple-900 to-[#24083b] text-white p-5 rounded-2xl space-y-2 border border-purple-800 shadow-md">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <Volume2 className="w-4 h-4" /> Audio Introduction
                    </div>
                    <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-normal">
                      "{activeModule.videoScript}"
                    </p>
                  </div>
                )}

                {/* Lesson 1 Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-[#24083b] font-heading flex items-center gap-2 border-b pb-2">
                    <BookOpen className="w-5 h-5 text-purple-700" />
                    {activeModule.lesson1Title}
                  </h4>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeModule.lesson1Content.map((p: string, idx: number) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* VISUAL COMPONENT: WORKPLACE COMPARISON TABLE */}
                {activeModule.graphicCard1 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h5 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-purple-700" />
                      {activeModule.graphicCard1.title}
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeModule.graphicCard1.bullets.map((bullet: string, idx: number) => {
                        const parts = bullet.split(':');
                        const label = parts[0];
                        const detail = parts.slice(1).join(':');

                        return (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                            <span className="text-xs font-bold text-purple-900 uppercase block font-mono">{label}</span>
                            <p className="text-xs text-slate-600 leading-relaxed">{detail || label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* VISUAL COMPONENT: INTERACTIVE BRANCHING SCENARIO */}
                {activeModule.branchingScenario && (
                  <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-purple-900 font-bold text-sm font-heading">
                      <GitBranch className="w-5 h-5 text-purple-700" />
                      Interactive Workplace Decision Scenario
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 bg-white p-4 rounded-xl border border-purple-100 shadow-sm leading-relaxed">
                      {activeModule.branchingScenario.situation}
                    </p>

                    <div className="space-y-3">
                      {activeModule.branchingScenario.options.map((opt: any) => {
                        const isSelected = scenarioAnswer === opt.id;

                        return (
                          <div key={opt.id} className="space-y-2">
                            <button
                              onClick={() => setScenarioAnswer(opt.id)}
                              className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                                isSelected
                                  ? opt.isCorrect
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500"
                                    : "bg-rose-50 border-rose-500 text-rose-900 font-bold ring-1 ring-rose-500"
                                  : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
                              }`}
                            >
                              {opt.choice}
                            </button>

                            {isSelected && (
                              <div
                                className={`text-xs p-3 rounded-lg border font-medium ${
                                  opt.isCorrect
                                    ? "bg-emerald-100/70 border-emerald-300 text-emerald-900"
                                    : "bg-rose-100/70 border-rose-300 text-rose-900"
                                }`}
                              >
                                <strong>{opt.isCorrect ? "✅ Good Decision: " : "⚠️️ Operational Caution: "}</strong>
                                {opt.feedback}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Lesson 2 Section */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-lg font-bold text-[#24083b] font-heading flex items-center gap-2 border-b pb-2">
                    <BookOpen className="w-5 h-5 text-purple-700" />
                    {activeModule.lesson2Title}
                  </h4>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeModule.lesson2Content.map((p: string, idx: number) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* Practical Reflection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase font-mono">Practical Reflection</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{activeModule.practicalReflection}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-purple-700 uppercase font-mono">{activeModule.actionStepTitle}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{activeModule.actionStepPrompt}</p>
                  </div>
                </div>

                {/* QUIZ ASSESSMENT SECTION */}
                {(() => {
                  const questions = QUIZ_DATA[activeModule.id] || [];
                  const currentQ = questions[currentQuestionIndex];
                  if (!currentQ) return <p className="text-xs text-slate-500 italic">No quiz questions loaded for this module.</p>;

                  return (
                    <div className="border-t pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-purple-700" /> Module Competency Assessment
                        </h4>
                        <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                          Pass Mark: 80%+
                        </span>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                        <div className="text-xs font-bold text-slate-500 uppercase font-mono">
                          Question {currentQuestionIndex + 1} of {questions.length}
                        </div>

                        <p className="font-bold text-slate-900 text-sm sm:text-base">
                          {currentQ.q}
                        </p>

                        <div className="space-y-2">
                          {currentQ.options.map((optionText: string, optIdx: number) => {
                            const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                                className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                                  isSelected
                                    ? "border-purple-700 bg-purple-50 text-purple-900 ring-1 ring-purple-700 font-bold"
                                    : "border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                                }`}
                              >
                                {optionText}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleNextStep}
                          disabled={selectedAnswers[currentQuestionIndex] == null}
                          className="bg-[#24083b] hover:bg-[#320b52] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                        >
                          {currentQuestionIndex < questions.length - 1 ? (
                            <>Next Question <ArrowRight className="w-4 h-4" /></>
                          ) : (
                            "Submit Assessment"
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* RESULTS DISPLAY WITH CERTIFICATE TRIGGER */
              <div className="text-center py-8 space-y-5">
                {quizScorePercent >= 80 ? (
                  <div className="space-y-4">
                    <CheckCircle2 className="w-20 h-20 text-emerald-600 mx-auto" />
                    <h4 className="text-2xl font-bold text-slate-900 font-heading">Competency Confirmed! 🎉</h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      You scored <span className="font-bold text-emerald-600 text-base">{quizScorePercent}%</span>. Your official completion record has been verified and logged to your PBAS total.
                    </p>
                    <button
                      onClick={() => {
                        const title = activeModule.title;
                        setActiveModule(null);
                        handleOpenLandscapeCertificate(title);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all"
                    >
                      <Award className="w-4 h-4" /> View & Print Landscape Certificate
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <RotateCcw className="w-16 h-16 text-amber-500 mx-auto" />
                    <h4 className="text-2xl font-bold text-slate-900 font-heading">Assessment Retry Required</h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      You scored <span className="font-bold text-amber-600 text-base">{quizScorePercent}%</span> (Pass requirement: 80%+). Please review the lesson content and attempt the assessment again.
                    </p>
                    <button
                      onClick={() => {
                        setQuizScorePercent(null);
                        setCurrentQuestionIndex(0);
                        setSelectedAnswers({});
                      }}
                      className="bg-[#24083b] hover:bg-[#320b52] text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
                    >
                      Retake Assessment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LANDSCAPE CERTIFICATE MODAL */}
      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          open={Boolean(activeCertificate)}
          onClose={() => setActiveCertificate(null)}
        />
      )}
    </div>
  );
}