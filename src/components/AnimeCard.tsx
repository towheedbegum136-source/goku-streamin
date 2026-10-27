import { Link } from "@tanstack/react-router";
import { availableVersions, type AnimeWithEps } from "@/lib/anime";
import { AUDIO_LABEL, useI18n } from "@/lib/i18n";
import { LogoMark } from "./Logo";

export function VersionBadge({ audio, version }: { audio: string; version: string }) {
  const { t } = useI18n();
  return (
    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${version === "dub" ? "bg-electric/20 text-electric" : "bg-primary/20 text-primary"}`}>
      {AUDIO_LABEL[audio] ?? audio} · {version === "dub" ? t("dub") : t("sub")}
    </span>
  );
}

export function AnimeCard({ anime }: { anime: AnimeWithEps }) {
  const versions = availableVersions(anime);
  return (
    <Link to="/anime/$id" params={{ id: anime.id }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {anime.thumbnail_url ? (
          <img src={anime.thumbnail_url} alt={anime.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center"><LogoMark size={64} /></div>
        )}
        {!anime.published && <span className="absolute left-2 top-2 rounded bg-destructive px-2 py-0.5 text-xs font-bold">Draft</span>}
      </div>
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-1 font-semibold">{anime.title}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">{anime.description}</p>
        <div className="flex flex-wrap gap-1">
          {versions.slice(0, 3).map((v) => <VersionBadge key={v.audio + v.version} {...v} />)}
        </div>
      </div>
    </Link>
  );
}
