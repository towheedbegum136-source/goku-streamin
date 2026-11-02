import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Tag } from "lucide-react";
import { listAnime } from "@/lib/anime";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/genres")({
  head: () => ({ meta: [
    { title: "Anime Genres — Goku Streaming" },
    { name: "description", content: "Explore Goku Streaming's anime catalog by genre." },
    { property: "og:title", content: "Anime Genres — Goku Streaming" },
    { property: "og:description", content: "Find action, adventure, fantasy and more in the Goku Streaming library." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Genres,
});

function Genres() {
  const { t } = useI18n();
  const { data: anime = [], isLoading } = useQuery({ queryKey: ["anime"], queryFn: listAnime });
  const counts = new Map<string, number>();
  for (const a of anime) for (const genre of new Set(a.genres)) counts.set(genre, (counts.get(genre) ?? 0) + 1);
  return <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
    <h1 className="text-3xl font-extrabold">{t("genres")}</h1>
    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([genre, count]) =>
        <Link key={genre} to="/anime" search={{ genre }} className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary">
          <Tag className="size-5 shrink-0 text-primary" />
          <span className="min-w-0 flex-1 break-words font-semibold">{genre}<span className="block text-xs text-muted-foreground">{count}</span></span>
          <ArrowRight className="size-4 shrink-0 text-primary" />
        </Link>)}
    </div>
    {!isLoading && counts.size === 0 && <p className="mt-8 text-muted-foreground">{t("noAnime")}</p>}
  </div>;
}