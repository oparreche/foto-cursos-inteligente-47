
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminAccess from "@/components/admin/AdminAccess";
import PermissionsSheet from "@/components/admin/PermissionsSheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('viewer');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isAuthenticated = !!session?.user;
        setAuthenticated(isAuthenticated);
        
        if (session?.user) {
          // Fetch the user's role from the user_roles table
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (roleError && roleError.code !== 'PGRST116') {
            console.error("Error fetching user role:", roleError);
            toast.error("Erro ao verificar permissões de usuário");
          }
          
          // Set the user role (default to viewer if not found)
          setUserRole(roleData?.role || 'viewer');
        }
      } catch (error) {
        console.error("Auth check error:", error);
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
        try {
          // Fetch the user's role from the user_roles table
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
          if (roleError && roleError.code !== 'PGRST116') {
            console.error("Error fetching user role:", roleError);
          }
          
          // Set the user role (default to viewer if not found)
          setUserRole(roleData?.role || 'viewer');
        } catch (error) {
          console.error("Error fetching role on auth change:", error);
        }
      } else {
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
          <h1 className="heading-lg mb-6">Painel de Administração</h1>
          
          <AdminTabs />
          
          {userRole === 'admin' && <PermissionsSheet userRole={userRole} />}
        </div>
      </AdminAccess>
    </MainLayout>
  );
};

export default Admin;
