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