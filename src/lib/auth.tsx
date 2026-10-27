import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = { user: User | null; session: Session | null; isAdmin: boolean; loading: boolean };
const Ctx = createContext<AuthState>({ user: null, session: null, isAdmin: false, loading: true });

async function fetchIsAdmin(userId: string) {
  // Role lives in a protected table; RLS lets users read only their own roles.
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, session: null, isAdmin: false, loading: true });

  useEffect(() => {
    const apply = async (session: Session | null) => {
      const user = session?.user ?? null;
      const isAdmin = user ? await fetchIsAdmin(user.id) : false;
      setState({ user, session, isAdmin, loading: false });
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => apply(session), 0);
    });
    supabase.auth.getSession().then(({ data }) => apply(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

export function safeRedirect(path: unknown): string {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//") ? path : "/";
}
