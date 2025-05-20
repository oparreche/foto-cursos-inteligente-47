
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIConfigWarningProps {
  isConfigured: boolean;
}

const AIConfigWarning = ({ isConfigured }: AIConfigWarningProps) => {
  if (isConfigured) {
    return null;
  }
  
  const handleGoToSettings = () => {
    // Encontra a tab de configurações e clica nela
    const settingsTabElement = document.querySelector('[data-value="settings"]');
    if (settingsTabElement instanceof HTMLElement) {
      settingsTabElement.click();
    } else {
      console.log("Elemento de configurações não encontrado");
      // Backup - scroll para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-2">
        <div>Atenção: As configurações de IA não foram definidas. Por favor, configure as credenciais de IA para usar este recurso.</div>
        <Button variant="outline" size="sm" onClick={handleGoToSettings} className="w-fit mt-2">
          Ir para Configurações
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default AIConfigWarning;
