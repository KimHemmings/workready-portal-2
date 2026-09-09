import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Image as ImageIcon, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { apiGet, apiPatch, apiPost, ApiError } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { AdminOverview, Organization, Role, User } from "@/lib/types";

const PIE_COLOURS = ["#7C3AED", "#1E3A8A", "#F97316", "#10B981", "#0EA5E9"];
const ROLE_LABEL: Record<Role, string> = {
  participant: "Jobseeker",
  coach: "Case Manager",
  admin: "Provider Admin",
};

export default function AdminDashboard() {
  const user = getSessionUser();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("participant");
  const [coachId, setCoachId] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const overview = useQuery({
    queryKey: ["admin-overview", user?.id],
    queryFn: () => apiGet<AdminOverview>(`/admin/${user!.id}/overview`),
    enabled: Boolean(user),
  });

  const invite = useMutation({
    mutationFn: () =>
      apiPost<User>(`/admin/${user!.id}/users`, {
        name,
        email,
        role,
        coach_id: role === "participant" && coachId ? coachId : null,
      }),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      setName("");
      setEmail("");
      toast.success(`${created.name} has been invited as a ${ROLE_LABEL[created.role]}.`);
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(detail ?? "Could not invite that user.");
    },
  });

  const saveBranding = useMutation({
    mutationFn: (branding_logo: string) =>
      apiPatch<Organization>(`/admin/${user!.id}/organization`, { branding_logo }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      qc.invalidateQueries({ queryKey: ["organization"] });
      setLogoUrl("");
      toast.success("Organisation logo updated — it will appear on new certificate downloads.");
    },
    onError: () => toast.error("Could not save that logo."),
  });

  const toggle = useMutation({
    mutationFn: (id: string) => apiPatch<User>(`/admin/${user!.id}/users/${id}/status`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Account status updated.");
    },
    onError: () => toast.error("Could not update that account."),
  });

  const d = overview.isError ? null : overview.data;

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
          Provider Admin
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1 flex items-center gap-2">
          <Building2 className="h-7 w-7 text-primary" aria-hidden="true" />
          {d?.organization.name ?? "Your organisation"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {d ? `${d.organization.type} provider` : "Organisation analytics and user management"}
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Jobseekers", value: d?.total_participants ?? 0, testId: "kpi-participants" },
          { label: "Case Managers", value: d?.total_coaches ?? 0, testId: "kpi-coaches" },
          { label: "Cohorts", value: d?.total_cohorts ?? 0, testId: "kpi-cohorts" },
          { label: "Average completion", value: `${d?.average_completion ?? 0}%`, testId: "kpi-completion" },
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

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module engagement</CardTitle>
          </CardHeader>
          <CardContent className="h-72" data-testid="module-engagement-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d?.module_engagement ?? []} margin={{ left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={70} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completion rate by cohort</CardTitle>
          </CardHeader>
          <CardContent className="h-72" data-testid="cohort-completion-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={d?.cohort_completion ?? []}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label={(entry: { name?: string; value?: number }) => `${entry.name}: ${entry.value}%`}
                >
                  {(d?.cohort_completion ?? []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLOURS[i % PIE_COLOURS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-brand-purple" aria-hidden="true" /> Organisation branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-slate-200/80 bg-muted/40 p-4 flex items-center justify-center min-h-28">
              {d?.organization.branding_logo ? (
                <img
                  src={d.organization.branding_logo}
                  alt={`${d.organization.name} logo`}
                  className="max-h-20 object-contain"
                  data-testid="org-logo-preview"
                />
              ) : (
                <p className="text-sm text-muted-foreground" data-testid="org-logo-empty">
                  No logo uploaded yet
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="logo-upload">Upload organisation logo</Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 400_000) {
                    toast.error("Please choose an image under 400KB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => saveBranding.mutate(String(reader.result));
                  reader.onerror = () => toast.error("Could not read that file.");
                  reader.readAsDataURL(file);
                }}
                data-testid="org-logo-upload-input"
              />
              <p className="text-xs text-muted-foreground">
                PNG, JPG, SVG or WebP up to 400KB. This logo appears on every certificate PDF your
                jobseekers download.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="logo-url">Or paste an image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="logo-url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://…/logo.png"
                  data-testid="org-logo-url-input"
                />
                <Button
                  variant="outline"
                  onClick={() => logoUrl.trim() && saveBranding.mutate(logoUrl.trim())}
                  disabled={saveBranding.isPending || !logoUrl.trim()}
                  data-testid="org-logo-url-save-button"
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" aria-hidden="true" /> Invite a user
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim() && email.trim()) invite.mutate();
                else toast.error("Name and email are required.");
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="invite-name">Full name</Label>
                <Input id="invite-name" value={name} onChange={(e) => setName(e.target.value)} data-testid="invite-name-input" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-email">Email</Label>
                <Input id="invite-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="invite-email-input" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={role} onValueChange={(v: string) => setRole(v as Role)}>
                  <SelectTrigger id="invite-role" data-testid="invite-role-select">
                    <SelectValue>{(v) => ROLE_LABEL[(v as Role) ?? "participant"]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="participant" data-testid="invite-role-participant">Jobseeker</SelectItem>
                    <SelectItem value="coach" data-testid="invite-role-coach">Case Manager</SelectItem>
                    <SelectItem value="admin" data-testid="invite-role-admin">Provider Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {role === "participant" && (d?.coaches.length ?? 0) > 0 && (
                <div className="space-y-1.5">
                  <Label htmlFor="invite-coach">Assign to Case Manager</Label>
                  <Select value={coachId} onValueChange={(v: string) => setCoachId(v)}>
                    <SelectTrigger id="invite-coach" data-testid="invite-coach-select">
                      <SelectValue>
                        {(v) => d?.coaches.find((c) => c.id === v)?.name ?? "Unassigned"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(d?.coaches ?? []).map((c) => (
                        <SelectItem key={c.id} value={c.id} data-testid={`invite-coach-${c.id}`}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={invite.isPending} data-testid="invite-submit-button">
                {invite.isPending ? "Inviting…" : "Send invitation"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-lg">Users in this organisation</CardTitle>
          </CardHeader>
          <CardContent>
            {(d?.users.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground" data-testid="admin-users-empty">
                No users loaded yet.
              </p>
            ) : (
              <Table data-testid="admin-users-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Cohort</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(d?.users ?? []).map((u) => (
                    <TableRow key={u.id} data-testid={`admin-user-row-${u.id}`}>
                      <TableCell>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </TableCell>
                      <TableCell className="text-sm">{ROLE_LABEL[u.role]}</TableCell>
                      <TableCell className="text-sm">
                        {d?.cohorts.find((c) => c.id === u.cohort_id)?.name ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.status === "active" ? "default" : "secondary"}>{u.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggle.mutate(u.id)}
                          disabled={u.id === user?.id}
                          data-testid={`toggle-status-${u.id}`}
                        >
                          {u.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
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
