
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUserAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Verificar o status de autenticação
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        setCurrentUserId(session.user.id);
      } else {
        setCurrentUserId(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, currentUserId };
}
