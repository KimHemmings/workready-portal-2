import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { beginSession, homePathFor } from "@/lib/session";
import type { User } from "@/lib/types";

// Demo users setup for 1-click & explicit login matching credentials
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

    if (foundUser && password === "password") {
      beginSession(foundUser);
      queryClient.clear();
      navigate(homePathFor(foundUser.role));
      return;
    }

    if (!foundUser) {
      setError("Unknown user email. Try alex@workready.com.au, casey@workready.com.au, or bessy@workready.com.au");
    } else {
      setError("Invalid password. Please use 'password'.");
    }
  };

  const loginAs = (userEmail: string) => {
    const targetUser = DEMO_USERS[userEmail];
    if (targetUser) {
      beginSession(targetUser);
      queryClient.clear();
      navigate(homePathFor(targetUser.role));
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#24083b] p-4">
      {/* Visual background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#24083b] via-[#320c52] to-[#16a34a]/20 opacity-90" />

      <Card className="relative w-full max-w-md bg-white/95 backdrop-blur shadow-2xl border-t-4 border-t-[#16a34a] border-slate-100 z-10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 font-mono text-xs font-bold uppercase tracking-widest text-[#16a34a]">
            Workready Portal
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 font-heading">Sign In</CardTitle>
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
                placeholder="name@workready.com.au"
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
              Sign In
            </Button>
          </form>

          {/* Quick Demo Login Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loginAs("alex@workready.com.au")}
                className="text-xs font-semibold border-slate-300 hover:border-[#16a34a] hover:text-[#16a34a]"
              >
                Alex (Candidate)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loginAs("casey@workready.com.au")}
                className="text-xs font-semibold border-slate-300 hover:border-[#24083b] hover:text-[#24083b]"
              >
                Casey (Coach)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => loginAs("bessy@workready.com.au")}
                className="text-xs font-semibold border-slate-300 hover:border-[#16a34a] hover:text-[#16a34a]"
              >
                Bessy (Owner)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
