
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminAccess from "@/components/admin/AdminAccess";
import PermissionsSheet from "@/components/admin/PermissionsSheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { assignHighestAdminRole } from "@/components/admin/services/roleService";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('viewer');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Admin page - checking authentication");
        const { data: { session } } = await supabase.auth.getSession();
        const isAuthenticated = !!session?.user;
        setAuthenticated(isAuthenticated);
        
        if (session?.user) {
          console.log("User authenticated:", session.user.email);
          setUserId(session.user.id);
          
          // Verificar se existe algum usuário na tabela user_roles
          const { count: roleCount, error: countError } = await supabase
            .from('user_roles')
            .select('*', { count: 'exact', head: true });
            
          if (countError) {
            console.error("Erro ao verificar contagem de funções:", countError);
            setError("Erro ao verificar permissões de usuário");
          } else if (roleCount === 0) {
            console.log("Nenhuma função encontrada, configurando primeiro usuário como administrador");
            
            // Se não existe nenhum usuário com função, o primeiro usuário se torna admin
            await assignHighestAdminRole(session.user.id);
            setUserRole('super_admin');
          } else {
            // Fetch the user's role from the user_roles table
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
              
            if (roleError && roleError.code !== 'PGRST116') {
              console.error("Erro ao buscar função do usuário:", roleError);
              setError("Erro ao verificar permissões de usuário");
            } else {
              // Set the user role (default to viewer if not found)
              const role = roleData?.role || 'viewer';
              console.log("Função do usuário definida como:", role);
              setUserRole(role);
            }
          }
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        setError("Erro ao verificar autenticação");
        toast.error("Erro ao verificar autenticação");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      const isAuthenticated = !!session?.user;
      setAuthenticated(isAuthenticated);
      
      if (session?.user) {
        setUserId(session.user.id);
        try {
          // Fetch the user's role from the user_roles table
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (roleError && roleError.code !== 'PGRST116') {
            console.error("Erro ao buscar função do usuário:", roleError);
          }
          
          // Set the user role (default to viewer if not found)
          setUserRole(roleData?.role || 'viewer');
        } catch (error) {
          console.error("Erro ao buscar função na alteração de autenticação:", error);
        }
      } else {
        setUserId(null);
        setUserRole('viewer');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <MainLayout>
      <AdminAccess authenticated={authenticated} isLoading={isLoading}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <AdminTabs />
          
          {(userRole === 'admin' || userRole === 'super_admin') && 
            <PermissionsSheet userRole={userRole} />}
        </div>
      </AdminAccess>
    </MainLayout>
  );
};

export default Admin;
