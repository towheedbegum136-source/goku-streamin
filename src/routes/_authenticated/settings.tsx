import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/lib/settings";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/settings")({
  beforeLoad: async ({ context }) => {
    // UI gate only — updates are also enforced by database policies (has_role admin).
    const { data } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    if (!data) throw redirect({ to: "/account" });
  },
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Site Settings — Goku Streaming" },
      { name: "description", content: "Edit the Goku Streaming site name and settings." },
      { property: "og:title", content: "Site Settings — Goku Streaming" },
      { property: "og:description", content: "Goku Streaming site settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SiteSettingsPage,
});

function SiteSettingsPage() {
  const { t } = useI18n();
  const current = useSiteSettings();
  const [siteName, setSiteName] = useState(current.site_name);
  const [tagline, setTagline] = useState(current.tagline);
  const [footerNote, setFooterNote] = useState(current.footer_note);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSiteName(current.site_name);
    setTagline(current.tagline);
    setFooterNote(current.footer_note);
  }, [current]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) {
      toast.error(t("siteNameRequired"));
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        site_name: siteName.trim(),
        tagline: tagline.trim(),
        footer_note: footerNote.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t("settingsSaved"));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-3xl border border-border bg-card p-8">
        <div className="flex items-center gap-4">
          <SettingsIcon className="size-9 text-brand" />
          <div>
            <h1 className="text-3xl font-extrabold">{t("settings")}</h1>
            <p className="text-sm text-muted-foreground">{t("settingsDesc")}</p>
          </div>
        </div>
        <form onSubmit={save} className="mt-8 space-y-5">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">{t("siteName")}</label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} maxLength={60} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">{t("tagline")}</label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={120} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">{t("footerNote")}</label>
            <Textarea value={footerNote} onChange={(e) => setFooterNote(e.target.value)} maxLength={200} rows={3} />
          </div>
          <Button type="submit" variant="hero" disabled={saving}>
            <Save /> {saving ? t("saving") : t("save")}
          </Button>
        </form>
      </div>
    </div>
  );
}
