// Vector PDF export for saved resumes and cover letters (jsPDF text drawing — no DOM
// rasterisation, which cannot parse Tailwind v4 colour functions).
import jsPDF from "jspdf";

const NAVY = "#1E3A8A";
const DARK = "#0F172A";

/** Render lightweight markdown (headings, bullets, bold-ish lines) as a paginated A4 PDF. */
export function downloadMarkdownPdf(filename: string, title: string, markdown: string) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const margin = 56;
  const maxWidth = W - margin * 2;
  let y = margin;

  const newPageIfNeeded = (lineHeight: number) => {
    if (y + lineHeight > H - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(NAVY);
  pdf.text(title, margin, y);
  y += 26;

  for (const raw of markdown.split("\n")) {
    const line = raw.replace(/\*\*/g, "").trimEnd();
    if (!line.trim()) {
      y += 8;
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);

    if (heading) {
      const level = heading[1].length;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(level <= 1 ? 15 : level === 2 ? 13 : 11.5);
      pdf.setTextColor(NAVY);
      const wrapped = pdf.splitTextToSize(heading[2], maxWidth) as string[];
      for (const w of wrapped) {
        newPageIfNeeded(20);
        pdf.text(w, margin, y);
        y += 19;
      }
      y += 3;
      continue;
    }

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.5);
    pdf.setTextColor(DARK);
    const text = bullet ? `•  ${bullet[1]}` : line;
    const indent = bullet ? margin + 10 : margin;
    const wrapped = pdf.splitTextToSize(text, maxWidth - (bullet ? 10 : 0)) as string[];
    for (const w of wrapped) {
      newPageIfNeeded(16);
      pdf.text(w, indent, y);
      y += 15;
    }
  }

  pdf.save(filename);
}
