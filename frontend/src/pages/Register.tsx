import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { BRAND_LOGO } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import { beginSession, homePathFor } from "@/lib/session";
import type { InvitePreview, Role, User } from "@/lib/types";

const ROLE_LABEL: Record<Role, string> = {
  participant: "Jobseeker",
  coach: "Case Manager",
  admin: "Provider Admin",
  owner: "System Owner",
};

function errorDetail(err: unknown, fallback: string): string {
  const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
  return typeof detail === "string" ? detail : fallback;
}

export default function Register() {
  const [params] = useSearchParams();
  const token = params.get("invite") ?? "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const preview = useQuery({
    queryKey: ["invite-preview", token],
    queryFn: () => apiGet<InvitePreview>(`/auth/invites/${token}`),
    enabled: Boolean(token),
    retry: false,
  });

  const complete = useMutation({
    mutationFn: () => apiPost<User>(`/auth/invites/${token}/complete`, { password }),
    onSuccess: (user) => {
      beginSession(user);
      toast.success(`Welcome aboard, ${user.name.split(" ")[0]}!`);
      navigate(homePathFor(user.role));
    },
    onError: (err) => toast.error(errorDetail(err, "Could not complete your registration.")),
  });

  const invalid = !token || preview.isError;

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 p-6">
      <div className="w-full max-w-md" data-testid="register-page">
        <div className="flex items-center gap-3 mb-8">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-white shadow-sm p-1.5">
            <img src={BRAND_LOGO} alt="Straight Up Training" className="h-full w-full object-contain" />
          </span>
          <span className="font-heading text-lg font-semibold">Straight Up Training</span>
        </div>

        {invalid ? (
          <div className="rounded-2xl border bg-card p-6 shadow-sm" data-testid="invite-invalid">
            <h1 className="font-heading text-2xl font-bold tracking-tight">Invite link not valid</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              This magic link has already been used or has been withdrawn. Ask your Case Manager or
              Provider Admin to send you a fresh link.
            </p>
            <Link to="/login">
              <Button className="mt-5 w-full" data-testid="register-back-to-login">
                Back to sign in
              </Button>
            </Link>
          </div>
        ) : preview.isLoading ? (
          <p className="text-sm text-muted-foreground" data-testid="invite-loading">
            Checking your invite…
          </p>
        ) : preview.data?.already_completed ? (
          <div className="rounded-2xl border bg-card p-6 shadow-sm" data-testid="invite-already-completed">
            <h1 className="font-heading text-2xl font-bold tracking-tight">You're already set up</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              This account has a password already. Sign in with {preview.data.email}.
            </p>
            <Link to="/login">
              <Button className="mt-5 w-full" data-testid="register-signin-link">
                Go to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider font-semibold text-primary font-mono">
              Complete registration
            </p>
            <h1 className="font-heading text-2xl font-bold tracking-tight mt-1" data-testid="invite-greeting">
              G'day {preview.data?.name.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm" data-testid="invite-summary">
              You've been set up with <strong>{preview.data?.organization_name}</strong> as a{" "}
              <strong>{preview.data ? ROLE_LABEL[preview.data.role] : ""}</strong>. Choose a password to
              finish.
            </p>
            <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-sm font-mono" data-testid="invite-email">
              {preview.data?.email}
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (password.length < 8) {
                  toast.error("Please choose a password of at least 8 characters.");
                  return;
                }
                if (password !== confirm) {
                  toast.error("Both passwords must match.");
                  return;
                }
                complete.mutate();
              }}
              data-testid="register-form"
            >
              <div className="space-y-2">
                <Label htmlFor="new-password">Create a password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  data-testid="register-password-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  data-testid="register-confirm-input"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
                disabled={complete.isPending}
                data-testid="register-submit-button"
              >
                <KeyRound className="h-4 w-4 mr-1.5" aria-hidden="true" />
                {complete.isPending ? "Setting up…" : "Set password and sign in"}
              </Button>
            </form>

            <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              Your link is personal to you. Passwords are stored as one-way hashes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
