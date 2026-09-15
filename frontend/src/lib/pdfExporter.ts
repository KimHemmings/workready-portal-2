// Dedicated Client-Side PDF Exporter Module

declare const html2pdf: any;

export const generatePdfFromElement = async (
  elementId: string,
  filename: string,
  isLandscape = false
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert(`Export target element '#${elementId}' not found.`);
    return;
  }

  // Fallback to window printing if html2pdf library script is not loaded
  if (typeof html2pdf === 'undefined') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to export PDFs via browser print mode.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #0f172a; line-height: 1.5; }
            @page { size: ${isLandscape ? 'landscape' : 'portrait'}; margin: 0.5in; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    return;
  }

  const opt = {
    margin: [0.3, 0.3, 0.3, 0.3],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
    jsPDF: { unit: 'in', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error("PDF Generation Error:", err);
    alert("Could not generate PDF directly. Switching to browser print engine.");
  }
};

export const downloadInterviewPDF = () =>
  generatePdfFromElement('interview-report-template', 'STAR_Interview_Report.pdf');

export const downloadResumePDF = () =>
  generatePdfFromElement('resume-document-template', 'Professional_Resume.pdf');

export const downloadCoverLetterPDF = () =>
  generatePdfFromElement('cover-letter-document-template', 'Tailored_Cover_Letter.pdf');

export const downloadCertificatePDF = () =>
  generatePdfFromElement('certificate-pdf-element', 'WorkReady_Compliance_Certificate.pdf', true);
