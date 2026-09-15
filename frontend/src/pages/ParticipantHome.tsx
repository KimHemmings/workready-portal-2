import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Award, ClipboardList, MessagesSquare, Sparkles, Target, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProgressRing from "@/components/ProgressRing";
import UsageMeter from "@/components/UsageMeter";
import AppShell from "@/components/AppShell";
import { apiGet } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { ParticipantDashboard } from "@/lib/types";

const FALLBACK_DASHBOARD: ParticipantDashboard = {
  user: {
    id: "demo-part-1",
    email: "alex@workready.com.au",
    name: "Alex Johnson",
    role: "participant",
    created_at: "2026-01-01T00:00:00Z"
  },
  completion_percent: 65,
  completed_modules: 8,
  total_modules: 12,
  in_progress_modules: 2,
  certificates: 3,
  pbas_points: 75,
  pbas_target: 100,
  latest_interview_score: 82,
  next_module: {
    id: "mod-101",
    title: "Effective Workplace Communication",
    category: "Core Skills",
    description: "Learn essential verbal and written communication techniques for modern team environments.",
    estimated_minutes: 25,
    video_url: "",
    content_markdown: "Effective workplace communication ensures team alignment.",
    order: 1
  },
  usage: {
    participant_id: "demo-part-1",
    month: "2026-03",
    interviews: { kind: "interviews", remaining: 3, limit: 5, used: 2, base_limit: 5, granted_extra: 0 },
    resumes: { kind: "resumes", remaining: 4, limit: 5, used: 1, base_limit: 5, granted_extra: 0 },
    cover_letters: { kind: "cover_letters", remaining: 3, limit: 5, used: 2, base_limit: 5, granted_extra: 0 },
    job_logs: { kind: "job_logs", remaining: 15, limit: 20, used: 5, base_limit: 20, granted_extra: 0 }
  },
  recent_logs: [
    {
      id: "log-1",
      participant_id: "demo-part-1",
      position_title: "Warehouse Logistics Assistant",
      employer_name: "Apex Logistics",
      application_date: "2026-03-10",
      application_type: "Online Portal",
      evidence_filename: "apex_confirm.pdf",
      evidence_data: "",
      evidence_mime: "application/pdf",
      evidence_size: 1024,
      notes: "Submitted application via company site.",
      points: 20,
      status: "verified",
      review_status: "approved",
      review_note: "Verified by case manager.",
      reviewed_by: "cm-1",
      reviewed_at: "2026-03-10T11:00:00Z",
      created_at: "2026-03-10T09:00:00Z"
    },
    {
      id: "log-2",
      participant_id: "demo-part-1",
      position_title: "Customer Support Officer",
      employer_name: "Metro Call Solutions",
      application_date: "2026-03-08",
      application_type: "Email",
      evidence_filename: "metro_email.pdf",
      evidence_data: "",
      evidence_mime: "application/pdf",
      evidence_size: 2048,
      notes: "Sent resume directly to HR.",
      points: 15,
      status: "submitted",
      review_status: "pending",
      review_note: "",
      reviewed_by: "",
      reviewed_at: "",
      created_at: "2026-03-08T14:30:00Z"
    }
  ]
};

export default function ParticipantHome() {
  const user = getSessionUser();
  const { data, isError } = useQuery({
    queryKey: ["participant-dashboard", user?.id],
    queryFn: () => apiGet<ParticipantDashboard>(`/participants/${user!.id}/dashboard`),
    enabled: Boolean(user?.id),
    retry: false
  });

  const live = (!isError && data) ? data : FALLBACK_DASHBOARD;
  const pbasPercent = Math.min(100, Math.round((live.pbas_points / live.pbas_target) * 100));

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider font-bold text-[#16a34a] font-mono">
          Learner Dashboard
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1 text-slate-900">
          G'day {user?.name?.split(" ")[0] ?? "Alex"} 👋
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Keep building your Core Skills for Work, practise interviews, manage your resume, and stay on top of your Mutual Obligation requirements.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Your Training Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ProgressRing percent={live.completion_percent} testId="progress-ring" />
            <div className="space-y-1.5 text-sm">
              <p data-testid="modules-completed-stat">
                <span className="text-2xl font-bold font-heading text-slate-900">{live.completed_modules}</span>
                <span className="text-muted-foreground"> / {live.total_modules} modules done</span>
              </p>
              <p className="text-muted-foreground">{live.in_progress_modules} in progress</p>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <Award className="h-4 w-4 text-[#16a34a]" aria-hidden="true" />
                {live.certificates} certificates earned
              </p>
              <Link
                to="/participant/certificates"
                className="inline-block text-sm font-semibold text-[#16a34a] hover:underline pt-1"
                data-testid="goto-certificates-link"
              >
                View certificates →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Target className="h-5 w-5 text-[#16a34a]" aria-hidden="true" />
              Mutual Obligation — PBAS Points This Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <p className="text-3xl font-bold font-heading tabular-nums text-slate-900" data-testid="pbas-points-total">
                {live.pbas_points}
                <span className="text-base font-normal text-muted-foreground"> / {live.pbas_target} points</span>
              </p>
              <Badge 
                style={{ backgroundColor: pbasPercent >= 100 ? '#16a34a' : '#24083b', color: '#fff' }} 
                data-testid="pbas-status-badge"
              >
                {pbasPercent >= 100 ? "Target met" : `${100 - pbasPercent}% to go`}
              </Badge>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#16a34a] transition-[width] duration-700 ease-out"
                style={{ width: `${pbasPercent}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Log every application, phone enquiry, and interview to keep your points updated.
            </p>
            <Link to="/participant/job-logs">
              <Button variant="outline" size="sm" className="mt-4 border-slate-300 font-semibold" data-testid="goto-job-logs-button">
                <ClipboardList className="h-4 w-4 mr-1.5 text-[#16a34a]" aria-hidden="true" /> Log an Activity
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Pick Up Where You Left Off</CardTitle>
          </CardHeader>
          <CardContent>
            {live.next_module ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2 bg-slate-100 text-slate-700">
                    {live.next_module.category}
                  </Badge>
                  <p className="font-semibold text-lg font-heading text-slate-900">{live.next_module.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {live.next_module.description} · approx {live.next_module.estimated_minutes} minutes
                  </p>
                </div>
                <Link to={`/participant/modules/${live.next_module.id}`}>
                  <Button style={{ backgroundColor: '#16a34a', color: '#fff' }} className="font-bold hover:bg-green-700" data-testid="start-next-module-button">
                    Start Module
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground" data-testid="next-module-empty">
                All modules complete — brilliant work. Head to the Learning Centre to revise.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 bg-slate-50 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <MessagesSquare className="h-5 w-5 text-[#16a34a]" aria-hidden="true" /> AI Interview & Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Practise realistic interview questions with feedback, or update your tailored resume.
            </p>
            {live.latest_interview_score != null && (
              <p className="mt-3 text-sm text-slate-700" data-testid="latest-interview-score">
                Last readiness score:{" "}
                <span className="font-bold text-lg text-[#16a34a]">{live.latest_interview_score}/100</span>
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Link to="/participant/interview" className="flex-1">
                <Button style={{ backgroundColor: '#24083b', color: '#fff' }} className="w-full font-semibold hover:bg-purple-950" data-testid="goto-interview-button">
                  <Sparkles className="h-4 w-4 mr-1.5 text-green-400" aria-hidden="true" /> Practice Interview
                </Button>
              </Link>
              <Link to="/participant/resume-builder" className="flex-1">
                <Button variant="outline" className="w-full border-slate-300 font-semibold" data-testid="goto-resume-button">
                  <FileText className="h-4 w-4 mr-1.5 text-[#16a34a]" aria-hidden="true" /> Resume Builder
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-12 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Your Monthly Allowances</CardTitle>
          </CardHeader>
          <CardContent>
            {live.usage ? (
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
              Allowances reset on the first of each month. Saved resumes, cover letters, scorecards, and certificates can be viewed and downloaded anytime.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-12 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Recent Job Search Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {live.recent_logs.length > 0 ? (
              <ul className="divide-y divide-slate-100" data-testid="recent-logs-list">
                {live.recent_logs.map((log) => (
                  <li key={log.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {log.position_title} — {log.employer_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {log.application_date} · {log.application_type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-semibold border-slate-300">{log.points} pts</Badge>
                      <Badge style={{ backgroundColor: log.status === "verified" ? "#16a34a" : "#24083b", color: "#fff" }}>
                        {log.status}
                      </Badge>
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
