import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Search, X, Globe, Shield, User, Settings } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function LanguageSelect() {
  const { lang, setLang, t } = useI18n();
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <Globe className="size-4" />
      <span className="sr-only">{t("language")}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="rounded-lg border border-border bg-card px-2 py-1.5 text-foreground"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/login", replace: true });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/search", search: { q } });
  };

  const links = (
    <>
      <Link to="/" className="hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }} onClick={() => setOpen(false)}>{t("home")}</Link>
      <Link to="/anime" search={{ genre: "" }} className="hover:text-foreground" activeProps={{ className: "text-foreground" }} onClick={() => setOpen(false)}>{t("browse")}</Link>
      <Link to="/about" className="hover:text-foreground" activeProps={{ className: "text-foreground" }} onClick={() => setOpen(false)}>{t("about")}</Link>
      {isAdmin && (
        <Link to="/admin" className="flex items-center gap-1 hover:text-foreground" onClick={() => setOpen(false)}>
          <Shield className="size-4" /> {t("admin")}
        </Link>
      )}
      {isAdmin && (
        <Link to="/settings" className="flex items-center gap-1 hover:text-foreground" onClick={() => setOpen(false)}>
          <Settings className="size-4" /> {t("settings")}
        </Link>
      )}
    </>
  );

  const authButtons = user ? (
    <>
      <Button asChild variant="glass" size="sm"><Link to="/account" onClick={() => setOpen(false)}><User />{t("account")}</Link></Button>
      <Button variant="ghost" size="sm" onClick={signOut}>{t("logout")}</Button>
    </>
  ) : (
    <>
      <Button asChild variant="ghost" size="sm"><Link to="/login" onClick={() => setOpen(false)}>{t("login")}</Link></Button>
      <Button asChild variant="hero" size="sm"><Link to="/signup" onClick={() => setOpen(false)}>{t("signup")}</Link></Button>
    </>
  );

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">{links}</nav>
        <form onSubmit={submit} className="ml-auto hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")}
              className="h-9 w-56 rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring" />
          </div>
        </form>
        <div className="hidden items-center gap-3 lg:flex"><LanguageSelect />{authButtons}</div>
        <button className="ml-auto md:ml-0 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border px-4 pb-6 pt-4 lg:hidden">
          <form onSubmit={submit} className="mb-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm" />
          </form>
          <nav className="flex flex-col gap-4 text-base font-medium text-muted-foreground">{links}</nav>
          <div className="mt-5 flex flex-wrap items-center gap-3"><LanguageSelect />{authButtons}</div>
        </div>
      )}
    </header>
  );
}
