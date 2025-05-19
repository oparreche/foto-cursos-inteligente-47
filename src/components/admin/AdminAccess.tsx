
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminAccessProps {
  authenticated: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
}

const AdminAccess = ({ authenticated, children, isLoading = false }: AdminAccessProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

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

        setUserId(session.user.id);

        // Check for user role in the user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) {
          // If error is "no rows matched", user has no role assigned
          if (roleError.code === 'PGRST116') {
            console.log("No role found for user, checking if admin");
            
            // Try to assign admin role to the first user if no roles exist in the table
            const { count, error: countError } = await supabase
              .from('user_roles')
              .select('*', { count: 'exact', head: true });
            
            if (!countError && count === 0) {
              console.log("No roles exist, assigning admin role to first user");
              await assignDefaultAdminRole(session.user.id);
              setUserRole('admin');
            } else {
              console.log("Roles exist but user has none");
              setUserRole(null);
            }
          } else {
            console.error("Error fetching user role:", roleError);
            toast.error("Erro ao verificar permissões de usuário");
            setUserRole(null);
          }
        } else {
          setUserRole(roleData?.role || null);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        toast.error("Erro ao verificar funções de usuário");
      } finally {
        setCheckingRole(false);
      }
    };

    checkUserRole();
  }, [authenticated]);

  const assignDefaultAdminRole = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: 'admin' }]);
      
      if (error) {
        throw error;
      }
      
      toast.success("Função de administrador atribuída com sucesso!");
      return true;
    } catch (error) {
      console.error("Error assigning admin role:", error);
      toast.error("Erro ao atribuir função de administrador");
      return false;
    }
  }

  const handleAssignAdminRole = async () => {
    if (!userId) return;
    
    const success = await assignDefaultAdminRole(userId);
    if (success) {
      setUserRole('admin');
    }
  };

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
        
        <div className="mt-6 flex flex-col items-center space-y-4">
          <p className="text-center text-muted-foreground">
            Se você é o primeiro usuário do sistema, clique no botão abaixo para assumir o papel de administrador.
          </p>
          <Button onClick={handleAssignAdminRole}>
            Tornar-me Administrador
          </Button>
          <Button asChild variant="outline" className="mt-2">
            <a href="/">Voltar para página inicial</a>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAccess;
