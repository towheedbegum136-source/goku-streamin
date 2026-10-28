import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Play, ShieldCheck, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Goku Streaming" },
      { name: "description", content: "Goku Streaming is a neon-lit home for anime fans — Dragon Ball, One Piece, Naruto and more, in English, Hindi and Telugu." },
      { property: "og:title", content: "About — Goku Streaming" },
      { property: "og:description", content: "Learn what Goku Streaming is and how it works." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  const cards = [
    { icon: Sparkles, text: t("aboutP1") },
    { icon: Globe, text: t("aboutP2") },
    { icon: ShieldCheck, text: t("aboutP3") },
  ];
  return (
    <div className="mx-auto max-w-4xl px-4 pt-16 md:px-6">
      <div className="flex flex-col items-center text-center">
        <LogoMark size={96} />
        <h1 className="mt-8 text-4xl font-black md:text-5xl">{t("aboutTagline")}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("heroDesc")}</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {cards.map(({ icon: Icon, text }, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="hero" size="xl">
          <Link to="/anime" search={{ genre: "" }}><Play className="fill-current" />{t("startWatching")}</Link>
        </Button>
        <Button asChild variant="glass" size="xl">
          <Link to="/signup">{t("createAccount")}</Link>
        </Button>
      </div>
    </div>
  );
}
