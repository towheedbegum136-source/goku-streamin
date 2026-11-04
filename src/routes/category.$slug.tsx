import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listAnime } from "@/lib/anime";
import { categoryCatalog } from "@/lib/catalog";
import { TOP_CATEGORIES } from "@/components/AppNav";
import { AnimeCard } from "@/components/AnimeCard";

export const Route = createFileRoute("/category/$slug")({
  head: () => ({ meta: [
    { title: "Category — Goku Streaming" },
    { name: "description", content: "Browse a Goku Streaming category." },
    { property: "og:title", content: "Category — Goku Streaming" },
    { property: "og:description", content: "Browse a Goku Streaming category." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Category,
});

function Category() {
  const { slug } = Route.useParams();
  const label = TOP_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
  const { data = [], isLoading } = useQuery({ queryKey: ["anime"], queryFn: listAnime });
  const items = categoryCatalog(data, slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="mb-6 flex items-center gap-3 text-3xl font-extrabold"><span className="h-9 w-1.5 rounded bg-brand" />{label}</h1>
      {isLoading ? <div className="h-60 animate-pulse rounded-2xl bg-card" /> : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">Nothing in {label} yet. Titles appear here when the admin tags them “{label}”.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{items.map((a) => <AnimeCard key={a.id} anime={a} />)}</div>
      )}
    </div>
  );
}
