import { createFileRoute } from "@tanstack/react-router";
import { Browse } from "@/components/Browse";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/anime/")({
  validateSearch: (s: Record<string, unknown>) => ({ genre: typeof s["genre"] === "string" ? (s["genre"] as string) : "" }),
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Browse anime — Goku Streaming" },
      { name: "description", content: "Browse every anime on Goku Streaming by genre, language and status." },
      { property: "og:title", content: "Browse anime — Goku Streaming" },
      { property: "og:description", content: "Filter anime by genre, audio language and status." },
    ],
  }),
  component: AnimeIndex,
});

function AnimeIndex() {
  const { genre } = Route.useSearch();
  const { t } = useI18n();
  return <Browse key={genre} title={genre ? `${t("browse")}: ${genre}` : t("browse")} initialGenre={genre} />;
}
