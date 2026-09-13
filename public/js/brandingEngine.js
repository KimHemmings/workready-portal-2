// public/js/brandingEngine.js
// Business Manager Co-Branding Asset & Dual-Logo Rendering Engine

window.BRANDING_ENGINE = {
  // Active Co-Branding State (Persisted in localStorage)
  brandConfig: JSON.parse(localStorage.getItem('workready_provider_brand') || JSON.stringify({
    providerName: "Co-Branded Provider Partner",
    secondaryColor: "#FFB74D",
    logoDataUrl: null, // Base64 image URL uploaded by Business Manager
    disclaimerText: "Straight Up Training Shell & Co-Branded Provider Licensee"
  })),

  initBranding: function() {
    this.applyDynamicBranding();
  },

  openBrandingModal: function() {
    const modal = document.getElementById('bm-branding-modal');
    if (modal) {
      document.getElementById('bm-brand-name').value = this.brandConfig.providerName;
      document.getElementById('bm-brand-color').value = this.brandConfig.secondaryColor;
      document.getElementById('bm-brand-disclaimer').value = this.brandConfig.disclaimerText;
      modal.classList.remove('hidden');
    }
  },

  closeBrandingModal: function() {
    const modal = document.getElementById('bm-branding-modal');
    if (modal) modal.classList.add('hidden');
  },

  handleLogoUpload: function(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit. Please upload a smaller image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.brandConfig.logoDataUrl = e.target.result;
        const previewEl = document.getElementById('bm-logo-preview');
        if (previewEl) {
          previewEl.src = e.target.result;
          previewEl.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(file);
    }
  },

  saveBrandingConfig: function(e) {
    e.preventDefault();
    this.brandConfig.providerName = document.getElementById('bm-brand-name').value;
    this.brandConfig.secondaryColor = document.getElementById('bm-brand-color').value;
    this.brandConfig.disclaimerText = document.getElementById('bm-brand-disclaimer').value;

    localStorage.setItem('workready_provider_brand', JSON.stringify(this.brandConfig));
    this.applyDynamicBranding();
    this.closeBrandingModal();

    if (window.SYSTEM_ADMIN && window.SYSTEM_ADMIN.logSecurityEvent) {
      window.SYSTEM_ADMIN.logSecurityEvent("Business Manager", "Business Manager", "DUAL_BRANDING_UPDATED", `Updated Co-Branding Assets for ${this.brandConfig.providerName}`);
    }

    alert(`Co-Branding assets updated! Dynamic dual-branding is now active across all Certificates, STAR Reports, and Compliance Dossiers.`);
  },

  applyDynamicBranding: function() {
    // 1. Inject Co-Brand Secondary Logo into PDF Certificate Modal
    const certLogoContainer = document.getElementById('cert-dual-logo-container');
    if (certLogoContainer) {
      if (this.brandConfig.logoDataUrl) {
        certLogoContainer.innerHTML = `
          <img src="/logo.png" alt="Straight Up Training Logo" class="h-12 w-auto object-contain">
          <span class="text-slate-300 font-bold text-lg">|</span>
          <img src="${this.brandConfig.logoDataUrl}" alt="${this.brandConfig.providerName} Logo" class="h-12 w-auto object-contain">
        `;
      } else {
        certLogoContainer.innerHTML = `
          <img src="/logo.png" alt="Straight Up Training Logo" class="h-12 w-auto object-contain">
        `;
      }
    }

    // 2. Update PDF Certificate Provider Disclaimer Text
    const certDisclaimerEl = document.getElementById('cert-provider-disclaimer');
    if (certDisclaimerEl) {
      certDisclaimerEl.innerText = `${this.brandConfig.providerName} • ${this.brandConfig.disclaimerText}`;
    }

    // 3. Inject Co-Brand Secondary Logo into Interview Coach PDF Target
    const rptLogoContainer = document.getElementById('report-dual-logo-container');
    if (rptLogoContainer) {
      if (this.brandConfig.logoDataUrl) {
        rptLogoContainer.innerHTML = `
          <img src="/logo.png" alt="Straight Up Training Logo" class="h-10 w-auto object-contain">
          <span class="text-slate-300 font-bold text-base">|</span>
          <img src="${this.brandConfig.logoDataUrl}" alt="${this.brandConfig.providerName} Logo" class="h-10 w-auto object-contain">
        `;
      } else {
        rptLogoContainer.innerHTML = `
          <img src="/logo.png" alt="Straight Up Training Logo" class="h-10 w-auto object-contain">
        `;
      }
    }

    // 4. Update Header Subtitle
    const headerSubEl = document.getElementById('header-sub-branding');
    if (headerSubEl) {
      headerSubEl.innerText = `Straight Up Training & ${this.brandConfig.providerName}`;
    }
  }
};