import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Flag, Paperclip, Plus, Upload } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppShell from "@/components/AppShell";
import UsageMeter from "@/components/UsageMeter";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { JobSearchLog, UsageSummary } from "@/lib/types";

const TYPES: Record<string, number> = {
  "Online application": 5,
  "Email application": 5,
  "Phone enquiry": 5,
  "In person": 10,
  "Recruitment agency": 5,
  "Interview attended": 20,
};

export default function JobLogs() {
  const user = getSessionUser();
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);

  const [employer, setEmployer] = useState("");
  const [position, setPosition] = useState("");
  const [date, setDate] = useState(today);
  const [type, setType] = useState("Online application");
  const [evidence, setEvidence] = useState("");
  const [fileData, setFileData] = useState("");
  const [fileMime, setFileMime] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [notes, setNotes] = useState("");

  const logs = useQuery({
    queryKey: ["job-logs", user?.id],
    queryFn: () => apiGet<JobSearchLog[]>(`/participants/${user!.id}/job-logs`),
    enabled: Boolean(user),
  });

  const usage = useQuery({
    queryKey: ["usage", user?.id],
    queryFn: () => apiGet<UsageSummary>(`/participants/${user!.id}/usage`),
    enabled: Boolean(user),
  });

  const create = useMutation({
    mutationFn: () =>
      apiPost<JobSearchLog>(`/participants/${user!.id}/job-logs`, {
        employer_name: employer,
        position_title: position,
        application_date: date,
        application_type: type,
        evidence_filename: evidence,
        evidence_data: fileData,
        evidence_mime: fileMime,
        notes,
      }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["job-logs"] });
      qc.invalidateQueries({ queryKey: ["participant-dashboard"] });
      qc.invalidateQueries({ queryKey: ["usage"] });
      setEmployer("");
      setPosition("");
      setEvidence("");
      setFileData("");
      setFileMime("");
      setFileSize(0);
      setNotes("");
      toast.success(`Activity logged — ${data.points} PBAS points added.`);
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(detail ?? "Could not save that activity. Please check the fields.");
      qc.invalidateQueries({ queryKey: ["usage"] });
    },
  });

  const rows = logs.isError ? [] : (logs.data ?? []);
  const total = rows.reduce((sum, r) => sum + r.points, 0);

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
          Job Search Activity Log
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1">
          Points-Based Activation System (PBAS)
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Record every application, enquiry and interview. This is the evidence your case manager reports
          for your Mutual Obligation requirements.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-lg">Log a new activity</CardTitle>
              {usage.data && <UsageMeter metric={usage.data.job_logs} testId="job-logs-usage-meter" showIcon={false} />}
            </div>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (employer.trim() && position.trim()) create.mutate();
                else toast.error("Employer and position are required.");
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="employer">Employer name</Label>
                <Input id="employer" value={employer} onChange={(e) => setEmployer(e.target.value)} placeholder="e.g. Bunnings Warehouse" data-testid="pbas-employer-input" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="position">Position title</Label>
                <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Retail Team Member" data-testid="pbas-position-input" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date of activity</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} data-testid="pbas-date-input" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Method</Label>
                <Select value={type} onValueChange={(v: string) => setType(v)}>
                  <SelectTrigger id="type" data-testid="pbas-type-select">
                    <SelectValue>{(v) => (v as string) || "Select a method"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPES).map(([label, pts]) => (
                      <SelectItem key={label} value={label} data-testid={`pbas-type-${label.toLowerCase().replace(/\W+/g, "-")}`}>
                        {label} ({pts} pts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="evidence-file">Proof / evidence file</Label>
                <Input
                  id="evidence-file"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.heic,.txt,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("Files must be 5MB or smaller.");
                      e.target.value = "";
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = String(reader.result);
                      // Store the bare base64 payload; the data-URL prefix is stripped.
                      setFileData(result.includes(",") ? result.split(",")[1] : result);
                      setFileMime(file.type || "application/octet-stream");
                      setFileSize(file.size);
                      setEvidence(file.name);
                      toast.success(`${file.name} attached.`);
                    };
                    reader.onerror = () => toast.error("Could not read that file.");
                    reader.readAsDataURL(file);
                  }}
                  data-testid="pbas-evidence-file-input"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Upload className="h-3 w-3" aria-hidden="true" /> PDF, screenshot or receipt, up
                  to 5MB. Your case manager can download and approve it.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="evidence">Evidence file name</Label>
                <Input
                  id="evidence"
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  placeholder="e.g. bunnings-confirmation.pdf"
                  data-testid="pbas-evidence-input"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Paperclip className="h-3 w-3" aria-hidden="true" />
                  {fileData
                    ? `Attached (${Math.max(1, Math.round(fileSize / 1024))} KB)`
                    : "Filled in automatically when you attach a file."}
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} data-testid="pbas-notes-input" />
              </div>
              <Button type="submit" className="w-full bg-cta text-cta-foreground hover:bg-cta/90" disabled={create.isPending || (usage.data?.job_logs.remaining ?? 1) <= 0} data-testid="pbas-submit-button">
                <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
                {create.isPending ? "Saving…" : `Log activity (${TYPES[type]} pts)`}
              </Button>
              {(usage.data?.job_logs.remaining ?? 1) <= 0 && (
                <p className="text-sm text-destructive" data-testid="job-logs-limit-notice">
                  You have reached this month's cap of {usage.data?.job_logs.limit} entries. Your case
                  manager can raise it from your record.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg">Your logged activity</CardTitle>
              <Badge data-testid="pbas-total-points">{total} points total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? (
              <p className="text-muted-foreground text-sm" data-testid="job-logs-empty">
                Nothing logged yet — add your first activity on the left.
              </p>
            ) : (
              <Table data-testid="job-logs-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Proof</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                    <TableHead>Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((log) => (
                    <TableRow key={log.id} data-testid={`job-log-row-${log.id}`}>
                      <TableCell className="whitespace-nowrap">{log.application_date}</TableCell>
                      <TableCell>
                        <p className="font-medium">{log.employer_name}</p>
                        <p className="text-xs text-muted-foreground">{log.position_title}</p>
                      </TableCell>
                      <TableCell className="text-sm">{log.application_type}</TableCell>
                      <TableCell className="text-sm">
                        {log.evidence_size > 0 ? (
                          <span
                            className="flex items-center gap-1.5"
                            data-testid={`job-log-file-${log.id}`}
                          >
                            <Paperclip className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            <span className="max-w-[8rem] truncate">{log.evidence_filename}</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            {log.evidence_filename || "No file"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{log.points}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            log.review_status === "approved"
                              ? "bg-success text-success-foreground gap-1"
                              : log.review_status === "flagged"
                                ? "bg-destructive text-destructive-foreground gap-1"
                                : "gap-1"
                          }
                          variant={log.review_status === "pending" ? "secondary" : "default"}
                          data-testid={`job-log-review-${log.id}`}
                        >
                          {log.review_status === "approved" && (
                            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                          )}
                          {log.review_status === "flagged" && (
                            <Flag className="h-3 w-3" aria-hidden="true" />
                          )}
                          {log.review_status === "approved"
                            ? "Approved"
                            : log.review_status === "flagged"
                              ? "Flagged"
                              : "Awaiting review"}
                        </Badge>
                        {log.review_note && (
                          <p className="text-xs text-muted-foreground mt-1 max-w-[14rem]">
                            {log.review_note}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
