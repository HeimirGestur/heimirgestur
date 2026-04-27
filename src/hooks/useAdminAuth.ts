import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export const useAdminAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const checkRole = async (currentUser: User | null) => {
      if (!currentUser) {
        if (active) {
          setIsAdmin(false);
          setIsLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("user_roles" as never)
        .select("role" as never)
        .eq("user_id", currentUser.id)
        .eq("role", "admin")
        .maybeSingle();

      if (active) {
        setIsAdmin(Boolean(data && !error));
        setIsLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsLoading(true);
      setTimeout(() => void checkRole(nextSession?.user ?? null), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      void checkRole(data.session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, user, isAdmin, isLoading };
};
