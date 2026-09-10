import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Eye, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiGet } from "@/lib/api";
import {
  getImpersonator,
  getSessionUser,
  homePathFor,
  startImpersonation,
  stopImpersonation,
} from "@/lib/session";
import type { RoleSwitchTarget } from "@/lib/types";

/**
 * System-Admin-only access override. Switching picks a real, active user of the chosen role, so
 * every screen renders genuine data rather than a fake permission flag.
 */
export default function RoleSwitcher() {
  const user = getSessionUser();
  const admin = getImpersonator() ?? user;
  const qc = useQueryClient();
  const navigate = useNavigate();

  const enabled = admin?.role === "owner";

  const targets = useQuery({
    queryKey: ["role-switch-targets", admin?.id],
    queryFn: () => apiGet<RoleSwitchTarget[]>(`/role-switch/${admin!.id}`),
    enabled,
    staleTime: 60_000,
  });

  if (!enabled || !user) return null;

  const rows = targets.isError ? [] : (targets.data ?? []);
  const impersonating = getImpersonator() !== null;

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-xl border border-sidebar-border bg-sidebar/60 px-3 py-2"
      data-testid="role-switcher"
    >
      <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        <Eye className="h-3.5 w-3.5" aria-hidden="true" /> View as
      </span>

      <Select
        value={user.role}
        onValueChange={(value: string) => {
          const target = rows.find((r) => r.role === value);
          if (!target) {
            toast.error("No active user exists for that role yet.");
            return;
          }
          if (target.user.id === user.id) return;
          startImpersonation(target.user, qc);
          toast.success(`Now viewing as ${target.label} — ${target.user.name}`);
          navigate(homePathFor(target.role));
        }}
      >
        <SelectTrigger className="h-9 w-[190px]" data-testid="role-switcher-select">
          <SelectValue>
            {(v) => rows.find((r) => r.role === v)?.label ?? "System Admin"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {rows.map((r) => (
            <SelectItem key={r.role} value={r.role} data-testid={`role-switch-${r.role}`}>
              {r.label} — {r.user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {impersonating && (
        <Button
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => {
            const back = stopImpersonation(qc);
            if (back) {
              toast.success("Back to your System Admin view.");
              navigate(homePathFor(back.role));
            }
          }}
          data-testid="role-switcher-exit-button"
        >
          <Undo2 className="h-4 w-4 mr-1.5" aria-hidden="true" /> Back to System Admin
        </Button>
      )}
    </div>
  );
}
