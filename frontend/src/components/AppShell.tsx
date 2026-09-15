import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  LogOut,
  User as UserIcon,
  Shield,
  BookOpen,
  FileText,
  Award,
  Briefcase,
  Home,
  CheckSquare,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { BRAND_LOGO } from '../lib/brand';
import { endSession, getImpersonator, getSessionUser, homePathFor, Role } from '../lib/session';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  participant: [
    { label: 'Mutual Obligation Hub', path: '/participant', icon: <Home className="w-4 h-4" /> },
  ],
  coach: [
    { label: 'Participant Roster', path: '/coach', icon: <UserIcon className="w-4 h-4" /> },
  ],
  owner: [
    { label: 'Executive Overview', path: '/owner', icon: <Shield className="w-4 h-4" /> },
  ],
};

interface AppShellProps {
  children?: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const user = getSessionUser();
  const impersonator = getImpersonator();

  const userRole = (user?.role || 'participant') as string;
  const navList = NAV_ITEMS[userRole] || NAV_ITEMS.participant;

  const handleLogout = () => {
    endSession(qc);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Impersonation Warning Banner */}
      {impersonator && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>
              Impersonation Mode Active: Viewing workspace as <strong>{user?.name}</strong> ({user?.role})
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-2.5 py-1 bg-slate-950 text-white text-[11px] rounded-lg font-bold hover:bg-slate-800 transition-all"
          >
            End Impersonation Session
          </button>
        </div>
      )}

      {/* Main Navigation Topbar */}
      <header className="bg-[#24083b] text-white border-b border-purple-900 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-4">
            <Link to={userRole ? homePathFor(userRole as Role) : '/participant'} className="flex items-center gap-2.5">
              <img src="/logo.png" alt="WorkReady Logo" className="h-8 w-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <span className="font-extrabold text-lg tracking-tight text-white font-heading">
                {BRAND_LOGO}
              </span>
            </Link>

            <span className="hidden sm:inline-block text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {userRole.toUpperCase()} PORTAL
            </span>
          </div>

          {/* User Controls & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{user?.name || 'User'}</span>
              <span className="text-[10px] text-slate-300">{user?.email || ''}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 bg-purple-900/50 hover:bg-purple-900 text-slate-200 hover:text-white rounded-xl border border-purple-700/50 transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children || <Outlet />}
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        WorkReady Portal • Workforce Australia & Mutual Obligation Management Engine
      </footer>
    </div>
  );
}
