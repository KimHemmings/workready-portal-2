// public/js/pdfExporter.js
// Dedicated Client-Side PDF Generation Engine using html2pdf.js

window.generatePdfFromElement = async function(elementId, filename, isLandscape = false) {
  const element = document.getElementById(elementId);
  if (!element) {
    alert(`Export target element '#${elementId}' not found.`);
    return;
  }

  const opt = {
    margin:       [0.3, 0.3, 0.3, 0.3],
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: 0 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error("PDF Generation Error:", err);
    alert("Could not generate PDF. Please ensure images and styles are fully loaded.");
  }
};

window.downloadInterviewPDF = function() {
  window.generatePdfFromElement('interview-pdf-target', 'STAR_Interview_Report.pdf');
};

window.downloadResumePDF = function() {
  window.generatePdfFromElement('resume-document-template', 'Professional_Resume.pdf');
};

window.downloadCoverLetterPDF = function() {
  window.generatePdfFromElement('cover-letter-document-template', 'Tailored_Cover_Letter.pdf');
};

window.downloadCertificatePDF = function() {
  window.generatePdfFromElement('certificate-pdf-element', 'WorkReady_Compliance_Certificate.pdf', true);
};