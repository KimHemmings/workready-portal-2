import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Accessibility,
  Briefcase,
  Download,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppShell from "@/components/AppShell";
import UsageMeter from "@/components/UsageMeter";
import VoiceConsentDialog, { grantVoiceConsent, hasVoiceConsent } from "@/components/VoiceConsentDialog";
import { apiGet, apiPost, ApiError, API_BASE } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import { useDictation } from "@/lib/speech";
import type { InterviewMode, InterviewSession, UsageSummary } from "@/lib/types";

const INDUSTRIES = ["Retail", "Hospitality", "Warehousing", "Administration", "Entry-level Trades"];

const MODES: {
  value: InterviewMode;
  label: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "standard",
    label: "Standard mode",
    blurb: "Full behavioural and situational questions, like a real employer interview.",
    icon: Briefcase,
  },
  {
    value: "llnd",
    label: "LLND / Accessible mode",
    blurb:
      "Simpler words, shorter questions and extra encouragement — built for Language, Literacy, Numeracy and Digital support needs.",
    icon: Accessibility,
  },
];

/** Browser text-to-speech so questions can be read aloud. */
function speak(text: string) {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-AU";
  utter.rate = 0.92;
  window.speechSynthesis.speak(utter);
  return true;
}

/** PDF scorecard generator — streams the server-rendered PDF and saves it locally. */
async function downloadScorecardPdf(session: InterviewSession) {
  const res = await fetch(`${API_BASE}/interviews/${session.id}/scorecard.pdf`);
  if (!res.ok) throw new Error("scorecard download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `interview-scorecard-${session.job_target.replace(/\W+/g, "-").toLowerCase()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadScorecard(session: InterviewSession) {
  const fb = session.feedback_summary_json;
  const lines = [
    "Straight Up Training — Interview Feedback Scorecard",
    "==============================================",
    `Role target : ${session.job_target}`,
    `Industry    : ${session.industry}`,
    `Date        : ${new Date(session.created_at).toLocaleDateString("en-AU")}`,
    `Overall readiness score: ${session.overall_score}/100`,
    "",
    "Summary",
    fb?.summary ?? "",
    "",
    "Core Skills for Work",
    ...(fb?.skills ?? []).map((s) => `- ${s.skill}: ${s.score}/100 — ${s.comment}`),
    "",
    "Strengths",
    ...(fb?.strengths ?? []).map((s) => `- ${s}`),
    "",
    "Areas for improvement",
    ...(fb?.improvements ?? []).map((s) => `- ${s}`),
    "",
    "Transcript",
    ...session.transcript_json.map((t) => `${t.role.toUpperCase()}: ${t.content}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "interview-feedback-scorecard.txt";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Interview() {
  const user = getSessionUser();
  const qc = useQueryClient();
  const [industry, setIndustry] = useState("Retail");
  const [jobTarget, setJobTarget] = useState("Retail Team Member");
  const [mode, setMode] = useState<InterviewMode>("standard");
  const [readAloud, setReadAloud] = useState(false);
  const [answer, setAnswer] = useState("");
  const [session, setSession] = useState<InterviewSession | null>(null);

  const history = useQuery({
    queryKey: ["interview-history", user?.id],
    queryFn: () => apiGet<InterviewSession[]>(`/interviews/participant/${user!.id}/history`),
    enabled: Boolean(user),
  });

  const usage = useQuery({
    queryKey: ["usage", user?.id],
    queryFn: () => apiGet<UsageSummary>(`/participants/${user!.id}/usage`),
    enabled: Boolean(user),
  });

  const dictation = useDictation((chunk) =>
    setAnswer((prev) => (prev ? `${prev.replace(/\s+$/, "")} ${chunk}` : chunk)),
  );
  const [consentOpen, setConsentOpen] = useState(false);

  const startDictation = () => {
    if (!dictation.start()) {
      toast.error("Speech to text is not supported in this browser. Please type instead.");
      return;
    }
    toast.success("Listening — speak your answer, then press the mic again to stop.");
  };

  const interviewsLeft = usage.data?.interviews.remaining ?? 1;

  const start = useMutation({
    mutationFn: () =>
      apiPost<InterviewSession>("/interviews/start", {
        participant_id: user!.id,
        job_target: jobTarget,
        industry,
        mode,
      }),
    onSuccess: (data) => {
      setSession(data);
      toast.success("Your practice interview has started — good luck!");
      if (readAloud && data.questions[0]) speak(data.questions[0]);
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(detail ?? "Could not start the interview. Please try again.");
      qc.invalidateQueries({ queryKey: ["usage"] });
    },
  });

  const reply = useMutation({
    mutationFn: (text: string) =>
      apiPost<InterviewSession>(`/interviews/${session!.id}/answer`, { answer: text }),
    onSuccess: (data) => {
      setSession(data);
      setAnswer("");
      if (readAloud && !data.finished) {
        const next = data.questions[data.current_index];
        if (next) speak(next);
      }
      if (data.finished) {
        qc.invalidateQueries({ queryKey: ["interview-history"] });
        qc.invalidateQueries({ queryKey: ["participant-dashboard"] });
        qc.invalidateQueries({ queryKey: ["certificates"] });
        qc.invalidateQueries({ queryKey: ["usage"] });
        toast.success("Interview complete — your scorecard is ready.");
        if ((data.overall_score ?? 0) > 70) {
          toast.success("Certificate earned! Find it under Certificates.", { duration: 6000 });
        }
      }
    },
    onError: () => toast.error("Could not send your answer. Please try again."),
  });

  const fb = session?.feedback_summary_json;

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
          AI Interview Simulator
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1">
          Practise with an Australian employer
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Eight realistic behavioural and situational questions, real-time coaching tips, and a readiness
          scorecard against the Core Skills for Work.
        </p>
      </header>

      {!session ? (
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">Choose your job target</CardTitle>
                {usage.data && <UsageMeter metric={usage.data.interviews} testId="interview-usage-meter" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Interview mode</Label>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Interview mode">
                  {MODES.map((m) => {
                    const Icon = m.icon;
                    const selected = mode === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setMode(m.value)}
                        className={`text-left rounded-xl border p-4 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                          selected
                            ? "border-brand-purple bg-brand-purple-soft shadow-sm"
                            : "border-slate-200/80 hover:bg-muted"
                        }`}
                        data-testid={`interview-mode-${m.value}`}
                      >
                        <span className="flex items-center gap-2 font-semibold text-sm">
                          <Icon
                            className={`h-4 w-4 ${selected ? "text-brand-purple" : "text-muted-foreground"}`}
                            aria-hidden="true"
                          />
                          {m.label}
                        </span>
                        <span className="block text-xs text-muted-foreground mt-1.5">{m.blurb}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200/80 p-4">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {readAloud ? (
                      <Volume2 className="h-4 w-4 text-brand-purple" aria-hidden="true" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                    Read questions aloud
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uses your device's voice to speak each question. Helpful if reading is hard.
                  </p>
                </div>
                <Button
                  type="button"
                  variant={readAloud ? "default" : "outline"}
                  size="sm"
                  role="switch"
                  aria-checked={readAloud}
                  onClick={() => {
                    const next = !readAloud;
                    setReadAloud(next);
                    if (next && !speak("Read aloud is now on.")) {
                      toast.error("Your browser does not support read aloud.");
                      setReadAloud(false);
                    }
                  }}
                  data-testid="read-aloud-toggle"
                >
                  {readAloud ? "On" : "Off"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={(v: string) => setIndustry(v)}>
                  <SelectTrigger id="industry" data-testid="industry-select">
                    <SelectValue>{(v) => (v as string) || "Select an industry"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((i) => (
                      <SelectItem key={i} value={i} data-testid={`industry-option-${i.toLowerCase().replace(/\W+/g, "-")}`}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-target">Role you're applying for</Label>
                <Input
                  id="job-target"
                  value={jobTarget}
                  onChange={(e) => setJobTarget(e.target.value)}
                  placeholder="e.g. Retail Team Member"
                  data-testid="job-target-input"
                />
              </div>
              {interviewsLeft <= 0 && (
                <p
                  className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
                  data-testid="interview-limit-notice"
                >
                  You have used all your practice interviews for this month. Your case manager can grant an
                  extra session from your record.
                </p>
              )}
              <Button
                className="w-full sm:w-auto bg-cta text-cta-foreground hover:bg-cta/90"
                disabled={start.isPending || !jobTarget.trim() || interviewsLeft <= 0}
                onClick={() => start.mutate()}
                data-testid="start-interview-button"
              >
                <Sparkles className="h-4 w-4 mr-1.5" aria-hidden="true" />
                {start.isPending ? "Preparing your interviewer…" : "Start practice interview"}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle className="text-lg">Previous practice sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {(history.data ?? []).filter((s) => s.finished).length === 0 ? (
                <p className="text-muted-foreground text-sm" data-testid="interview-history-empty">
                  No completed sessions yet. Your scorecards will appear here.
                </p>
              ) : (
                <ul className="space-y-3" data-testid="interview-history-list">
                  {(history.data ?? [])
                    .filter((s) => s.finished)
                    .map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium text-sm">{s.job_target}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.industry} · {new Date(s.created_at).toLocaleDateString("en-AU")}
                            {s.mode === "llnd" ? " · LLND mode" : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{s.overall_score}/100</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Download PDF scorecard"
                            onClick={() =>
                              downloadScorecardPdf(s).catch(() =>
                                toast.error("Could not download the PDF scorecard. Please try again."),
                              )
                            }
                            data-testid={`download-scorecard-${s.id}`}
                          >
                            <Download className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-8">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-lg">
                  Interview — {session.job_target} ({session.industry})
                </CardTitle>
                <div className="flex items-center gap-2">
                  {session.mode === "llnd" && (
                    <Badge className="bg-brand-purple text-white gap-1" data-testid="llnd-mode-badge">
                      <Accessibility className="h-3 w-3" aria-hidden="true" /> LLND mode
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const q = session.questions[Math.min(session.current_index, session.questions.length - 1)];
                      if (!speak(q)) toast.error("Your browser does not support read aloud.");
                    }}
                    data-testid="speak-question-button"
                  >
                    <Volume2 className="h-4 w-4 mr-1.5" aria-hidden="true" /> Read question
                  </Button>
                  <Badge variant="secondary" data-testid="interview-progress-badge">
                    Question {Math.min(session.current_index + 1, session.questions.length)} of{" "}
                    {session.questions.length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1" data-testid="interview-transcript">
                {session.transcript_json.map((turn, i) => (
                  <div
                    key={i}
                    className={`wr-rise max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      turn.role === "participant"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : turn.role === "coach"
                          ? "border border-dashed bg-secondary/40 text-muted-foreground italic"
                          : "bg-muted"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider font-mono opacity-70 mb-1">
                      {turn.role === "participant" ? "You" : turn.role === "coach" ? "Coaching tip" : "Interviewer"}
                      {turn.role === "interviewer" && (
                        <button
                          type="button"
                          aria-label="Read this question aloud"
                          title="Read this question aloud"
                          className="rounded-full p-1 transition-colors duration-150 hover:bg-background/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          onClick={() => {
                            if (!speak(turn.content))
                              toast.error("Your browser does not support read aloud.");
                          }}
                          data-testid={`speak-turn-button-${i}`}
                        >
                          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </span>
                    {turn.content}
                  </div>
                ))}
              </div>

              {!session.finished && (
                <form
                  className="mt-4 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (answer.trim()) reply.mutate(answer.trim());
                  }}
                >
                  <Label htmlFor="answer">Your answer</Label>
                  <Textarea
                    id="answer"
                    rows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Use the STAR approach: Situation, Task, Action, Result…"
                    data-testid="interview-answer-input"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="submit" disabled={reply.isPending || !answer.trim()} data-testid="send-answer-button">
                      <Send className="h-4 w-4 mr-1.5" aria-hidden="true" />
                      {reply.isPending ? "Sending…" : "Send answer"}
                    </Button>
                    <Button
                      type="button"
                      variant={dictation.listening ? "default" : "outline"}
                      aria-pressed={dictation.listening}
                      aria-label={dictation.listening ? "Stop dictation" : "Speak your answer"}
                      className={dictation.listening ? "bg-brand-purple text-white animate-pulse" : ""}
                      onClick={() => {
                        if (dictation.listening) {
                          dictation.stop();
                          return;
                        }
                        if (!hasVoiceConsent()) {
                          setConsentOpen(true);
                          return;
                        }
                        startDictation();
                      }}
                      data-testid="dictate-answer-button"
                    >
                      {dictation.listening ? (
                        <MicOff className="h-4 w-4 mr-1.5" aria-hidden="true" />
                      ) : (
                        <Mic className="h-4 w-4 mr-1.5" aria-hidden="true" />
                      )}
                      {dictation.listening ? "Stop speaking" : "Speak answer"}
                    </Button>
                    <span className="text-xs text-muted-foreground" data-testid="dictation-hint">
                      {dictation.listening
                        ? "Your words appear in the box — you can edit them before sending."
                        : "Prefer talking? Use the microphone and edit the text afterwards."}
                    </span>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-4 space-y-4">
            {session.finished && fb ? (
              <Card className="bg-secondary/40" data-testid="interview-scorecard">
                <CardHeader>
                  <CardTitle className="text-lg">Interview Feedback Scorecard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-4xl font-bold font-heading" data-testid="overall-score">
                    {session.overall_score}
                    <span className="text-lg font-normal text-muted-foreground">/100 readiness</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{fb.summary}</p>

                  <div className="space-y-2">
                    {fb.skills.map((s) => (
                      <div key={s.skill}>
                        <div className="flex justify-between text-sm">
                          <span>{s.skill}</span>
                          <span className="font-semibold tabular-nums">{s.score}</span>
                        </div>
                        <div className="h-2 rounded-full bg-background overflow-hidden">
                          <div className="h-full bg-success" style={{ width: `${s.score}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{s.comment}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-1">Strengths</p>
                    <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                      {fb.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">Areas for improvement</p>
                    <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
                      {fb.improvements.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
                    onClick={() =>
                      downloadScorecardPdf(session).catch(() =>
                        toast.error("Could not download the PDF scorecard. Please try again."),
                      )
                    }
                    data-testid="download-scorecard-pdf-button"
                  >
                    <Download className="h-4 w-4 mr-1.5" aria-hidden="true" /> Download PDF scorecard
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => downloadScorecard(session)} data-testid="download-scorecard-button">
                    <Download className="h-4 w-4 mr-1.5" aria-hidden="true" /> Download as text
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setSession(null)} data-testid="new-interview-button">
                    Practise another interview
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tips while you answer</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• Give a real example, not a general statement.</p>
                  <p>• Say what <em>you</em> did, not just the team.</p>
                  <p>• Finish with the result or what you learnt.</p>
                  <p>• Keep it to 30–60 seconds of speaking.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <VoiceConsentDialog
        open={consentOpen}
        onAllow={() => {
          grantVoiceConsent();
          setConsentOpen(false);
          startDictation();
        }}
        onCancel={() => setConsentOpen(false)}
      />
    </AppShell>
  );
}
