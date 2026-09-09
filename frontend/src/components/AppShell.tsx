import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Award,
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Users,
} from "lucide-react";
import { BRAND_LOGO } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { endSession, getSessionUser } from "@/lib/session";
import type { User } from "@/lib/types";

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const NAV: Record<User["role"], NavItem[]> = {
  participant: [
    { to: "/participant", label: "Overview", icon: LayoutDashboard },
    { to: "/participant/learning", label: "Learning Centre", icon: BookOpen },
    { to: "/participant/interview", label: "AI Interview", icon: MessagesSquare },
    { to: "/participant/resume", label: "Resume Builder", icon: FileText },
    { to: "/participant/job-logs", label: "Job Search Log", icon: ClipboardList },
    { to: "/participant/certificates", label: "Certificates", icon: Award },
  ],
  coach: [
    { to: "/coach", label: "Jobseeker Roster", icon: Users },
    { to: "/participant/learning", label: "Learning Centre", icon: BookOpen },
  ],
  admin: [
    { to: "/admin", label: "Provider Analytics", icon: BarChart3 },
  ],
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const items = user ? NAV[user.role] : [];

  const roleLabel =
    user?.role === "coach" ? "Case Manager" : user?.role === "admin" ? "Provider Admin" : "Jobseeker";

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <aside className="lg:w-64 shrink-0 bg-sidebar text-sidebar-foreground lg:min-h-screen">
        <div className="p-5 flex items-center justify-between lg:block">
          <Link to={user ? "/" : "/login"} className="flex items-center gap-2.5" data-testid="brand-home-link">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white p-1">
              <img src={BRAND_LOGO} alt="Straight Up Training" className="h-full w-full object-contain" />
            </span>
            <span className="font-heading text-lg font-semibold leading-tight">
              WorkReady<span className="text-sidebar-primary"> Portal</span>
            </span>
          </Link>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => {
                endSession(qc);
                navigate("/login");
              }}
              data-testid="sign-out-button-mobile"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        <nav className="px-3 pb-4 flex lg:flex-col gap-1 overflow-x-auto" aria-label="Main navigation">
          {items.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-testid={`nav-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-border"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="hidden lg:block mt-auto p-4 border-t border-sidebar-border">
            <p className="text-sm font-semibold" data-testid="session-user-name">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-foreground/70 mb-3">{roleLabel}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => {
                endSession(qc);
                navigate("/login");
              }}
              data-testid="sign-out-button"
            >
              <LogOut className="h-4 w-4 mr-1.5" aria-hidden="true" /> Sign out
            </Button>
          </div>
        )}
      </aside>

      <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="max-w-6xl mx-auto wr-rise">{children}</div>
      </main>
    </div>
  );
}
