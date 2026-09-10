import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Download,
  Flag,
  FolderOpen,
  Paperclip,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppShell from "@/components/AppShell";
import { API_BASE, apiGet, apiPatch, ApiError } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { EvidenceRow, EvidenceSummary, JobSearchLog } from "@/lib/types";

const STATUS_STYLE: Record<JobSearchLog["review_status"], string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/40",
  approved: "bg-success text-success-foreground",
  flagged: "bg-destructive text-destructive-foreground",
};

const STATUS_LABEL: Record<JobSearchLog["review_status"], string> = {
  pending: "Awaiting review",
  approved: "Approved",
  flagged: "Flagged",
};

export default function Evidence() {
  const user = getSessionUser();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | JobSearchLog["review_status"]>("all");
  const [reviewing, setReviewing] = useState<EvidenceRow | null>(null);
  const [note, setNote] = useState("");

  const summary = useQuery({
    queryKey: ["evidence", user?.id],
    queryFn: () => apiGet<EvidenceSummary>(`/evidence/${user!.id}`),
    enabled: Boolean(user),
  });

  const review = useMutation({
    mutationFn: (vars: { logId: string; status: "approved" | "flagged"; note: string }) =>
      apiPatch<JobSearchLog>(`/evidence/${user!.id}/${vars.logId}/review`, {
        review_status: vars.status,
        review_note: vars.note,
      }),
    onSuccess: (log) => {
      qc.invalidateQueries({ queryKey: ["evidence"] });
      qc.invalidateQueries({ queryKey: ["roster"] });
      setReviewing(null);
      setNote("");
      toast.success(
        log.review_status === "approved"
          ? "Evidence approved and the activity marked verified."
          : "Evidence flagged — the learner's case manager can follow up.",
      );
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(detail ?? "Could not save that review.");
    },
  });

  const d = summary.isError ? null : summary.data;
  const rows = (d?.rows ?? []).filter((r) => {
    const matchesFilter = filter === "all" || r.log.review_status === filter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.learner_name.toLowerCase().includes(q) ||
      r.log.employer_name.toLowerCase().includes(q) ||
      r.log.position_title.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
          Compliance review
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1">
          Job Search Evidence
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Every job application your learners log, with the proof they uploaded. Download the file,
          then approve it for Mutual Obligation reporting or flag it for follow-up.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        {[
          { label: "Awaiting review", value: d?.pending ?? 0, testId: "evidence-kpi-pending" },
          { label: "Approved", value: d?.approved ?? 0, testId: "evidence-kpi-approved" },
          { label: "Flagged", value: d?.flagged ?? 0, testId: "evidence-kpi-flagged" },
          { label: "With a file", value: d?.with_file ?? 0, testId: "evidence-kpi-with-file" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold font-heading tabular-nums" data-testid={kpi.testId}>
                {kpi.value}
              </p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" aria-hidden="true" /> Submissions
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  className="pl-9 w-56"
                  placeholder="Search learner or employer"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="evidence-search-input"
                />
              </div>
              {(["all", "pending", "approved", "flagged"] as const).map((key) => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(key)}
                  data-testid={`evidence-filter-${key}`}
                >
                  {key === "all" ? "All" : STATUS_LABEL[key]}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground" data-testid="evidence-empty">
              No evidence submissions match this view yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table data-testid="evidence-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Application</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.log.id} data-testid={`evidence-row-${r.log.id}`}>
                      <TableCell>
                        <Link
                          to={`/coach/participants/${r.learner_id}`}
                          className="font-medium underline-offset-4 hover:underline"
                          data-testid={`evidence-learner-link-${r.log.id}`}
                        >
                          {r.learner_name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{r.organization_name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{r.log.employer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.log.position_title} · {r.log.application_type}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {r.log.application_date}
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.has_file ? (
                          <span
                            className="flex items-center gap-1.5"
                            data-testid={`evidence-file-name-${r.log.id}`}
                          >
                            <Paperclip className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            <span className="max-w-[10rem] truncate">
                              {r.log.evidence_filename || "attachment"}
                            </span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {r.log.evidence_filename || "No file uploaded"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={STATUS_STYLE[r.log.review_status]}
                          variant={r.log.review_status === "pending" ? "outline" : "default"}
                          data-testid={`evidence-status-${r.log.id}`}
                        >
                          {STATUS_LABEL[r.log.review_status]}
                        </Badge>
                        {r.log.reviewed_by && (
                          <p className="text-xs text-muted-foreground mt-1">by {r.log.reviewed_by}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!r.has_file}
                            onClick={() => {
                              window.open(
                                `${API_BASE}/evidence/${user!.id}/${r.log.id}/file`,
                                "_blank",
                                "noopener",
                              );
                            }}
                            data-testid={`evidence-download-${r.log.id}`}
                          >
                            <Download className="h-4 w-4 mr-1.5" aria-hidden="true" /> Download
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setReviewing(r);
                              setNote(r.log.review_note);
                            }}
                            data-testid={`evidence-review-${r.log.id}`}
                          >
                            Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(reviewing)} onOpenChange={(open: boolean) => !open && setReviewing(null)}>
        <DialogContent className="sm:max-w-lg" data-testid="evidence-review-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {reviewing ? `${reviewing.learner_name} — ${reviewing.log.employer_name}` : "Review"}
            </DialogTitle>
            <DialogDescription>
              Approving marks this activity verified for Mutual Obligation reporting. Flagging keeps
              it unverified and records why.
            </DialogDescription>
          </DialogHeader>

          {reviewing && (
            <div className="space-y-4">
              <dl className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Position</dt>
                  <dd>{reviewing.log.position_title}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Method</dt>
                  <dd>{reviewing.log.application_type}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Date</dt>
                  <dd>{reviewing.log.application_date}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">PBAS points</dt>
                  <dd>{reviewing.log.points}</dd>
                </div>
                {reviewing.log.notes && (
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">Learner notes</dt>
                    <dd data-testid="evidence-review-learner-notes">{reviewing.log.notes}</dd>
                  </div>
                )}
              </dl>

              <div className="space-y-1.5">
                <Label htmlFor="review-note">Reviewer note (optional)</Label>
                <Textarea
                  id="review-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Confirmation email matches the employer and date."
                  data-testid="evidence-review-note-input"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-success text-success-foreground hover:bg-success/90"
                  disabled={review.isPending}
                  onClick={() =>
                    review.mutate({ logId: reviewing.log.id, status: "approved", note })
                  }
                  data-testid="evidence-approve-button"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" aria-hidden="true" /> Approve
                </Button>
                <Button
                  variant="destructive"
                  disabled={review.isPending}
                  onClick={() => review.mutate({ logId: reviewing.log.id, status: "flagged", note })}
                  data-testid="evidence-flag-button"
                >
                  <Flag className="h-4 w-4 mr-1.5" aria-hidden="true" /> Flag for follow-up
                </Button>
                <Link to={`/coach/participants/${reviewing.learner_id}`}>
                  <Button variant="outline" data-testid="evidence-open-learner-button">
                    Open learner profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
