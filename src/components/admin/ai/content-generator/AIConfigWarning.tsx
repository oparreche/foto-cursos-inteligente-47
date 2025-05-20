
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AIConfigWarningProps {
  isConfigured: boolean;
}

const AIConfigWarning = ({ isConfigured }: AIConfigWarningProps) => {
  if (isConfigured) {
    return null;
  }
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Atenção: As configurações de IA não foram definidas. Por favor, configure as credenciais de IA para usar este recurso.
      </AlertDescription>
    </Alert>
  );
};

export default AIConfigWarning;
