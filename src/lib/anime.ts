import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Anime = Database["public"]["Tables"]["anime"]["Row"];
export type Episode = Database["public"]["Tables"]["episodes"]["Row"];
export type AnimeWithEps = Anime & { episodes: Pick<Episode, "audio_language" | "version" | "published">[] };

export const AUDIO_LANGS = ["japanese", "english", "hindi", "telugu"] as const;

export async function listAnime(): Promise<AnimeWithEps[]> {
  const { data, error } = await supabase
    .from("anime")
    .select("*, episodes(audio_language, version, published)")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AnimeWithEps[];
}

/** Versions that really exist (from published episodes) — never claimed otherwise. */
export function availableVersions(a: AnimeWithEps) {
  const set = new Map<string, { audio: string; version: string }>();
  for (const e of a.episodes ?? []) {
    if (!e.published) continue;
    set.set(`${e.audio_language}-${e.version}`, { audio: e.audio_language, version: e.version });
  }
  return [...set.values()];
}
