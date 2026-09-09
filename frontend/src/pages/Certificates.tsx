import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, Eye, MessagesSquare, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppShell from "@/components/AppShell";
import CertificateModal, { formatIssued } from "@/components/CertificateModal";
import { apiGet } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import type { Certificate, Organization } from "@/lib/types";

export default function Certificates() {
  const user = getSessionUser();
  const [active, setActive] = useState<Certificate | null>(null);

  const certs = useQuery({
    queryKey: ["certificates", user?.id],
    queryFn: () => apiGet<Certificate[]>(`/participants/${user!.id}/certificates`),
    enabled: Boolean(user),
  });

  // Live provider branding so certificates always carry the current logo.
  const org = useQuery({
    queryKey: ["organization", user?.organization_id],
    queryFn: () => apiGet<Organization>(`/organizations/${user!.organization_id}`),
    enabled: Boolean(user?.organization_id),
  });

  const list = certs.isError ? [] : (certs.data ?? []);

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider font-semibold text-brand-purple font-mono">
          Your achievements
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mt-1">
          Certificates
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          You earn a certificate when you finish every module in a skills category, or score over 70%
          in an AI mock interview. Download a print-ready PDF to attach to your job applications.
        </p>
      </header>

      {list.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-10 w-10 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
            <p className="font-semibold font-heading text-lg">No certificates just yet</p>
            <p className="text-muted-foreground text-sm mt-1" data-testid="certificates-empty">
              Complete all the modules in a category, or score over 70% in a mock interview, and your
              certificate will appear here automatically.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="certificates-grid">
          {list.map((cert) => {
            const isInterview = cert.kind === "interview";
            const Icon = isInterview ? MessagesSquare : ShieldCheck;
            return (
              <Card
                key={cert.id}
                className="relative overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                data-testid={`certificate-card-${cert.certificate_id}`}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ background: "linear-gradient(90deg,#1E3A8A,#7C3AED,#F97316)" }}
                  aria-hidden="true"
                />
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-purple-soft text-brand-purple">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    {cert.score != null && (
                      <Badge className="bg-success text-success-foreground">{cert.score}%</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base mt-3 leading-snug">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{cert.subtitle}</p>
                  <dl className="mt-4 space-y-1 text-xs">
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Issued</dt>
                      <dd className="font-medium">{formatIssued(cert.issued_at)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Certificate ID</dt>
                      <dd className="font-mono font-medium">{cert.certificate_id}</dd>
                    </div>
                  </dl>
                  <Button
                    className="w-full mt-4 bg-cta text-cta-foreground hover:bg-cta/90"
                    onClick={() => setActive(cert)}
                    data-testid={`view-certificate-${cert.certificate_id}`}
                  >
                    <Eye className="h-4 w-4 mr-1.5" aria-hidden="true" /> View & download
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {active && (
        <CertificateModal
          certificate={active}
          open
          onClose={() => setActive(null)}
          logo={org.data?.branding_logo || undefined}
        />
      )}
    </AppShell>
  );
}
