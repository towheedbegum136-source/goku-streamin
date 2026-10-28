import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  site_name: string;
  tagline: string;
  footer_note: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "Goku Streaming",
  tagline: "Your anime. Full power.",
  footer_note: "Stream responsibly. Only authorised content is published.",
};

const Ctx = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("site_name, tagline, footer_note")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setSettings(data);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
}

export const useSiteSettings = () => useContext(Ctx);
