import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Goku Streaming" },
      { name: "description", content: "Choose a new password for Goku Streaming." },
      { property: "og:title", content: "Reset password — Goku Streaming" },
      { property: "og:description", content: "Reset your Goku Streaming password." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const { t } = useI18n();
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/" });
  };
  return (
    <AuthCard title={t("updatePassword")}>
      <form onSubmit={submit} className="space-y-3">
        <Input type="password" placeholder={t("newPassword")} value={pw} onChange={(e) => setPw(e.target.value)} className="h-11" />
        <Button type="submit" variant="hero" size="lg" className="w-full">{t("updatePassword")}</Button>
      </form>
    </AuthCard>
  );
}
