import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Settings, Shield, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { LogoMark } from "@/components/Logo";
import { LanguageSelect } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/me")({
  head: () => ({ meta: [
    { title: "Me — Goku Streaming" },
    { name: "description", content: "Your Goku Streaming profile and settings." },
    { property: "og:title", content: "Me — Goku Streaming" },
    { property: "og:description", content: "Your profile, account and settings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Me,
});

function Me() {
  const { user, isAdmin, loading } = useAuth();
  const name = user?.user_metadata?.["full_name"] ?? user?.email?.split("@")[0];
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-4"><LogoMark size={56} />
          <div><h1 className="text-2xl font-extrabold">{loading ? "…" : user ? name : "Guest"}</h1>
            <p className="text-sm text-muted-foreground">{user ? user.email : "Sign in to see your account"}</p></div></div>
        {user ? (
          <dl className="mt-6 space-y-3 text-sm">
            <div><dt className="text-muted-foreground">Role</dt><dd className="font-semibold">{isAdmin ? "Administrator" : "Member"}</dd></div>
            <div><dt className="text-muted-foreground">Joined</dt><dd className="font-semibold">{new Date(user.created_at).toLocaleDateString()}</dd></div>
          </dl>
        ) : (
          <div className="mt-6 flex gap-3"><Button asChild variant="hero"><Link to="/login">Log in</Link></Button><Button asChild variant="glass"><Link to="/signup">Sign up</Link></Button></div>
        )}
        <div className="mt-6 border-t border-border pt-6"><p className="mb-2 text-sm font-semibold">Settings</p><LanguageSelect /></div>
        <div className="mt-6 flex flex-wrap gap-3">
          {user && <Button asChild variant="glass"><Link to="/account"><User />Account</Link></Button>}
          <Button asChild variant="glass"><Link to="/downloads"><Download />Downloads</Link></Button>
          {isAdmin && <Button asChild variant="glass"><Link to="/settings"><Settings />Site settings</Link></Button>}
          {isAdmin && <Button asChild variant="hero"><Link to="/admin"><Shield />Admin</Link></Button>}
        </div>
      </div>
    </div>
  );
}
