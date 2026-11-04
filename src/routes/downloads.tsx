import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDownload, getDownloadBlob, listDownloads, type DownloadMeta } from "@/lib/downloads";

export const Route = createFileRoute("/downloads")({
  head: () => ({ meta: [
    { title: "Downloads — Goku Streaming" },
    { name: "description", content: "Videos saved on this device for offline playback." },
    { property: "og:title", content: "Downloads — Goku Streaming" },
    { property: "og:description", content: "Your saved Goku Streaming videos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Downloads,
});

function Downloads() {
  const [items, setItems] = useState<DownloadMeta[] | null>(null);
  const [playing, setPlaying] = useState<{ url: string; title: string } | null>(null);
  const load = () => listDownloads().then(setItems).catch(() => setItems([]));
  useEffect(() => { load(); }, []);
  useEffect(() => () => { if (playing) URL.revokeObjectURL(playing.url); }, [playing]);

  const play = async (d: DownloadMeta) => {
    const blob = await getDownloadBlob(d.id);
    if (blob) setPlaying({ url: URL.createObjectURL(blob), title: d.title });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 flex items-center gap-3 text-3xl font-extrabold"><span className="h-9 w-1.5 rounded bg-brand" />Downloads</h1>
      {playing && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between p-3"><span className="font-semibold">{playing.title}</span>
            <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setPlaying(null)}><X /></Button></div>
          <video src={playing.url} controls autoPlay playsInline className="aspect-video w-full bg-background" />
        </div>
      )}
      {items === null ? <div className="h-40 animate-pulse rounded-2xl bg-card" /> : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">No downloads yet. Tap Download on an episode to save it here.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((d) => (
            <li key={d.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
              {d.poster && <img src={d.poster} alt="" className="h-16 w-12 rounded-md object-cover" />}
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{d.title}</p>
                <p className="truncate text-xs text-muted-foreground">{d.animeTitle} · {(d.size / 1048576).toFixed(1)} MB</p></div>
              <Button variant="hero" size="icon" aria-label={`Play ${d.title}`} onClick={() => play(d)}><Play /></Button>
              <Button variant="ghost" size="icon" aria-label={`Delete ${d.title}`} onClick={async () => { await deleteDownload(d.id); load(); }}><Trash2 /></Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
