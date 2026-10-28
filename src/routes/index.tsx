import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, ArrowRight, Sparkles, Info, Swords, Compass, Wand2, Laugh, Heart, Rocket, Tag } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { AnimeCard } from "@/components/AnimeCard";
import { listAnime } from "@/lib/anime";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Goku Streaming — Your anime. Full power." },
      { name: "description", content: "Watch Dragon Ball, One Piece, Naruto and more on Goku Streaming, in English, Hindi and Telugu." },
      { property: "og:title", content: "Goku Streaming — Your anime. Full power." },
      { property: "og:description", content: "Your favourite anime in one neon-lit library." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const { isAdmin } = useAuth();
  const { data: anime = [], isLoading } = useQuery({ queryKey: ["anime"], queryFn: listAnime });
  const featured = anime.find((a) => a.featured && a.published) ?? anime.find((a) => a.published);

  return (
    <>
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <img src={hero} alt="Goku, Luffy and Naruto under a purple moonlit sky" width={1920} height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 -z-10 bg-hero-side" />
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-40 md:px-6 md:justify-center md:pb-10">
          <div className="max-w-xl animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="size-4" /> {t("heroTag")}
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] md:text-7xl">
              {t("heroLine1")}<br /><span className="text-brand">{t("heroLine2")}</span>
            </h1>
            {featured ? (
              <div className="mt-6 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-electric">Featured</p>
                <h2 className="text-2xl font-bold">{featured.title}</h2>
                <p className="line-clamp-3 text-muted-foreground">{featured.description}</p>
              </div>
            ) : (
              <p className="mt-6 text-lg text-muted-foreground">{t("heroDesc")}</p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                {featured ? <Link to="/anime/$id" params={{ id: featured.id }}><Play className="fill-current" />{t("watchNow")}</Link>
                  : <Link to="/anime"><Play className="fill-current" />{t("watchNow")}</Link>}
              </Button>
              <Button asChild variant="glass" size="xl">
                {featured ? <Link to="/anime/$id" params={{ id: featured.id }}><Info />{t("details")}</Link>
                  : <Link to="/anime">{t("browseAll")}<ArrowRight /></Link>}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Categories />

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="flex items-center gap-3 text-3xl font-extrabold"><span className="h-8 w-1.5 rounded bg-brand" />{t("latest")}</h2>
          <Link to="/anime" className="flex items-center gap-1 text-sm text-primary">{t("browseAll")} <ArrowRight className="size-4" /></Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-card" />)}
          </div>
        ) : anime.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <p>{t("noAnime")}</p>
            {isAdmin && <Button asChild variant="hero" className="mt-4"><Link to="/admin">{t("noAnimeAdmin")}</Link></Button>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {anime.slice(0, 10).map((a) => <AnimeCard key={a.id} anime={a} />)}
          </div>
        )}
      </section>
    </>
  );
}

const DEFAULT_GENRES = ["Action", "Adventure", "Fantasy", "Comedy", "Drama", "Sci-Fi"];
const GENRE_ICON: Record<string, typeof Swords> = {
  action: Swords,
  adventure: Compass,
  fantasy: Wand2,
  comedy: Laugh,
  drama: Heart,
  "sci-fi": Rocket,
  scifi: Rocket,
};

function Categories() {
  const { t } = useI18n();
  const { data: anime = [] } = useQuery({ queryKey: ["anime"], queryFn: listAnime });
  const counts = new Map<string, number>();
  for (const a of anime) for (const g of a.genres) counts.set(g, (counts.get(g) ?? 0) + 1);
  const genres = [...new Set([...DEFAULT_GENRES, ...counts.keys()])].slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-extrabold"><span className="h-8 w-1.5 rounded bg-brand" />{t("categories")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("categoriesDesc")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {genres.map((g) => {
          const Icon = GENRE_ICON[g.toLowerCase()] ?? Tag;
          const n = counts.get(g) ?? 0;
          return (
            <Link key={g} to="/anime" search={{ genre: g }}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/60 hover:shadow-[0_0_30px_-10px_var(--primary)]">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition group-hover:scale-110">
                <Icon className="size-6" />
              </span>
              <span>
                <span className="block font-bold">{g}</span>
                <span className="block text-xs text-muted-foreground">{n} {n === 1 ? t("episode") : t("episodes").toLowerCase() === t("episodes") ? "anime" : "anime"}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
