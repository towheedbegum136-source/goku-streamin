import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimeCard } from "./AnimeCard";
import type { AnimeWithEps } from "@/lib/anime";

export function PosterRow({ title, items, action }: { title: string; items: AnimeWithEps[]; action?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  if (items.length === 0) return null;
  return (
    <section className="mx-auto mb-10 max-w-7xl px-4 md:px-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="flex items-center gap-3 text-2xl font-extrabold md:text-3xl"><span className="h-8 w-1.5 rounded bg-brand" />{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <button aria-label="Scroll left" onClick={() => scroll(-1)} className="hidden size-9 items-center justify-center rounded-full border border-border bg-card hover:border-primary md:flex"><ChevronLeft className="size-5" /></button>
          <button aria-label="Scroll right" onClick={() => scroll(1)} className="hidden size-9 items-center justify-center rounded-full border border-border bg-card hover:border-primary md:flex"><ChevronRight className="size-5" /></button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [-webkit-overflow-scrolling:touch] md:mx-0 md:px-0">
        {items.map((a) => <div key={a.id} className="w-36 shrink-0 snap-start sm:w-44 lg:w-52"><AnimeCard anime={a} /></div>)}
      </div>
    </section>
  );
}
