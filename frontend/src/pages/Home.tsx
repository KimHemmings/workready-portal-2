import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { beginSession, homePathFor } from "@/lib/session";
import type { User } from "@/lib/types";

const DEMO_USERS: Record<string, User> = {
  "alex@workready.com.au": {
    id: "demo-part-1",
    email: "alex@workready.com.au",
    name: "Alex Johnson",
    role: "participant",
    organization_id: "org-1",
    phone: "0400 000 000",
    status: "active",
    coach_id: "coach-1",
    avatar_url: "",
    job_seeker_id: "JS-99821",
    pbas_target: 100
  } as unknown as User,
  "casey@workready.com.au": {
    id: "demo-coach-1",
    email: "casey@workready.com.au",
    name: "Casey Miller",
    role: "coach",
    organization_id: "org-1",
    phone: "0411 111 111",
    status: "active"
  } as unknown as User,
  "bessy@workready.com.au": {
    id: "demo-owner-1",
    email: "bessy@workready.com.au",
    name: "Bessy Vance",
    role: "owner",
    organization_id: "org-1",
    phone: "0422 222 222",
    status: "active"
  } as unknown as User,
  "admin@straightuptraining.com": {
    id: "demo-admin-1",
    email: "admin@straightuptraining.com",
    name: "System Admin",
    role: "owner",
    organization_id: "org-1",
    phone: "0433 333 333",
    status: "active"
  } as unknown as User
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const targetEmail = email.trim().toLowerCase();
    const foundUser = DEMO_USERS[targetEmail];

    if (foundUser && (password === "password" || password.length > 0)) {
      beginSession(foundUser);
      queryClient.clear();
      navigate(homePathFor(foundUser.role));
      return;
    }

    if (!foundUser) {
      setError("Invalid email address or user not found.");
    } else {
      setError("Invalid password. Please enter the correct password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#24083b] text-white flex flex-col justify-between selection:bg-[#16a34a] selection:text-white">
      {/* Top Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#16a34a] flex items-center justify-center font-bold text-xl shadow-lg shadow-green-900/40">
            W
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-white">
            Workready <span className="text-[#16a34a]">Portal</span>
          </span>
        </div>
        <div className="text-xs font-mono bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 text-slate-300">
          v2.0
        </div>
      </header>

      {/* Main Content Body */}
      <main className="container mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16a34a]/20 border border-[#16a34a]/40 text-[#16a34a] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Core Skills & AI Career Tools
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Empowering Jobseekers <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              With Smart AI Support
            </span>
          </h1>

          <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
            Practice realistic interviews, build tailored resumes, manage mutual obligation PBAS points, and streamline caseload coaching in one portal.
          </p>

          <div className="pt-4 grid sm:grid-cols-3 gap-4 text-sm font-medium text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> AI Interview Prep
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Smart Resume Builder
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#16a34a]" /> Caseload Dashboard
            </div>
          </div>
        </div>

        {/* Right Login Card Column */}
        <div className="lg:col-span-5">
          <Card className="bg-white/95 backdrop-blur shadow-2xl border-t-4 border-t-[#16a34a] border-slate-100 text-slate-900">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#16a34a]">
                Workready Workspace
              </div>
              <CardTitle className="text-2xl font-bold font-heading text-slate-900">Sign In</CardTitle>
              <CardDescription className="text-slate-600">
                Access your Workready workspace
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md font-medium">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email address</label>
                  <Input
                    type="email"
                    placeholder="alex@workready.com.au"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-slate-300"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#16a34a] hover:bg-green-700 text-white font-bold py-2">
                  Sign In <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-6 text-center text-xs text-slate-400 border-t border-white/10">
        © 2026 Straight Up Training · Workready Portal
      </footer>
    </div>
  );
}
