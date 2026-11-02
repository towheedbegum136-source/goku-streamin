import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Anime, Episode } from "@/lib/anime";
import { EpisodeVideo } from "@/components/EpisodeVideo";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { VersionBadge } from "@/components/AnimeCard";

export const Route = createFileRoute("/watch/$episodeId")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Watch — Goku Streaming" },
      { name: "description", content: "Watch this episode on Goku Streaming." },
      { property: "og:title", content: "Watch — Goku Streaming" },
      { property: "og:description", content: "Now streaming on Goku Streaming." },
    ],
  }),
  component: Watch,
});

function Watch() {
  const { episodeId } = Route.useParams();
  const { t } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["episode", episodeId],
    queryFn: async () => {
      const { data: ep, error } = await supabase.from("episodes").select("*, anime(*)").eq("id", episodeId).maybeSingle();
      if (error) throw error;
      if (!ep) return null;
      const { data: siblings } = await supabase.from("episodes").select("id, episode_number, title")
        .eq("anime_id", ep.anime_id).eq("audio_language", ep.audio_language).eq("version", ep.version)
        .eq("published", true).order("episode_number");
      return { ep: ep as Episode & { anime: Anime }, siblings: siblings ?? [] };
    },
  });

  if (isLoading) return <div className="mx-auto max-w-5xl p-6"><div className="aspect-video animate-pulse rounded-2xl bg-card" /></div>;
  if (!data) return <div className="p-16 text-center"><h1 className="text-2xl font-bold">{t("notFound")}</h1></div>;

  const { ep, siblings } = data;
  const idx = siblings.findIndex((s) => s.id === ep.id);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
      <Link to="/anime/$id" params={{ id: ep.anime_id }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> {t("backToAnime")}
      </Link>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-glow">
        <div className="aspect-video bg-background">
          <EpisodeVideo key={`${ep.id}:${ep.video_url}`} url={ep.video_url} title={ep.title} />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <p className="text-sm text-muted-foreground">{ep.anime.title} · {t("episode")} {ep.episode_number}</p>
        <h1 className="text-2xl font-bold">{ep.title}</h1>
        <VersionBadge audio={ep.audio_language} version={ep.version} />
      </div>
      <div className="mt-6 flex justify-between gap-3">
        {prev ? <Button asChild variant="glass"><Link to="/watch/$episodeId" params={{ episodeId: prev.id }}><ChevronLeft />{t("prev")}</Link></Button>
          : <Button variant="glass" disabled><ChevronLeft />{t("prev")}</Button>}
        {next ? <Button asChild variant="hero"><Link to="/watch/$episodeId" params={{ episodeId: next.id }}>{t("next")}<ChevronRight /></Link></Button>
          : <Button variant="hero" disabled>{t("next")}<ChevronRight /></Button>}
      </div>
    </div>
  );
}
