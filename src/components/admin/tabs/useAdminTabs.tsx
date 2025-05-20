
import { useState, useEffect, useCallback } from "react";

export const useAdminTabs = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    try {
      console.log("AdminTabs useEffect executando");
      setIsClient(true);
      
      // Verificar se hash está definido para a aba AI
      if (window.location.hash === "#ai") {
        console.log("AI tab selecionada por hash");
        setActiveTab("ai");
      }
      
      // Registrar rota atual para depuração
      console.log("Rota atual:", window.location.pathname);
      console.log("Hash atual:", window.location.hash);
      
      // Verificar se AIManagement está disponível
      console.log("AIManagement está disponível para importação:", typeof AIManagement !== 'undefined');
    } catch (error) {
      console.error("Erro no AdminTabs useEffect:", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
    }
  }, []);

  // Use useCallback para prevenir re-renderizações desnecessárias
  const handleTabChange = useCallback((value: string) => {
    console.log("Tab alterada para:", value);
    setActiveTab(value);
  }, []);

  return {
    activeTab,
    hasError,
    errorMessage,
    isClient,
    handleTabChange
  };
};
