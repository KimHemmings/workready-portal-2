import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { BRAND_LOGO } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPost, ApiError } from "@/lib/api";
import { beginSession, homePathFor } from "@/lib/session";
import type { User } from "@/lib/types";

const ROLE_META: Record<User["role"], { label: string; blurb: string; icon: React.ComponentType<{ className?: string }> }> = {
  participant: {
    label: "Jobseeker / Student",
    blurb: "Learning, AI interview practice, resume and PBAS job search log",
    icon: UserRound,
  },
  coach: {
    label: "Coach / Case Manager",
    blurb: "Roster, progress tracking, case notes and compliance exports",
    icon: GraduationCap,
  },
  admin: {
    label: "Provider Admin",
    blurb: "Staff, cohorts, branding and organisation-wide analytics",
    icon: ShieldCheck,
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const demo = useQuery({
    queryKey: ["demo-accounts"],
    queryFn: () => apiGet<User[]>("/auth/demo-accounts"),
    retry: false,
  });

  const login = useMutation({
    mutationFn: (value: string) => apiPost<User>("/auth/login", { email: value }),
    onSuccess: (user) => {
      beginSession(user);
      toast.success(`G'day ${user.name.split(" ")[0]}, you're signed in`);
      navigate(homePathFor(user.role));
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(detail ?? "Could not sign in. Please check the email address.");
    },
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1668119208053-1545bcc49e4a?crop=entropy&cs=srgb&fm=jpg&w=1200&q=70)",
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-white p-1.5">
              <img src={BRAND_LOGO} alt="Straight Up Training" className="h-full w-full object-contain" />
            </span>
            <span className="font-heading text-xl font-semibold">WorkReady Portal</span>
          </div>
        </div>
        <div className="relative max-w-md">
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight">
            Employability skills built for Australian providers.
          </h1>
          <p className="mt-4 text-sidebar-foreground/80 leading-relaxed">
            One portal for Schools, Workforce Australia, Transition to Work (TtW) and Disability
            Employment Services (DES) — Core Skills for Work training, AI interview practice and
            Mutual Obligation evidence in one place.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-sidebar-foreground/75">
            <li>• Points-Based Activation System (PBAS) job search logging</li>
            <li>• AI Interview Simulator with a readiness scorecard</li>
            <li>• One-click compliance exports for case managers</li>
          </ul>
        </div>
        <p className="relative text-xs text-sidebar-foreground/60">
          Demo environment — sample jobseeker data only.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h2 className="font-heading text-3xl font-bold tracking-tight">Sign in</h2>
          <p className="text-muted-foreground mt-2">
            Choose a demo account below, or enter a registered email address.
          </p>

          <div className="mt-6 space-y-3">
            {(demo.data ?? []).map((user) => {
              const meta = ROLE_META[user.role];
              const Icon = meta.icon;
              return (
                <Card
                  key={user.id}
                  className="cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                  onClick={() => login.mutate(user.email)}
                  data-testid={`demo-login-${user.role}`}
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight">
                        {user.name} <span className="text-muted-foreground font-normal">· {meta.label}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">{meta.blurb}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">{user.email}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {demo.isError && (
              <p className="text-sm text-muted-foreground" data-testid="demo-accounts-unavailable">
                Demo accounts are unavailable right now — enter an email below to sign in.
              </p>
            )}
          </div>

          <form
            className="mt-8 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) login.mutate(email.trim());
            }}
          >
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="sarah@demo.au"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="login-email-input"
            />
            <Button
              type="submit"
              className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
              disabled={login.isPending}
              data-testid="login-submit-button"
            >
              {login.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
