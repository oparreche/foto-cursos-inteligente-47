
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAISettings } from "@/hooks/useAISettings";
import ConfigDisplay from "./ConfigDisplay";
import ConfigDialog from "./ConfigDialog";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

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
  
  const handleRetry = () => {
    console.log("Tentando novamente...");
    refetch();
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }
  
  return (
    <Card>
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
