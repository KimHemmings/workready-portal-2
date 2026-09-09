import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import { BRAND_LOGO } from "@/lib/brand";
import { Button } from "@/components/ui/button";

const CONTENT = {
  privacy: {
    title: "Privacy Policy",
    icon: ShieldCheck,
    intro:
      "This is a placeholder Privacy Policy for Straight Up Training. Replace this text with your organisation's policy before going live.",
    sections: [
      {
        heading: "What we collect",
        body: "Your name, email, training progress, quiz results, saved resumes, interview transcripts and job search evidence recorded for Mutual Obligation reporting.",
      },
      {
        heading: "Voice recording",
        body: "Voice input for AI interview practice is processed by your browser's speech recognition to turn speech into text. Recording only starts after you give consent, and you can decline and type your answers instead.",
      },
      {
        heading: "Who can see your data",
        body: "Only staff inside your own organisation — your assigned case manager and your provider admin. Data is isolated per organisation.",
      },
      {
        heading: "Retention",
        body: "Accounts with no sign-in for 60 days are archived in line with data retention practice. Contact your provider to have an archived account reactivated.",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    icon: FileText,
    intro:
      "These are placeholder Terms of Use for Straight Up Training. Replace this text with your organisation's terms before going live.",
    sections: [
      {
        heading: "Your account",
        body: "Accounts are issued to a single person. Keep your password confidential and do not share access with anyone else.",
      },
      {
        heading: "Fair use of AI features",
        body: "AI practice interviews, resumes and cover letters are capped each calendar month per account. Your case manager may grant additional sessions.",
      },
      {
        heading: "Accurate records",
        body: "Job search activity you log may be used for Mutual Obligation reporting. Recording activity you did not complete may affect your payments.",
      },
      {
        heading: "Availability",
        body: "The service is provided on an as-is basis while your organisation holds an active site licence.",
      },
    ],
  },
} as const;

export default function LegalPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const key = pathname.includes("terms") ? "terms" : "privacy";
  const doc = CONTENT[key];
  const Icon = doc.icon;

  return (
    <div className="min-h-screen bg-muted/30 px-6 py-12" data-testid={`legal-page-${key}`}>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white shadow-sm p-1.5">
            <img src={BRAND_LOGO} alt="Straight Up Training" className="h-full w-full object-contain" />
          </span>
          <span className="font-heading text-lg font-semibold">Straight Up Training</span>
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight mt-8 flex items-center gap-2">
          <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
          {doc.title}
        </h1>
        <p className="text-muted-foreground mt-3" data-testid="legal-intro">
          {doc.intro}
        </p>

        <div className="mt-8 space-y-6">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-lg font-semibold">{section.heading}</h2>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-10"
          onClick={() => navigate("/login")}
          data-testid="legal-back-button"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" /> Back to sign in
        </Button>
      </div>
    </div>
  );
}
