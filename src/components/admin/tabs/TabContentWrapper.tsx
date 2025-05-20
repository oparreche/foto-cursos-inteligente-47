
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TabContentWrapperProps {
  children: React.ReactNode;
  label: string;
}

const TabContentWrapper: React.FC<TabContentWrapperProps> = ({ children, label }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    console.log(`TabContent (${label}) montado`);
    
    // Reportar montagem bem-sucedida para diagnóstico
    return () => {
      console.log(`TabContent (${label}) desmontado`);
    };
  }, [label]);
  
  // Função para renderizar o conteúdo com segurança
  const renderSafeContent = () => {
    try {
      return children;
    } catch (error) {
      console.error(`Erro ao renderizar conteúdo da aba ${label}:`, error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      return null;
    }
  };
  
  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar conteúdo da aba {label}: {errorMessage}
        </AlertDescription>
      </Alert>
    );
  }
  
  return <div data-testid={`tab-content-${label.toLowerCase()}`}>{renderSafeContent()}</div>;
};

export default TabContentWrapper;
