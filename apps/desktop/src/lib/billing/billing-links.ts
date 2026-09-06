export interface DesktopBillingLinks {
  billingPageUrl: string;
  addCreditsUrl: string;
  upgradeUrl: string;
  usageUrl: string;
}

export const HITECHCLOUDOS_HOME_URL = "https://www.hitechcloud.vn";

export function normalizeBaseUrl(value: string | null | undefined): string {
  return (value ?? "").replace(/\/+$/u, "");
}

export function deriveAppBaseUrl(apiBaseUrl: string): string {
  if (!apiBaseUrl) {
    return HITECHCLOUDOS_HOME_URL;
  }
  try {
    const parsed = new URL(apiBaseUrl);
    if (parsed.hostname === "localhost" && parsed.port === "4000") {
      parsed.port = "4321";
      return parsed.origin;
    }
    if (parsed.hostname.startsWith("api-preview.")) {
      parsed.hostname = parsed.hostname.replace(/^api-preview\./u, "preview.");
      return parsed.origin;
    }
    if (parsed.hostname === "api.hitechcloud.vn") {
      // hitechcloud.vn's web app is served from www., not app. (the app. subdomain
      // is unused). Other api.* hosts (e.g. api.hitechcloud.vn, api.imerchstaging.com)
      // still pair with app.* per their deploy layouts.
      parsed.hostname = "www.hitechcloud.vn";
      return parsed.origin;
    }
    if (parsed.hostname.startsWith("api.")) {
      parsed.hostname = parsed.hostname.replace(/^api\./u, "app.");
      return parsed.origin;
    }
    return parsed.origin;
  } catch {
    return HITECHCLOUDOS_HOME_URL;
  }
}

export function buildDesktopBillingLinks(appBaseUrl: string): DesktopBillingLinks {
  const normalizedBaseUrl = normalizeBaseUrl(appBaseUrl) || HITECHCLOUDOS_HOME_URL;
  return {
    billingPageUrl: `${normalizedBaseUrl}/app/settings?tab=billing`,
    addCreditsUrl: `${normalizedBaseUrl}/app/settings?tab=billing&intent=add-credits`,
    upgradeUrl: `${normalizedBaseUrl}/app/settings?tab=billing&intent=upgrade`,
    usageUrl: `${normalizedBaseUrl}/app/settings?tab=billing&intent=usage`,
  };
}
