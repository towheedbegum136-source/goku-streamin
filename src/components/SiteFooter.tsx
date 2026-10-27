import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <Logo size={36} />
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/">{t("home")}</Link>
          <Link to="/anime">{t("browse")}</Link>
          <Link to="/search" search={{ q: "" }}>{t("search")}</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Goku Streaming. {t("footer")}</p>
      </div>
    </footer>
  );
}
