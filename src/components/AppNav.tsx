import { Link } from "@tanstack/react-router";
import { Download, Home, UserCircle } from "lucide-react";

export const TOP_CATEGORIES = [
  { slug: "football", label: "Football" },
  { slug: "trending", label: "Trending" },
  { slug: "movie", label: "Movie" },
  { slug: "anime", label: "Anime" },
  { slug: "cricket", label: "Cricket" },
  { slug: "tv", label: "TV" },
  { slug: "tv-channels", label: "TV Channels" },
] as const;

export function CategoryBar() {
  return (
    <nav aria-label="Categories" className="sticky top-16 z-30 glass border-b border-border">
      <div className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto scroll-smooth px-4 py-2 md:px-6">
        {TOP_CATEGORIES.map((c) => (
          <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }}
            className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            activeProps={{ className: "border-primary bg-primary/15 text-foreground" }}>
            {c.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function BottomNav() {
  const item = "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-semibold text-muted-foreground";
  const active = { className: "text-primary" };
  return (
    <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-40 glass border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md">
        <Link to="/" className={item} activeProps={active} activeOptions={{ exact: true }}><Home className="size-6" />Home</Link>
        <Link to="/downloads" className={item} activeProps={active}><Download className="size-6" />Downloads</Link>
        <Link to="/me" className={item} activeProps={active}><UserCircle className="size-6" />Me</Link>
      </div>
    </nav>
  );
}
