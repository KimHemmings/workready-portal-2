import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Lock, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { BRAND_LOGO } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, ApiError } from "@/lib/api";
import { beginSession, homePathFor } from "@/lib/session";
import type { User } from "@/lib/types";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: () =>
      apiPost<User>("/auth/login", { email: email.trim(), password }),
    onSuccess: (user) => {
      beginSession(user);
      toast.success(`G'day ${user.name.split(" ")[0]}, you're signed in`);
      navigate(homePathFor(user.role));
    },
    onError: (err) => {
      const detail = err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : null;
      toast.error(detail ?? "Could not sign in. Please check your email and password.");
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
            <span className="font-heading text-xl font-semibold">Straight Up Training</span>
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

          <h2 className="font-heading text-3xl font-bold tracking-tight">Sign in</h2>
          <p className="text-muted-foreground mt-2">
            Use the email and password issued for your site.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim() || !password) {
                toast.error("Please enter your email and password.");
                return;
              }
              login.mutate();
            }}
            data-testid="login-form"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="pl-9"
                  placeholder="you@yoursite.com.au"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="login-email-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="login-password-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
              disabled={login.isPending}
              data-testid="login-submit-button"
            >
              <LogIn className="h-4 w-4 mr-1.5" aria-hidden="true" />
              {login.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground text-center" data-testid="signup-prompt">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              data-testid="signup-link"
            >
              Sign Up
            </Link>
          </p>

          <footer
            className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
            data-testid="login-footer"
          >
            <Link
              to="/privacy"
              className="hover:text-foreground underline-offset-4 hover:underline"
              data-testid="privacy-policy-link"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              to="/terms"
              className="hover:text-foreground underline-offset-4 hover:underline"
              data-testid="terms-of-use-link"
            >
              Terms of Use
            </Link>
            <span aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()} Straight Up Training</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
