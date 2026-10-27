import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthCard, GoogleIcon } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { safeRedirect, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => ({ redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined }),
  head: () => ({
    meta: [
      { title: "Login — Goku Streaming" },
      { name: "description", content: "Log in to your Goku Streaming account." },
      { property: "og:title", content: "Login — Goku Streaming" },
      { property: "og:description", content: "Log in to Goku Streaming." },
    ],
  }),
  component: Login,
});

export async function googleSignIn() {
  const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
  if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
}

function Login() {
  const { t } = useI18n();
  const { redirect } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const target = safeRedirect(redirect ? new URL(redirect, "http://x").pathname : "/");

  useEffect(() => { if (user) navigate({ to: target }); }, [user, target, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Wrong email or password." :
        error.message.includes("Email not confirmed") ? "Please confirm your email first — check your inbox." : error.message);
      return;
    }
    toast.success("Welcome back!");
  };

  const forgot = async () => {
    if (!email) { toast.error("Enter your email first."); return; }
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    toast.success(t("resetSent"));
  };

  return (
    <AuthCard title={t("welcomeBack")}>
      <Button variant="glass" size="lg" className="w-full" onClick={googleSignIn}><GoogleIcon />{t("continueGoogle")}</Button>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />{t("or")}<div className="h-px flex-1 bg-border" /></div>
      <form onSubmit={submit} className="space-y-3">
        <Input type="email" required placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
        <Input type="password" required placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>{t("login")}</Button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <button onClick={forgot} className="text-muted-foreground hover:text-foreground">{t("forgot")}</button>
        <Link to="/signup" className="text-primary">{t("signup")}</Link>
      </div>
    </AuthCard>
  );
}
