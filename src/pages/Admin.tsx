
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContent from "@/components/admin/AdminContent";
import AdminErrorDisplay from "@/components/admin/AdminErrorDisplay";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Admin = () => {
  // Always enable diagnostics when developing
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  
  const {
    authenticated,
    userRole,
    isLoading,
    error
  } = useAdminAuth();

  useEffect(() => {
    console.log("Admin page rendered at", new Date().toISOString());
    
    // Make the diagnostic panel toggleable with a keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'D' && e.ctrlKey) {
        setShowDiagnostics(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Add a simple error boundary
  if (error) {
    return <AdminErrorDisplay error={error} />;
  }

  return (
    <MainLayout>
      <AdminAccess authenticated={authenticated} isLoading={isLoading}>
        <div className="container mx-auto px-4 py-8">
          <AdminHeader />
          <AdminContent userRole={userRole} showDiagnostics={showDiagnostics} />
        </div>
      </AdminAccess>
    </MainLayout>
  );
};

export default Admin;
