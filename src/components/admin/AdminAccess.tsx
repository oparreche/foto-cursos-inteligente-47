
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

interface AdminAccessProps {
  authenticated: boolean;
  children: React.ReactNode;
  isLoading?: boolean;
}

const AdminAccess = ({ authenticated, children, isLoading = false }: AdminAccessProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

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
        console.log("Usuário autenticado:", session.user.email);

        // Check for user role in the user_roles table
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) {
          // If error is "no rows matched", user has no role assigned
          if (roleError.code === 'PGRST116') {
            console.log("Nenhum papel encontrado para o usuário, verificando se é admin");
            
            // Try to assign admin role to the first user if no roles exist in the table
            const { count, error: countError } = await supabase
              .from('user_roles')
              .select('*', { count: 'exact', head: true });
            
            if (!countError && count === 0) {
              console.log("Nenhum papel existe, atribuindo papel de admin ao primeiro usuário");
              await assignDefaultAdminRole(session.user.id);
              setUserRole('admin');
            } else {
              console.log("Papéis existem, mas usuário não tem nenhum");
              setUserRole(null);
            }
          } else {
            console.error("Erro ao buscar papel do usuário:", roleError);
            toast.error("Erro ao verificar permissões de usuário");
            setUserRole(null);
          }
        } else {
          console.log("Papel do usuário encontrado:", roleData?.role);
          setUserRole(roleData?.role || null);
        }
      } catch (error) {
        console.error("Erro ao verificar papel do usuário:", error);
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
        .insert({ user_id: userId, role: 'admin' });
      
      if (error) {
        throw error;
      }
      
      toast.success("Função de administrador atribuída com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atribuir função de administrador:", error);
      toast.error("Erro ao atribuir função de administrador");
      return false;
    }
  }
  
  // Here's the fix - change the function to use 'admin' role instead of 'super_admin'
  const assignHighestAdminRole = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: 'admin' });
      
      if (error) {
        throw error;
      }
      
      toast.success("Função de Administrador Máximo atribuída com sucesso!");
      setUserRole('admin');
      return true;
    } catch (error) {
      console.error("Erro ao atribuir função de administrador máximo:", error);
      toast.error("Erro ao atribuir função de administrador máximo");
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
  
  const handleAssignHighestAdminRole = async () => {
    if (!userId) return;
    
    const success = await assignHighestAdminRole(userId);
    if (success) {
      setUserRole('admin');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
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
          <Button onClick={handleLoginRedirect}>Login</Button>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin' && userRole !== 'instructor') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Permissão Negada</AlertTitle>
          <AlertDescription>
            Você não tem permissão para acessar o painel de administração.
            É necessário ter função de administrador ou instrutor.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 flex flex-col items-center space-y-4">
          <p className="text-center text-muted-foreground">
            Se você é o primeiro usuário do sistema, clique no botão abaixo para assumir o papel de administrador.
          </p>
          <Button onClick={handleAssignAdminRole}>
            Tornar-me Administrador
          </Button>
          <Button onClick={handleAssignHighestAdminRole} variant="outline">
            Tornar-me Administrador Máximo
          </Button>
          <Button asChild variant="outline" className="mt-2">
            <Link to="/">Voltar para página inicial</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAccess;
