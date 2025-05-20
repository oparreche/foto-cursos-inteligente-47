
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
  
  const handleGoToSettings = () => {
    console.log("Tentando encontrar e rolar até a seção de configurações");
    
    // Find and select the AI tab first if not already selected
    const aiTab = document.querySelector('[data-value="ai"]');
    if (aiTab instanceof HTMLElement) {
      console.log("Tab de IA encontrada, clicando nela");
      aiTab.click();
      
      // After a small delay to ensure the tab content is rendered
      setTimeout(() => {
        // Find the settings section heading
        const settingsHeading = Array.from(document.querySelectorAll('h2'))
          .find(el => el.textContent?.includes("Configurações de IA"));
        
        if (settingsHeading) {
          console.log("Seção de configurações encontrada, rolando até ela");
          settingsHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.log("Seção de configurações não encontrada, rolando para o topo");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 300);
    } else {
      console.log("Tab de IA não encontrada, rolando para o topo");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
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
