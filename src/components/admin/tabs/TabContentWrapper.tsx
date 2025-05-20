
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
  }, [label]);
  
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
  
  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`Erro ao renderizar conteúdo da aba ${label}:`, error);
    setHasError(true);
    setErrorMessage(error instanceof Error ? error.message : String(error));
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao renderizar aba {label}
        </AlertDescription>
      </Alert>
    );
  }
};

export default TabContentWrapper;
