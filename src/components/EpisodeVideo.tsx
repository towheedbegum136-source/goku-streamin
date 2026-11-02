import { useState } from "react";
import { AlertTriangle, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseVideoUrl } from "@/lib/video";
import { useI18n } from "@/lib/i18n";

export function EpisodeVideo({ url, title }: { url: string; title: string }) {
  const video = parseVideoUrl(url);
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (video.kind === "unsupported" || failed) {
    const safeLink = /^https?:\/\//i.test(url.trim());
    return <div role="alert" className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
      <AlertTriangle className="size-8 text-destructive" />
      <p className="font-semibold">{t(failed ? "videoFailed" : "videoUnsupported")}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {failed && <Button variant="glass" size="sm" onClick={() => { setFailed(false); setAttempt((n) => n + 1); }}><RotateCcw />{t("retry")}</Button>}
        {safeLink && <Button asChild variant="ghost" size="sm"><a href={url} target="_blank" rel="noopener noreferrer"><ExternalLink />{t("openSource")}</a></Button>}
      </div>
    </div>;
  }
  if (video.kind === "iframe") return <iframe src={video.src} title={title} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />;
  return <video key={attempt} src={video.src} aria-label={title} controls playsInline preload="metadata" className="h-full w-full" onError={() => setFailed(true)} />;
}