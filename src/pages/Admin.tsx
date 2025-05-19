
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminAccess from "@/components/admin/AdminAccess";
import PermissionsSheet from "@/components/admin/PermissionsSheet";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('viewer');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session?.user);
      
      if (session?.user) {
        // In a real app, you would fetch the user's role from your database
        // For now, we'll just set it to admin
        setUserRole('admin');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session?.user);
      if (session?.user) {
        setUserRole('admin');
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
          
          <PermissionsSheet userRole={userRole} />
        </div>
      </AdminAccess>
    </MainLayout>
  );
};

export default Admin;
