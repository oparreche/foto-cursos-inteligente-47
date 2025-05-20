
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
      
      // Define allowed tabs and validate hash
      const allowedTabs = ["ai", "dashboard", "classes", "courses", "blog", "users", "payments"];
      const hashValue = window.location.hash.substring(1);
      console.log("Hash detectado:", hashValue || "(nenhum)");
      
      // Set active tab based on valid hash or default to "dashboard"
      if (hashValue && allowedTabs.includes(hashValue)) {
        console.log(`Tab ${hashValue} selecionada por hash`);
        setActiveTab(hashValue);
      } else {
        console.log("Definindo dashboard como tab padrão");
        setActiveTab("dashboard");
        // Update hash to reflect the default tab if no hash is present
        if (!window.location.hash) {
          window.location.hash = "dashboard";
        }
      }
      
      // Registrar rota atual para depuração
      console.log("Rota atual:", window.location.pathname);
      console.log("Hash final:", window.location.hash);
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
