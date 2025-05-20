
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
      } else if (window.location.hash) {
        // Suporte para outros valores de hash
        const tabFromHash = window.location.hash.substring(1);
        console.log(`Tab ${tabFromHash} selecionada por hash`);
        setActiveTab(tabFromHash);
      }
      
      // Registrar rota atual para depuração
      console.log("Rota atual:", window.location.pathname);
      console.log("Hash atual:", window.location.hash);
      
      // Verificação de componentes sem referência a AIManagement
      console.log("Verificando componentes disponíveis na aplicação");
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
    
    // Atualizar hash na URL para manter a navegação consistente
    window.location.hash = value;
  }, []);

  return {
    activeTab,
    hasError,
    errorMessage,
    isClient,
    handleTabChange
  };
};
