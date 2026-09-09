import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { BRAND_LOGO } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, ApiError } from "@/lib/api";
import { beginSession, getSessionUser, homePathFor } from "@/lib/session";
import type { User } from "@/lib/types";

export default function ChangePassword() {
  const user = getSessionUser();
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const change = useMutation({
    mutationFn: () =>
      apiPost<User>("/auth/change-password", {
        user_id: user!.id,
        current_password: current,
        new_password: next,
      }),
    onSuccess: (updated) => {
      beginSession(updated);
      toast.success("Password updated — you're all set.");
      navigate(homePathFor(updated.role));
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(typeof detail === "string" ? detail : "Could not update your password.");
    },
  });

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 p-6">
      <div className="w-full max-w-md" data-testid="change-password-page">
        <div className="flex items-center gap-3 mb-8">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-white shadow-sm p-1.5">
            <img src={BRAND_LOGO} alt="Straight Up Training" className="h-full w-full object-contain" />
          </span>
          <span className="font-heading text-lg font-semibold">Straight Up Training</span>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="font-heading text-2xl font-bold tracking-tight">Choose a new password</h1>
          <p className="text-muted-foreground mt-2 text-sm" data-testid="change-password-reason">
            You signed in with a temporary password. Please set your own password to continue.
          </p>

          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (next.length < 8) {
                toast.error("New password must be at least 8 characters.");
                return;
              }
              if (next !== confirm) {
                toast.error("Both new password fields must match.");
                return;
              }
              change.mutate();
            }}
            data-testid="change-password-form"
          >
            <div className="space-y-2">
              <Label htmlFor="current-password">Temporary / current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                data-testid="current-password-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-password">New password</Label>
              <Input
                id="next-password"
                type="password"
                autoComplete="new-password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="At least 8 characters"
                data-testid="new-password-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                data-testid="confirm-new-password-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
              disabled={change.isPending}
              data-testid="change-password-submit-button"
            >
              <KeyRound className="h-4 w-4 mr-1.5" aria-hidden="true" />
              {change.isPending ? "Saving…" : "Save password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
