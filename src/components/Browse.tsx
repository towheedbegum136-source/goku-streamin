import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AnimeCard } from "./AnimeCard";
import { AUDIO_LANGS, listAnime } from "@/lib/anime";
import { AUDIO_LABEL, useI18n } from "@/lib/i18n";

const sel = "h-10 rounded-xl border border-border bg-card px-3 text-sm";

export function Browse({ title, initialQ = "" }: { title: string; initialQ?: string }) {
  const { t } = useI18n();
  const { data: anime = [], isLoading } = useQuery({ queryKey: ["anime"], queryFn: listAnime });
  const [q, setQ] = useState(initialQ);
  const [genre, setGenre] = useState("");
  const [lang, setLang] = useState("");
  const [status, setStatus] = useState("");

  const genres = useMemo(() => [...new Set(anime.flatMap((a) => a.genres))].sort(), [anime]);
  const results = anime.filter((a) => {
    const text = q.trim().toLowerCase();
    if (text && !`${a.title} ${a.description} ${a.genres.join(" ")}`.toLowerCase().includes(text)) return false;
    if (genre && !a.genres.includes(genre)) return false;
    if (status && a.status !== status) return false;
    if (lang && !a.episodes.some((e) => e.published && e.audio_language === lang)) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold md:text-4xl"><span className="h-9 w-1.5 rounded bg-brand" />{title}</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")} className={sel} />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className={sel}>
          <option value="">{t("allGenres")}</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={lang} onChange={(e) => setLang(e.target.value)} className={sel}>
          <option value="">{t("allLanguages")}</option>
          {AUDIO_LANGS.map((l) => <option key={l} value={l}>{AUDIO_LABEL[l]}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={sel}>
          <option value="">{t("allStatus")}</option>
          <option value="ongoing">{t("ongoing")}</option>
          <option value="completed">{t("completed")}</option>
          <option value="upcoming">{t("upcoming")}</option>
        </select>
      </div>
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-card" />)}
          </div>
        ) : results.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            {anime.length === 0 ? t("noAnime") : t("noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {results.map((a) => <AnimeCard key={a.id} anime={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
