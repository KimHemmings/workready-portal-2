import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Plus, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppShell from "@/components/AppShell";
import Markdown from "@/components/Markdown";
import UsageMeter from "@/components/UsageMeter";
import { apiGet, apiPatch, apiPost, ApiError } from "@/lib/api";
import { downloadMarkdownPdf } from "@/lib/docPdf";
import { getSessionUser } from "@/lib/session";
import type { Resume, UsageSummary } from "@/lib/types";

type Job = { title: string; employer: string; dates: string; description: string };
type Edu = { qualification: string; institution: string; year: string };

function download(name: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}


export default function ResumeBuilder() {
  const user = getSessionUser();
  const qc = useQueryClient();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [location, setLocation] = useState("Newcastle, NSW");
  const [targetRole, setTargetRole] = useState("Retail Team Member");
  const [skills, setSkills] = useState("Customer service, Teamwork, Point of sale, Reliability");
  const [jobs, setJobs] = useState<Job[]>([
    { title: "Work Experience — Retail Assistant", employer: "Local IGA", dates: "2024", description: "Served customers, restocked shelves and handled cash." },
  ]);
  const [edu, setEdu] = useState<Edu[]>([
    { qualification: "Year 12 Certificate", institution: "Hunter Valley High School", year: "2023" },
  ]);
  const [current, setCurrent] = useState<Resume | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [coverText, setCoverText] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setResumeText(current?.generated_markdown ?? "");
    setCoverText(current?.cover_letter_markdown ?? "");
    setEditing(false);
  }, [current]);

  const resumes = useQuery({
    queryKey: ["resumes", user?.id],
    queryFn: () => apiGet<Resume[]>(`/participants/${user!.id}/resumes`),
    enabled: Boolean(user),
  });

  const usage = useQuery({
    queryKey: ["usage", user?.id],
    queryFn: () => apiGet<UsageSummary>(`/participants/${user!.id}/usage`),
    enabled: Boolean(user),
  });

  const coverLettersLeft = usage.data?.cover_letters.remaining ?? 1;
  const resumesLeft = usage.data?.resumes.remaining ?? 1;

  const save = useMutation({
    mutationFn: () =>
      apiPatch<Resume>(`/participants/${user!.id}/resumes/${current!.id}`, {
        generated_markdown: resumeText,
        cover_letter_markdown: coverText,
      }),
    onSuccess: (data) => {
      setCurrent(data);
      qc.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Edits saved — no AI credits used.");
    },
    onError: () => toast.error("Could not save your edits."),
  });

  const generate = useMutation({
    mutationFn: () =>
      apiPost<Resume>(`/participants/${user!.id}/resumes`, {
        title: `${targetRole} Resume`,
        contact_info_json: { full_name: fullName, email, phone, location },
        work_history_json: jobs,
        education_json: edu,
        skills_json: skills.split(",").map((s) => s.trim()).filter(Boolean),
        target_role: targetRole,
        include_cover_letter: coverLettersLeft > 0,
      }),
    onSuccess: (data) => {
      setCurrent(data);
      qc.invalidateQueries({ queryKey: ["resumes"] });
      qc.invalidateQueries({ queryKey: ["usage"] });
      toast.success(
        data.cover_letter_markdown
          ? "Your resume and cover letter are ready."
          : "Resume ready. Your cover letter allowance for this month is used up.",
      );
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(detail ?? "Could not generate your resume. Please try again.");
      qc.invalidateQueries({ queryKey: ["usage"] });
    },
  });

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
          Resume & Cover Letter Builder
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1">
          Build an ATS-friendly resume
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Fill in your details and we'll write a clean, Australian-style resume and matching cover letter.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg">Your details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="full-name">Full name</Label>
                <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} data-testid="resume-name-input" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="resume-email">Email</Label>
                <Input id="resume-email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="resume-email-input" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="resume-phone">Phone</Label>
                <Input id="resume-phone" value={phone} onChange={(e) => setPhone(e.target.value)} data-testid="resume-phone-input" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="resume-location">Suburb / State</Label>
                <Input id="resume-location" value={location} onChange={(e) => setLocation(e.target.value)} data-testid="resume-location-input" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="target-role">Role you're targeting</Label>
              <Input id="target-role" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} data-testid="resume-target-input" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="skills">Key skills (comma separated)</Label>
              <Textarea id="skills" rows={2} value={skills} onChange={(e) => setSkills(e.target.value)} data-testid="resume-skills-input" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Work history</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setJobs((p) => [...p, { title: "", employer: "", dates: "", description: "" }])}
                  data-testid="add-work-history-button"
                >
                  <Plus className="h-4 w-4 mr-1" aria-hidden="true" /> Add
                </Button>
              </div>
              {jobs.map((job, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-2">
                  <Input
                    placeholder="Position title"
                    value={job.title}
                    onChange={(e) => setJobs((p) => p.map((j, k) => (k === i ? { ...j, title: e.target.value } : j)))}
                    data-testid={`work-title-input-${i}`}
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      placeholder="Employer"
                      value={job.employer}
                      onChange={(e) => setJobs((p) => p.map((j, k) => (k === i ? { ...j, employer: e.target.value } : j)))}
                      data-testid={`work-employer-input-${i}`}
                    />
                    <Input
                      placeholder="Dates (e.g. 2023–2024)"
                      value={job.dates}
                      onChange={(e) => setJobs((p) => p.map((j, k) => (k === i ? { ...j, dates: e.target.value } : j)))}
                      data-testid={`work-dates-input-${i}`}
                    />
                  </div>
                  <Textarea
                    rows={2}
                    placeholder="What you did"
                    value={job.description}
                    onChange={(e) => setJobs((p) => p.map((j, k) => (k === i ? { ...j, description: e.target.value } : j)))}
                    data-testid={`work-description-input-${i}`}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Education</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEdu((p) => [...p, { qualification: "", institution: "", year: "" }])}
                  data-testid="add-education-button"
                >
                  <Plus className="h-4 w-4 mr-1" aria-hidden="true" /> Add
                </Button>
              </div>
              {edu.map((item, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-3 rounded-lg border p-3">
                  <Input
                    placeholder="Qualification"
                    value={item.qualification}
                    onChange={(e) => setEdu((p) => p.map((x, k) => (k === i ? { ...x, qualification: e.target.value } : x)))}
                    data-testid={`edu-qualification-input-${i}`}
                  />
                  <Input
                    placeholder="Institution"
                    value={item.institution}
                    onChange={(e) => setEdu((p) => p.map((x, k) => (k === i ? { ...x, institution: e.target.value } : x)))}
                    data-testid={`edu-institution-input-${i}`}
                  />
                  <Input
                    placeholder="Year"
                    value={item.year}
                    onChange={(e) => setEdu((p) => p.map((x, k) => (k === i ? { ...x, year: e.target.value } : x)))}
                    data-testid={`edu-year-input-${i}`}
                  />
                </div>
              ))}
            </div>

            <Button
              className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
              disabled={generate.isPending || !fullName.trim() || resumesLeft <= 0}
              onClick={() => generate.mutate()}
              data-testid="generate-resume-button"
            >
              <Sparkles className="h-4 w-4 mr-1.5" aria-hidden="true" />
              {generate.isPending ? "Writing your resume…" : "Generate resume & cover letter"}
            </Button>
            {resumesLeft <= 0 && (
              <p className="text-sm text-destructive" data-testid="resume-limit-notice">
                You have used all {usage.data?.resumes.limit} AI resume generations this month. You can
                still edit and download your saved resumes, or ask your case manager for an extra session.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" aria-hidden="true" /> Preview
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {usage.data && <UsageMeter metric={usage.data.resumes} testId="resume-usage-meter" />}
                  {usage.data && (
                    <UsageMeter metric={usage.data.cover_letters} testId="cover-letter-usage-meter" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {current ? (
                <Tabs defaultValue="resume">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <TabsList>
                      <TabsTrigger value="resume" data-testid="preview-tab-resume">Resume</TabsTrigger>
                      <TabsTrigger value="cover" data-testid="preview-tab-cover">Cover letter</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[11px]">Editing is free</Badge>
                      <Button
                        variant={editing ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditing((v) => !v)}
                        data-testid="toggle-edit-button"
                      >
                        {editing ? "Preview" : "Edit text"}
                      </Button>
                      {editing && (
                        <Button
                          size="sm"
                          onClick={() => save.mutate()}
                          disabled={save.isPending}
                          data-testid="save-edits-button"
                        >
                          <Save className="h-4 w-4 mr-1.5" aria-hidden="true" />
                          {save.isPending ? "Saving…" : "Save edits"}
                        </Button>
                      )}
                    </div>
                  </div>

                  <TabsContent value="resume">
                    {editing ? (
                      <Textarea
                        rows={16}
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        aria-label="Edit resume text"
                        className="font-mono text-xs"
                        data-testid="resume-edit-input"
                      />
                    ) : (
                      <div className="max-h-[420px] overflow-y-auto" data-testid="resume-preview">
                        <Markdown markdown={resumeText} />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button
                        className="bg-cta text-cta-foreground hover:bg-cta/90"
                        onClick={() =>
                          downloadMarkdownPdf(
                            `${current.title.replace(/\s+/g, "-").toLowerCase()}.pdf`,
                            current.title,
                            resumeText,
                          )
                        }
                        data-testid="download-resume-pdf-button"
                      >
                        <Download className="h-4 w-4 mr-1.5" aria-hidden="true" /> Download PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => download("resume.md", resumeText)}
                        data-testid="download-resume-button"
                      >
                        <Download className="h-4 w-4 mr-1.5" aria-hidden="true" /> Download markdown
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="cover">
                    {coverText ? (
                      <>
                        {editing ? (
                          <Textarea
                            rows={16}
                            value={coverText}
                            onChange={(e) => setCoverText(e.target.value)}
                            aria-label="Edit cover letter text"
                            className="font-mono text-xs"
                            data-testid="cover-edit-input"
                          />
                        ) : (
                          <div className="max-h-[420px] overflow-y-auto" data-testid="cover-preview">
                            <Markdown markdown={coverText} />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button
                            className="bg-cta text-cta-foreground hover:bg-cta/90"
                            onClick={() =>
                              downloadMarkdownPdf("cover-letter.pdf", "Cover Letter", coverText)
                            }
                            data-testid="download-cover-pdf-button"
                          >
                            <Download className="h-4 w-4 mr-1.5" aria-hidden="true" /> Download PDF
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => download("cover-letter.md", coverText)}
                            data-testid="download-cover-button"
                          >
                            <Download className="h-4 w-4 mr-1.5" aria-hidden="true" /> Download markdown
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground py-4" data-testid="cover-letter-empty">
                        No cover letter was generated for this resume — your monthly cover letter allowance
                        was used up. Your case manager can grant more.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <p className="text-muted-foreground text-sm" data-testid="resume-preview-empty">
                  Your generated resume will appear here.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved resumes</CardTitle>
            </CardHeader>
            <CardContent>
              {(resumes.data ?? []).length === 0 ? (
                <p className="text-muted-foreground text-sm" data-testid="saved-resumes-empty">
                  No saved resumes yet.
                </p>
              ) : (
                <ul className="space-y-2" data-testid="saved-resumes-list">
                  {(resumes.data ?? []).map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{r.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString("en-AU")}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setCurrent(r)} data-testid={`view-resume-${r.id}`}>
                        View
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
