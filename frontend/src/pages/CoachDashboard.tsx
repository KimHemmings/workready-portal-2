import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Download, FileSpreadsheet, KeyRound, Link as LinkIcon, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppShell from "@/components/AppShell";
import SendInviteButton from "@/components/SendInviteButton";
import { InviteLinkDialog, TempPasswordDialog } from "@/components/InviteLinkDialog";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { InviteResult, ResetPasswordResult, RosterRow } from "@/lib/types";

const RISK_LABEL: Record<RosterRow["risk"], string> = {
  on_track: "On track",
  watch: "Watch",
  at_risk: "At risk",
};

function detailOf(err: unknown, fallback: string): string {
  const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
  return typeof detail === "string" ? detail : fallback;
}

export default function CoachDashboard() {
  const user = getSessionUser();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [invitePreview, setInvitePreview] = useState<InviteResult | null>(null);
  const [tempPassword, setTempPassword] = useState<ResetPasswordResult | null>(null);

  const roster = useQuery({
    queryKey: ["roster", user?.id],
    queryFn: () => apiGet<RosterRow[]>(`/coaches/${user!.id}/roster`),
    enabled: Boolean(user),
  });

  const addLearner = useMutation({
    mutationFn: () =>
      apiPost<InviteResult>(`/coaches/${user!.id}/participants`, {
        name: newName.trim(),
        email: newEmail.trim(),
        role: "participant",
      }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["roster"] });
      setNewName("");
      setNewEmail("");
      setInvitePreview(res);
      toast.success(`${res.user.name} added — copy their invite link.`);
    },
    onError: (err) => toast.error(detailOf(err, "Could not add that Learner.")),
  });

  const inviteLink = useMutation({
    mutationFn: (pid: string) =>
      apiPost<InviteResult>(`/coaches/${user!.id}/participants/${pid}/invite-link`),
    onSuccess: (res) => setInvitePreview(res),
    onError: (err) => toast.error(detailOf(err, "Could not create an invite link.")),
  });

  const resetPassword = useMutation({
    mutationFn: (pid: string) =>
      apiPost<ResetPasswordResult>(`/coaches/${user!.id}/participants/${pid}/reset-password`),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["roster"] });
      setTempPassword(res);
    },
    onError: (err) => toast.error(detailOf(err, "Could not reset that password.")),
  });

  const rows = (roster.isError ? [] : (roster.data ?? [])).filter((r) =>
    r.participant.name.toLowerCase().includes(search.toLowerCase()),
  );

  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.completion_percent, 0) / rows.length) : 0;
  const atRisk = rows.filter((r) => r.risk === "at_risk").length;
  const apps = rows.reduce((s, r) => s + r.job_applications, 0);

  return (
    <AppShell>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
            Case Manager
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1">
            Learner roster
          </h1>
          <p className="text-muted-foreground mt-2">
            Track progress, review evidence and export compliance reports.
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`/api/coaches/${user?.id}/export.csv`} data-testid="export-csv-link">
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-1.5" aria-hidden="true" /> Cohort CSV summary
            </Button>
          </a>
          <a href={`/api/coaches/${user?.id}/export.pdf`} data-testid="export-pdf-link">
            <Button>
              <Download className="h-4 w-4 mr-1.5" aria-hidden="true" /> Export PDF
            </Button>
          </a>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Learners assigned", value: rows.length, testId: "kpi-jobseekers" },
          { label: "Average completion", value: `${avg}%`, testId: "kpi-avg-completion" },
          { label: "Job applications", value: apps, testId: "kpi-applications" },
          { label: "At risk", value: atRisk, testId: "kpi-at-risk" },
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" aria-hidden="true" /> Add a Learner to your caseload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newName.trim() || !newEmail.trim()) {
                toast.error("Name and email are both required.");
                return;
              }
              addLearner.mutate();
            }}
            data-testid="coach-add-jobseeker-form"
          >
            <div className="space-y-1.5">
              <Label htmlFor="new-jobseeker-name">Full name</Label>
              <Input
                id="new-jobseeker-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                data-testid="coach-jobseeker-name-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-jobseeker-email">Email</Label>
              <Input
                id="new-jobseeker-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                data-testid="coach-jobseeker-email-input"
              />
            </div>
            <Button
              type="submit"
              className="bg-cta text-cta-foreground hover:bg-cta/90"
              disabled={addLearner.isPending}
              data-testid="coach-add-jobseeker-button"
            >
              {addLearner.isPending ? "Adding…" : "Add & get invite link"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            No email is sent — you'll get a magic invite link to hand over. Seats are capped by your
            provider's plan.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">Assigned learners</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                className="pl-9"
                placeholder="Search learners"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search learners"
                data-testid="roster-search-input"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground text-sm" data-testid="roster-empty">
              No learners match that search.
            </p>
          ) : (
            <Table data-testid="roster-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Learner</TableHead>
                  <TableHead className="text-right">Completion</TableHead>
                  <TableHead className="text-right">Applications</TableHead>
                  <TableHead className="text-right">PBAS points</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.participant.id} data-testid={`roster-row-${r.participant.id}`}>
                    <TableCell>
                      <p className="font-medium">{r.participant.name}</p>
                      <p className="text-xs text-muted-foreground">{r.participant.email}</p>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.completion_percent}%</TableCell>
                    <TableCell className="text-right tabular-nums">{r.job_applications}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.pbas_points}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {r.last_login ? new Date(r.last_login).toLocaleDateString("en-AU") : "Never"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={r.risk === "on_track" ? "default" : r.risk === "watch" ? "secondary" : "destructive"}
                      >
                        {RISK_LABEL[r.risk]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => inviteLink.mutate(r.participant.id)}
                          disabled={inviteLink.isPending}
                          data-testid={`roster-invite-link-${r.participant.id}`}
                        >
                          <LinkIcon className="h-4 w-4 mr-1.5" aria-hidden="true" /> Invite link
                        </Button>
                        <SendInviteButton
                          inviterId={user!.id}
                          userId={r.participant.id}
                          userName={r.participant.name}
                          testId={`roster-send-invite-${r.participant.id}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetPassword.mutate(r.participant.id)}
                          disabled={resetPassword.isPending}
                          data-testid={`roster-reset-password-${r.participant.id}`}
                        >
                          <KeyRound className="h-4 w-4 mr-1.5" aria-hidden="true" /> Reset
                        </Button>
                        <Link to={`/coach/participants/${r.participant.id}`}>
                          <Button variant="ghost" size="sm" data-testid={`view-participant-${r.participant.id}`}>
                            View
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <InviteLinkDialog result={invitePreview} onClose={() => setInvitePreview(null)} />
      <TempPasswordDialog result={tempPassword} onClose={() => setTempPassword(null)} />
    </AppShell>
  );
}
