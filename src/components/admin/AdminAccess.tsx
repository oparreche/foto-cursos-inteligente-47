
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAccessProps {
  authenticated: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
}

const AdminAccess = ({ authenticated, children, isLoading = false }: AdminAccessProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!authenticated) {
        setCheckingRole(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCheckingRole(false);
          return;
        }

        // Check for user role in the user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError && roleError.code !== 'PGRST116') {
          console.error("Error fetching user role:", roleError);
        }

        setUserRole(roleData?.role || null);
      } catch (error) {
        console.error("Error checking user role:", error);
      } finally {
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, [authenticated]);

  if (isLoading || checkingRole) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso Restrito</AlertTitle>
          <AlertDescription>
            Você precisa estar logado para acessar o painel de administração.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 flex flex-col items-center">
          <p className="mb-4 text-center text-muted-foreground">
            Faça login para acessar as funcionalidades administrativas.
          </p>
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin' && userRole !== 'editor') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Permissão Negada</AlertTitle>
          <AlertDescription>
            Você não tem permissão para acessar o painel de administração.
            É necessário ter função de administrador ou editor.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <a href="/">Voltar para página inicial</a>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAccess;
