import { parseVideoUrl } from "./video";

export type DownloadMeta = { id: string; title: string; animeTitle: string; poster: string | null; sourceUrl: string; size: number; savedAt: number };

/** Only direct video files (mp4/webm/ogg) can be saved; embedded players cannot. */
export function isDownloadable(url: string | null | undefined) {
  return !!url && parseVideoUrl(url).kind === "file";
}

const DB = "goku-downloads";
function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { r.result.createObjectStore("meta", { keyPath: "id" }); r.result.createObjectStore("blobs"); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function tx<T>(stores: string[], mode: IDBTransactionMode, fn: (t: IDBTransaction) => IDBRequest<T> | void): Promise<T> {
  const db = await open();
  return new Promise((res, rej) => {
    const t = db.transaction(stores, mode);
    const req = fn(t);
    t.oncomplete = () => res(req ? req.result : (undefined as T));
    t.onerror = () => rej(t.error);
  });
}

export const listDownloads = () =>
  tx<DownloadMeta[]>(["meta"], "readonly", (t) => t.objectStore("meta").getAll()).then((l) => l.sort((a, b) => b.savedAt - a.savedAt));
export const getDownloadBlob = (id: string) => tx<Blob | undefined>(["blobs"], "readonly", (t) => t.objectStore("blobs").get(id));
export const deleteDownload = (id: string) =>
  tx<void>(["meta", "blobs"], "readwrite", (t) => { t.objectStore("meta").delete(id); t.objectStore("blobs").delete(id); });

export async function downloadVideo(meta: Omit<DownloadMeta, "size" | "savedAt">, onProgress: (pct: number | null) => void, signal?: AbortSignal) {
  if (!isDownloadable(meta.sourceUrl)) throw new Error("This video link can't be downloaded");
  const res = await fetch(meta.sourceUrl, { signal });
  if (!res.ok || !res.body) throw new Error(`Download failed (${res.status})`);
  const total = Number(res.headers.get("content-length")) || 0;
  const reader = res.body.getReader();
  const chunks: BlobPart[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value); got += value.length;
    onProgress(total ? Math.round((got / total) * 100) : null);
  }
  const blob = new Blob(chunks, { type: res.headers.get("content-type") || "video/mp4" });
  const full: DownloadMeta = { ...meta, size: blob.size, savedAt: Date.now() };
  await tx<void>(["meta", "blobs"], "readwrite", (t) => { t.objectStore("meta").put(full); t.objectStore("blobs").put(blob, meta.id); });
  return full;
}
