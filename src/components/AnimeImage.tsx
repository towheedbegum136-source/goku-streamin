import { useState } from "react";
import fallback from "@/assets/anime-artwork-fallback.jpg";

/** A failed source is replaced once with artwork, never the site logo. */
export function AnimeImage({ src, alt, className, loading = "lazy" }: {
  src?: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = src?.trim() || null;
  const resolved = source && source !== failedSource ? source : fallback;
  return <img src={resolved} alt={alt} loading={loading} decoding="async"
    className={className} onError={() => { if (source && resolved !== fallback) setFailedSource(source); }} />;
}