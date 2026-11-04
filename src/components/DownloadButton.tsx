import { useState } from "react";
import { Check, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadVideo, isDownloadable } from "@/lib/downloads";

type Props = { id: string; title: string; animeTitle: string; poster: string | null; url: string; compact?: boolean };

export function DownloadButton({ id, title, animeTitle, poster, url, compact }: Props) {
  const [pct, setPct] = useState<number | null | undefined>(undefined);
  const [done, setDone] = useState(false);
  const ok = isDownloadable(url);
  const busy = pct !== undefined && !done;

  const start = async () => {
    if (!ok) { toast.error("This video is an embedded player and can't be downloaded."); return; }
    setPct(0);
    try {
      await downloadVideo({ id, title, animeTitle, poster, sourceUrl: url }, setPct);
      setDone(true);
      toast.success("Saved to Downloads");
    } catch (e) {
      setPct(undefined);
      toast.error(e instanceof Error ? e.message : "Download failed — the video host may block downloads.");
    }
  };

  const label = done ? "Downloaded" : busy ? (pct === null ? "Downloading…" : `${pct}%`) : "Download";
  return (
    <Button variant="glass" size={compact ? "sm" : "xl"} onClick={(e) => { e.preventDefault(); e.stopPropagation(); start(); }}
      disabled={busy || done} aria-label={`Download ${title}`} title={ok ? "Download" : "Not downloadable"}>
      {done ? <Check /> : <Download />}{label}
    </Button>
  );
}
