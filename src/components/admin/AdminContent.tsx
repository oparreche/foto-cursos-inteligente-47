
import React, { useState, useEffect, ErrorInfo } from "react";
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

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error, errorInfo: ErrorInfo) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error, errorInfo: ErrorInfo) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
    this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro na renderização</AlertTitle>
          <AlertDescription>
            <p>Ocorreu um erro ao carregar o conteúdo: {this.state.error?.message}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Verifique o console para mais detalhes.
            </p>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

const AdminContent: React.FC<AdminContentProps> = ({ userRole, showDiagnostics }) => {
  const [renderState, setRenderState] = useState<RenderState>({
    mainLayoutLoaded: true,
    adminAccessLoaded: true,
    adminTabsStarted: false,
    adminTabsLoaded: false,
  });
  
  const [contentError, setContentError] = useState<string | null>(null);

  // Use useEffect para modificar o estado com segurança e evitar loops de renderização
  useEffect(() => {
    try {
      console.log("AdminContent montado");
      setRenderState(prev => ({...prev, adminTabsStarted: true}));
      // Após os tabs serem iniciados, marcá-los como carregados
      setRenderState(prev => ({...prev, adminTabsLoaded: true}));
    } catch (error) {
      console.error("Erro ao inicializar estado de AdminTabs:", error);
      setContentError(`Erro ao inicializar AdminTabs: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, []);

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error("Erro capturado em AdminContent:", error, errorInfo);
    setContentError(`${error.message}\n${errorInfo.componentStack}`);
  };

  return (
    <>
      {/* Sempre mostrar o componente de diagnóstico para ajudar na depuração */}
      {showDiagnostics && <DiagnosticDisplay />}
      
      {/* Mostrar o estado atual de renderização */}
      <RenderStateTracker renderState={renderState} />
      
      {contentError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro no conteúdo</AlertTitle>
          <AlertDescription>
            <p>{contentError}</p>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Renderizar AdminTabs com ErrorBoundary */}
      <ErrorBoundary onError={handleError}>
        <AdminTabs />
      </ErrorBoundary>
      
      {/* Renderização condicional de PermissionsSheet */}
      {(userRole === 'admin' || userRole === 'super_admin') && 
        <PermissionsSheet userRole={userRole} />}
    </>
  );
};

export default AdminContent;
