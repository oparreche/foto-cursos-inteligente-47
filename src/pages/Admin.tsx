
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isAuthenticated = !!session?.user;
        setAuthenticated(isAuthenticated);
        
        if (session?.user) {
          setUserId(session.user.id);
          
          // Verificar se existe algum usuário na tabela user_roles
          const { count: roleCount, error: countError } = await supabase
            .from('user_roles')
            .select('*', { count: 'exact', head: true });
            
          if (countError) {
            console.error("Erro ao verificar contagem de funções:", countError);
          } else if (roleCount === 0) {
            console.log("Nenhuma função encontrada, configurando primeiro usuário como administrador");
            
            // Se não existe nenhum usuário com função, o primeiro usuário se torna admin
            if (session.user.email === "midiaputz@gmail.com") {
              await assignHighestAdminRole(session.user.id);
            } else {
              await createAdminRole(session.user.id);
            }
          }
          
          // Fetch the user's role from the user_roles table
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (roleError && roleError.code !== 'PGRST116') {
            console.error("Erro ao buscar função do usuário:", roleError);
            toast.error("Erro ao verificar permissões de usuário");
          }
          
          // Set the user role (default to viewer if not found)
          const role = roleData?.role || 'viewer';
          setUserRole(role);
          console.log("Função do usuário definida como:", role);
        }
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        toast.error("Erro ao verificar autenticação");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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

  const createAdminRole = async (userId: string) => {
    try {
      // Check if the user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingRole) {
        console.log("Usuário já tem função atribuída");
        return;
      }

      // Create admin role for the user
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) {
        throw error;
      }
      
      toast.success("Função de administrador atribuída automaticamente!");
      setUserRole('admin');
    } catch (error) {
      console.error("Erro ao criar função de administrador:", error);
      toast.error("Erro ao atribuir função de administrador");
    }
  };

  return (
    <MainLayout>
      <AdminAccess authenticated={authenticated} isLoading={isLoading}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="heading-lg mb-6">Painel de Administração</h1>
          
          <AdminTabs />
          
          {(userRole === 'admin' || userRole === 'super_admin') && 
            <PermissionsSheet userRole={userRole} />}
        </div>
      </AdminAccess>
    </MainLayout>
  );
};

export default Admin;
