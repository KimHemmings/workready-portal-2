import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Download, FileSpreadsheet, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppShell from "@/components/AppShell";
import { apiGet } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { RosterRow } from "@/lib/types";

const RISK_LABEL: Record<RosterRow["risk"], string> = {
  on_track: "On track",
  watch: "Watch",
  at_risk: "At risk",
};

export default function CoachDashboard() {
  const user = getSessionUser();
  const [search, setSearch] = useState("");

  const roster = useQuery({
    queryKey: ["roster", user?.id],
    queryFn: () => apiGet<RosterRow[]>(`/coaches/${user!.id}/roster`),
    enabled: Boolean(user),
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
            Jobseeker roster
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
          { label: "Jobseekers assigned", value: rows.length, testId: "kpi-jobseekers" },
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

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">Assigned jobseekers</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                className="pl-9"
                placeholder="Search jobseekers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search jobseekers"
                data-testid="roster-search-input"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground text-sm" data-testid="roster-empty">
              No jobseekers match that search.
            </p>
          ) : (
            <Table data-testid="roster-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Jobseeker</TableHead>
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
                      <Link to={`/coach/participants/${r.participant.id}`}>
                        <Button variant="ghost" size="sm" data-testid={`view-participant-${r.participant.id}`}>
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
