import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AnimeCard } from "./AnimeCard";
import { AUDIO_LANGS, listAnime } from "@/lib/anime";
import { AUDIO_LABEL, useI18n } from "@/lib/i18n";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { filterCatalog } from "@/lib/catalog";

const sel = "h-10 rounded-xl border border-border bg-card px-3 text-sm";

export function Browse({ title, initialQ = "", initialGenre = "" }: { title: string; initialQ?: string; initialGenre?: string }) {
  const { t } = useI18n();
  const { data: anime = [], isLoading } = useQuery({ queryKey: ["anime"], queryFn: listAnime });
  const [q, setQ] = useState(initialQ);
  const [genre, setGenre] = useState(initialGenre);
  const [lang, setLang] = useState("");
  const [status, setStatus] = useState("");

  const genres = useMemo(
    () => [...new Set([...anime.flatMap((a) => a.genres), ...(genre ? [genre] : [])])].sort(),
    [anime, genre],
  );
  const results = filterCatalog(anime, { q, genre, lang, status });
  const hasFilters = Boolean(q || genre || lang || status);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
      <h1 className="flex items-center gap-3 text-3xl font-extrabold md:text-4xl"><span className="h-9 w-1.5 rounded bg-brand" />{title}</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input aria-label={t("search")} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")} className={sel} />
        <select aria-label={t("allGenres")} value={genre} onChange={(e) => setGenre(e.target.value)} className={sel}>
          <option value="">{t("allGenres")}</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select aria-label={t("allLanguages")} value={lang} onChange={(e) => setLang(e.target.value)} className={sel}>
          <option value="">{t("allLanguages")}</option>
          {AUDIO_LANGS.map((l) => <option key={l} value={l}>{AUDIO_LABEL[l]}</option>)}
        </select>
        <select aria-label={t("allStatus")} value={status} onChange={(e) => setStatus(e.target.value)} className={sel}>
          <option value="">{t("allStatus")}</option>
          <option value="ongoing">{t("ongoing")}</option>
          <option value="completed">{t("completed")}</option>
          <option value="upcoming">{t("upcoming")}</option>
        </select>
      </div>
      {hasFilters && <Button variant="ghost" size="sm" className="mt-3" onClick={() => { setQ(""); setGenre(""); setLang(""); setStatus(""); }}><RotateCcw />{t("resetFilters")}</Button>}
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
