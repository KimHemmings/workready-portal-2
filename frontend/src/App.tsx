import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
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
import { getSessionUser, homePathFor } from "@/lib/session";
import type { Role } from "@/lib/types";

function Protected({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const user = getSessionUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={homePathFor(user.role)} replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const user = getSessionUser();
  return <Navigate to={user ? homePathFor(user.role) : "/login"} replace />;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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

        <Route path="*" element={<RootRedirect />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
