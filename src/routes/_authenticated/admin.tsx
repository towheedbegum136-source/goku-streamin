import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Eye, EyeOff, ListVideo, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AUDIO_LANGS, listAnime, type Anime, type Episode } from "@/lib/anime";
import { parseVideoUrl } from "@/lib/video";
import { AUDIO_LABEL } from "@/lib/i18n";
import { LogoMark } from "@/components/Logo";
import { AnimeImage } from "@/components/AnimeImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    // UI gate only — every write is also enforced by database policies (has_role admin).
    const { data } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    if (!data) throw redirect({ to: "/account" });
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Goku Streaming" },
      { name: "description", content: "Manage anime and episodes." },
      { property: "og:title", content: "Admin Dashboard — Goku Streaming" },
      { property: "og:description", content: "Goku Streaming admin." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const sel = "h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm";

type AnimeForm = { id?: string; title: string; description: string; thumbnail_url: string; banner_url: string; genres: string; status: string; release_year: string; published: boolean; featured: boolean };
const emptyAnime: AnimeForm = { title: "", description: "", thumbnail_url: "", banner_url: "", genres: "", status: "ongoing", release_year: "", published: false, featured: false };

type EpForm = { id?: string; episode_number: string; title: string; video_url: string; audio_language: string; version: string; published: boolean };

function Admin() {
  const qc = useQueryClient();
  const { data: anime = [] } = useQuery({ queryKey: ["anime"], queryFn: listAnime });
  const [form, setForm] = useState<AnimeForm | null>(null);
  const [selected, setSelected] = useState<Anime | null>(null);
  const [confirmDel, setConfirmDel] = useState<Anime | null>(null);
  const refresh = () => qc.invalidateQueries();

  const saveAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const row = {
      title: form.title.trim(), description: form.description.trim(),
      thumbnail_url: form.thumbnail_url.trim() || null, banner_url: form.banner_url.trim() || null,
      genres: form.genres.split(",").map((g) => g.trim()).filter(Boolean),
      status: form.status, release_year: form.release_year ? Number(form.release_year) : null,
      published: form.published, featured: form.featured,
    };
    const { error } = form.id ? await supabase.from("anime").update(row).eq("id", form.id) : await supabase.from("anime").insert(row);
    if (error) { toast.error(error.message); return; }
    toast.success("Anime saved");
    setForm(null);
    refresh();
  };

  const toggle = async (a: Anime, field: "published" | "featured") => {
    const { error } = await supabase.from("anime").update(field === "published" ? { published: !a.published } : { featured: !a.featured }).eq("id", a.id);
    if (error) { toast.error(error.message); return; }
    refresh();
  };

  const deleteAnime = async () => {
    if (!confirmDel) return;
    const { error } = await supabase.from("anime").delete().eq("id", confirmDel.id);
    if (error) toast.error(error.message); else toast.success("Anime deleted");
    setConfirmDel(null);
    refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4"><LogoMark size={52} /><div><h1 className="text-3xl font-extrabold">Admin Dashboard</h1><p className="text-sm text-muted-foreground">Goku Streaming content manager</p></div></div>
        <Button variant="hero" onClick={() => setForm(emptyAnime)}><Plus />Add anime</Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border">
        {anime.length === 0 && <p className="p-10 text-center text-muted-foreground">No anime yet. Click “Add anime” to start.</p>}
        {anime.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-4 border-b border-border bg-card p-4 last:border-0">
            <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-muted"><AnimeImage src={a.thumbnail_url} alt={a.title} className="h-full w-full object-cover" /></div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.episodes.length} episodes · {a.status} · {a.published ? "Published" : "Draft"}{a.featured ? " · Featured" : ""}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="glass" onClick={() => setSelected(a)}><ListVideo />Episodes</Button>
              <Button size="sm" variant="ghost" onClick={() => toggle(a, "published")} title="Publish / unpublish">{a.published ? <EyeOff /> : <Eye />}{a.published ? "Unpublish" : "Publish"}</Button>
              <Button size="sm" variant="ghost" onClick={() => toggle(a, "featured")} title="Feature in hero"><Star className={a.featured ? "fill-current text-primary" : ""} /></Button>
              <Button size="sm" variant="ghost" onClick={() => setForm({ id: a.id, title: a.title, description: a.description, thumbnail_url: a.thumbnail_url ?? "", banner_url: a.banner_url ?? "", genres: a.genres.join(", "), status: a.status, release_year: a.release_year?.toString() ?? "", published: a.published, featured: a.featured })}><Pencil /></Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmDel(a)}><Trash2 className="text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{form?.id ? "Edit anime" : "Add anime"}</DialogTitle></DialogHeader>
          {form && (
            <form onSubmit={saveAnime} className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Thumbnail image URL (poster)" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} />
              <Input placeholder="Banner image URL (optional)" value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} />
              <Input placeholder="Genres, comma separated (Action, Adventure)" value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <select className={sel} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="upcoming">Upcoming</option>
                </select>
                <Input type="number" placeholder="Year" value={form.release_year} onChange={(e) => setForm({ ...form, release_year: e.target.value })} />
              </div>
              <p className="text-xs text-muted-foreground">Audio languages come from the episodes you add — the site only shows Hindi/Telugu dubs when such episodes exist.</p>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />Published</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Featured on home banner</label>
              <Button type="submit" variant="hero" className="w-full">Save</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete “{confirmDel?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>This also deletes all of its episodes. This can't be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={deleteAnime}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selected && <EpisodeManager anime={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function EpisodeManager({ anime, onClose }: { anime: Anime; onClose: () => void }) {
  const qc = useQueryClient();
  const { data: eps = [], refetch } = useQuery({
    queryKey: ["admin-eps", anime.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("episodes").select("*").eq("anime_id", anime.id).order("episode_number");
      if (error) throw error;
      return data as Episode[];
    },
  });
  const [form, setForm] = useState<EpForm | null>(null);
  const [del, setDel] = useState<Episode | null>(null);
  const done = () => { refetch(); qc.invalidateQueries({ queryKey: ["anime"] }); };
  const check = form?.video_url ? parseVideoUrl(form.video_url) : null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const n = Number(form.episode_number);
    if (!Number.isInteger(n) || n < 1) { toast.error("Episode number must be 1 or higher"); return; }
    if (!form.title.trim()) { toast.error("Episode title is required"); return; }
    if (!check || check.kind === "unsupported") { toast.error("That video link isn't supported"); return; }
    const row = { anime_id: anime.id, episode_number: n, title: form.title.trim(), video_url: form.video_url.trim(), audio_language: form.audio_language, version: form.version, published: form.published };
    const { error } = form.id ? await supabase.from("episodes").update(row).eq("id", form.id) : await supabase.from("episodes").insert(row);
    if (error) { toast.error(error.code === "23505" ? "That episode number already exists for this language/version" : error.message); return; }
    toast.success("Episode saved");
    setForm(null);
    done();
  };

  const togglePub = async (ep: Episode) => {
    const { error } = await supabase.from("episodes").update({ published: !ep.published }).eq("id", ep.id);
    if (error) toast.error(error.message); done();
  };
  const remove = async () => {
    if (!del) return;
    const { error } = await supabase.from("episodes").delete().eq("id", del.id);
    if (error) toast.error(error.message); else toast.success("Episode deleted");
    setDel(null); done();
  };

  const next = (eps.reduce((m, e) => Math.max(m, e.episode_number), 0) + 1).toString();

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>Episodes — {anime.title}</DialogTitle></DialogHeader>
        {form ? (
          <form onSubmit={save} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Input type="number" min={1} placeholder="No." value={form.episode_number} onChange={(e) => setForm({ ...form, episode_number: e.target.value })} />
              <Input className="col-span-2" placeholder="Episode title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <Input placeholder="Video URL (YouTube, Vimeo, Dailymotion, Google Drive, .mp4)" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
            {check && (
              <p className={`text-xs ${check.kind === "unsupported" ? "text-destructive" : "text-success"}`}>
                {check.kind === "unsupported" ? `✗ ${check.reason}. Supported: YouTube, Vimeo, Dailymotion, Google Drive, direct .mp4/.webm.` : `✓ Will play via ${check.provider} (if the owner allows embedding)`}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <select className={sel} value={form.audio_language} onChange={(e) => setForm({ ...form, audio_language: e.target.value })}>
                {AUDIO_LANGS.map((l) => <option key={l} value={l}>{AUDIO_LABEL[l]} audio</option>)}
              </select>
              <select className={sel} value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })}>
                <option value="sub">Subtitled (original audio)</option><option value="dub">Dubbed</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />Published</label>
            <div className="flex gap-2"><Button type="button" variant="ghost" onClick={() => setForm(null)}>Cancel</Button><Button type="submit" variant="hero" className="flex-1">Save episode</Button></div>
          </form>
        ) : (
          <>
            <Button variant="hero" onClick={() => setForm({ episode_number: next, title: "", video_url: "", audio_language: "japanese", version: "sub", published: true })}><Plus />Add episode</Button>
            <div className="space-y-2">
              {eps.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No episodes yet.</p>}
              {eps.map((ep) => (
                <div key={ep.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-brand text-sm font-bold">{ep.episode_number}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{ep.title}</p>
                    <p className="text-xs text-muted-foreground">{AUDIO_LABEL[ep.audio_language]} · {ep.version === "dub" ? "Dub" : "Sub"} · {ep.published ? "Published" : "Draft"}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => togglePub(ep)}>{ep.published ? <EyeOff /> : <Eye />}</Button>
                  <Button size="sm" variant="ghost" onClick={() => setForm({ id: ep.id, episode_number: String(ep.episode_number), title: ep.title, video_url: ep.video_url, audio_language: ep.audio_language, version: ep.version, published: ep.published })}><Pencil /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setDel(ep)}><Trash2 className="text-destructive" /></Button>
                </div>
              ))}
            </div>
          </>
        )}
        <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Delete episode {del?.episode_number}?</AlertDialogTitle>
              <AlertDialogDescription>“{del?.title}” will be removed permanently.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove}>Delete</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
