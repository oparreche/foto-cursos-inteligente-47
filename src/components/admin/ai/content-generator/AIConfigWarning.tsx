
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
    console.log("Tentando encontrar e clicar na tab de configurações");
    const settingsTabElement = document.querySelector('[data-value="ai"]');
    if (settingsTabElement instanceof HTMLElement) {
      console.log("Tab de IA encontrada, clicando nela");
      settingsTabElement.click();
      
      // Rolando até a seção de configurações após selecionar a tab de IA
      setTimeout(() => {
        const configSection = document.querySelector('h2:contains("Configurações de IA")');
        if (configSection) {
          console.log("Seção de configurações encontrada, rolando até ela");
          configSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log("Seção de configurações não encontrada");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 200);
    } else {
      console.log("Tab de IA não encontrada");
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
