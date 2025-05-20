
import { memo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAISettings } from "@/hooks/useAISettings";
import ConfigDisplay from "./ConfigDisplay";
import ConfigDialog from "./ConfigDialog";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AISettings = memo(() => {
  const { 
    aiConfig, 
    isLoading, 
    error, 
    saveError,
    isEditDialogOpen, 
    setIsEditDialogOpen,
    handleSaveConfig,
    isUpdating,
    refetch,
    attemptCount
  } = useAISettings();
  
  // Add a memoized retry handler to avoid recreating on every render
  const handleRetry = useCallback(() => {
    console.log("Tentando novamente carregar configurações...");
    if (refetch) refetch();
  }, [refetch]);
  
  // Use a handler function for opening the dialog to avoid inline functions
  const openEditDialog = useCallback(() => {
    console.log("Abrindo diálogo de edição");
    setIsEditDialogOpen(true);
  }, [setIsEditDialogOpen]);
  
  console.log("AISettings rendering with state:", { 
    hasConfig: !!aiConfig, 
    isLoading, 
    hasError: !!error,
    hasSaveError: !!saveError,
    dialogOpen: isEditDialogOpen,
    updateCount: attemptCount
  });
  
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
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleRetry}
              >
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
        <Button onClick={openEditDialog} disabled={isUpdating}>
          {isUpdating ? 'Salvando...' : 'Editar Configurações'}
        </Button>
        
        {isUpdating && attemptCount > 1 && (
          <p className="ml-3 text-sm text-yellow-600">
            Aguarde, operação em andamento...
          </p>
        )}
      </CardFooter>
      
      <ConfigDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        aiConfig={aiConfig}
        onSave={handleSaveConfig}
        isUpdating={isUpdating}
        saveError={saveError}
      />
    </Card>
  );
});

AISettings.displayName = 'AISettings';

export default AISettings;
