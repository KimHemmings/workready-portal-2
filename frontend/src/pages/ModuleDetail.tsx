import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Award, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppShell from "@/components/AppShell";
import Markdown from "@/components/Markdown";
import { apiGet, apiPost } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { ModuleDetail as ModuleDetailType, QuizResult } from "@/lib/types";

export default function ModuleDetail() {
  const { moduleId = "" } = useParams();
  const user = getSessionUser();
  const qc = useQueryClient();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const detail = useQuery({
    queryKey: ["module-detail", user?.id, moduleId],
    queryFn: () => apiGet<ModuleDetailType>(`/participants/${user!.id}/modules/${moduleId}`),
    enabled: Boolean(user && moduleId),
  });

  const start = useMutation({
    mutationFn: () => apiPost(`/participants/${user!.id}/modules/${moduleId}/start`),
  });

  useEffect(() => {
    if (user?.role === "participant" && detail.data && !detail.data.progress && !start.isPending) {
      start.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail.data?.module.id]);

  const submit = useMutation({
    mutationFn: (payload: number[]) =>
      apiPost<QuizResult>(`/participants/${user!.id}/modules/${moduleId}/quiz`, { answers: payload }),
    onSuccess: (data) => {
      setResult(data);
      qc.invalidateQueries({ queryKey: ["participant-dashboard"] });
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["module-detail"] });
      toast[data.passed ? "success" : "warning"](
        data.passed ? `Passed with ${data.score}% — certificate earned!` : `You scored ${data.score}%. Have another go.`,
      );
    },
    onError: () => toast.error("Please answer every question before submitting."),
  });

  const module = detail.data?.module;
  const quiz = detail.data?.quiz;
  const allAnswered = quiz ? quiz.questions.every((_, i) => answers[i] !== undefined) : false;

  return (
    <AppShell>
      <Link to="/participant/learning" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4" data-testid="back-to-learning-link">
        <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" /> Back to Learning Centre
      </Link>

      {!module ? (
        <p className="text-muted-foreground" data-testid="module-loading">Loading this module…</p>
      ) : (
        <>
          <header className="mb-6">
            <Badge variant="secondary" className="mb-2">{module.category}</Badge>
            <h1 className="font-heading text-3xl font-bold tracking-tight" data-testid="module-title">
              {module.title}
            </h1>
            <p className="text-muted-foreground mt-2">{module.description}</p>
          </header>

          {module.video_url && (
            <div className="aspect-video w-full rounded-xl overflow-hidden border mb-6 bg-muted">
              <iframe
                src={module.video_url}
                title={`${module.title} video`}
                className="w-full h-full"
                allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                data-testid="module-video"
              />
            </div>
          )}

          <Card className="mb-8">
            <CardContent className="pt-6">
              <Markdown markdown={module.content_markdown} />
            </CardContent>
          </Card>

          {quiz && quiz.questions.length > 0 && (
            <Card data-testid="quiz-card">
              <CardHeader>
                <CardTitle className="text-xl">Knowledge check</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Answer all {quiz.questions.length} questions. You need 80% to earn your certificate.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {quiz.questions.map((q, qi) => {
                  const answerResult = result?.results[qi];
                  return (
                    <fieldset key={qi} className="border-t pt-5 first:border-t-0 first:pt-0">
                      <legend className="font-medium mb-3">
                        {qi + 1}. {q.question}
                      </legend>
                      <div className="grid gap-2">
                        {q.options.map((opt, oi) => {
                          const selected = answers[qi] === oi;
                          const showCorrect = result && oi === q.correct_answer;
                          const showWrong = result && selected && oi !== q.correct_answer;
                          return (
                            <label
                              key={oi}
                              className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors duration-150 ${
                                showCorrect
                                  ? "border-success bg-success-soft"
                                  : showWrong
                                    ? "border-destructive bg-destructive/5"
                                    : selected
                                      ? "border-brand-purple bg-brand-purple-soft"
                                      : "hover:bg-muted"
                              }`}
                              data-testid={`quiz-option-${qi}-${oi}`}
                            >
                              <input
                                type="radio"
                                name={`q-${qi}`}
                                className="accent-[color:var(--primary)]"
                                checked={selected}
                                disabled={Boolean(result)}
                                onChange={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                              />
                              <span className="text-sm">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                      {answerResult && (
                        <p className="mt-2 text-sm flex items-start gap-2 text-muted-foreground">
                          {answerResult.is_correct ? (
                            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" aria-hidden="true" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" aria-hidden="true" />
                          )}
                          {answerResult.explanation}
                        </p>
                      )}
                    </fieldset>
                  );
                })}

                {result ? (
                  <div className="rounded-xl border bg-success-soft border-success/40 p-5" data-testid="quiz-result">
                    <p className="text-2xl font-bold font-heading flex items-center gap-2">
                      {result.certificate_earned && <Award className="h-6 w-6 text-success" aria-hidden="true" />}
                      {result.score}% — {result.correct}/{result.total} correct
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {result.passed
                        ? "Module complete. Your certificate has been added to your record."
                        : "You need 80% to pass — review the explanations and try again."}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setResult(null);
                          setAnswers({});
                        }}
                        data-testid="retake-quiz-button"
                      >
                        Retake quiz
                      </Button>
                      <Link to="/participant/learning">
                        <Button data-testid="quiz-back-button">Back to Learning Centre</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full sm:w-auto"
                    disabled={!allAnswered || submit.isPending}
                    onClick={() => submit.mutate(quiz.questions.map((_, i) => answers[i]))}
                    data-testid="submit-quiz-button"
                  >
                    {submit.isPending ? "Marking…" : "Submit answers"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </AppShell>
  );
}
