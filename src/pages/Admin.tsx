
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContent from "@/components/admin/AdminContent";
import AdminErrorDisplay from "@/components/admin/AdminErrorDisplay";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Admin = () => {
  // Sempre habilitar diagnósticos durante desenvolvimento
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [hasRendered, setHasRendered] = useState(false);
  
  const {
    authenticated,
    userRole,
    isLoading,
    error
  } = useAdminAuth();

  useEffect(() => {
    console.log("Admin page renderizada em", new Date().toISOString());
    console.log("Estado de autenticação:", { authenticated, userRole, isLoading, error });
    
    try {
      // Adicionar uma verificação de montagem bem-sucedida
      setTimeout(() => {
        if (!document.querySelector("[data-admin-rendered='true']")) {
          console.error("Admin page não renderizou elementos esperados após timeout");
          setErrorInfo(prev => prev || "Falha na renderização da página - componentes não encontrados no DOM");
        }
      }, 2000);
      
      // Capturar erros não tratados em promises
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        console.error("Rejeição não tratada:", event.reason);
        setErrorInfo(`Erro não tratado: ${event.reason?.message || String(event.reason)}`);
      };
      
      // Capturar erros JavaScript
      const handleError = (event: ErrorEvent) => {
        console.error("Erro JavaScript:", event.message);
        setErrorInfo(`Erro JavaScript: ${event.message}`);
      };
      
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('error', handleError);
      
      // Tornar o painel de diagnóstico alternável com atalho de teclado
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'D' && e.ctrlKey) {
          setShowDiagnostics(prev => !prev);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      setHasRendered(true);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);
      };
    } catch (err) {
      console.error("Erro no useEffect do Admin:", err);
      setErrorInfo(`Erro no ciclo de vida do Admin: ${err instanceof Error ? err.message : String(err)}`);
      return () => {};
    }
  }, [authenticated, userRole, isLoading, error]);

  // Adicionar um limite de segurança simples
  if (error || errorInfo) {
    return <AdminErrorDisplay error={error || errorInfo || "Erro desconhecido na página Admin"} />;
  }

  return (
    <MainLayout>
      <div data-admin-rendered="true">
        {showDiagnostics && <AdminErrorDisplay error="Painel de diagnóstico (modo forçado)" />}
        
        <AdminAccess authenticated={authenticated} isLoading={isLoading}>
          <div className="container mx-auto px-4 py-8">
            <AdminHeader />
            <AdminContent userRole={userRole} showDiagnostics={showDiagnostics} />
          </div>
        </AdminAccess>
      </div>
    </MainLayout>
  );
};

export default Admin;
