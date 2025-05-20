
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
        // Se não tiver hash ou se o hash for inválido, use "dashboard"
        setActiveTab("dashboard");
        // Atualiza o hash para refletir a aba padrão se nenhum hash estiver presente
        if (!hashValue) {
          window.location.hash = "dashboard";
        }
      }
      
      // Registrar rota atual para depuração
      console.log("Rota atual:", window.location.pathname);
      console.log("Hash final:", window.location.hash);
      
      // Adicionar evento listener para mudanças de hash
      const handleHashChange = () => {
        const newHash = window.location.hash.substring(1);
        if (newHash && allowedTabs.includes(newHash)) {
          console.log(`Mudança de hash detectada: ${newHash}`);
          setActiveTab(newHash);
        }
      };
      
      window.addEventListener('hashchange', handleHashChange);
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
      
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
    if (window.location.hash.substring(1) !== value) {
      window.location.hash = value;
    }
  }, []);

  return {
    activeTab,
    hasError,
    errorMessage,
    isClient,
    handleTabChange
  };
};
