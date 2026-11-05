import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import logo from "@/assets/goku-logo.png.asset.json";
import { useAppInstall } from "@/lib/app-install";

export function InstallPrompt() {
  const { open, manual, installed, busy, requestInstall, dismiss } = useAppInstall();
  return <Dialog open={open} onOpenChange={(next) => { if (!next) dismiss(); }}>
    <DialogContent className="w-[calc(100%-2rem)] max-w-sm max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg border-primary/40 bg-card p-7 shadow-glow motion-reduce:animate-none" onEscapeKeyDown={(event) => { if (busy) event.preventDefault(); }} onPointerDownOutside={(event) => { if (busy) event.preventDefault(); }}>
      <img src={logo.url} alt="Goku Streaming" width={80} height={80} className="mx-auto rounded-xl object-contain" />
      <DialogTitle className="text-center font-display text-xl leading-snug">{installed ? "Goku Streaming is installed" : "Install Goku Streaming App"}</DialogTitle>
      <DialogDescription className="text-center">{installed ? "Open Goku Streaming from its app icon on your home screen." : manual ? "Add Goku Streaming to your home screen." : "Your anime. Full power."}</DialogDescription>
      {manual && !installed && <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground">Android · Chrome</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            <li>Open this website directly in Chrome, not inside another app or the editor preview.</li>
            <li>Tap Chrome’s ⋮ menu, then <strong className="text-foreground">Install app</strong> or <strong className="text-foreground">Add to Home screen</strong>.</li>
            <li>Confirm Install or Add, then open the Goku Streaming icon.</li>
          </ol>
        </div>
        <p><strong className="text-foreground">iPhone or iPad:</strong> open in Safari, tap Share, then Add to Home Screen.</p>
        <p>If neither option appears, try a supported browser. Installation options depend on your device and browser.</p>
      </div>}
      <div className="mt-2 grid gap-2">
        {manual || installed ? <Button variant="hero" onClick={dismiss}>{installed && <CheckCircle2 />}Got it</Button> : <>
          <Button variant="hero" size="lg" disabled={busy} onClick={() => void requestInstall()}>{busy ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <Download />}{busy ? "Installing…" : "Install App"}</Button>
          <Button variant="ghost" disabled={busy} onClick={dismiss}>Not Now</Button>
        </>}
      </div>
    </DialogContent>
  </Dialog>;
}
