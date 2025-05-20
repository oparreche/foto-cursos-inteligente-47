
import React, { useState } from "react";
import AdminTabs from "@/components/admin/AdminTabs";
import PermissionsSheet from "@/components/admin/PermissionsSheet";
import DiagnosticDisplay from "@/components/admin/DiagnosticDisplay";
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  // Simple fallback before AdminTabs is rendered
  const renderAdminTabs = () => {
    try {
      setRenderState(prev => ({...prev, adminTabsStarted: true}));
      const tabs = <AdminTabs />;
      setRenderState(prev => ({...prev, adminTabsLoaded: true}));
      return tabs;
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
      
      {/* Wrap AdminTabs with try-catch to avoid blank screen */}
      {renderAdminTabs()}
      
      {(userRole === 'admin' || userRole === 'super_admin') && 
        <PermissionsSheet userRole={userRole} />}
    </>
  );
};

export default AdminContent;
