
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContent from "@/components/admin/AdminContent";
import AdminErrorDisplay from "@/components/admin/AdminErrorDisplay";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";

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
      // Verificar módulos críticos
      console.log("Verificando disponibilidade de módulos críticos...");
      import("@/components/admin/AIManagement")
        .then(() => console.log("AIManagement importado com sucesso"))
        .catch(err => {
          console.error("Erro ao importar AIManagement:", err);
          setErrorInfo("Falha ao carregar o módulo AIManagement: " + err.message);
          toast.error("Erro ao carregar módulo IA");
        });
      
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
        toast.error("Erro não tratado detectado");
      };
      
      // Capturar erros JavaScript
      const handleError = (event: ErrorEvent) => {
        console.error("Erro JavaScript:", event.message);
        setErrorInfo(`Erro JavaScript: ${event.message}`);
        toast.error("Erro JavaScript detectado");
      };
      
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('error', handleError);
      
      // Tornar o painel de diagnóstico alternável com atalho de teclado
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'D' && e.ctrlKey) {
          setShowDiagnostics(prev => !prev);
          toast.info(prev => prev ? "Diagnóstico desativado" : "Diagnóstico ativado");
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      setHasRendered(true);
      
      // Simular navegação por hash se necessário
      if (window.location.hash === "#ai") {
        setTimeout(() => {
          const aiTab = document.querySelector('[data-value="ai"]');
          if (aiTab instanceof HTMLElement) {
            console.log("Forçando abertura da aba AI por hash");
            aiTab.click();
          }
        }, 500);
      }
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleError);
      };
    } catch (err) {
      console.error("Erro no useEffect do Admin:", err);
      setErrorInfo(`Erro no ciclo de vida do Admin: ${err instanceof Error ? err.message : String(err)}`);
      toast.error("Erro crítico no Admin");
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
