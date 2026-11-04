import type { AnimeWithEps } from "./anime";

export type CatalogFilters = { q: string; genre: string; lang: string; status: string };

export function filterCatalog(anime: AnimeWithEps[], filters: CatalogFilters) {
  const text = filters.q.trim().toLowerCase();
  return anime.filter((a) => {
    if (text && !`${a.title} ${a.description} ${a.genres.join(" ")}`.toLowerCase().includes(text)) return false;
    if (filters.genre && !a.genres.includes(filters.genre)) return false;
    if (filters.status && a.status !== filters.status) return false;
    if (filters.lang && !a.episodes.some((e) => e.published && e.audio_language === filters.lang)) return false;
    return true;
  });
}

export function featuredCatalog(anime: AnimeWithEps[]) {
  return anime.filter((a) => a.published && a.featured);
}
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Top-bar categories match genre tags (e.g. "Movie", "Cricket"); "trending" = featured, "anime" = everything not tagged as a movie/TV/sport. */
export function categoryCatalog(anime: AnimeWithEps[], slug: string) {
  const pub = anime.filter((a) => a.published);
  const key = norm(slug);
  if (key === "trending") { const f = pub.filter((a) => a.featured); return f.length ? f : pub; }
  const nonAnime = ["movie", "movies", "tv", "tvseries", "tvchannels", "football", "cricket"];
  if (key === "anime") return pub.filter((a) => !a.genres.some((g) => nonAnime.includes(norm(g))));
  const aliases = key === "movie" ? ["movie", "movies"] : key === "tv" ? ["tv", "tvseries"] : [key];
  return pub.filter((a) => a.genres.some((g) => aliases.includes(norm(g))));
}
