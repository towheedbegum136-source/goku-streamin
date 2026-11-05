import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/i18n";
import { useSiteSettings } from "@/lib/settings";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppInstall } from "@/lib/app-install";

export function SiteFooter() {
  const { t } = useI18n();
  const { site_name, footer_note } = useSiteSettings();
  const { requestInstall, busy } = useAppInstall();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <Logo size={36} />
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/">{t("home")}</Link>
          <Link to="/anime" search={{ genre: "" }}>{t("browse")}</Link>
          <Link to="/search" search={{ q: "" }}>{t("search")}</Link>
          <Link to="/about">{t("about")}</Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site_name}. {footer_note || t("footer")}
        </p>
      </div>
      <div className="mx-auto flex max-w-7xl justify-center px-4 pb-8 md:px-6">
        <Button variant="hero" size="lg" disabled={busy} onClick={() => void requestInstall()}><Download />{busy ? "Installing…" : "Install App"}</Button>
      </div>
    </footer>
  );
}
