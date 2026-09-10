import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ChangePassword from "@/pages/ChangePassword";
import LegalPage from "@/pages/LegalPage";
import ParticipantHome from "@/pages/ParticipantHome";
import Learning from "@/pages/Learning";
import ModuleDetail from "@/pages/ModuleDetail";
import Interview from "@/pages/Interview";
import ResumeBuilder from "@/pages/ResumeBuilder";
import JobLogs from "@/pages/JobLogs";
import Certificates from "@/pages/Certificates";
import CoachDashboard from "@/pages/CoachDashboard";
import CoachParticipant from "@/pages/CoachParticipant";
import AdminDashboard from "@/pages/AdminDashboard";
import OwnerDashboard from "@/pages/OwnerDashboard";
import Evidence from "@/pages/Evidence";
import { getSessionUser, homePathFor } from "@/lib/session";
import { useSessionValidation } from "@/lib/useSessionValidation";
import type { Role } from "@/lib/types";

function Protected({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const user = getSessionUser();
  if (!user) return <Navigate to="/login" replace />;
  // A temporary password must be replaced before any dashboard is reachable.
  if (user.must_change_password) return <Navigate to="/change-password" replace />;
  if (!roles.includes(user.role)) return <Navigate to={homePathFor(user.role)} replace />;
  return <>{children}</>;
}

function RequireSession({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  // Any stored session is checked against the backend before a protected route can render, so a
  // leftover session never auto-signs anyone in on page load.
  const sessionChecked = useSessionValidation();

  if (!sessionChecked) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30" data-testid="session-loading">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Root and /login always render the B2B sign-in form — no public sign-up, no auto-login. */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/change-password"
          element={
            <RequireSession>
              <ChangePassword />
            </RequireSession>
          }
        />
        <Route path="/privacy" element={<LegalPage />} />
        <Route path="/terms" element={<LegalPage />} />
        {/* The onboarding email's /#/accept-invite link lands here; the token form lives on /register. */}
        <Route path="/accept-invite" element={<Navigate to="/register" replace />} />

        <Route
          path="/participant"
          element={
            <Protected roles={["participant"]}>
              <ParticipantHome />
            </Protected>
          }
        />
        <Route
          path="/participant/learning"
          element={
            <Protected roles={["participant", "coach", "admin"]}>
              <Learning />
            </Protected>
          }
        />
        <Route
          path="/participant/modules/:moduleId"
          element={
            <Protected roles={["participant", "coach", "admin"]}>
              <ModuleDetail />
            </Protected>
          }
        />
        <Route
          path="/participant/interview"
          element={
            <Protected roles={["participant"]}>
              <Interview />
            </Protected>
          }
        />
        <Route
          path="/participant/resume"
          element={
            <Protected roles={["participant"]}>
              <ResumeBuilder />
            </Protected>
          }
        />
        <Route
          path="/participant/job-logs"
          element={
            <Protected roles={["participant"]}>
              <JobLogs />
            </Protected>
          }
        />

        <Route
          path="/participant/certificates"
          element={
            <Protected roles={["participant"]}>
              <Certificates />
            </Protected>
          }
        />

        <Route
          path="/coach"
          element={
            <Protected roles={["coach", "admin"]}>
              <CoachDashboard />
            </Protected>
          }
        />
        <Route
          path="/coach/participants/:participantId"
          element={
            <Protected roles={["coach", "admin"]}>
              <CoachParticipant />
            </Protected>
          }
        />

        <Route
          path="/admin"
          element={
            <Protected roles={["admin"]}>
              <AdminDashboard />
            </Protected>
          }
        />

        <Route
          path="/owner"
          element={
            <Protected roles={["owner"]}>
              <OwnerDashboard />
            </Protected>
          }
        />

        <Route
          path="/evidence"
          element={
            <Protected roles={["coach", "admin", "owner"]}>
              <Evidence />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
