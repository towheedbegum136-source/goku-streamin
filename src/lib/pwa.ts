export const INSTALL_DISMISSED_KEY = "goku-install-dismissed-at";
export const INSTALL_ACCEPTED_KEY = "goku-app-installed";
export const INSTALL_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

export function canOfferInstall(installed: boolean, dismissedAt: string | null, now: number) {
  if (installed) return false;
  if (!dismissedAt) return true;
  const timestamp = Number(dismissedAt);
  return !Number.isFinite(timestamp) || now - timestamp >= INSTALL_COOLDOWN_MS;
}

export function isPreviewHostname(hostname: string) {
  const host = hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" ||
    /^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+\.(?:lovable\.app|gpt-eng\.com|gptengineer\.run)$/.test(host) ||
    /^project--.+-dev\.(?:lovable\.app|gpt-eng\.com|gptengineer\.run)$/.test(host) ||
    ["lovableproject.com", "lovableproject-dev.com", "beta.lovable.dev"].some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

export async function registerAppWorker() {
  if (!("serviceWorker" in navigator)) return;
  const refused = !import.meta.env.PROD || window.self !== window.top ||
    isPreviewHostname(window.location.hostname) || new URLSearchParams(window.location.search).get("sw") === "off";
  if (refused) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter((registration) => {
      const worker = registration.active ?? registration.waiting ?? registration.installing;
      return worker && new URL(worker.scriptURL).origin === window.location.origin && new URL(worker.scriptURL).pathname === "/sw.js";
    }).map((registration) => registration.unregister()));
    return;
  }
  // No video, API, account, or page caching: every request stays on the network.
  await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
}