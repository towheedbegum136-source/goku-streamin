import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Anime, Episode } from "@/lib/anime";
import { useI18n } from "@/lib/i18n";
import { VersionBadge } from "@/components/AnimeCard";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/anime/$id")({
  head: () => ({
    meta: [
      { title: "Anime details — Goku Streaming" },
      { name: "description", content: "Episodes, languages and details on Goku Streaming." },
      { property: "og:title", content: "Anime details — Goku Streaming" },
      { property: "og:description", content: "Watch episodes on Goku Streaming." },
    ],
  }),
  component: AnimeDetails,
});

function AnimeDetails() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ["anime", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("anime").select("*, episodes(*)").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as (Anime & { episodes: Episode[] }) | null;
    },
  });

  const versions = useMemo(() => {
    const m = new Map<string, { audio: string; version: string }>();
    data?.episodes.filter((e) => e.published).forEach((e) => m.set(`${e.audio_language}|${e.version}`, { audio: e.audio_language, version: e.version }));
    return [...m.entries()];
  }, [data]);
  const [pick, setPick] = useState<string | null>(null);
  const active = pick ?? versions[0]?.[0];
  const eps = (data?.episodes ?? [])
    .filter((e) => e.published && `${e.audio_language}|${e.version}` === active)
    .sort((a, b) => a.episode_number - b.episode_number);

  if (isLoading) return <div className="mx-auto max-w-7xl p-10"><div className="h-80 animate-pulse rounded-2xl bg-card" /></div>;
  if (!data) return (
    <div className="p-16 text-center"><h1 className="text-2xl font-bold">{t("notFound")}</h1>
      <Button asChild variant="hero" className="mt-4"><Link to="/anime" search={{ genre: "" }}>{t("browseAll")}</Link></Button></div>
  );

  return (
    <div>
      <div className="relative isolate overflow-hidden">
        {(data.banner_url || data.thumbnail_url) && (
          <img src={data.banner_url || data.thumbnail_url!} alt="" className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover opacity-40 blur-md" />
        )}
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row md:px-6">
          <div className="w-48 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-glow md:w-64">
            {data.thumbnail_url ? <img src={data.thumbnail_url} alt={data.title} className="aspect-[3/4] w-full object-cover" />
              : <div className="flex aspect-[3/4] items-center justify-center"><LogoMark size={72} /></div>}
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black md:text-5xl">{data.title}</h1>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-md bg-secondary px-2 py-1 font-semibold">{t(data.status as "ongoing")}</span>
              {data.release_year && <span className="rounded-md bg-secondary px-2 py-1">{data.release_year}</span>}
              {data.genres.map((g) => <span key={g} className="rounded-md border border-border px-2 py-1">{g}</span>)}
            </div>
            <p className="max-w-2xl text-muted-foreground">{data.description}</p>
            {versions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("available")}</p>
                <div className="flex flex-wrap gap-2">
                  {versions.map(([key, v]) => (
                    <button key={key} onClick={() => setPick(key)}
                      className={`rounded-lg border p-1 ${key === active ? "border-primary" : "border-transparent"}`}>
                      <VersionBadge {...v} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {eps[0] && (
              <Button asChild variant="hero" size="xl"><Link to="/watch/$episodeId" params={{ episodeId: eps[0].id }}><Play className="fill-current" />{t("watchNow")}</Link></Button>
            )}
          </div>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="mb-4 text-2xl font-bold">{t("episodes")}</h2>
        {eps.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">{t("noEpisodes")}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {eps.map((e) => (
              <Link key={e.id} to="/watch/$episodeId" params={{ episodeId: e.id }}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand font-display text-lg font-black">{e.episode_number}</span>
                <span className="line-clamp-2 font-medium">{e.title}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
