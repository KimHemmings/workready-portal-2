import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Award, ClipboardList, MessagesSquare, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressRing from "@/components/ProgressRing";
import UsageMeter from "@/components/UsageMeter";
import AppShell from "@/components/AppShell";
import { apiGet } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { ParticipantDashboard } from "@/lib/types";

export default function ParticipantHome() {
  const user = getSessionUser();
  const { data, isError } = useQuery({
    queryKey: ["participant-dashboard", user?.id],
    queryFn: () => apiGet<ParticipantDashboard>(`/participants/${user!.id}/dashboard`),
    enabled: Boolean(user),
  });

  const live = isError ? null : data;
  const pbasPercent = live ? Math.min(100, Math.round((live.pbas_points / live.pbas_target) * 100)) : 0;

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
          Learner dashboard
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1">
          G'day {user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Keep building your Core Skills for Work, practise interviews and stay on top of your Mutual
          Obligation requirements.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-lg">Your training progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ProgressRing percent={live?.completion_percent ?? 0} testId="progress-ring" />
            <div className="space-y-1 text-sm">
              <p data-testid="modules-completed-stat">
                <span className="text-2xl font-bold font-heading">{live?.completed_modules ?? 0}</span>
                <span className="text-muted-foreground"> / {live?.total_modules ?? 0} modules done</span>
              </p>
              <p className="text-muted-foreground">{live?.in_progress_modules ?? 0} in progress</p>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <Award className="h-4 w-4 text-brand-purple" aria-hidden="true" />
                {live?.certificates ?? 0} certificates earned
              </p>
              <Link
                to="/participant/certificates"
                className="inline-block text-sm font-medium text-brand-purple hover:underline"
                data-testid="goto-certificates-link"
              >
                View certificates →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" aria-hidden="true" />
              Mutual Obligation — PBAS points this period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <p className="text-3xl font-bold font-heading tabular-nums" data-testid="pbas-points-total">
                {live?.pbas_points ?? 0}
                <span className="text-base font-normal text-muted-foreground"> / {live?.pbas_target ?? 100} points</span>
              </p>
              <Badge variant={pbasPercent >= 100 ? "default" : "secondary"} data-testid="pbas-status-badge">
                {pbasPercent >= 100 ? "Target met" : `${100 - pbasPercent}% to go`}
              </Badge>
            </div>
            <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                style={{ width: `${pbasPercent}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Log every application, phone enquiry and interview to keep your points up.
            </p>
            <Link to="/participant/job-logs">
              <Button variant="outline" size="sm" className="mt-4" data-testid="goto-job-logs-button">
                <ClipboardList className="h-4 w-4 mr-1.5" aria-hidden="true" /> Log an activity
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="text-lg">Pick up where you left off</CardTitle>
          </CardHeader>
          <CardContent>
            {live?.next_module ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {live.next_module.category}
                  </Badge>
                  <p className="font-semibold text-lg font-heading">{live.next_module.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {live.next_module.description} · about {live.next_module.estimated_minutes} minutes
                  </p>
                </div>
                <Link to={`/participant/modules/${live.next_module.id}`}>
                  <Button data-testid="start-next-module-button">Start module</Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground" data-testid="next-module-empty">
                All modules complete — brilliant work. Head to the Learning Centre to revise.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 bg-secondary/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessagesSquare className="h-5 w-5 text-primary" aria-hidden="true" /> AI Interview Simulator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Practise eight realistic questions with a friendly Australian employer and get a readiness
              scorecard.
            </p>
            {live?.latest_interview_score != null && (
              <p className="mt-3 text-sm" data-testid="latest-interview-score">
                Last readiness score:{" "}
                <span className="font-bold text-lg">{live.latest_interview_score}/100</span>
              </p>
            )}
            {live?.usage && (
              <p className="mt-3 text-sm font-medium" data-testid="interviews-remaining-counter">
                Interviews remaining: {live.usage.interviews.remaining}/{live.usage.interviews.limit}
              </p>
            )}
            <Link to="/participant/interview">
              <Button className="mt-4 w-full" data-testid="goto-interview-button">
                <Sparkles className="h-4 w-4 mr-1.5" aria-hidden="true" /> Start a practice interview
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-12">
          <CardHeader>
            <CardTitle className="text-lg">Your monthly allowances</CardTitle>
          </CardHeader>
          <CardContent>
            {live?.usage ? (
              <div className="flex flex-wrap gap-2" data-testid="usage-summary-panel">
                <UsageMeter metric={live.usage.interviews} testId="usage-interviews" />
                <UsageMeter metric={live.usage.resumes} testId="usage-resumes" />
                <UsageMeter metric={live.usage.cover_letters} testId="usage-cover-letters" />
                <UsageMeter metric={live.usage.job_logs} testId="usage-job-logs" showIcon={false} />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm" data-testid="usage-summary-empty">
                Allowances will appear here.
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              Allowances reset on the first of each month. Saved resumes, cover letters, scorecards and
              certificates can be viewed and downloaded as often as you like.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-12">
          <CardHeader>
            <CardTitle className="text-lg">Recent job search activity</CardTitle>
          </CardHeader>
          <CardContent>
            {live && live.recent_logs.length > 0 ? (
              <ul className="divide-y" data-testid="recent-logs-list">
                {live.recent_logs.map((log) => (
                  <li key={log.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">
                        {log.position_title} — {log.employer_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {log.application_date} · {log.application_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{log.points} pts</Badge>
                      <Badge variant={log.status === "verified" ? "default" : "secondary"}>{log.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground" data-testid="recent-logs-empty">
                No activity logged yet — record your first application to start earning points.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
