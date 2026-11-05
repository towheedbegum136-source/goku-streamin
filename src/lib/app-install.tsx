import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { canOfferInstall, INSTALL_ACCEPTED_KEY, INSTALL_DISMISSED_KEY, registerAppWorker } from "./pwa";

interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallState = {
  open: boolean;
  manual: boolean;
  installed: boolean;
  busy: boolean;
  requestInstall(): Promise<void>;
  dismiss(): void;
};

const InstallContext = createContext<InstallState | null>(null);

export function AppInstallProvider({ children }: { children: ReactNode }) {
  const pending = useRef<InstallEvent | null>(null);
  const sessionDismissed = useRef(false);
  const prompting = useRef(false);
  const [open, setOpen] = useState(false);
  const [manual, setManual] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void registerAppWorker().catch(() => { /* Manual installation remains available. */ });
    const standalone = window.matchMedia("(display-mode: standalone)");
    const isInstalled = () => standalone.matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(isInstalled());
    const onPrompt = (event: Event) => {
      event.preventDefault();
      // Retain eligibility even after automatic-popup dismissal for the footer action.
      pending.current = event as InstallEvent;
      let accepted = false;
      let dismissed: string | null = null;
      try {
        accepted = localStorage.getItem(INSTALL_ACCEPTED_KEY) === "true";
        dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY);
      } catch { /* Session suppression works with restricted storage. */ }
      if (sessionDismissed.current || !canOfferInstall(isInstalled() || accepted, dismissed, Date.now())) return;
      setManual(false);
      setOpen(true);
    };
    const onInstalled = () => {
      pending.current = null;
      setInstalled(true);
      setOpen(false);
      try { localStorage.setItem(INSTALL_ACCEPTED_KEY, "true"); } catch { /* Optional persistence. */ }
    };
    const onDisplayChange = () => {
      if (isInstalled()) onInstalled();
      else setInstalled(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    standalone.addEventListener("change", onDisplayChange);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      standalone.removeEventListener("change", onDisplayChange);
    };
  }, []);

  const dismiss = () => {
    if (prompting.current) return;
    sessionDismissed.current = true;
    setOpen(false);
    try { localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now())); } catch { /* Optional persistence. */ }
  };

  const requestInstall = async () => {
    if (prompting.current) return;
    const event = pending.current;
    if (installed || !event) {
      setManual(true);
      setOpen(true);
      return;
    }
    // Call prompt synchronously from the click to preserve browser user activation.
    prompting.current = true;
    setBusy(true);
    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      setOpen(false);
      if (outcome === "accepted") {
        try { localStorage.setItem(INSTALL_ACCEPTED_KEY, "true"); } catch { /* Optional persistence. */ }
      } else {
        sessionDismissed.current = true;
        try { localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now())); } catch { /* Optional persistence. */ }
      }
    } catch {
      setManual(true);
      setOpen(true);
    } finally {
      pending.current = null;
      prompting.current = false;
      setBusy(false);
    }
  };

  return <InstallContext.Provider value={{ open, manual, installed, busy, requestInstall, dismiss }}>{children}</InstallContext.Provider>;
}

export function useAppInstall() {
  const value = useContext(InstallContext);
  if (!value) throw new Error("useAppInstall requires AppInstallProvider");
  return value;
}