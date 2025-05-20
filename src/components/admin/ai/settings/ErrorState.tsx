
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ErrorState = () => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro ao carregar configurações de IA</AlertTitle>
      <AlertDescription>Ocorreu um erro ao carregar as configurações. Por favor, tente novamente mais tarde.</AlertDescription>
    </Alert>
  );
};

export default ErrorState;
