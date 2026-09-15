import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Award, 
  ClipboardList, 
  MessagesSquare, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Target, 
  UserCheck,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AppShell from "@/components/AppShell";
import ProgressRing from "@/components/ProgressRing";
import { apiGet, apiPost } from "@/lib/api";

export default function CoachParticipant() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [activeMilestone, setActiveMilestone] = useState<number>(1);

  const { data: participant } = useQuery({
    queryKey: ["coach-participant", id],
    queryFn: () => apiGet<any>(`/coach/participants/${id}`),
    enabled: Boolean(id)
  });

  const addNote = useMutation({
    mutationFn: (text: string) => apiPost(`/coach/participants/${id}/notes`, { note: text }),
    onSuccess: () => {
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["coach-participant", id] });
    }
  });

  const pData = participant ?? {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    completion_percent: 65,
    completed_modules: 8,
    total_modules: 12,
    pbas_points: 75,
    pbas_target: 100,
    latest_interview_score: 82,
    notes: []
  };

  return (
    <AppShell>
      {/* HEADER SECTION */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-[#16a34a] font-mono">
            Candidate Profile & Monitoring
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {pData.name}
          </h1>
          <p className="text-sm text-slate-500">{pData.email}</p>
        </div>
        <Link to="/coach/dashboard">
          <Button variant="outline" className="border-slate-300 font-semibold">
            ← Back to Roster
          </Button>
        </Link>
      </header>

      {/* 3-MILESTONE NAVIGATION HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setActiveMilestone(1)}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeMilestone === 1
              ? "border-[#16a34a] bg-emerald-50/50 shadow-sm ring-1 ring-[#16a34a]"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Milestone 1</span>
            <CheckCircle2 className="h-5 w-5 text-[#16a34a]" />
          </div>
          <p className="font-bold text-slate-900">Core Skills & Orientation</p>
          <p className="text-xs text-slate-500 mt-1">{pData.completed_modules}/{pData.total_modules} Modules Completed</p>
        </button>

        <button
          onClick={() => setActiveMilestone(2)}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeMilestone === 2
              ? "border-[#16a34a] bg-emerald-50/50 shadow-sm ring-1 ring-[#16a34a]"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Milestone 2</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <p className="font-bold text-slate-900">Job Readiness & AI Tools</p>
          <p className="text-xs text-slate-500 mt-1">Interview Score: {pData.latest_interview_score ?? "N/A"}/100</p>
        </button>

        <button
          onClick={() => setActiveMilestone(3)}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeMilestone === 3
              ? "border-[#16a34a] bg-emerald-50/50 shadow-sm ring-1 ring-[#16a34a]"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Milestone 3</span>
            <Target className="h-5 w-5 text-[#24083b]" />
          </div>
          <p className="font-bold text-slate-900">Placement & PBAS Points</p>
          <p className="text-xs text-slate-500 mt-1">{pData.pbas_points}/{pData.pbas_target} Target Points</p>
        </button>
      </div>

      {/* PARTICIPANT DETAILS & METRICS */}
      <div className="grid gap-6 lg:grid-cols-12 mb-8">
        <Card className="lg:col-span-6 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Training Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ProgressRing percent={pData.completion_percent} testId="progress-ring" />
            <div className="space-y-1 text-sm">
              <p className="text-2xl font-bold text-slate-900">{pData.completed_modules} / {pData.total_modules}</p>
              <p className="text-slate-500">Modules Completed</p>
            </div>
          </CardContent>
        </Card>

        {/* CASE NOTES CARD */}
        <Card className="lg:col-span-6 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Case Manager Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a case note for this candidate..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border-slate-300 min-h-[80px]"
              />
            </div>
            <Button
              onClick={() => note.trim() && addNote.mutate(note)}
              disabled={addNote.isPending || !note.trim()}
              style={{ backgroundColor: "#16a34a", color: "#fff" }}
              className="font-semibold"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Save Note
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* TABS CONTAINER */}
      <Tabs defaultValue="modules">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="jobs">Job Search Log</TabsTrigger>
          <TabsTrigger value="interviews">Interview Scorecards</TabsTrigger>
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="pt-4">
          <Card><CardContent className="pt-6"><p className="text-slate-600">Module completion history and progress details.</p></CardContent></Card>
        </TabsContent>
        <TabsContent value="jobs" className="pt-4">
          <Card><CardContent className="pt-6"><p className="text-slate-600">Submitted job search activities and PBAS points history.</p></CardContent></Card>
        </TabsContent>
        <TabsContent value="interviews" className="pt-4">
          <Card><CardContent className="pt-6"><p className="text-slate-600">AI interview performance logs and scorecards.</p></CardContent></Card>
        </TabsContent>
        <TabsContent value="resumes" className="pt-4">
          <Card><CardContent className="pt-6"><p className="text-slate-600">Generated resumes and tailored application documents.</p></CardContent></Card>
        </TabsContent>
        <TabsContent value="certificates" className="pt-4">
          <Card><CardContent className="pt-6"><p className="text-slate-600">Earned course certificates and downloadable awards.</p></CardContent></Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
