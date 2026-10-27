export type ParsedVideo =
  | { kind: "iframe"; src: string; provider: string }
  | { kind: "file"; src: string; provider: string }
  | { kind: "unsupported"; reason: string };

/** Turns an admin-provided link into something we can embed, or explains why not. */
export function parseVideoUrl(raw: string): ParsedVideo {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { kind: "unsupported", reason: "Not a valid URL" };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { kind: "unsupported", reason: "Only http(s) links are allowed" };
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id =
      url.searchParams.get("v") ??
      url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{6,})/)?.[1];
    if (id) return { kind: "iframe", provider: "YouTube", src: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    if (id) return { kind: "iframe", provider: "YouTube", src: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/(\d{5,})/)?.[1];
    if (id) return { kind: "iframe", provider: "Vimeo", src: `https://player.vimeo.com/video/${id}` };
  }
  if (host === "dailymotion.com" || host === "dai.ly") {
    const id = host === "dai.ly" ? url.pathname.slice(1) : url.pathname.match(/\/video\/([a-zA-Z0-9]+)/)?.[1];
    if (id) return { kind: "iframe", provider: "Dailymotion", src: `https://www.dailymotion.com/embed/video/${id}` };
  }
  if (host === "drive.google.com") {
    const id = url.pathname.match(/\/file\/d\/([\w-]+)/)?.[1] ?? url.searchParams.get("id");
    if (id) return { kind: "iframe", provider: "Google Drive", src: `https://drive.google.com/file/d/${id}/preview` };
  }
  if (/\.(mp4|webm|ogg|ogv)$/i.test(url.pathname)) {
    return { kind: "file", provider: "Direct file", src: url.toString() };
  }
  return { kind: "unsupported", reason: "This provider or link format isn't supported" };
}
