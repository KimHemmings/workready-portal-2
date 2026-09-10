import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Award, NotebookPen, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppShell from "@/components/AppShell";
import Markdown from "@/components/Markdown";
import CertificateModal, { formatIssued } from "@/components/CertificateModal";
import ProgressRing from "@/components/ProgressRing";
import UsageMeter from "@/components/UsageMeter";
import { apiGet, apiPost } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type {
  CoachParticipantDetail,
  CaseNote,
  Certificate,
  Organization,
  UsageKind,
  UsageSummary,
} from "@/lib/types";

export default function CoachParticipant() {
  const { participantId = "" } = useParams();
  const user = getSessionUser();
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  const detail = useQuery({
    queryKey: ["coach-participant", user?.id, participantId],
    queryFn: () => apiGet<CoachParticipantDetail>(`/coaches/${user!.id}/participants/${participantId}`),
    enabled: Boolean(user && participantId),
  });

  // Live provider branding for the certificate PDFs the coach downloads.
  const org = useQuery({
    queryKey: ["organization", user?.organization_id],
    queryFn: () => apiGet<Organization>(`/organizations/${user!.organization_id}`),
    enabled: Boolean(user?.organization_id),
  });

  const addNote = useMutation({    mutationFn: (body: string) =>
      apiPost<CaseNote>(`/coaches/${user!.id}/participants/${participantId}/notes`, { body }),
    onSuccess: () => {
      setNote("");
      qc.invalidateQueries({ queryKey: ["coach-participant"] });
      toast.success("Case note saved.");
    },
    onError: () => toast.error("Could not save that note."),
  });

  const grant = useMutation({
    mutationFn: (kind: UsageKind) =>
      apiPost<UsageSummary>(`/coaches/${user!.id}/participants/${participantId}/grant-ai`, {
        kind,
        amount: 1,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["coach-participant"] });
      toast.success("Extra allowance granted for this month.");
    },
    onError: () => toast.error("Could not grant an extra session."),
  });

  const d = detail.data;

  return (
    <AppShell>
      <Link to="/coach" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4" data-testid="back-to-roster-link">
        <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" /> Back to roster
      </Link>

      {!d ? (
        <p className="text-muted-foreground" data-testid="participant-loading">Loading learner record…</p>
      ) : (
        <>
          <header className="mb-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight" data-testid="participant-name">
              {d.participant.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {d.participant.email} · {d.participant.phone || "No phone recorded"}
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-12 mb-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="text-lg">Training progress</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-5">
                <ProgressRing percent={d.completion_percent} size={110} testId="participant-progress-ring" />
                <div className="text-sm space-y-1">
                  <p data-testid="participant-pbas-points">
                    <span className="text-xl font-bold">{d.pbas_points}</span> PBAS points
                  </p>
                  <p className="text-muted-foreground">{d.job_logs.length} job applications</p>
                  <p className="text-muted-foreground">{d.interviews.filter((i) => i.finished).length} mock interviews</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <NotebookPen className="h-5 w-5 text-primary" aria-hidden="true" /> Private case notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-2 mb-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (note.trim()) addNote.mutate(note.trim());
                  }}
                >
                  <Textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Record a coaching note (not visible to the learner)…"
                    aria-label="New case note"
                    data-testid="case-note-input"
                  />
                  <Button type="submit" disabled={addNote.isPending || !note.trim()} data-testid="save-case-note-button">
                    {addNote.isPending ? "Saving…" : "Save case note"}
                  </Button>
                </form>
                {d.notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground" data-testid="case-notes-empty">No case notes yet.</p>
                ) : (
                  <ul className="space-y-3" data-testid="case-notes-list">
                    {d.notes.map((n) => (
                      <li key={n.id} className="rounded-lg border p-3">
                        <p className="text-sm">{n.body}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {n.coach_name} · {new Date(n.created_at).toLocaleDateString("en-AU")}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6" data-testid="ai-usage-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-purple" aria-hidden="true" /> AI usage this month
                <span className="text-xs font-normal text-muted-foreground">({d.usage.month})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <UsageMeter metric={d.usage.interviews} testId="coach-usage-interviews" />
                <UsageMeter metric={d.usage.resumes} testId="coach-usage-resumes" />
                <UsageMeter metric={d.usage.cover_letters} testId="coach-usage-cover-letters" />
                <UsageMeter metric={d.usage.job_logs} testId="coach-usage-job-logs" showIcon={false} />
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["interviews", "Grant Extra AI Session"],
                    ["resumes", "Grant extra resume"],
                    ["cover_letters", "Grant extra cover letter"],
                    ["job_logs", "Grant extra job log"],
                  ] as [UsageKind, string][]
                ).map(([kind, label]) => (
                  <Button
                    key={kind}
                    size="sm"
                    variant={kind === "interviews" ? "default" : "outline"}
                    className={kind === "interviews" ? "bg-cta text-cta-foreground hover:bg-cta/90" : ""}
                    disabled={grant.isPending}
                    onClick={() => grant.mutate(kind)}
                    data-testid={`grant-${kind.replace("_", "-")}-button`}
                  >
                    <Sparkles className="h-4 w-4 mr-1.5" aria-hidden="true" /> {label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Each grant adds one extra session on top of the monthly cap and resets on the first of next
                month.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="modules">
            <TabsList>
              <TabsTrigger value="modules" data-testid="tab-modules">Modules</TabsTrigger>
              <TabsTrigger value="jobs" data-testid="tab-job-logs">Job search log</TabsTrigger>
              <TabsTrigger value="interviews" data-testid="tab-interviews">Interview scorecards</TabsTrigger>
              <TabsTrigger value="resumes" data-testid="tab-resumes">Resumes</TabsTrigger>
              <TabsTrigger value="certificates" data-testid="tab-certificates">Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="modules">
              <ul className="divide-y" data-testid="participant-modules-list">
                {d.modules.map((m) => {
                  const p = d.progress.find((x) => x.module_id === m.id);
                  return (
                    <li key={m.id} className="py-3 flex items-center justify-between gap-3">
                      <span className="text-sm">{m.title}</span>
                      <Badge variant={p?.status === "completed" ? "default" : p ? "secondary" : "outline"}>
                        {p?.status === "completed" ? `Completed · ${p.quiz_score}%` : p ? "In progress" : "Not started"}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            </TabsContent>

            <TabsContent value="jobs">
              {d.job_logs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4" data-testid="participant-jobs-empty">No job search activity recorded.</p>
              ) : (
                <ul className="divide-y" data-testid="participant-jobs-list">
                  {d.job_logs.map((l) => (
                    <li key={l.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{l.position_title} — {l.employer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {l.application_date} · {l.application_type} · evidence: {l.evidence_filename || "none"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{l.points} pts</Badge>
                        <Badge variant={l.status === "verified" ? "default" : "secondary"}>{l.status}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="interviews">
              {d.interviews.filter((i) => i.finished).length === 0 ? (
                <p className="text-sm text-muted-foreground py-4" data-testid="participant-interviews-empty">No completed mock interviews.</p>
              ) : (
                <ul className="space-y-3 py-2" data-testid="participant-interviews-list">
                  {d.interviews.filter((i) => i.finished).map((i) => (
                    <li key={i.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-sm">{i.job_target} · {i.industry}</p>
                        <Badge>{i.overall_score}/100</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{i.feedback_summary_json?.summary}</p>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="resumes">
              {d.resumes.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4" data-testid="participant-resumes-empty">No resumes submitted.</p>
              ) : (
                <div className="space-y-4 py-2" data-testid="participant-resumes-list">
                  {d.resumes.map((r) => (
                    <Card key={r.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{r.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="max-h-72 overflow-y-auto">
                        <Markdown markdown={r.generated_markdown} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="certificates">
              {d.certificates.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4" data-testid="participant-certificates-empty">
                  No certificates earned yet.
                </p>
              ) : (
                <ul className="space-y-3 py-2" data-testid="participant-certificates-list">
                  {d.certificates.map((cert) => (
                    <li
                      key={cert.id}
                      className="rounded-lg border p-4 flex flex-wrap items-center justify-between gap-3"
                      data-testid={`coach-certificate-${cert.certificate_id}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-purple-soft text-brand-purple">
                          <Award className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-medium text-sm">{cert.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {cert.certificate_id} · issued {formatIssued(cert.issued_at)}
                            {cert.score != null ? ` · ${cert.score}%` : ""}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-cta text-cta-foreground hover:bg-cta/90"
                        onClick={() => setActiveCert(cert)}
                        data-testid={`coach-view-certificate-${cert.certificate_id}`}
                      >
                        <Award className="h-4 w-4 mr-1.5" aria-hidden="true" /> View & download PDF
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>

          {activeCert && (
            <CertificateModal
              certificate={activeCert}
              open
              onClose={() => setActiveCert(null)}
              logo={org.data?.branding_logo || undefined}
            />
          )}
        </>
      )}
    </AppShell>
  );
}
