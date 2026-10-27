import { createFileRoute } from "@tanstack/react-router";
import { Browse } from "@/components/Browse";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? (s["q"] as string) : "" }),
  head: () => ({
    meta: [
      { title: "Search — Goku Streaming" },
      { name: "description", content: "Search anime on Goku Streaming." },
      { property: "og:title", content: "Search — Goku Streaming" },
      { property: "og:description", content: "Find your next anime on Goku Streaming." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { t } = useI18n();
  return <Browse key={q} title={q ? `${t("search")}: “${q}”` : t("search")} initialQ={q} />;
}
