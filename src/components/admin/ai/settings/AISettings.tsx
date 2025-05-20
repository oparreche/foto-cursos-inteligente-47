
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAISettings } from "@/hooks/useAISettings";
import ConfigDisplay from "./ConfigDisplay";
import ConfigDialog from "./ConfigDialog";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AISettings = () => {
  const { 
    aiConfig, 
    isLoading, 
    error, 
    isEditDialogOpen, 
    setIsEditDialogOpen,
    handleSaveConfig,
    isUpdating,
    refetch
  } = useAISettings();
  
  // Add debugging logs
  useEffect(() => {
    console.log("AISettings - Estado atual:", { 
      temConfiguracao: !!aiConfig, 
      isLoading, 
      temErro: !!error 
    });
  }, [aiConfig, isLoading, error]);
  
  const handleRetry = () => {
    console.log("Tentando novamente...");
    if (refetch) refetch();
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }
  
  // Add an extra validation check
  if (!aiConfig) {
    return (
      <Card data-testid="ai-settings-no-config">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível carregar as configurações de IA. Verifique sua conexão com o banco de dados.
              <Button variant="outline" size="sm" onClick={handleRetry} className="mt-2">
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card data-testid="ai-settings">
      <CardHeader>
        <CardTitle>Configurações de IA</CardTitle>
        <CardDescription>Configure o serviço de inteligência artificial para geração de conteúdo</CardDescription>
      </CardHeader>
      <CardContent>
        <ConfigDisplay aiConfig={aiConfig} />
      </CardContent>
      <CardFooter>
        <Button onClick={() => setIsEditDialogOpen(true)}>Editar Configurações</Button>
      </CardFooter>
      
      <ConfigDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        aiConfig={aiConfig}
        onSave={handleSaveConfig}
        isUpdating={isUpdating}
      />
    </Card>
  );
};

export default AISettings;
