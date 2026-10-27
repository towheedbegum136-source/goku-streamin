import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, GoogleIcon } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { googleSignIn } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Goku Streaming" },
      { name: "description", content: "Create your free Goku Streaming account." },
      { property: "og:title", content: "Sign up — Goku Streaming" },
      { property: "og:description", content: "Join Goku Streaming." },
    ],
  }),
  component: Signup,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

function Signup() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/" }); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({ ...parsed.data, options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };

  return (
    <AuthCard title={t("createAccount")}>
      {sent ? (
        <p className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-center text-sm">{t("checkEmail")}</p>
      ) : (
        <>
          <Button variant="glass" size="lg" className="w-full" onClick={googleSignIn}><GoogleIcon />{t("continueGoogle")}</Button>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />{t("or")}<div className="h-px flex-1 bg-border" /></div>
          <form onSubmit={submit} className="space-y-3">
            <Input type="email" required placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
            <Input type="password" required placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>{t("signup")}</Button>
          </form>
        </>
      )}
      <p className="mt-4 text-center text-sm text-muted-foreground">{t("haveAccount")} <Link to="/login" search={{ redirect: undefined }} className="text-primary">{t("login")}</Link></p>
    </AuthCard>
  );
}
