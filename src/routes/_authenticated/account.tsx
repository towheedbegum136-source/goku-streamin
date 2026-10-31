import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LogoMark } from "@/components/Logo";
import { LanguageSelect } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "My account — Goku Streaming" },
      { name: "description", content: "Your Goku Streaming account." },
      { property: "og:title", content: "My account — Goku Streaming" },
      { property: "og:description", content: "Manage your Goku Streaming account." },
    ],
  }),
  component: Account,
});

function Account() {
  const { user, isAdmin } = useAuth();
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-3xl border border-border bg-card p-8">
        <div className="flex items-center gap-4"><LogoMark size={56} /><h1 className="text-3xl font-extrabold">{t("account")}</h1></div>
        <dl className="mt-8 space-y-4 text-sm">
          <div><dt className="text-muted-foreground">{t("signedInAs")}</dt><dd className="text-lg font-semibold">{user?.email}</dd></div>
          <div><dt className="text-muted-foreground">{t("role")}</dt><dd className="font-semibold">{isAdmin ? t("administrator") : t("member")}</dd></div>
          <div><dt className="mb-1 text-muted-foreground">{t("language")}</dt><dd><LanguageSelect /></dd></div>
        </dl>
        {isAdmin && <Button asChild variant="hero" className="mt-8"><Link to="/admin"><Shield />{t("admin")}</Link></Button>}
      </div>
    </div>
  );
}
