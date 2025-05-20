
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useCallback, memo } from "react";

interface AIConfigWarningProps {
  isConfigured: boolean;
}

const AIConfigWarning = memo(({ isConfigured }: AIConfigWarningProps) => {
  useEffect(() => {
    console.log("AIConfigWarning rendered with isConfigured:", isConfigured);
  }, [isConfigured]);

  if (isConfigured) {
    return null;
  }
  
  // Use useCallback to prevent recreating this function on each render
  const handleGoToSettings = useCallback(() => {
    console.log("Navegando para seção de configurações");
    
    // Find the AISettings element directly
    const settingsElement = document.querySelector('[data-testid="ai-settings"]');
    
    if (settingsElement) {
      console.log("Elemento de configurações encontrado, rolando até ele");
      settingsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.log("Elemento de configurações não encontrado, verificando cabeçalho");
      
      // Try finding by heading text as fallback
      const settingsHeading = Array.from(document.querySelectorAll('h2'))
        .find(el => el.textContent?.includes("Configurações de IA"));
      
      if (settingsHeading) {
        console.log("Cabeçalho de configurações encontrado, rolando até ele");
        settingsHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log("Nada encontrado, rolando para o topo");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-2">
        <div>Atenção: As configurações de IA não foram definidas. Por favor, configure as credenciais de IA para usar este recurso.</div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGoToSettings} 
          className="w-fit mt-2"
        >
          Ir para Configurações
        </Button>
      </AlertDescription>
    </Alert>
  );
});

AIConfigWarning.displayName = 'AIConfigWarning';

export default AIConfigWarning;
