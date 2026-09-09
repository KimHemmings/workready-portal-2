import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Building2, KeyRound, Lock, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { BRAND_LOGO } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, ApiError } from "@/lib/api";
import { beginSession, homePathFor } from "@/lib/session";
import type { User } from "@/lib/types";

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState((params.get("code") ?? "").toUpperCase());

  const register = useMutation({
    mutationFn: () =>
      apiPost<User>("/auth/register", {
        name: name.trim(),
        organization_name: organization.trim(),
        email: email.trim(),
        password,
        invite_code: inviteCode.trim().toUpperCase(),
      }),
    onSuccess: (user) => {
      beginSession(user);
      toast.success(`Welcome aboard, ${user.name.split(" ")[0]}!`);
      navigate(homePathFor(user.role));
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(detail ?? "Could not create that account. Please check your details.");
    },
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=srgb&fm=jpg&w=1200&q=70)",
          }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-xl bg-white p-1.5">
            <img src={BRAND_LOGO} alt="Straight Up Training" className="h-full w-full object-contain" />
          </span>
          <span className="font-heading text-xl font-semibold">Straight Up Training</span>
        </div>
        <div className="relative max-w-md">
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight">
            Create your account and start building work-ready skills.
          </h1>
          <p className="mt-4 text-sidebar-foreground/80 leading-relaxed">
            Joining a school, Workforce Australia, TtW or DES site? Enter the Site Invite Code your
            provider gave you so your case manager can see your progress.
          </p>
        </div>
        <p className="relative text-xs text-sidebar-foreground/60">
          Straight Up Training — Australian employability skills platform.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <span className="lg:hidden mb-6 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white shadow-sm p-1.5">
              <img src={BRAND_LOGO} alt="Straight Up Training" className="h-full w-full object-contain" />
            </span>
            <span className="font-heading text-lg font-semibold">Straight Up Training</span>
          </span>

          <h2 className="font-heading text-3xl font-bold tracking-tight">Sign up</h2>
          <p className="text-muted-foreground mt-2">
            New accounts start as a Jobseeker. Case Manager and Provider Admin access is issued by your
            site administrator.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim().length < 2) {
                toast.error("Please enter your full name.");
                return;
              }
              if (!email.trim()) {
                toast.error("Please enter your email address.");
                return;
              }
              if (password.length < 8) {
                toast.error("Please choose a password of at least 8 characters.");
                return;
              }
              register.mutate();
            }}
            data-testid="signup-form"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="name"
                  className="pl-9"
                  autoComplete="name"
                  placeholder="Jamie Nguyen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="signup-name-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organisation / site name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="organization"
                  className="pl-9"
                  autoComplete="organization"
                  placeholder="Hunter Valley Employment Services"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  data-testid="signup-organization-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="signup-email"
                  type="email"
                  className="pl-9"
                  autoComplete="email"
                  placeholder="you@yoursite.com.au"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="signup-email-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="signup-password"
                  type="password"
                  className="pl-9"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="signup-password-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-code">
                Site Invite Code <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="invite-code"
                  className="pl-9 font-mono uppercase"
                  placeholder="SITE-2026"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  data-testid="signup-invite-code-input"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave blank to set up your own site — you can join a provider later.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
              disabled={register.isPending}
              data-testid="signup-submit-button"
            >
              {register.isPending ? "Creating your account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground text-center" data-testid="signin-prompt">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              data-testid="signin-link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
