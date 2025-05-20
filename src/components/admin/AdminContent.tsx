
import React, { useState, useEffect } from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import PermissionsSheet from "@/components/admin/PermissionsSheet";
import DiagnosticDisplay from "@/components/admin/DiagnosticDisplay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import RenderStateTracker, { RenderState } from "@/components/admin/RenderStateTracker";

interface AdminContentProps {
  userRole: string;
  showDiagnostics: boolean;
}

const AdminContent: React.FC<AdminContentProps> = ({ userRole, showDiagnostics }) => {
  const [renderState, setRenderState] = useState<RenderState>({
    mainLayoutLoaded: true,
    adminAccessLoaded: true,
    adminTabsStarted: false,
    adminTabsLoaded: false,
  });

  // Use useEffect to modify the state safely and avoid render loops
  useEffect(() => {
    try {
      setRenderState(prev => ({...prev, adminTabsStarted: true}));
      // After the tabs are started, mark them as loaded
      setRenderState(prev => ({...prev, adminTabsLoaded: true}));
    } catch (error) {
      console.error("Erro ao inicializar estado de AdminTabs:", error);
    }
  }, []);

  // Moved the tabs rendering out of the function to avoid re-renders
  const renderAdminTabs = () => {
    try {
      return <AdminTabs />;
    } catch (error) {
      console.error("Erro ao renderizar AdminTabs:", error);
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar interface</AlertTitle>
          <AlertDescription>
            Ocorreu um erro ao carregar a interface de administração. 
            Detalhes: {error instanceof Error ? error.message : "Erro desconhecido"}
          </AlertDescription>
        </Alert>
      );
    }
  };

  return (
    <>
      {/* Always show the diagnostic component to help debug */}
      {showDiagnostics && <DiagnosticDisplay />}
      
      {/* Show the current rendering state */}
      <RenderStateTracker renderState={renderState} />
      
      {/* Render AdminTabs */}
      {renderAdminTabs()}
      
      {/* Conditional rendering of PermissionsSheet */}
      {(userRole === 'admin' || userRole === 'super_admin') && 
        <PermissionsSheet userRole={userRole} />}
    </>
  );
};

export default AdminContent;
