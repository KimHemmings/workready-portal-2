export interface ProviderBrandConfig {
  providerName: string;
  secondaryColor: string;
  logoDataUrl: string | null;
  disclaimerText: string;
}

const BRAND_STORAGE_KEY = 'workready_provider_brand';

export const DEFAULT_BRAND_CONFIG: ProviderBrandConfig = {
  providerName: "Co-Branded Provider Partner",
  secondaryColor: "#FFB74D",
  logoDataUrl: null,
  disclaimerText: "Straight Up Training Shell & Co-Branded Provider Licensee",
};

export const BRAND_CONFIG = {
  name: "WorkReady Portal",
  tagline: "Australian Employment Services Workspace",
  colors: {
    primaryEnterprise: "#24083b",
    primaryAccent: "#16a34a",
    navy: "#0f172a",
    slateBackground: "#f8fafc",
    slateBorder: "#e2e8f0",
  },
  contractsSupported: [
    "Workforce Australia",
    "Transition to Work (TtW)",
    "Disability Employment Services (DES)"
  ],
  logo: {
    src: "/logo.png",
    alt: "WorkReady Portal Logo"
  }
};

export const BRAND_LOGO = "/logo.png";

export const getProviderBrandConfig = (): ProviderBrandConfig => {
  try {
    const raw = localStorage.getItem(BRAND_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading provider brand config:", e);
  }
  return DEFAULT_BRAND_CONFIG;
};

export const saveProviderBrandConfig = (config: ProviderBrandConfig): void => {
  localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(config));
};
