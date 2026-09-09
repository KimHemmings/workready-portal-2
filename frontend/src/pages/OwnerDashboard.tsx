import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Link as LinkIcon, Save, ShieldPlus } from "lucide-react";
import { toast } from "sonner";
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
import AppShell from "@/components/AppShell";
import { InviteLinkDialog } from "@/components/InviteLinkDialog";
import { apiGet, apiPatch, apiPost, ApiError } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { InviteResult, Organization, OrgType, OwnerOverview } from "@/lib/types";

const ORG_TYPES: OrgType[] = ["School", "Workforce Australia", "TtW", "DES"];

function detailOf(err: unknown, fallback: string): string {
  const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
  return typeof detail === "string" ? detail : fallback;
}

export default function OwnerDashboard() {
  const user = getSessionUser();
  const qc = useQueryClient();
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<OrgType>("Workforce Australia");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [coachSeats, setCoachSeats] = useState("5");
  const [participantSeats, setParticipantSeats] = useState("100");
  const [invite, setInvite] = useState<InviteResult | null>(null);
  const [seatDraft, setSeatDraft] = useState<Record<string, { coach: string; participant: string }>>({});

  const overview = useQuery({
    queryKey: ["owner-overview", user?.id],
    queryFn: () => apiGet<OwnerOverview>(`/owner/${user!.id}/overview`),
    enabled: Boolean(user),
  });

  const createProvider = useMutation({
    mutationFn: () =>
      apiPost<InviteResult>(`/owner/${user!.id}/providers`, {
        organization_name: orgName.trim(),
        type: orgType,
        admin_name: adminName.trim(),
        admin_email: adminEmail.trim(),
        coach_seat_limit: Number(coachSeats) || 0,
        participant_seat_limit: Number(participantSeats) || 0,
      }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["owner-overview"] });
      setOrgName("");
      setAdminName("");
      setAdminEmail("");
      setInvite(res);
      toast.success(`${res.user.name} can now set up ${orgName || "the new provider"}.`);
    },
    onError: (err) => toast.error(detailOf(err, "Could not create that provider.")),
  });

  const saveSeats = useMutation({
    mutationFn: (vars: { orgId: string; coach: number; participant: number }) =>
      apiPatch<Organization>(`/owner/${user!.id}/providers/${vars.orgId}/seats`, {
        coach_seat_limit: vars.coach,
        participant_seat_limit: vars.participant,
      }),
    onSuccess: (org) => {
      qc.invalidateQueries({ queryKey: ["owner-overview"] });
      toast.success(`Seat limits updated for ${org.name}.`);
    },
    onError: (err) => toast.error(detailOf(err, "Could not update those seat limits.")),
  });

  const reissue = useMutation({
    mutationFn: (userId: string) =>
      apiPost<InviteResult>(`/owner/${user!.id}/users/${userId}/invite-link`),
    onSuccess: (res) => setInvite(res),
    onError: (err) => toast.error(detailOf(err, "Could not create an invite link.")),
  });

  const d = overview.isError ? null : overview.data;

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
          System Owner
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1">
          Provider accounts &amp; seats
        </h1>
        <p className="text-muted-foreground mt-2">
          Stand up new providers, set the seats they've paid for and hand over magic invite links.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Providers", value: d?.total_providers ?? 0, testId: "kpi-providers" },
          { label: "Case Managers", value: d?.total_coaches ?? 0, testId: "kpi-total-coaches" },
          { label: "Jobseekers", value: d?.total_participants ?? 0, testId: "kpi-total-participants" },
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

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldPlus className="h-5 w-5 text-primary" aria-hidden="true" /> Add a provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!orgName.trim() || !adminName.trim() || !adminEmail.trim()) {
                  toast.error("Provider name, admin name and admin email are all required.");
                  return;
                }
                createProvider.mutate();
              }}
              data-testid="create-provider-form"
            >
              <div className="space-y-1.5">
                <Label htmlFor="provider-name">Provider / site name</Label>
                <Input
                  id="provider-name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  data-testid="provider-name-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="provider-type">Provider type</Label>
                <Select value={orgType} onValueChange={(v: string) => setOrgType(v as OrgType)}>
                  <SelectTrigger id="provider-type" data-testid="provider-type-select">
                    <SelectValue>{(v) => (v as string) ?? "Workforce Australia"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_TYPES.map((t) => (
                      <SelectItem key={t} value={t} data-testid={`provider-type-${t.replace(/\s+/g, "-")}`}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="provider-admin-name">Provider Admin name</Label>
                <Input
                  id="provider-admin-name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  data-testid="provider-admin-name-input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="provider-admin-email">Provider Admin email</Label>
                <Input
                  id="provider-admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  data-testid="provider-admin-email-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="provider-coach-seats">Case Manager seats</Label>
                  <Input
                    id="provider-coach-seats"
                    type="number"
                    min={0}
                    value={coachSeats}
                    onChange={(e) => setCoachSeats(e.target.value)}
                    data-testid="provider-coach-seats-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="provider-participant-seats">Jobseeker seats</Label>
                  <Input
                    id="provider-participant-seats"
                    type="number"
                    min={0}
                    value={participantSeats}
                    onChange={(e) => setParticipantSeats(e.target.value)}
                    data-testid="provider-participant-seats-input"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
                disabled={createProvider.isPending}
                data-testid="create-provider-submit-button"
              >
                {createProvider.isPending ? "Creating…" : "Create provider & invite admin"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-purple" aria-hidden="true" /> Providers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(d?.providers.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground" data-testid="providers-empty">
                No providers yet — add your first one on the left.
              </p>
            ) : (
              (d?.providers ?? []).map((row) => {
                const draft = seatDraft[row.organization.id] ?? {
                  coach: String(row.organization.coach_seat_limit),
                  participant: String(row.organization.participant_seat_limit),
                };
                return (
                  <div
                    key={row.organization.id}
                    className="rounded-xl border bg-card p-4"
                    data-testid={`provider-row-${row.organization.id}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-heading font-semibold" data-testid={`provider-name-${row.organization.id}`}>
                          {row.organization.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{row.organization.type}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" data-testid={`provider-coach-usage-${row.organization.id}`}>
                          Case Managers {row.coach_seats_used}/{row.organization.coach_seat_limit}
                        </Badge>
                        <Badge variant="secondary" data-testid={`provider-participant-usage-${row.organization.id}`}>
                          Jobseekers {row.participant_seats_used}/{row.organization.participant_seat_limit}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-end gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`coach-seats-${row.organization.id}`} className="text-xs">
                          Case Manager seats
                        </Label>
                        <Input
                          id={`coach-seats-${row.organization.id}`}
                          type="number"
                          min={0}
                          className="w-28"
                          value={draft.coach}
                          onChange={(e) =>
                            setSeatDraft((s) => ({
                              ...s,
                              [row.organization.id]: { ...draft, coach: e.target.value },
                            }))
                          }
                          data-testid={`coach-seat-input-${row.organization.id}`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`participant-seats-${row.organization.id}`} className="text-xs">
                          Jobseeker seats
                        </Label>
                        <Input
                          id={`participant-seats-${row.organization.id}`}
                          type="number"
                          min={0}
                          className="w-28"
                          value={draft.participant}
                          onChange={(e) =>
                            setSeatDraft((s) => ({
                              ...s,
                              [row.organization.id]: { ...draft, participant: e.target.value },
                            }))
                          }
                          data-testid={`participant-seat-input-${row.organization.id}`}
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          saveSeats.mutate({
                            orgId: row.organization.id,
                            coach: Number(draft.coach) || 0,
                            participant: Number(draft.participant) || 0,
                          })
                        }
                        disabled={saveSeats.isPending}
                        data-testid={`save-seats-${row.organization.id}`}
                      >
                        <Save className="h-4 w-4 mr-1.5" aria-hidden="true" /> Save seats
                      </Button>
                    </div>

                    <div className="mt-3 border-t pt-3 space-y-2">
                      {row.admins.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No Provider Admin yet.</p>
                      ) : (
                        row.admins.map((a) => (
                          <div key={a.id} className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">{a.name}</p>
                              <p className="text-xs text-muted-foreground">{a.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={a.status === "active" ? "default" : "secondary"}>
                                {a.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => reissue.mutate(a.id)}
                                disabled={reissue.isPending}
                                data-testid={`owner-invite-link-${a.id}`}
                              >
                                <LinkIcon className="h-4 w-4 mr-1.5" aria-hidden="true" /> Invite link
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <InviteLinkDialog result={invite} onClose={() => setInvite(null)} />
    </AppShell>
  );
}
