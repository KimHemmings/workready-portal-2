import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, PlayCircle, BookOpen, 
  HelpCircle, Award, ShieldCheck, AlertCircle, RotateCcw 
} from 'lucide-react';

import AppShell from "@/components/AppShell";
import CertificateModal from "@/components/CertificateModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { modulesData } from "@/data/modulesData";

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find module by ID or fallback to Module 1
  const currentModule = modulesData.find(
    (m) => m.id === id || m.id === `M0${id}` || String(m.moduleNumber) === id
  ) || modulesData[0];

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);

  // Scenario state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Certificate Modal state
  const [showCert, setShowCert] = useState(false);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let allCorrect = true;
    currentModule.quiz.forEach((q) => {
      if (selectedAnswers[q.id] !== q.correctAnswerIndex) {
        allCorrect = false;
      }
    });

    setQuizSubmitted(true);
    setPassed(allCorrect);

    if (allCorrect) {
      setShowCert(true);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setPassed(false);
  };

  return (
    <AppShell>
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learning Hub
        </Button>
        <Badge variant="outline" className="bg-brand-purple-soft/50 text-brand-purple border-brand-purple/30 gap-1.5 py-1 px-3">
          <ShieldCheck className="h-4 w-4 text-brand-purple" />
          +{currentModule.pbasPoints} PBAS Points
        </Badge>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Module Banner */}
        <Card className="relative overflow-hidden border-2">
          <div 
            className="absolute inset-x-0 top-0 h-1.5" 
            style={{ background: "linear-gradient(90deg,#1E3A8A,#7C3AED,#F97316)" }}
          />
          <CardHeader className="pt-6">
            <p className="text-xs uppercase tracking-wider font-semibold text-brand-purple font-mono">
              {currentModule.category}
            </p>
            <CardTitle className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
              {currentModule.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentModule.videoScript && (
              <div className="text-muted-foreground text-sm leading-relaxed bg-muted/60 p-4 rounded-xl border">
                <span className="font-bold text-brand-purple">Audio Intro: </span>
                "{currentModule.videoScript}"
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lesson 1 & Key Highlight Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-brand-purple font-heading font-bold text-lg">
              <BookOpen className="h-5 w-5" />
              <h2>{currentModule.lesson1Title}</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
              {currentModule.lesson1Content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {currentModule.graphicCard1 && (
              <div className="bg-brand-purple-soft/30 border border-brand-purple/20 rounded-xl p-5">
                <h3 className="font-bold text-brand-purple text-sm mb-3 font-heading">
                  {currentModule.graphicCard1.title}
                </h3>
                <ul className="space-y-2">
                  {currentModule.graphicCard1.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Branching Scenario */}
        {currentModule.branchingScenario && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 font-heading font-bold text-lg">
                <PlayCircle className="h-5 w-5 text-brand-purple" />
                <h2>Workplace Interactive Scenario</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground bg-muted/60 p-4 rounded-xl border">
                {currentModule.branchingScenario.situation}
              </p>

              <div className="space-y-3 pt-2">
                {currentModule.branchingScenario.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  return (
                    <div key={opt.id} className="space-y-2">
                      <button
                        onClick={() => setSelectedOption(opt.id)}
                        className={`w-full text-left p-4 rounded-xl text-sm transition-all border font-medium ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-success/10 border-success text-success-foreground'
                              : 'bg-destructive/10 border-destructive text-destructive'
                            : 'bg-background hover:bg-muted/50 border-input text-foreground'
                        }`}
                      >
                        {opt.choice}
                      </button>
                      {isSelected && (
                        <div
                          className={`text-xs p-3 rounded-lg border ${
                            opt.isCorrect
                              ? 'bg-success/10 border-success/30 text-emerald-700 dark:text-emerald-300'
                              : 'bg-destructive/10 border-destructive/30 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {opt.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lesson 2 & Reflection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-brand-purple font-heading font-bold text-lg">
              <BookOpen className="h-5 w-5" />
              <h2>{currentModule.lesson2Title}</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
              {currentModule.lesson2Content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-muted/50 border p-4 rounded-xl space-y-1.5">
                <h4 className="font-bold text-xs text-brand-purple uppercase tracking-wider font-mono">Practical Reflection</h4>
                <p className="text-xs text-muted-foreground">{currentModule.practicalReflection}</p>
              </div>
              <div className="bg-muted/50 border p-4 rounded-xl space-y-1.5">
                <h4 className="font-bold text-xs text-brand-purple uppercase tracking-wider font-mono">{currentModule.actionStepTitle}</h4>
                <p className="text-xs text-muted-foreground">{currentModule.actionStepPrompt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5-Question Quiz Assessment */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-heading font-bold text-xl">
                <HelpCircle className="h-5 w-5 text-brand-purple" />
                <h2>Module Competency Assessment</h2>
              </div>
              <Badge variant="destructive" className="text-[11px] font-semibold">
                100% Pass Mark Required
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              {currentModule.quiz.map((q, idx) => {
                const selectedOpt = selectedAnswers[q.id];
                const isCorrect = selectedOpt === q.correctAnswerIndex;

                return (
                  <div key={q.id} className="bg-muted/40 border p-5 rounded-xl space-y-3">
                    <p className="font-semibold text-sm text-foreground">
                      {idx + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isOptionSelected = selectedOpt === optIdx;
                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all border font-medium ${
                              isOptionSelected
                                ? quizSubmitted
                                  ? isCorrect
                                    ? 'bg-success/20 border-success text-emerald-800 dark:text-emerald-200'
                                    : 'bg-destructive/20 border-destructive text-rose-800 dark:text-rose-200'
                                  : 'bg-brand-purple-soft text-brand-purple border-brand-purple'
                                : 'bg-background hover:bg-muted border-input text-muted-foreground'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div
                        className={`text-xs p-3 rounded-lg border ${
                          isCorrect
                            ? 'bg-success/10 border-success/30 text-emerald-700 dark:text-emerald-300'
                            : 'bg-destructive/10 border-destructive/30 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        <span className="font-bold">{isCorrect ? 'Correct! ' : 'Incorrect. '}</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < currentModule.quiz.length}
                className="w-full mt-4 bg-cta text-cta-foreground hover:bg-cta/90 font-bold"
              >
                Submit Assessment
              </Button>
            ) : (
              <div className="space-y-4 pt-2">
                {passed ? (
                  <div className="bg-success/10 border border-success/30 p-6 rounded-xl text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-lg font-heading">
                      <CheckCircle2 className="h-6 w-6" />
                      <span>Module Competency Achieved! (100%)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +5 PBAS Points awarded and cryptographically verified.
                    </p>
                    <Button
                      onClick={() => setShowCert(true)}
                      className="bg-cta text-cta-foreground hover:bg-cta/90 font-bold text-xs gap-2"
                    >
                      <Award className="h-4 w-4" />
                      View & Print Official Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="bg-destructive/10 border border-destructive/30 p-6 rounded-xl text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-destructive font-bold text-base font-heading">
                      <AlertCircle className="h-5 w-5" />
                      <span>100% Pass Mark Required for PBAS Credit</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Review the feedback above and attempt the quiz again.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleResetQuiz}
                      className="text-xs font-bold gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retry Assessment
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Certificate Modal */}
      {showCert && (
        <CertificateModal
          open={showCert}
          onClose={() => setShowCert(false)}
          certificate={{
            id: currentModule.id,
            candidateName: 'Alex Mercer',
            courseTitle: currentModule.title,
            completionDate: new Date().toISOString(),
            score: 100,
            verificationCode: `WR-M01-${Date.now().toString(36).toUpperCase()}`,
            issuerName: 'Straight Up Training'
          }}
        />
      )}
    </AppShell>
  );
}