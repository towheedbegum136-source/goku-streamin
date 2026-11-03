import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import logo from "@/assets/goku-logo.png.asset.json";
import { canOfferInstall, INSTALL_ACCEPTED_KEY, INSTALL_DISMISSED_KEY, registerAppWorker } from "@/lib/pwa";

interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const pending = useRef<InstallEvent | null>(null);
  const sessionDismissed = useRef(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void registerAppWorker().catch(() => { /* Installation remains browser-dependent. */ });
    const standalone = window.matchMedia("(display-mode: standalone)");
    const installed = () => standalone.matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const onPrompt = (event: Event) => {
      event.preventDefault();
      let accepted = false;
      let dismissed: string | null = null;
      try {
        accepted = localStorage.getItem(INSTALL_ACCEPTED_KEY) === "true";
        dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY);
      } catch { /* Restricted storage: session suppression still applies. */ }
      if (sessionDismissed.current || !canOfferInstall(installed() || accepted, dismissed, Date.now())) return;
      pending.current = event as InstallEvent;
      setError("");
      setOpen(true);
    };
    const onInstalled = () => {
      pending.current = null;
      setOpen(false);
      try { localStorage.setItem(INSTALL_ACCEPTED_KEY, "true"); } catch { /* Optional persistence. */ }
    };
    const onDisplayChange = () => { if (installed()) onInstalled(); };
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
    sessionDismissed.current = true;
    setOpen(false);
    try { localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now())); } catch { /* Session fallback. */ }
  };
  const install = async () => {
    const event = pending.current;
    if (!event || busy) return;
    setBusy(true);
    setError("");
    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      if (outcome === "accepted") {
        setOpen(false);
        try { localStorage.setItem(INSTALL_ACCEPTED_KEY, "true"); } catch { /* Optional persistence. */ }
      } else dismiss();
    } catch {
      setError("Installation couldn’t start. Try your browser’s Install app menu.");
    } finally {
      pending.current = null;
      setBusy(false);
    }
  };

  return <Dialog open={open} onOpenChange={(next) => { if (!next && !busy) dismiss(); }}>
    <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-lg border-primary/40 bg-card p-7 shadow-glow motion-reduce:animate-none" onEscapeKeyDown={(event) => { if (busy) event.preventDefault(); }} onPointerDownOutside={(event) => { if (busy) event.preventDefault(); }}>
      <img src={logo.url} alt="Goku Streaming" width={80} height={80} className="mx-auto rounded-xl object-contain" />
      <DialogTitle className="text-center font-display text-xl leading-snug">Install Goku Streaming App</DialogTitle>
      <DialogDescription className="text-center">Your anime. Full power.</DialogDescription>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="mt-2 grid gap-2">
        <Button variant="hero" size="lg" disabled={busy || !!error} onClick={install}>{busy ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <Download />}{busy ? "Installing…" : "Install Now"}</Button>
        <Button variant="ghost" disabled={busy} onClick={dismiss}>Not Now</Button>
      </div>
    </DialogContent>
  </Dialog>;
}