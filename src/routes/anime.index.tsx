import { createFileRoute } from "@tanstack/react-router";
import { Browse } from "@/components/Browse";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/anime/")({
  head: () => ({
    meta: [
      { title: "Browse anime — Goku Streaming" },
      { name: "description", content: "Browse every anime on Goku Streaming by genre, language and status." },
      { property: "og:title", content: "Browse anime — Goku Streaming" },
      { property: "og:description", content: "Filter anime by genre, audio language and status." },
    ],
  }),
  component: () => {
    const { t } = useI18n();
    return <Browse title={t("browse")} />;
  },
});
