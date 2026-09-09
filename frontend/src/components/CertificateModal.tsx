import { useState } from "react";
import { Award, Download, X } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BRAND_LOGO } from "@/lib/brand";
import type { Certificate } from "@/lib/types";

type Props = {
  certificate: Certificate;
  open: boolean;
  onClose: () => void;
};

export function formatIssued(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Landscape certificate artwork. Rendered on screen and captured for the PDF. */
export function CertificateArtwork({
  certificate,
}: {
  certificate: Certificate;
}) {
  const kindLabel =
    certificate.kind === "interview" ? "Interview Readiness" : "Skills Category Completion";

  return (
    <div
      data-testid="certificate-artwork"
      style={{ width: 1000, aspectRatio: "1.414 / 1", backgroundColor: "#FFFFFF" }}
      className="relative shrink-0 overflow-hidden"
    >
      {/* Decorative navy frame with purple inner rule */}
      <div className="absolute inset-0" style={{ backgroundColor: "#1E3A8A" }} />
      <div className="absolute" style={{ inset: 14, backgroundColor: "#FFFFFF" }} />
      <div
        className="absolute"
        style={{ inset: 24, border: "3px solid #7C3AED", borderRadius: 6 }}
      />
      {/* Corner flourishes */}
      {[
        { top: 34, left: 34 },
        { top: 34, right: 34 },
        { bottom: 34, left: 34 },
        { bottom: 34, right: 34 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{ ...pos, width: 46, height: 46, border: "4px solid #F97316", opacity: 0.85 }}
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-24 text-center">
        <img
          src={BRAND_LOGO}
          alt=""
          crossOrigin="anonymous"
          style={{ height: 72, objectFit: "contain", marginBottom: 8 }}
        />
        <p
          style={{ color: "#7C3AED", letterSpacing: "0.32em", fontSize: 13, fontWeight: 700 }}
          className="uppercase"
        >
          {certificate.organization_name}
        </p>

        <h1
          style={{ color: "#1E3A8A", fontSize: 52, lineHeight: 1.1, marginTop: 14 }}
          className="font-heading font-bold"
        >
          Certificate of Completion
        </h1>
        <div style={{ width: 120, height: 4, backgroundColor: "#F97316", margin: "18px 0 22px" }} />

        <p style={{ color: "#475569", fontSize: 16 }}>This certificate is proudly presented to</p>
        <p
          style={{ color: "#0F172A", fontSize: 42, marginTop: 8 }}
          className="font-heading font-bold"
          data-testid="certificate-participant-name"
        >
          {certificate.participant_name}
        </p>

        <p style={{ color: "#475569", fontSize: 16, marginTop: 18, maxWidth: 620 }}>
          for demonstrating the Australian Core Skills for Work through
        </p>
        <p
          style={{ color: "#7C3AED", fontSize: 26, marginTop: 6 }}
          className="font-heading font-semibold"
          data-testid="certificate-title"
        >
          {certificate.title}
        </p>
        {certificate.subtitle && (
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 6, maxWidth: 640 }}>
            {certificate.subtitle}
          </p>
        )}
        {certificate.score != null && (
          <p
            style={{
              marginTop: 14,
              backgroundColor: "#ECFDF5",
              color: "#047857",
              border: "1.5px solid #10B981",
              borderRadius: 999,
              padding: "6px 18px",
              fontSize: 15,
              fontWeight: 700,
            }}
            data-testid="certificate-score"
          >
            Achieved {certificate.score}%
          </p>
        )}

        <div
          style={{ marginTop: 34, width: "100%", maxWidth: 760 }}
          className="flex items-end justify-between"
        >
          <div style={{ textAlign: "left" }}>
            <p style={{ color: "#0F172A", fontSize: 15, fontWeight: 700 }}>
              {formatIssued(certificate.issued_at)}
            </p>
            <div style={{ width: 170, height: 1.5, backgroundColor: "#CBD5E1", margin: "6px 0" }} />
            <p style={{ color: "#64748B", fontSize: 11, letterSpacing: "0.14em" }} className="uppercase">
              Date of completion
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#64748B", fontSize: 10, letterSpacing: "0.18em" }} className="uppercase">
              Certificate ID
            </p>
            <p
              style={{ color: "#1E3A8A", fontSize: 15, fontWeight: 700, fontFamily: "monospace" }}
              data-testid="certificate-id"
            >
              {certificate.certificate_id}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#0F172A", fontSize: 15, fontWeight: 700 }}>{kindLabel}</p>
            <div style={{ width: 170, height: 1.5, backgroundColor: "#CBD5E1", margin: "6px 0 6px auto" }} />
            <p style={{ color: "#64748B", fontSize: 11, letterSpacing: "0.14em" }} className="uppercase">
              Awarded for
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Load the provider logo as a data URL so jsPDF can embed it. */
async function loadLogo(): Promise<{ data: string; ratio: number } | null> {
  try {
    const res = await fetch(BRAND_LOGO, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const ratio = await new Promise<number>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth / img.naturalHeight || 1);
      img.onerror = () => resolve(1);
      img.src = data;
    });
    return { data, ratio };
  } catch {
    return null;
  }
}

/**
 * Draw the certificate as true vector content with jsPDF.
 * Vector text stays crisp at any print size, and it avoids DOM rasterisation
 * (html2canvas cannot parse Tailwind v4's modern colour functions).
 */
export async function downloadCertificatePdf(certificate: Certificate): Promise<void> {
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const cx = W / 2;

  const NAVY = "#1E3A8A";
  const PURPLE = "#7C3AED";
  const ORANGE = "#F97316";
  const SLATE = "#475569";
  const DARK = "#0F172A";

  // Frame: navy bleed, white field, purple inner rule
  pdf.setFillColor(NAVY);
  pdf.rect(0, 0, W, H, "F");
  pdf.setFillColor("#FFFFFF");
  pdf.rect(12, 12, W - 24, H - 24, "F");
  pdf.setDrawColor(PURPLE);
  pdf.setLineWidth(2.5);
  pdf.rect(24, 24, W - 48, H - 48, "S");

  // Orange corner flourishes
  pdf.setDrawColor(ORANGE);
  pdf.setLineWidth(3);
  const c = 30;
  [
    [34, 34],
    [W - 34 - c, 34],
    [34, H - 34 - c],
    [W - 34 - c, H - 34 - c],
  ].forEach(([x, y]) => pdf.rect(x, y, c, c, "S"));

  // Provider logo
  const logo = await loadLogo();
  let y = 74;
  if (logo) {
    const h = 44;
    const w = Math.min(h * logo.ratio, 200);
    try {
      pdf.addImage(logo.data, "PNG", cx - w / 2, y - h + 10, w, h);
    } catch {
      /* logo is decorative — carry on without it */
    }
  }

  // Organisation
  y = 108;
  pdf.setTextColor(PURPLE);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setCharSpace(3);
  pdf.text(certificate.organization_name.toUpperCase(), cx, y, { align: "center" });
  pdf.setCharSpace(0);

  // Heading
  y = 158;
  pdf.setTextColor(NAVY);
  pdf.setFontSize(34);
  pdf.text("Certificate of Completion", cx, y, { align: "center" });

  pdf.setFillColor(ORANGE);
  pdf.rect(cx - 45, y + 16, 90, 3.5, "F");

  // Recipient
  y = 212;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(SLATE);
  pdf.text("This certificate is proudly presented to", cx, y, { align: "center" });

  y = 250;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor(DARK);
  pdf.text(certificate.participant_name, cx, y, { align: "center" });

  // Achievement
  y = 282;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10.5);
  pdf.setTextColor(SLATE);
  pdf.text("for demonstrating the Australian Core Skills for Work through", cx, y, {
    align: "center",
  });

  y = 310;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.setTextColor(PURPLE);
  pdf.text(certificate.title, cx, y, { align: "center" });

  if (certificate.subtitle) {
    y = 330;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor("#64748B");
    pdf.text(pdf.splitTextToSize(certificate.subtitle, W - 260), cx, y, { align: "center" });
  }

  // Score pill
  if (certificate.score != null) {
    const label = `Achieved ${certificate.score}%`;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    const tw = pdf.getTextWidth(label);
    const pw = tw + 30;
    const py = 350;
    pdf.setFillColor("#ECFDF5");
    pdf.setDrawColor("#10B981");
    pdf.setLineWidth(1.2);
    pdf.roundedRect(cx - pw / 2, py, pw, 24, 12, 12, "FD");
    pdf.setTextColor("#047857");
    pdf.text(label, cx, py + 16, { align: "center" });
  }

  // Verification note
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.setTextColor("#94A3B8");
  pdf.text(
    "This certificate verifies completion of employability skills training aligned to the Australian Core Skills for Work.",
    cx,
    414,
    { align: "center" },
  );

  // Footer: date | certificate ID | awarded for
  const fy = H - 108;
  const left = 96;
  const right = W - 96;
  const kindLabel =
    certificate.kind === "interview" ? "Interview Readiness" : "Skills Category Completion";

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(DARK);
  pdf.text(formatIssued(certificate.issued_at), left, fy);
  pdf.text(kindLabel, right, fy, { align: "right" });

  pdf.setDrawColor("#CBD5E1");
  pdf.setLineWidth(1);
  pdf.line(left, fy + 8, left + 150, fy + 8);
  pdf.line(right - 150, fy + 8, right, fy + 8);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor("#64748B");
  pdf.setCharSpace(1.2);
  pdf.text("DATE OF COMPLETION", left, fy + 22);
  pdf.text("AWARDED FOR", right, fy + 22, { align: "right" });

  pdf.text("CERTIFICATE ID", cx, fy - 4, { align: "center" });
  pdf.setCharSpace(0);
  pdf.setFont("courier", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(NAVY);
  pdf.text(certificate.certificate_id, cx, fy + 14, { align: "center" });

  pdf.save(`${certificate.certificate_id}-${certificate.participant_name.replace(/\s+/g, "-")}.pdf`);
}

export default function CertificateModal({ certificate, open, onClose }: Props) {
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const handleDownload = async () => {
    setBusy(true);
    try {
      await downloadCertificatePdf(certificate);
      toast.success("Certificate PDF downloaded.");
    } catch {
      toast.error("Could not generate the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Certificate ${certificate.certificate_id}`}
      data-testid="certificate-modal"
      onClick={onClose}
    >
      <div className="w-full max-w-5xl my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-white font-heading text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-[color:var(--cta)]" aria-hidden="true" />
            {certificate.title}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              disabled={busy}
              className="bg-cta text-cta-foreground hover:bg-cta/90"
              data-testid="download-certificate-pdf-button"
            >
              <Download className="h-4 w-4 mr-1.5" aria-hidden="true" />
              {busy ? "Preparing PDF…" : "Download PDF Certificate"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              data-testid="close-certificate-modal-button"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Close certificate</span>
            </Button>
          </div>
        </div>

        {/* Full-size artwork keeps the preview faithful to the PDF; scrolls when the viewport is smaller. */}
        <div className="bg-white rounded-lg shadow-2xl overflow-auto max-h-[72vh]">
          <CertificateArtwork certificate={certificate} />
        </div>
        <p className="text-white/60 text-xs mt-2 text-center">
          Preview shown at full size — scroll to see the whole certificate, or download the print-ready PDF.
        </p>
      </div>
    </div>
  );
}
