
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminAccess from "@/components/admin/AdminAccess";
import PermissionsSheet from "@/components/admin/PermissionsSheet";

const Admin = () => {
  const [authenticated] = useState(true); // In a real app, this would check authentication
  const [userRole] = useState('admin'); // In a real app, this would come from auth state

  return (
    <MainLayout>
      <AdminAccess authenticated={authenticated}>
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
